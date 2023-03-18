class Star {

    constructor() {
        this.reset();
        this.opacity = 0;
        this.timer = 0;
    }

    display() {
        noStroke();
        colorMode(RGB, 100);
        fill(55, 41, 153, this.opacity);
        circle(this.x, this.y, this.size);

        this.setOpacity();
    }

    setOpacity() {
        this.timer += this.speed;
        this.opacity = (round(abs(sin(radians(this.timer)))*10)/10)*120;

        if (this.opacity == 0) {
            this.reset();
        }
    }

    reset(){
        this.size = random(2, 8);
        this.x = random(width);
        this.y = random(height);
        this.speed = random(0.5, 1);
    }
}