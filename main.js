import { WORDS } from "./words.js";

//Количество попыток
const NUMBER_OF_GUESSES = 6;

//сколько попыток осталось
let guessesRemaining = NUMBER_OF_GUESSES;

//текущая попытка
let currentGuess = [];

//следующуя буква
let nextLetter = 0;

//загаданное слово
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
console.log(rightGuessString);

//создаем игровое поле
function initBoard() {
  let board = document.getElementById("game-board");

  for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
    let row = document.createElement("div");
    row.className = "letter-row";

    for (let j = 0; j < 5; j++) {
      let box = document.createElement("div");
      box.className = "letter-box";
      row.appendChild(box);
    }
    board.appendChild(row);
  }
}
initBoard();

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
  const target = e.target;

  if (!target.classList.contains("keyboard-button")) {
    return;
  }

  let key = target.textContent;

  document.dispatchEvent(new KeyboardEvent("keydown", { key: key }));
});

//обработчик нажатия клавиш
document.addEventListener("keydown", (e) => {
  //если попыток не осталось - выходим из функции
  if (guessesRemaining === 0) {
    return;
  }

  //получаем код нажатой клавиши
  let pressedKey = String(e.key);

  //если нажат бекспейс и в строке есть хоть один символ
  if (pressedKey === "Backspace" && nextLetter != 0) {
    //то удаляем последнюю букву
    deleteLetter();
    //и выходим
    return;
  }

  //если нажат энтер
  if (pressedKey === "Enter") {
    //проверяем введенное слово
    checkGuess();
    //и выходим
    return;
  }

  //проверяем есть ли введенный символ в английском алфавите
  let found = pressedKey.match(/[а-яА-ЯЁё]/gi);

  //если нет
  if (!found || found.length > 1) {
    //то выходим
    return;
  } else {
    insertLetter(pressedKey);
  }
});
//выводим букву в клетку
function insertLetter(pressedKey) {
  //если клетки закончились
  if (nextLetter === 5) {
    //выходим из функции
    return;
  }

  //получаем доступ к текущей строке
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  let box = row.children[nextLetter];
  //меняем тукст в блоке с клеткой на нажатый символ
  box.textContent = pressedKey;
  //добавляем в клетку жирную обводку
  box.classList.add("filled-box");
  //добавляем введенный1 символ к массиву. в котором хранится наша текущая попытка угадать слово
  currentGuess.push(pressedKey);
  //помечаем, что дальше будем работать со следующей клеткой
  nextLetter += 1;
}

//удаление символа
function deleteLetter() {
  //получаем доступ к текущей клетке
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  //и кпоследнему введенному символу
  let box = row.children[nextLetter - 1];
  //очищаем содержимое клетки
  box.textContent = "";
  //убираем жирную обводку
  box.classList.remove("filled-box");
  //удаляем последний символ из массива с нашей текущей догадкой
  currentGuess.pop();
  //помечаем что у нас теперь на одну свободную клетку больше
  nextLetter -= 1;
}

//проверка введеного слова
function checkGuess() {
  //получаем доступ к текущес строке
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  //переменная где будет наша догадка
  let guessSrring = "";
  //делаем из загаданного слова массив символов
  let righrGuess = Array.from(rightGuessString);

  //собираем все введенные в строке буквы в одно слово
  for (const val of currentGuess) {
    guessSrring += val;
  }

  //если в догадке меньше 5 букв - выводим уведомление, что букв не хватает
  if (guessSrring.length != 5) {
    //error означает, что уведомление будет в формате ошибки
    toastr.error("введены не все буквы");
    //и после ввода выходим из проверки догадки
    return;
  }

  //если введеного слова нет в списке возможных слов - выводим уведомление
  if (!WORDS.includes(guessSrring)) {
    toastr.error("такого слова нет в списке");
    //и после ввода выходим из проверки догадки
    return;
  }

  //перебираем все буквы в строке, чтобы подсветить их нужным цветом
  for (let i = 0; i < 5; i++) {
    //убираем текущий цвет, если он был
    let letterColor = "";
    //получаем доступ к текущей клетке
    let box = row.children[i];

    let letter = currentGuess[i];

    //смотрим на каком месте в исходном слове стоит текущая буква
    let letterPosition = righrGuess.indexOf(currentGuess[i]);
    //если такой буквы нет в исходном слове
    if (letterPosition === -1) {
      letterColor = "grey";
      //иначе, когда мы точно знаем что буква в слове есть
    } else {
      if (currentGuess[i] === righrGuess[i]) {
        //закрашиваем клетку зеленым
        letterColor = "green";
      } else {
        //в противном случае закрашиваем желтым
        letterColor = "yellow";
      }
      //заменяем обработанный символ на знак решетки, чтобы не использовать его на следующем шаге цикла
    }
    //применяем выбранный цвет к фону клетки
    box.style.backgroundColor = letterColor;
    shadeKeyBoard(letter, letterColor);
  }

  // если мы угадали
  if (guessSrring === righrGuess) {
    //выводим сообщение об успехе
    toastr.success("вы выиграли");
    // обнуляем количество попыток
    guessesRemaining = 0;
    // выходим из проверки
    return;
    // в противном случае
  } else {
    // уменьшаем счетчик попыок
    guessesRemaining -= 1;
    //обнуляем массив с символами текущей попытки
    currentGuess = [];
    //начинаем отсчет букв заново
    nextLetter = 0;

    // если попытки закончились
    if (guessesRemaining === 0) {
      //выводим сообщение о проигрыше
      toastr.error("у вас не осталось попыток");
      toastr.info(`Загаданное слово: "${rightGuessString}"`);
    }
  }
}

function shadeKeyBoard(letter, color) {
  for (const elem of document.getElementsByClassName("keyboard-button")) {
    if (elem.textContent === letter) {
      let oldColor = elem.style.backgroundColor;

      if (oldColor === "green") {
        return;
      }

      if (oldColor === "yellow" && color !== "green") {
        return;
      }

      elem.style.backgroundColor = color;
    }
  }
}
