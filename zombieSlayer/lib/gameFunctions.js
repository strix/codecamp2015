
Meteor.gameFunctions = {
    startGame() {
      console.log("startgame");
  },
  Controls(playerId) {
      window.addEventListener("keydown", function(e) {
       switch(e.keyCode) {
         case 37:
           Meteor.call('LEFTd', Session.get("currentPlayerId")); break;
         case 38:
           Meteor.call('UPd', Session.get("currentPlayerId")); break;
         case 39:
           Meteor.call('RIGHTd', Session.get("currentPlayerId")); break;
         case 40:
           Meteor.call('DOWNd', Session.get("currentPlayerId")); break;
       }
      });
      // window.addEventListener("keyup", function(e) {
      //  switch(e.keyCode) {
      //    case 37:
      //      Meteor.call('LEFTu'); break;
      //    case 38:
      //      Meteor.call('UPu'); break;
      //    case 39:
      //      Meteor.call('RIGHTu'); break;
      //    case 40:
      //      Meteor.call('DOWNu'); break;
      //  }
      // });
      //this.canvas.addEventListener('mousedown', this.mouseDownEvent.bind(this));
      //this.canvas.addEventListener('mouseup', this.mouseUpEvent.bind(this));
      //window.addEventListener('mousemove', this.mouseMoveEvent.bind(this));
      //this.canvas.addEventListener('contextmenu', this.contextMenuEvent.bind(this));
  }
}
