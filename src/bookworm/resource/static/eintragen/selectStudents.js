//selection Students===============================================================================
let tmpGrade = "";
let tmpZusatz = "";

function openStudentSelection() {
    // document.getElementById("studentSelection").classList = "front show aligner";
    const editor = document.getElementById('mydiv');
    editor.style.position = "absolute";
    editor.style.left = (window.innerWidth / 2 - editor.offsetWidth / 2).toString() + 'px';
    editor.style.top = (window.innerHeight / 2 - editor.offsetHeight / 2).toString() + 'px';
    editor.style.visibility = "visible";
    document.getElementById('mydiv').style.visibility = "visible";
    clearSelectStudents();
    getInformation("0");
}

function closeStudentSelection() {
    // document.getElementById("studentSelection").classList = "front hide aligner";
    closeEditor();
    tmpGrade = "";
    tmpZusatz = "";
    clearSelectStudents();
}

function getInformation(MODE) {
    // $.askBackend('selectStudents.php', {
    //     mode: MODE,
    //     grade: tmpGrade,
    //     zusatz: tmpZusatz
    // }, (data) => {
    //     console.log(data);

    //     let json = JSON.parse(data);

    //     switch (MODE) {
    //         case "0":
    //             clearSelectStudents("Grade")
    //             json.forEach(grade => {
    //                 addTable("Grade", grade.value);
    //             });
    //             break;
    //         case "1":
    //             clearSelectStudents("Zusatz")
    //             json.forEach(zusatz => {
    //                 addTable("Zusatz", zusatz.value);
    //             });
    //             break;
    //         case "2":
    //             clearSelectStudents("Name")
    //             json.forEach(student => {
    //                 let stud = new studentButton(student.name, student.id);
    //             });
    //             break;
    //     }
    // });

    askBackend("/selectStudent", {
        mode: MODE,
        grade: tmpGrade,
        zusatz: tmpZusatz
    }, (data) => {
        console.log(data);

        const json = JSON.parse(data.res);

        switch (MODE) {
            case "0":
                clearSelectStudents("Grade")
                json.forEach(grade => {
                    addTable("Grade", grade.value);
                });
                break;
            case "1":
                clearSelectStudents("Zusatz")
                json.forEach(zusatz => {
                    addTable("Zusatz", zusatz.value);
                });
                break;
            case "2":
                clearSelectStudents("Name")
                json.forEach(student => {
                    new studentButton(student.name, student.id);
                });
                break;
        }
    });
}

function addTable(specificName, grade) {
    console.log(grade);
    let bttn = document.createElement("button");
    bttn.appendChild(document.createTextNode(grade));
    bttn.className = "bttnSelectStudents";

    if (specificName == "Grade") {
        bttn.onclick = function () {
            tmpGrade = event.target.innerHTML;
            clearSelectStudents("Zusatz");
            clearSelectStudents("Name");
            getInformation("1");
        }
    } else if (specificName == "Zusatz") {
        bttn.onclick = function () {
            tmpZusatz = event.target.innerHTML;
            clearSelectStudents("Name");
            getInformation("2");
        }
    }


    document.getElementById("selectStudents" + specificName).appendChild(bttn);
}

function clearSelectStudents(specific = "all") {
    if (specific != "all") {
        document.getElementById("selectStudents" + specific).innerHTML = "";
    } else {
        document.getElementById("selectStudentsGrade").innerHTML = "";
        document.getElementById("selectStudentsZusatz").innerHTML = "";
        document.getElementById("selectStudentsName").innerHTML = "";
    }
}


class studentButton {
    constructor(name, id) {
        this.name = name;
        this.id = id;

        this.show();
    }

    show() {
        let bttn = document.createElement("button");
        bttn.appendChild(document.createTextNode(this.name));
        bttn.className = "bttnSelectStudents";

        let self = this;

        bttn.onclick = function () {
            open(self.id);
        }


        document.getElementById("selectStudentsName").appendChild(bttn);
    }
}