function Zombie(gameId, startx, starty){
  var x = startx;
  var y = staryy;
  var game = gameId;
  var hp = 10;
  var damage = 5;
  var color = '#2ca721';
}

var followPlayer = function(players){
  var zombieRange = 800;
  players.forEach(p => {
  if (p.x < this.x + zombieRange && p.x > this.x - zombieRange &&
    p.y < this.y + zombieRange && p.y > this.y - zombieRange){
      //follow code
    }
  });
}


var shamble = function(){
  var move = Math.random() * 20;
  if( move > 5 && move <= 10){
    this.x += Math.random() * 3;
    this.y += Math.random() * 3;
  }
  if(move <= 5){
    this.x -= Math.random() * 3;
    this.y -= Math.random() * 3;
  }
  else{
    //drool
  }
}


function populateGame(gameId){
  var pop = Math.random * 30 + 20;
  for (var i = 0; i < pop; i++) {
    var sx = Math.random() * 800;
    var sy = Math.random() * 800;
    //change this to actually add zombies into the right collection
    zombies.insert(new Zombie(gameId, sx, sy));
  }
}
