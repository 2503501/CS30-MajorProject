// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let plantingTimer;

let scrollOffest = 0;
let scrollTimer;
let lossTimer;
let bigwavetimer;
let preSunTimer;
let sunTimer;
let readySetPlantStatus = null;
let countdownTimer = 4;
let scrollDirection = "forward";
let scrollMax;
let startscroll = false;
let showbigwave = false;
let backgroundOffset;
let plantOffset;
let tileSize;
let gamestate = "main";
let levelstate = "planting";
let gamemode = null;
let bucketchance = 90;
let conechance = 50;
let endlessTimer = 12000
let lvl1button;
let endlessbutton;

let buttons = [];

let backgroundalpha = 0;

let plantsArray = [];
let zombieArray = [];
let sunArray = [];
let peaArray = [];
let seedArray = [];

let sun_diameter;
let sunAmount = 75;

let mainMenuBackground, housePicture, backgroundFence, lawn, sidewalk, sunimage, peashooterSeed, sunflowerSeed, repeaterSeed, walnutSeed, potatoSeed, readyLogo, setLogo, Plantlogo, trophy, deathscreen, spudow, shovel, shovelseed, bigwave;
let peashooter_gif, sunflower_gif, peamoving_gif, walnutfull_gif,walnuthalf_gif, walnutlow_gif, potatounder_gif, potatoup_gif, potatoexplode_gif, repeater_gif;
let zombiewalk_gif, zombiestill_gif, conewalk_gif, conestill_gif, bucketwalk_gif, bucketstill_gif, zombiedead_gif, zombiehead_gif;

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

// let lvl1 = ["zombie", "end"];
let lvl1 = ["zombie", 27, "zombie", 23, "zombie", 19, "zombie", 3, "zombie", 20, "cone", 19, "zombie", 15, ["cone", "zombie"], 17, "bucket", 6, "zombie", 20, ["cone", "zombie", "zombie"], 9, "zombie", 3, "bucket", 16, "cone", 6, "cone", 4, "zombie", 10, ["bucket", "cone"], 9, "cone", 6, "zombie", 21, "largewave", 4, ["bucket", "cone", "cone", "zombie"], 5, ["bucket", "bucket", "cone", "cone", "zombie"], 5, ["cone", "cone", "zombie", "zombie","zombie"], "end"];
let endless = ["zombie", 27, "zombie", 23, "zombie", 19, "zombie", 3, "zombie", 20, "cone", 19, "zombie", 15, ["cone", "zombie"], 17, "bucket", 6, "zombie", 20, ["cone", "zombie", "zombie"], 9, "zombie", 3, "bucket", 16, "cone", 6, "cone", 4, "zombie", 10, ["bucket", "cone"], 9, "cone", 6, "zombie", 21, "x"];
let levelposition = 0;
let leveltimer;

class Plant{
  constructor(y, x, whatplant, health){
    this.y = y;
    this.x = x; 
    this.plant = whatplant;
    this.health = health;
    this.sunflowerTimer = new Timer(7000);
    this.fireRate = new Timer(1800);
    this.fireRate2 = new Timer(1950);
    this.armtime = new Timer(14000);
    this.explodetimer = new Timer(2000);
    this.explodetimer.pause();
  }
  produceSun(){
    if (this.plant === "sunflower" && this.sunflowerTimer.expired()){
      let newSun = new Sun(random(backgroundOffset + tileSize * this.x, backgroundOffset + tileSize * (this.x + 1) - sun_diameter) , tileSize * (this.y + 1), tileSize * (this.y + 1.65), "plant");
      sunArray.push(newSun);
      this.sunflowerTimer = new Timer(24000);
    }
  }
  attackZombie(){
    if ((this.plant === "peashooter" || this.plant === "repeater") && (this.fireRate.expired() || this.fireRate2.expired())&& gamestate === "adventure"){
      for (let i = 0; i < zombieArray.length; i++){
        if (this.y === zombieArray[i].y && backgroundOffset + plantOffset * -5 + tileSize * this.x <= zombieArray[i].x && zombieArray[i].x <backgroundOffset+ tileSize*9.1){
          let newpea = new Pea(backgroundOffset + plantOffset *3 + tileSize * this.x , this.y );
          peaArray.push(newpea);
          break;
        }
      }
      if (this.fireRate.expired()){
        this.fireRate.start();
      }
      if (this.fireRate2.expired()){
        this.fireRate2 = new Timer(1800);
        this.fireRate2.start();
      }
    }
  }
  updatePotato(){
    if (this.plant === "potatounder" && this.armtime.expired()){
      this.armtime.pause();
      this.plant = "potatoup";
    }
    if (this.plant === "potatoup"){
      for (let i = zombieArray.length - 1; i >= 0; i--){
        if (this.y === zombieArray[i].y && zombieArray[i].x <= (this.x - 0.14) * tileSize + backgroundOffset + plantOffset && zombieArray[i].x >= (this.x -0.96) * tileSize + backgroundOffset + plantOffset){
          zombieArray[i].health = 0;
          this.plant = "potatoexplode";
          this.explodetimer.start();
        }
      }
    }
    if (this.plant === "potatoexplode" && this.explodetimer.expired()){
      this.health = 0;
    }
  }


