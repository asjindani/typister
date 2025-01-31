import { getTotalSeconds, getTotalWords, themes as themesPromise, getCurrentTheme, getWordsCategory, getWordList } from "./data.js"
import { Game, count } from "./modules/game.js";

let totalSeconds = getTotalSeconds();
count(totalSeconds)

import { durationInputsToSeconds, updateSeconds } from "./modules/duration.js";
import { setCustomTheme } from "./modules/theme.js";
import { setTheme, themeDataToButtons } from "./modules/theme.js";
import { viewWords, setCustomWords, exportWords, textToWordList, createDefaultWordCategoies } from "./modules/words.js"
import { textIn, textDown, textBlur, textReady } from "./modules/text.js";
import { readFile } from "./modules/basic.js";
import { removeOpen, setOpen } from "./modules/dialogs.js";

let totalWords = getTotalWords()

const durationMin = 0,     // Minimum duration (0 seconds)
      durationMax = 86400; // Maximum duration (24 hours)

// Document Elements
const words = document.getElementById("words"),
      countdown = document.getElementById("countdown"),
      textbox = document.getElementById("textbox"),
      timerStatus = document.getElementById('timerStatus');

const wordCategories = ['100', '1000', '58K', '370K'];
const localItems = ['words', 'wordsCategory', 'theme', 'seconds', 'colored'];




let themeData = await themesPromise
let currentTheme = getCurrentTheme(themeData)

setTheme(currentTheme, themeData)

let wordsCategory = getWordsCategory()
let wordList = await getWordList(wordsCategory)

// let currentIndex, current, timer, word;

themeDataToButtons(themeData)

var game = new Game(totalWords, wordList, totalSeconds)

document.querySelectorAll('dialog .closeButton, dialog .close').forEach((close) => {
    close.onclick = (event) => {
        close.parentElement.removeAttribute('open')
        textbox.focus()
    }
})

// MENU BUTTONS

// ✅
document.getElementById('menuRestart').onclick = (event) => {
    if (game.active)
        game.end()
    game = new Game(totalWords, wordList, totalSeconds)
}

function showMenu(id) {
    if (!game.active) {
        let element = document.getElementById(id)
        if (element.getAttribute('open')) {
            element.removeAttribute('open')
            textbox.focus()
        }
        else {
            removeOpen('dialog')
            element.setAttribute('open', 'open')
        }
    }
}

document.getElementById('menuResults').onclick = (event) => showMenu('results')
document.getElementById('menuSettings').onclick = (event) => showMenu('settings')

//* TEXTBOX

textbox.onfocus = (event) => textReady(event, game)
textbox.oninput = (event) => {game = textIn(event, game)}
textbox.onkeydown = textDown
textbox.onblur = (event) => textBlur(event, game)

// SETTINGS

//* 1۔ Colored Underlines

document.forms.settings.colored.checked = true

if (localStorage.colored == 'false')
    document.forms.settings.colored.checked = false

document.forms.settings.colored.onchange = (event) => {
    localStorage.colored = event.target.checked
    document.querySelectorAll('#words .correct, #words .incorrect, #words .incomplete').forEach((word) => {
        if (event.target.checked)
            word.classList.add('colored')
        else
            word.classList.remove('colored')
    })
}

// 2. Themes

document.getElementById('customThemeButton').onclick = (event) => setCustomTheme(themeData)

// 3. Duration Inputs

function durationIn(event) {
    let seconds = durationInputsToSeconds(durationMin, durationMax)
    // if (totalSeconds != seconds) {
        totalSeconds = seconds
        game = updateSeconds(seconds, game)
    // }
}

document.duration.hours.oninput = durationIn
document.duration.minutes.oninput = durationIn
document.duration.seconds.oninput = durationIn

// 4. Words

document.getElementById('changeWordsNumber').onclick = (event) => {
    let newWordNumber = prompt('Enter number of words:')
    if (!isNaN(newWordNumber)) {
        totalWords = parseInt(newWordNumber)
        localStorage.totalWords = totalWords
        removeOpen('dialog')
        game = new Game(totalWords, wordList, totalSeconds)
    }
}

createDefaultWordCategoies(wordCategories)
document.querySelectorAll('.defaultWordsButton').forEach((button) => {
    button.onclick = async (event) => {
        localStorage.removeItem('words')
        localStorage.wordsCategory = button.category
        wordList = await getWordList(button.category)
        game = new Game(totalWords, wordList, totalSeconds)
    }
})

document.getElementById('setCustomWords').onclick = (event) => {
    wordList = setCustomWords()
    game = new Game(totalSeconds, wordList, totalSeconds)
}

document.getElementById('viewCustomWords').onclick = (event) => viewWords('custom')
document.getElementById('exportWordsButton').onclick = (event) => exportWords(wordList)

document.getElementById('wordsFile').onchange = (event) => {
    readFile(event.target, (text) => {
        wordList = textToWordList(text)
        localStorage.words = JSON.stringify(wordList)
        game = new Game(totalWords, wordList, totalSeconds)
    })
}

//* 5. Danger

document.getElementById('clearStorage').onclick = (event) => {
    if (confirm('Are you sure you want to proceed?')) {
        localStorage.clear()
        location.reload()
    }
}