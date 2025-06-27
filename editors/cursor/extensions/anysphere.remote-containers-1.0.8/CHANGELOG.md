# Cursor Remote Containers Changelog

## 1.0.8
- Fix a bug where custom Docker paths were not passed through when calling the Dev Containers CLI
- Support Dev Containers in WSL (Requires Anysphere Remote WSL 1.0.4+)

## 1.0.7
- Fix an issue where the `Dev Containers` view and `Open Folder in Container` command always used the local docker runtime, even when connected
  to an SSH environment
- When selecting a devcontainer, show the name (if set), in addition to the filepath
- Add support for switching containers when there are multiple devcontainer files in the same workspace

## v1.0.6
- Stream logs for long-running commands
- Support log levels for the "Remote - Dev Containers" output console
- Fix an issue where the Dev Containers view in the Remote Explorer would hang forever if Docker was not installed

## v1.0.5
- Lower resource utilization with Docker port forwarding
- Add commands to rebuild the devcontainer with or without the Docker cache
- Fix an issue where reinstalling the remote server over SSH reloaded the window without actually reinstalling the server
- Fix an issue where the "Attach to Running Container..." command did not show up in the context menu when using the new MS Containers plugin

## v1.0.4
- Fix an issue where the forwarder processes live after containers stop
- Fix an issue where the "Reopen in Container" option didn't allow for devcontainer files in nested directories
- Fix an issue where port forwarding with host networking could cause the port to be occupied when reopening a window

## v1.0.3
- Add remote connection commands to the "Open in Remote Window" selector

## v1.0.2
- Use separate processes to connect to the remote server to reduce the load on the local extension host.
  When using Remote Containers over SSH, requires Anysphere Remote SSH version 1.0.2 or greater.

## v1.0.1
- Fix JSON parse errors with old versions of Docker.

## v1.0.0
- Simplified README

## v0.0.12
- Add support for Alpine linux remote extension hosts. Requires version 0.50.5+ of Cursor.

## v0.0.11

- Install the extensions from the `devcontainer.json`, if specified in `customizations.vscode.extensions`
- Pre-configure the settings from the `devcontainer.json`, if specified in `customizations.vscode.settings`
- Default to the user of the DOCKERFILE or the default user, rather than `root`
- Execute the `postStartCommand` and `postCreateCommand`, as appropriate
- If running locally, avoid copying the `devContainersSpecCLI.js` to a temporary location

## v0.0.10

- Added support for connecting to containers through remote hosts via SSH. Requires `anysphere.remote-ssh` version >= 0.0.27

## v0.0.9

- Added support for port forwarding
- Added support for attaching to pods running in Kubernetes clusters (via `kubectl`)
- Added right-click menu option "Attach Cursor..." inside the Docker and Kubernetes container views


## v0.0.8

- Added prompt to reinstall the server on failed connections
- Added Kill Server and Reload Window Command
- Added Reinstall Server and Reload Window Command
- Added cleanup of old server binaries to after the new server successfully launches

## v0.0.7

- Added telemetry (enabled when privacy mode is disabled)
