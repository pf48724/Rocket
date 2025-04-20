let time = 0;  
let stars = [];

function setup() {
  createCanvas(600, 600, WEBGL);
  
  let fov = 60.0; 
  perspective(PI * fov / 180.0, width / height, 0.1, 2000);

  for (let i = 0; i < 2000; i++) {
    stars.push({
      x: random(-1000, 1000),
      y: random(-1000, 1000),
      z: random(-800, 800),
      speed: 2
    });
  }
}

function draw() {
  background(10, 10, 30);  
  
  let rocketY = -100 + time * 2;
  let rocketRotate = sin(time * 0.1) * 0.05;

  let transitionPoint = 300;
  let t = constrain(time / transitionPoint, 0, 1);
  let camX1 = bezierPoint(0, 150, -100, 0, time * 0.005);
  let camY1 = bezierPoint(100, 50, 20, 0, time * 0.005);
  let camZ1 = 150 - time * 2;

  let camX2 = 0;
  let camY2 = rocketY - 150;  
  let camZ2 = 200; 

  let camX = lerp(camX1, camX2, t);
  let camY = lerp(camY1, camY2, t);
  let camZ = lerp(camZ1, camZ2, t);

  camera(camX, camY, camZ, 0, rocketY, 0, 0, 1, 0);

  ambientLight(50, 50, 50);
  pointLight(255, 255, 255, 0, -100, 200);
  noStroke();

  //stars
  fill(255, 255, 100);
  for (let s of stars) {
    s.y += s.speed;
    let rY = s.y - rocketY;
    if (rY > 1000) {
      s.y = rocketY - 1000;
      s.x = random(-1000, 1000);
      s.z = random(-800, 800);
    } else if (rY < -1000) {
      s.y = rocketY + 1000;
      s.x = random(-1000, 1000);
      s.z = random(-800, 800);
    }
    push();
    translate(s.x, s.y, s.z);
    sphere(2);
    pop();
  }

  push();
  translate(0, rocketY, 0);
  rotateZ(rocketRotate);

  //body
  fill(100, 120, 140);
  push();
  translate(0, 0, 0);
  cylinder(20, 80);
  pop();
  
  // tip
  fill(200, 0, 0);
  push();
  translate(0, -55, 0);
  rotateX(PI);
  cone(20, 30);
  pop();

  fill(200, 0, 0);
  push();
  translate(22, 10, 0);
  rotateZ(PI / 2);
  box(10, 30, 5);
  pop();

  fill(200, 0, 0);
  push();
  translate(-22, 10, 0);
  rotateZ(PI / 2);
  box(10, 30, 5);
  pop();
  
  
  fill(70, 70, 70);
  push();
  translate(0, 45, 0);
  cylinder(15, 10);
  pop();

  let fire = map(sin(time * 0.3), -1, 1, 30, 50);
  fill(255, 150, 0);
  push();
  translate(0, 55, 0);
  cone(15, fire);
  pop();

  fill(180, 0, 0);
  push();
  translate(0, 25, 0);
  rotateX(PI/ 2);
  torus(15, 2);
  pop();
  
  fill(0, 0, 255, 50);
  push();
  translate(0, -10, 21);
  rotateX(PI / 2);
  scale(1, 0.3);
  cylinder(10, 2);
  pop();
  
  pop();

  time += 0.5;

  if (time > 1000) {
    noLoop();
  }
}
