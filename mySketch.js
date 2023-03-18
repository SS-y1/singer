let peoSong; //人声
let backSong; //背景音乐
let amp; //人声的振幅
let amp1; //背景音乐的振幅
let m = 1.25;
let fade = 0;
let ctx;

let fft;
let input;
let wavePos = [];
let animPoint;
let pct = [];
let curveXPoints = [];
let curveYPoints = [];
let circleSize = 350;
let inColor;
let outColor;
let balls = [];
let initialBallNum = 7;
let stars = [];
let initialStarNum = 200;
let lightTimer = 0;
const FRONT = 0;
const BACK = 1;

//预加载
function preload() {
  peoSong = loadSound('peoplevocal.mp3');  //加载人声音乐
  backSong = loadSound('backmusic.mp3');  //加载背景音乐

}

function setup() {
  createCanvas(1600, 900);  //创建画布

  //angleMode(DEGREES);  //angleMode()函数用于设置解释角度的模式。可以将其设置为度或弧度。这里为度
  peoSong.play();  //播放人声音乐
  backSong.play();  //播放背景音乐
  amp = new p5.Amplitude();  //获取人声音频的振幅
  amp.setInput(peoSong);
  amp1 = new p5.Amplitude();  //获取背景音乐音频的振幅
  amp1.setInput(backSong);

  ctx = drawingContext;



    fft = new p5.FFT();
    inColor = color("#333d9e");
    outColor = color("#bbbeff");
    for (let i = 0; i < initialBallNum; i++) {
        let ball = new Ball();
        ball.setPosGround(floor(random(0, 2)));
        ball.setStartingY();
        ball.setRandomY();
        if (balls.length == 0) {
            balls.push(ball);
        }
        else {
            for (let j = 0; j < balls.length; j++) {
                if (ball.getReflexionY() < balls[j].getReflexionY()) {
                    balls.splice(j + 1, 0, ball);
                    break;
                } else {
                    if (j == balls.length - 1) {
                        balls.splice(0, 0, ball);
                        break;
                    }
                }
            }
        }
    }
    for (let i = 0; i < initialStarNum; i++) {
        stars[i] = new Star();
    }
}


function draw() {

  background(0);
    let vol = amp.getLevel(); //返回一个振幅读数

    ctx.shadowBlur=0;

    //Sky
    for (let i = 0; i <= width / 2; i += 50) {
        rectMode(CENTER);
        colorMode(RGB, 255);
        fill(3, 0, 24, map(i, 0, width / 2, 0, 255));
        noStroke();
        rect(width / 2, height / 2, width - i, height - i, 50);
    }
    ctx.shadowBlur = 8+vol*20;
    ctx.shadowColor="#EEE8AA";
    //Stars
    for (let i = stars.length - 1; i >= 0; i--) {
        stars[i].display();
    }
    ctx.shadowBlur = 50;
    ctx.shadowColor="#36207e";

    //Rectangle ground
    fill('#0d0033');
    noStroke();
    rectMode(CENTER);
    rect(width / 2, height - 75, width, 150);

    ctx.shadowBlur = 0;
    for (let i = 0; i <= width / 2; i += 10) {
        colorMode(RGB, 255);
        fill(19, 0, 75, map(i, 0, width / 2, 0, 255));
        rect(width / 2, height - ((150 - i) / 2), width - i, 150 - i, 50);
    }

    // for (let i = 0; i <= width; i += 20) {
    //     fill(255);
    //     rect(i, height - 140, 8, 2, 50);
    // }

    ctx.shadowBlur = 20;
    ctx.shadowColor="#EEE8AA";

    //Background colored balls
    for (let i = balls.length - 1; i >= 0; i--) {
        if (balls[i].getStartingY() == BACK) {
            balls[i].move();

            if (balls[i].getPositionY() <= -balls[i].size) {
                balls.splice(i, 1);

                let ball = new Ball();
                ball.setPosGround(floor(random(0, 2)));
                ball.setStartingY();

                for (let j = balls.length - 1; j >= 0; j--) {
                    if (ball.getReflexionY() < balls[j].getReflexionY()) {
                        balls.splice(j + 1, 0, ball);
                        break;
                    } else {
                        if (j == 0) {
                            balls.splice(j, 0, ball);
                            break;
                        }
                    }
                }
            }

            balls[i].display();
        }
    }

    ctx.shadowBlur = 40;
    ctx.shadowColor="#EEE8AA";

    movingLight();
    push();
    translate(width, 0);
    scale(-1, 1);
    movingLight();
    pop();

    ctx.shadowBlur = 0;
    //Sound visual
    fft.setInput(backSong);
    let wave = fft.waveform();

    if (pct[0] == undefined) {
        //Sets all the initial points value to 0
        for (let i = 0; i < wave.length; i++) {
            pct[i] = 0;
            wavePos[i] = [0, 0];
        }
    }

    //Moves all of the points according to the soundwave
    let pointNum = 10;
    for (let i = 0; i < pointNum; i++) {
        let index = floor(map(i, 0, pointNum, 0, wave.length));

        if (pct[index] == 0) {
            wavePos[index][0] = wavePos[index][1];
            wavePos[index][1] = wave[index];
        }

        animPoint = lerp(wavePos[index][0], wavePos[index][1], pct[index]);
        pct[index] += 0.3;

        if (pct[index] >= 1) {
            pct[index] = 0;
        }

        let amplitude = 350;
        let h = constrain(animPoint * amplitude, 0, 150);
        let a = cos(radians(map(i, 0, pointNum, 0, 360))) * h;
        let o = sin(radians(map(i, 0, pointNum, 0, 360))) * h;

        curveXPoints[i] = width / 2 + a + cos(radians(map(i, 0, pointNum, 0, 360))) * (circleSize/2);
        curveYPoints[i] = height / 2 + o + sin(radians(map(i, 0, pointNum, 0, 360))) * (circleSize/2);
    }
    //Middle circle
    for (let i = 0; i < 10; i += 2) {
        noFill();
        stroke(255, 10 + animPoint * 5);
        strokeWeight(20 + i * 2);
        //circle(width / 2, height / 2, circleSize);
    }

    // stroke(255);
    // strokeWeight(20);
    // circle(width / 2, height / 2, circleSize);

    for (let i = 0; i < 10; i += 2) {
        fill(255, 0.5 + animPoint / 10);
        noStroke();
        ellipse(width / 2, height - 75, circleSize + i * 2, 60 + i * 2);
    }

    ctx.shadowBlur = 20;
    ctx.shadowColor="#EEE8AA";

    //Forground colored balls
    for (let i = balls.length - 1; i >= 0; i--) {
        if (balls[i].getStartingY() == FRONT) {
            balls[i].move();

            if (balls[i].getPositionY() <= -balls[i].size) {
                balls.splice(i, 1);

                let ball = new Ball();
                ball.setPosGround(floor(random(0, 2)));
                ball.setStartingY();

                for (let j = balls.length - 1; j >= 0; j--) {
                    if (ball.getReflexionY() < balls[j].getReflexionY()) {
                        balls.splice(j + 1, 0, ball);
                        break;
                    } else {
                        if (j == 0) {
                            balls.splice(j, 0, ball);
                            break;
                        }
                    }
                }
            }
            balls[i].display();
        }
    }


  strokeWeight(3 * m);
  blendMode(BLEND);

 // push();
    ctx.shadowBlur = 8+vol*20;
    ctx.shadowColor="#EEE8AA";
    ctx.setLineDash([]);
    ctx.shadowBlur = 80+vol*30;
    ctx.shadowBlur = 7+vol*10;
   // pop();
  drawman();  //绘制人动效

}