  updateWalnut(){
    if (this.plant === "walnutfull" && this.health <= 600){
      this.plant = "walnuthalf";
    }
    else if (this.plant === "walnuthalf" && this.health <= 300){
      this.plant = "walnutlow";
    }
  }

  death(arraylocation){
    if (this.health <= 0){
      grid[this.y][this.x] = "0";
      plantsArray.splice(arraylocation, 1);
    }
  }

  display(){
    if (this.plant === "potatoexplode"){
      image(eval(gif_converter(this.plant)), backgroundOffset + plantOffset *0.25  + tileSize * this.x, tileSize -plantOffset *0.5  + tileSize * this.y, tileSize - plantOffset * 0.5  , tileSize + plantOffset * 0.5 );
      image(spudow, backgroundOffset - tileSize *0.12 + tileSize * this.x, tileSize -plantOffset *0.8  + tileSize * this.y, tileSize + plantOffset * 0.3, tileSize * 0.4 );
    }
    else{
      image(eval(gif_converter(this.plant)), backgroundOffset + plantOffset  + tileSize * this.x, tileSize +plantOffset  + tileSize * this.y, tileSize - plantOffset * 2  , tileSize - plantOffset * 2 );
    }
  }
}

class Pea{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.dx = 4;
    this.state = "moving";
    this.hitTimer;
    this.hit = loadImage("images/peahit.png");
  }
  update(arraylocation){
    if (this.state === "moving"){
      this.x += this.dx;
    }
    for (let i = 0; i < zombieArray.length; i++){
      if (this.y === zombieArray[i].y && this.x > zombieArray[i].x +tileSize * 0.62 && this.x < zombieArray[i].x + tileSize +tileSize * 0.64 && (zombieArray[i].state === "walk" || zombieArray[i].state === "attack")  && this.state === "moving"){
        this.state = "hit";
        zombieArray[i].health -= 10;
        this.hitTimer =  new Timer(100);
        this.hitTimer.start();
      }
    }
    if (this.state === "hit"){
      if (this.hitTimer.expired()){
        peaArray.splice(arraylocation, 1);
      }
    }
    
    // if the pea goes off the screen, remove it from the array
    if (this.x > width + tileSize * 5){
      peaArray.splice(arraylocation, 1);
    }
  }
  display(){
    if (this.state === "moving"){
      image(peamoving_gif, this.x, (this.y - 0.2) * tileSize + tileSize * 1.5);
    }
    else if (this.state === "hit"){
      image(this.hit, this.x, (this.y - 0.2) * tileSize + tileSize * 1.5);
    }
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
  constructor(x, y, whatzombie, health, speed, eatingimage){
    this.x = x;
    this.y = y; 
    this.zombie = whatzombie;
    this.health = health;
    this.dx = speed;
    this.state = "walk";
    this.deadtimer = new Timer(2000);
    this.zombiedeath = loadImage("images/zombiedie.gif");
    this.zombiehead = loadImage("images/zombiehead.gif");
    this.zombieeating = loadImage(eatingimage);
    this.maxhealth = health;
  }
  update(arraylocation){
    if (this.state === "walk"){
      this.x -= this.dx;
      if (this.health <= 0){
        this.state = "dead";
        this.zombiedeath.reset();
        this.zombiehead.reset();
        this.deadtimer.start();
      }
      for (let i = 0; i < plantsArray.length; i++){
        if (this.y === plantsArray[i].y && this.x < (plantsArray[i].x - 0.15) * tileSize + backgroundOffset + plantOffset && this.x > (plantsArray[i].x -0.95) * tileSize + backgroundOffset + plantOffset){
          this.state = "attack";
          break;
        }
      }
    }
    if (this.state === "attack"){
      this.state = "walk";
      for (let i = 0; i < plantsArray.length; i++){
        if (this.y === plantsArray[i].y && this.x < (plantsArray[i].x - 0.1) * tileSize + backgroundOffset + plantOffset && this.x > (plantsArray[i].x -0.75) * tileSize + backgroundOffset + plantOffset){
          this.state = "attack";
          plantsArray[i].health -= 0.4;
        }
      }
      if (this.health <= 0){
        this.state = "dead";
        this.zombiedeath.reset();
        this.zombiehead.reset();
        this.deadtimer.start();
      }
    }

    if (this.state === "dead"){
      if (this.deadtimer.expired()){
        zombieArray.splice(arraylocation,1);
      }
    }
    
    if (this.x < tileSize * 1.2){
      this.state = "attack";
    }

  }

  checkforlose(position){
    if (gamestate === "adventure"){
      if (this.x < tileSize * 1.2){

        plantsArray = [];
        sunArray = [];
        resetGrid();
        potatoSeed.countdown = 0;
        peashooterSeed.countdown = 0;
        sunflowerSeed.countdown = 0;
        walnutSeed.countdown = 0;
        repeaterSeed.countdown = 0;
        peaArray = [];
        gamestate = "lose";
        levelposition = 0;
        lossTimer.start();
        //PLAYSOUND
        let tempzombie = zombieArray[position];
        zombieArray = [];
        zombieArray.push(tempzombie);
      }
    }
  }
  
  display(){
    if (this.state === "walk"){
      image(eval(gif_converter(this.zombie + this.state)), this.x, this.y * tileSize + tileSize * 5/8, tileSize * 1.45, tileSize+ tileSize * 3/8);
      fill("red");
      rect(this.x + tileSize *0.625, this.y * tileSize + tileSize * 5.5/8, tileSize * 0.5 * (this.health/this.maxhealth), tileSize*0.1);
    }
    else if (this.state === "attack"){
      image(this.zombieeating, this.x, this.y * tileSize + tileSize * 5/8, tileSize * 1.45, tileSize+ tileSize * 3/8);
      fill("red");
      rect(this.x + tileSize *0.625, this.y * tileSize + tileSize * 5.5/8, tileSize * 0.5 * (this.health/this.maxhealth), tileSize*0.1);
    }
    else if (this.state === "dead"){
      image(this.zombiedeath, this.x, this.y * tileSize + tileSize * 5/8, tileSize * 1.45, tileSize+ tileSize * 3/8);
      image(this.zombiehead, this.x + tileSize * 0.7, this.y * tileSize + tileSize * 5/8, tileSize *1.1, tileSize*1.3);
    }
    
  }

}

