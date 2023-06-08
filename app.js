// All of the id values.
const container = document.getElementById("container"),
      typingArea = document.getElementById("typing-area"),
      timer = document.getElementById("timer");

const totalWords = 50,
      // totalSeconds = 300,
      totalSeconds = parseInt(prompt("Enter the number of seconds : ") || 60);

// Function to scroll one line. 
function scrollOneLine(box, parent) {
    boxHeight = box.offsetHeight;
    parentHeight = parent.scrollHeight - parent.clientHeight;

    if (parent.scrollTop == 0) topPadding = 20;
    else topPadding = 3;

    console.log(parent.scrollTop, parentHeight)
    console.log(boxHeight, topPadding)

    if (parentHeight - parent.scrollTop > boxHeight + topPadding)

    parent.scrollTop += boxHeight + topPadding;
}

// For setting up the container with random words
function setup(words, length) {

    // Creating an array of words randomly chosen form "words".
    let randomWords = [];
    for (i=0; i<length; i++) {
        let randomNumber = Math.floor(Math.random() * words.length);
        let randomWord = words[randomNumber];
        randomWords.push(randomWord);
    }

    // Creating a seperate span tag for each of the words.
    for (i in randomWords) {
        let word = randomWords[i];

        let attr = (i == 0) ?
                   `id='n0' class='next'` :
                   `class='next' id='n${i}'`;

        container.innerHTML += ` <span ${attr}>${word}</span>`;
    }

    current = document.getElementById("n0");
    return randomWords;
}

setup(words, totalWords)

// Funtion to convert given seconds to hours, minutes and seconds
function convert(t=null) {
    if (t == null) {
        c = true;
        t = seconds;
    } else
        c = false;

    // d = parseInt(t / (60*60*24))
    h = parseInt(t / (60*60)) //- (24*d)
    m = parseInt(t / 60) - (60*h) //- (60*24*d)
    s = t - (60 * m) - (60*60*h) //- (60*60*24*d)

    // time = ""
    // if (h > 0) time += h + "h ";
    // if (m > 0) time += m + "m ";
    // if (s > 0) time += s + "s ";
    // time = time.slice(0, -1);

    // if (h < 10) h = "0" + h;
    // if (m < 10) m = "0" + m;
    // if (s < 10) s = "0" + s;

    time = `${h}h ${m}m ${s}s`;
    
    if (c) time = "Time: " + time;

    return time
}

seconds = totalSeconds;
timer.innerHTML = convert();

timerActivated = false;

function timerCallback() {
    timer.innerHTML = convert();

    if (seconds == 3)
        document.getElementById("timer").style.color = "red";

    if (seconds == 0) {
        timerStopped = true;
        typingArea.setAttribute("readonly", "")
        typingArea.style.border = "15px solid #f54";

        total = correct + incorrect + incomplete;

        if (total != 0)
            accuracy = (correct / total * 100);
        else
            accuracy = NaN;

        speed = (correct / totalSeconds * 60);

        document.getElementById("total-time").innerHTML = `<b>Total time taken</b><br>${convert(totalSeconds)}`;
        document.getElementById("total-words").innerHTML = `<b>Total words typed</b><br>${total}`;

        document.getElementById("correct").innerHTML = `<b><span style='background: rgb(85, 255, 68);'>Correct</span> values</b><br>${correct}`;
        document.getElementById("incorrect").innerHTML = `<b><span style='background: rgb(255, 85, 68);'>Incorrect</span> values</b><br>${incorrect}`;
        document.getElementById("incomplete").innerHTML = `<b><span style='background: rgb(0, 255, 255);'>Incomplete</span> values</b><br>${incomplete}`;

        document.getElementById("accuracy").innerHTML = `<b>Accuracy (%)</b><br>${accuracy}%`;
        document.getElementById("wpm").innerHTML = `<b>Speed (words/minute)</b><br>${speed} wpm<br>`;

        document.getElementsByTagName("dialog")[0].setAttribute("open", "open");

        stopTimer(interval);
    }
}

