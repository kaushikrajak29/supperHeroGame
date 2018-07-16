var canvas=document.getElementById("hero");
var ctx=canvas.getContext("2d");
const box=32;
const ground=new Image();
ground.src="ground.png";
var hero1=new Image();
hero1.src="hero1.png";
var hero2=new Image();
hero2.src="hero2.png";
var monster=new Image();
monster.src="monster.png";
var bullet=new Image();
bullet.src="bullet.png";
var smileimg=new Image();
smileimg.src="smile.png";
var cloud1=new Image();
cloud1.src="cloud1.png";
var cloud2=new Image();
cloud2.src="cloud2.png";
var cloud3=new Image();
cloud3.src="cloud31.png";


var dead = new Audio();
var eat = new Audio();
var left = new Audio();
var right = new Audio();
var down = new Audio();
var up = new Audio();
var kicksound=new Audio();
var bulletsound=new Audio();
var monstersound=new Audio();

dead.src="dead.mp3";
eat.src="eat.mp3";
left.src="left.mp3";
right.src="right.mp3";
up.src="up.mp3";
down.src="down.mp3";
kicksound.src="kick2.mp3";
bulletsound.src="firing.mp3";
monstersound.src="monsterlaugh.mp3";

var bulletpos=[];
var heropos;
var monsterpos;
var monsterdelay;
var monsterPresent;
var cloud = [];
var score;
var lifeline;
var dir="";
var bulletdelay;
var bulletspeed;
var speed="";
var key=[];
var clouddelay;
var cloudspeed;
var kick;
var die;

document.addEventListener('keydown', function (e) {
    key[e.keyCode] = true;
    if(key[38] && heropos.y>2*box){
		dir="UP";
		up.play();
	}else if(key[40] && heropos.y<16*box){
		dir="DOWN";
		down.play();
	}
	if(key[37] && bulletspeed>8){
		speed="DEC";
		left.play();
	}else if(key[39] && bulletspeed<50){
		speed="INC";
		right.play();
	}
	if(key[75] ){
		kick=true;
		kicksound.play();
	}
})
document.addEventListener('keyup', function (e) {
    key[e.keyCode] = false;
})
function init(){
	heropos = {
		x : 3*box,
		y : 8*box
	}
	bulletsound.play();
	var bulletno=Math.floor(Math.random()*15+3);
	for(var i=0;i<bulletno;i++){
		var bulletpos1={
			x : 22*box,
			y : Math.floor(Math.random()*17+1)*box,
			type : true
		}
		bulletpos.push(bulletpos1);
	}
	var cloudno=Math.floor(Math.random()*3+2);
	for(var i=0;i<cloudno;i++){
		var cloudpos={
			x : 22*box,
			y : Math.floor(Math.random()*15+0)*box,
			type : (Math.floor(Math.random()*2)==1)
		}
		cloud.push(cloudpos);
	}
	bulletspeed=8;
	bulletdelay=Math.floor(Math.random()*6+(4*box)/bulletspeed);
	clouddelay=Math.floor(Math.random()*8+(4*box)/bulletspeed);
	lifeline=100;
	score=0;
	speed="";
	cloudspeed=3;
	monsterPresent=false;
	monsterdelay=Math.floor(Math.random()*20+1);
	kick=false;
	die=false;
}
function drawBullets(){
	for(var i=0;i<bulletpos.length;i++){
		if(bulletpos[i].type)
			ctx.drawImage(bullet,bulletpos[i].x,bulletpos[i].y);
	}
}
function drawCloud(){
	for(var i=0;i<cloud.length;i++){
		if(cloud[i].type){
			ctx.drawImage(cloud1,cloud[i].x,cloud[i].y);
		}else {
			ctx.drawImage(cloud2,cloud[i].x,cloud[i].y);
		}
	}
}
function drawmonster(){
	if(monsterPresent){
		ctx.drawImage(monster,monsterpos.x,monsterpos.y);
		monsterpos.y+=box;
		if((monsterpos.y==heropos.y) || (monsterpos.y==(heropos.y-1))){
			if(kick){
				score+=200;
				eat.play();
				monsterPresent=false;
			}else if(monsterpos.y==heropos.y){
				lifeline-=40;
				dead.play();
				monsterPresent=false;
			}
		}
	}else{
		monsterdelay--;
		if( monsterdelay == 0){
			monsterPresent=true;
			monsterpos={
				x : 3*box,
				y : -4*box
			}
			monsterdelay=Math.floor(Math.random()*6+25);
			monstersound.play();
		}
	}
}
function addBullets(){
	if(bulletdelay==0){
		bulletsound.play();
		var bulletno=Math.floor(Math.random()*15+3);
		for(var i=0;i<bulletno;i++){
			var bulletpos1={
				x : 22*box,
				y : Math.floor(Math.random()*17+1)*box,
				type : true
			}
			bulletpos.push(bulletpos1);
			//bulletsound.play();
		}
		bulletdelay=Math.floor(Math.random()*3+(4*box)/bulletspeed);
	}else{
		bulletdelay--;
	}

}

