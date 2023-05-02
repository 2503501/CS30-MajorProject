// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


let backgroundOffset;
let plantOffset;
let tileSize;
let gamestate = "main";
let levelSelectButton;
let buttons = [];

let sun_diameter;
let sunAmount = 50;


let mainMenuBackground, housePicture, backgroundFence, lawn, sidewalk, sunimage, peashooterSeed;
let peashooter_gif;

let pieceSelected = false;

const Row = 9;
const Columns = 5;
let grid = [
  ["peashooter",0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0]
];

function setup() {

  if (windowWidth/windowHeight < 1.9){
    createCanvas(windowWidth, windowWidth/1.9);
  }
  else{
    createCanvas(windowWidth, windowHeight);
  }

  backgroundOffset = width/5;
  tileSize = height/6;
  sun_diameter = tileSize* (1/2);
  plantOffset = tileSize/6;

  mainMenuBackground = loadImage("mainmenu.jpg");
  housePicture = loadImage("house.jpg");
  backgroundFence = loadImage("fence.jpg");
  lawn = loadImage("lawn.PNG");
  sidewalk = loadImage("sidewalk.jpg");
  sunimage = loadImage("Sun.gif");
  peashooterSeed = loadImage("peashooterseed.PNG");
  
  peashooter_gif = loadImage("Peashooter.gif");

  levelSelectButton = createButton("Select Level");
  levelSelectButton.position(width * 0.512, height* 0.15);
  levelSelectButton.size(width * 0.4, height * 0.13);
  levelSelectButton.style("background-color", color(73,76,93));
  levelSelectButton.style("font-size", "24px", "color", "#ffffff");
  buttons.push(levelSelectButton);

}

function draw() {
  buttonhider();
  background(200);
  backgroundDrawer(gamestate);
  
}

function mousePressed(){
  // console.log(`${mouseX}, ${mouseY}`);
  updateBackgroundStatus();
  if (!pieceSelected && gamestate === "adventure"){
    let x = Math.floor(mouseX/tileSize - backgroundOffset/tileSize);
    let y = Math.floor(mouseY/tileSize - tileSize /tileSize);

    // console.log(`${x}, ${y}`);
  }
}


function updateBackgroundStatus(){
  levelSelectButton.mouseClicked(levelSelectButtonClicked);
}

function buttonhider(){
  for (let i = 0; i < buttons.length; i++){
    buttons[i].hide();
  }
}

function levelSelectButtonClicked(){
  gamestate = "adventure";
}

function backgroundDrawer(whichbackground){
  if (whichbackground === "main"){
    background(mainMenuBackground);
    levelSelectButton.show();
  }
  else if (whichbackground === "adventure"){

    //background images
    image(lawn, backgroundOffset, tileSize, tileSize*9,tileSize*5);
    image(housePicture, 0, 0, backgroundOffset, height);
    image(backgroundFence, backgroundOffset, 0, tileSize*9, tileSize);
    image(sidewalk,backgroundOffset+ tileSize * 9, 0, width - (backgroundOffset+ tileSize * 9), height);

    //taskbar with seed packets, and sun counter
    fill(218, 160, 109);
    stroke(144,69,30);
    strokeWeight(4);
    ellipseMode(CENTER);
    rect(backgroundOffset, 0, tileSize*(1/2)*6, tileSize *(3/4));
    rect(backgroundOffset- tileSize* (2/3), 0 ,tileSize* (2/3), tileSize*(7/8));
    ellipse(backgroundOffset- tileSize* (1/3), tileSize/3, sun_diameter);
    image(sunimage, backgroundOffset- tileSize* (7/12), tileSize/10, sun_diameter, sun_diameter);
    line(backgroundOffset- tileSize* (2/3), tileSize* (2/3),backgroundOffset, tileSize* (2/3));
    fill(255);
    textAlign(CENTER);
    textSize(20);
    text(sunAmount, backgroundOffset- tileSize* (1/3),  tileSize* (13/16));
    image(peashooterSeed, backgroundOffset,0,tileSize*(1/2), tileSize*(3/4));
    image(eval(gif_converter(grid[0][0])), backgroundOffset +plantOffset + tileSize * 0, tileSize +plantOffset + tileSize * 0, tileSize - plantOffset * 2, tileSize - plantOffset);
    // displayGrid();
  }
}

function displayGrid(){
  for(let y = 0; y < Columns; y++){
    for(let x = 0; x < Row; x++){
      if (grid[y][x] !== "0"){
        // console.log(window[grid[y][x]]);
        image(eval(gif_converter(grid[y][x])), backgroundOffset + tileSize * x, tileSize + tileSize * y, tileSize, tileSize);
      }
    }
  }
}

function gif_converter(picname){
  let returner = picname;
  returner = returner + "_gif";
  return returner;
}