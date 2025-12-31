
// HELPER: Get Julian Date
if (typeof Date.prototype.getJulian !== 'function') {
    Date.prototype.getJulian = function () {
        return Math.floor((this / 86400000) - (this.getTimezoneOffset() / 1440) + 2440587.5);
    };
}

// Global State - Single Source of Truth
if (typeof window.currentlevel === 'undefined') window.currentlevel = "";
if (typeof window.todaylevel === 'undefined') {
    var today = new Date();
    var julian = today.getJulian();
    window.todaylevel = julian % (levels.length - 1);
}

function initialF() {

  //clean
  for (var x = 0; x <= 7; x++) {
    for (var y = 0; y <= 7; y++) {
      itemsF[x][y] = ".";
      itemsB[x][y] = ".";
    }
  }



  //importstr = importstr.split(' ').join('');

  /*
    importstr=  "..O.***."+
                "OOO...*."+
                ".OOO...."+
                ".O......"+
                ".*......"+
                ".***...."+
                "***....*"+
                "..*..***"
  */

  document.getElementById("areacurrentlevel").innerHTML = currentlevel;

  for (var x = 0; x <= 7; x++) {
    for (var y = 0; y <= 7; y++) {
      if (importstr.charAt(x * 8 + y).toUpperCase() == "O") {
        itemsB[x][y] = importstr.charAt(x * 8 + y);
      } else {
        itemsF[x][y] = importstr.charAt(x * 8 + y);
      }

    }
  }


}


function initialH() {
  document.getElementById("div-may-hide-01").style.visibility = preset.div1vis;
  document.getElementById("div-may-hide-02").style.visibility = preset.div2vis;
  document.getElementById("div-may-hide-03").style.visibility = preset.div3vis;
}



function initial() {
  document.getElementById("bx00").style.cursor = "pointer";
  document.body.style.backgroundColor = "grey";
  //document.getElementById("btnBuild").innerHTML = "(B)uild";
  //document.getElementById("btnNewGame").disabled = false;




  //clean
  for (var x = 0; x <= 7; x++) {
    for (var y = 0; y <= 7; y++) {
      items[x][y] = ".";
    }
  }

  //  var items = matrix( 8, 8, ".");

  //import walls and targets
  for (var x = 0; x <= 7; x++) {
    for (var y = 0; y <= 7; y++) {
      if (itemsF[x][y] !== ".") {
        items[x][y] = itemsF[x][y];
      }
      if (itemsB[x][y] == "O") {
        items[x][y] = itemsB[x][y];
      }
    }
  }


  var index;
  var text = "";

  //reading items matrix
  for (index = 0; index < items.length; index++) {
    text += items[index];
    text += "<br>"
  }
  text = text.replace(/,/g, " ");
  document.getElementById("area_items").innerHTML = text;
  document.getElementById("area_items_single_row").value = text.split('<br>').join('');

  //reading itemsF matrix
  text = "";
  for (index = 0; index < itemsF.length; index++) {
    text += itemsF[index];
    text += "<br>"
  }
  text = text.replace(/,/g, " ");
  document.getElementById("area_itemsF").innerHTML = text;


  //reading itemsB matrix
  text = "";
  for (index = 0; index < itemsB.length; index++) {
    text += itemsB[index];
    text += "<br>"
  }
  text = text.replace(/,/g, " ");
  document.getElementById("area_itemsB").innerHTML = text;


  //reading itemsB matrix
  text = "";
  for (index = 0; index < levels.length; index++) {
    text += levels[index][0];
    text += "<br>"
  }
  text = text.replace(/,/g, " ");
  document.getElementById("area_itemsA").innerHTML = text;


  document.getElementById("areatodaylevel").innerHTML = todaylevel;

  // 1. Load best record immediately to have context for the rest of initial()
  retrieveCookies();

  // Sync currentlevel display
  document.getElementById("areacurrentlevel").innerHTML = window.currentlevel;



  //over the target, light on!
  for (var x = 0; x <= 7; x++) {
    for (var y = 0; y <= 7; y++) {
      //items[x][y] = items[x][y].toUpperCase();
      //alert(x + "," + y + "__" + items[x][y] + "_" + itemsF[x][y] );
      //document.getElementById("msg").innerHTML = (x + "," + y + "__" + items[x][y] + "_" + itemsF[x][y] );

      if (itemsF[x][y] == "x" && items[x][y].toUpperCase() == "O") {
        items[x][y] = "o";
      }
      //CHANGE COLOR
      //document.getElementById("bx" +x +y).style.background = getColour(x,y);
      //document.getElementById("bx" +x +y).style.border-bottom-color = getBorder(x,y);

      var col1 = getColour(x, y, 1); //'rgba(0,0,0,0.8)';
      var col2 = getColour(x, y, 2); //'rgba(0,0,0,0.8)';
      // var css = '-webkit-gradient(linear,20% 10%, 80% 90%, color-stop(0.30, ' + col1 + ' ),color-stop(0.50, ' + col2 + '))';
      var css = 'radial-gradient(circle at 30% 1%, ' + col1 + ', ' + col2 + ')';
      $('#bx' + x + '' + y).css('background-image', css);

    }
  }


  movecount();
  if (isWin()) {
    for (var x = 0; x <= 7; x++) {
      for (var y = 0; y <= 7; y++) {
        if (itemsF[x][y] == "x") {
          items[x][y] = "xx";

          //CHANGE COLOR
          //document.getElementById("bx" +x +y).style.background = getColour(x,y);
          //document.getElementById("bx" +x +y).style.border-bottom-color = getBorder(x,y);

          var col1 = getColour(x, y, 1); //'rgba(0,0,0,0.8)';
          var col2 = getColour(x, y, 2); //'rgba(0,0,0,0.8)';
          // var css = '-webkit-gradient(linear,20% 10%, 80% 90%, color-stop(0.30, ' + col1 + ' ),color-stop(0.50, ' + col2 + '))';
          var css = 'radial-gradient(circle at 20% 10%, ' + col1 + ', ' + col2 + ')';
          $('#bx' + x + '' + y).css('background-image', css);

        }
      }
    }
  }

  if (freeze == 1) {
    document.getElementById("areamsg").innerHTML = "WIN!!!!!!!!!!!!!!!!!!<br>";

    var currentMoves = parseInt(document.getElementById("areaMoves").innerHTML) || 0;
    var bestValue = parseInt(document.getElementById("best").value) || 0;

    // Save if it's a win with moves > 0 and (no previous record or moves < previous record)
    // We update even if equal to ensure the record is fresh and synced
    if (currentMoves > 0 && (bestValue === 0 || currentMoves < bestValue)) {
      document.getElementById("best").value = currentMoves;
      document.getElementById("areaBest").innerHTML = currentMoves;
      if (bestValue === 0 || currentMoves < bestValue) {
          document.getElementById("areamsg").innerHTML += "NEW RECORD !!!!!!!!!!!!!!!!!!<br>";
      }
      updateRecord();
    }
  }


  //populate the dropdown list
  if (document.getElementById("selectLevel").options.length <= 1) {
    var select = document.getElementById("selectLevel");

    for (var i = 0; i < levels.length; i++) {
      var value = levels[i][0];
      var txt = i;
      //var txt = i + " - " + value;
      var elem = document.createElement("option");

      elem.textContent = txt;
      elem.value = value;
      select.appendChild(elem);
    }
  }


}



