function genRandom(range) {
  return Math.round(Math.random()*800) + 1;
}

Meteor.methods({
  createGame(gameTitle, numPlayers = 2, privateGame = false) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    if (! gameTitle) {
      return false;
    }
    if (typeof numPlayers !== 'number' || numPlayers < 0 || numPlayers > 6) {
      return false;
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
      sAlert.error("Yo fool.  You can't do that shiz.");
      throw new Meteor.Error("not-authorized");
    }

    Games.remove(gameId);
  },
  joinPlayer(gameId){
    if (! Meteor.userId()) {
      sAlert.error("Yo fool.  You can't do that shiz.");
      throw new Meteor.Error("not-authorized");
    }
    GamePlayers.insert({
      game: gameId,
      userId: Meteor.userId(),
      screenName: Meteor.user().username,
      x: genRandom(),
      y: genRandom(),
      xdir: 0,
      ydir: 0,
      r: 10,
      color: 'black'
    });
  },
  //keydown events
  LEFTd(){
    GamePlayers.update({userId: Meteor.userId()}, {$set: {xdir: -1}})
  },
  RIGHTd(){
    GamePlayers.update({userId: Meteor.userId()}, {$set: {xdir: 1}})
  },
  UPd(){
    GamePlayers.update({userId: Meteor.userId()}, {$set: {ydir: -1}})
  },
  DOWNd(){
    GamePlayers.update({userId: Meteor.userId()}, {$set: {ydir: 1}})
  },
  //keyup events
  LEFTu(){
    GamePlayers.update({userId: Meteor.userId()}, {$set: {xdir: 0}})
  },
  RIGHTu(){
    GamePlayers.update({userId: Meteor.userId()}, {$set: {xdir: 0}})
  },
  UPu(){
    GamePlayers.update({userId: Meteor.userId()}, {$set: {ydir: 0}})
  },
  DOWNu(){
    GamePlayers.update({userId: Meteor.userId()}, {$set: {ydir: 0}})
  },
  updatePlayer(i, xpos, ypos){
    GamePlayers.update({userId: i.userId}, {$set: {x: xpos, y: ypos}});
  }
});
