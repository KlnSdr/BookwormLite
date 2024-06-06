function openSelectBox() {
    const editor = document.getElementById('mydiv');
    editor.style.position = 'absolute';
    editor.style.left =
        (window.innerWidth / 2 - editor.offsetWidth / 2).toString() + 'px';
    editor.style.top =
        (window.innerHeight / 2 - editor.offsetHeight / 2).toString() + 'px';
    editor.style.visibility = 'visible';

    document.getElementById('bttnSave').disabled = false;
}
let killHim_Gym = [];
let killHim_Gs = [];
function removeUnwanted() {
    killHim_Gym = [];
    killHim_Gs = [];

    for (let i = 5; i <= 12; i++) {
        if (document.getElementById(`GYMalter${i}`).checked) {
            killHim_Gym.push(`Klasse ${i}`);
        }
    }

    for (let i = 5; i <= 10; i++) {
        if (document.getElementById(`GYMalter${i}`).checked) {
            killHim_Gs.push(`Klasse ${i}`);
        }
    }
}
