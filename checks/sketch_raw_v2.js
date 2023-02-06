////////// Checks by Nudemen 2023
////////// K10 / Kuson Chan
console.log("-----  Checks by Nudemen 2023 v2----");
let isDebug=0; // set to 1 for Checks

let seed=document.URL.split('?s=')[1];
if (!seed) { 
  if (!isDebug && !htmlMsg.length) document.getElementById("intro").style.display = "block";
  seed="intro";
}

console.log("seed:"+seed+" length:"+seed.length+" htmlMsg:"+htmlMsg);
////// METADATA (0-1) * max + min
let artID;
let laziness;  //can't >=1.0. //0.995 = barely visible
let time;
let defaultPose;  // walkL_0 walkR_1 runL_2 runR_3 sit_4 standup_5 standStill_6 tapFoot_7 jump_8 dance_9
let isDark;
let spacing;
let unanimity; 

/////
const totalArt=120;
const manWidth=50; 
const offset=0.0;
const offsetMax=manWidth*0.3;
const maxMen=2500;
const borderRatio=0.05;
const totalTones=4;
const dimStep=35;
let bgColor=240;
const minSpeed=manWidth/50;
const runSpeed=minSpeed*3;
let men = []; // array of Nudeman objects
let menImage = []; // PImage and make it 2D in setup
let img; 
let imgW,imgH; //not using
//walk use double frames
let poseName = ["walkL", "walkR","runL","runR","seat","standup","stand","tapFoot","jump","dance"];
let poseTotalFrames=[10,10,4,4,11,11,1,10,15,8];
let poseIsLoop=[true,true,true,true,false,false,false,true,true,true];

let lazyRatio;

let fsBut;

function initMetadata(){
    let attrA=seed.substring(1,11);
    let attrD=seed.substring(11,21);
    let attrU=seed.substring(21,31);
    let attrL=seed.substring(31,41);
    let attrT=seed.substring(41,51);
    let attrS=seed.substring(51,61);
    let attrP=seed.substring(61,71);
   
    let num,totalCommon=6;

    num = int(attrA); if (isNaN(num)) { init404(); return;}
    if (num>500000000) attrA= (num%totalCommon).toString();   
    else attrA= "10"; ///rare 5%

    num = int(attrD); if (isNaN(num)) { init404(); return;}
    if (num>1000000000) attrD="0";
    else attrD="1"; //rare 10%
     
    num = int(attrU); if (isNaN(num)) { init404(); return;}
    attrU= (num%101).toString();
    
    num = int(attrL); if (isNaN(num)) { init404(); return;}
    if (num>7000000000) attrL= "100"; //mostly 30%
    else attrL= (num%100).toString(); 
     
    num = int(attrT); if (isNaN(num)) { init404(); return;}
    attrT= (num%10001).toString();

    num = int(attrS); if (isNaN(num)) { init404(); return;}
    if (num>7000000000) attrS= "100"; //mostly 30%
    else attrS= (num%100).toString(); 
    
    num = int(attrP); if (isNaN(num)) { init404(); return;}
    if (num>7000000000) attrP= "4";  //mostly 30%
    else attrP= (5+num%5).toString();
    

    //testing

    console.log("attr A: "+attrA);
    console.log("attr D: "+attrD);
    console.log("attr U: "+attrU);
    console.log("attr L: "+attrL);
    console.log("attr T: "+attrT);
    console.log("attr S: "+attrS);
    console.log("attr P: "+attrP);



    artID=int(attrA);
    // walkL_0 walkR_1 runL_2 runR_3 sit_4 standup_5 standStill_6 tapFoot_7 jump_8 dance_9
    isDark=int(attrD); //D
    unanimity=int(attrU) / 100.0; //U
    laziness=int(attrL) / 100.0 * 0.5;  //L can't >=1.0. //0.995 = barely visible
    time=int(attrT) / 10000.0 * 0.01 + 0.001; //T
    spacing=int(attrS) / 100.0 * 0.4 + 0.6; //S

 

    defaultPose=int(attrP);  //P

    ///related vars
    lazyRatio=laziness*laziness*0.3; //for allMenGotoWOrk (bigger=unclear)
    updateBg();

}

function init404(){
  artID=404;
  laziness=0.03;
  spacing=0.3;
  defaultPose=4;
  time=0.01;
  unanimity=0.5
  isDark=0;
  ///related vars
  lazyRatio=laziness*laziness*0.3; //for allMenGotoWOrk (bigger=unclear)
  updateBg();
}

function updateBg(){
  bgColor=isDark?40:240;
}

function preload(){
  preloadFrames();

  
  fsBut = loadImage("lib/fs.png");
}

function load404(){
  init404();
  loadArt(createMen); 
}


function loadIntro(){
  artID=1;
  laziness=0.2;
  spacing=2.7;
  defaultPose=4;
  time=0.01;
  unanimity=0.9;
  isDark=0;
  ///related vars
  lazyRatio=laziness*laziness*0.3; //for allMenGotoWOrk (bigger=unclear)
  updateBg();  
  loadArt(createMen); 
}

function loadArt(fYes,fNo){
  //console.log("loading art: "+id);
  img = loadImage("lib/art/"+artID+".png",fYes,fNo);
}

function applyColorTone(){
   ////create color tones dim dim dim
  for (let i=1; i<menImage.length; i++)
  for (let j=0; j<menImage[i].length; j++)
  for (let k=0; k<menImage[i][j].length; k++)
  {
            let im=menImage[i][j][k];  
            let dim=i*dimStep;
            im.loadPixels();
    
             for (let x = 0; x < im.width; x++) {
              for (let y = 0; y < im.height; y++) {
                let loc = (x + y * im.width) * 4;
                im.pixels[loc]-=dim;
                im.pixels[loc+1]-=dim;
                im.pixels[loc+2]-=dim;
              }
            }
            im.updatePixels();
  }
}

function createMen()
{

  
   
  //remove 
  let totalM=men.length;
  for (let i=0; i<totalM; i++) men.pop();

  console.log("Art: "+artID);
   let m=0;
   let maxX=0, minX=10000, maxY=0, minY=10000;
   imgW=imgH=0;
   if (img!=null) {
       img.loadPixels();

       for (let i = 0; i < img.width;i++) {

          let currH=0;
          for (let j = 0; j < img.height;j++) {
              if (m>=maxMen) break;
              //let x,y; 
              //x = int(Math.floor(i/img.width*img.width));
              //y = int(Math.floor(j/img.height*img.height));

              let loc = (i + j*img.width)*4;

              let r=  img.pixels[loc];
              let a=  img.pixels[loc+3];
              let c = color(img.pixels[loc], img.pixels[loc+1], img.pixels[loc+2]);
              let b = brightness(c); // 0-100;

              if (b>=100) b=99; //capped 0-99
              else if (b<0) b=0;
              let t;
              ///t: 0=white 1=yellow 2=brown 3=black
              let totalShades=totalTones+1; //+ bg
              t=totalShades-1-Math.floor(b/(100/totalShades));
              if (!isDark) t--;
              if (t>=0 && t<totalTones && a>0) { // skip bg
                if (m<maxMen) {
                  men.push(new Nudeman(m)); 
                  men[m].workX=i;
                  men[m].workY=j;
                  men[m].t=t;
                  men[m].goAway(true);
                  m++;

                  //calculate new wh
                  if (i>maxX) maxX=i;
                  if (i<minX) minX=i;
                  if (j>maxY) maxY=j;
                  if (j<minY) minY=j;

                }   
              }
              
          } //end for loop j
       } //end for loop i
   } // end if img!=null
   imgW=maxX-minX+1;
   imgH=maxY-minY+1;
   console.log("total men:"+men.length+"-------------");
  
  
  
   //if (isDebug) 
     allMenGotoWork(true); //for Checks
  //else 
    //allMenGoAway(); 
}

function setup() {   
  randomSeed(int(seed)); //deterministic
  initMetadata(seed);
  
  if (htmlMsg=="404") load404();
  else if (seed=="intro") loadIntro();
  else loadArt(createMen,load404);

  applyColorTone();
  createCanvas(windowWidth, windowHeight);
  pixelDensity(displayDensity());
  imageMode(CENTER);
  frameRate(24);
  noStroke();  
  noSmooth(); 
  fill(0);
}


function draw() {
  background(bgColor); 
  for (let i = 0; i < men.length; i++) men[i].display();
  
  if (!fullscreen() && seed!="intro") image(fsBut,width-25, 25); //fs button  

  
  
}

function getAwayPos(){
  let x,y;
  let c=int(random(4));
 
  if (c==0){
    y= 0-manWidth-random(height/2);
    x= random(2*width) - width/2;
  } else if (c==1){
    y= height+manWidth+random(height/2);
    x= random(2*width) - width/2;
  } else if (c==2){
    x=0-manWidth-random(width/2);
    y=random(2*height) - height/2;
  } else {
    x=width+manWidth+random(width/2);
    y=random(2*height) - height/2;
  }

  return {x,y};
}


//////// Nudeman class
class Nudeman {
  constructor(id) {
    this.id = id;
    this.x = this.y = this.toX = this.toY = -200;
    this.workX = 0;
    this.workY = 0;
    this.frame = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.pose = defaultPose;     
    this.power = time/5.0+random(time) + random(time/100);
    this.t = 0;
    this.isArrived=false;
  }
  
  gotoPos(x,y){ //only change speed
    this.isArrived=false;
    this.toX = x;
    this.toY = y;
    this.speedX = (this.toX-this.x)*this.power;
    this.speedY = (this.toY-this.y)*this.power;

    let sign;
    sign=(this.speedX>0)?1:-1;
    if (abs(this.speedX)<minSpeed ) this.speedX=sign*minSpeed;

    sign=(this.speedY>0)?1:-1;
    if (abs(this.speedY)<minSpeed) this.speedY=sign*minSpeed;
    
   
  }
  
  goWork(rightNow){  ///set gotoPos()
     
    
        let sepX, sepY, startX, startY;  
        let shortSide=(width<height)?width:height;
        let border=shortSide*borderRatio;
        sepX=(width-border)/img.width;
        sepY=(height-border)/img.height;
        sepY=sepX=(sepX<sepY)?sepX:sepY;
        

        let maxSep=int(manWidth*spacing);
        if (sepX>maxSep) sepX=sepY=maxSep;
        
        startX=int(manWidth*sepX*0.015+(width-img.width*sepX)/2);
        startY=int(manWidth*sepY*0.01+(height-img.height*sepY)/2);


        let ev=offset*offsetMax;
        let toX=int(this.workX*sepX+startX+random(ev*2)-offsetMax);
        let toY=int(this.workY*sepY+startY+random(ev*2)-offsetMax);
    
        //console.log("startX:"+startX+" starty:"+startY);
        
       if (dist(this.x,this.y,toX,toY)>ev*2*2) { //not at work

        if (this.pose==4 && !rightNow) this.setPose(5);   // standup
        else 
         {

            this.isArrived=false;
            if (rightNow) {
              this.x=this.toX=toX;
              this.y=this.toY=toY; 
            }
            this.gotoPos(toX,toY);
          }
        } else {
          ///// already working
          /// stand up here..

        }
        
    
  }

  goRandomPos(rightNow,isM){
    this.isArrived=false;
    let extraX=0;
    let extraY=0;
    let x=int(random(width+extraX) - extraX/2.0);
    let y=int(random(height+extraY) - extraY/2.0);

    if (isM) {
       x=int(random(width/2.0) - width/4.0 +mouseX);
       y=int(random(height/2.0) - height/4.0 +mouseY);
    }

    if (rightNow) { 
      this.x=this.toX=x;
      this.y=this.toY=y; 
    }
    else this.gotoPos(x,y);
  }


  
  goAway(rightNow) {
    
    this.isArrived=false;
    let pos=getAwayPos();
    let x=int(pos.x);
    let y=int(pos.y);
     
    if (rightNow) { 
      this.x=this.toX=x;
      this.y=this.toY=y; 
    }
    else this.gotoPos(x,y);
  }
  
  isWalking(){
    if (this.pose<=3) return(true);
    else return(false);
  }
  
  setPose(p){
    if (this.pose!=p) {
      this.pose=p;
      this.frame=0;
    }
    
  }
  
  setRandomPose(){

     //// choose another pose
      let r=random(1.0);

      if (r<=unanimity){
          this.setPose(defaultPose);  
      } else {

          if (this.pose==4 && this.frame==poseTotalFrames[this.pose]-1){  ///if still sitting..

              if (r>0.9) this.setPose(5);   // standup

          } else {

            if (r>0.8) this.setPose(4); //sit
            else if (r>0.6) this.setPose(7); //tap foot
            else if (r>0.4) this.setPose(8); //jump
            else if (r>0.2) this.setPose(6); //stand still   
            else this.setPose(9); //dance 
            
          } 
      }
  }

  decideToWork(rightNow) {

    //already finished animation


    if (random(1.0)>laziness) { 
      
        this.goWork();
    }
    else 
      if (random(1.0)<0.05) { //5% -------------------
              if (random(1.0)<0.05) {// 5% go away or stand up
                   if (this.pose==4) this.setPose(5);   // standup
                   else 
                    this.goRandomPos(rightNow);
              }
              else 
                this.setRandomPose(rightNow);
            
    }
  }
  
  
  
  
  
  display() {

    //// move man //////////////////////////////
    if (dist(this.x,this.y,this.toX,this.toY)>minSpeed){ /// if not arrived
      
      ////////// setting moving pose /////////
      if (abs(this.speedX)<runSpeed) {
        if (this.speedX>0) this.pose=1; //walk R
        else this.pose=0; //walk L
        
      } else {
      
        if (this.speedX>0) this.pose=3; //run R
        else this.pose=2; //run L      
      }
      
      this.x += this.speedX;
      this.y += this.speedY;
      
      
       ///check if run exceed 
      if (this.speedX==0 || (this.speedX>0 && this.x>this.toX) || (this.speedX<0 && this.x<this.toX) ) this.x=this.toX;
      if (this.speedY==0 || (this.speedY>0 && this.y>this.toY) || (this.speedY<0 && this.y<this.toY) ) this.y=this.toY;
      
     
      
    } else { //// at position //////////////////////////////
      
      this.x=this.toX;
      this.y=this.toY;
      
      if (!this.isArrived) {
        //just arrived
        this.isArrived=true;
        this.setRandomPose();
        //this.setPose(defaultPose);
      } else {
        //already arrived
         if (!this.isWalking() && this.frame==poseTotalFrames[this.pose]-1) this.decideToWork();
        
      }

    }
    
    /////// animate frame
    if (poseIsLoop[this.pose] && this.frame>=poseTotalFrames[this.pose]) this.frame=0; 
    let tempImg = menImage[this.t][this.pose][this.frame];
    image(tempImg,this.x,this.y);
    if (this.frame<poseTotalFrames[this.pose]-1 || poseIsLoop[this.pose]) this.frame++;
  }
  
  
  
} /// nudemen class


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  allMenGoAway();
}

