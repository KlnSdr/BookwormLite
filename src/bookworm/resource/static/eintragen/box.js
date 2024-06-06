class box {
    constructor(title, price, id, lgBerechnen) {
        this.value = NaN;
        this.title = title;
        this.radios = [];
        this.create();

        this.price = price;
        this.id = id;
        this.lgBerechnen = lgBerechnen == 'true' ? true : false;

        currentBoxes.push(this);
        boxName++;
    }

    create() {
        let parent = document.getElementById('containerBoxes');

        let div = document.createElement('div');
        div.classList = 'selectionBook inline';

        let title = document.createElement('label');
        title.textContent = this.title;
        title.style = 'margin: 5px;';

        div.appendChild(title);

        options.forEach((text) => this.createRadio(text, div));

        parent.appendChild(div);
    }

    createRadio(text, div) {
        let label = document.createElement('label');

        let radio = document.createElement('input');
        radio.type = 'radio';
        radio.id = options.indexOf(text);
        radio.value = options.indexOf(text);
        radio.name = boxName.toString();

        let self = this;
        radio.onchange = function () {
            self.value = this.value;
            self.reset();
            calculate();
        };

        label.appendChild(radio);
        label.appendChild(document.createTextNode(text));

        this.radios.push(radio);

        div.appendChild(document.createElement('br'));
        div.appendChild(label);
    }

    colorize() {
        this.radios.forEach(
            (radio) => (radio.parentElement.style = 'color: red;')
        );
    }

    reset() {
        this.radios.forEach(
            (radio) => (radio.parentElement.style = 'color: black;')
        );
    }

    set(value) {
        this.radios.forEach((radio) => {
            if (radio.value == value) {
                radio.checked = true;
            }
        });
        this.value = value;
    }
}
