class Ball {

    constructor() {
        this.size = random(10, 80);
        this.x = random(0, width);
        this.y;
        this.hue = random(100);
        this.opacity = 0;

        this.reflectionSize = 1;
        this.reflectionY;
        this.reflectionOpacity = 20;

        this.posGround;

        this.speed;
    }

    display() {
        this.reflection();

        noStroke();
        colorMode(HSB, 90);
        fill(this.hue, 50, 100, this.opacity);
        circle(this.x, this.y, this.size);

        this.opacityChange();
    }

    move() {
        this.y -= this.speed;
    }

    reflection(){
        noStroke();
        colorMode(HSB, 100);
        fill(this.hue, 100, 100, min(this.reflectionOpacity, this.opacity));
        ellipse(this.x, this.reflectionY, this.size, this.size/4);

        this.reflectionSize = map(this.y, 0, height, 0, 1);
        this.reflectionOpacity = map(this.y, 0, height, 0, 20);
    }

    getStartingY(){
        return this.posGround;
    }

    setPosGround(pos){
        this.posGround = pos;
    }

    setStartingY(){
        if(this.posGround == FRONT){
            this.y = random(height - 75 + this.size/2, height) - this.size/2;
        } else if(this.posGround == BACK){
            this.y = random(height - 150  + this.size/2, height - 75) - this.size/2;
        }

        this.reflectionY = this.y + this.size/2;
        this.speed = (10 + this.size) / 100 + map(this.reflectionY, height - 150, height, 0, 1);
    }

    getPositionY() {
        return this.y;
    }

    getReflexionY(){
        return this.reflectionY;
    }

    setRandomY() {
        this.y = random(height);
    }

    opacityChange() {
        if (this.opacity < 100)
            this.opacity ++;

        
    }

    setOpacity(opacity){
        this.opacity = opacity;
    }
}