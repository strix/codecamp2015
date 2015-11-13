Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.route('/', function () {
  this.render('home');
});

Router.route('/:game', function () {
  Session.set('currentGame', this.params.game);
  this.render('newGame');
});
