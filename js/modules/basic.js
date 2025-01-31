/**
 * Rounds a number to given decimal places.
 *
 * @param {number} number The number to round off.
 * @param {number} dp The number of decimal places.
 * @returns {number} The rounded off number.
 */
function roundToDP(number, dp=0) {
    return +(Math.round(number + "e+" + dp) + "e-" + dp);
}

/**
 * Rounds a number to given significant figures.
 *
 * @param {number} number The number to round off.
 * @param {number} sf The number of significant figures.
 * @returns {number} The rounded off number.
 */
function roundToSF(number, sf=3) {
    return +(number.toPrecision(sf))
}

/**
 * Converts a value in seconds to hours, minutes, seconds, and milliseconds.
 *
 * @param {number} seconds The number of seconds.
 * @returns {object} An object in the format [hours, minutes, seconds, milliseconds]
 */
function splitTime(seconds) {
    let h = Math.floor(seconds/3600);
    let m = Math.floor(seconds/60) - 60*h;
    let s = Math.floor(seconds) - 60*m - 3600*h;
    let ms = Math.floor((seconds - s - 60*m - 3600*h)*1000);
    return [h, m, s, ms]
}

/**
 * Takes hours, minutes, seconds, and milliseconds and converts them into a string.
 *
 * @param {object} time An object in the format [hours, minutes, seconds, milliseconds]
 * @returns {object} A string with hours, minutes, seconds, and milliseconds (if non-zero).
 */
function timeLabel(time) {
    let label = ''
    if (time[0] > 0)
        label += String(time[0]) + 'h '
    if (time[1] > 0)
        label += String(time[1]) + 'm '
    if (time[2] > 0 || label == '')
        label += `${time[2]}` + 's'
    return label
    return `${time[0]}h ${time[1]}m ${time[2]+time[3]/1000}s`;
}

/**
 * Reads a file from an input and passes the result to a callback
 *
 * @param {object} input An input element with with type file
 * @param {function} callback The function to call when file has loaded
 */
function readFile(input, callback) {
    let file = input.files[0]
    if (file) {
        let fileReader = new FileReader();
        fileReader.readAsText(file)
        fileReader.onload = () => callback(fileReader.result)
    }
}

function saveFile(name, text) {
    var link = document.createElement('a');
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    link.setAttribute('download', name);

    link.style.display = 'none';
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}

export { roundToDP, roundToSF, splitTime, timeLabel, readFile, saveFile }