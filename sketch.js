// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let testTimer;

let scrollOffest = 0;
let scrollTimer;
let preSunTimer;
let sunTimer;
let readySetPlantStatus = null;
let countdownTimer = 4;
let scrollDirection = "forward";
let scrollMax;
let startscroll = false;
let backgroundOffset;
let plantOffset;
let tileSize;
let gamestate = "main";
let levelSelectButton;
let buttons = [];

let plantsArray = [];
let zombieArray = [];
let sunArray = [];
let peaArray = [];

let sun_diameter;
let sunAmount = 500;

let mainMenuBackground, housePicture, backgroundFence, lawn, sidewalk, sunimage, peashooterSeed, sunflowerSeed, readyLogo, setLogo, Plantlogo;
let peashooter_gif, sunflower_gif, peamoving_gif;
let zombiewalk_gif, zombiestill_gif, zombieattack_gif;

let pieceSelected = false;
let draggedPiece = null;
let draggedImage = null;

const Row = 9;
const Columns = 5;
let grid = [
  ["0","0","0","0","0","0","0","0","0"],
  ["0","0","0","0","0","0","0","0","0"],
  ["0","0","0","0","0","0","0","0","0"],
  ["0","0","0","0","0","0","0","0","0"],
  ["0","0","0","0","0","0","0","0","0"]
];

class Plant{
  constructor(y, x, whatplant, health){
    this.y = y;
    this.x = x; 
    this.plant = whatplant;
    this.health = health;
    this.sunflowerTimer = new Timer(6000);
    this.fireRate = new Timer(1500);
  }
  produceSun(){
    if (this.plant === "sunflower" && this.sunflowerTimer.expired()){
      let newSun = new Sun(random(backgroundOffset + tileSize * this.x, backgroundOffset + tileSize * (this.x + 1) - sun_diameter) , tileSize * (this.y + 1), tileSize * (this.y + 1.65), "plant");
      sunArray.push(newSun);
      this.sunflowerTimer = new Timer(24000);
      this.sunflowerTimer.start();
    }
  }
  attackZombie(){
    if (this.plant === "peashooter" && this.fireRate.expired()){
      for (let i = 0; i < zombieArray.length; i++){
        if (this.y === zombieArray[i].y){
          let newpea = new Pea(backgroundOffset + plantOffset *2.5 + tileSize * this.x , this.y - 0.2);
          peaArray.push(newpea);
        }
      }
      this.fireRate.start();
    }
  }

  display(){
    image(eval(gif_converter(this.plant)), backgroundOffset + plantOffset  + tileSize * this.x, tileSize +plantOffset  + tileSize * this.y, tileSize - plantOffset * 2  , tileSize - plantOffset * 2 );
  }
}

class Pea{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.dx = 4;
    this.state = "moving";
  }
  update(){
    this.x += this.dx;
  }
  display(){
    image(eval(gif_converter("pea" + this.state)), this.x, this.y * tileSize + tileSize * 1.5);
  }
}

class Sun{
  constructor(x, y, targety, mode){
    this.x = x;
    this.y = y;
    this.finishY = targety;
    this.finishX - null;
    this.dy = 1.5;
    this.dx = null;
    this.collected = false;
    this.mode = mode;
    if (mode === "plant"){
      this.velocity = -3;
      this.acell = 0.2;
    }
  }
  update(arraylocation){
    if (this.y <= this.finishY && !this.collected && this.mode === "sky"){
      this.y += this.dy;
    }
    else if (this.y <= this.finishY && !this.collected && this.mode === "plant"){
      this.y += this.dy;
      this.y += this.velocity;
      this.velocity += this.acell;
    }
    if (mouseX >= this.x && mouseX  <= this.x + sun_diameter && mouseY >= this.y && mouseY  <=this.y + sun_diameter && !this.collected){
      this.collected = true;
      this.finishX = backgroundOffset- tileSize* (7/12);
      this.finishY = tileSize/10;
      this.dx = (this.x - this.finishX)/15;
      this.dy = (this.y - this.finishY) /15;
      sunAmount += 25;
    }
    if (this.collected){
      this.x -= this.dx;
      this.y -= this.dy;
      if (this.y < tileSize/10 && this.x < backgroundOffset- tileSize* (7/12)){
        sunArray.splice(arraylocation, 1);
      }
    }
  }
  display(){
    image(sunimage, this.x, this.y , sun_diameter, sun_diameter);
  }
}

class Zombie{
  constructor(x, y, whatzombie, health, speed){
    this.x = x;
    this.y = y; 
    this.zombie = whatzombie;
    this.health = health;
    this.dx = speed;
    this.state = "walk";
  }
  update(){
    this.x -= this.dx;
  }
  
