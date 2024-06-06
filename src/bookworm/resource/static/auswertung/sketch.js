function setup() {
    getData();
}

function getData() {
    askBackend("/getAllData", {}, (data) => {
        console.log(data);
        auswertung(data['data'][0], data['data'][1]);
    });
}