function preload(){
  mainMenuBackground = loadImage("images/mainmenu.jpg");
  housePicture = loadImage("images/house.jpg");
  backgroundFence = loadImage("images/fence.jpg");
  lawn = loadImage("images/lawn.PNG");
  sidewalk = loadImage("images/sidewalkextended.jpg");
  sunimage = loadImage("images/Sun.gif");
  peashooterSeed = loadImage("images/peashooterseed.png");
  sunflowerSeed = loadImage("images/sunflowerseed.png");
  walnutSeed = loadImage("images/waltnutseed.PNG");
  repeaterSeed = loadImage("images/repeaterseed.PNG");
  potatoSeed = loadImage("images/potatoseed.PNG");
  readyLogo = loadImage("images/ready.png");
  setLogo = loadImage("images/set.png");
  Plantlogo = loadImage("images/plant.png");
  trophy = loadImage("images/trophy.png");
  deathscreen = loadImage("images/deathscreen.png");
  spudow = loadImage("images/spudow.png");
  shovelseed = loadImage("images/shovelseed.png");
  bigwave = loadImage("images/largewave.png");
  
  peashooter_gif = loadImage("images/Peashooter.gif");
  sunflower_gif = loadImage("images/Sunflower.gif");
  peamoving_gif = loadImage("images/peashot.png");
  walnutfull_gif = loadImage("images/WallNut.gif");
  walnuthalf_gif = loadImage("images/Wallnutcracked1.gif");
  walnutlow_gif = loadImage("images/Wallnutcracked2.gif");
  potatoup_gif = loadImage("images/potato.gif");
  potatoexplode_gif = loadImage("images/potatoexplode.png");
  potatounder_gif = loadImage("images/potatounder.png");
  repeater_gif = loadImage("images/Repeater.gif");

  zombiestill_gif = loadImage("images/zombiestill.gif");
  zombiewalk_gif = loadImage("images/zombiewalk.gif");
  conestill_gif = loadImage("images/conestill.gif");
  conewalk_gif = loadImage("images/conewalk.gif");
  bucketstill_gif = loadImage("images/bucketstill.gif");
  bucketwalk_gif = loadImage("images/bucketwalk.gif");
  zombiedead_gif = loadImage("images/zombiedie.gif");
  zombiehead_gif = loadImage("images/zombiehead.gif");
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
  sunTimer.pause();
  plantingTimer = new Timer(14000);
  plantingTimer.pause();
  leveltimer = new Timer(10);
  leveltimer.pause();
  lossTimer = new Timer(5500);
  lossTimer.pause();
  bigwavetimer = new Timer(3500);
  bigwavetimer.pause;

  seedArray.push(potatoSeed);
  seedArray.push(peashooterSeed);
  seedArray.push(sunflowerSeed);
  seedArray.push(walnutSeed);
  seedArray.push(repeaterSeed);
  potatoSeed.x = 3;
  peashooterSeed.x = 0;
  sunflowerSeed.x = 1;
  walnutSeed.x = 2; 
  repeaterSeed.x = 4;
  potatoSeed.countdown = 0;
  peashooterSeed.countdown = 0;
  sunflowerSeed.countdown = 0;
  walnutSeed.countdown = 0;
  repeaterSeed.countdown = 0;

  lvl1button = createButton("adventure Level");
  lvl1button.position(width * 0.512, height* 0.15);
  lvl1button.size(width * 0.4, height * 0.13);
  lvl1button.style("background-color", color(73,76,93));
  lvl1button.style("font-size", "24px", "color", "#ffffff");
  buttons.push(lvl1button);

  endlessbutton = createButton("Endless mode");
  endlessbutton.position(width * 0.512, height* 0.3);
  endlessbutton.size(width * 0.4, height * 0.13);
  endlessbutton.style("background-color", color(73,76,93));
  endlessbutton.style("font-size", "24px", "color", "#ffffff");
  buttons.push(endlessbutton);
}

