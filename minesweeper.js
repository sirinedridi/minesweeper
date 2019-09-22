$(document).ready(() => {

var rowNum, colNum, bombNum;
let grid = document.getElementById("grid");
let notBombs = 0;
let notBombsClicked = 0;
let bombsFlagged = 0;
let time = 0;
let highScores = [];
let bombFound = false;
//let gameEnd = false;


//let boxes = [];
let boxes = Array();
let timer;
let firstclick = false;
let firstGame = true;
let numclicks = 0;

$('#submit').on('click', function(){
    //gameEnd = false;
    clearInterval(timer);
    bombsFlagged = 0;
    notBombsClicked = 0;
    firstclick = false;
    firstGame = true;
    numclicks = 0;
    remTimer();
    $(".grid").empty();
    rowNum = document.getElementById("numRows").value;
    colNum = document.getElementById("numCols").value;
    bombNum = document.getElementById("numBombs").value;
    let ready = true;
    let div_row;

    //check to make sure all numbers are valid
    if (rowNum < 8 || rowNum > 30) {
        alert("row number must be between 8 and 30!");
        ready = false;
       // document.getElementById("numRows").style.visibility = "hidden";     
    } 
    if(colNum < 8 || colNum > 40) {
        alert("column number must be between 8 and 40!");
        ready = false;
    }
    if (bombNum < 1 || bombNum > (rowNum * colNum - 1)) {
        alert ("bomb number must be between 1 and minefield size - 1");
        ready = false;
    }
    //if numbers are valid, make a grid using them
    if (ready == true) {
        notBombs = rowNum * colNum - bombNum;
        createBoard(rowNum, colNum, bombNum);
        placeBombs(bombNum);
        //countBombs();
    }
   // createTimer();
});

$('#restart').on('click', function(){
    //gameEnd = false;
    clearInterval(timer);
    bombsFlagged = 0;
    numclicks = 0;
    notBombsClicked = 0;
    firstclick = false;
    firstGame = true;
    remTimer();
    $(".grid").empty(); //clear prexisiting grid
    //pick random numbers
    rowNum = Math.floor(Math.random() * (30 - 8 + 1)) + 8;
    //random(8,30);
    colNum = Math.floor(Math.random() * (40 - 8 + 1)) + 8;
    bombNum = Math.floor(Math.random() * ((colNum*rowNum -  1 + 1))) + 1;
    //make random board
    notBombs = rowNum * colNum - bombNum;
    createBoard(rowNum, colNum, bombNum);
    placeBombs(bombNum);
    //countBombs();  
    //createTimer();  

});

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function createBoard(rows, cols, bombs) {
    //bombnum = 0;
    time = 0;
   // firstclick = false
    for (var row = 0; row < rowNum; row++) {
        div_row = document.createElement("div");
        boxes[row] = [];
        for (var col = 0; col < colNum; col++) {
            grid_item = document.createElement("button");
            grid_item.setAttribute("class", "box");
            grid_item.setAttribute("data-x", col);
            grid_item.setAttribute("data-y", row);
            grid_item.setAttribute("data-bomb", "no");
            grid_item.setAttribute("value", 0);
            grid_item.setAttribute("data-flagged", "no");
            grid_item.setAttribute("data-shown", "no");
            grid_item.style.verticalAlign = "top";
            div_row.append(grid_item);
            boxes[row][col] = grid_item;
        }
        grid.append(div_row);
    }
}

function placeBombs(bombs) {
    
    let i = 0;
    while(i < bombs) {
        let y = Math.floor(Math.random() * colNum);
        let x = Math.floor(Math.random() * rowNum);
        if (boxes[x][y].getAttribute("data-bomb") == "no") {
            boxes[x][y].setAttribute("data-bomb", "yes");;
         //   boxes[x][y].style.backgroundColor = "yellow";
            i++;
        }
    }
    
    updateBombs();
    //when clicking on a box
    countBombs();
    $("button.box").on('click', function(e){
        numclicks++;
        if (numclicks == 1) {
            startTimer();
            //firstGame = false;
        }
        if (e.shiftKey) { //flag a bomb
            if(this.getAttribute("value") == 0) {
                if(this.style.backgroundColor !== "black") {
                    this.style.backgroundColor = "black"; 
                    this.setAttribute("data-flagged", "yes");
                    bombNum--;
                    if (this.getAttribute("data-bomb") == "yes") {
                        bombsFlagged++
                    }; //if its a bomb get closer to end game
                    updateBombs();
                } else {
                    //unflag a bomb
                    this.style.backgroundColor = "pink"; 
                    this.setAttribute("data-flagged", "no");
                    bombNum++;
                    bombsFlagged--;
                    updateBombs();
                }
            }
            //if(gameEnd == false) {
            checkGameOver();
           // }            
        } else {
            if (this.getAttribute("data-flagged") == "yes") {
                //flagged button, do nothing
            } else if(this.getAttribute("data-bomb") == "yes") { //bomb
                this.style.backgroundColor = "red";
                //if(endGame == false) {
                    endGame(false);
                    //gameEnd = true;
                //}
            } else if(this.getAttribute("data-adjBomb") > 0) { //has adjacent bombs
                if (this.getAttribute("value") == 0) { //if it hasnt been clicked yet
                    //console.log("found adjacent");
                    this.style.backgroundColor = "white";
                    adj = this.getAttribute("data-adjBomb");
                    this.setAttribute("value", adj);
                    this.setAttribute("data-shown", "yes");
                    this.append(adj);
                    notBombsClicked++;
                    checkGameOver();
                } else { //reveal around if flags = bombs
                    flagcount = 0;
                    let i = this.getAttribute("data-y");
                    i = i * 1;
                    let j = this.getAttribute("data-x");
                    j = j*1;
                    //count adjacent flags
                    if (i + 1 < rowNum && i + 1 >= 0) {
                        if(boxes[i+1][j].getAttribute("data-flagged") == "yes") {flagcount++;
                        }
                    }
                    if (i + 1 < rowNum && j + 1 < colNum) {
                        if(boxes[i+1][j+1].getAttribute("data-flagged") == "yes") {flagcount++;}
                    }
                    if (i + 1 < rowNum && j - 1 >= 0) {
                        if(boxes[i+1][j-1].getAttribute("data-flagged") == "yes") {flagcount++;}
                    }
                    if (j - 1 >= 0) {
                        if(boxes[i][j-1].getAttribute("data-flagged") == "yes") {flagcount++;}
                    }
                    if (j + 1 < colNum) {
                        if(boxes[i][j+1].getAttribute("data-flagged") == "yes") {flagcount++;}
                    }
                    if (j + 1 < colNum && i - 1 >= 0) {
                        if(boxes[i - 1][j+1].getAttribute("data-flagged") == "yes") {flagcount++;}
                    }
                    if (i - 1 >= 0) {
                        if(boxes[i - 1][j].getAttribute("data-flagged") == "yes") {flagcount++;}
                    }
                    if (j - 1 > 0&& i - 1 >= 0) {
                        if(boxes[i - 1][j-1].getAttribute("data-flagged") == "yes") {flagcount++;}
                    }
                    //if adj flags = bombs around it
                    if(flagcount == this.getAttribute("data-adjBomb")) {
                        if (i + 1 < rowNum && i + 1 >= 0) {  //if it exists
                            let theBox = getBox((1*i)+1, j);
                            if(theBox.getAttribute("data-shown") == "no") { //if this box isnt revealed
                                reveal(boxes[i+1][j]); //reveal it  
                                //notBombsClicked++;
                            }
                        }
                        if (i + 1 < rowNum && j + 1 < colNum) {
                            if(boxes[i+1][j+1].getAttribute("data-shown") == "no") {
                                reveal(boxes[i+1][j+1]); //reveal it
                               // notBombsClicked++;
                            }
                        }
                        if (i + 1 < rowNum && j - 1 >= 0) {
                            if(boxes[i+1][j-1].getAttribute("data-shown") == "no") {
                                reveal(boxes[i+1][j-1]); //reveal it
                                //notBombsClicked++;
                            }
                        }
                        if (j - 1 >= 0) {
                            if(boxes[i][j-1].getAttribute("data-shown") == "no") {
                                reveal(boxes[i][j-1]); //reveal it
                                //notBombsClicked++;
                            }
                        }
                        if (j + 1 < colNum) {
                            if(boxes[i][j+1].getAttribute("data-shown") == "no") {
                                reveal(boxes[i][j+1]); //reveal it  
                               // notBombsClicked++;
                            }
                        }
                        if (j + 1 < colNum && i - 1 >= 0) {
                            if(boxes[i - 1][j+1].getAttribute("data-shown") == "no") {
                                reveal(boxes[i-1][j+1]); //reveal it 
                               // notBombsClicked++;
                            }
                        }
                        if (i - 1 >= 0) {
                            if(boxes[i - 1][j].getAttribute("data-shown") == "no") {
                                reveal(boxes[i-1][j]); //reveal it
                                //notBombsClicked++;
                            }
                        }
                        if (j - 1 > 0&& i - 1 >= 0) {
                            if(boxes[i - 1][j-1].getAttribute("data-shown") == "no") { 
                                reveal(boxes[i-1][j-1]); //reveal it
                                
                            }
                        }
                    }
                    checkGameOver();
                }
            } else {
                //no adjacent bombs, do recursion
                recur(this);
                //notBombsClicked++;
            }
        }
        //if(gameEnd == false){
        //}

    });
}
function countBombs() {
    for(let i = 0; i < rowNum; i++) {
        for(let j = 0; j < colNum; j++) {
            let bombcount = 0;
            //console.log(i);
            //console.log(j);
            //check all neighbouring boxes for bombs
            if (boxes[i][j].getAttribute("data-bomb") == "no") {
                if (i + 1 < rowNum && i + 1 >= 0) {
                    if(boxes[i+1][j].getAttribute("data-bomb") == "yes") {bombcount++;}
                }
                if (i + 1 < rowNum && j + 1 < colNum) {
                    if(boxes[i+1][j+1].getAttribute("data-bomb") == "yes") {bombcount++;}
                }
                if (i + 1 < rowNum && j - 1 >= 0) {
                    if(boxes[i+1][j-1].getAttribute("data-bomb") == "yes") {bombcount++;}
                }
                if (j - 1 >= 0) {
                    if(boxes[i][j-1].getAttribute("data-bomb") == "yes") {bombcount++;}
                }
                if (j + 1 < colNum) {
                    if(boxes[i][j+1].getAttribute("data-bomb") == "yes") {bombcount++;}
                }
                if (j + 1 < colNum && i - 1 >= 0) {
                    if(boxes[i - 1][j+1].getAttribute("data-bomb") == "yes") {bombcount++;}
                }
                if (i - 1 >= 0) {
                    if(boxes[i - 1][j].getAttribute("data-bomb") == "yes") {bombcount++;}
                }
                if (j - 1 >= 0 && i - 1 >= 0) {
                    if(boxes[i - 1][j-1].getAttribute("data-bomb") == "yes") { bombcount++;}
                }
                boxes[i][j].setAttribute("data-adjbomb", bombcount);
            }             
        }
    }
}

function endGame(x) {
    clearInterval(timer);
    remTimer();
    for(var row = 0; row < rowNum;row++) {
        for(var col = 0; col < colNum; col++) {
            boxes[row][col].setAttribute("disabled", "disabled");
        }
    }
    if(x){
        alert ("you win!!!");
        highScores[highScores.length] = time;
       // console.log(highScores[0]);
       // console.log(highScores[1]);
        highestScore();
    } else {
        alert("you hit a mine! game over");
    }
    // timersec = document.getElementsByClassName("timerSection");
    // timersec.empty();
    
    //firstclick = false
    time = 0;
    //gameEnd = true;
}

function updateBombs() {
    //if (bombNum < 0) {bombNum = 0};
    bombDisplay = document.getElementById("bombsLeft");
    $(".bombsLeft").empty();
    //bombDisplay.empty();
    $(".bombsLeft").append("bombs left: " + bombNum);
}

function checkGameOver() {
    if(bombsFlagged + notBombsClicked == rowNum * colNum) {
            endGame(true);        
    }
}

function startTimer() {
    createTimer();
    timer = setInterval(() => {
        $('#time').text(++time);}, 1000);
}

function createTimer() {
    jQuery('<div/>', {id: 'timer'}).appendTo("section.timerSection");
    jQuery('<label/>', {id: 'timerLabel'}).appendTo("#timer");   
    $('#timerLabel').append("Time: ");
    jQuery('<label/>', {id: "time"}).appendTo("#timer");
    //$('#timer').append("0");
    let zero = "0";
    $('#time').append(zero);
    timer = document.getElementById("timer");
}

function remTimer() {
    $('#timer').remove();
    $('#timerLabel').remove();
    $('#time').remove();
  //  time = 0;
   // timer = "";
}

function highestScore() {
    high = document.getElementById("highScore");
    let low = highScores[0];
    for(let i = 0; i < highScores.length; i++) {
        if(highScores[i] < low) {
            low = highScores[i];
          //  console.log("low: " + low);
        }
    }
    $(".highScore").empty();
    $(".highScore").append("high score: " + low + " seconds");
}

function recur(square) {
    if(square.getAttribute("data-adjbomb") == 0) { //if no adjacent bombs beside it
        if(square.getAttribute("data-shown") == "no") { //block is not revealed yet
            reveal(square);
        } //reveal that square
            //square.style.backgroundColor = "gray";
            //square.setAttribute("disabled", "disabled"); //disable that button
            let i = square.getAttribute("data-y");
            i = 1*i;
            let j = square.getAttribute("data-x");
            j = 1*j;
            //reveavl all around it that have not been revealed yet
            //if one around it revelead has 0 bombs by it, recur.
            //else do nothing
            if (i + 1 < rowNum && i + 1 >= 0) {  //if it exists
                let theBox = getBox((1*i)+1, j);
                if(theBox.getAttribute("data-shown") == "no") { //if this box isnt revealed
                    reveal(boxes[i+1][j]); //reveal it
                    if(boxes[i+1][j].getAttribute("data-adjbomb") == 0) { //if it has 0 around it
                        recur(boxes[i+1][j]);
                    }
                    
                }
            }
            if (i + 1 < rowNum && j + 1 < colNum) {
                if(boxes[i+1][j+1].getAttribute("data-shown") == "no") {
                    reveal(boxes[i+1][j+1]); //reveal it
                    if(boxes[i+1][j+1].getAttribute("data-adjbomb") == 0) { //if it has 0 around it
                        recur(boxes[i+1][j+1]);
                    }
                }
            }
            if (i + 1 < rowNum && j - 1 >= 0) {
                if(boxes[i+1][j-1].getAttribute("data-shown") == "no") {
                    reveal(boxes[i+1][j-1]); //reveal it
                    if(boxes[i+1][j-1].getAttribute("data-adjbomb") == 0) { //if it has 0 around it
                        recur(boxes[i+1][j-1]);
                    }
                }
            }
            if (j - 1 >= 0) {
                if(boxes[i][j-1].getAttribute("data-shown") == "no") {
                    reveal(boxes[i][j-1]); //reveal it
                    if(boxes[i][j-1].getAttribute("data-adjbomb") == 0) { //if it has 0 around it
                        recur(boxes[i][j-1]);
                    }
                }
            }
            if (j + 1 < colNum) {
                if(boxes[i][j+1].getAttribute("data-shown") == "no") {
                    reveal(boxes[i][j+1]); //reveal it
                    if(boxes[i][j+1].getAttribute("data-adjbomb") == 0) { //if it has 0 around it
                        recur(boxes[i][j+1]);
                    }   
                }
            }
            if (j + 1 < colNum && i - 1 >= 0) {
                if(boxes[i - 1][j+1].getAttribute("data-shown") == "no") {
                    reveal(boxes[i-1][j+1]); //reveal it
                    if(boxes[i-1][j+1].getAttribute("data-adjbomb") == 0) { //if it has 0 around it
                        recur(boxes[i-1][j+1]);
                    } 
                }
            }
            if (i - 1 >= 0) {
                if(boxes[i - 1][j].getAttribute("data-shown") == "no") {
                    reveal(boxes[i-1][j]); //reveal it
                    if(boxes[i-1][j].getAttribute("data-adjbomb") == 0) { //if it has 0 around it
                        recur(boxes[i-1][j]);
                    } 
                }
            }
            if (j - 1 > 0&& i - 1 >= 0) {
                if(boxes[i - 1][j-1].getAttribute("data-shown") == "no") { 
                    reveal(boxes[i-1][j-1]); //reveal it
                    if(boxes[i-1][j-1].getAttribute("data-adjbomb") == 0) { //if it has 0 around it
                        recur(boxes[i-1][j-1]);
                    } 
                }
            }
        
    }
    checkGameOver();
}

function reveal(x) {
    //console.log("found adjacent");
    x.style.backgroundColor = "white";
    adj = x.getAttribute("data-adjbomb");
    x.setAttribute("value", adj);
    x.append(adj);
    x.setAttribute("data-shown", "yes");
    notBombsClicked++;
    if(x.getAttribute("data-bomb") == "yes") {
        bombFound = true;
        endGame(false);
    }
}

function getBox(x,y) {
    return boxes[x][y];
}

 


});