function mousePressed() {
  
  if (mouseX > width-50 && mouseX < width-10 && mouseY > 10 && mouseY < 50) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
  
  if (seed!="intro" || isDebug) allMenGoAway(false,true);
}


function keyPressed() {
/*
     if (keyCode === 49) { //!
        isDebug = !isDebug;
     }
     else if (isDebug) {  
 
      if (keyCode === RIGHT_ARROW) {
        if (artID>=totalArt-1) artID=0;
        else artID++;
        loadArt(createMen,load404);  
        
      } else if (keyCode === LEFT_ARROW) {
        if (artID<=0) artID=totalArt-1;
        else artID--;
        loadArt(createMen,load404);  
      } else if (keyCode === 32) {

        if (isDark) isDark=0;
        else isDark=1;

        updateBg();

        loadArt(createMen,load404);  
      } 
    }   */
}

function allMenGotoWork(rn){
  
  for (let i = 0; i < men.length; i++) {
    
    if (random(1)>lazyRatio) men[i].goWork(rn);
    else men[i].goRandomPos(rn);

  }
}

function allMenGoAway(rn,isMouse){
  for (let i = 0; i < men.length; i++) 
    men[i].goRandomPos(rn,isMouse);
}

//////////// frames....

function preloadFrames() {
  
 
  for (let i=0; i<totalTones; i++){
let poseImage=[];
  let frames, f1, f2,f3,f4,f5, f6, f7, f8, f9, f10, f11;
  //walkL 
  f1="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkIxMDBFOUNGOTQwMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkIxMDBFOURGOTQwMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyQjEwMEU5QUY5NDAxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyQjEwMEU5QkY5NDAxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhXDRI8AAAGBSURBVHja7NtNasJAFAfwvDTLrtyU6kFEj6AH8CZ1ZRfd6U261x4h0oOouOmq2/jsCCljQCr63pvM9D8QENQwP99XEpCYOUth5VkiCxBAAAEEEEAAAQQQQAABBBBAAAEEEEAACbgKzZMT0e/zWGamJCLiUD4sKkhVzk8HaqRtEIuomEVEG4PUuurkg5ezlqvZgtUj4mMO6wUnk1pamDzExjUwphHZf33H37Uc4qnzGCdEs7gxR25d7x+ff86XKCCTUR+pBUiM88M8IpozxPzqFzXSVkj0F41IrTZALFqvOmS3emUrnElqac8Qdcjz+I0sEEGKXatm0LX+NSSJpyjNJhAVJMmnKNoT3gRicV+Sp5BWpqnlF/ilazDMEWuIRttVhVjXh0lEmh2rjop0naBG/EVE3frw0+phOO3579WHBqSQQFTlfHPt57fL2cb/LjNvWwFxG/nZUM+99kEuGpcAzR9CAkNSf3G9J2UkIMGLXSq18pAbkkKIphbu2YXWUYABALLXk6b+N824AAAAAElFTkSuQmCC";

  f2= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkIxMDBFOThGOTQwMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkIxMDBFOTlGOTQwMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyQjEwMEU5NkY5NDAxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyQjEwMEU5N0Y5NDAxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpztUegAAAF4SURBVHja7Jo9bsJAEIU9hJIqDYIcBMERwgG4CVRQpCM3oQeO4CgHwYgmVVqzYSMRGUSEsXfGO6M30jaWbM3nN3+7NjnnEgvWSowYQAACEIAABCAAAQhAAAIQgAAEIAABCEAAApAGrc35cCL6O491zpEJRTxUEUwVSJ4ufxdyJDYQCVXEFOGGQWiVevhwelFyOUswuyJFmOPHuzMTWlwwrSYc54ARVeTw9a2/anmI7nNHJwhncqOPVLXV9vNuf1EBMnkdILQAorF/iCvC2UPEp1/kSKwgKodGiURHaJW1/WbhJCqWKUWI+3fZW4mtcmg0W365miQUiW1kwZ4ds5YFELVnv6b2I9fTr1dF7dmvh7kFZKaPhIQRA+mN38jciMLxFauxPhIaptGGGDLMgoMQUb+4/rvu11mJp9HsJSqQouPesvV8d++eM8T1vY8ay29OZQDydLkLoQTbnr3Omz35kkWTI1WdqQPBosgj6tR1XgwEG6sK9iPAAIWpl3RfT+TsAAAAAElFTkSuQmCC";
  
  f3= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjU0NTU3MjFGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjU0NTU3MjJGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGNTQ1NTcxRkY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGNTQ1NTcyMEY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pq43XYcAAAF0SURBVHja7NmxTgJBEIBh5mipbIjwIEQeQeh9E6mwkArexF59BAwPAsTGyhZOzmTJhUAEbmZvd/03IRzF7e3HzOwsQfI8b6QwBAgQIECAAAECBAgQIECAAAECBAgQIEDChojIfvLdcyQJiDXIFLL9mP1O3uyPzCFZI5HhBbKZT9OA+MCQWmdNfvcoPnYsbw3R7V7HcNGmVhkVVUROLVw7Ml4j8vn1Hf+uVSDaN604IVb1QB+pMl7eF2lAHu57aRW7ZaFTI0BSOf0SEY4oSmP99pRb9w9Sq8rRPfrO7mrDvVvsZhxRzi10+kiIkMMit/jlSET+JeR28CzRQxzC+iRcW2ppF7wJ5FQPsYwKxX5tkZejoplema+0sk4xUiuE3hFERFx6adVJ5rs+go+IiHTcdWc46Raf/3odu7c2SLGIIhKr1/Hykvs28+lSMyKV/wy99NssA5r9Uddd79axqhWikR5VEaqQa0AaADNIXQNIaONHgAEAbznzWB9n+DEAAAAASUVORK5CYII=";
  
  f4= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzI0QzU5QTFGOTQwMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzI0QzU5QTJGOTQwMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMjRDNTk5RkY5NDAxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozMjRDNTlBMEY5NDAxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgHdLvsAAAFlSURBVHja7NtNDsFAFAfwTnVpZSM4iHAEDuAm7Czs6iYOwBEqDoLYWNnWUEllNF2g7712Xv6TNJE02vnlfcy0SY21NtAwwkDJAAQQQAABBBBAAAEEEEAAAQQQQAABBBAfR8R5cWPM+zWmtdaoiEiGcmFeQdIkfh2okaZBJKIiFhFuDFLrq4uP5h8tl7MFs0fExdz3a6smtbgwYR0T58CIRuRyvfnftTJEt9P2E8JZ3FhH/h2b3UEHZDYZ6ip2zkJHjQCiZfeLiDR5i0K96iMiTdowiqeWmmJ3MdQdTQSSp5W3zyOq9lpltcGxUKL9AuIj5Lxd4uUDIByjN13peR6RwtSSWhxNQAQi8chbW7FTRwVdi6IBUEZFHMJVL7WmFmVrZoEYY/rFwz2Xp1TxXKV7Un9QWTaxNImP+e/WeDEo+99zHqcq9404ES6Ae5BGpEqaNCoi+WR+AVUFsECoJ4eV3efxEGAAXGt+YWS7E5IAAAAASUVORK5CYII=";
  
  f5= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkIxMDBFQTBGOTQwMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzI0QzU5OUVGOTQwMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyQjEwMEU5RUY5NDAxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyQjEwMEU5RkY5NDAxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pj3+1zgAAAF/SURBVHja7Ns9bsJAEAVgxlCmShPFPggKR0jS5yahCgVUcJP0wBFAHMREaahoYckiGRkLIgv27XpHbySLBq38eWb2xwgxxrQ0RNJSEoQQQgghhBBCCCGEEEIIIYQQQgghhBASY3SQg4vI6TWmMUZUZMSiyrCoILvF+HixR5oG8ZEVbxlBY1hatQZ/+TybcpFTMDwjZcx+OTFqSguFSULcOALjNSO/m238s5ZFPD0+xAlBNjfXkVvje77SAfl47epqdmSjs0cIIYQQQgghhNv4mvEzG5hrByvEnst7aVnE89tQooUUZYUqLxjk0lO3CNRW3usLumhnreqZXcXBStU6ogJSbv5La0xjIeX+KJoesX4E7xHXWfEOQWUlSEYKjMusBJ9+XWGCQVyXmNef3pBZCVpaLrMSDCIiqb2cjYf4H2KxGLZ7/ey/762nX7n9TN9H2d99rBsFsU95txjndSDVuAeToBDR7n6rCJ/ZcF5atzTvvQBos6s+WBFSMw4CDADTTpnfP4B2VgAAAABJRU5ErkJggg==";
  

    
 
    
  frames = [loadImage(f1),loadImage(f1),loadImage(f2),loadImage(f2),loadImage(f3),loadImage(f3),loadImage(f4), loadImage(f4), loadImage(f5), loadImage(f5)];
 

  poseImage.push(frames);
    
    
    
  
  
  //walkR
  f1="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEMxNEU3RDk2RTYyMUQ3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNjFCNkM1NTE4NkIxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNjFCNkM1NDE4NkIxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDc4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5OZ+fDAAABdklEQVR42uzbsW7CMBAGYM5l7NQFFR6kKo9Q2HmTdoIBJniT7qWPQNUHSRBLp67UJUOQFUUUJb6L7/qfFAkJBP7w3dkYhbz3PQvhekYCEEAAAQQQQAABBBBAAAEEEEAAAQQQQADpMPoSH0JE53NZ7z2pg4QAEzNSxHG3Ro0kA+GeDRGIBAKpdW1UW617fCaVkJ+PjZdAsEJChNrUqkNww1hT6/D1baPYB3e3YhjR9suZXlhHLr5pTat9ff+0kVqzpwdsUQDRuJ6wQ4q1xFxqqd39mtw0omsBorQFO8lB77cL3btfibVE7Mi0wKhcRyR/5qJr/TuI+lOU+8mSTKeW6lMUU+da3AfYnXQtrvRigYR7KqnCxzqSWhvuZEY46sRx1Ud1NtT+9WamRohoWL1uxi+jML3C55KChAPK3+bZX68/7tZZebXFUKw7Q8uB1AGG09WoCigfl7N0GkeeFKRJtEVETa0Yg0mmRppgYn0BhLunE4tfAQYAC2iSo5Q7ZiAAAAAASUVORK5CYII=";
  f2="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEMxNEU3RDk2RTYyMUQ3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozREQ0QjNFQTE4NkMxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozREQ0QjNFOTE4NkMxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDc4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz662qznAAABbUlEQVR42uzaPRLBUBAHcEtKlcaEgxiOwAHchIpCx030OEKMg2A0Km08UsSYTHzm7ea9nf/OaMyQ/LL7PvZBxpiKhqhWlAQggAACCCCAAAIIIIAAAggggAACCCCAAFJiBBIXIaLHuawxhryDPANUZCSJOJpjjDgD4c6GCEQCgdL6NrJTbbU7Ii8h1+3CSCBYIc8Ib0srD8ENYy2t0/miY7A3G3UxjOj0y1leWEfefmnOVLvc7HSU1rDfwRYFEB/XE3ZIspaoKy1vd78qN41qSot7wKO0/pm5juspNo2fgrj+Lps34DH9lgnhPjVBRlzPCnp2NFY+QiQ3j2r6kUAqE8nuN2R8SAE3wssj0yxCxTqSIsLBjLyCSP46xQYpG2G9tMpCWIPUeuN2mhkiamVfjy7uxftOQNIbSjHv4rCa7PM+61xpJZg4mu8/YbIgJ3r2Ik/1fu2DMxn592ZsIqxk5NcM2QawQdBYFYybAAMABhCRKJIOmZUAAAAASUVORK5CYII=";
  f3= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEMxNEU3RDk2RTYyMUQ3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozREQ0QjNFRTE4NkMxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozREQ0QjNFRDE4NkMxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDc4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz58/2rgAAABdUlEQVR42uzbsU4CQRCA4ZvV0srGAA9i9BGE3jfBSgut8E3s1UfA+CBgbKxscfVizmzMGThuZ9hd/0lIKIC7LzOzswtBvPdVCeGqQgIIECBAgAABAgQIECBAgAABAgQIECA7jH2Li4jIz/ey3nvJDhICishIHav5jB5JBqKdDROIBYLS2jR+L7XuZCpZQj6ebr0FQhUSIrItrTaENky1tF7f3sto9qPDAzOM6fKrWV7Mka5x9/hcFdHs52fHeWekbnj2WkCAbHixXHe/xWSkuC1Kg3l5uGKLksxk1y4xFUizOjVT3WK6s0XZNrQanmbvchK0mCVk5F9CBuNryR7SzBRtjNNu9CJK66/zh8YsodnXlVVbNjT7xFmWlGZ5UVqpzRQXuz+0f2JLsrRi9kkUiIgMw+frHsPJzajtvUllZDWfLbq8fnl/uagz0xckMf4ZGt5ECNk7vRh1+Zyve1nuFNK3RPoAokO2AcUAqEE4IQL5jk8BBgChwovMiTHyPQAAAABJRU5ErkJggg==";
  f4="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEMxNEU3RDk2RTYyMUQ3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozREQ0QjNGMjE4NkMxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozREQ0QjNGMTE4NkMxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDc4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz43CkAWAAABY0lEQVR42uzbOw7CMAwG4BoYmVgQcBAER4ADcBPYGNjKTTgAHKGIgwBiYWItgQyFqOLRSrFbR7+lSpU6hA/bSdqqZIyJQohGFEgAAggggAACCCCAAAIIIIAAAggggAACiMZoSQxCRK/HmcYYUgdxAUFkxEaaxOiR2kC4syECkUCgtIpGfqptjOakEnLfr40EghXiItSW1icEN4y1tC7XWxjN3u20xTCi0y9neWEdKRub3SEKotlnk6HujNiGx14LEEAKDqZ196s6I+7qHewWRf06IpEVdoja0nJnpqDuR6S2KdhrlV34uMsM0y8gIUDO2yUePgDCEb3pSv/9CCeCDcLZ1JVmhPvdCAukimxg1vqXDe7GFs2IRF+wQarIhHcIEfXtkZVYdu5ecw/fEPLxQeW3H5Ym8TE7b44Xg/z159gndbOWRbmwX39A7TJSJHxlhXx+q1sG5LOsvENwPwLIOx4CDADv23x0rh7i7gAAAABJRU5ErkJggg==";
  f5="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEMxNEU3RDk2RTYyMUQ3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0Q0I1ODZERDE4NkMxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0Q0I1ODZEQzE4NkMxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDc4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6VC8zdAAABdUlEQVR42uzbsQ4BQRAG4JujVGkEDyI8AnpvQkVBdd5Ej0cgHgTRqLQsW5xcLhc57MzdbP5JJApiv5uZ3b2TJWNM4EOEgScBCCCAAAIIIIAAAggggAACCCCAAAIIIBqjKvEjRPR+nGmMIXWQJMCLjNi47yL0SGkg3NkQgUggUFp5Iz3Vht0xqYQ89ksjgWCFJBFqSysLwQ1jLa3L9eZHszfqNTGM6PTLWV5YR76N1fYQeNHso35Hd0Zsw2OvBQgggAACCCDYxpcAEg8+C3HezIwaSHMwJ8m7Q9bSijeL6jeNNiNZCJst9bOW2gd06T7BPXsZIKrXkeRawdXcohmJEckm5+qTkDMbXvSIVEmxQOJsSCOcQooqKbbSKiIbziB5sqHqr7eisuEcQkQt+yoCQi7OIdrBn9bTo33fGi7anz5730VHjlKrukDkAWR973URT+p3vzYzLsvwb8i3V7XSm7Q5MOTyrO4vg3JVXoRDx4DwxFOAAQCb0Iy8uAwmXQAAAABJRU5ErkJggg==";
  
  frames = [loadImage(f1), loadImage(f1), loadImage(f2), loadImage(f2), loadImage(f3), loadImage(f3), loadImage(f4), loadImage(f4), loadImage(f5), loadImage(f5)];
  poseImage.push(frames);

  //runL
  frames = [
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Njg2NTkyNDhGOTQwMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Njg2NTkyNDlGOTQwMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1REYxQzZDM0Y5NDAxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1REYxQzZDNEY5NDAxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pk/jjjkAAAIESURBVHja7NkxLwRBFAfwnaMSUVwj+Ah6wkfgA4jWB1AJFYXOReUDaEWPj0DoRavgxBUSiZZ1c8lsJpOd3Vn73szs+L9EwhYbv3vv7XuzJ/I8z1IIAQgggAACCCCAAAIIIIAAAggggAACCCD/ESKEKG4wvpdIAhIS1BryczeY3GBq/SAopJclEmSQ79uTNCChMeSlFQpDMkdUw5d+Umv7ojMQhXn/+Jr8Pt+f9Q4inexVmeHGsD5+VYZ0aB3WO+Tt+ih3yYaJccmcN4hCmBgzZK/IH1lSZllRY7xOdokpy1AwyMLmsbCV2OXNfVaXpah6RMfosbWx2s2BqDJS90nLstL7gvpRTNYjT8+jRr0S3RxRJdafm7FiZINzzQ/yyW4rMYnQr3FNd7LSKmt+XwjyOWJ7ktkmfNQD0dfabsY0581lWVWt9p1aUdS+xbUs4i1KrH2STEZYXmLbeqGzR90kS4u7b3opIFgg3FtukMleLI6OuDaZY3+vxb2aeIG4HH+p+ifI9ksJYB2IMh4v9oobL2+fCpeHRBscW7PLM3znVxTzHF93esSKgu034vJCabkGd5MHyUjdF0MoLcpmF0Isll0fXh2+6n+/jD6zlZ2zJf3a+H8YBoc0AcgwEVQgkozYMA/nuwWmChANpArjGm3Li3Qg/gVD0R9eJnsyKwogDeNXgAEA6AdU3TpcpTMAAAAASUVORK5CYII="),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NURGMUM2QzFGOTQwMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NURGMUM2QzJGOTQwMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1REYxQzZCRkY5NDAxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1REYxQzZDMEY5NDAxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Piz/DTYAAAH6SURBVHja7Jo7TsQwEIYzERVCFFuw2qWhRZyAM8AFuAgdFFCBuAg9UFPxOACipWERFFsgRAeGWckoCnFC1jO2x4ylaB/aWPny/+MZTxaMMUUOoywyGQqiIAqiIAqiIAqiIAqiIAqiIAqiIAqS5ljwnQAAftowxhjIQhGEqoKJAvm4OpodGiOpgcRWhVSRmDDZWAsomtif18e/Jik3d0EcCI6n8/3ZRMPBUrsFmAC9QOzFj7YOwKVMKKjSF6LNXnY8T98av+sLnlywI0SXBYPVWminuiptv61+HhIqwarI6cWtvOXXqjJ9fS/W11b+FNg2NpIIdsqco5mdEqQeyDFyCKkig+XF4v7hJYqtolmLo0wB6n8+uO56NQlygJQh7jY3BJu1QpfwXiVKn4Fq2MJxJD3YEQYPcQkxtL00s/8bEFcsiFp+s7cW5wKgivSNj67KWIQiCLGxcwKiQOpqcCsRRJGmxpy4otGW7tSNuGAbqxjJMPh+ROSeHWGaAl1kX8vVWUEYaiD2PGJhmuwm7rECwli71YGoYLLpa0UvGqmgWEHm7QuLU0T08xGuXMLaoHM9Y8wy2JMsGgFgbN9PzvYe8XW8fbjadd73NUySsFYVoApxeXPX63wfIBJF6iDzjuggvjAU1iLfWPUBogBg3SFGSa65LL/ZgHwJMABU8+86OlYFYgAAAABJRU5ErkJggg=="),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NURGMUM2QkRGOTQwMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NURGMUM2QkVGOTQwMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1REYxQzZCQkY5NDAxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1REYxQzZCQ0Y5NDAxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvNN1LQAAAHUSURBVHja7JkxTgMxEEV3FiqEUqQAQUWLOEAER4COBnEPBA2ioEvEOZITcAU4AaKlAkGRAiE6MDiRV5azK9hoxuux/khpImXjt/+PZ8YmY0yRQ5RFJgEQgAAEIAABCEAAAhCAAAQgAAEIQNKMVY6HEFF1FGOMoSwUsVA+mCqQr7vh7JNNjnQJw26trmCw/aamCnEdYn/fj6oHvU4/is3++vxN7Z9T0iBu4f5CX26vZt85iEr2CDAlpxLZ5MjW0fXCm7c2iwG7NIhvF3+hoa1cPEzOTLKKhDAuR1Ray4exalgr1e1e0qqw5EgIozrZwy02VGN3Z0PPruVgfHupq+z/qS2ShVGk14rVloiDNO1OkoURbfxf0ZTwUqqIgOyd3lA2ithYObjIA2R8eYyZHSAScXI4iFYsRUDcXBKz5xJVZPr+iRwBCEAAohhE3YQIa6UK0u+tFY9Pb3pH3brD7OyspWrU9VWx9gp3KwvDDRRFEdsN1229nDCiIGGuWBhV80ibwsilSjSQ8BKIG6azgugvnsNu0UCaagtXzpQx7BRC1N3RJwvSBCHVCbNe9BDRdtvf/P7/czIgywBwA6GN53ybHPZivwxtYzOu/BABwagLkHn8CDAAi3bQFmwY3RcAAAAASUVORK5CYII="),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTczNEYwOUFGOTQwMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NURGMUM2QkFGOTQwMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NzM0RjA5OEY5NDAxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1NzM0RjA5OUY5NDAxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoUASrkAAAHvSURBVHja7JpBSgMxFIbnjbMS6aIbcTyCBxB7BHXlRryH6EZc6KrFc+gJvEI9gbgVQaUudOO2RtOa4RFnoJT3krz4AoVOS0O++d+f+ZMUjDFFDq0sMmkKoiAKoiAKoiAKoiAKoiAKoiAKoiAKoiAK8q9AKopOAKDZ5TPGQBaKWCgMJgpkOh7OXtl4JCYMeWnFgtHpNzVVgOp85Otu1HQ0ef8s1vtr8zu1cwJJg7iB44G+3p7PPnMQjewBYEpKJbLxyMbexZ87b8ssBOzSILhc8ED9shKhiA/jPCKytDCMVcOWUtvsJcIjPoxos/tTrK8Gt+FJZy0Hg8tLbESxMFaJ0CVGDnJ/c2weHt9kK2IhYqWAbGI8cPw7yCrT7612+oQjRLIosnV0BaI94sf5lcFpHkvd67MDuSCxgmOZAwR7aR3ubgeZsdhBQm08kIL4ZdW27E0eJDZEVhGlouzsafIxf/OrkK8Mp2fIslbX1IvzlgiQLiAMYleOXP4h94gdaAyzV1wdO5hQW6p6PrLM051zQ0IVURAFSQiE88keFET0Bl2WD0TO0iKNKABQ4+vpePiMA2Ptff8TWF+SAvEBMIQ7K6n3LzfbfkcFwxYa8WFPGwQ1DNl6pE2VRVpyirgBLQpE6Q+W0qIeoEYUqe1bgAEA8YvSw6WrJ2UAAAAASUVORK5CYII=")
];
  poseImage.push(frames);

  
  //runR
  frames = [
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEMxNEU3RDk2RTYyMUQ3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyQjAwRDY3QTE4NkIxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyQjAwRDY3OTE4NkIxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDQ4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz719ilmAAAB9klEQVR42uybsUrEQBCGM8dVIgpXKJ6+gb3iK6i92PoAVmJpoZVi5QPYig+gj6BoL7Y2KlpY2erqHOSIIZuNl5ndTfIPHOFCjuyX/5/ZyS5HxpikDdFLWhIAAQhAAAIQgAAEIAABCEAAAhCAAAQgAOkUSD/ETYlovCpojKHGgWQBWqEIx9fNMXIkGhBpNYKAaEB4B9GC8JLs37cn1krVW9un6EGKAN4+PkfH+cG0KMSotGvsWJWpIK2EiiI2FViBxpTfMiu5rn29OjBRgOQHxtbhDyvhUiOFqAsjWn5ZAQ3/ewdxPf3L67vEZqmFjUOKBsQVW+urhefrQoiW32yesL1cJTgtBBIQoor8Jzcen96b0WuxGrbSyxCDmSlRNcRBsqpw4hfBaECoKFIFRhpCzVo2W2lBeC+/mpOlShuftZSPhlEFJJ0/fAFgFSXG/IAikzx5V+8FRTRBQrxc9Zqa3EGtpZknfc0B+VoKUlfE1v1GB5Iu+9RZkIhKkSpA0Xa/RYPKn3u42Bvn0vL2qWoVU91WSF9rfQRp/X9EcvENLQpAAtkKilQNX2qogEjsPnXaWrXmESIaZr/fn+8+L83N/rlmuHm0WPTb3/u+BAfJA+Rh+OgbSBwkD8SxsnOmrsrE1qoCUxZRWKsukDSEatOI8tt1kB8BBgCTSdn7Oe/O/AAAAABJRU5ErkJggg=="),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEMxNEU3RDk2RTYyMUQ3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyQjAwRDY3RTE4NkIxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyQjAwRDY3RDE4NkIxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDQ4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4z0+9hAAAB9UlEQVR42uyaO04DMRCG16utEKJIAUpoaBEn4AxwAS5CBwVUIC5CD6mpeBwA0dIQBAUVLRgcycgJ6+waZsYP/dNEirJZf/v/84gdpbWuSoi6KiQAAhCAAAQgAAEIQAACEIAABCAAAUia0cS4qVLqZ+tGa62yA3EBilDExMf1CXIkGRBqNaKAcEAUZS0ltYn9eXP660b19r6i+v5GYsFuvLy9T1+HO0cqOUW6Fu9T4vnyUFNB1RQQ9im3Pfk+4BYoerKvDZYXLjyrWcvAuMk7DLBcEtbqG+fju/TLr33yriKL1Hh4fK0GK0uk1YtUkdDqhc7OBfLXDk3ZFMkV6bKXmx9JWotyboo+NFo1THM0fUUSmNRadpG+Ts+pmljV4rYe+RhvlfBZKwsQkyPSAKLWkqho6OxFg/gsJDFMQpHURhUo0jXhSucJC8jW3plqg8nWWvMwnKqw54jUfhfbidXmxuoMDPcMxrIb77NQVr9HYkCQg7RBmISXaJINpwpcOyYsivhOoiQh/q3IPIRrIUkI0hyJva9V57x40c5OfejJBpKKKmSKxDwbYRtRTLgntRL2wl84phcrNer6zOTi4Mm8jnaP1+173/ecJKGIAegDYeLq9n4GKPR6VkWoFkGpDLu1JCDIqlYIEEd+sJbf4kYUgATGlwADACV65UN2ltp2AAAAAElFTkSuQmCC"),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEMxNEU3RDk2RTYyMUQ3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNjFCNkM0RDE4NkIxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNjFCNkM0QzE4NkIxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDQ4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4UrKLsAAABzElEQVR42uzZvy4FQRQG8D3XrUQUWxAqrXgA4RHoNOI9hEYUOjeegyfwCjyBaFWEYgsRHcOQYbJ2rlw739nZ8Z363uz+9pszf3bFGFPkUIMikyKEEEIIIYQQQgghhBBCCCGEEELSrKH2BUXk67WNMUZ6B/EBWSRi6+XiuP89gkCoQ1AITr+ppaHS7K+Xo4/Z6r56KubLme8nuLYnMa8jyLfxDuHKYmwtbB5J/TdtYZ32SB2aJMTepEvALz+N5Jv96my38Un7PeKnEaNf1Ff2u/NDg2j6ATINe8P+8ELOXKrNjpx+IZDlpbkilAoCoZqIwyAQsAUxtD6gEKqJIBEQSCiN0NrCbTwSEkqjaavS20RWdk6k15Cp9f08ToinB1t5HXUJ6QLStOhtb6zmkYibeu05pNeQ6vGZPUIIIYQkDEEfoJjIv4X4h6vrm4einJ3OKxHUy2vVo65GDVEAO3uV1edGEZ1GlERCCPRuF5LIuDVEI43WicT+WNMJZBxCe1i1gvg33+VsFWVohYaTVl9EnbUcpp6Kw2gNsygL4m/JaGBaf+gRkcVJ//N+zdtkIH8BIEHcxrd9mrGHV5SPoZMMM0R/RIPwqEvIz3oTYAB+fcgScjoH/gAAAABJRU5ErkJggg=="),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEMxNEU3RDk2RTYyMUQ3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNjFCNkM1MTE4NkIxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNjFCNkM1MDE4NkIxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDQ4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz42r8ijAAAB20lEQVR42uyZMU4DMRBF7Q0lDTQRicQFOAAiRwAqGsQ9EGmAglQgzgEXgCvACRAtQiIoFNDQgmEjORhrNwHFf2I7f6QU0a60+/znj2e82hijcohCZRIEIQhBCEIQghCEIAQhCEEIQhCCEIQgBJkrkAXpB2qtRyeCxhidHIgLkIUiZXzcnKbvEQSEOAgKguU3NjVEzP55ezasVoPXd9VcXvxZwY0DHfI5Gvmhx0LYKGHKWNk60f4904LN1CM+aJQg5UtaBdxw1Ui2arkecdUI4Rfxnf35+tggTF+gFXDTC1m5ZpZaoctvgTJ6nSoICFFFLAwCQszsNqVQEKKK3D+8qLvLfZMMyKTdGgXDw4f/qGGNvrZ3nr5HkBAiII1Od9SaJA1ycbiT16iLVkW8aqFggoJU7dy7m+t5pBayLRFPLX+8RaSXmEfQMGxRxnnCb1Xs6j8O3ob/V5tLwUEgB3QuSNWRUFWqRaeIf0qCBhCdEJEAYiBogOyqVnAQ5NkVFSEIQSICkTQ4FCTk57RoUksSiqn1q4XWuuX+3I63VMW/jgCZuo2ve7H+1dGTu9M3Ot22f8/3s/tRKDJudVvbvbadR+pmkiQUmRQh1Qg6If4VKDQAdNRli0IQpb4EGACq4cK/GH/AdgAAAABJRU5ErkJggg==")
];
  poseImage.push(frames);

  
  //sit 11 frames
  f1="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEMxNEU3RDk2RTYyMUQ3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0Q0I1ODZFMTE4NkMxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0Q0I1ODZFMDE4NkMxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjU2MTJEMTMxMzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz566MB8AAABlUlEQVR42uzZMU7DMBSA4bzAyMRSUQ6C4AjAxILgILAgBsoCB0FigI0eAcRBALEwsYKpEa5iq6QQvUcS81uqYjtV6i/Pdh1HnHNFDqksMklAgAABAgQIECBAgAABAgQIECBAgABpMS1aXlxEov1Y55xkEZEU1puI+PR2ezbNL2wc9nOMVBFZDXZLGNPvjy6+fiB15d5A3u/OXV25F5Cnm2P3/PIa1fmyrzeZ2rXfIaZ33Td+sLw0PVp1NVVIk66jhWHW+leQy/F9bbnzkDBb7W6uRfWhnM5mdC0gQOK0snUivYBYNJSuBSQXiF8Ezls8+vPaD1lE5DfrLb8NZLnOMoGk3Wr/9Lq4ONr5PFo+9ppHJGwBzdoK0hwnpfZAz2rWSuv2RldijWbWApITxGJSICJAgLQM+at/eyLSNApWESIiQIC0ABGRYTU/o9xtSNrobx59HyaHud9rDVJt2Fdjoxc61Xw4r4kpLRHD7dFqqPd5S4z6GPGNTREpJnxUu7XWe/amd3by+4+dgjQBaSFMIG2lDwEGAMDTqLUoFbG7AAAAAElFTkSuQmCC";
