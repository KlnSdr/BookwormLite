options = ['kaufen', 'leihen', 'vorhanden', 'nicht benötigt'];

let klassenStufe = NaN;
let leihgebuhr = NaN;

let boxName = 0;

let currentBoxes = [];

let tmp = '';
let opening = false;

let classes = ['a', 'b', 'c', 'd', 'e', 'G'];

var globalStudentID = NaN;

ipcRenderer.on('menuEvent', (event, arg) => {
    if (arg == 'new') {
        newStudent();
    } else if (arg == 'open') {
        console.log('test');
        openStudentSelection();
    }
});

function setup() {
    document.getElementsByName('klassenStufe').forEach(
        (radio) =>
            (radio.onchange = function () {
                klassenStufe = parseInt(radio.id);
                console.log(radio.id + ' changed');
                document.getElementById('lblKlassenstufe').style =
                    'color: black;';
                reloadInformation();
            })
    );

    document.getElementsByName('leihgebuhr').forEach(
        (radio) =>
            (radio.onchange = function () {
                leihgebuhr = parseInt(radio.id);
                console.log('Leihgebür: ' + radio.id);
                document.getElementById('lblLeihgebuhr').style =
                    'color: black;';
                calculate();
            })
    );

    document.getElementById('checkGem').onchange = function () {
        let dropdown = document.getElementById('selectZusatz');
        dropdown.innerHTML = '';

        let start = 0;

        if (this.checked) {
            document.getElementById('11').disabled = true;
            document.getElementById('12').disabled = true;

            if (klassenStufe == 11 || klassenStufe == 12) {
                document.getElementById(
                    klassenStufe.toString()
                ).checked = false;
                klassenStufe = NaN;
            }

            start = 3;
        } else {
            document.getElementById('11').disabled = false;
            document.getElementById('12').disabled = false;
        }

        for (let i = start; i < start + 3; i++) {
            let option = document.createElement('option');
            option.value = classes[i];
            option.appendChild(document.createTextNode(classes[i]));
            dropdown.appendChild(option);
        }

        reloadInformation();
    };

    document.getElementById('inputName').oninput = function () {
        if (this.value != '') {
            document.getElementById('lblName').style = 'color: black;';
        }
    };
    document.addEventListener('keydown', doc_keyUp, false);

    document.getElementById('checkGem').onchange();
}

function doc_keyUp(e) {
    if (e.ctrlKey && e.altKey && e.keyCode == 78) {
        newStudent();
        closeStudentSelection();
    } else if (e.ctrlKey && e.altKey && e.keyCode == 79) {
        openStudentSelection();
    }
}

function save() {
    if (check()) {
        console.log('check passed');

        let personalData = new Object();
        personalData['name'] = document.getElementById('inputName').value;
        personalData['id'] = isNaN(globalStudentID)
            ? undefined
            : globalStudentID;
        personalData['grade'] = klassenStufe.toString();
        personalData['zusatz'] = document.getElementById('selectZusatz').value;
        personalData['isgem'] = document
            .getElementById('checkGem')
            .checked.toString();
        personalData['leihgebuhr'] = leihgebuhr.toString();
        personalData['zusatzGebuhr'] =
            document.getElementById('inputZusatzGeb').value;
        personalData['EBook'] = document.getElementById('inputEBook').value;

        let bookData = new Object();

        currentBoxes.forEach((book) => {
            bookData[book.id.toString()] = book.value.toString();
        });

        console.log(JSON.stringify(personalData));
        console.log(JSON.stringify(bookData));

        // $.askBackend('save.php', {
        //     person: JSON.stringify(personalData),
        //     books: JSON.stringify(bookData)
        // }, function (data) {
        //     let json = JSON.parse(data);
        //     if (json.success = "true") {
        //         document.getElementById("inputName").value = "";
        //         reloadInformation();
        //     } else {

        //     }
        // });

        askBackend(
            '/save',
            {
                person: JSON.stringify(personalData),
                books: JSON.stringify(bookData),
            },
            (data) => {
                if ((data.success = 'true')) {
                    document.getElementById('inputName').value = '';
                    document.getElementById('inputZusatzGeb').value = '';
                    document.getElementById('inputEBook').value = '';
                    reloadInformation();
                } else {
                }
            }
        );
    } else {
        console.log('something is wrong');
    }
}

