var tl = require('vsts-task-lib');

var appID = tl.getInput("appID", true);
var apiToken = tl.getInput("apiToken", true);
var installPackage = tl.getInput("installPackage", false);
var buildNumber = tl.getVariable("Build.BuildNumber");

console.log("Build Number: " + buildNumber);
console.log("Install Package: " + installPackage);

var request = require('request');

var options = {
  url: "https://rink.hockeyapp.net/api/2/apps/" + appID + "/app_versions",
  headers: {
    "X-HockeyAppToken": apiToken
  }
};

var nextVersion = 1;

request(options, function (error, response, body) {
   if (!error && response.statusCode == 200) {
	  var options = {
		url: "https://rink.hockeyapp.net/api/2/apps/" + appID + "/app_versions/new",
		headers: {
		  "X-HockeyAppToken": apiToken
		},
		form:  { bundle_version: buildNumber }
	  };

	  request(options, function (error, response, body) {
		if (!error) {
			console.log("Response: " + body);
			var response = JSON.parse(body);
			
			var fs = require("fs");
      var glob = require("glob");
      
      glob(installPackage, function(err,files){
        if (err) throw err;
        var item = files[0];
        
        var req = request.put({ url: "https://rink.hockeyapp.net/api/2/apps/" + appID + "/app_versions/" + response.id, headers: {"X-HockeyAppToken": apiToken }}, 
			    function (error, response, body) {
				  console.log(body);
        })
        
        console.log(item + " found");
        var form = req.form();
        form.append('ipa', fs.createReadStream(item));
        form.append('status', 2);
        form.append('notify', 1);        
      });
		}
	  })  
   }
})