function draw() {
  imageMode(CORNER);
  buttonhider();
  background(200);
  sunDroper();
  zombieReader();
  backgroundDrawer(gamestate);
  plantfunctions();
  zombiefunctions();
  peafunctions();
  sunDisplay();
  updateCountdown();
  displayDraggedPiece();
  largewavedisplay();
  displaytrophy();
}

// things that need to be reset on a lose or a win
// plant array, pea array, zombie array, sun array
//planting timer, levelstate to planting, gamestate, level timer


function zombieReader(){
  if (gamestate === "adventure"){
    if (levelstate === "planting"){
      if (plantingTimer.expired()){
        plantingTimer.reset();
        plantingTimer.pause();
        levelstate = "start";
        leveltimer.start();
      }
    }
    else if (levelstate === "start" && leveltimer.expired()){
      if (Number.isInteger(gamemode[levelposition])){
        let tempvalue = gamemode[levelposition] * 1000;
        levelposition++;
        leveltimer = new Timer(tempvalue);
        leveltimer.start();
      }
      else if (Array.isArray(gamemode[levelposition])){
        for (let i = 0; i < gamemode[levelposition].length; i++){
          if (gamemode[levelposition][i][0] === "z"){
            zombiespawner("zombie", 100, "images/zombieattack.gif");
          }
          else if (gamemode[levelposition][i][0] === "c"){
            zombiespawner("cone", 250, "images/coneattack.gif");
          }
          else if (gamemode[levelposition][i][0] === "b"){
            zombiespawner("bucket", 600, "images/bucketattack.gif");
          }
        }
        levelposition++;
        leveltimer = new Timer(10);
        leveltimer.start();
      }
      else{
        if (gamemode[levelposition][0] === "z" || gamemode[levelposition][0] === "c" || gamemode[levelposition][0] === "b"){
          if (gamemode[levelposition][0] === "z"){
            zombiespawner("zombie", 110, "images/zombieattack.gif");
          }
          else if (gamemode[levelposition][0] === "c"){
            zombiespawner("cone", 250, "images/coneattack.gif");
          }
          else if (gamemode[levelposition][0] === "b"){
            zombiespawner("bucket", 600, "images/bucketattack.gif");
          }
          levelposition++;
          leveltimer = new Timer(10);
          leveltimer.start();
        }
        if (gamemode[levelposition][0] === "x"){
          infinitespawner();
        }
        if (gamemode[levelposition][0] === "l"){
          bigwavetimer.start();
          showbigwave = true;
          levelposition++;
          leveltimer = new Timer(10);
          leveltimer.start();
        }
        if (gamemode[levelposition][0] === "e"){
          levelstate = "stopspawning";
          leveltimer = new Timer(10);
          leveltimer.pause();
        }
      }
    }
    else if(levelstate === "stopspawning"){
      if (zombieArray.length === 0){
        levelposition = 0;
        trophy.width = 100;
        trophy.height = 80;
        trophy.x = width/2 - trophy.width/2;
        trophy.y = height/2 - trophy.width/2 - 10;
        trophy.state = "notclicked";
        trophy.dy = -3;
        trophy.acell = +0.1;

        levelstate = "planting";
        gamestate = "win";
        sunTimer.pause;
      }
    }
  }
}

