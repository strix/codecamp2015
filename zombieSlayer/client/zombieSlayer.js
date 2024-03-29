// Template.registerHelper("usernameFromId", function (userId) {
//     let user = Meteor.users.findOne({_id: userId});
//     if (typeof user === "undefined") {
//         return "Anonymous";
//     }
//     if (typeof user.services.github !== "undefined") {
//         return user.services.github.username;
//     }
//     return user.username;
// });
GamePlayers = new Mongo.Collection("gameplayers");
Enemies = new Mongo.Collection("enemies");
Bullets = new Mongo.Collection("bullets");


isKnownError = (error) => {
  let errorName = error && error.error;
  let listOfKnownErrors = [
    'not-authorized',
    'idk-error',
    'user-not-logged-in',
    'missing-title'
  ];

  return _.contains(listOfKnownErrors, errorName);
};

defaultErrorHandler = (error) => {
  if (isKnownError(error)) {
    sAlert.error(error);
  } else if (error) {
    sAlert.error("An unknown error occurred while saving your project.");
  }
};

Tracker.autorun(function(){
  if(Meteor.userId()){
    Meteor.call('addPlayer', (error, result) => {
      Session.set('playerId', result);
    });
  }
});

Template.registerHelper('gameCount', () => {
  return Games.find().count();
});

Template.gamesList.helpers({
  games() {
    return Games.find({}, {sort: {createdAt: -1}});
  }
});

Template.game.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
  isPrivate() { // necessary??
    return this.private === true;
  }
});

Template.game.events({
  'click .delete'(event) {
    event.preventDefault();
    event.stopPropagation();
    Meteor.call("deleteGame", this._id, (error, result) => {
      defaultErrorHandler(error);
    });
  }
});

Template.createGameForm.events({
  'submit .new-game'(event, template) {
    event.preventDefault();
    let gameTitle = event.target.gameTitle.value;
    let numOption = event.target.numPlayers.options;
    let numPlayers = Number(numOption[numOption.selectedIndex].value);
    let privateGame = event.target.private.checked;
    Meteor.call('createGame', gameTitle, numPlayers, privateGame, (error, result) => {
      if (error.error === 'missing-title') {
        sAlert.warning(error.reason);
      } else {
        defaultErrorHandler(error);
      }
    });
    // resets the form values to their defaults (we may not want this...)
    event.target.gameTitle.value = '';
    event.target.numPlayers.selectedIndex = 0;
    event.target.private.checked = false;
  }
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

Template.newGame.rendered = () => {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext('2d');

  Meteor.call('joinPlayer', Session.get('currentGame'), Session.get('playerId'), (error, result) => {
    defaultErrorHandler(error);
    Session.set("currentPlayerId", result);
    let gp = GamePlayers.findOne(Session.get('currentPlayerId')).screenName;
    sAlert.success(`${gp} has joined the game.`);
  });
  Meteor.gameFunctions.startGame();
  Meteor.gameFunctions.Controls(Session.get('playerId'), canvas);

  Meteor.call('populateGame', Session.get('currentGame'));


  Meteor.setInterval(function() {
      let players = GamePlayers.find({"game": Session.get('currentGame')}).fetch();
      if (players.length > 0){


      // Keep the position within the canvas
      let currentPlayer = GamePlayers.findOne(Session.get("currentPlayerId"));
      let speed = 3;
      let xpos = (currentPlayer.x < 0) ? 800 : (currentPlayer.x + speed*currentPlayer.xdir)%800;
      let ypos = currentPlayer.y < 0 ? 800 : (currentPlayer.y + speed*currentPlayer.ydir)%800;

      Meteor.call('updatePlayer', Session.get('currentPlayerId'), xpos, ypos, (error, result) => {
        defaultErrorHandler(error);
      });

      ctx.clearRect(0,0,800,800);

      players.forEach(function(i) {
        ctx.beginPath();
        ctx.fillStyle = i.color;
        ctx.arc(i.x, i.y, i.r, 0, Math.PI*2, false);
        ctx.fill();
        ctx.fillText(i.screenName, i.x-i.r, i.y-15);
      });

      let enemies = Enemies.find({"game": Session.get('currentGame')}).fetch();
      enemies.forEach(function(j) {
        ctx.beginPath();
        ctx.fillStyle = j.color;
        ctx.arc(j.x, j.y, j.r, 0, Math.PI*2, false);
        ctx.fill();
      });

      let bullets = Bullets.find({"game": Session.get('currentGame')}).fetch();
      bullets.forEach(function(k) {
        ctx.beginPath();
        ctx.fillStyle = k.color;
        ctx.arc(k.x, k.y, k.r, 0, Math.PI*2, false);
        ctx.fill();
        if(k.ownerId === Session.get('currentPlayerId')){
          let bx = k.x + k.vx;
          let by = k.y + k.vy;
          Meteor.call('updateBullet',k._id, bx, by);
        }
      });

    }
  }, 100/6);

  Meteor.setInterval(function(){
    Meteor.call('collisionHandler', Session.get('currentGame'));
  }, 150);

  Meteor.setInterval(function(){
    Meteor.call('updateEnemies', Session.get('currentGame'));
  }, 200);

  Meteor.setInterval(function(){
    Meteor.call('shamble', Session.get('currentGame'));
  }, 2000);
};
