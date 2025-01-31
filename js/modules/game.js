import { timeLabel, splitTime } from "./basic.js";
import { Timer } from "./classes.js";
import { removeOpen, setOpen } from "./dialogs.js";
import { updateDurationInputs } from "./duration.js";
import { roundToSF, roundToDP } from "./basic.js";
import { Word } from "./classes.js"

const words = document.getElementById('words')

class Game {
    constructor(totalWords, wordList, totalSeconds) {
        this.active = false

        this.timer = new Timer()
        this.timer.seconds = totalSeconds
        count(totalSeconds, this.timer)
        updateDurationInputs(this.timer)

        // let [currentIndex, current, word] = initialize(totalWords, wordList, totalSeconds)

        let currentIndex = 1;
        
        let word = [];
        words.innerHTML = '';
        word = appendRandomWords(totalWords, wordList, word)

        let current = document.getElementById(`word${currentIndex}`);
        current.classList.add('current')

        timerStatus.innerText = ''

        // Set up default values in results dialog
        resultsValues()

        countdown.style.color = null
        textbox.className = ''
        textbox.value = ''

        removeOpen('dialog')
        textbox.removeAttribute('readonly')

        this.totalSeconds = totalSeconds
        this.totalWords = totalWords
        this.wordList = wordList
        this.currentIndex = currentIndex
        this.word = word
        this.current = current

        textbox.focus()
    }

    start(callback) {
        if (!this.active) {
            this.active = true
            this.timer.start(callback)
        }
    }

    end() {
        if (this.active) {
            this.active = false
            this.timer.stop()
        }
    }
}

// CONTAINER FUNCTIONS

function NextWord(game, timer, current, wordList, currentIndex, word) {
    if (game.active && textbox.value != '') {
        let status = textbox.classList[0] || 'incomplete';
        current.classList.add(status)
        if (document.settings.colored.checked)
            current.classList.add('colored')

        current.setAttribute('title', textbox.value)
        current.classList.remove('current')
        appendRandomWords(1, wordList, word)

        currentIndex += 1
        current = document.getElementById(`word${currentIndex}`);
        current.classList.add('current')

        textbox.value = "";
        textbox.className = ''
    }
    return [current, currentIndex]
}

function count(seconds, timer) {
    countdown.innerText = timeLabel(splitTime(seconds || (timer ? timer.seconds : '') || 0))
}

// For appending random words to the container
function appendRandomWords(number, wordList, word) {
    let count = document.querySelectorAll('#words .word').length // number of pre-existing words
    for (let n=count+1; n<count+number+1; n++) {
        let randomIndex = Math.floor(Math.random() * wordList.length);
        let randomWord = wordList[randomIndex];
        if (randomWord) {
            let element = document.createElement('span')
            element.id = `word${n}`
            element.classList.add('word')
            element.innerText = randomWord
            word.push(new Word(element))
            words.appendChild(element)
            words.append(' ')
        }
    }
    return word
}

// RESULTS

function updateResults(timer, wordsCategory) {
    let countWordsByStatus = function (status) {
        return document.querySelectorAll(`#words .${status}`).length
    }

    let countCharsByStatus = function (status) {
        let chars = 0
        document.querySelectorAll(`#words .${status}`).forEach((word) => {
            chars += word.title.length})
        return chars
    }

    let a = countWordsByStatus('correct'),
        b = countWordsByStatus('incorrect'),
        c = countWordsByStatus('incomplete'),
        d = countCharsByStatus('correct'),
        e = countCharsByStatus('incorrect'),
        f = countCharsByStatus('incomplete')

    // if (NextWord(timer) && (b || c)) {
    //     let list = document.querySelectorAll('#words .correct, #words .incorrect, #words.incomplete')
    //     let last = list[list.length-1]
    //     if (last) {
    //         if (b && last.classList.contains('incorrect')) {
    //             b -= 1
    //             last.setAttribute('title', last.getAttribute('title') + ' (ignored)')
    //         }
    //         if (c && last.classList.contains('incomplete')) {
    //             c -= 1
    //             last.setAttribute('title', last.getAttribute('title') + ' (ignored)')
    //         }
    //     }
    // }

    if (wordsCategory == 'custom') {
        let t = 0
        for (let word of wordList) {
            t += word.length
        }
        let charsPerWord = t/wordList.length
    }
    else {
        let charsPerWord = (wordsCategory=='100') ? 3.38
                        : (wordsCategory=='1000') ? 5.268
                        : (wordsCategory=='58K') ? 484586/58110 // ~8.34
                        : (wordsCategory=='370K') ? 3494707/370105 // ~9.44
                        : 0
    }

    let totalTime = timer.time / 1000;
    // let total = a + b + c;

    let duration = timeLabel(splitTime(Math.round(totalTime)));
    // let oldaccuracy = (total != 0) ? (a/total*100) : 0;
    // let oldspeed = (a/totalTime*60);
    let estwords = d/5 // d/charsPerWord
    let wordsX = (d+f)/5 // (d+f)/charsPerWord
    let speed = estwords/totalTime*60;
    let speedX = wordsX/totalTime*60
    let accuracy = (d+e+f != 0) ? (d)/(d+e+f)*100 : 0
    // let accuracyX = (d+e+f != 0) ? (d+f)/(d+e+f)*100 : 0

    resultsValues(duration, estwords, speed, speedX, accuracy, d, e, f)
    resultsTitles(totalTime, estwords, speed, speedX, accuracy)

    setOpen('#results')
}

function resultsValues(duration=0, estwords=0, speed=0, speedX=0, accuracy=0, d=0, e=0, f=0) {
    document.querySelector("#duration .content").innerText = duration || timeLabel(splitTime(0));

    document.querySelector("#estwords .content").innerText = roundToSF(estwords, 3);
    document.querySelector("#speed .content").innerText = roundToSF(speed, 3);
    document.querySelector("#speedX .content").innerText = roundToSF(speedX, 3);
    document.querySelector("#accuracy .content").innerText = roundToDP(accuracy, 0);

    document.querySelector("#totalChars .content").innerText = d+e+f;
    document.querySelector("#correctChars .content").innerText = d;
    document.querySelector("#incorrectChars .content").innerText = e;
    document.querySelector("#incompleteChars .content").innerText = f;
}

function resultsTitles(totalTime, estwords, speed, speedX, accuracy) {
    document.querySelector("#duration .content").title = totalTime;
    document.querySelector("#estwords .content").title = estwords;
    document.querySelector("#speed .content").title = speed;
    document.querySelector("#speedX .content").title = speedX;
    document.querySelector("#accuracy .content").title = accuracy;
}

function timerCallback(game) {
    count(game.timer.seconds, game.timer)

    if (game.timer.seconds == 0) {
        game.end()
        textbox.value = ""
        textbox.setAttribute("readonly", "")
        textbox.className = ''
        countdown.style.color = null
        game.current.classList.remove('current')
        updateResults(game.timer, game.wordsCategory)
    }
}

// TODO

// Fix this function

function scrollOneLine(box, parent) {
    let boxHeight = box.offsetHeight;
    let parentHeight = parent.scrollHeight - parent.clientHeight;

    if (parent.scrollTop == 0) topPadding = 20;
    else topPadding = 3;

    if (parentHeight - parent.scrollTop > boxHeight + topPadding)

    parent.scrollTop += boxHeight + topPadding;
}

export { Game, timerCallback, NextWord, count }