let klassenStufe = [];

function setup() {
    document.getElementsByName("klassenStufe").forEach(radio => radio.onchange = function () {
        if (radio.checked === true) {
            klassenStufe.push(parseInt(radio.id));
        } else {
            klassenStufe.splice(klassenStufe.indexOf(parseInt(radio.id)), 1);
        }
        console.log(radio.id + " changed");
    });

    document.getElementById("checkGem").onchange = function () {

        let start = 0;

        if (this.checked) {
            document.getElementById("11").disabled = true;
            document.getElementById("12").disabled = true;
            const notAllowed = [11, 12];
            notAllowed.forEach(klasse => {
                if (klassenStufe.indexOf(klasse) > -1) {
                    document.getElementById(klasse.toString()).checked = false;
                    klassenStufe.splice(klassenStufe.indexOf(klasse), 1);
                }
            });

            start = 3;
        } else {
            document.getElementById("11").disabled = false;
            document.getElementById("12").disabled = false;
        }
    };

    getAllStudents();
}

var bedarfLeih = {};
var bedarfKauf = {};

function getAllStudents() {
    askBackend("/getAllStudents", {}, (data) => {
        console.log(data);
        data.res.forEach((student) => {
            const books = JSON.parse(student.books.replace(/'/g, "\"").replace(/;/g, ","));
            Object.keys(books).forEach((bookID) => {
                if (parseInt(books[bookID]) === 1) { // leihen
                    if (Object.keys(bedarfLeih).includes(bookID)) {
                        bedarfLeih[bookID] += 1;
                    } else {
                        bedarfLeih[bookID] = 1;
                    }
                } else if (parseInt(books[bookID]) === 0) { // kaufen
                    if (Object.keys(bedarfKauf).includes(bookID)) {
                        bedarfKauf[bookID] += 1;
                    } else {
                        bedarfKauf[bookID] = 1;
                    }
                }
            });
        });
        loadAllBooks();
    });
}

const boxes = [];

function loadAllBooks() {
    var afterSave = false;

    const currentDetailsGym = [];
    const currentDetailsGS = [];

    if (document.getElementById("containerBoxes").children.length > 1) {
        afterSave = true;
        // Gymnasium
        console.log(" Gymnasium #################################");
        Array.from(document.getElementById("containerBoxes").children[0].children).forEach((child) => {
            if (child.tagName === "DETAILS" && child.open === true) {
                currentDetailsGym.push(child.firstChild.innerText);
            }
        });
        console.log(currentDetailsGym);
        console.log(" Gymnasium #################################");


        // Gemeinschaftsschule
        console.log("Gemeinschaftsschule #################################");
        Array.from(document.getElementById("containerBoxes").children[1].children).forEach((child) => {
            if (child.tagName === "DETAILS" && child.open === true) {
                currentDetailsGS.push(child.firstChild.innerText);
            }
        });
        console.log(currentDetailsGS);
        console.log("Gemeinschaftsschule #################################");
    }

    document.getElementById("containerBoxes").innerHTML = "";
    askBackend("/getAllBooks", {}, (data) => {
        var sortedBooks = {
            "gym": {
                "5": [],
                "6": [],
                "7": [],
                "8": [],
                "9": [],
                "10": [],
                "11": [],
                "12": []
            },
            "gem": {
                "5": [],
                "6": [],
                "7": [],
                "8": [],
                "9": [],
                "10": []
            }
        };

        console.log(data);
        for (let i = 0; i < data.res.length; i++) {
            console.log("before: " + data.res[i].id);
            sortedBooks[((data.res[i].isgem == "true") ? "gem" : "gym")][data.res[i].grade.split(",")[0]].push(data.res[i]);
            console.log("after: " + data.res[i].id);
        }
        console.log("boxes done");

        Object.keys(sortedBooks).forEach((schulart) => {
            const containerSchulart = document.createElement("div");

            const schulartHeadline = document.createElement("h1");
            schulartHeadline.innerText = (schulart == "gym") ? "Gymnasium" : "Gemeinschaftsschule";
            containerSchulart.appendChild(schulartHeadline);

            const uberDivKlassenstufe = document.createElement("div");
            uberDivKlassenstufe.classList.add("uberDiv");

            Object.keys(sortedBooks[schulart]).forEach((currentKlassenstufe) => {
                const detailsKlassenstufe = document.createElement("details");
                const summaryKlassenstufe = document.createElement("summary");
                summaryKlassenstufe.innerText = "Klasse " + currentKlassenstufe;
                summaryKlassenstufe.classList.add("summaryKlassenstufe");

                if (afterSave) {
                    if (schulart === "gym") {
                        if (currentDetailsGym.includes(summaryKlassenstufe.innerText)) {
                            detailsKlassenstufe.open = true;
                        }
                    } else {
                        if (currentDetailsGS.includes(summaryKlassenstufe.innerText)) {
                            detailsKlassenstufe.open = true;
                        }
                    }
                }

                detailsKlassenstufe.appendChild(summaryKlassenstufe);

                const containerBooks = document.createElement("div");
                containerBooks.classList.add("uberDiv");

                sortedBooks[schulart][currentKlassenstufe].forEach((book) => {
                    boxes.push(new box(["Name: " + book.name, "Klassenstufe: " + book.grade, "Preis: " + book.price + "€", "GS: " + ((book.isgem == "true") ? "ja" : "nein"), "LG berechnen: " + ((book.leihberechnen == "true") ? "ja" : "nein"), `Bestand: ${(book.bestand == undefined) ? 0 : book.bestand}`], book.id, containerBooks));
                });

                if (sortedBooks[schulart][currentKlassenstufe].length > 0) {
                    detailsKlassenstufe.appendChild(containerBooks);
                    // uberDivKlassenstufe.appendChild(detailsKlassenstufe);
                    containerSchulart.appendChild(detailsKlassenstufe);
                    containerSchulart.appendChild(document.createElement("br"));
                }
            });


            document.getElementById("containerBoxes").appendChild(containerSchulart);
        });
    });
}

function save() {
    let checksPassed = true;
    //reset============================
    document.getElementById("lblName").style.color = "black";
    document.getElementById("lblPreis").style.color = "black";
    document.getElementById("lblBestand").style.color = "black";
    document.getElementById("lblKlassenstufe").style.color = "black";

    //reset============================


    if (document.getElementById("inputName").value == "") {
        checksPassed = false;
        document.getElementById("lblName").style.color = "red";
    }

    if (document.getElementById("inputPreis").value == "") {
        checksPassed = false;
        document.getElementById("lblPreis").style.color = "red";
    }

    if (document.getElementById("inputBestand").value == "") {
        checksPassed = false;
        document.getElementById("lblBestand").style.color = "red";
    }

    if (klassenStufe.length === 0) {
        checksPassed = false;
        document.getElementById("lblKlassenstufe").style = "color: red;";
    }


    if (checksPassed == true) {
        let bookData = {};
        bookData['name'] = document.getElementById("inputName").value;
        bookData['price'] = document.getElementById("inputPreis").value;
        bookData['grade'] = klassenStufe.toString();
        bookData['isgem'] = document.getElementById("checkGem").checked;
        bookData['leihberechnen'] = document.getElementById("checkLeih").checked;
        bookData['bestand'] = document.getElementById("inputBestand").value;
        console.log(bookData);
        askBackend("/saveBook", bookData, (data) => {
            if (data.success == true) {
                document.getElementById("inputName").value = "";
                document.getElementById("inputPreis").value = "";
                document.getElementById("inputBestand").value = "";
                loadAllBooks();
            } else {
                alert("Das Buch konnte nicht eingetragen werden.");
            }
        });
    }
}