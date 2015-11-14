function genRandom(range) {
  return Math.round(Math.random()*800) + 1;
}

Meteor.methods({
  createGame(gameTitle, numPlayers = 2, privateGame = false) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized", "Yo fool.  You can't do that shiz.");
    }
    if (! gameTitle) {
      throw new Meteor.Error("missing-title", "You need a game title!");
    }
    if (typeof numPlayers !== 'number' || numPlayers < 0 || numPlayers > 6) {
      throw new Meteor.Error("idk-error", "Oops and error occurred :(");
    }
    Games.insert({
      title: gameTitle,
      createdAt: new Date(),
      activePlayers: 0,
      numPlayers: numPlayers,
      private: privateGame,
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteGame(gameId) {
    let game = Games.findOne(gameId);
    if (game.private && game.owner !== Meteor.userId()) {
      // If the game is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized", "Yo fool.  You can't do that shiz.");
    }

    Games.remove(gameId);
  },
  joinPlayer(gameId, playerId){
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized", "Yo fool.  You can't do that shiz.");
    }
    let gpId = GamePlayers.insert({
      game: gameId,
      player: playerId,
      screenName: Meteor.user().username,
      x: genRandom(),
      y: genRandom(),
      xdir: 0,
      ydir: 0,
      mx: 0,
      my: 0,
      r: 10,
      color: 'black',
      hp: 100
    });

    return gpId;
  },
  //keydown events
  LEFTd(gpId){
    GamePlayers.update(gpId, {$set: {xdir: -1}});
  },
  RIGHTd(gpId){
    GamePlayers.update(gpId, {$set: {xdir: 1}});
  },
  UPd(gpId){
    GamePlayers.update(gpId, {$set: {ydir: -1}});
  },
  DOWNd(gpId){
    GamePlayers.update(gpId, {$set: {ydir: 1}});
  },

  //keyup events
  LEFTu(gpId){
    GamePlayers.update(gpId, {$set: {xdir: 0}});
  },
  RIGHTu(gpId){
    GamePlayers.update(gpId, {$set: {xdir: 0}});
  },
  UPu(gpId){
    GamePlayers.update(gpId, {$set: {ydir: 0}});
  },
  DOWNu(gpId){
    GamePlayers.update(gpId, {$set: {ydir: 0}});
  },
  mouseUpdate(gpId, x, y){
    GamePlayers.update(gpId, {$set: {mx: x}}, {$set: {my: y}});
    //console.log(x);
  },
  mouseUp(gpId, currentGame){
    console.log("fired a shot!");
    //instatiate a bullet here
    s = 6;
    angle = Math.atan2(GamePlayers.findOne(gpId).my - GamePlayers.findOne(gpId).y, GamePlayers.findOne(gpId).mx - GamePlayers.findOne(gpId).x);
    Bullets.insert({
      color: "#e40b0b",
      r: 3,
      damage: 5,
      speed: s,
      x: GamePlayers.findOne(gpId).x,
      y: GamePlayers.findOne(gpId).y,
      vx: Math.cos(angle) * s,
      vy: Math.sin(angle) * s,
      game: currentGame,
      ownerId: gpId
    });
  },
  updatePlayer(gpId, xpos, ypos){
    GamePlayers.update(gpId, {$set: {x: xpos, y: ypos}});
  },
  updateBullet(gpId, xpos, ypos){
    Bullets.update(gpId, {$set: {x: xpos, y: ypos}});
  },
  addPlayer(){
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized", "Yo fool.  You can't do that shiz.");
    }
    let playerExists = Players.find({'userId': Meteor.userId()}).count() > 0;
    if(!playerExists){
      console.log('ADDING PLAYER!!!');
      let newPlayer = Players.insert({
        userId: Meteor.userId(),
        zKills: 0,
        pKills: 0,
        zDeaths: 0,
        pDeaths: 0,
        color: 'black',
        friends: []
      });
      return newPlayer;
    } else{
      console.log('PLAYER ALREADY HERE!!!');
      let playerId = Players.find({'userId': Meteor.userId()}).fetch()[0]._id;
      return playerId;
    }
  },
  wipePlayers(pId){
    GamePlayers.remove({'player': pId});
  },
  populateGame(currentGame){
    if(Enemies.find({'game': currentGame}).count() === 0){
      //populate
      console.log("populating");
      let pop = Math.random() * 30 + 20;
      for (var i = 0; i < pop; i++) {
        //change this to actually add zombies into the right collection
        Enemies.insert({
          x: genRandom(),
          y: genRandom(),
          game: currentGame,
          hp: 10,
          damage: 5,
          r: 10,
          color: '#2ca721',
        });
      }
    }
  },
  collisionHandler(currentGame){
    zombies = Enemies.find({'game': currentGame}).fetch();
    players = GamePlayers.find({'game': currentGame}).fetch();
    for (var i = 0; i < players.length; i++) {
      for (var j = 0; j < zombies.length; j++) {
        if(i !== j){
          if(players[i].x > zombies[j].x - 2*zombies[j].r && players[i].x < zombies[j].x + 2*zombies[j].r &&
            players[i].y > zombies[j].y - 2*zombies[j].r && players[i].y < zombies[j].y + 2*zombies[j].r){ // if circles are overlapping

              GamePlayers.update(players[i], {$inc: {hp: -zombies[j].damage}});
              console.log(players[i].hp);
            }
          }
          // else if(e[i].type === "zombie" && e[j].type ==="bullet"){
          //   //zombie takes damage
          //   e[i].hp -= e[j].damage;
          // }

          //don't worry about other collisions right now
        }
      }
    }
  });
