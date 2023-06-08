function Timer() {

    this.active = false;
    // this.step = 0;
    this.seconds = 0;

    this.start = function(callback, step=1) {
        this.active = true;

        this.interval = setInterval( () => {
            
            this.seconds += step;
            callback();

        }, 1000);
    }

    this.stop = function() {
        this.active = null;
        clearInterval(this.interval);
    }

}