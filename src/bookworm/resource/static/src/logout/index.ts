function startup() {
    edom.init();
    initUI();
}

function initUI() {
    edom.fromTemplate([new redirect().instructions()], edom.body);
}