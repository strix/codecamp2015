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
  joinPlayer(gameId, playerId){
    if (! Meteor.userId()) {
      sAlert.error("Yo fool.  You can't do that shiz.");
      throw new Meteor.Error("not-authorized");
    }
    let gpId = GamePlayers.insert({
      game: gameId,
      player: playerId,
      screenName: Meteor.user().username,
      x: genRandom(),
      y: genRandom(),
      xdir: 0,
      ydir: 0,
      r: 10,
      color: 'black'
    });

    return gpId;
  },
  //keydown events
  LEFTd(gpId){
    GamePlayers.update(gpId, {$inc: {x: -1}});
  },
  RIGHTd(gpId){
    GamePlayers.update(gpId, {$inc: {x: 1}})
  },
  UPd(gpId){
    GamePlayers.update(gpId, {$inc: {y: -1}})
  },
  DOWNd(gpId){
    GamePlayers.update(gpId, {$inc: {y: 1}})
  },

  // //keyup events
  // LEFTu(){
  //   let playerId = Players.find({"userId": Meteor.userId()}).fetch()[0]._id;
  //   GamePlayers.update(Session.get("currentPlayerId"), {$set: {xdir: 0}})
  // },
  // RIGHTu(){
  //   let playerId = Players.find({"userId": Meteor.userId()}).fetch()[0]._id;
  //   GamePlayers.update({player: playerId}, {$set: {xdir: 0}})
  // },
  // UPu(){
  //   let playerId = Players.find({"userId": Meteor.userId()}).fetch()[0]._id;
  //   GamePlayers.update({player: playerId}, {$set: {ydir: 0}})
  // },
  // DOWNu(){
  //   let playerId = Players.find({"userId": Meteor.userId()}).fetch()[0]._id;
  //   GamePlayers.update({player: playerId}, {$set: {ydir: 0}})
  // },

  // updatePlayer(i, xpos, ypos){
  //   GamePlayers.update({player: i.player}, {$set: {x: xpos, y: ypos}});
  // },
  addPlayer(){
    if (! Meteor.userId()) {
      sAlert.error("Yo fool.  You can't do that shiz.");
      throw new Meteor.Error("not-authorized");
    }
    console.log('ADDING PLAYER!!!');
    Players.insert({
      userId: Meteor.userId(),
      zKills: 0,
      pKills: 0,
      zDeaths: 0,
      pDeaths: 0,
      color: 'black',
      friends: []
    });
  }
});
