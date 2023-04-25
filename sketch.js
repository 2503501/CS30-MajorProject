// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


let backgroundOffset = 100;
let tileSize;
let gamestate = "main";
let mainMenuBackground;

function setup() {
  createCanvas(windowWidth, windowHeight);
  mainMenuBackground = loadImage("mainmenu.jpg");
  tileSize = height/6;
}

function draw() {
  background(200);
  drawBackground();
}

function mousePressed(){
  updateBackgroundStatus()
}

function drawBackground(){
  if (gamestate === "main"){
    background(mainMenuBackground);
  }
  else{
    for (let x = 0; x < 10; x++){
      for (let y = 0; y < 5; y++){
        if ((x+y+1 ) % 2){
          fill(28,133,30);
        }
        else{
          fill(133,186,68);
        }
        rect(x*tileSize + backgroundOffset, y*tileSize + height/6, tileSize, tileSize);
      }
    }
  }
}


function updateBackgroundStatus(){
  if (mouseX >988 && mouseX < 1740 && mouseY >146 && mouseY < 300 && gamestate === "main"){
    gamestate = "adventure"
  }
}