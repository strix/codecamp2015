var collisionHandler = function(e){
  for (var i = 0; i < e.length; i++) {
    for (var j = 0; j < e.length; j++) {
      if(i !== j){
        if(e[i].x > e[j].x - 2*e[j].r && e[i].x < e[j].x + 2*e[j].r &&
        e[i].y > e[j].y - 2*e[j].r && e[i].y < e[j].y + 2*e[j].r) // if circles are overlapping
          if(e[i].type === "zombie" && e[j].type ==="player"){
            //player takes damage
            e[i].hp -= e[j].damage;
          }

          else if(e[i].type === "zombie" && e[j].type ==="bullet"){
            //zombie takes damage
            e[i].hp -= e[j].damage;
          }

          //don't worry about other collisions right now
      }
    }
  }

}