function activateTimer(forward, callback) {
    timerActivated = true;
    
    return setInterval( () => {
        if (forward)
            seconds += 1
        else
            seconds -= 1

        callback();

    }, 1000);
}

function stopTimer(interval) {
    clearInterval(interval);
}

//////////////////////////////////////////////////////////////////////////////////////////////////

correct = 0, incorrect = 0, incomplete = 0;

// This entire block is for updating the border color of the typingArea.
typingArea.onkeydown = function(event) {

    SpaceKeyPressed(event);

    if ( event.key != " " && ( event.key.length == 1 || event.key == "Backspace" ) ) {

        if (event.key == "Backspace")
            val1 = typingArea.value.slice(0,-1);

        else if (event.key.length == 1)  {
            val1 = typingArea.value + event.key;

            if (timerActivated == false)
                interval = activateTimer(false, timerCallback);
        }

        if (timerActivated) {
            val2 = current.innerText;
            len1 = val1.length,
            len2 = val2.length;

            if ( val1 == val2 ) {
                typingArea.style.border = "15px solid #5f4"; // light green
            }

            else if ( val1 != val2.slice(0,len1) ) {
                typingArea.style.border = "15px solid #f54"; // red
            }

            else {
                typingArea.style.border = "15px solid #0ff"; // light blue
            }

        }
    }
}

x = 0; // This is used to keep track of the position.
spacebarPressed = false;

// This entire block is for switching to next word when spacebar is pressed.
function SpaceKeyPressed(event) {

    // Only executes if spacebar is pressed and typingArea's value is not empty.
    if ( event.key == " " ) {

        if (typingArea.value == "") {spacebarPressed = true}

        else if (spacebarPressed==true) {typingArea.value = ""; spacebarPressed = false; }

        if (spacebarPressed==false) {
            // Adding a span tag to store the text that has been typed.
            document.getElementById("previous").innerHTML += "<span class='previous' id='p" + x + "'>" + current.innerText + `</span>
            `;

            // Styling the previously created span tag.
            elem = document.getElementById("p"+x);
            elem.style.background = typingArea.style.border.slice(11,);

            if (elem.style.background == "rgb(85, 255, 68)") {correct += 1;}
            else if (elem.style.background == "rgb(0, 255, 255)") {incomplete += 1;}
            else {incorrect += 1;}

            // Transfering the 2nd word to current span, 3rd to 2nd span and so on...
            for (i=0; i<totalWords-1; i++) {
                document.getElementById("n"+i).innerText = document.getElementById("n"+ (i+1) ).innerText
            }

            // Updating the innerText for current span.
            current.innerText = document.getElementById("n0").innerText;

            // Adding a new randomly selected word in the end.
            document.getElementById("n" + (totalWords-1)).innerText = Words[Math.floor(Math.random() * Words.length)];
            
            // Clearing the typingArea value and reseting the border.
            typingArea.value = "";
            typingArea.style.border = "15px solid #0ff";

            x += 1
        }
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////

// This block is simply used to reset the value after spacebar is pressed.
typingArea.onkeyup = function(event) {

    if (typingArea.value == " ") {
        typingArea.value = "";
    }
}

function toggleDialog() {
    dialog = document.getElementsByTagName('dialog')[0];

    if (dialog.getAttribute('open'))
        dialog.removeAttribute('open');
    else
        dialog.setAttribute('open', 'open');
}

/////////////////////////////////////////////////////////////////////////////////////////////////

// FEATURES PLANNED TO BE ADDED

// 1. Pressing backspace to recorrect previously typed word.

// 2. Timer @@@@

// 3. Correctly and Incorrectly typed words.

// 4. Speed (WPM)

// 5. Accuracy (%)

// 6. Automatic Scrolling (once a line is completed)