  display(){
    image(eval(gif_converter(this.zombie + this.state)), this.x, this.y * tileSize + tileSize * 5/8, tileSize * 1.45, tileSize+ tileSize * 3/8);
  }

}

function preload(){
  mainMenuBackground = loadImage("images/mainmenu.jpg");
  housePicture = loadImage("images/house.jpg");
  backgroundFence = loadImage("images/fence.jpg");
  lawn = loadImage("images/lawn.PNG");
  sidewalk = loadImage("images/sidewalkextended.jpg");
  sunimage = loadImage("images/Sun.gif");
  peashooterSeed = loadImage("images/peashooterseed.PNG");
  sunflowerSeed = loadImage("images/sunflowerseed.png");
  readyLogo = loadImage("images/ready.png");
  setLogo = loadImage("images/set.png");
  Plantlogo = loadImage("images/plant.png");
  
  peashooter_gif = loadImage("images/Peashooter.gif");
  sunflower_gif = loadImage("images/Sunflower.gif");
  peamoving_gif = loadImage("images/peashot.gif");

  zombiestill_gif = loadImage("images/zombiestill.gif");
  zombiewalk_gif = loadImage("images/zombiewalk.gif");
  zombieattack_gif = loadImage("images/zombieattack.gif");

}

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
  scrollMax =  backgroundOffset+ tileSize * 9 - 500;

  scrollTimer = new Timer(1500);
  sunTimer = new Timer(9500);
  testTimer = new Timer(9500);

  levelSelectButton = createButton("Select Level");
  levelSelectButton.position(width * 0.512, height* 0.15);
  levelSelectButton.size(width * 0.4, height * 0.13);
  levelSelectButton.style("background-color", color(73,76,93));
  levelSelectButton.style("font-size", "24px", "color", "#ffffff");
  buttons.push(levelSelectButton);
}

function draw() {
  imageMode(CORNER);
  buttonhider();
  background(200);
  sunDroper();
  zombiespawner();
  backgroundDrawer(gamestate);
  plantfunctions();
  zombiefunctions();
  peafunctions();
  sunDisplay();
  displayDraggedPiece();
}

function zombiespawner(){
  if (gamestate === "adventure"){
    if (testTimer.expired()){
      let newzombie = new Zombie(width - tileSize * 1/3, Math.round(random(-0.4, 4.4)), "zombie", 100, 0.3);
      zombieArray.push(newzombie);
      testTimer.start();
    } 
  }
}

function peafunctions(){
  for (let i = peaArray.length -1; i >= 0; i--){
    peaArray[i].update();
    peaArray[i].display();
  }
}


function plantfunctions(){
  for (let i = plantsArray.length - 1; i >=  0; i--){
    plantsArray[i].produceSun();
    plantsArray[i].attackZombie();
    plantsArray[i].display(i);
  }
}

function zombiefunctions(){
  for (let i = zombieArray.length - 1; i >=  0; i--){
    zombieArray[i].update();
    zombieArray[i].display();
  }
}



function mousePressed(){
  // console.log(`${mouseX}, ${mouseY}`);
  updateBackgroundStatus();
  if (!pieceSelected && gamestate === "adventure"){

    let x = Math.floor(mouseX/(tileSize * (1/2)) - backgroundOffset/(tileSize * (1/2)));
    let y = Math.floor(mouseY/(tileSize * 3/4));
    let seedclicked = x >= 0 && x <=5 && y === 0;
    if (seedclicked){

      //peashooter
      if (x ===0 && sunAmount >= 100){
        draggedPiece = "peashooter";
        draggedImage = loadImage("images/Peashooter.gif");
      }
      else if (x ===1 && sunAmount >= 50){
        draggedPiece = "sunflower";
        draggedImage = loadImage("images/Sunflower.gif");
      }
    }


    // console.log(`${x}, ${y}`);
  }
}

function mouseDragged() {
  if(draggedImage) {
    draggedImage.x = mouseX;
    draggedImage.y = mouseY;
  }
}

