// TODO für funktiongesteuertes neuladen "merken", welche Reiter ausgeklappt waren
//      jeden Reiter in einem Object speichern mit Wert true -> ausgeklappt & false -> zugeklappt
//      beim laden mit namen (= key) abgleichen und entsprechend klappen
//      zum entsprechenden reiter scrollen

// TODO Daten in den Tabellen ändern können, danach neuladen -> siehe oben oder daten in db speichern und lokal neu laden bzw. einzelne Zellen ändern

let students = {
    gym: {
        data: {},
    },
    gs: {
        data: {},
    },
};

let options = ['gym', 'gs'];
let allBooks = {};
let ipcArg = {};

ipcRenderer.on('menuEvent', (event, arg) => {
    if (arg.cmd == 'exportBetraege' || arg.cmd == 'exportAll') {
        ipcArg = arg;
        openSelectBox();
    }
});

function preExport() {
    closeEditor();
    removeUnwanted();
    if (ipcArg.cmd == 'exportBetraege' || ipcArg.cmd == 'exportAll') {
        Array.from(document.getElementsByTagName('details')).forEach(
            (element) => {
                if (element.parentElement.id === 'outputGym') {
                    if (!killHim_Gym.includes(element.innerText)) {
                        element.remove();
                    }
                } else if (element.parentElement.id === 'outputGS') {
                    if (!killHim_Gs.includes(element.innerText)) {
                        element.remove();
                    }
                }

                if (element.innerText === 'Bücher' || element.tagName === 'P') {
                    element.remove();
                } else {
                    if (!element.children[0].innerText.includes('Klasse')) {
                        element.children[0].innerText = '';
                    }
                    element.open = true;
                }
            }
        );

        Array.from(document.getElementsByTagName('p')).forEach((paragraph) => {
            paragraph.remove();
        });

        if (ipcArg.cmd == 'exportBetraege') {
            const whitelist = [
                'Name',
                'Zusatz',
                'Kauf',
                'Leih',
                'online',
                'Rechn.',
                'Gesamt',
                'Unterschrift',
                '',
            ];

            Array.from(document.getElementsByTagName('th')).forEach((th) => {
                if (!whitelist.includes(th.textContent)) {
                    th.remove();
                } else if (th.textContent == '') {
                    th.textContent = 'Zusatz';
                }
            });

            const blacklist = ['K', 'L', 'V', 'nb', ''];

            Array.from(document.getElementsByTagName('td')).forEach((td) => {
                if (blacklist.includes(td.textContent)) {
                    td.remove();
                }
            });
        }

        askBackend(
            'export',
            {
                fileType: ipcArg.fileType,
                exportData: ipcArg.fileType === 'csv' ? prepCSVData() : {},
            },
            (data) => {
                if (data.abort == false) {
                    if (data.success == true) {
                        alert('Daten erfolgreich exportiert.');
                    } else {
                        alert('Es ist ein Fehler aufgetreten');
                    }
                }

                reloadView();
            }
        );
    }
}

function prepCSVData() {
    let exportData = {};
    let pointer = '';

    Array.from(document.getElementsByTagName('details')).forEach((element) => {
        if (element.children[0].innerText === '') {
            const tbl = element.children[1];
            Array.from(tbl.children).forEach((row) => {
                let line = [];
                Array.from(row.children).forEach((column) => {
                    if (
                        line.length === 1 &&
                        line[0] === 'Name' &&
                        column.innerText === ''
                    ) {
                        line.push('Zusatz');
                    } else {
                        line.push(column.innerText.replace('.', ','));
                    }
                });
                exportData[pointer].push(line.join(';'));
            });
        } else {
            pointer = element.children[0].innerText;
            exportData[pointer] = [];
        }
    });
    return exportData;
}

