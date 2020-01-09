"use strict";

const results = {};
const watchers = {};
let OPTIONS = {};

function createReport(ok, lastResponse) {
    return {
        ok,
        lastResponse,
        timestamp: +new Date
    };
}

async function checkConn(connId, url, fetchOptions, openedCb, closedCb) {
    return await fetch(url, fetchOptions)
        .then(response => {
            if (response.ok) { // Fetch succeed
                if (!results[connId] || !results[connId].ok) { // Status changed
                    const obj = createReport(true, response);
                    openedCb(obj);
                    return obj;
                } else {
                    return results[connId];
                }
            }
            // Fetch failed
            if (!results[connId] || results[connId].ok) { // Status changed
                const obj = createReport(false, response);
                closedCb(obj);
                return obj;
            } else {
                return results[connId];
            }
        })
        .catch(err => {
            // Fetch failed
            if (!results[connId] || results[connId].ok) { // Status changed
                const obj = createReport(false, err);
                closedCb(obj)
                return obj;
            } else {
                return results[connId];
            }
        });
}

function setWatcher(id, conn) {
    const {onOpened, onClosed, interval, url, fetchOptions} = conn;
    const watcher = () => {
        checkConn(id, url, fetchOptions, onOpened, onClosed)
        .then(res => {
            results[id] = {
                ...res,
                
            }
        });
    }
    const watcherId = window.setInterval(watcher, interval);
    watchers[id] = watcherId;
}

function getResults() {
    return results;
}

function stopById(id) {
    window.clearInterval(id);
}

function stopByConnectionId(id) {
    const watcherId = watchers[id];
    stopById(watcherId);
    delete watchers[id];
}

function stopAll() {
    Object.keys(watchers).forEach(id => stopByConnectionId(id));
}

function init(options) {
    OPTIONS = options;
    const {onConnectionOpened, onConnectionClosed} = options;

    window.addEventListener('online',  onConnectionOpened);
    window.addEventListener('offline', onConnectionClosed);
}

function startAll() {
    const {connections} = OPTIONS;

    Object.keys(connections).forEach(id => {
        const conn = connections[id];
        setWatcher(id, conn);
    })
}

module.exports = {
    init,
    stopByConnectionId,
    stopById,
    stopAll,
    startAll,
    getResults
};