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

![Image of tfx](https://github.com/slamb2k/HockeyAppUpload/images/tfx.png)

