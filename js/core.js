
function initialF(){

  //clean
  for(var x=0; x <=7; x++){
    for(var y=0; y <=7; y++){
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

  for(var x=0; x <=7; x++){
    for(var y=0; y <=7; y++){
      if ( importstr.charAt(x *8 + y ).toUpperCase() == "O" ) {
        itemsB[x][y] = importstr.charAt(x *8 + y );
      } else {
        itemsF[x][y] = importstr.charAt(x *8 + y );
      }

    }
  }


}


function initialH(){
  document.getElementById("div-may-hide-01").style.visibility = preset.div1vis;
  document.getElementById("div-may-hide-02").style.visibility = preset.div2vis;
  document.getElementById("div-may-hide-03").style.visibility = preset.div3vis;
}



function initial(){
  document.getElementById("bx00").style.cursor = "pointer";
  document.body.style.backgroundColor = "grey";
  //document.getElementById("btnBuild").innerHTML = "(B)uild";
  //document.getElementById("btnNewGame").disabled = false;
 



  //clean
  for(var x=0; x <=7; x++){
    for(var y=0; y <=7; y++){
      items[x][y]=".";
    }
  }

//  var items = matrix( 8, 8, ".");

  //import walls and targets
  for(var x=0; x <=7; x++){
    for(var y=0; y <=7; y++){
      if (itemsF[x][y] !== "."){
        items[x][y]=itemsF[x][y];
      }
      if (itemsB[x][y] == "O"){
        items[x][y]=itemsB[x][y];
      }
    }
  }


  var index;
  var text="";

  //reading items matrix
  for (index = 0; index < items.length; index++) {
      text += items[index];
      text += "<br>"
  }
  text = text.replace(/,/g , " ");
  document.getElementById("area_items").innerHTML = text;
  document.getElementById("area_items_single_row").value = text.split('<br>').join('');  
  
  //reading itemsF matrix
  text="";
  for (index = 0; index < itemsF.length; index++) {
      text += itemsF[index];
      text += "<br>"
  }
  text = text.replace(/,/g , " ");
  document.getElementById("area_itemsF").innerHTML = text;


  //reading itemsB matrix
  text="";
  for (index = 0; index < itemsB.length; index++) {
      text += itemsB[index];
      text += "<br>"
  }
  text = text.replace(/,/g , " ");
  document.getElementById("area_itemsB").innerHTML = text;


  //reading itemsB matrix
  text="";
  for (index = 0; index < levels.length; index++) {
      text += levels[index][0];
      text += "<br>"
  }
  text = text.replace(/,/g , " ");
  document.getElementById("area_itemsA").innerHTML = text;
  
  
  document.getElementById("areatodaylevel").innerHTML = todaylevel;
  
  if ( currentlevel == "" ) {
	  document.getElementById("areacurrentlevel").innerHTML = todaylevel;
  }



  //over the target, light on!
  for(var x=0; x <=7; x++){
    for(var y=0; y <=7; y++){
      //items[x][y] = items[x][y].toUpperCase();
      //alert(x + "," + y + "__" + items[x][y] + "_" + itemsF[x][y] );
      //document.getElementById("msg").innerHTML = (x + "," + y + "__" + items[x][y] + "_" + itemsF[x][y] );

      if (itemsF[x][y] == "x"  && items[x][y].toUpperCase() == "O") {
        items[x][y]= "o";
      }
      //CHANGE COLOR
	  //document.getElementById("bx" +x +y).style.background = getColour(x,y);
	  //document.getElementById("bx" +x +y).style.border-bottom-color = getBorder(x,y);
	  
      var col1 = getColour(x,y,1); //'rgba(0,0,0,0.8)';
      var col2 = getColour(x,y,2); //'rgba(0,0,0,0.8)';
      var css = '-webkit-gradient(linear,20% 10%, 80% 90%, color-stop(0.30, '+ col1 +' ),color-stop(0.50, ' + col2 + '))';
      $('#bx'+x+''+y).css('background-image', css);
	  
    }
  }

  
  movecount();
  if (isWin() ) {
    for(var x=0; x <=7; x++){
      for(var y=0; y <=7; y++){
        if (itemsF[x][y] == "x") {
          items[x][y] = "xx";
		  
          //CHANGE COLOR
          //document.getElementById("bx" +x +y).style.background = getColour(x,y);
		  //document.getElementById("bx" +x +y).style.border-bottom-color = getBorder(x,y);
		  
          var col1 = getColour(x,y,1); //'rgba(0,0,0,0.8)';
          var col2 = getColour(x,y,2); //'rgba(0,0,0,0.8)';
          var css = '-webkit-gradient(linear,20% 10%, 80% 90%, color-stop(0.30, '+ col1 +' ),color-stop(0.50, ' + col2 + '))';
          $('#bx'+x+''+y).css('background-image', css);
		  
        }
      }
    }
  }

  if (freeze == 1) {
    document.getElementById("areamsg").innerHTML = "WIN!!!!!!!!!!!!!!!!!!<br>";
	
	if (  document.getElementById("best").value == 0 || document.getElementById("areaMoves").innerHTML < document.getElementById("best").value  ) {
		document.getElementById("best").value = document.getElementById("areaMoves").innerHTML;
		document.getElementById("areaBest").innerHTML = document.getElementById("areaMoves").innerHTML;
		//document.getElementById("areaBest").innerHTML = document.getElementById("areaMoves").innerHTML + " - " + document.getElementById("areaSteps").innerHTML;
		document.getElementById("areamsg").innerHTML = document.getElementById("areamsg").innerHTML + "NEW RECORD !!!!!!!!!!!!!!!!!!<br>";
	}
	
	updateRecord();
    
  }
  
  
  //populate the dropdown list
  if ( document.getElementById("selectLevel").options.length <= 1 ) {
    var select = document.getElementById("selectLevel");

    for(var i = 0; i < levels.length; i++) {
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



function matrix( rows, cols, defaultValue){

  var arr = [];

  // Creates all lines:
  for(var i=0; i < rows; i++){

      // Creates an empty line
      arr.push([]);

      // Adds cols to the empty line:
      arr[i].push( new Array(cols));

      for(var j=0; j < cols; j++){
        // Initializes:
        arr[i][j] = defaultValue;
      }
  }

return arr;
}






function isWin() {

  //var x;
  //var y;
  var cnto=0;
  var cntx=0;
  //var ttl=0;


  for(var x=0; x <=7; x++){
    for(var y=0; y <=7; y++){
      if (items[x][y] == "O"){
        return false;
      } else if (items[x][y] == "o"){
        cnto++;
      } if (itemsF[x][y] == "x"){
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



function movecount(){
  document.getElementById("areaSteps").innerHTML =   document.getElementById("areaSteps").innerHTML + steps;
  document.getElementById("areaMoves").innerHTML =   document.getElementById("areaSteps").innerHTML.length;
  steps = "";
}



function reset(){

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

function getColour(x,y,col) {
  var type = items[x][y];
  //alert(type);
  
  if (type == ".") {
//space -------------
    return (col == 1) ? rgb_space : rgb_space2;
  }else if (type == "O") {
//off -------------
    return (col == 1) ? rgb_off : rgb_off2;
  }else if (type == "o") {
//on -------------
    return (col == 1) ? rgb_on : rgb_on2;
  }else if (type == "x") {
//dest -------------
    return (col == 1) ? rgb_dest : rgb_dest2;
  }else if (type == "*") {
//wall -------------
    return (col == 1) ? rgb_wall : rgb_wall2;
  }else {
//done -------------
    return (col == 1) ? rgb_done : rgb_done2;
  }
}


//TODO
/***
**
** Make the cell looks glassy
***/
function getBorder(x,y) {
  var type = items[x][y];
  //alert(type);
  
  if (type == "x") {
//dest -------------
    return "#000000";
  }else {
//not dest -------------
    return "#000000";
  }
}



//edit(
function clicked(id_in){
  if (editmode == 1){

    var x = id_in.charAt(5);
    var y = id_in.charAt(6);
    //alert(id_in.charAt(5) + "," + id_in.charAt(6) + "__" + items[x][y]);

    //alert(items[x][y]);


    if (items[x][y] == ".") {
      itemsF[x][y] = "*";
      itemsB[x][y] = ".";

    }else if (items[x][y] == "*") {
      itemsF[x][y] = "x";
      itemsB[x][y] = ".";
    }else if (items[x][y] == "x") {
      itemsF[x][y] = ".";
      itemsB[x][y] = "O";
    }else if (items[x][y].toUpperCase() == "O") {
      itemsF[x][y] = ".";
      itemsB[x][y] = ".";
    }

    initial();
  }
}

function clearAll(){

  for(var x=0; x <=7; x++){
    for(var y=0; y <=7; y++){
      itemsB[x][y]=".";
      itemsF[x][y]=".";
      items[x][y]=".";
    }
  }

  initial();

}

function initAll(){
	
	//dynamic button width height
	/*
	document.querySelectorAll(".button").forEach(function(element) {
		element.style.width = getResolution();
		element.style.height = getResolution();
	});
	*/
	initialH();initialF();initial();reset();initial();
	//setCookies(88,888);
	document.getElementById("btnReset").focus();
}


function selectChanged(sel) {
  //alert(document.getElementById("selectLevel").value);
  importstr=document.getElementById("selectLevel").value;  
  currentlevel = sel.options[sel.selectedIndex].text;
  
  //try to get best record of this level from cookies
  retrieveCookies();
}


//COOKIES

function retrieveCookies() {
  let record = getCookies(currentlevel);
  if (record != "") {
    //alert("level " +currentlevel+ " : " + record);
	document.getElementById("areaBest").innerHTML = record;
	document.getElementById("best").value = record;
  } else {
    //alert("There is no record in your cookies.")
	document.getElementById("areaBest").innerHTML = "";
	document.getElementById("best").value = "";
  }
}

function retrieveCookiesDebug() {
  let record1 = getCookies(currentlevel);
  if (record1 != "") {
	document.getElementById("areaBest").innerHTML = record1;
	document.getElementById("best").value = record1;
	alert("level " +currentlevel+ " : '" + record1 + "'");
	alert("document.cookie : '" +document.cookie + "'");
  } else {
    alert("There is no record in your cookies.")
	document.getElementById("areaBest").innerHTML = "";
	document.getElementById("best").value = "";
  }
}


function updateRecord() {
	setCookies(currentlevel,document.getElementById("best").value);
	//alert("writing.." + currentlevel +"="+document.getElementById("best").value)
}

function setCookies(level,newbestRec) {
  //write cookie with level best record and expires in y2k38
  document.cookie = level + "=" + newbestRec + ";" + "expires="+ new Date(2147483647*1000).toUTCString()+"; path=/";
}

function getCookies(key) {
  let myCookie = key + "=";
  
  let eachCookieName = document.cookie.split(';');
  for(let i = 0; i < eachCookieName.length; i++) {
    let c = eachCookieName[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(myCookie) == 0) {
      return c.substring(myCookie.length, c.length);
    }
  }
  return "";
}


function getResolution(){
    //w.value = $(window).width();
    //h.value = $(window).height();
	if ( screen.width < screen.height ) {
		return screen.width / 13;
	}
	else {
		return screen.height  / 10;
	}
}



























