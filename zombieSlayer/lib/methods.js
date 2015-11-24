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

  mouseUp(gpId, currentGame, ey, ex){
    //instatiate a bullet here
    let s = 5;
    let player = GamePlayers.findOne(gpId);
    angle = Math.atan2(ey - player.y, ex - player.x);
    Bullets.insert({
      color: "#e40b0b",
      r: 3,
      damage: 5,
      speed: s,
      x: player.x,
      y: player.y,
      vx: Math.cos(angle) * s,
      vy: Math.sin(angle) * s,
      game: currentGame,
      ownerId: gpId
    });
  },
  updatePlayer(gpId, xpos, ypos){
    GamePlayers.update(gpId, {$set: {x: xpos, y: ypos}});
  },
  updateBullet(bId, xpos, ypos){
    if(xpos < 0 || xpos > 800 || ypos < 0 || ypos > 800){
      Bullets.remove(bId);
    }
    else{
      Bullets.update(bId, {$set: {x: xpos, y: ypos}});
    }
  },
  addPlayer(){
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized", "Yo fool.  You can't do that shiz.");
    }
    let playerExists = Players.find({'userId': Meteor.userId()}).count() > 0;
    if(!playerExists){
      //console.log('ADDING PLAYER!!!');
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
      //console.log('PLAYER ALREADY HERE!!!');
      let playerId = Players.find({'userId': Meteor.userId()}).fetch()[0]._id;
      return playerId;
    }
  },
  wipePlayers(pId){
    GamePlayers.remove({'player': pId});
  },
  populateGame(currentGame){
    if(Enemies.find({'game': currentGame}).count() < 10
  ){
    //populate
    //console.log("populating");
    let pop = Math.random() * 10 + 5;
    for (let i = 0; i < pop; i++) {
      //change this to actually add zombies into the right collection
      Enemies.insert({
        x: genRandom(),
        y: genRandom(),
        game: currentGame,
        hp: 10,
        damage: 5,
        r: 10,
        color: '#2ca721',
        xdir: 0,
        ydir: 0
      });
    }
  }
},
collisionHandler(currentGame){
  zombies = Enemies.find({'game': currentGame}).fetch();
  players = GamePlayers.find({'game': currentGame}).fetch();
  bullets = Bullets.find({'game': currentGame}).fetch();

  for (let j = 0; j < zombies.length; j++) {
    for (let i = 0; i < players.length; i++) {
      if(zombies[j].hp <= 0){
        Enemies.remove(zombies[j]);
      }
      if(players[i].hp <= 0){
        GamePlayers.remove(players[i]);
      }
      if(i !== j){
        if(players[i].x > zombies[j].x - 2*zombies[j].r && players[i].x < zombies[j].x + 2*zombies[j].r &&
          players[i].y > zombies[j].y - 2*zombies[j].r && players[i].y < zombies[j].y + 2*zombies[j].r){ // if circles are overlapping

            GamePlayers.update(players[i], {$inc: {hp: -zombies[j].damage}});
            //console.log(players[i].hp);
          }
        }
      }
      for (let i = 0; i < bullets.length; i++) {
        if(bullets[i].x > zombies[j].x - 2*zombies[j].r && bullets[i].x < zombies[j].x + 2*zombies[j].r &&
          bullets[i].y > zombies[j].y - 2*zombies[j].r && bullets[i].y < zombies[j].y + 2*zombies[j].r){
            Enemies.update(zombies[j], {$inc: {hp: -bullets[i].damage}});
            Bullets.remove(bullets[i]);
          }
        }
      }
    },
    updateEnemies(currentGame){
      zombies = Enemies.find({'game': currentGame});
      zombies.forEach(function(z) {
        let xd = z.xdir;
        let yd = z.ydir;
        let xp = z.x;
        let yp = z.y;
        // do this better when less tired
        //TODO
        if(xp > 799){
          xp = 1;
        }
        if(xp < 0){
          xp = 799;
        }
        if(yp > 799){
          yp = 1;
        }
        if(yp < 0){
          yp = 799;
        }

        Enemies.update(z._id, {$set: {x: xp, y: yp}});
        Enemies.update(z._id, {$inc: {x: xd, y: yd}});
      });
    },
    shamble(currentGame){
      zombies = Enemies.find({'game': currentGame});
      zombies.forEach(function(z) {
        let move = Math.random() * 30;
        let a = 0;
        let b = 0;
        if(move < 10){
          a = Math.random() * 3;
          switch(a){
            case 1:
            a = 0;
            b = 1;
            break;
            case 2:
            a = 1;
            b = 1;
            break;
            case 3:
            a = 1;
            b = 0;
            break;
          }
        }
        else if(move >= 10 && move < 25){

          b = Math.random() * 3;
          switch(b){
            case 1:
            a = 0;
            b = -1;
            break;
            case 2:
            a = -1;
            b = -1;
            break;
            case 3:
            a = -1;
            b = 0;
            break;
          }
        }
        else{
          //drool
        }


        Enemies.update(z._id, {$set: {xdir: a, ydir: b}});
      });
    }

  });
