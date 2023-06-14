const container = document.getElementById("container"),
      timerDiv = document.getElementById("timer"),
      totalWords = 100,

	  hours = document.getElementById('hours'),
	  minutes = document.getElementById('minutes'),
	  seconds = document.getElementById('seconds');

function setup() {
correct = 0, incorrect = 0, incomplete = 0;

// Setting up the container with random words.
randomize(words, totalWords)

totalSeconds = +(localStorage.getItem('seconds') || 60);

// Setting up the timer.
timer = new Timer();
timer.seconds = totalSeconds;
timerDiv.innerHTML = convert();

hours.value = convert(null, true)[0];
minutes.value = convert(null, true)[1];
seconds.value = convert(null, true)[2];

// Setting up default values of Results
$("dialog div .content").text("0");
$("#duration .content").text("0h 0m 0s");

// For resetting the formatting
$("#timer").css("color", "black");
$("#typing-area").removeAttr("readonly");
$("#typing-area").css("border-color", "#0ff");
$("#typing-area").val("");

// To close both dialogs
toggleDialog(0, false);
toggleDialog(1, false);
}

setup();

content = document.querySelectorAll('input[type="Number"]')

for (i of content) {
	i.addEventListener('input', function(e) {
		if (!timer.active) {
			timer.seconds = parseInt(hours.value) * 3600 + parseInt(minutes.value) * 60 + parseInt(seconds.value);
			totalSeconds = timer.seconds;
			timerDiv.innerHTML = convert();
			localStorage.setItem('seconds', timer.seconds);
		}
	});

	// i.addEventListener('keyup', function(e) {
	// 	if (parseInt(e.key) == parseInt("")) {
	// 		console.log(this.innerHTML)
	// 		this.innerHTML = this.innerHTML.slice(0, -1)
	// 	}
	// })
}