function mouseReleased() {
  let x = Math.floor(mouseX/tileSize - backgroundOffset/tileSize);
  let y = Math.floor(mouseY/tileSize - tileSize /tileSize);
  if(draggedImage) {
    if (x >= 0 && x <=8 && y >= 0 && y <= 4 && grid[y][x] === "0"){
      if (draggedPiece === "peashooter"){
        sunAmount -= 100;
        let newplant = new Plant(y, x, draggedPiece, 100); 
        newplant.fireRate.start();
        plantsArray.push(newplant);
        grid[y][x] = draggedPiece;
      }
      else if (draggedPiece === "sunflower"){
        sunAmount -= 50;
        let newplant = new Plant(y, x, draggedPiece, 100); 
        newplant.sunflowerTimer.start();
        plantsArray.push(newplant);
        grid[y][x] = draggedPiece;
      }
    }
    draggedPiece = null;
    draggedImage = null;
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
  gamestate = "pregame";
  scrollTimer.start();
}

function sunDroper(){
  if (gamestate === "adventure"){
    if (sunTimer.expired()){
      let newSun = new Sun(random(backgroundOffset, tileSize * 9 + backgroundOffset), 0, random(tileSize * 1.25, tileSize* 4.75), "sky");
      sunArray.push(newSun);
      sunTimer.start();
    }
  }

}

function sunDisplay(){
  for (let i = sunArray.length - 1; i >=  0; i--){
    sunArray[i].display();
    sunArray[i].update(i);
  }
}



function backgroundDrawer(whichbackground){
  if (whichbackground === "main"){
    background(mainMenuBackground);
    levelSelectButton.show();
  }
  else if (whichbackground === "pregame"){
    image(lawn,scrollOffest + backgroundOffset, tileSize, tileSize*9,tileSize*5);
    image(housePicture,scrollOffest + 0, 0, backgroundOffset, height);
    image(backgroundFence,scrollOffest + backgroundOffset, 0, tileSize*9, tileSize);
    image(sidewalk,scrollOffest + backgroundOffset+ tileSize * 9, 0, width - (backgroundOffset+ tileSize * 9) + 500, height);
    if (scrollTimer.expired()){
      startscroll = true;
    }
    if (startscroll){
      if (scrollDirection === "forward" && scrollMax <= scrollOffest + backgroundOffset+ tileSize * 9){
        scrollOffest -= 8;  
        if (scrollMax >= scrollOffest + backgroundOffset+ tileSize * 9){
          scrollDirection = "backwards";
        }
      }
      else if ( scrollDirection === "backwards" && scrollOffest <= 0){
        scrollOffest+= 8;
        if (scrollOffest >= -10){
          scrollOffest = 0;
          gamestate = "readysetplant";
          readySetPlantStatus = "ready";
        }
      }
    }
  }
  else if (gamestate === "readysetplant"){
    image(lawn, backgroundOffset, tileSize, tileSize*9,tileSize*5);
    image(housePicture, 0, 0, backgroundOffset, height);
    image(backgroundFence, backgroundOffset, 0, tileSize*9, tileSize);
    image(sidewalk,backgroundOffset+ tileSize * 9, 0, width - (backgroundOffset+ tileSize * 9) + 500, height);
    displayreadysetPlant(readySetPlantStatus);

    if (frameCount % 60 === 0 && countdownTimer >= 3){
      countdownTimer --;
      if (frameCount % 60 === 0 && countdownTimer < 3){
        readySetPlantStatus = "set";
      }
    }
    else if (frameCount % 60 === 0 && countdownTimer === 2){
      countdownTimer --;
      readySetPlantStatus = "plant";
    }
    else if (frameCount % 60 === 0 && countdownTimer === 1){
      gamestate = "adventure";
      sunTimer.start();
      testTimer.start();
      countdownTimer = 4;
      readySetPlantStatus = null;
    }

  }
  else if (gamestate === "adventure"){

    //background images
    image(lawn, backgroundOffset, tileSize, tileSize*9,tileSize*5);
    image(housePicture, 0, 0, backgroundOffset, height);
    image(backgroundFence, backgroundOffset, 0, tileSize*9, tileSize);
    image(sidewalk,backgroundOffset+ tileSize * 9, 0, width - (backgroundOffset+ tileSize * 9) + 500, height);


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
    image(sunflowerSeed, backgroundOffset + tileSize * (1/2),0,tileSize*(1/2), tileSize*(3/4));
  }
}

function displayDraggedPiece(){
  if (draggedImage){
    imageMode(CENTER);
    image(draggedImage, draggedImage.x, draggedImage.y, tileSize - plantOffset * 2, tileSize - plantOffset * 2);
  }
}

function displayreadysetPlant(status){
  if (status === "ready"){
    image(readyLogo, width/2 - readyLogo.width/2, height * 1/3);
  }
  else if (status === "set"){
    image(setLogo, width/2 - readyLogo.width/2, height * 1/3);
  }
  else if (status === "plant"){
    image(Plantlogo, width/2 - readyLogo.width/2, height * 1/3);
  }
}


function gif_converter(picname){
  let returner = picname;
  returner = returner + "_gif";
  return returner;
}
