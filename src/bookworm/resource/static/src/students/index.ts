function startup() {
    edom.init();
    initUI();
}

function initUI() {
    edom.fromTemplate([new hello().instructions()], edom.body);
}