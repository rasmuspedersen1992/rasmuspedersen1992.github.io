// import java.util.Collections;
var lattice = [];
// var maxOwner;

// var preyMatrix = [
//   [0,0,1],
//   [1,0,0],
//   [0,1,0],
// ];


// var preyMatrix = [
//   [0,1,0,0,0,0],
//   [0,0,1,0,0,0],
//   [0,0,0,1,0,0],
//   [0,0,0,0,1,0],
//   [0,0,0,0,0,1],
//   [1,0,0,0,0,0],
//   [0,1,0,0,0,0]
// ];

// var preyMatrix = [
//   [0,1,1,1,0,0,0],
//   [0,0,1,1,1,0,0],
//   [0,0,0,1,1,1,0],
//   [0,0,0,0,1,1,1],
//   [1,0,0,0,0,1,1],
//   [1,1,0,0,0,0,1],
//   [1,1,1,0,0,0,0]
// ];

// var preyMatrix = [
//   [0,1,0,1,0,1,0],
//   [0,0,1,0,1,0,1],
//   [1,0,0,1,0,1,0],
//   [0,1,0,0,1,0,1],
//   [1,0,1,0,0,1,0],
//   [0,1,0,1,0,0,1],
//   [1,0,1,0,1,0,0]
// ];

// var preyMatrix = [
//   [0,1,1,0,0,0,0],
//   [0,0,1,1,0,0,0],
//   [0,0,0,1,1,0,0],
//   [0,0,0,0,1,1,0],
//   [0,0,0,0,0,1,1],
//   [0,0,0,0,0,0,1],
//   [1,0,0,0,0,0,0]
// ];

var preyMatrix = [
  [0,1,0,0,0,0,0],
  [0,0,1,0,0,0,0],
  [0,0,0,1,0,0,0],
  [0,0,0,0,1,0,0],
  [0,0,0,0,0,1,0],
  [0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0]
];

function setup() {
 // createCanvas(640, 480);
  // createCanvas(100,100);
  createCanvas(384,216); // Fullscreen
  background(255);

  var possibleOwners = [0, 1, 2,3,4,5,6];
  // var possibleOwners = [0,1,2];
 maxOwner = possibleOwners.length-1;

  for (var a = 0; a < width; a++) {
    lattice[a] = [];
    for (var b = 0; b < width; b++) {
      lattice[a][b] = new LatticePoint();
      lattice[a][b].x = a;
      lattice[a][b].y = b;
      lattice[a][b].owner = random(possibleOwners);
      lattice[a][b].CalcColor();
      lattice[a][b].display();
      // print(maxOwner);
      // lattice[a][b].calcEatenBy(maxOwner);
     // lattice[a][b].eatenBy = random(possibleOwners); 
      
      //Random eaten by
      // if (lattice[a][b].owner == 3){
      //   lattice[a][b].eatenBy = 0;
      // } else{
      //   lattice[a][b].eatenBy = lattice[a][b].owner+1;
      // }
      // // print(lattice[a][b].owner,lattice[a][b].eatenBy);

    }
  }

}

