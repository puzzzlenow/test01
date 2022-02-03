
document.addEventListener('keydown', function(event) {

  switch (event.keyCode) {
    case "N".charCodeAt(0):
      initialR();
    break;


    case 37: //left
        left();
    break;

    case 38: //up
        up();
    break;

    case 39: //right
        right();
    break;

    case 40: //down
        down();
    break;
  }


}, true);