function reloadView() {
    document.getElementById('containerOutput').innerHTML =
        '<div id="output"><div id="outputGeneral"></div><div id="outputGym"><h1>Gymnasium</h1></div><div id="outputGS"><h1>Gemeinschaftsschule</h1></div></div><div id="generatedOutput"></div>';
    students = {
        gym: {
            data: {},
        },
        gs: {
            data: {},
        },
    };
    allBooks = {};
    setup();
}

function auswertung(dataStudents, dataBooks) {
    for (let j = 0; j < dataBooks.length; j++) {
        allBooks[dataBooks[j].id] = dataBooks[j];
    }
    //===================================================================================
    for (let i = 0; i < dataStudents.length; i++) {
        if (dataStudents[i].isgem == 'true') {
            if (students.gs[parseInt(dataStudents[i]['grade'])] != undefined) {
                students.gs[parseInt(dataStudents[i]['grade'])].push(
                    dataStudents[i]
                );
            } else {
                students.gs[parseInt(dataStudents[i]['grade'])] = [
                    dataStudents[i],
                ];
            }
        } else {
            if (students.gym[parseInt(dataStudents[i]['grade'])] != undefined) {
                students.gym[parseInt(dataStudents[i]['grade'])].push(
                    dataStudents[i]
                );
            } else {
                students.gym[parseInt(dataStudents[i]['grade'])] = [
                    dataStudents[i],
                ];
            }
        }
    }

    // auswertung pro Klassenstufe
    for (let form of options) {
        let keys = Object.keys(students[form]);
        for (let i = 0; i < keys.length; i++) {
            let grade = students[form][keys[i]];
            if (keys[i] != 'data') {
                students[form].data[keys[i]] = {
                    grade: parseInt(keys[i]),
                    count: grade.length,
                    leih: '...',
                };
            }
        }
    }

    //Display ====================================================
    // let allTogether = {
    //     count: 0,
    //     leih: 0,
    // };
    // options.forEach((form) => {
    //     Object.values(students[form].data).forEach((currentGrade) => {
    //         allTogether.count += currentGrade.count;
    //         allTogether.leih += currentGrade.leih;
    //     });
    // });

    // display(
    //     'outputGeneral',
    //     'Allgemein',
    //     'Anzahl Schüler: ' + allTogether.count,
    //     'Leihgebühr: ' + allTogether.leih + '€'
    // );

    for (let form of options) {
        let keys = Object.keys(students[form].data);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != 'data') {
                display(
                    form == 'gym' ? 'outputGym' : 'outputGS',
                    'Klasse ' + students[form].data[keys[i]].grade,
                    'Anzahl Schüler: ' + students[form].data[keys[i]].count,
                    'Leihgebühr: ' + students[form].data[keys[i]].leih + '€',
                    students[form][keys[i]]
                );
            }
        }
    }

    console.log(students);
}

function display(target, headline, numberStudents, leihgebuhr, raw = []) {
    let container = document.createElement('details');

    let head = document.createElement('summary');
    head.textContent = headline;
    head.style.fontWeight = 'bold';

    let leihg = document.createElement('p');
    leihg.textContent = leihgebuhr;
    leihg.id = `outLeihg${headline.replace(' ', '')}${target}`;

    let kaufp = document.createElement('p');
    kaufp.textContent = 'Kaufpreis: ...€';
    kaufp.id = `outKaufpreis${headline.replace(' ', '')}${target}`;

    let EBook = document.createElement('p');
    EBook.textContent = 'E-Booklizenz: ...€';
    EBook.id = `outEBook${headline.replace(' ', '')}${target}`;

    let Rechnung = document.createElement('p');
    Rechnung.textContent = 'Rechnung: ...€';
    Rechnung.id = `outRechnung${headline.replace(' ', '')}${target}`;

    let gesamtBetrag = document.createElement('p');
    gesamtBetrag.innerHTML = '<b>Gesamtbetrag: ...€</b>';
    gesamtBetrag.id = `outGesamtbetrag${headline.replace(' ', '')}${target}`;

    let countStudents = document.createElement('p');
    countStudents.textContent = numberStudents;

    //zum DOM hinzufügen
    let uberDiv = document.createElement('div');
    uberDiv.classList = 'uberDiv';

    container.appendChild(head);
    uberDiv.appendChild(countStudents);
    uberDiv.appendChild(leihg);
    uberDiv.appendChild(kaufp);
    uberDiv.appendChild(EBook);
    uberDiv.appendChild(Rechnung);
    uberDiv.appendChild(gesamtBetrag);

    if (target != 'outputGeneral') {
        uberDiv.appendChild(createTableStudents(raw));
        uberDiv.appendChild(document.createElement('br'));
        uberDiv.appendChild(createTableBooks(raw));
    }

    container.appendChild(uberDiv);

    document.getElementById(target).appendChild(container);
    if (target != 'outputGeneral') {
        document
            .getElementById(target)
            .appendChild(document.createElement('br'));
    }
}