function draw() {
  //test = new LatticePoint();
  //test.display();

  // var num0 = 0;
  // var num1 = 0;
  // var num2 = 0; 
  // for (var x = 0; x < width; x++) {
  //   for (var y = 0; y < width; y++) {
  //     lattice[x][y].display();
  //     if(lattice[x][y].owner == 0){
  //       num0++;
  //     }
  //     if(lattice[x][y].owner == 1){
  //       num1++;
  //     }
  //     if(lattice[x][y].owner == 2){
  //       num2++;
  //     }
  //   }
  // }

// var sum = num0+num1+num2;
  // print(num0/sum,num1/sum,num2/sum);
   //  var randLatArray = [];
 //  var i = 0;
 //  for (var x = 0; x < width; x++) {
 //    for (var y = 0; y < width; y++) {
 //       randLatArray[i] = lattice[x][y];
  
 //       i++;
 //    }
 //  }
 //  shuffle(randLatArray);
 // // print(randLatArray[1]);
  
  var numSteps = 10000;
  
  for (var i = 0;i<numSteps; i++){
    // var k = Math.floor(random(width*height));

    var x = Math.floor(random(width));
    var y = Math.floor(random(height));
    var x2 = Math.floor(random(width));
    var y2 = Math.floor(random(height));
    // var dir = random([0,1,2,3]);
      // print(lattice[x][y].owner,lattice[x][y].eatenBy);

      // if (y==0){
      //   lattice[x][y].tryToEat(lattice[x][height-1],maxOwner);
      // }
      // if (x==0){
      //   lattice[x][y].tryToEat(lattice[width-1][y],maxOwner);
      // }
      // if (y==height){
      //   lattice[x][y].tryToEat(lattice[x][0],maxOwner);
      // }
      // if (x==width){
      //   lattice[x][y].tryToEat(lattice[0][y],maxOwner);
      // }

    if(y>0){
      lattice[x][y].tryToEat(lattice[x][y-1]);
      // lattice[x][y-1].display();
      // if(lattice[x][y].owner == lattice[x][y-1].eatenBy){
      //     lattice[x][y-1].owner=lattice[x][y].owner;
      //     lattice[x][y-1].calcEatenBy();
      //     }
        }
    if(x+1<width){
      lattice[x][y].tryToEat(lattice[x+1][y]);
      // lattice[x+1][y].display();
        // if(lattice[x][y].owner == lattice[x+1][y].eatenBy){
        //   lattice[x+1][y].owner=lattice[x][y].owner;
        //   lattice[x+1][y].calcEatenBy();
        //   }
        }
    if(y+1<height){
      lattice[x][y].tryToEat(lattice[x][y+1]);
      // lattice[x][y+1].display();
      // if(lattice[x][y].owner == lattice[x][y+1].eatenBy){
      //     lattice[x][y+1].owner=lattice[x][y].owner;
      //     lattice[x][y+1].calcEatenBy();
      //     }
        }
    if(x>0){
      lattice[x][y].tryToEat(lattice[x-1][y]);
      // lattice[x-1][y].display();
      // if(lattice[x][y].owner == lattice[x-1][y].eatenBy){
      //     lattice[x-1][y].owner=lattice[x][y].owner;
      //     lattice[x-1][y].calcEatenBy();
      //     }
        }

    if(x>0 && y >0){
      lattice[x][y].tryToEat(lattice[x-1][y-1]);
    }
    if(x+1<width && y >0){
      lattice[x][y].tryToEat(lattice[x+1][y-1]);
    }
    if(x>0 && y+1<height){
      lattice[x][y].tryToEat(lattice[x-1][y+1]);
    }
    if(x+1<width && y +1<height){
      lattice[x][y].tryToEat(lattice[x+1][y+1]);
    }
        // lattice[x][y].display();
  // lattice[x][y].display();

    // if (random(1)>0.8){
      // lattice[x][y].tryToEat(lattice[x2][y2]);
    // if(lattice[x][y].owner == lattice[x2][y2].eatenBy){
      // lattice[x2][y2].owner = lattice[x][y].owner;
    // }

    // if(x+6<width){
    //   lattice[x][y].tryToEat(lattice[x+6][y],maxOwner);
    //   // lattice[x+1][y].display();
    //     // if(lattice[x][y].owner == lattice[x+1][y].eatenBy){
    //     //   lattice[x+1][y].owner=lattice[x][y].owner;
    //     //   lattice[x+1][y].calcEatenBy();
    //     //   }
    //     }


    // if(y-2>0){
    //   if(lattice[x][y].owner == lattice[x][y-2].eatenBy){
    //       lattice[x][y-2].owner=lattice[x][y].owner;
    //       }
    //     }
    // if(x+2<width){
    //     if(lattice[x][y].owner == lattice[x+2][y].eatenBy){
    //       lattice[x+2][y].owner=lattice[x][y].owner;
    //       }
    //     }
    // if(y+2<height){
    //   if(lattice[x][y].owner == lattice[x][y+2].eatenBy){
    //       lattice[x][y+2].owner=lattice[x][y].owner;
    //       }
    //     }
    // if(x-2>0){
    //   if(lattice[x][y].owner == lattice[x-2][y].eatenBy){
    //       lattice[x-2][y].owner=lattice[x][y].owner;
    //       }
    //     }

  // }
    // var x = Math.floor(width/k);
    // var y = height%k;

    // print(x,y);
   
    // switch(dir){
    //   case 0:
    //     if(y-1>0){
    //       lattice[x][y].tryToEat(lattice[x][y-1]);
    //     }
    //     break;
    //   case 1:
    //     if(x-1>0){
    //       lattice[x][y].tryToEat(lattice[x-1][y]);
    //     }
    //     print(dir);
    //     break;
    //   case 2:
    //     print(dir);
    //     break;
    //   case 3:
    //     print(dir);
    //     break;
    //   default:
    //     print("ERROR");
    //     break;
    // }

    
    // switch(dir){
    //   case 0: // North
    //     if(y-1>0){
    //       if(lattice[x][y].owner == lattice[x][y-1].eatenBy){

    //         print(x,y,lattice[x][y].owner,lattice[x][y-1].eatenBy);
    //       lattice[x][y-1].owner=lattice[x][y].owner;
    //       }
    //     }
    //     break;
    //   case 1: // East
    //     if(x+1<width){
    //       if(lattice[x][y].owner == lattice[x+1][y].eatenBy){
    //       lattice[x+1][y].owner=lattice[x][y].owner;
    //       }
    //     }
      
    //     break;
    //   case 2: // South
    //     if(y+1<height){
    //       if(lattice[x][y].owner == lattice[x][y+1].eatenBy){
    //       lattice[x][y+1].owner=lattice[x][y].owner;
    //       }
    //     }
      
    //     break;
    //   case 3: // West
    //     if(x-1>0){
    //       if(lattice[x][y].owner == lattice[x-1][y].eatenBy){
    //       lattice[x-1][y].owner=lattice[x][y].owner;
    //       }
    //     }
      
    //     break;
    //   default:
    //     break;
    // }
  }
}