f2="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEMxNEU3RDk2RTYyMUQ3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFOTZBQzc0ODE4NzUxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0Q0I1ODZFNDE4NkMxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjU2MTJEMTMxMzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7FRxhYAAABvklEQVR42uyZv07DMBDGc6EjE0tF+yAIHgE6sSB4EFiAgbLAg1RigAl4BBAP0iAWJlYwOJKjqwkoVe8c2/pOiuL8kXW/fPHp7kzGmCIHK4tMDCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQADS2EBrYiJa6I4bYygLRXywZBSx9vl01YzXdk7yWCMcKikQbccRfpeeePuYslREG4y0NkNfH87riYcb6/X12/tHM9YAEwf5er5emNAH0FKp1ITgimQdtdrAeweRdCoaRey66Ppc6gME/bVuHl/SUmRz74LaHD/Y3VILv6qKcMfbQKMGCZ2aIGmMNVRDEYAABCAA+RVebapi+1o8ZZEOwUEUObq8K2an+/W5S3bcK8h/qYnrcWn2uoIo4kPa8tepIpWblZoOczuc3lIyzYdlTLopgfAbW61SpuYwfi2A5AzC86tk2kFZbvSE6Av3skY01CpTczg4CBGN7MGv28ZSNtAAYHXI3BVSbuy/Z4ypolPkL4jRZDq2Z1eDcCgpdcQ2Q7s4VN2fzXkK/1PHj92zVZUR3dXt+nUdkFXK3VrVD0lF/FtdoCqmSBGNIkgaBexbgAEArQKtW+VRevEAAAAASUVORK5CYII=";
  f3="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEMxNEU3RDk2RTYyMUQ3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFOTZBQzc0QzE4NzUxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFOTZBQzc0QjE4NzUxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjU2MTJEMTMxMzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4UO4pNAAABu0lEQVR42uyaPU7DQBCFPSYlFQ1SOAiCIyAqGiQOAg3QQAMHQaKhIhwBxEFiRENFC4sHaaLJJthRvEMm67dSFHs3iubLm79dh0IIRQ6jLDIZAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgC46B5ZcT0dRTpBACZaFIDLY2ivD4er6ZXG/sn+URIxpqrUAsDUf67TXI+8fnzNzb6NIkc5HVHwa+X24Dg2xvbc6AyVy5d5qsrgwsAOSaDdaqaKisYkRDu1JknmGWKiBrdc1YMq+DPJV7lZZudf/02njvXhH+xTk2jg92p+b53iL1Ikba1Ohtr5Ui4OFa3twQivQCJGUz6EYRruZ8eqKrugWoOcjJ9UNxd370+26pmjmInKRYnjImBfkrlTal2JT79+R79thlYhC9rvfwXWuKyeGDNnaegW3rqCMAcVQczXaIy8YPXOs/WnRRwdLNVqYIDh9WAbJM2+JeEavnIqYgRDTklwR3fHwq625BtIF1+z4WiOHh1U7b5111v01GVY8XY+l0edS7xglcbUPlro1fBIhhBCQFhIUi8VST21RKkcKlImjjO4wfAQYAIj/CfkdlI9kAAAAASUVORK5CYII=";
  f4="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEMxNEU3RDk2RTYyMUQ3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFOTZBQzc1MDE4NzUxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFOTZBQzc0RjE4NzUxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjU2MTJEMTMxMzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4D+tlnAAAB/0lEQVR42uyavU7DMBDHcyYjEwuifRJ4BZjY4EFgAQbKUh4EiQEmYGYq8AA8QoNYmFiLiSMZGWOnUe1LnPA/KYqcKO79cr4vpySlzIYgIhuIAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAHIIEFyzsmJ6Ne3byklDcIiNljvQBazaXX02kdMAE4Y0RYEotZ/AyGufwd9PV3K94/PbHNj/eeaGitR18T2ESUPoiBMxU0xwWLCCC4IW2nXuFc+opTXRx10UiAxFUvKIi4f4YIXnBA+n2gCmJRFrh9easdJhl9zidRZQ9/f2j0n85nQUMxiEaVkyP3elShJJ0StHIdDs4P4QqiCMYHsccwwnLfxttqwjuBe84/Pr9lob1Kdtbzdn8nYfsLu7IcXt9nVyX51NsWESRbEXO/F3Wl1dm0FJVs0+uRgckO+vkTB6OUVApZzWUMr6vIBjr6k1YSoMjpXcxUVxHZglzV8USrJWmvV3BEC03qtZTt0UnlEKaNLc1OxZbkiyaLRLM2bwMTe12JbWq4Ixbk50cp2ELc1ora6RDSyry1m07nd+q7tHI9dz5d6FJ2W8S4ADWH3InXJUM+zKlCwRXwgtpTF43yZVUJAYvhI0eTHy55kXNchqjlCllcMi/zRuekL8AB16+xdy2C+WH0LMADL0AFarIW2UgAAAABJRU5ErkJggg==";
  f5="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEMxNEU3RDk2RTYyMUQ3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3REJDQUUyMDE4NzYxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozOUYxNDlDNjE4NzYxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Njc2MTJEMTMxMzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz49eI8zAAACFElEQVR42uyaO1LDMBCGLYWSiobBOQIHAFJRAxUNMxyENEABNMlBmKGhAmqqAAfgCDFDQ0UbhDegzMaR8mJlK+HfGY0fkaP9tA9pPVbGmGQZRCdLIgABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAGIlKyEHkApNfT5kTFGLYVFimALYxGSXqc1OK81mmEmKPSHZ19P7ZEB9M6JQrBXBRJi9isBebs/N+8fn4NrOqd7CxMjNjY4BJf1tVVRi+nQAW4VdkH4kkEU6delmAsGWStmEAn3qgzElwSiAOEzaxW9eXgZ6mOvKW4kYUTTrwWhlDrJXWza5f3+kop1TH4eVYzYWR3nNtLxETzYXQoX70W9shcV5y2Ue+oQ8TGNQnzjKGEVHSI+uKQHl8nj8+ug2dRLTTJBiLuWVc7ur65PD/vH46vbZHd7c2TfNY81SwHhcUBKH+1t9Ru9PdnYv1ChCjBREFfBRAq6Fr9xAPNYJWjWmjTLxd+jWNlJuOvYktZX1krX8qKFlVIqzQ91e93rtLoERPfp3N6vNZp5n2bq+Zs69c2fSWbZB2oJ5X8UGxauOBdXX0+ftBLXcilI1sjXkTrPZj7AouTWyErdxpMLTDN72d1Zl68hPsvMCiBqERqcN1cfsoxvv+V69neCyi2sphjUZbFszMRUWyH++7coEvItwACmthdT1f2vbAAAAABJRU5ErkJggg==";
  f6="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEMxNEU3RDk2RTYyMUQ3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3REJDQUUyNDE4NzYxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3REJDQUUyMzE4NzYxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Njc2MTJEMTMxMzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6PUNSaAAACFklEQVR42uyavU7DMBSF47QjEwuifQQeAOjEDEwsSDwIXYABWMqDILEwATNTgQfgERrEwsRaTG7FjZzUTvNj549zJatJkzT+fO65dqIKKaXXhfC9jgRAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAYiv6VdxECBH7C5KUUnRCkSRYaxShmE8n0XZvNLY/OFX88ezn5WbpJv7uqYDZ6wKxPfq1gXw8XsjPr+9on7bpu9Z4hL2hQqixsb5mTS2/CoNTh3UQjVdEV6Vce6gRVSsvOMqvq1CLQFlVfJdpwh29e3qLncP7ZHhTRWuMImRgrkzH+9uxY7xP52weXDav/JZNjzLX+67USJsIk8daUX51MLZ84eR5hNOCR1ddS+k6bssbThXJkuumRWNRnzgpv6oCg8Mr7/n1PWpcdqmpnS7rE9+2wZOLwtuzo8XnyfW9t7eztbRY1ClQRBWnZqdO05xBjd6crPJFGVWsrX45pXi25pFXO5f12T1ZOGpXZFVHTMeLKNN3lVILw/9VJl1KFYWsxOxhhRpyxaJtTi8hxEBNq95oPKTvTK22CVG9OQHQ53w6menOJYisvxf6N2iER0gdBmOlTIDJyANhrWqFI0g39tLSIng4n6lziEmZvABOFKFOcEseY/+YFoym62p5i0LKpIROrcAA1YzXQf/u5YPN+BVgAOD/DP4IEtxqAAAAAElFTkSuQmCC";
  f7="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEMxNEU3RDk2RTYyMUQ3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGNjA1OUU0MTE4NzUxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGNjA1OUU0MDE4NzUxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjU2MTJEMTMxMzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6V3Q0RAAACBklEQVR42uybvUrEQBSFZ7JbCoKFsj+VWNiLivsIamVjrQ/hNmujlXb6EIK9+AiKhb2FWG0WtBAEW425wVlvhvw7o5lwDgzsLklmvrnn3pmEjQyCQDRBnmiIAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCANBWk/d8DkFLG/jAWBIFsRER0MGciQvq4OZl+bg2GzcgRDuUUSNWBo2qZ1Oft6TShn1/fxcLczM/MbhxIJ0A4BIkgCEap44K1dAhdBJV3TK3LL7dW7ZNdzwsn91pJEJfXd5UtWJvyS1ba3Vx3KyJFLEXR+a3dvDoktonotG1GgS92aTN+/+CL/vxsvUDyknT88hY1XZ2tI1k1yY1bK2sQFI3u9nHst5XlXtRW986kicrl/UUklB6fxmJt/zwCSDq36j7LWo4k5cPFaEcsLfaNbdutRIRmkgavWpIIwomnKCphs8QtZcJOsXt9W2+9kfdV+dXvOfIgVN6UgbS2+81aqU1FwYq1pJRd3tK25q3BsKcfqzceGf7dKoje+fcDBT9pW0IQZaNJ1yoC5Nm0VrgI9mjwamA6YJroPF4F6RphLk+sJns4U/SYU2TN2OTq0OdWKxoZkgJQ/VgHSbMdh1E24yB5M12kH6PllzrKcwwPUplrFxmjxNvTNdOXAAMAIb3zhZj1HicAAAAASUVORK5CYII=";
  f8="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEMxNEU3RDk2RTYyMUQ3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxMURGQkZBQTE4NzYxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxMURGQkZBOTE4NzYxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjU2MTJEMTMxMzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz65WQf/AAACG0lEQVR42uybvU7DMBDH7dCRiQU1ZUId2CtA8AjAxILEBg8AG12AAVhggwdgRGJhAh4BBBJ7B8TUFsGAhMQKJlfVlZO6SfPhfOl/ktUmdZP75X/nu0QtF0KwMpjFSmIAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEDKClLJ8uSc88GPxYQQvBSKEJQKVjiQ34fT3ih0jqgAcWGwapmwOAmf6qr193jmSuaPrx82PTVZrOXXC0FGEAQjrZr30NJB6KDGmZeZIkHOJRVaVpoQ1tIeV0MpqnqZrloEQU6SAtf3T0OfBwHmAoQg1O2NlcVi1hFSYlTIkDqkRnX1KFbTaCTZ3+8Oe063P79ZY67W2/fS6gzee9XxKoYWxYQaOiNVxtlXCEWk4/SaFETiIH5qkC1sX7DXt/YQQJyKblwRWoXmt85dSXy1v842T25c8+QCQDBxFLLSCiVSoj47w54vd4YgctX9qmGl1gSpSr21K0wApN7GE5BfLsg6E7WmVEzkRv+piK3cj3eCWpgGi5fwiYOEAZhYbvZjrGl3bw9c9yRhlbGSdt5J5kDn5VD322vHNeq55FCPmaoi1Ff1a0VNd0/udVxnBKNsdkNdzCT+4upcPXoCor2KTsh0CMYPxPlud9QxM6kj5JDOKQnknec3P8rJjQ2KFhoOBG3YJs/F8e/pnNm/AAMADsJ+OvAg0w4AAAAASUVORK5CYII=";
  f9="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEMxNEU3RDk2RTYyMUQ3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxMURGQkZBRTE4NzYxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxMURGQkZBRDE4NzYxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjU2MTJEMTMxMzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5/fMH4AAACHUlEQVR42uyaPUvDQBjHc7WjIDgotp3EwV1U9COokw7iqB9AN13UwU510w+gm+LgqB+houLuIE5tRQdBcK1nn+CF63GJbXO5XML/gZDmpb37PS//exrCOOdeHqzg5cQAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEFNWTHNwxljXq0mcc5aLiKhgmYkIWbteCz4PLe7lo0ZkqEyBxJk45DeRwRd2manfslrsP3fHgSq9f35746PDxsCYjbdM324O/UHUiaswdDyxfMSci4gA0EGo53QRciIiBBFnYv2mWdEGBHk7KjKZKHY176ngr27vvfWlefflV3g9rHjDIJ6em+6AiALvR4EoQs5FRK4BSqPH8x2uW0d6iVBqNSKKXJVSgpmZLuejRaH8l9VLd70yNuLfM8gKX0hCpaIkNgrGmYhQccsQ5NnZzZPAu42PrwDGNJDV7ndu69SHUYFMQFkDeXlteBf7q/5eBRJ7EdXUey1ZXnUFe3mw5l+fmqx0nReKFqf7tZpaG9VrJkMQgCzLznS/IiJyNKLWkLBmchD5TbRp/G8hNPl/pJBEfYR5P0qd5EbTiRqhFZoxVqJNhiBlKq1Uy7Lk6ja67+/7dlOLBm3Xa9r+W6QVTa4juf4BwTycbffSr5MjWlaKXYWgaIgJm7DO3KyBCM+ZspYC4tbjIBuGR6au2a8AAwDH5BxWjSRtRwAAAABJRU5ErkJggg==";
  f10="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEMxNEU3RDk2RTYyMUQ3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpENTg1M0ZCRjE4NzYxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpENTg1M0ZCRTE4NzYxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Njk2MTJEMTMxMzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6hckneAAACMklEQVR42uzav0vDQBQH8F7qKAgOik0ncXAXFfsnqJOL4KZ/gG52EQd1qZv+AboJLm76J1RU3B3EyUR0EATXGnO1Fy7Pa2x+3aX1+0DSQiT3yb337hLKPM8rDUJYpQEJQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAySqGTF2YMRb6WZLneWwgZoTC+mZGeLSajeBzuVZPdyNM/fDs6/rw14WthW3274sdkNQXTpFGhSn2l8vdoD7GR4ez6Xo6i50W+Ov7ZwDhn3lMLO2xQkNUXUoFSpp2lm6EuPNy0PSKQhuDUAQf9PnVTX91LXpnRf6vLs6HzssCZulCROU9hRV2HZERUSBV/RiFyLOR9cKnDWICkTlERtw/OO3vtFaiWmvSxTC3LQpHzEzbwTHJumAUwlPp7nTLoyge1bGRyEWwkHstvikUAxUQFYbC5K4VN81y6Vrd7nZleT8yHfn/ib+46ZjbppEWPo/Hp+f2ce3gonR7shk6n9dSmmcWLQvi3MaxLQA8znZWQgCK4CkWd3HMpWsxxir+wW41G07nbYlTrtXFaJ2pyapyBgTi+e3jp05MplYHIb/ycTqve2z5e7dtiV9H7fP81AvOm10/YlohFCEPXPU0SAffLfwxuoV5Zqft9a/BS+FqTy3VjMizwruXKPw4iF7GmGnXUqUArYm4CKPriJgZGRFjNlxyc8ytI3RmekS4SRHa32v11YOVqfgWYACoOhHn3wrV2wAAAABJRU5ErkJggg==";
  f11="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEMxNEU3RDk2RTYyMUQ3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3REJDQUUyODE4NzYxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3REJDQUUyNzE4NzYxMUU0QjZBRTk3RUQ4MUEzMTZFNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Njg2MTJEMTMxMzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThDMTRFN0Q5NkU2MjFENzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5I5DveAAACQElEQVR42uyazy/EQBTHOzhKJA7E7p7EwV1C+BNwcpE4+gO4cREHXDj6A7hJXNz4Ewji7iBO2woHicSV6qt91Z2dttt2tp2u70s27XZ/zHze9703r5MK13WtfrABq08MIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgANFlQ2UNLIRoeyzJdV3RF4rIYJVRhOzr+jA4H1zYzueIsh48+7456hh4YH5L/PtkB0jugXOEkTHJ/nK5G+TH+OiwnqpXZLLLCf76/hmA0DnZxNKeMBpEVaVUQFnDrvAcYc+HTQ6vOOhSQXhi7Pnzq9tqVy32/OriXNt1HWCFgkTFvgxmJIgc73GJrMof4xTRvQAWsiDKyV3JFoUhHh5tH4JgwmrEldasi2FPW5SZ6boPQ8cs64JxvRbBkDXGRmIXQSN7LWoKeaIMooKRwcJVK22Yac+R+9NNN8rbteX9WOXod/xKG45aFSEI9nwYhlV5em76x7WDC+vuZKMjp/KUbK0gQohaaGPBDm0s1L2J27Prx9bZzop/bWqyEQmQpaXvWbLT5BmGjvS+9ZFNECoAhmi+ffyG4p9jnCSHa1MkrIa05WMzmKyUqi3x8sj/HinI1zwl6948HSNAVHeD8uSjLAlCd2jRYLVuy2vS5KX/LS7ZPUWsKBBWhaoXhUlK57AqxawjrYGcKIiMCncF0YvyG0SODJFCDUfhoGLLLw3agnHkVTsGwklQ2bx9rUrdj5RlPwIMADrZFKt37iAzAAAAAElFTkSuQmCC";
  frames = [loadImage(f1),loadImage(f2),loadImage(f3),loadImage(f4),loadImage(f5),
            loadImage(f6),loadImage(f7),loadImage(f8),
            loadImage(f9),loadImage(f10),loadImage(f11)];
  poseImage.push(frames);
  
  //standup 11 frames id=5
  frames = [loadImage(f11),loadImage(f10),loadImage(f9),loadImage(f8),loadImage(f7),
            loadImage(f6),loadImage(f5),loadImage(f4),loadImage(f3),loadImage(f2),loadImage(f1)];
  poseImage.push(frames);
  
   //stand 1 frame id=6
  frames = [loadImage(f1)];
  poseImage.push(frames);
  
  
  
  //tapFoot