function createTableStudents(raw) {
    let dropdownStudents = document.createElement('details');
    let dropdownStudentsDescription = document.createElement('summary');
    dropdownStudentsDescription.textContent = 'Schüler';
    dropdownStudents.appendChild(dropdownStudentsDescription);

    //Tabelle ====================================================================
    let tabelle = document.createElement('table');
    // collect data ======================================0
    let data = {
        books: {},
        students: [],
    };

    for (let i = 0; i < raw.length; i++) {
        data.students.push(raw[i]);
        let books = JSON.parse(
            raw[i].books.replace(/;/g, ',').replace(/'/g, '"')
        );
        for (let key of Object.keys(books)) {
            if (data.books[key] == undefined) {
                data.books[key] = allBooks[key];
            }
        }
    }
    // collect data ======================================0
    //table head ==============================

    let thTr = document.createElement('tr');
    thTr.classList = 'tableRowDark';
    let headlines = [
        ['Name', 'name'],
        ['', 'zusatz'],
        ['Leih', 'leihgebuhr'],
    ];
    let tableHead = [];

    for (let headline of headlines) {
        let th = document.createElement('th');
        th.textContent = headline[0];
        thTr.appendChild(th);
    }

    for (let title of Object.keys(data.books)) {
        if (data.books[title] != undefined) {
            let th = document.createElement('th');
            th.textContent = data.books[title].name;
            tableHead.push(data.books[title]);
            thTr.appendChild(th);
        }
    }
    let thKaufBetrag = document.createElement('th');
    thKaufBetrag.textContent = 'Kauf';
    tableHead.push('Kauf');
    thTr.appendChild(thKaufBetrag);

    let thLeihBetrag = document.createElement('th');
    thLeihBetrag.textContent = 'Leih';
    tableHead.push('Leih');
    thTr.appendChild(thLeihBetrag);

    let thEBooks = document.createElement('th');
    thEBooks.textContent = 'online';
    tableHead.push('online');
    thTr.appendChild(thEBooks);

    let thRechnung = document.createElement('th');
    thRechnung.textContent = 'Rechn.';
    tableHead.push('Rechn.');
    thTr.appendChild(thRechnung);

    let thGesamtBetrag = document.createElement('th');
    thGesamtBetrag.textContent = 'Gesamt';
    tableHead.push('Gesamt');
    thTr.appendChild(thGesamtBetrag);

    let thUnterschrift = document.createElement('th');
    thUnterschrift.textContent = 'Unterschrift';
    tableHead.push('Unterschrift');
    thTr.appendChild(thUnterschrift);

    tabelle.appendChild(thTr);
    //table head ==============================
    //table content=============================================
    let rows = 0;
    for (let i = 0; i < data.students.length; i++) {
        let gesamtPreisSchuler = 0.0;
        let leih = 0.0;
        let kauf = 0.0;
        let ebook = 0.0;
        let rechnung = 0.0;

        let tr = document.createElement('tr');
        tr.classList = rows % 2 == 0 ? 'tableRowLight' : 'tableRowDark';
        for (let j in headlines) {
            let td = document.createElement('td');
            if (data.students[i][headlines[j][1]] != undefined) {
                td.textContent =
                    data.students[i][headlines[j][1]] + (j == 2 ? '€' : '');
            } else {
                td.textContent = '';
            }
            tr.appendChild(td);
        }

        let books = JSON.parse(
            data.students[i].books.replace(/;/g, ',').replace(/'/g, '"')
        );

        for (let j in tableHead) {
            let td = document.createElement('td');
            if (
                tableHead[j] != 'Gesamt' &&
                tableHead[j] != 'Unterschrift' &&
                tableHead[j] != 'Leih' &&
                tableHead[j] != 'Kauf' &&
                tableHead[j] != 'online' &&
                tableHead[j] != 'Rechn.'
            ) {
                let state = books[tableHead[j].id];
                td.textContent =
                    state != undefined
                        ? state == '0'
                            ? 'K'
                            : state == '1'
                            ? 'L'
                            : state == '2'
                            ? 'V'
                            : 'nb'
                        : '';

                if (state != undefined && state == '0') {
                    kauf += parseFloat(tableHead[j].price);
                } else if (
                    state != undefined &&
                    state == '1' &&
                    tableHead[j].leihberechnen == 'true'
                ) {
                    leih += parseFloat(data.students[i].leihgebuhr);
                }
            } else if (tableHead[j] == 'Gesamt') {
                gesamtPreisSchuler = kauf + leih + ebook + rechnung;
                td.textContent = `${gesamtPreisSchuler.toFixed(2)}€`;
            } else if (tableHead[j] == 'Leih') {
                td.textContent = `${leih.toFixed(2)}€`;
            } else if (tableHead[j] == 'Kauf') {
                td.textContent = `${kauf.toFixed(2)}€`;
            } else if (tableHead[j] == 'online') {
                if (data.students[i].EBook != undefined) {
                    ebook += parseFloat(data.students[i].EBook);
                }
                td.textContent = `${ebook.toFixed(2)}€`;
            } else if (tableHead[j] == 'Rechn.') {
                if (data.students[i].zusatzGebuhr != undefined) {
                    rechnung += parseFloat(data.students[i].zusatzGebuhr);
                }
                td.textContent = `${rechnung.toFixed(2)}€`;
            }

            tr.appendChild(td);
        }

        tabelle.appendChild(tr);

        rows++;
    }
    //table content=============================================
    //Tabelle ====================================================================
    dropdownStudents.appendChild(tabelle);
    return dropdownStudents;
}

function createTableBooks(raw) {
    let leihg = 0.0;
    let gesamtKaufPreis = 0.0;
    let gesamtEBook = 0.0;
    let gesamtRechnung = 0.0;
    // bücher in Tabelle anzeigen ===================================================
    function updateBookData(book, bookList) {
        if (bookList != undefined) {
            if (book == '0') {
                bookList.kaufen += 1;
            } else if (book == '1') {
                bookList.leihen += 1;
            }
        } else {
            bookList = {
                leihen: book == '1' ? 1 : 0,
                kaufen: book == '0' ? 1 : 0,
            };
        }

        return bookList;
    }
    let bookList = {};
    for (let i = 0; i < raw.length; i++) {
        let books = JSON.parse(
            raw[i].books.replace(/;/g, ',').replace(/'/g, '"')
        );
        for (key of Object.keys(books)) {
            bookList[key] = updateBookData(books[key], bookList[key]);
        }
    }

    // Tabelle generieren ==========================
    let tableHeads = ['Buch', 'kaufen', 'leihen'];
    let tabelle = document.createElement('table');
    // header
    let tr = document.createElement('tr');

    for (let text of tableHeads) {
        let th = document.createElement('th');
        th.textContent = text;
        th.classList = 'tableRowDark';

        tr.appendChild(th);
    }
    tabelle.appendChild(tr);

    // bücher in die Tabelle einfügen
    let rows = 0;
    for (let book of Object.keys(bookList)) {
        // console.log(bookList);
        if (allBooks[book] != undefined) {
            let tr = document.createElement('tr');
            tr.classList = rows % 2 == 0 ? 'tableRowLight' : 'tableRowDark';

            let td = document.createElement('td');
            td.textContent = allBooks[book].name;
            tr.appendChild(td);

            tabelle.appendChild(tr);
            //==========================================================
            td = document.createElement('td');
            td.textContent =
                bookList[book].kaufen +
                ` (${
                    Math.round(
                        (bookList[book].kaufen * allBooks[book].price +
                            Number.EPSILON) *
                            100
                    ) / 100
                }€)`;

            gesamtKaufPreis +=
                Math.round(
                    (bookList[book].kaufen * allBooks[book].price +
                        Number.EPSILON) *
                        100
                ) / 100;
            tr.appendChild(td);

            tabelle.appendChild(tr);
            //==========================================================
            td = document.createElement('td');
            let leihPerBook = 0;
            for (let i in raw) {
                let student = raw[i];
                if (
                    JSON.parse(
                        student.books.replace(/;/g, ',').replace(/'/g, '"')
                    )[book] === '1' &&
                    allBooks[book].leihberechnen == 'true'
                ) {
                    leihPerBook += parseInt(student.leihgebuhr);
                }
            }

            td.textContent =
                bookList[book].leihen +
                ` (${Math.round((leihPerBook + Number.EPSILON) * 100) / 100}€)`;

            leihg += Math.round((leihPerBook + Number.EPSILON) * 100) / 100;
            tr.appendChild(td);

            tabelle.appendChild(tr);

            rows++;
        }
    }

    // tabelle darstellen
    let dropDownBooksDescription = document.createElement('summary');
    dropDownBooksDescription.textContent = 'Bücher';

    let dropDownBooks = document.createElement('details');
    dropDownBooks.appendChild(dropDownBooksDescription);
    dropDownBooks.appendChild(tabelle);
    // Tabelle generieren ==========================
    // bücher in Tabelle anzeigen ===================================================

    // ??????????????????????????????????????????????????????????????????????????????
    // AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
    // SOOOOOOOOOOO BAAAAAAAAD
    setTimeout(() => {
        document.getElementById(
            `outLeihgKlasse${raw[0].grade}output${
                raw[0].isgem == true ? 'GS' : 'Gym'
            }`
        ).innerText = `Leihgebühr: ${leihg.toFixed(2)}€`;

        document.getElementById(
            `outKaufpreisKlasse${raw[0].grade}output${
                raw[0].isgem == true ? 'GS' : 'Gym'
            }`
        ).innerText = `Kaufpreis: ${gesamtKaufPreis.toFixed(2)}€`;

        document.getElementById(
            `outEBookKlasse${raw[0].grade}output${
                raw[0].isgem == true ? 'GS' : 'Gym'
            }`
        ).innerText = `Kaufpreis: ${gesamtEBook.toFixed(2)}€`;

        document.getElementById(
            `outRechnungKlasse${raw[0].grade}output${
                raw[0].isgem == true ? 'GS' : 'Gym'
            }`
        ).innerText = `Kaufpreis: ${gesamtRechnung.toFixed(2)}€`;

        document.getElementById(
            `outGesamtbetragKlasse${raw[0].grade}output${
                raw[0].isgem == true ? 'GS' : 'Gym'
            }`
        ).innerHTML = `<b>Gesamtbetrag: ${(
            gesamtKaufPreis +
            leihg +
            gesamtEBook +
            gesamtRechnung
        ).toFixed(2)}€</b>`;
    }, 1000);
    // ??????????????????????????????????????????????????????????????????????????????

    return dropDownBooks;
}
