let time = 0;  
let stars = [];
let particles = [];

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
  let cameraTargetY = rocketY;

  // Freeze the camera and make the rocket shoot forward (upwards)
  if (time > 880) {
    cameraTargetY = -100 + 880 * 2;
    let dt = time - 880;
    rocketY = cameraTargetY - (dt * dt * 0.2); // Moves negative Y to shoot up the screen
  }

  let rocketRotate = sin(time * 0.1) * 0.05;

  let transitionPoint = 300;
  let t = constrain(time / transitionPoint, 0, 1);
  let camX1 = bezierPoint(0, 150, -100, 0, time * 0.005);
  let camY1 = bezierPoint(100, 50, 20, 0, time * 0.005);
  let camZ1 = 150 - time * 2;

  let camX2 = 0;
  let camY2 = cameraTargetY - 150;  
  let camZ2 = 200; 

  let camX = lerp(camX1, camX2, t);
  let camY = lerp(camY1, camY2, t);
  let camZ = lerp(camZ1, camZ2, t);

  camera(camX, camY, camZ, 0, cameraTargetY, 0, 0, 1, 0);

  ambientLight(70, 70, 70);
  directionalLight(255, 255, 255, -1, 1, -1);
  pointLight(255, 200, 150, 0, rocketY - 100, 200); // Main light
  let glowIntensity = map(noise(time * 0.5), 0, 1, 150, 255);
  pointLight(glowIntensity, glowIntensity * 0.4, 0, 0, rocketY + 100, 0); // Pulsing Engine glow
  noStroke();

  //stars
  fill(255, 255, 100);
  for (let s of stars) {
    s.y += s.speed;
    // Stars wrap around the camera, not the rocket, so they stay visible when rocket leaves
    let rY = s.y - cameraTargetY;
    if (rY > 1000) {
      s.y = cameraTargetY - 1000;
      s.x = random(-1000, 1000);
      s.z = random(-800, 800);
    } else if (rY < -1000) {
      s.y = cameraTargetY + 1000;
      s.x = random(-1000, 1000);
      s.z = random(-800, 800);
    }
    push();
    translate(s.x, s.y, s.z);
    let blink = map(sin(time * 0.1 + s.x), -1, 1, 0.2, 1.5);
    scale(blink);
    sphere(2);
    pop();
  }

  push();
  translate(0, rocketY, 0);
  rotateZ(rocketRotate);

  // Make the rocket metallic and shiny
  specularMaterial(255);
  shininess(40);

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

  // 4 symmetrical fins
  fill(200, 0, 0);
  for (let i = 0; i < 4; i++) {
    push();
    rotateY((PI / 2) * i);
    translate(22, 10, 0);
    rotateZ(PI / 2);
    box(10, 30, 5);
    pop();
  }
  
  
  fill(70, 70, 70);
  push();
  translate(0, 45, 0);
  cylinder(15, 10);
  pop();

  // Engine exhaust ring
  fill(180, 0, 0);
  push();
  translate(0, 25, 0);
  rotateX(PI/ 2);
  torus(15, 2);
  pop();
  
  // Window rim
  fill(150, 150, 150);
  push();
  translate(0, -10, 20);
  rotateX(PI / 2);
  scale(1, 0.3);
  cylinder(13, 2.5);
  pop();

  // Window glass
  fill(100, 200, 255, 220);
  push();
  translate(0, -10, 21);
  rotateX(PI / 2);
  scale(1, 0.3);
  cylinder(10, 2);
  pop();

  // Turn off shininess for the fire
  specularMaterial(0);
  emissiveMaterial(255, 50, 0);

  // Dynamic Fire (Outer layer)
  let fireScale = map(noise(time * 0.5), 0, 1, 0.8, 1.2);
  fill(255, 100, 0, 220);
  push();
  translate(0, 60, 0);
  scale(1, fireScale, 1);
  cone(15, 40);
  pop();

  // Dynamic Fire (Inner layer)
  fill(255, 255, 100);
  push();
  translate(0, 55, 0);
  scale(1, fireScale, 1);
  cone(8, 25);
  pop();
  
  pop();

  // Add smoke particles
  if (frameCount % 2 === 0) {
    particles.push({
      x: random(-8, 8),
      y: rocketY + 70,
      z: random(-8, 8),
      alpha: 200,
      size: random(5, 12),
      speedY: random(2, 4),
      speedX: random(-0.5, 0.5)
    });
  }

  // Update and draw smoke particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.y += p.speedY;
    p.x += p.speedX;
    p.alpha -= 3;
    p.size += 0.3;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }

    push();
    translate(p.x, p.y, p.z);
    fill(180, 180, 180, p.alpha);
    noStroke();
    sphere(p.size, 4, 4); // Low detail sphere for performance
    pop();
  }

  time += 0.5;

  if (time > 1000) {
    noLoop();
  }
}