function infinitespawner(){
  for (let i = 0; i < 2; i++){
    let tempnumber = random(0, 100)
    if (tempnumber < conechance){
      zombiespawner("zombie", 100, "images/zombieattack.gif");
    }
    else if (tempnumber >= conechance && tempnumber < bucketchance){
      zombiespawner("cone", 250, "images/coneattack.gif");
    }
    else{
      zombiespawner("bucket", 600, "images/bucketattack.gif");
    }
  }
  if (conechance >=4){
    conechance -= 0.5;
  }
  if (bucketchance >=11){
    bucketchance -= 0.5;
  }
  if (conechance <= 40 && endlessTimer >= 4500){
    endlessTimer -= 100;
  }
  leveltimer = new Timer(endlessTimer);
  leveltimer.start();
  
}

function zombiespawner(zombie, health, attackimage){
  let newzombie = new Zombie(width - tileSize * 0.7, Math.round(random(-0.4, 4.4)), zombie, health, 0.35, attackimage);
  zombieArray.push(newzombie);
}

function peafunctions(){
  for (let i = peaArray.length -1; i >= 0; i--){
    peaArray[i].display();
    peaArray[i].update(i);
  }
}


function plantfunctions(){
  for (let i = plantsArray.length - 1; i >=  0; i--){
    plantsArray[i].produceSun();
    plantsArray[i].attackZombie();
    plantsArray[i].updateWalnut();
    plantsArray[i].updatePotato();
    plantsArray[i].display(i);
    plantsArray[i].death(i);
  }
}

