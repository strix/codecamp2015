
Meteor.gameFunctions = {
    startGame() {
      console.log("startgame");
      canvas = document.getElementById("canvas");
      ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,800,800);
      GamePlayers.find({'game': Session.get('currentGame')}).fetch().forEach(function(i){
        ctx.beginPath();
        ctx.fillStyle = i.color;
        ctx.arc(i.x, i.y, i.r, 0, Math.PI*2, false);
        ctx.fill();
        ctx.fillText(i.screenName, i.x-i.r, i.y-15);
    });
  }
}
