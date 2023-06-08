const container = document.getElementById("container"),
      timerDiv = document.getElementById("timer"),
      totalWords = 100,

	  hours = document.getElementById('hours'),
	  minutes = document.getElementById('minutes'),
	  seconds = document.getElementById('seconds');

// Setting up the container with random words.
setup(words, totalWords)

totalSeconds = +(localStorage.getItem('seconds') || 60);

// Setting up the timer.
timer = new Timer();
timer.seconds = totalSeconds;
timerDiv.innerHTML = convert();

hours.value = convert(null, true)[0];
minutes.value = convert(null, true)[1];
seconds.value = convert(null, true)[2];

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