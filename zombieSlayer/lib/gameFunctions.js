
Meteor.gameFunctions = {
    startGame() {
      console.log("startgame");
  },
  Controls(playerId, canvas) {
      window.addEventListener("keydown", function(e) {
       switch(e.keyCode) {
         case 65:
           Meteor.call('LEFTd', Session.get("currentPlayerId")); break;
         case 87:
           Meteor.call('UPd', Session.get("currentPlayerId")); break;
         case 68:
           Meteor.call('RIGHTd', Session.get("currentPlayerId")); break;
         case 83:
           Meteor.call('DOWNd', Session.get("currentPlayerId")); break;
       }
      });
      window.addEventListener("keyup", function(e) {
       switch(e.keyCode) {
         case 65:
           Meteor.call('LEFTu', Session.get("currentPlayerId")); break;
         case 87:
           Meteor.call('UPu', Session.get("currentPlayerId")); break;
         case 68:
           Meteor.call('RIGHTu', Session.get("currentPlayerId")); break;
         case 83:
           Meteor.call('DOWNu', Session.get("currentPlayerId")); break;
       }
      });
      //this.canvas.addEventListener('mousedown', this.mouseDownEvent.bind(this));
      canvas.addEventListener('mouseup', function(e){
        let rect = canvas.getBoundingClientRect();
        Meteor.call("mouseUp", Session.get("currentPlayerId"), Session.get("currentGame"), e.clientY - rect.top, e.clientX - rect.left);
      });
      //this.canvas.addEventListener('contextmenu', this.contextMenuEvent.bind(this));
    }
};
