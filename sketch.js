// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


let backgroundOffset = 400;
let tileSize;
let gamestate = "main";
let levelSelectButton;
let buttons = [levelSelectButton];

let mainMenuBackground, housePicture, backgroundFence, lawn, sidewalk;

let pieceSelected = false;

let grid = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0]
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  mainMenuBackground = loadImage("mainmenu.jpg");
  housePicture = loadImage("house.jpg");
  backgroundFence = loadImage("fence.jpg");
  lawn = loadImage("lawn.PNG");
  sidewalk = loadImage("sidewalk.jpg");
  
  levelSelectButton = createButton("Select Level");
  levelSelectButton.position(822, 117);

  tileSize = height/6;
}

function draw() {
  background(200);
  drawBackground();
}

function mousePressed(){
  console.log(`${mouseX}, ${mouseY}`);
  updateBackgroundStatus();
  if (!pieceSelected && gamestate === "adventure"){
    let x = Math.floor(mouseX/tileSize - backgroundOffset/tileSize);
    let y = Math.floor(mouseY/tileSize - tileSize /tileSize);
    console.log(`${x}, ${y}`);
  }
}

function drawBackground(){
  if (gamestate === "main"){
    background(mainMenuBackground);
  }
  if (gamestate === "adventure"){
    // for (let x = 0; x < 9; x++){
    //   for (let y = 0; y < 5; y++){
    //     if ((x+y+1 ) % 2){
    //       fill(28,133,30);
    //     }
    //     else{
    //       fill(133,186,68);
    //     }
    //     rect(x*tileSize + backgroundOffset, y*tileSize + height/6, tileSize, tileSize);
    //   }
    // }
    image(lawn, backgroundOffset, tileSize, tileSize*9,tileSize*5);
    image(housePicture, 0, 0, backgroundOffset, height);
    image(backgroundFence, backgroundOffset, 0, tileSize*9, tileSize);
    image(sidewalk,backgroundOffset+ tileSize * 9, 0, width - (backgroundOffset+ tileSize * 9), height);
    fill(218, 160, 109);
    rect(backgroundOffset, 0, tileSize*6, tileSize  -50);
  }
}


function updateBackgroundStatus(){
  if (mouseX >988 && mouseX < 1740 && mouseY >146 && mouseY < 300 && gamestate === "main"){
    gamestate = "adventure";
  }
}