function matrix(rows, cols, defaultValue) {

  var arr = [];

  // Creates all lines:
  for (var i = 0; i < rows; i++) {

    // Creates an empty line
    arr.push([]);

    // Adds cols to the empty line:
    arr[i].push(new Array(cols));

    for (var j = 0; j < cols; j++) {
      // Initializes:
      arr[i][j] = defaultValue;
    }
  }

  return arr;
}






function isWin() {

  //var x;
  //var y;
  var cnto = 0;
  var cntx = 0;
  //var ttl=0;


  for (var x = 0; x <= 7; x++) {
    for (var y = 0; y <= 7; y++) {
      if (items[x][y] == "O") {
        return false;
      } else if (items[x][y] == "o") {
        cnto++;
      } if (itemsF[x][y] == "x") {
        cntx++;
      }
    }
  }
  if ((cnto > 0) && (cnto == cntx)) {
    //alert("win");
    freeze = 1;

    return true;
  }
  return false;


}



function movecount() {
  document.getElementById("areaSteps").innerHTML = document.getElementById("areaSteps").innerHTML + steps;
  document.getElementById("areaMoves").innerHTML = document.getElementById("areaSteps").innerHTML.length;
  steps = "";
}



function reset() {

  freeze = 0;
  //pixel = 25;
  editmode = 0;
  steps = "";


  document.getElementById("areaSteps").innerHTML = "";
  movecount();

  document.getElementById("areamsg").innerHTML = "";

  initialF();


}




/***
** Translate the co-ordinate into colour in RGB format
***/

function getColour(x, y, col) {
  var type = items[x][y];
  //alert(type);

  if (type == ".") {
    //space -------------
    return (col == 1) ? rgb_space : rgb_space2;
  } else if (type == "O") {
    //off -------------
    return (col == 1) ? rgb_off : rgb_off2;
  } else if (type == "o") {
    //on -------------
    return (col == 1) ? rgb_on : rgb_on2;
  } else if (type == "x") {
    //dest -------------
    return (col == 1) ? rgb_dest : rgb_dest2;
  } else if (type == "*") {
    //wall -------------
    return (col == 1) ? rgb_wall : rgb_wall2;
  } else {
    //done -------------
    return (col == 1) ? rgb_done : rgb_done2;
  }
}


//TODO
/***
**
** Make the cell looks glassy
***/
function getBorder(x, y) {
  var type = items[x][y];
  //alert(type);

  if (type == "x") {
    //dest -------------
    return "#000000";
  } else {
    //not dest -------------
    return "#000000";
  }
}



