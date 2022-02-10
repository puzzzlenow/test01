
function up(){

  if (freeze == 0){
      for (var bx=0; bx <=7; bx++){
        for (var by=0; by <=7; by++){
          if (items[bx][by].toUpperCase() == "O") {
            //alert(bx +"," +by + "__" + itemsB[bx][by]);
            if (  (bx - 1 >= document.getElementById("min").value ) &&
                  valid(  (bx - 1 ), (by), "U"  )
               )
            {
              itemsB[bx][by] = ".";
              itemsB[bx-1][by] = "O";
            }
            
          }
        }
      }
  }

  initial();

}



function down(){

  if (freeze == 0){
      for (var bx=7; bx >=0; bx--){
        for (var by=0; by <=7; by++){
          if (items[bx][by].toUpperCase() == "O") {
            //alert(bx +"," +by + "__" + itemsB[bx][by]);
            if (  (bx + 1 <= document.getElementById("max").value ) &&
                  valid(  (bx + 1 ), (by), "D"  )
               )
            {
              itemsB[bx][by] = ".";
              itemsB[bx +1][by] = "O";
            }
            
          }
        }
      }
  }

  initial();

}



function left(){

  if (freeze == 0){
      for (var y=0; y <=7; y++){
        for (var x=0; x <=7; x++){
          if (items[x][y].toUpperCase() == "O") {
            //alert(bx +"," +by + "__" + itemsB[bx][by]);
            if (  (y - 1 >= document.getElementById("min").value ) &&
                  valid(  (x), (y -1), "L"  )
               )
            {
              itemsB[x][y] = ".";
              itemsB[x][y-1] = "O";
            }
            
          }
        }
      }
  }

  initial();

}



function right(){

  if (freeze == 0){
      for (var y=7; y >=0; y--){
        for (var x=0; x <=7; x++){
          if (itemsB[x][y].toUpperCase() == "O") {
            //alert(bx +"," +by + "__" + itemsB[bx][by]);
            if (  (y + 1 <= document.getElementById("max").value ) &&
                  valid(  (x), (y +1 ), "R"  )
               )
            {
              itemsB[x][y] = ".";
              itemsB[x][y+1] = "O";
            }
            
          }
        }
      }
  }

  initial();

}



function valid(x, y, z ){

  if (  editmode == "1" ||
        itemsF[x][y] == "*" ||
        itemsB[x][y] == "O"
     )
  {  //alert("f");
     return false;
  }else{
     //alert("t");
     steps = z;
     return true;
  }

}