//function RandNeigh(){
//  var curX = 1;
//  var curY = 1;
//  var neighX = Math.floor(random(width));
//  var neighY = Math.floor(random(height));
  
  
  
//}

function LatticePoint() {
  this.x = 1;
  this.y = 1;
  this.owner = 1;
  this.eatenBy = 1;
  this.lifeTime = 0;

  this.clr = color(0,0,0);

  this.display = function(){
    // this.CalcColor();
    stroke(this.clr);
    point(this.x,this.y);
  }

  this.CalcColor = function() {

    switch (this.owner) {
      case 0:
        this.clr = color(200, 0, 0);

        // this.eatenBy = 2;
        break;
      case 1:
        this.clr = color(0, 200, 0);
        // this.eatenBy = 0;
        break;
      case 2:
        this.clr = color(0, 0, 200);
        // this.eatenBy = 1;
        break;
      case 3:
        this.clr = color(150,150,0);
        break;
      case 4:
        this.clr = color(0,150,150);
        break;
      case 5:
        this.clr = color(150,0,150);
        break;
      case 6:
        this.clr = color(200,200,200);
        break;
      case 7:
        this.clr = color(100,100,100);
        break;
      default:
        this.clr = color(0);
        break;
    }

    // point(this.x, this.y);

    // this.lifeTime +=1;
    // this.lifeTime = 0;
  }

  this.tryToEat = function(l){
    // print(preyMatrix[l.eatenBy][this.owner])
    // print(preyMatrix[l.eatenBy][this.owner] == 1)
    if (preyMatrix[l.owner][this.owner] == 1){
   // if (l.eatenBy == this.owner){
      l.owner = this.owner;
      // l.calcEatenBy(max);
      // l.lifeTime = 0;
      l.CalcColor();
      l.display();
    }
  }

  // this.calcEatenBy = function(max){

  //     if (this.owner == max){
  //       this.eatenBy = 0;
  //     } else{
  //       this.eatenBy = this.owner+1;
  //     }
  //     // print(this.owner,this.eatenBy);
  // }
  
}