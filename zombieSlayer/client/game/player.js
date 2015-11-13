function PlayerHandler(gameId){
  this.gameId = gameId;
  this.userId = Meteor.userId();
  this.screenName = Meteor.user().username;
  this.color = '#4e00f5';
  this.speed = 1.0;
  this.accel = .3;
  this.hp = 100;
  this.zdeaths = 0;
  this.pdeaths = 0;
  this.zkills = 0;
  this.pkills = 0;
  this.r = 1; // radius
  this.ammo = 100;
  this.type = "player";
  this.bullet = new bullet(1, 1);
  //friends
}

PlayerHandler.prototype.init = function(main) {
  this.controls = main.controls;
};

PlayerHandler.prototype.enterFrame = function(main) {
  //might not be used here. this is where the movement update code and shooting event code goes
  var controls = this.controls;
};

function bullet(d, s){
  var damage = d;
  var speed = s;
  var x = 0;
  var y = 0;
  var vX = 0;
  var vy = 0;
}