//edit(
function clicked(id_in) {
  if (editmode == 1) {

    var x = id_in.charAt(5);
    var y = id_in.charAt(6);
    //alert(id_in.charAt(5) + "," + id_in.charAt(6) + "__" + items[x][y]);

    //alert(items[x][y]);


    if (items[x][y] == ".") {
      itemsF[x][y] = "*";
      itemsB[x][y] = ".";

    } else if (items[x][y] == "*") {
      itemsF[x][y] = "x";
      itemsB[x][y] = ".";
    } else if (items[x][y] == "x") {
      itemsF[x][y] = ".";
      itemsB[x][y] = "O";
    } else if (items[x][y].toUpperCase() == "O") {
      itemsF[x][y] = ".";
      itemsB[x][y] = ".";
    }

    initial();
  }
}

function clearAll() {

  for (var x = 0; x <= 7; x++) {
    for (var y = 0; y <= 7; y++) {
      itemsB[x][y] = ".";
      itemsF[x][y] = ".";
      items[x][y] = ".";
    }
  }

  initial();

}

function initAll() {
  freeze = 0;
  reset();
  initialH();
  initialF();
  // Ensure we identify the current level before running initial() logic
  const selectLevel = document.getElementById("selectLevel");
  if (selectLevel && selectLevel.selectedIndex > 0) {
      window.currentlevel = selectLevel.options[selectLevel.selectedIndex].text.toString().trim();
  } else if (!window.currentlevel || window.currentlevel === "Choose a Level") {
      window.currentlevel = todaylevel.toString();
  }
  
  initial();
  document.getElementById("btnReset").focus();
}

function onLevelChange(sel) {
  if (typeof clearSolverDisplay === 'function') clearSolverDisplay();
  selectChanged(sel);
  initAll();
}


function selectChanged(sel) {
  importstr = document.getElementById("selectLevel").value;
  currentlevel = sel.options[sel.selectedIndex].text.toString().trim();
  console.log("Switching to Level: " + currentlevel);
}


//COOKIES

function retrieveCookies() {
  // Use the dropdown selection as the first source of truth
  const selectLevel = document.getElementById("selectLevel");
  let levelKey = "";
  
  if (selectLevel && selectLevel.selectedIndex > 0) {
      levelKey = selectLevel.options[selectLevel.selectedIndex].text.toString().trim();
  } 
  
  // Fallback to global state
  if (levelKey === "" || levelKey === "Choose a Level") {
      levelKey = (window.currentlevel || window.todaylevel || "0").toString().trim();
  }

  // Update global state to match the found key
  if (levelKey !== "Choose a Level") {
      window.currentlevel = levelKey;
  }

  const areaBest = document.getElementById("areaBest");
  const bestInput = document.getElementById("best");

  if (levelKey === "" || levelKey === "Choose a Level") {
    if (areaBest) areaBest.innerHTML = "";
    if (bestInput) bestInput.value = "0";
    return;
  }

  const record = getCookies(levelKey);
  if (record !== "") {
    if (areaBest) areaBest.innerHTML = record;
    if (bestInput) bestInput.value = record;
    console.log("Persistence: Restored record for [" + levelKey + "]: " + record);
  } else {
    // If no record found, ensure display is blank for THIS level specifically
    if (areaBest) areaBest.innerHTML = "";
    if (bestInput) bestInput.value = "0";
    console.log("Persistence: No record found for [" + levelKey + "]");
  }
}

function retrieveCookiesDebug() {
  let record1 = getCookies(currentlevel);
  if (record1 != "") {
    document.getElementById("areaBest").innerHTML = record1;
    document.getElementById("best").value = record1;
    alert("level " + currentlevel + " : '" + record1 + "'");
    alert("document.cookie : '" + document.cookie + "'");
  } else {
    alert("There is no record in your cookies.")
    document.getElementById("areaBest").innerHTML = "";
    document.getElementById("best").value = "";
  }
}


function setCookies(level, newbestRec) {
  // Use String() to ensure "0" is not treated as falsy
  const key = String(level !== null && level !== undefined ? level : "").trim();
  if (key === "" || key === "Choose a Level") return;
  try {
    localStorage.setItem("game_best_" + key, newbestRec.toString());
    console.log("Persistence Saved: Level [" + key + "] = " + newbestRec);
  } catch (e) {
    console.error("Persistence Save Error:", e);
  }
}

function updateRecord() {
  setCookies(currentlevel, document.getElementById("best").value);
}

function getCookies(key) {
  // Use String() to ensure "0" is not treated as falsy
  const k = String(key !== null && key !== undefined ? key : "").trim();
  if (k === "" || k === "Choose a Level") return "";
  try {
    const val = localStorage.getItem("game_best_" + k) || "";
    console.log("Persistence Read: Level [" + k + "] = " + val);
    return val;
  } catch (e) {
    console.error("Persistence Read Error:", e);
    return "";
  }
}


function getResolution() {
  //w.value = $(window).width();
  //h.value = $(window).height();
  if (screen.width < screen.height) {
    return screen.width / 13;
  }
  else {
    return screen.height / 10;
  }
}



























