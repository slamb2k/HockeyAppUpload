# HockeyAppUpload

Upload any binary to HockeyApp for distribution. As the available HockeyApp release tasks only support Android and iOS packages a custom build task needed to be written to enable a scenario where a WinForms application is distributed as an MSI.

## Implementation

In order to support all available types of build agents whether private or hosted a NodeJS build task was created. The [VSTS DevOps Task SDK](https://github.com/Microsoft/vsts-task-lib) was used to create this custom build task.

The build task takes four input parameters:

1. The App ID from HockeyApp
2. The API Token for HockeyApp
3. The location of the binary file to deploy. In this case an MSI
4. The location of a file to include for release notes to show in HockeyApp.

The build task is created using the [tfx-cli](https://github.com/Microsoft/tfs-cli) which is installed using npm.

![Image of tfx](/images/tfx.png)

**tfx build tasks create** was used to scaffold the tasks and then the NodeJS code was written to release the binary to the HockeyApp API.

The build task was then uploaded to VSTS using **tfx build tasks upload** and was available to be added to release definitions. 

For the customer a release definition was created and two environments were added to represent a test environment for internal distribution and a production environment for the final release. These environments were represented on HockeyApp as two applications. Upon release, an email would be sent to users assigned to these applications in HockeyApp and a download page would allow the manual retrieval of the release. The customer used another Powershell script to access the HockeyApp API and download the application as part of an automated process for deployment.

![Image of tfx](/images/hockeyappreleasedefinition.png)

Once this was release definition was in place a CI build would automatically trigger on each commit and upon successful build a CD release would occur to the Test environment in HockeyApp. An approval email would fire to the team to approve the release to production. Once the build was tested this could be approved and the same build would be released to the Production environment. This release management pipeline could be visualised on a dashboard in Visual Studio Team Services like so:

![Image of tfx](/images/hockeyappdashboard.png)

When the application was released to Hockey app the inclusion of release notes would show these on the manual download page:

![Image of tfx](/images/hockeyappdownload.png)

