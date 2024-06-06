class box {
    constructor(options, id, parent) {
        this.options = options;
        this.parent = parent;
        console.log("id: " + id);
        this.ID = id;
        this.create();
    }

    create() {
        let div = document.createElement("div");
        div.classList = "bookBox";

        this.options.forEach(text => this.createLabel(text, div));
        this.createLabel(`Bedarf (leih): ${(bedarfLeih[this.ID] === undefined) ? 0 : bedarfLeih[this.ID]}`, div, (parseInt(bedarfLeih[this.ID]) > parseInt(this.options[5].replace(/\D+: /gi, ""))) ? "red" : "black");
        this.createLabel(`Bedarf (kauf): ${(bedarfKauf[this.ID] === undefined) ? 0 : bedarfKauf[this.ID]}`, div);

        let a = document.createElement("a");
        a.href = "#";
        a.onclick = () => {
            let bookData = [
                this.options[0].replace(/\D+: /gi, ""), // name
                this.options[1].replace(/\D+: /gi, ""), // grade
                this.options[2].replace(/\D+: /gi, "").replace("€", ""), // price
                this.options[3].replace(/\D+: /gi, "").replace(/ja/gi, "0").replace(/nein/gi, "1"), // isgem
                this.options[4].replace(/\D+: /gi, "").replace(/ja/gi, "0").replace(/nein/gi, "1"), // leihberechnen
                this.options[5].replace(/\D+: /gi, ""), // bestand
                this.ID // id
            ];
            console.log(bookData);

            for (let i = 0; i < inputs.length; i++) {
                if (inputs[i] === "selectGrade") {
                    for (let j = 5; j <= 12; j++) {
                        document.getElementById(`alter${j}`).checked = false;
                        document.getElementById(`alter${j}`).disabled = false;
                    }
                    bookData[i].split(",").forEach(_grade => {
                        document.getElementById(`alter${_grade}`).checked = true;
                    });
                } else {
                    document.getElementById(inputs[i]).value = bookData[i];
                    document.getElementById(inputs[i]).disabled = false;
                }
            }

            document.getElementById("bttnSave").disabled = false;
            document.getElementById("bttnDelete").disabled = false;

            const editor = document.getElementById('mydiv');
            editor.style.position = "absolute";
            editor.style.left = (window.innerWidth / 2 - editor.offsetWidth / 2).toString() + 'px';
            editor.style.top = (window.innerHeight / 2 - editor.offsetHeight / 2).toString() + 'px';
            editor.style.visibility = "visible";
        };

        document.getElementById("bttnSave").onclick = () => {
            let dataToSend = {
                name: document.getElementById("txtName").value,
                grade: this.getGrades(),
                price: document.getElementById("txtPrice").value,
                isgem: (document.getElementById("selectGS").value == "0") ? "true" : "false",
                leihberechnen: (document.getElementById("selectLG").value == "0") ? "true" : "false",
                bestand: document.getElementById("txtBestand").value,
                id: document.getElementById("hiddenData").value
            };

            console.log(dataToSend);

            askBackend("/updateBook", dataToSend, (data) => {
                loadAllBooks();
                closeEditor();
            });
        };

        document.getElementById("bttnDelete").onclick = () => {
            if (confirm("Unwiderruflich löschen?")) {
                askBackend("/removeBook", {
                    id: document.getElementById("hiddenData").value
                }, (data) => {
                    loadAllBooks();
                    closeEditor();
                });
            }
        };

        a.appendChild(div);
        a.className = "bookLink";

        this.parent.appendChild(a);

        console.log("*****************************");
    }

    getGrades() {
        var grades = [];
        for (let j = 5; j <= 12; j++) {
            if (document.getElementById(`alter${j}`).checked === true) {
                grades.push(j);
            }
        }

        return grades.toString();
    }

    createLabel(text, div, _color = "black") {
        let label = document.createElement("label");

        label.appendChild(document.createTextNode(text));
        label.style.color = _color;

        if (div.children.length > 0) {
            div.appendChild(document.createElement("br"));
        }
        div.appendChild(label);
    }
}