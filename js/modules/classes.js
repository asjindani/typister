class Timer {
    constructor() {
        this.paused = true
        this.seconds = 0
        this.time = 0
    }

    start(callback, step=-1) {
        let handler = () => {
            if (!this.paused) {
                this.seconds += step
                callback();
            }
        }
        
        this.paused = false;
        this.interval = setInterval(handler, 1000);
        this.time -= Date.now()
        return true
    }

    pause() {
        this.time += Date.now()
        this.paused = true
    }

    resume() {
        this.time -= Date.now()
        this.paused = false
    }

    stop() {
        this.time += Date.now();
        this.paused = true;
        clearInterval(this.interval);
    }
}

class Word {
    constructor(element) {
        this.elem = element
        this.text = element.innerText
        this.length = this.text.length
    }
}

export { Timer, Word }