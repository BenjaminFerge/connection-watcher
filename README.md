# connection-watcher
HTTP service and internet connection watcher library

- [connection-watcher](#connection-watcher)
  - [1. Installation](#1-installation)
    - [npm](#npm)
    - [Manual Download](#manual-download)
  - [2. Usage](#2-usage)
    - [1. Include the script](#1-include-the-script)
    - [2. Initialize the module](#2-initialize-the-module)
    - [3. Start watchers](#3-start-watchers)

## 1. Installation
### npm
```
npm i connection-watcher
```
Copy `node_modules/connection-watcher/dist/connection-watcher.min.js` to the web server's public folder or use some tool for it (eg. Webpack).

### Manual Download
Download [connection-watcher.min.js](./dist/connection-watcher.min.js) to the right place.
```
wget https://raw.githubusercontent.com/BenjaminFerge/connection-watcher/master/dist/connection-watcher.min.js
```

## 2. Usage
### 1. Include the script
```html
<script src="connection-watcher.min.js"></script>
```
### 2. Initialize the module

The module is accessible from the window object:
```js
var connWatcher = window.connectionWatcher;
```
We need the options object that specifies the `network event handlers` and the `connection watchers`.


```js
var options = {
    // Network event handlers
    onConnectionOpened: event => {
        console.log("Internet connection OPENED", event);
    },
    onConnectionClosed: event => {
        console.log("Internet connection CLOSED", event);
    },
    // Connection watchers
    connections: {
        lan: {
            url: "http://localhost:8080/examples",
            // Optionally you can provide fetchOptions, which is the same as the ES6 fetch parameters.
            fetchOptions: {
                method: "GET",
                mode: "same-origin",
                cache: "no-cache",
                redirect: "follow"
            },
            interval: 1000, // in ms (1 sec)
            onClosed: (report) => {
                console.log("LAN connection is DEAD. Details:", report);
            },
            onOpened: (report) => {
                console.log("LAN connection is ALIVE. Details:", report);
            }
        },
        conn1: {
            url: "http://localhost:8080/non-existing-url1.hu",
            interval: 2500,
            onClosed: (report) => {
                console.log("CONN1 connection is DEAD. Details:", report);
            },
            onOpened: (report) => {
                console.log("CONN1 connection is ALIVE. Details:", report);
            }
        }
        //, ...
    }
};
// Finally the initialization.
connWatcher.init(options);
```
### 3. Start watchers

```js
connWatcher.startAll();
```

See the [example html](./examples/index.html) for more details.

To run the example:

```sh
git clone https://github.com/BenjaminFerge/connection-watcher && \
cd connection-watcher && \
php -S localhost:8080 # run some local web server
```
...and visit: [http://localhost:8080](http://localhost:8080)

License: [MIT](./LICENSE)