function addCloud(){
	if(clouddelay==0){
		var cloudno=Math.floor(Math.random()*5+2);
		for(var i=0;i<cloudno;i++){
			var cloudpos={
				x : 22*box,
				y : Math.floor(Math.random()*15)*box,
				type : (Math.floor(Math.random()*2)==1)
			}
			cloud.push(cloudpos);
		}
		clouddelay=Math.floor(Math.random()*8+(4*box)/bulletspeed);
	}else{
		clouddelay--;
	}
}

function draw(){
	ctx.drawImage(ground,0,0);
	drawCloud();
	drawBullets();
	if(die)stop();
	for(var i=0;i<cloud.length;i++){
		if(cloud[i].x<-250){
			cloud.shift();
		}else{
			cloud[i].x-=cloudspeed;
		}
	}
	addCloud();
	if(die==false){
		if(kick==false){
			ctx.drawImage(hero1,heropos.x,heropos.y);
		}
		else{
			ctx.drawImage(hero2,heropos.x,heropos.y);
		}
	}
	drawmonster();
	drawBullets();
	if(lifeline==0){
		die=true;
	}
	if(dir=="UP"){
		heropos.y-=box;
	}else if(dir=="DOWN"){
		heropos.y+=box;
	}
	if(speed=="INC"){
		bulletspeed+=2;
		cloudspeed++;
	}else if(speed=="DEC"){
		bulletspeed-=2;
		cloudspeed--;
	}
	speed="";
	dir="";
	var flag=true;
	for(var i=0;i<bulletpos.length;i++){
		if(bulletpos[i].x<-32){
			bulletpos.shift();
		}else if(bulletpos[i].y==heropos.y && bulletpos[i].type==true && bulletpos[i].x<(heropos.x+3*box-16) && bulletpos[i].x>heropos.x+box){
			if(flag){
				flag=false;
				lifeline-=20;
				dead.play();
			}
			bulletpos[i].type=false;
		}
		else{
			bulletpos[i].x-=bulletspeed;
		}
	}
	addBullets();
	ctx.fillStyle="white";
 	ctx.font="32px Changa one";
 	score+=(bulletspeed/2-3);
 	if(lifeline<0)lifeline=0;
 	ctx.fillText("Score :"+score+"     "+"lifeline :"+lifeline,5*box,box);
 	if(kick)kick=false;
}

init();
var interval = setInterval(draw,300);
function stop(){
	//ctx.draw(ground)
 	ctx.fillStyle="red";
 	ctx.font="45px Changa one";
 	ctx.fillText("GAME OVER !",5*box,10*box);
 	ctx.fillStyle="blue";
 	ctx.font="45px Changa one";
 	ctx.fillText("your score is "+score,4*box,11.3*box)
 	ctx.drawImage(smileimg,8*box,12*box,);
	clearInterval(interval);
}