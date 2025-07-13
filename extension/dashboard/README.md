# GHA Dashboard extension

This is a port of the GHA Dashboard to a chrome extension. 
The extension's logic injects the code into github repo pages to add a new tab

## To make it work
- add a ".env" file in the root folder of the dashboard code
    - path of the file starting from root folder of the whole project  should look like this:
        - ./extension/dashboard/.env
- add a parameter named "VITE_SECRET_KEY" and set its value to an arbitrary value