f1="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0RFRDkyQTRGOTQwMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0RFRDkyQTVGOTQwMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMjRDNTlBN0Y5NDAxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozMjRDNTlBOEY5NDAxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgqmPfYAAAHGSURBVHja7Jm/SgQxEMY38Uorm8O7F7C3EH0EsbIRfBBt1EYbfRDBxkrvERTfwzvRQhBsNV4WcowxeyzsTLKJX+DYZP+E+eVLZpI5ZYypSii6KqQABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAFI9zLg7lAp9SuZbIxRRSjig2WjiC1fD5eL+srOcRlrhEJlBRLLcLjf1h1uH6liFXm5PxP3XIrzP8Tvxyvz+v5Z14drq/XVtl1dUjE2EAtB2z6A9PTTEhBUER+u6X14LQkQN+KII30DuZk8/WlLq8Xitejidd5qmeH2ObfnElEkxVoZcBpuR3qZ26Xt9b4GxNA25PntY1Hf3BiLRnb2gxU1ngJktddqE7WlFEEcKRpEYjMIRQAS2G/ZnJa/78oO5PDitro+2a+vMdaRGIjLb2WZoEuVChJf7Ae7W9HgonitGDBwvwApCSSLBF3R2fiiQKSVgiL/AqRpGklOLyjCGVM44goriFJq5H6he/Q+BeCYcpoTghyqpm2/mx+Hx/TbpCBNEKGsPL3HmbXvnDINQTgDR3vnwcTv7O506j+f2zHrDUiX0hVEpzaAqw+dejQ5IFimVl/KjwADANyl00Kj+WmNAAAAAElFTkSuQmCC";
  f2="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzI0QzU5QTVGOTQwMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzI0QzU5QTZGOTQwMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMjRDNTlBM0Y5NDAxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozMjRDNTlBNEY5NDAxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkCXXgAAAAG6SURBVHja7Nk9TsMwFAfwvpKRiQXRXqB7BwRHQEwslTgILC1LWehBKnXpBBwBxD1oEQxISKzUxJFcmeBQJL/nxO7fUtU4TVP/8vyRvJJSqpVCIUAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAxCBE9OOE+fkpCUgojAjk6+FmXd85vgwCaUv/gI2KChKq4cEjEi2kfXRByUbk5e5KfLFinbVWjxP1+v5ZbO/v7Rbvum62JSPGBtEIu14GSHc/FkgZUVVsHDcGs1bVFU9m+k0KMrt/+lWXjhb7YDcD+q+G68+jGOx1jJWMs+H6SrvWjjJM1w+auiC6bkOe3z7W2/1eV3Rlz7hPaDfeBkT3hLhplZeKCNaRpCH/vXlERADxvN/SOa3yfVd0kPPreWs6PCveQ4wjMYjJb0WZoKsrFSQ+2Acnh8FwQWatEBhMv4CkBJFYS5CN39quJR0pRGQrIFXdSLJ7ISJNW0tYIUTUMS/XPnt/YyNiNzJ/mFpUHWfngTlxmSRiU1beHJt/v6uUWnq1wTdl6kIYQOd07Ez8Lm9HxXGcf1uzQnxK7RHhwPgi2CA+GA4EK6Tu8i3AAAy0J7oe6W22AAAAAElFTkSuQmCC";
  frames = [loadImage(f1),loadImage(f1),loadImage(f2),loadImage(f2),loadImage(f2),loadImage(f2),loadImage(f2),loadImage(f2),loadImage(f2),loadImage(f2)];
  poseImage.push(frames);


  //Jump
  frames = [
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjU0NTU3MURGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjU0NTU3MUVGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGNTQ1NTcxQkY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGNTQ1NTcxQ0Y5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PiNz+UYAAAGbSURBVHja7NoxTsMwFIDhvMDIxIIoB0FwBGBiQXAQWBADZYGDIHWADY4A4iCAWJhYwdRIrhILhaZ9L6nNbylK7LaRvz77NXEqzrkih1IWmRQgQIAAAQIECBAgQIAAAQIECBAgQID0WJYtTy4itfVY55xkEZEYlkxEfPl8uJwcL22fpDlHqoisJrsljPQ71cm3jqWpngzk6/HKNdWTgLzenbm3949am6/7dpPUrv0MMf7WfefXVlcme6uhpgqZZehoYcha/woyun9qrC88JGSrg53NWnuox9mMoQUESL2s755LEhCLjjK0gOQC8ReBf108+te1b7KISJvrLb8MZHmdZQKJh9XRxW1xfbr/s7e87TWPSFgC+m0pSHOelNoTPausFbcdDm/EGk3WApITxCIpEBEgQHqGdPVrT0RmjYJVhIgIECAdQkRkELa4rek9CwWZtmPjW97ntp/pDBJ3KHS2+kCnemyBKS0Rg73hRmj3x5YY9cnuOxsjYkzYVOfnvM/ZtYbGuB8vvUZk3g5onUP9LxxtI6SB8OVbgAEAbfGtuW2UkXkAAAAASUVORK5CYII="),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjU0NTU3MTlGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjU0NTU3MUFGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFODUzM0MzQ0Y5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGNTQ1NTcxOEY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoPO/jcAAAGxSURBVHja7NmxTsMwEAZgLnRkYqlaHgTBI0AnlqovAgsw0AkeBImhG/AIIB6kRV2YWMH0Ih26RKlKmrsoNr+lyomlpv5yZyd2KYSwk0IhQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEBagRBR4eKr36IkIJ4Yd8jXy21+vHt8ES/k+/WucHHGeEGyNgekRCd6SNTTr06v7Og8zlmrPEY8MW6Q96fr3wv39/fyevnxmR97YFwg5UgwQIM8ImMOqUqntTONIcYUUgdhjUlm+gXkL+Xh+a3yXAZ/5yHS0fHJYaG9fI7UAqRmGZzeECICCCCbp+Cq54XHM4RLz/tOeXU82dRyjwivQWQrSDYgonlF4dUhA2QhdX95VqijjIh+x+JalrvWCytMv3VWe9w+mc5IxkwUY4Q7rTcZ1k0A1phWU0tHbBMWYwSQlCGem9WIiEXZZgeyM5C20wup1bWIZTF1Fqn1ryFENNSfcrs+7yykTudWa/e5JSbzRHBnudZrD73fZYnpeUZCOjwcTQ+kTY4Xj1dz/f0QwqJRHyz+DLW4q4BYQppimiJMIduCLBBcfgQYANuQHcNqF2TUAAAAAElFTkSuQmCC"),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTg1MzNDM0FGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTg1MzNDM0JGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFODUzM0MzOEY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFODUzM0MzOUY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnhetJsAAAHgSURBVHja7JqxTsNADIZ7R0cmFtTyJOUVYGLjRWBBDDDBgyDxAPAIoD4IIBYmVjjiwcWJklAUO3eO/pOi5C6p8n/12edzG1JKsym0OJtIAwhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAA2bLNrV8QQqj9kpRSCpOwSBPMjUWofT3dbK53Ds99+oiEmJSzW4Eh/G79gtVZ6Ou7Afl+vk19fbVoaPWHARb8/vE529/brd3jMU3rRGsrkGAS3oTQtk60nkoM03Y9qailZZVYoqiiLMJ+cf+4ro03+0VGLRmp/uMPGtEri48QqIxkrp19cXQVigfRFlmsRSzWkuhJLNJ4gPwRYrVD7yjFB7k4WgCM7uyyeuIqaknBy+PrzZnH3h4ukytnZ+F3Fyf+nJ2SR+kPXALis9wlam13VUGsKiRFRC0GPF39WktGsEWpU4vXj67IxFaj+3Ro7SrnVs499nTLkqJYwMVcIl3sECVM28KnvRiONrXahBe9juTcYMWcDl18EbtPKE0zF9lvCGEpj+a4iyK2FN7lJzLsdj2fFaRNVJXtvjTFV3uSA+7TfS2YaGkJzrtIvBxnGAbSgFEpYmsIqXS8usu1inX2od/m0M+rTa0h00wDgtqPAAMAtu/WYWffLzcAAAAASUVORK5CYII="),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTg1MzNDMzZGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTg1MzNDMzdGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFODUzM0MzNEY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFODUzM0MzNUY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Poc1sKMAAAH1SURBVHja7Jq9SsRAEMez0VIQLJS7+AD2gqKP4FnZiK0PoJ02aqHVWfoA2gn26iOcqNj7AN6JFoJge7feHMyyF0nIxdlkE/4L4W5nlmR+Ox+7G6K01kEdWhjUpAEEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEAAUkCbdv0ApdTYFwlaa1ULj8TBKgXS77RHV6VzxAZwCVN4aLmCQfnN/IC1A5XWrwzI+92JTuuLVUNXH54NHs7NjT++foKFuRnz68I7TkBsiElDD8lepjfyjC/NIzf3j6l976sWJTa17Y3VMTn3We8liFSYeOWRRutUJc06yUkvOQGoWv9ZG3hRlFwQS/GIdKIXctR1YXThIG+f38nFoCog9i53ZffCyJ8u94zerlze5QiFEhlJCb04P2vk10db5j/JSU/jpEJPDMReC7gqMUzv9njUp1+GiI/1PtnJUCqzOy23qz+OulkWwZfXbuLYJJ0XHiED+UibNexorISXnIbW8lIUPF/t/8kJkpHO62Sn2W1MkNTen9nZwLhXbG94vWlUSjX5mlo/jBiGZfGxXoLkMUwKJnQJ0e+0u/Ed8HDfFXGf9RIwoUtPkMF0NTfPIltOfdZJeUbkTaNUeAxt6eHMXvZMSt1D/CV2njCTmIhfAQYAoZLVhoj0198AAAAASUVORK5CYII="),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTg1MzNDMzJGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTg1MzNDMzNGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEQjE4RTc3M0Y5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEQjE4RTc3NEY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pmshrl0AAAH5SURBVHja7JixTsNADIZ7KSMSUgcQDc+BRDdmeArYGenGACww9gHYeYDyCCCQ2HkACoIBCYkVQlxw5JyalnJ2kka/pSjx3UXxV9/vu6tLkqTVBHMAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEIAABCEBKBnHO5T6Qfs81AsQKphSQz+uzzG/3+iYgkfXclRCWFpUtSiuw0kEWuvx+3ZxnH4m2Dhezaj0Pj5K1znLmv7x9tMjXBjIDkVng4PlukR0TEAkxU6RKMI0Re+Ug82SvVBAOjPRAdnl1m+tnn/trqxEJIoXtm7bwoZFZtr5z7EL6KwWZV7hyOoWKXhXEF3DRvJft9I6G8NWnFgXFgdL2pGjbIv1pReGvtqQJwdsQafcPo/F9Y3VlfH98ff/pSGFIJxoQ6iBFetncG2TtdxcHuTGUPY1FUX1q0S/MU4eeOROn+9vZGGrTyoSpRvwgOQt8l/1FOqp0ZS9a1clnbchsyHGhK7vJFsWf9xQwL4D+QUtrG296Qpx0xLU69ppsUZxzXbravX7MJZjb6Jku6iO/liAc7LQxaSmOf/8WGvE7tT9YcbBcgmX51YaJNLMxqRTT1d09iWU7+f4eKxRGTewav2oayxNANMtvCEwIhMk68h+YUAiybwEGAKsinXiO4dV7AAAAAElFTkSuQmCC"),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6REIxOEU3NzFGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6REIxOEU3NzJGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEQjE4RTc2RkY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEQjE4RTc3MEY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnpGlNcAAAIMSURBVHja7Ji9TsMwEMfrtCMSEgOIhgdgRwLRjRXY2eEd6ARDYYGRt2AHHgHEe0ARDEhIrBDiSBc5TlzR+C5xqr+lKLZjy/fL2fdhlSRJbxGKAghAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgNRZQKnCAul6aiFATJjfp+vsW7R76g03kBBeC/j++Z23fx6v8np/NK4c7wsTSWlibWWpBFFanEET4iC6rB9MSoLOAgsWZN7tGBSILRDn9mlFIwTwdn9eADONACcoq/k1taEFpgNv18kYEIQ5ry6YiEZMwU0LRv3U9j0XIhohoWyIecGD0Yj59+3z4Dores6ssY2BVG0R8iG3D8+Ffrtt/4CgrBZtDy3c0f5O4ZvZ1uO4rFYkBfHfLRhk0OgjkC/MoG2AzuQjLl/BDR9M0Bg8SJV/8PUZjWWIVChglBC8cY28fHxlz/DwIq93CkQfcvIV28c3vcuTvey9sbrs7cVb0cjWZtyb3p3laa5E5NuY1ZLQQCN+xJXuSqbB8CMh3Jy0dosiGZNha4UWNYsmVjo0se+1OqURM9U1Yy7JuEv8ptHlDDuRjyilhvrpj8YxwVCfPSZIEJdw9h2WPSd4q5UGia8uKPMbB0zEqY0qofWT5iIx9ek69XPCsAWNHH81lWUKEM4w3gfGB0IkH6kD4wuhy58AAwCTSXjC9NWAzwAAAABJRU5ErkJggg=="),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6REIxOEU3NkRGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6REIxOEU3NkVGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEQjE4RTc2QkY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEQjE4RTc2Q0Y5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqX0TVUAAAIPSURBVHja7JoxTgMxEEXjVUoqGkRykpwBKjouQgUUUIWDINEDRwjiIAmioaINJi4GTczuZhP/2fWuviUrrJ2gefNnPLYT570fDaEVo4E0ghCEIAQhCEEIQhCCEIQgBCEIQQhCEIIQhCCq/bw9+NB7DdIUAAmbRWghYJgjjf757Mr1FqTNBG9FkSZq6PekOmBsrYZzbmvMe++yVkRD1KkRg6HyCB5an1/f/8bWi/lft8qvAqlGgDg9u3MxxCHw2deRKrBUGCjIyfHRQeERPhd65yB1CRvPxc+ouuNQ37PHBulQ0d6uGk9dwWChFRtRFSoyjoQwT3aJfa1C+Ds1H0xDS9rHy63fx9CyJTsLRYJRTZdSFIRpaCGKXOcgwcsSXk+v71tz8oxUwyRH9qkPyIMXj7qp3kYfg6kIQQhCELvqblH1x9aeamurYqZI2AXr58n5fT9B9FZeIDQM+mrV/GAl7fH6YufpMftVa/V8s/VqoYpJsmsDtfctlGht1ZIN4uXMJjfMQmuXoVb3WkUbagx2i2IBV3RlJLriF9Yejyt81VgvQqvMcFmKs/3Gqq66D/LyAZ30rf9gYN+74U5BnHMT6fGYhtDzWYHExpflSbzsomBMQ2u9mC9j4zdnkqk8yzwCpkCqUVb0Qg/GR6fFqcyhlIFdYiO8urFl1au9VtZ1JMWbiM9DFTnUmFSI0H4FGAAp8QTmk2oY4gAAAABJRU5ErkJggg=="),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDIzQkEzQkNGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6REIxOEU3NkFGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEMjNCQTNCQUY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEMjNCQTNCQkY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhJ5Gt4AAAHMSURBVHja7Js7TsNAEIa9S0oqGgScBK5ARwcHgQZRAE04CBIFdHCEIA4CiIaKNgxapI0cY68Sa357d/insTOy5Pk8j519xIlIZUF8ZUQIQhCCEIQgBCEIGuT7+UZW0WUNkjIYAeOHhjCXI9qwHmmg3z91f17Yoiu+aml6BQaS+vIIr/jSkxzqkY/PL5VnRgUJBu4cXjoTHhkjHCdII51zS0aKyMJT21ubeXokftmUgU0wTZmgQ2c+my7uNw7OysyROoSpZEeCcWLVp01BNYzw+UhzjOjSq5R6zdX4uoGxBamX4zadlpdg5TcaG4wP9/FabLJH45EQ6iDrhEnwkGbyQ7pfc/ORu6eXJX3zd7ZVK8r744WkcgIxZ+HInps41PZ0avTOfhWFoUUQgvwzkFCxulqVoC9moyfV7aK6YHhohf4qLAMh+6xBQE6uH6rb86Pfa9EgcQkIvcbFqrWOHF/dOxMgHBAJMtRLOR8hCEHsgSD3ROgRDS+YPOZEEIIQxDBIcQeYTXik7aujR/hBj3AgBX2Cbreh2pvPpq9BLyJvqu/S3rFqMb5TNGH8WBB9nh8EpK9RWjAsv1rxrpUnkO3pVcNFM9mdlb+B/wgwAJnNygQ4EDYwAAAAAElFTkSuQmCC"),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDIzQkEzQjhGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDIzQkEzQjlGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEMjNCQTNCNkY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEMjNCQTNCN0Y5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrL/hoMAAAG9SURBVHja7Js9TsQwEIV3zJZUNAhuAlego4ODQIMogAYOgkQBHRxhERcB0VDRglkjeZUNiZVI8xx7eNMkO4rW82V+PPZ6xXs/syAO+eXfzzd+iK5okJTBCBiXG6LK0MoJ65AGur0T+TNgh65qj2h7BQaSevMIr7jakxzqkfePT5VnJgUJBu4cXIgJj0wRjnOkkSKyZuSyr1t5antrs0yPxDebMrANpilzdOh8La5X9xv7p3XmSBPCVLIjwSavWlWAtFsRVMMIX4+054g+vUqp11yzNw2MLUizHHfptLwEK7/R2GB8uI/XapM9Go+EUA+tMfGv3VxCul9z65G7p5c1fftz0aEV5O3x3KdyArFm4cxemghqEztVvYrfRWFoEYQg/6xqhYrV1+1GvXblgnmkb2ZHdcHw0Ar9VdgGQvZZWUCOrx5mt2eHv9eqQeIWEHqPi+V3jBxd3osJEE6IBMk1KNcjBCGIPRDkbyL0iIYXTB5zIghBCGIYpLoDzCY80vXW0TN81iMcZnIECSZW/nZBEIIQhCAEIQhBECAisjvkueW4r8WCDIVAwKiBjIXQhiGI2dAaC1R0sk8pPwIMADsk+3AcZXz7AAAAAElFTkSuQmCC"),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDIzQkEzQjRGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDIzQkEzQjVGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEMjNCQTNCMkY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEMjNCQTNCM0Y5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv2TfsEAAAG7SURBVHja7Jo9TgQxDIXHYUoqmhXcBK5ARwcHWRpEATRwECQK6OAIi7gIiIaKFgJBymp2mI3Iym82Mc/NzFqzir84dpwf8d43FsQ1RoQgBCEIQQhCEIKgQT4fr/xfdEWDpAxGwLixIczFiDasQxrodqfyq8EBXfVZS9MrMJBUzyO84moPcqhHXt/eVb5ZK0gwcHv/TEx4ZB3DsUUaKSILRnrv556abG2W6ZHYsykD+2Ca0qKHzsfscv6+sXdcZ4x0IUwFOxKMC6tVyhRUwQhfj/TniGV6lVSvuRvfNTCWIN10PKTT8hIs/UZjg/HhPT6rDfZoPBJCHSRnmAQPaQY/pPo1tx65eXha0Pd/F5u1orzcn/pUTCDWLJzZSxNBHU+nZu/id1E4tAhCkH8GEjLWslIl6Ks56ElVu6gqGD60Qn0VtoGQddYoIEcXd831ycHPs2qQuAWE3uNi1sqRw/NbMQHCCZEgYzXK9QhBCGIPBHkmQo9oeMHkNSeCEIQghkGqu8BswiNDvY6e4Ue9wmEmRpBgqidWIrKT8/1328/FeSQXYtX/MGsRpNYYCUblGKYJEaQtuZdz5EuAAQBc1sTEM1kjmAAAAABJRU5ErkJggg=="),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzBGOTVDODNGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzBGOTVDODRGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMEY5NUM4MUY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMEY5NUM4MkY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PorgBoMAAAINSURBVHja7JqxTsMwEIbrqCMTC2r7JH0GmNh4ESZggKk8CBI78AhFPEiLWDqxFlMPhy4mTpP4znGi35LV2k6q+3x3Pp9dY62djKEUk5EUgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCCs/Lw/WlcHDdIUQBI2C9OSgIGPNPrx5bUZLEhKB0+ikSba4M/ETsBUWxvGmFKftdZkrREOUacNH0zKj8RN62v3/a9vv179VS3/KiS14SBm5/fGh+gCn30cCYHFwoiCnJ2edDIP956rvYPUOaw/5rel4o6Rumf3BeKmwmc71B+7gomZli9EyFSoXxJC3dnJ9rkW3PdYf1A1LSqfr3e2jaBVS3YWGnFCNV1KpSBUTUsiyPUO4maZzOv57aM0Rm1Jbaj4SJv4IJl4IdWNnW3pNBgaAQhAAKIX3TWi/lR7plJtVdQ04nbBvD2/eBgmCN/KEwSHkT5aVU+sqDzdXB7NHrNftbYvt6VPDa2oODsXkM++hiaSrVq0Qbxa6viGmmkdE1TrXKtIoY3RblE04Iq+hJSO+IX2jPsRPtQ3CNOqEpyW4mxvrOqi+ygPH6SdPvkfBtqeDfcKYoyZU/X7OIT/TDYgIcFCFz38vWxAqoTZr1cbX/hDTrKgNo1LwKjn7K464b1scUFjYhMpdYgtYR4HWbaD2mupLDDS1wpdNBOjCTWQvsqvAAMA3ED/Q3dXY5wAAAAASUVORK5CYII="),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzBGOTVDN0ZGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzBGOTVDODBGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMEY5NUM3REY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMEY5NUM3RUY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Psf0HuoAAAH7SURBVHja7JqxTsNADIZ7lBEJiQFEwyuwIlEmFhZ4CtgZ6cYAXWDkAdh5AHgEEEjsPAAFwYCExApHXHDknEhpiM2l0W8putxdovir/d85VZz3vtUEm2o1xAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQLZu2foBzLvf5kffeNSIiIdjERITs/fIoO293e5OpEQnRKLFbgWH5HfsBq3tuVF9tEbH+OPPxfN8vzM1k/aeXtxb1tYHMQD6ujn3oPLcW0TEBkRBlUw9ij+1Amej9Kwg7RnogO7u4zs1zn+drqxEJIoUdmrbwoZHfbHHzwFWZjwpSVrgynaqKXhUkFHBR3stxukdD+OqpRU6xo1SeFJUtsj9qUYjyYsVliLTbu8GwXZqfHbb3z69fEykM6UQDwvQNUeb8yvZJNn5zupu7hqKnsSmqpxb9wpw6dM6R6O+sZ9fQmFYkTDUSOslR4FbOF+koemqF5Tq3G2vLOa2E0FV3dpMSJcx7cpg3wPBFq7ZlPDsmHZSOW71YmZQozrkOHe1uL+ElmMfonA6a47HagYzjWLoUJ99/Cw3kfbUB+ckZdlYKXPY1YUzLeK6jOluHiRynvlaNpb5qaaRH6stD9IhUcaJ2Yv8rDN1X9YdQ39ljReZTgAEAN4bsqdz10R4AAAAASUVORK5CYII="),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzBGOTVDN0JGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzBGOTVDN0NGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCMDA3NjlDQUY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMEY5NUM3QUY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PktYO8kAAAHmSURBVHja7Jo9TgMxEIXXJiUVTZRwEBSOAKloEBeBBlFABQdB4gDkCCAOAoiGihbMupgway2roMzEHvMsrXZtS6v3ZX489saFEJoamm8qaQABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAAIQgAAEICu2kebLnXOdr0ghBFeFRVIwMxaJ7fPhevm8tX9mM0Y4RFXBrgmG9LvSy2enbqhvBuTr8SYM9UUzosYfBkjw2/tHM97Z7szRmLR1vKYVouAoPIXQsI7XdCWC6XuuKmtJWsWXKKoYi1Bc3C2eOuNpv2gQHtzHB3udubRvOkYiKIc1HeyTw0tXPIiGyCItorWWeEtiUcb/e5ChFKuRetUPH0h0WgWbDXZ+emIqa3HB0/nV8k5jr/cXwVSwk/Db8yN7wR7LeR4PdAREd75LlNzuioFonpBkz1oEeDL7sRbPYJNSXYvWj98yE1ktzsdLclc50gjuHO628RJFC87nEGlih8hh+hY+jcVwI67VJ7zodST3BsvnCujiD7GHhEY3M1P9OuemdKVjHILPFwWSiu+LkzTtSsJ4KYh0rK12n1Px7Z5kl/o0LwXjNSB43RXF83GC4YASMGt/epP6RVsdL6ZqLQ0IEZB1RUhAiJXxXMxfXE0KIrZvAQYANMPVyY96wwsAAAAASUVORK5CYII="),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjAwNzY5QzhGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjAwNzY5QzlGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCMDA3NjlDNkY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCMDA3NjlDN0Y5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkAdkAUAAAGxSURBVHja7NmxTsMwEAbgXMjIxIIoD4LgEYCJBfEisAADneBBkBi6AY8A4kFaxMLECgeHdJJjJY0i+1I7/S1FjSM1us8+O7FDzFyMoZTFSAoggAACCCCAAAIIIIAAAggggAACCCCAAAJIeKmsbkxEtU1lZqZR9IgPywry/XL7f2Q9RlzAEJjBUssag+m388b757Ssng3k5/WOl9WzgLw/XfPH51chhxY5t8RQ7I+hfrCK2d7aNE2zqJA+LR4bU64CYTFmMP2uDeTh+a2x7s5kSUM00NPDvdp1v47UAqRn2Tm6IfQIIIB0T8FNzwurZ4iUyrKVLAMfbWqZ9oisQTYOLmobENm8osjqUAC6kLq/PKn9Ztkj7juW/EpvKDDZhdVopt+2FpbrZ9MZ6ZjJYoxI0O4mQ9sEYIEZLLXcHuvCYowAMmaI9WY1eiS0WO/Cm0JWkV5IrdR6rMwpWKTWWkOIaKKHf62tnhSkT3B/a/e5/icpSFNAGqz/ZVfrsTGVBcIFTI6nu3pNzxePV3P/Hsy8CIoj9KturBYNhSQxa4UiokBCg4iBiJJaIakWCyHlV4ABAG5wtaYup2AlAAAAAElFTkSuQmCC"),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjAwNzY5QzRGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjAwNzY5QzVGOTNFMTFERjhDOTNGQjJERDU5RTczQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCMDA3NjlDMkY5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCMDA3NjlDM0Y5M0UxMURGOEM5M0ZCMkRENTlFNzNCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pg9xaEcAAAGbSURBVHja7NoxTsMwFIDhvMDIxIIoB0FwBGBiQXAQWBADZYGDIHWADY4A4iCAWJhYwdRIrhILhaZ9L6nNbylK7LaRvz77NXEqzrkih1IWmRQgQIAAAQIECBAgQIAAAQIECBAgQID0WJYtTy4itfVY55xkEZEYlkxEfPl8uJwcL22fpDlHqoisJrsljPQ71cm3jqWpngzk6/HKNdWTgLzenbm3949am6/7dpPUrv0MMf7WfefXVlcme6uhpgqZZehoYcha/woyun9qrC88JGSrg53NWnuox9mMoQUESL2s755LEhCLjjK0gOQC8ReBf108+te1b7KISJvrLb8MZHmdZQKJh9XRxW1xfbr/s7e87TWPSFgC+m0pSHOelNoTPausFbcdDm/EGk3WApITxCIpEBEgQHqGdPVrT0RmjYJVhIgIECAdQkRkELa4rek9CwWZtmPjW97ntp/pDBJ3KHS2+kCnemyBKS0Rg73hRmj3x5YY9cnuOxsjYkzYVOfnvM/ZtYbGuB8vvUZk3g5onUP9LxxtI6SB8OVbgAEAbfGtuW2UkXkAAAAASUVORK5CYII=")
];
  poseImage.push(frames);

 
  //dance
  frames = [
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2RDgxQ0UwRTBDMjA2ODExOTgzQjgwRTYxRUYxMjc4OSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxODJCMDczRjFGREIxMUUwQjk0M0I1OUNGRTg5NkY2RiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxODJCMDczRTFGREIxMUUwQjk0M0I1OUNGRTg5NkY2RiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGODFDRTBFMEMyMDY4MTE5ODNCODBFNjFFRjEyNzg5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZEODFDRTBFMEMyMDY4MTE5ODNCODBFNjFFRjEyNzg5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+59nvfAAAA1FJREFUeNrsmktuGkEQhvtH7MzGhmzISeAMjpRFkruYZJdADkOkJMrrBCGy72FvAvYGryvdM9ND9zwME1WhbtQtD54By+qP+us5AyJSp7CQQBJIAkkgCSSBJJAEkkASSAKJbfVY/9tqQacBoqDUn490AiAdGJiB+7wG0RY5xOdW/Fbr8RsEB6uQE4gPxEpleoWDILpK8Wgg1GFjEw3bxXrHlRZ13Bix+gsPSJY/On670xkUo1F4nf1/NmWiHINVeqwEE9/RAZB71K1i/55CschhymqECcvZkX+pDRKh1ULR77k+Fox6lPQR1CWSbd74gMn4TfLJwIkFhgdkavPCHgFqywgYQ6j6dUt5PJHASxmGJq1yt/AzuEtlc0cGSw3RK5QO0WwQTii219SW/WkHF5a0igSnf9bf39Lm4dEzyPr+UW0etg4Ln5P0lcTS+xtdDLLfm/utGp4P1HqzVaPhwOlX+Kwh4+yqaK6QW8dAmDW6OCsgwFm9C4GUTovdpm3WB3bXenmyC9FH1lpK+eYrSZCIP3mIOrvKndqs5c8bJ1hBX1+XHNzjNJEB3UZHrGHm2NVoSyXo6HKO4C3idb1UH0wAkUirVt6TPzKSmNLKzX7LytZx8CIkc+YPeYugqiESyR/yIERltCoJIOQg8j5SyR8kZxVBacEvW+w5opOWfaHWVjj8qKX7EFNL2YLRzYymjB+aynhyFX5CNLIanp/5Miss4r0fPIjTc3z6daMwnanlj+t6VxyDRayUXn/4opbvXqo3869KkkQ8/GYDuuooSCCXCEqLyg2juvlopOU2Hfp49f6zXNkr6yMNUxJSivsu1RGkpdrnvW6SDF9a5AyvsRtMwI9onKsv5iO29/DkRZH5iHIgUAWMqown1TgugZxV5PuRqj9EZRGgOUIJtrp9Of8orOHe+0BsJQrQqCrJ6CUDYpumtnwYn7NTu+TiSIh7ghhzmytsERz4XvAgLQ8CRJkQ0XQd3aQxnywCGNvDzrr0ee2IRlq6Z791zDKOwyL2MQ40ly0F1DhskOxp07xcN/fW7TLn+Y3ScrpyyypkiZGpeerBGGB0uXhe/ezvt1kG8OxF9tndLphReCC5krBPOnd+VA4XxJ6OnwIIHuTY658AAwA++X+lGVw0cwAAAABJRU5ErkJggg=="),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2RDgxQ0UwRTBDMjA2ODExOTgzQjgwRTYxRUYxMjc4OSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1QTdDN0Y1NjIwOTcxMUUwQjk0M0I1OUNGRTg5NkY2RiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxODJCMDc0MjFGREIxMUUwQjk0M0I1OUNGRTg5NkY2RiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGODFDRTBFMEMyMDY4MTE5ODNCODBFNjFFRjEyNzg5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZEODFDRTBFMEMyMDY4MTE5ODNCODBFNjFFRjEyNzg5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+6p0s6QAAA4BJREFUeNrsW81uGjEQ9iBu5dJAL8l7VALeoGqlXpJ32dBbC32X0kN6SPMEUKV9jnBi0ws5T9e7tte7Nruo6wEb2dJKwLLRfJ75vvkxAURk57B67ExWBBKBRCARSAQSgUQgEUgEEoFEIP+31ovm5ubXVzwPj2AoHgFo90rbfS+A8LaZg2lzCQEY96HVNAOY3GYooQXsqYHIXc6NPT5XHHoExNWyJgnkX3McXj233kgOixmUwuBOjk+TEDngnEvoW2jBHjUG1C9Dqhk4C7HuQPLwMHfXMLy+xjIM3ShY31m6tqgVrhdCjjN+T2/3P89Ll3ECXoYWrhZlToGWZx3Mn3tU/BDSpAzNgdm+A96QHTWu2DBiA7dEJXBIEiUHkhthAcM/x5rkGoWju1LFDUf02kn2HNxYEMYa98H+7MmBoPYCCxDp80tJYtSqXqw92FGt1H44O7HKwwU0EgNLn3dseDFg23THRsOBAIwlgSYJ+BVaghPbzPBSUhkbvn6VvxtdDCqc33JvOQRBU2sJ85Y/H7X4x6onCOp450B4OHFbr9+9rdj//eGP8MbOqVq554gEcj/DIqS0nQdQbXCa8WX4fu4cSd/1H+TkrvTvyisFGHXfdyCySDRk2WHOOA4QCQJA4zeQ9ep0qiVlVeceajVkMECM3r2aJ6nA0PXsACrDF8TXhGztfgbcJwOyd+qIoZCdmWRXKoaBcYRn8HRXNlZQk+VKT+I7R5iWCI2wgkA8ou+2XiNWisgAgKR/X4rSXYBYPvxmMJ2x5f0j838ar9dbog+R5L75cse+ffrIbuY/zDLGb47olS+fcc2LT/KRkAABIXCEaUMHMXnH+gwLgwCC5SBCrOvPd6BUjKBMIQwtKPNIfXSKGAoQnSZQThIxtDwivWCMTGkGD/SZXYyJ6j2X7TwlkKLR0gZ7P9dqlFdontB7S/YmAQgGCFp2XkVWMB6B/W7BoFSr6RyHZvpAp1q1EoUaDK38WskeakK0AgxFteRBqG3zMbRxUJNHxgkEFFqWHwMgkg2yaUemR/zPwF53e8F6yd9jZa8v5SU9Zf2+jx7B1dyIK1wtnigTImmJkh9DVzijqsZL74FkO48FiB1782FxJT9PFSjgHnvyHgg/nq6D4GuUvef3+AXT2ZXzGOh6PG0h6iFhszHzZDc7KBLipgHUhkp+OwNp2Ukyw+vrnwADAL3eXlrFjskZAAAAAElFTkSuQmCC"),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2RDgxQ0UwRTBDMjA2ODExOTgzQjgwRTYxRUYxMjc4OSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1QTdDN0Y1QTIwOTcxMUUwQjk0M0I1OUNGRTg5NkY2RiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1QTdDN0Y1OTIwOTcxMUUwQjk0M0I1OUNGRTg5NkY2RiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGODFDRTBFMEMyMDY4MTE5ODNCODBFNjFFRjEyNzg5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZEODFDRTBFMEMyMDY4MTE5ODNCODBFNjFFRjEyNzg5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bHI8+QAAA2dJREFUeNrsmj1u2zAUx/k3stVLY0/OPQLEOUHTDF2cu0Tt1tq5SzO0QYH2BHWB9BzO5LSLO7+KlPghSooykPZjQAGCE8VG3s/v689HgojES7iQQTJIBskgGSSDZJAMkkEySAbJIAe6Rnv9b+sbSg8kotH798h65cFQxzP2IKW9gBC/as8YDyEhjyjjoVjE2XVl+bx8lWCCEgLRlXB+Dd9JCiZCeI2i5IU01odogIUPr6MoEPQMb7H2iIbo8obxSoEY5XkUNMEPqBJGQRO8IzcAkHvbHCFbmtmArOty24o0dBtqSjHHZEd3ItN6ZZ7j/H20xA8HQj1lVRmLqj/+XA2//+A5AtHq2pXhcJoh92SXMT/4DZPlVDlFQeVKwD5Cjs7yPIUeQcmzIToh5DY78kqz/hs5zZH7wmr7Z2cgt487KxYBpjlS50lleB370PaSkM+nx6+85slZNLp6q7wnx2P1Op2MvbyGXadwDa1HE05kS65pfBStBAcFmV4uofvf7ff7Rsm9/XFvYf/u0lkhLi5OTUeX4bZ4cxp1SRI8R6YyL9ylOblaDMZz/D1icoKa0oW87s4eRFUjNBtko5unNEXxveE9TgdESQ+y4x/jIUoMxF3Okuuhut1HmAtHA2n2Cti6S87oKAWQydtlqb3+ia3b6UVyye71FbepaOXLdz3SrR/tD7CCUoOtuY2D+sLr9dgrv2QkSwMohdCybqnDiijKICIyCNWGU6l+fwvMi1oVe9WMP4hN7KtPX8XnD+/E1fKuGVKBxqbxPSKqcFIzLv3qavlAaXK0F48465J2SBHz0DJDOGvv4uMXiBYLUsgRRy/q7QYp8+GWYvah5ZRb31r9LKBaiat+tcGdW3FhJyrxDwzgiSY5tN948NBSEh3945LAeyPxQNwy608UdTUD9xyR3hgaXD1nG/vgHsHQDlWckVC8sygQ3WEFiBgD4PAgNKA8NGTATZ5Iyd5DYoYNiDL8jbc/8pRkOSsSmP2avKCOIoBETgf5X31jU1QfRivAFgRA43a1VPn7TN597wX4yvgZzouTtro1w7lZffMPrXI5u/HXTNUIFfKQzUYDswZxIdTeen1NL1cnanwq1+0WJlxGhjgb78X5bPut2EgQafzARx+qOkAsQcRA6Dy0mz0TEA7XiwH5L8AAhuSgvwcpH7EAAAAASUVORK5CYII="),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2RDgxQ0UwRTBDMjA2ODExOTgzQjgwRTYxRUYxMjc4OSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1QTdDN0Y1RTIwOTcxMUUwQjk0M0I1OUNGRTg5NkY2RiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1QTdDN0Y1RDIwOTcxMUUwQjk0M0I1OUNGRTg5NkY2RiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGODFDRTBFMEMyMDY4MTE5ODNCODBFNjFFRjEyNzg5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZEODFDRTBFMEMyMDY4MTE5ODNCODBFNjFFRjEyNzg5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+qg6egAAAA11JREFUeNrsWkty2kAQnaa8i7MxZOMcJGVyg3wqK/suga3Bdwkbp5L4BkA594BNgCxC1i+aEYNG0khA0Q0zKVElS2YkVT+9119BANT/8KEGSAOkAdIAaYA0QBogDZAGSAOkARLbp8V6t+lD/VOZPCAOIDvZRSSM7MPKVIYVXiBEu1nR6wISa53UI7s9MmCJ/9YXbHeyT1kbewY3YWZkDyu7n0kigrVYHXwXGyUWhwgLiDbnEAiWlfCkhYogRnC3/OLmD5PEjgdi5YEyiNrrbiwrPOpiiFqbcHpTlgvGw+yUbq9ak5qVI+XWkpLVFoRex47rKQRpVWVzKgIb+K9lUhdfHik6LQoWElWcTyxR7Hggrm+4BaE2zhhP5fMsCPA5Ow8jtn6CY6QGBY8fbZnAxj8oICBuL0KpsYvlOvvfGmtAwMmg5I125211c+VGSs9i9Vd1rl4k+3Wyf5lnALwZnrVnX3zvo9O+zJRERcbSL5a/16r9fsBapvD3I0ilM3p6To+RZ0mZaM1fy7MD0XLS1t6+e5NRgg2wRFbL1VpJdFbs4yAjr8Qv0kSZEZEBTfzlw4CCZ6RzdVnO9pSFYbMexRTF9XQSnQAJ9ey+2gueootUJIyYBOeUJnTguCiocdA20bmGQ1RmgnMt5HMLUVaaTKMa0FFNc4KYGCmMV6Cqe5OQgSxWfwqEIC85xpmWvLSIClKi6rAcJJDkaW/V4/Yj5EoO4QPRhWNblyIbJkZPPxW97avRj+c8U6EDMfWU4xJ394/qS/+Tuht8jUxahehkZlzJMSZDR1aICEiup3IdPprwC6ckSfe394+UjX8Qi7QonxCpLuuHzoh3OOcCQySMWBmRpzQRqIJbosoqDuBQZCyGqFUrH74JoywQO8/yPnUE/p5dHVCmR9OPYM+qOHxGVP1bLAFGLk7KCCCWEOUY8RorNNQS9RFfgSuQ0U9TNHolJzNHFRrQ9chfLMpUvvL9CODPL+H+qOYQv6aYfKTGdUKdxhORd7NPPzm+tltW+FadH1gegWeKiPFgJphGZGutxWpd5RvXwQPBeGhqeP3Lh1cfh6/t9waUnUlMhjP22HLsW92ivn9965kbuiCctZk+u5OuzfORGmEB2VM283LKCQ9IHah5de48M5BQPv8EGAA464vJ8IbuGQAAAABJRU5ErkJggg=="),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2RDgxQ0UwRTBDMjA2ODExOTgzQjgwRTYxRUYxMjc4OSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2OTAyOEFENTIwOTcxMUUwQjk0M0I1OUNGRTg5NkY2RiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2OTAyOEFENDIwOTcxMUUwQjk0M0I1OUNGRTg5NkY2RiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGODFDRTBFMEMyMDY4MTE5ODNCODBFNjFFRjEyNzg5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZEODFDRTBFMEMyMDY4MTE5ODNCODBFNjFFRjEyNzg5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8++YdiRgAAA09JREFUeNrsWstuEzEU9Rl112yahE35EsonIMQK/oVk24R/oSxA6uMLCCr/kaySdkPXF3tmPH7U0yTVdWRHtmpp1LFaH59znx4QkTiGUYkjGQVIAVKAFCAFSAFSgBQgBUgBUoC8biy+0ZEwInEs5nQEQLD70j+87FX8OLCbBCllRnau/4ndpipeQ5dsXHzFbtRRqozssTENFskaO+1nUMTn5So2WWHP4+0kiMQYUae7LxgFAjxGX7FJSoF45xo6ALJnkBWmTmd1SPMIgtnbtqIC6ZcI/Z7JOa9nDzqWHZzEzH9oMW8Pu+fEtcdiAMPDSK31wIa736GeYVbAEhuZAyJcecGP4uSygfYdkgICffBm1F6MDKiLCYyk2oAonnu7V/131ouemg3LFetUnfz0ioyhM4CIYOzUpR6b62l9ROPhoAVBYv3wVK8aD0/ZbCMSEHRgRmqz8sQ3D//E6Oy0BjEeDczmIdjYiNN8AIydSBZGZwPDgg2Ckk3jrUSQXora1Ejv8SntdpCSkh07TMDTXg1s0TwqEKWYxqhJXN3dO0xc3dw3GOUi7ltxxLhn39xMaTQcGGI8lW0epQP4MEPSjHQ9CLKM2jksfjaiAXE9MayYEa93h2ifcNTlr/AAwCtzs2KEuV1y8HpEM0FgLaAOz4ifuhNbVXvoChFMnZYkGLFoAF81eDgg0mM1uZSbQCoUa5XCRLhDqWKxoVJ31+2izYIHeeRabukL8eP2r8D7SZt3oct+8wCimwry5/PlT/F9+kl8ufxlxZRcGOm8E3UtINMKooyMHXCZsb1xVu6XyPG+Ul7YFmIyiOwIAOSX10k0aflpu715ZGXs3oZ1l1GIjNyvLScg3CrKJ42n50AiVolVPENHT9hARjYSih/2M+UiLaLtz/kUVi0FdqMBudUjTvfBZyonY1cxI9g9iZP5xmWkz9UiO2m90IDIqkEXxEEZSqs3GGbnfnvsgxL2WpDxwZ/aQ8nncz0bbOhZn6q0PE8ra/al9ZXDeRY2IjdNoQueJrKrhsRsyQ2migKiTUf0BwJqqA5jc1HaZL8NQ4wC4Ljo8TW+vp7Uf/bNx/lbf618t7TerUx4ofSAtGObdFZunEwXSB+gVTjzTwBICuO/AAMAYBht6HW6KDYAAAAASUVORK5CYII="),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2RDgxQ0UwRTBDMjA2ODExOTgzQjgwRTYxRUYxMjc4OSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2OTAyOEFEOTIwOTcxMUUwQjk0M0I1OUNGRTg5NkY2RiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2OTAyOEFEODIwOTcxMUUwQjk0M0I1OUNGRTg5NkY2RiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGODFDRTBFMEMyMDY4MTE5ODNCODBFNjFFRjEyNzg5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZEODFDRTBFMEMyMDY4MTE5ODNCODBFNjFFRjEyNzg5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+6ju9zgAAA3dJREFUeNrsWsFuEzEQ9Yt6azlAwiX9D6SGL0ACiUv5l6QcSfiYcACpol/QIOA76CnbXtrzsPauvd5de7Pp2qld2VK0iZxI8zxvZp5nAiJiz2GN2DNZCUgCkoAkIAlIApKAJCAJSAKSgAxfm1X3RefXV4rEI+jephg8suGnTY/fDwIIpxR2eAQxxAhyK3kfYDa3m8v3gcCBUI8jny0gwDgM+JFzWglD5+jluSA9Ik4X/dPRWQ6WZOAPX0duKUUFbfb7EQsHiOVUAVA9xgm+0pfbGNnhjSYwhWWXCjgIEO4N2A+XrpeMNivxbAMv4yQYanX1j0VdKZ5GMHBDseEeUYbA6I2i+DEFxlfMDwfC0ygjM9el4TKjkYGW5AaJo2Cv6FOr1hyk7gW9UCrQ+6Zs71mLCho1pQdprJPGyyfcVXg3QGby5LVYUbWlotT29qEEUX6P3Kl5OJ1YKSMrN2R392z88liAmLw6bieFPrrs4ED4qV9eUGGwFj9oZ6ft7T2bvF86K+1+boicZgbur69+e7tbjXxgyPLT5vxf//xTxUj++fzdG0U31yNY+Jjqbi8XOb1O2rWkfLvN3NLKrYzX1mT8ojK+VvAK2+sxFHKMUKN+7HsVDgaIlCzWuwfFAoRVxU5Xt4+6RT51+pWFUSUT6nX5CgeIlCbSE6qewAulPHqEtGzF2h6JB4iUJFQ3HvCSrfwAUX1fnVZVoHN9FQcQNKQ56ak4JmrV4kGjFhV5GLV7StAxUtGJC0a8vWDfrv4qeo1z/eWLXh668YUnPi1/sPXnj+z8y/datZ+MTyIBUtYN0ZTLQfFnTaIQi8kjaNcRNJVw0EDKSVSZpXJaodXbgp9acuQ82JsGU5t2cXikSZ1Z2YlsSpcoJIotFBBNjFgWl+6yK+9Jb/kZ9ABte8lCvXDrSIe98QR7R9MBrHsgFFw7yFb4PMaH3y6KzWjERC1rQyu2O7uprwVtJhKT+jUa7HBCdRj1azKW/EoUD01sWIwti+TZPJIGnZgn7rrTx6q1VCKLrY6QoY5Q4O0gAK2XTMP5+6l8FQmAjN8HEDK1wBsP/5qpma5XFAu1pqabFZ8b+mw2Ogeie0EYX67XH1anRXNOtIgoeCCYLU6zuwfxTwduvL7HP/O9LHPfbRw8nrYE6rTHT2/qSY2CBGIDdGPP2E8MJJT1X4ABAKKcdECg9QD8AAAAAElFTkSuQmCC"),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2RDgxQ0UwRTBDMjA2ODExOTgzQjgwRTYxRUYxMjc4OSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2OTAyOEFERDIwOTcxMUUwQjk0M0I1OUNGRTg5NkY2RiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2OTAyOEFEQzIwOTcxMUUwQjk0M0I1OUNGRTg5NkY2RiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGODFDRTBFMEMyMDY4MTE5ODNCODBFNjFFRjEyNzg5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZEODFDRTBFMEMyMDY4MTE5ODNCODBFNjFFRjEyNzg5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+3ERBYQAAA2RJREFUeNrsW0tyGjEUVFMss0qcDb6HqyAnyK+yiX0XyNbgu8RZOJVKcgKTSnIOswnYG7x+GY00kkbDEBbvTTSUVEUZDyzU6tevex4AIlLHsAbqSFYGkoFkIBlIBpKBZCAZSAaSgWQgGYhbywUdLyM/rsTADTtjY3lFPWQE5lFtvgKGPpaW3vRkarY+mcGBENLOoDORjwtQJEfLQIYKMhuPl2YIMqwIAKH9p16xwgyGF0jZXuG1sWuVrxF7ifECOXhqacuP0VcGvCKHO2gAFD6aWrHEpMfIHpFbYA32wGeUQ14cdQy0XLhTx4tZjMy+RokxEumXbhfqMDfnET1v1qI28RdeeDvvWfp1nYj2n3gFcl+r/i9AsIsVuPzYTMJQnG2LD8h4Wg+GVVCkCGnZpokVhIAhBpQUp77ebN31zcPWe00vNKLbKsxmT54+Uev7rZcE4Nrb+v7RxPskgUxsVK+EDAOmAtXe3pJOv9TaqUo2UgeyeXi0nQrq+utP5YRdXPv0/bcT/cmbORJnxJ/8+asz24JRXnv/8kykrESAPHs9N+ZB7fG+rpekhw9RlwUC3UCEFZm5loKN6djRpIi17QoDsSff4dBUcGRKQYkFAVKADRlGXPq1gbG1xFJmRIOobZz8X1IurqTPCAVCD/xDO7l+ym2CwqFRRYyg9A3p77cxj4NC8wtKDEp8Md4hBoZX6YS8s0u4uWBpoT7qQQiyL4yQf6JTr55jXX/7JXoPwg+k9A5yuriYf1YfP7xTF5c35hqRuFAGbGwEpqeHc4CdZdUCY/KlRVG30v+S85GeZS340y/2fn55Az+MiONLskDC0iE/PQwn88Kdiz+ixBumPnWt0ENiTdRmu0gciNsstZQQiUcV/tDY2qVQz2TpZq1ws1F3Ku8K+6IRN40/oH4EWBl2U1YqGEbIuLxA+m3RAtMnU90ACb/V0GqAMgFSbtKoyywWPcIbsNSBlB0KKvwWRMPl0RdG8I8YM56mOTJF84RR3IuQMXrzWnGPQpU+4vdz/IRwKNZG/PBh1EXWkgAy2u0pJodhMju171mlrJGRKaP5nf6767NCWi7uehEaQxDP3y5Oq+slKPuJb6EXdjDgEFog3tG+9/35MisBWIArTrFzA2lqpblWzYiWCJAU1tH87OKvAAMAXyphayDYhFcAAAAASUVORK5CYII="),
loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABQCAYAAABbAybgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2RDgxQ0UwRTBDMjA2ODExOTgzQjgwRTYxRUYxMjc4OSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3NjM0NTdBMjIwOTcxMUUwQjk0M0I1OUNGRTg5NkY2RiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3NjM0NTdBMTIwOTcxMUUwQjk0M0I1OUNGRTg5NkY2RiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGODFDRTBFMEMyMDY4MTE5ODNCODBFNjFFRjEyNzg5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZEODFDRTBFMEMyMDY4MTE5ODNCODBFNjFFRjEyNzg5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+aC5hwgAAA1tJREFUeNrsWktu2zAQ5RhZetPY3dgHKercoE3RVXIXx8vWyl3qAm2BNj1BHLQ9R7KynI2znooURQ/1tRGOTQYkICSRFGAe35svBYgoXsLqiReyIpAIJAKJQCKQCCQCiUAikAgkAnn+Wl63NzrLBANhpMtOCIARxQa0swG+S0uC2MVIxy12j01VkykELi3stnFyBeo9hw5/4hTDnY5Ub6c7bLevjEjf2Gd/lfSwO0wfTVpKNi7D9CGlZbRuYwAAtAMVApfEHDEC+dURqcrAKr51VEYUG832421i5ANns6oM9/UtPmnBDgrJH+IyYQtgPVc46nY1Z4O815TN0QcgMmdoF6mGUiwBBbaay42zy51GbTTN1tIHkNhPg4ECAfn/TabgSdSihSDYUchICrf3C+YcFo5ugJgkCNrw+sZqlW40Y+g8j4DTEytlvJQYGFtX640YnvZF+rgRg+ynzQQ4kZV7INlKf81w8KqvaaGerqnSfpE+PonB+zn4Ja3akAwm4RcgFjd/DVOujy6dA5EGptIXMou/EsMlmIt3b3LW1k/u947jVHf1c4bD0z7JdLasVhmQ4fkcvGZEri2IUtpH+tz34YNVc2gWyr7DsE4El7fXlSYoSkz5zkiRFLHMTk2p4vc4qCVz790KHwuIKRpRcJQiB/YRQcoUAgb5wPRYANQ5NoCziQk/EKvixYrfcGR0PkaQsEJZAGB1k557FDTiopVD1J931xgAkO2WL37/U+Ofxc0fc1+WJqq5CkJaOuxefv4uvsw+isv5DyKvDMygHwqQ3B+KUZA1EkK+wMUAhAzsjIPTIR4GxIje+YtP38AqV5CnYGRKiG0aglAYIR1hkUtMkYisNRffOXtjCx0EI7AFQDtD1X+EVGt1Ggw2QP+dvUZaRRBgIoWvZ28rJsOofrE+8QGrrzNm9pbIHE7RWBd6247e/GYEDplGuD6qgRaQQRWNeDAmGMNvU2+uK99gBnRN41DgHdAxFo2HlVb87nerGKhchbNnv4+Kq8j25p1wGEGBt/P7ciDI7mEo0hqR6YO5ma43AfUjQo1/7otRqfxIoFjD82QsD0H1qAi9BwJnV2M5TcxPbpMxffb6Q6KfuZ82Pvt4usFxR93JHx9CANIE6IEA8YsRX9Z/AQYAY5Ren1h0vB8AAAAASUVORK5CYII=")
];
   poseImage.push(frames);
   menImage.push(poseImage); 
  }
}


