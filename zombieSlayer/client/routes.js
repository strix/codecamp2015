Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.route('/', function () {
  Meteor.call('wipePlayers', Session.get('playerId'));
  this.render('home');
});

Router.route('/:game', function () {
  if (! Meteor.userId()) {
    sAlert.error('You need to be logged in to join a game.');
    return false;
  }
  Session.set('currentGame', this.params.game);
  this.render('newGame');
});