function zombiefunctions(){
  for (let i = zombieArray.length - 1; i >= 0; i--){
    zombieArray[i].checkforlose(i);
    zombieArray[i].update(i);
  }

  //display zombies top to down so that zombies legs will not overlap over a zombies face in another row
  for (let i = 0; i <= 4; i++){
    for (let a = 0; a < zombieArray.length ; a++){
      if (zombieArray[a].y === i){
        zombieArray[a].display(i);
      }
    }
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
      if (x ===0 && sunAmount >= 100 && peashooterSeed.countdown === 0){
        draggedPiece = "peashooter";
        draggedImage = loadImage("images/Peashooter.gif");
      }
      else if (x ===1 && sunAmount >= 50 && sunflowerSeed.countdown === 0){
        draggedPiece = "sunflower";
        draggedImage = loadImage("images/Sunflower.gif");
      }
      else if (x ===2 && sunAmount >= 50 && walnutSeed.countdown === 0){
        draggedPiece = "walnutfull";
        draggedImage = loadImage("images/WallNut.gif");
      }
      else if (x ===3 && sunAmount >= 25 && potatoSeed.countdown === 0){
        draggedPiece = "potatounder";
        draggedImage = loadImage("images/potato.gif");
      }
      else if (x ===4 && sunAmount >= 200 && repeaterSeed.countdown === 0){
        draggedPiece = "repeater";
        draggedImage = loadImage("images/Repeater.gif");
      }
      else if (x ===5 || x ===6){
        draggedPiece = "shovel";
        draggedImage = loadImage("images/shovel.PNG");
      }
    }
  }
  if (gamestate === "win"){
    if (mouseX > trophy.x && mouseX <trophy.x + trophy.width && mouseY > trophy.y && mouseY < trophy.y + trophy.width){
      trophy.state = "clicked";
    }
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
    if (x >= 0 && x <=8 && y >= 0 && y <= 4 && grid[y][x] === "0" && draggedPiece !== "shovel"){
      if (draggedPiece === "peashooter"){
        sunAmount -= 100;
        peashooterSeed.countdown = 5;
        let newplant = new Plant(y, x, draggedPiece, 100); 
        newplant.fireRate2.pause();
        plantsArray.push(newplant);
        grid[y][x] = draggedPiece;
      }
      else if (draggedPiece === "sunflower"){
        sunAmount -= 50;
        sunflowerSeed.countdown = 5;
        let newplant = new Plant(y, x, draggedPiece, 100); 
        plantsArray.push(newplant);
        grid[y][x] = draggedPiece;
      }
      else if (draggedPiece === "walnutfull"){
        sunAmount -= 50;
        walnutSeed.countdown = 35;
        let newplant = new Plant(y, x, draggedPiece, 1000); 
        plantsArray.push(newplant);
        grid[y][x] = draggedPiece;
      }
      else if (draggedPiece === "potatounder"){
        sunAmount -= 25;
        potatoSeed.countdown = 27;
        let newplant = new Plant(y, x, draggedPiece, 100); 
        plantsArray.push(newplant);
        grid[y][x] = draggedPiece;
      }
      else if (draggedPiece === "repeater"){
        sunAmount -= 200;
        repeaterSeed.countdown = 5;
        let newplant = new Plant(y, x, draggedPiece, 100);
        plantsArray.push(newplant);
        grid[y][x] = draggedPiece;
      }
      draggedPiece = null;
      draggedImage = null;
    }
    else if (x >= 0 && x <=8 && y >= 0 && y <= 4 && draggedPiece === "shovel"){
      for (let i = 0; i < plantsArray.length; i++){
        if (plantsArray[i].x === x && plantsArray[i].y === y){
          plantsArray.splice(i,1);
        }
      }
      grid[y][x] = "0";
    }
    draggedPiece = null;
    draggedImage = null;
  }

}

function updateCountdown(){
  for (let i = 0; i <seedArray.length; i++){
    if (seedArray[i].countdown > 0){
      fill(255,255,255, 0);
      text(seedArray[i].countdown, backgroundOffset + tileSize * (seedArray[i].x/2),tileSize*(3/8),tileSize*(1/2));
      fill(0,0,0, 150);
      rect(backgroundOffset + tileSize * (seedArray[i].x/2), 0,tileSize*(1/2), tileSize*(3/4));
      if (frameCount % 60 === 0){
        seedArray[i].countdown --;
      }
    }
  }
}