function open(ID) {
    // $.askBackend('open.php', {
    //     id: ID
    // }, function (data) {
    //     closeStudentSelection();

    //     continueProcess = false;

    //     let jsonPerson = JSON.parse(data);

    //     tmp = jsonPerson.books;
    //     opening = true;
    //     document.getElementById("inputName").value = jsonPerson.name;
    //     document.getElementById("lblName").style = "color: black;";
    //     document.getElementById(jsonPerson.grade).checked = true;
    //     klassenStufe = jsonPerson.grade;
    //     document.getElementById("checkGem").checked = (jsonPerson.isgem === "true") ? true : false;
    //     document.getElementById("checkGem").onchange();
    //     document.getElementById(jsonPerson.leihgebuhr).checked = true;
    //     document.getElementById(jsonPerson.leihgebuhr).onchange();
    //     document.getElementById("selectZusatz").value = jsonPerson.zusatz;
    // });

    askBackend(
        '/open',
        {
            id: ID,
        },
        (data) => {
            closeStudentSelection();

            continueProcess = false;

            let jsonPerson = data.res;

            tmp = jsonPerson.books.replace(/'/g, '"').replace(/;/g, ',');
            opening = true;
            document.getElementById('inputName').value = jsonPerson.name;
            document.getElementById('lblName').style = 'color: black;';
            document.getElementById(jsonPerson.grade).checked = true;
            klassenStufe = jsonPerson.grade;
            document.getElementById('checkGem').checked =
                jsonPerson.isgem === 'true' ? true : false;
            document.getElementById('checkGem').onchange();
            document.getElementById(jsonPerson.leihgebuhr).checked = true;
            document.getElementById(jsonPerson.leihgebuhr).onchange();
            document.getElementById('selectZusatz').value = jsonPerson.zusatz;
            if (jsonPerson.zusatzGebuhr != undefined) {
                document.getElementById('inputZusatzGeb').value =
                    jsonPerson.zusatzGebuhr;
            } else {
                document.getElementById('inputZusatzGeb').value = '0.00';
            }

            if (jsonPerson.EBook != undefined) {
                document.getElementById('inputEBook').value = jsonPerson.EBook;
            } else {
                document.getElementById('inputEBook').value = '0.00';
            }

            globalStudentID = jsonPerson.id;
        }
    );
}

function check() {
    let ret = true;

    currentBoxes.forEach((bx) => {
        bx.reset();
        if (Number.isNaN(bx.value)) {
            bx.colorize();
            ret = false;
        }
    });

    if (Number.isNaN(klassenStufe)) {
        ret = false;
        document.getElementById('lblKlassenstufe').style = 'color: red;';
    }

    if (document.getElementById('inputName').value == '') {
        ret = false;
        document.getElementById('lblName').style = 'color: red;';
    } else {
        document.getElementById('lblName').style = 'color: black;';
    }

    if (Number.isNaN(leihgebuhr)) {
        ret = false;
        document.getElementById('lblLeihgebuhr').style = 'color: red;';
    }

    return ret;
}

function calculate() {
    let leih = 0.0;
    let kauf = 0.0;

    currentBoxes.forEach((BOX) => {
        if (!Number.isNaN(BOX.value)) {
            if (BOX.value == 0) {
                kauf += parseFloat(BOX.price);
            } else if (BOX.value == 1) {
                if (BOX.lgBerechnen === true) {
                    leih += parseFloat(leihgebuhr);
                }
            }
        }
    });

    var zusatzlicheGebuhren = 0.0;
    if (document.getElementById('inputZusatzGeb').value !== '') {
        zusatzlicheGebuhren = parseFloat(
            parseFloat(document.getElementById('inputZusatzGeb').value).toFixed(
                2
            )
        );
    }

    var EBook = 0.0;
    if (document.getElementById('inputEBook').value !== '') {
        EBook = parseFloat(
            parseFloat(document.getElementById('inputEBook').value).toFixed(2)
        );
    }

    document.getElementById('outKauf').innerHTML = kauf.toFixed(2) + '€';
    document.getElementById('outLeih').innerHTML = leih.toFixed(2) + '€';
    document.getElementById('outGesamt').innerHTML =
        (
            parseFloat(leih) +
            parseFloat(kauf) +
            zusatzlicheGebuhren +
            EBook
        ).toFixed(2) + '€';
}

function reloadInformation() {
    document.getElementById('containerBoxes').innerHTML = '';
    currentBoxes = [];
    calculate();

    globalStudentID = NaN;

    // $.askBackend('getBooks.php', {
    //     grade: klassenStufe,
    //     isgem: document.getElementById("checkGem").checked.toString()
    // }, function (data) {
    //     let json = JSON.parse(data);

    //     for (let i = 0; i < json.length; i++) {
    //         let bx = new box(json[i].name, json[i].price, json[i].id);
    //     }

    //     if (opening) {
    //         let books = JSON.parse(tmp);

    //         currentBoxes.forEach(box => {
    //             box.set(books[box.id.toString()]);
    //         });

    //         calculate();

    //         opening = false;
    //         tmp = "";
    //     }
    // });

    askBackend(
        '/getBooks',
        {
            grade: klassenStufe,
            isgem: document.getElementById('checkGem').checked.toString(),
        },
        (data) => {
            console.log(data);
            // let json = JSON.parse(data);
            let json = data.res;

            for (let i = 0; i < json.length; i++) {
                let bx = new box(
                    json[i].name,
                    json[i].price,
                    json[i].id,
                    json[i].leihberechnen
                );
            }

            if (opening) {
                let books = JSON.parse(tmp);

                currentBoxes.forEach((box) => {
                    box.set(books[box.id.toString()]);
                });

                calculate();

                opening = false;
                tmp = '';
            }
        }
    );
}

function newStudent() {
    document.getElementById('inputName').value = '';
    document.getElementById('inputZusatzGeb').value = '0.00';
    document.getElementById('inputEBook').value = '0.00';
    reloadInformation();
}
