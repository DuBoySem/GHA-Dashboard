# GHA Extension

This is a chrome extension used to analyze workflow metrics.

It injects a react Dashboard directly in the github repo pages.

## Strucutre
The extension uses a react app for the dashboard and a background script to communicate with the backend

The logic of displaying the dashboard or not resides in the extension's src/ folder
The logic of the Metrics displayed resides in the dashboard/ folder

### Webpack
In order for the extension to work, bundling via webpack is needed.
Webpack will bundle all necessary files at once and copy the standalone extension files, for example, background.js and content.js.

#### Build output
the bundled project will be in the dist/ folder and has everything needed for the extension to work.
the dist/ folder is the folder to load in chrome to use the extension

## Make it work

1. cd to the extension/ folder
2. run "npm install"
3. run npm run build"
4. go to chrome browser and make sur develloper mode is enabled
5. go to chrome extensions page
6. load the dist folder
7. go to a public repo page or a repo you have access to
8. click the new tab named "Dashboard"
9. enter informations needed
10. make sure a backend is running
    - cd to extension/ folder if not yet in it
    - run "npm run backend"
11. click the "Generate Dashboard" button


### Actions that reduce risks of errors

- make sur the extension is loaded in the browser before the server starts running.

## Known issues

1. no response from the Dashboard
    - will have a context error in console
    - no fix available
    - reason of issue unknown yet

    - when encoutering it:
        - stop backend
        - refresh page where Dashboard is injected and visible
        - accept closing the connection if asked to
        - delete extension from brower
        - reload extension
        - start backend 


