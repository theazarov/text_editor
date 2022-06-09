const editor = document.getElementById("editor");
const notes = document.getElementById("notes");

let date = new Date();
let date_to_string = String(date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate())
let array_new_dates = [];

if (localStorage.getItem("dates") === null) {
  localStorage.setItem("dates", JSON.stringify(array_new_dates));
}

let array_from_LS = JSON.parse(localStorage.getItem("dates"));

if (!array_from_LS.includes(date_to_string)) {
  array_from_LS.push(date_to_string);
  localStorage.setItem("dates", JSON.stringify(array_from_LS));
} else {
  localStorage.setItem(String(date_to_string), editor.innerHTML);
}

editor.addEventListener("keydown", function () {
  localStorage.setItem(String(date_to_string), editor.innerHTML);
});

for (let elem of array_from_LS) {
  let new_note = document.createElement("p");
  new_note.innerHTML = elem;
  notes.appendChild(new_note);

  new_note.addEventListener("click", function () {
    editor.innerHTML = localStorage.getItem(elem);
  });
}
