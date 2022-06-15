# UI for Netdata Dashboard and Cloud Charts

## Available Scripts

### `npm run start:dashboard`

Starts dashboard in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
Make sure Netdata is running under [http://localhost:19999](https://localhost:19999).

> If your Netdata is running on a remote host you need to create an SSH tunnel to the host
> `ssh -L 127.0.0.1:19999:127.0.0.1:19999 NODE`.


### `npm run start:node-view`
Starts app with only Node-View component running. This is used to develop the component for Cloud purposes.

### `npm run start:tv`
Starts app with tv.html, as a static (custom) dashboard in dev mode.

### `npm test`

Launches the test runner in the interactive watch mode.<br>

### `npm run lint`

Runs a linter check. The same task is run in GH Actions pipeline.

### `npm run build`

Builds the dashboard for production to the `build` folder.<br>
It bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
