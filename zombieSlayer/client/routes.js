Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.route('/', function () {
  Meteor.call('wipePlayers', Session.get('playerId'));
  this.render('home');
});

Router.route('/:game', function () {
  Session.set('currentGame', this.params.game);
  this.render('newGame');
});