function drawman(){
    //angleMode(DEGREES);
    let vol = amp.getLevel(); //返回一个振幅读数

    noStroke();
    stroke("#000000");
    strokeWeight(3+vol*8);
    translate(width/2,0);
   // 绘制身体
   push();
    stroke(0);
   // randomSeed(30); //每个渲染步骤都一样
    fill("#B22222");
    ellipse(0, 730 * m, 420 * m, 500 * m);

    //耳朵
    translate(0, (100 - 20 * vol) * m);
    fill("#F5DEB3");
    ellipse(-130, 280 * m, 30 * m, 80 * m);
    ellipse(130, 280 * m, 30 * m, 80 * m);

    //头
    fill("#F5DEB3");
    ellipse(0, 280 * m, 200 * m, 350 * m);

    //头发
    fill("#272727");
    ellipse(-115, 185 * m, 45 * m, 140 * m);
    ellipse(115, 185 * m, 45 * m, 140 * m);
    ellipse(0, 140 * m, 215 * m, 105 * m);

    //眉毛
    line(-80, (240 + vol * 50) * m, -30 * m, (230 + vol * 50) * m);
    line(80, (240 + vol * 50) * m, 30 * m, (230 + vol * 50) * m);


    //眼睛
    //眼白
    fill(255);
    ellipse(-45 * m, 260 * m, 40 * m, (25 - vol * 100) * m);
    ellipse(45 * m, 260 * m, 40 * m, (25 - vol * 100) * m);
    //瞳孔
    noStroke();
    fill("#7D5454");
    ellipse(-45 * m, 260 * m, 20 * m, (21 - vol * 100) * m);
    ellipse(45 * m, 260 * m, 20 * m, (21 - vol * 100) * m);
    stroke(0);
    //眼球
    fill(0);
    ellipse(-45 * m, 260 * m, 3.5 * m, 3.5 * m);
    ellipse(45 * m, 260 * m, 3.5 * m, 3.5 * m);
    //鼻子
    line(0, 280 * m, -18 * m, 340 * m);
    line(10, 340 * m, -18 * m, 340 * m);
    //嘴巴
    fill("#A52A2A");
    translate(0, 30 * m);
    //rotate(0.4);
    ellipse(-3, 360 * m, 75 * m - (vol * 300) * m, (vol * 330) * m);
   pop();

    translate(width/2,height/2);
    //褪色
    push();
    noStroke();
    fill(0, 255 - fade);
    rect(-width / 2, 0, width, height);
    fade+=7;
    pop();

}

function movingLight() {

    let level = amp1.getLevel();

    lightTimer += level*10;
    let spotPosition = sin(radians(lightTimer)) * 250;
    let spotSize = 200;
    noStroke();
    fill(255, 5);
    quad(-10, height / 4,
        spotPosition+120, height - (spotSize/2),
        spotPosition - spotSize, height - (spotSize/2),
        -10, height / 4 + spotSize);

    fill(255, 5 + 5 / 2);
    arc(spotPosition - (spotSize/2)+60, height - (spotSize/2), spotSize+120, 35, 0, PI);
    fill(255, 5 / 2);
    arc(spotPosition - (spotSize/2)+60, height - (spotSize/2), spotSize+120, 35, PI, TWO_PI);

    // let level2 = int(amp.getLevel()*100);
    // if(level>0) {
    //     fill(255, 5);
    //
    //     triangle(width / 2, 0, width / 4, height, width/2, height);
    //
    //
    //
    //
    // }

}

