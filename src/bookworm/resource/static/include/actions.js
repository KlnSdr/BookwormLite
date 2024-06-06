const {
    ipcRenderer
} = require('electron');

function askBackend(route, data, callback) {
    ipcRenderer.once("answer", (event, arg) => {
        callback(arg);
    });

    ipcRenderer.send(route, data);
}

function startup() {
    document.addEventListener("keydown", function (e) {
        if (e.which === 123) {
            require('electron').remote.getCurrentWindow().toggleDevTools();
        } else if (e.which === 116) {
            location.reload();
        }
    });
}