function updateBackgroundStatus(){
  endlessbutton.mouseClicked(endlessbuttonclicked)
  lvl1button.mouseClicked(lvl1ButtonClicked);
}

function buttonhider(){
  for (let i = 0; i < buttons.length; i++){
    buttons[i].hide();
  }
}

function endlessbuttonclicked(){
  gamestate = "pregame";
  gamemode = endless;
  scrollTimer.start();
}

function lvl1ButtonClicked(){
  gamestate = "pregame";
  gamemode = lvl1;
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
    lvl1button.show();
    endlessbutton.show();
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
          scrollTimer.start();
          scrollTimer.pause();
          scrollDirection =  "forward";
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
      plantingTimer.start();
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
    rect(backgroundOffset, 0, tileSize*(1/2)*5, tileSize *(3/4));
    rect(backgroundOffset- tileSize* (2/3), 0 ,tileSize* (2/3), tileSize*(7/8));
    image(shovelseed,backgroundOffset + tileSize*(1/2)*5, 0, tileSize* (2/3), tileSize* (2/3));
    ellipse(backgroundOffset- tileSize* (1/3), tileSize/3, sun_diameter);
    image(sunimage, backgroundOffset- tileSize* (7/12), tileSize/10, sun_diameter, sun_diameter);
    line(backgroundOffset- tileSize* (2/3), tileSize* (2/3),backgroundOffset, tileSize* (2/3));
    fill(255);
    textAlign(CENTER);
    textSize(20);
    text(sunAmount, backgroundOffset- tileSize* (1/3),  tileSize* (13/16));
    image(peashooterSeed, backgroundOffset,0,tileSize*(1/2), tileSize*(3/4));
    image(sunflowerSeed, backgroundOffset + tileSize * (1/2),0,tileSize*(1/2), tileSize*(3/4));
    image(walnutSeed, backgroundOffset + tileSize,0,tileSize*(1/2), tileSize*(3/4));
    image(potatoSeed, backgroundOffset + tileSize * (3/2),0,tileSize*(1/2), tileSize*(3/4));
    image(repeaterSeed, backgroundOffset + tileSize * 2,0,tileSize*(1/2), tileSize*(3/4));
  }
  else if (gamestate === "win"){

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
    rect(backgroundOffset, 0, tileSize*(1/2)*5, tileSize *(3/4));
    rect(backgroundOffset- tileSize* (2/3), 0 ,tileSize* (2/3), tileSize*(7/8));
    image(shovelseed,backgroundOffset + tileSize*(1/2)*5, 0, tileSize* (2/3), tileSize* (2/3));
    ellipse(backgroundOffset- tileSize* (1/3), tileSize/3, sun_diameter);
    image(sunimage, backgroundOffset- tileSize* (7/12), tileSize/10, sun_diameter, sun_diameter);
    line(backgroundOffset- tileSize* (2/3), tileSize* (2/3),backgroundOffset, tileSize* (2/3));
    fill(255);
    textAlign(CENTER);
    textSize(20);
    text(sunAmount, backgroundOffset- tileSize* (1/3),  tileSize* (13/16));
    image(peashooterSeed, backgroundOffset,0,tileSize*(1/2), tileSize*(3/4));
    image(sunflowerSeed, backgroundOffset + tileSize * (1/2),0,tileSize*(1/2), tileSize*(3/4));
    image(walnutSeed, backgroundOffset + tileSize,0,tileSize*(1/2), tileSize*(3/4));
    image(potatoSeed, backgroundOffset + tileSize * (3/2),0,tileSize*(1/2), tileSize*(3/4));
    image(repeaterSeed, backgroundOffset + tileSize * 2,0,tileSize*(1/2), tileSize*(3/4));

  } 
  else if (gamestate === "lose"){
    
    //background images
    fill(255);
    image(lawn, backgroundOffset, tileSize, tileSize*9,tileSize*5);
    image(housePicture, 0, 0, backgroundOffset, height);
    image(backgroundFence, backgroundOffset, 0, tileSize*9, tileSize);
    image(sidewalk,backgroundOffset+ tileSize * 9, 0, width - (backgroundOffset+ tileSize * 9) + 500, height);


    //taskbar with seed packets, and sun counter
    fill(218, 160, 109);
    stroke(144,69,30);
    strokeWeight(4);
    ellipseMode(CENTER);
    rect(backgroundOffset, 0, tileSize*(1/2)*5, tileSize *(3/4));
    rect(backgroundOffset- tileSize* (2/3), 0 ,tileSize* (2/3), tileSize*(7/8));
    image(shovelseed,backgroundOffset + tileSize*(1/2)*5, 0, tileSize* (2/3), tileSize* (2/3));
    ellipse(backgroundOffset- tileSize* (1/3), tileSize/3, sun_diameter);
    image(sunimage, backgroundOffset- tileSize* (7/12), tileSize/10, sun_diameter, sun_diameter);
    line(backgroundOffset- tileSize* (2/3), tileSize* (2/3),backgroundOffset, tileSize* (2/3));
    textAlign(CENTER);
    textSize(20);
    text(sunAmount, backgroundOffset- tileSize* (1/3),  tileSize* (13/16));
    image(peashooterSeed, backgroundOffset,0,tileSize*(1/2), tileSize*(3/4));
    image(sunflowerSeed, backgroundOffset + tileSize * (1/2),0,tileSize*(1/2), tileSize*(3/4));
    image(walnutSeed, backgroundOffset + tileSize,0,tileSize*(1/2), tileSize*(3/4));
    image(potatoSeed, backgroundOffset + tileSize * (3/2),0,tileSize*(1/2), tileSize*(3/4));
    image(repeaterSeed, backgroundOffset + tileSize * 2,0,tileSize*(1/2), tileSize*(3/4));

    fill(0, 0, 0, backgroundalpha);
    rect(0,0, width, height);
    image(deathscreen, width/2 - deathscreen.width/2, height/2 - deathscreen.height/2);

    if (backgroundalpha <= 150){
      backgroundalpha += backgroundalpha + 0.2;
    }
    if (lossTimer.expired()){
      lossTimer.reset();
      lossTimer.pause();
      levelstate = "planting";
      gamestate = "main";
      zombieArray = [];
      backgroundalpha = 0;
    }


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

function displaytrophy(){
  if (gamestate === "win"){
    image(trophy, trophy.x, trophy.y, trophy.width, trophy.height);

    if (trophy.state === "notclicked" && trophy.y <= height/2 - trophy.width/2){
      trophy.y += trophy.dy;
      trophy.dy += trophy.acell;
    }
    if (trophy.state === "clicked"){
      trophy.width += 0.5;
      trophy.height += 0.4;
      trophy.x = width/2 - trophy.width/2;
      trophy.y = height/2 - trophy.width/2 ;
      if (trophy.width > 180){
        gamestate = "main";
        plantsArray = [];
        resetGrid();
        potatoSeed.countdown = 0;
        peashooterSeed.countdown = 0;
        sunflowerSeed.countdown = 0;
        walnutSeed.countdown = 0;
        repeaterSeed.countdown = 0;
        peaArray = [];
        sunArray = [];
        sunAmount = 75;
        gamemode = null;
      }
    }
  }
}

function gif_converter(picname){
  let returner = picname;
  returner = returner + "_gif";
  return returner;
}

function resetGrid(){
  grid = [
    ["0","0","0","0","0","0","0","0","0"],
    ["0","0","0","0","0","0","0","0","0"],
    ["0","0","0","0","0","0","0","0","0"],
    ["0","0","0","0","0","0","0","0","0"],
    ["0","0","0","0","0","0","0","0","0"]
  ];
}

function largewavedisplay(){
  if (showbigwave){
    image(bigwave,width/2 - bigwave.width/2, height/2 - bigwave.height/2);
    if (bigwavetimer.expired()){
      showbigwave = !showbigwave
      bigwavetimer.start();
      bigwavetimer.pause();
    }
  }

}