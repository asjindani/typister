///////////////////////////////////////////////////////////////////
/////////////////////// Start of Setup Block //////////////////////
///////////////////////////////////////////////////////////////////

// For setting up the container with random words
function setup(words, length) {

	container.innerHTML = '<div id="previous"></div>';

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

///////////////////////////////////////////////////////////////////
/////////////////////// End of Setup Block //////////////////////
///////////////////////////////////////////////////////////////////





///////////////////////////////////////////////////////////////////
/////////////////////// Start of Timer Block //////////////////////
///////////////////////////////////////////////////////////////////

function timerCallback() {
    timerDiv.innerHTML = convert();

    if (timer.seconds == 3)
        document.getElementById("timer").style.color = "red";

    if (timer.seconds == 0) {
        typingArea.setAttribute("readonly", "")
        typingArea.style.border = "15px solid #f54";

        total = correct + incorrect + incomplete;

        if (total != 0)
            accuracy = (correct / total * 100).round(1);
        else
            accuracy = NaN;

        speed = (correct / totalSeconds * 60).round(1);

        document.getElementById("total-time").innerHTML = `<b>Total time taken</b><br>${convert(totalSeconds)}`;
        document.getElementById("total-words").innerHTML = `<b>Total words typed</b><br>${total}`;

        document.getElementById("correct").innerHTML = `<b><span style='background: rgb(85, 255, 68);'>Correct</span> values</b><br>${correct}`;
        document.getElementById("incorrect").innerHTML = `<b><span style='background: rgb(255, 85, 68);'>Incorrect</span> values</b><br>${incorrect}`;
        document.getElementById("incomplete").innerHTML = `<b><span style='background: rgb(0, 255, 255);'>Incomplete</span> values</b><br>${incomplete}`;

        document.getElementById("accuracy").innerHTML = `<b>Accuracy (%)</b><br>${accuracy}%`;
        document.getElementById("wpm").innerHTML = `<b>Speed (words/minute)</b><br>${speed} wpm<br>`;

        document.getElementsByTagName("dialog")[0].setAttribute("open", "open");

        timer.stop();
    }
}

///////////////////////////////////////////////////////////////////
//////////////////////// End of Timer Block ///////////////////////
///////////////////////////////////////////////////////////////////





///////////////////////////////////////////////////////////////////
///////////////////// Start of Space Key Block ////////////////////
///////////////////////////////////////////////////////////////////

x = 0; // This is used to keep track of the position.
spacebarPressed = false;

// This entire block is for switching to next word when spacebar is pressed.
function SpaceKeyPressed(event) {

    // Only executes if spacebar is pressed and typingArea's value is not empty.

    if (typingArea.value == "") {spacebarPressed = true}

    if (spacebarPressed) {
		typingArea.value = "";
    }

    else if (timer.active) {
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
        document.getElementById("n" + (totalWords-1)).innerText = words[Math.floor(Math.random() * words.length)];
        
        // Clearing the typingArea value and reseting the border.
        typingArea.value = "";
        typingArea.style.border = "15px solid #0ff";

        x += 1
    }
}

///////////////////////////////////////////////////////////////////
////////////////////// End of Space Key Block /////////////////////
///////////////////////////////////////////////////////////////////





///////////////////////////////////////////////////////////////////
///////////////////// Start of All Keys Block /////////////////////
///////////////////////////////////////////////////////////////////

correct = 0, incorrect = 0, incomplete = 0;
typingArea = document.getElementById("typing-area"),


// This entire block is for updating the border color of the typingArea.
typingArea.onkeydown = function(event) {

	if (event.key == " ")
    	SpaceKeyPressed(event);
    else {
    	spacebarPressed = false;

	    if ( event.key.length == 1 || event.key == "Backspace" ) {

	        if (event.key == "Backspace")
	            val1 = typingArea.value.slice(0,-1);

	        else if (event.key.length == 1)  {
	            val1 = typingArea.value + event.key;

	            if (timer.active == false) {
	            	toggleDialog(0, false);
	            	toggleDialog(1, false);
                    timer.start(timerCallback, -1);
	            }
	        }

	        if (timer.active) {
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
}

// This block is simply used to reset the value after spacebar is pressed.
typingArea.onkeyup = function(event) {
	spacebarPressed = false;

    if (typingArea.value == " ") {
        typingArea.value = "";
    }
}

///////////////////////////////////////////////////////////////////
////////////////////// End of All Keys Block //////////////////////
///////////////////////////////////////////////////////////////////





///////////////////////////////////////////////////////////////////
////////////////// Start of Other Functions Block /////////////////
///////////////////////////////////////////////////////////////////

function convert(timeLabel=null, returnNums=null) {
    if (timeLabel == null) {
        c = true;
        timeLabel = timer.seconds;
    } else
        c = false;

    h = parseInt(timeLabel / (60*60));
    m = parseInt(timeLabel / 60) - (60*h);
    s = timeLabel - (60 * m) - (60*60*h);

    if (returnNums) return [h, m, s];

    time = `${h}h ${m}m ${s}s`;
    // if (c) time = "Time: " + time;

    return time
}

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

function toggleDialog(n, condition=null) {
    dialogs = document.getElementsByTagName('dialog');

    dialog = dialogs[n];

    if (condition == null)
    	condition = !dialog.getAttribute('open');

    for (d of dialogs) {
    	d.removeAttribute('open');
    }

    if (condition)
        dialog.setAttribute('open', 'open');
    else
    	dialog.removeAttribute('open');
}

Number.prototype.round = function (dp=0) {
    return +(Math.round(this + "e+" + dp) + "e-" + dp);
}

///////////////////////////////////////////////////////////////////
/////////////////// End of Other Functions Block //////////////////
///////////////////////////////////////////////////////////////////