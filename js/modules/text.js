import { removeOpen } from "./dialogs.js"
import { timerCallback, NextWord, count } from "./game.js"

// Handles all characters entered
function textIn (event, game) {
    if (event.data == " ") {
        if (event.target.value == " ")
            event.target.value = ""
        else
            event.target.value = event.target.value.slice(0, -1)
            let x = NextWord(game, game.timer, game.current, game.wordList, game.currentIndex, game.word)
            game.current = x[0]
            game.currentIndex = x[1]
    }

    else if (  event.inputType == 'insertText'            // characters
            || event.inputType == 'deleteContentBackward' // backspace key
            || event.inputType == 'deleteContentForward'  // delete key
    ){
        let enteredWord = event.target.value // the word typed by user
        let currentWord = game.current.innerText // the word displayed
        if (!game.active) {
            removeOpen('dialog')
            if (game.totalSeconds > 0) {
                game.start(() => timerCallback(game))
            }
            else {
                alert('Countdown seconds cannot be zero or less!');
                event.target.value = ''
            }
        }
        
        if (game.active) {
            event.target.className = '' // to remove all classes
            if (currentWord == enteredWord)
                event.target.classList.add('correct')

            else if (enteredWord != currentWord.slice(0, enteredWord.length))
                event.target.classList.add('incorrect')

            // else
            //     event.target.style.borderColor = null; // default

        }
    }

    return game

}

// Handles caps lock key (on PC)
function textDown (event) {
    let capsLockIsOn = event.getModifierState && event.getModifierState('CapsLock');

    if (capsLockIsOn) {
        alert('Caps lock is on!')
    }
}

// Pauses when textbox loses focus
function textBlur (event, game) {
    if (game.active) {
        game.timer.pause()
        timerStatus.innerText = '(Paused)'
        count(game.timer.seconds, game.timer)
    }
}

// Resumes when textbox gains focus
function textReady (event, game) {
    if (game.active) {
        game.timer.resume()
        timerStatus.innerText = ''
        count(game.timer.seconds, game.timer)
    }
}

export { textIn, textDown, textBlur, textReady }