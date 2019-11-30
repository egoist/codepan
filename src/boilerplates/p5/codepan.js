const W = H = 400;
function setup() {
  createCanvas(W, H);
  background(0);
}
function draw() {
  const middle = W/2;
  const diameter = 10;
  circle(middle,middle,diameter);
}
