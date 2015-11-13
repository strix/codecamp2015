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
    Meteor.call("deleteGame", this._id);
  }
});

Template.createGameForm.events({
  'submit .new-game'(event, template) {
    event.preventDefault();
    let gameTitle = event.target.gameTitle.value;
    let numOption = event.target.numPlayers.options;
    let numPlayers = Number(numOption[numOption.selectedIndex].value);
    let privateGame = event.target.private.checked;
    Meteor.call('createGame', gameTitle, numPlayers, privateGame);
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
  console.log('here');
  let playerExists = Players.find({'userId': Meteor.userId()}).count() > 0;
  // let player = Players.findOne({'userId': Meteor.userId()}, function(err, result){
  //   if(err){
  //     console.log(err);
  //   }
  //   if(result){
  //     console.log(result);
  //   }
  // });
  if(!playerExists){
    Meteor.call('addPlayer');
  }
  let playerId = Players.find({'userId': Meteor.userId()}).fetch()[0]._id;
  Meteor.call('joinPlayer', Session.get('currentGame'), playerId);
  Meteor.gameFunctions.startGame();
};
