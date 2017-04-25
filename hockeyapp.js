var tl = require('vso-task-lib');

var appID = tl.getInput("HockeyAppAppID", true); // HockeyApp App ID
var apiToken = tl.getInput("HockeyAppApiToken", true); // HockeyApp API Token
var installPackage = tl.getInput("InstallPackage", false); // The setup package or application being uploaded to HockeyApp
var releaseNotes = tl.getInput("ReleaseNotes", false) // The path to a file in the build that contains the release notes

var version = tl.getVariable("Build.BuildNumber"); // The version number of the pacakage determined by the VSTS build number

console.log("HockeyApp Package: " + appID);
console.log("Install Package: " + installPackage);
console.log("Version: " + version);

var request = require('request');

// New version creation on HockeyApp
console.log("Creating new version on HockeyApp for App: " + appID);
var create_url = "https://rink.hockeyapp.net/api/2/apps/" + appID + "/app_versions/new";

var options = {
  url: create_url,
  headers: {
    "X-HockeyAppToken": apiToken
  },
  form: { bundle_version: version }
};

request(options, function (error, response, body) {
  if (!error) {
    console.log("Response: " + body);

    // Parse the response so we can get the id of the new version
    var newVersionResponse = JSON.parse(body);

    var fs = require("fs");
    var glob = require("glob");

    // Upload package matching
    console.log("Finding file matching pattern: " + installPackage);

    glob(installPackage, function (err, files) {
      if (err) throw err;

      // Just grab the first file matching the pattern
      var item = files[0];

      // Use the new app version created in HockeyApp to construct the update PUT url
      var appVersion = newVersionResponse.id
      console.log("App Version: " + appVersion);
      console.log("Uploading matching file: " + item);
      var update_url = "https://rink.hockeyapp.net/api/2/apps/" + appID + "/app_versions/" + appVersion

      // Create the PUT request
      var req = request.put({ url: update_url, headers: { "X-HockeyAppToken": apiToken } },
        function (error, response, body) {
          console.log("Response: " + body);
        })

      // Read the file as a stream it as form data to the request
      var form = req.form();
      form.append('ipa', fs.createReadStream(item));
      form.append('status', 2);
      form.append('notify', 1);

      // If there are release notes then add them to the post data
      if (releaseNotes != "") {
        form.append('notes', fs.createReadStream(releaseNotes))
        form.append('notes_type', 1);
      }
    });
  }
})





