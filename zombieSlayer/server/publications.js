Meteor.publish("games", function () {
  return Games.find({
    $or: [
      { private: {$ne: true} },
      { owner: this.userId }
    ]
  });
});

Meteor.publish('gameplayers', function(){
  return GamePlayers.find();
});

Meteor.publish('enemies', function(){
  return Enemies.find();
});
