import { splitTime } from "./basic.js";
import { count } from "./game.js";

function durationInputsToSeconds(min, max) {
    let seconds = 3600 * parseInt(document.duration.hours.value || 0)
                + 60   * parseInt(document.duration.minutes.value || 0)
                +        parseInt(document.duration.seconds.value || 0);
    if (seconds < min)
        return min
    if (seconds > max)
        return max
    return seconds
}

function updateSeconds(seconds, game) {
    if (!isNaN(seconds)) {
        let time = splitTime(seconds);
        document.duration.hours.value   = time[0];
        document.duration.minutes.value = time[1];
        document.duration.seconds.value = time[2];
        game.timer.seconds = seconds;
        game.totalSeconds = seconds;
        count(seconds, game.timer)
        localStorage.seconds = seconds;
        return game
    }
}

function updateDurationInputs(timer) {
    let time = splitTime(timer.seconds)
    document.duration.hours.value = time[0];
    document.duration.minutes.value = time[1];
    document.duration.seconds.value = time[2];
}

// function durationInc(event) {
//     document.duration[i].value = parseInt(document.duration[i].value) + parseInt(event.target.innerText)
//     let seconds = durationInputsToSeconds(durationMin, durationMax)
//     if (!isNaN(seconds)) {
//         count(seconds, timer)
//     }
//     totalSeconds = seconds
//     timer = updateSeconds(seconds, timer)
// }

// document.duration['hours+'].oninput = durationInc
// document.duration['hours-'].oninput = durationInc
// document.duration['minutes+'].oninput = durationInc
// document.duration['minutes-'].oninput = durationInc
// document.duration['seconds+'].oninput = durationInc
// document.duration['seconds-'].oninput = durationInc

// ['hours', 'minutes', 'seconds'].forEach((i) => {
//     document.duration[i].oninput = (event) => {
//         let seconds = durationInputsToSeconds(durationMin, durationMax)
//         totalSeconds = seconds
//         timer = updateSeconds(seconds, timer)
//     }

//     [document.duration[`${i}+`], document.duration[`${i}-`]].forEach((h) => {
//         h.onclick = (event) => {
//             document.duration[i].value = parseInt(document.duration[i].value) + parseInt(event.target.innerText)
//             let seconds = durationInputsToSeconds(durationMin, durationMax)
//             if (!isNaN(seconds)) {
//                 count(seconds, timer)
//             }
//             totalSeconds = seconds
//             timer = updateSeconds(seconds, timer)
//         }
//     })
// })

export { updateDurationInputs, durationInputsToSeconds, updateSeconds }