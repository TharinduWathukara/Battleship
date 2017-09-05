/**
 * Created by Tharindu Gayan on 9/4/2017.
 */

var guessess =[];

var view = {
    displayMessage: function(msg) {
        var messagearea = document.getElementById("message_area");
        messagearea.innerHTML = msg;
    },

    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

var model = {
    boardSize:7,
    numShips:3,
    shipLength:3,
    shipSunks:0,

    ships: [{locations:["0","0","0"], hits:["","",""]},
        {locations:["0","0","0"], hits:["","",""]},
        {locations:["0","0","0"], hits:["","",""]}],
    
    fire: function (guess) {
        for (var i=0; i<this.numShips;i++){
            var ship = this.ships[i];
            var locations = ship.locations;
            var index = locations.indexOf(guess);
            if (index>=0){
                ship.hits[index]="hit";
                view.displayHit(guess);
                view.displayMessage("Hit!")
                if (this.isSunk(ship)){
                    view.displayMessage("You Sunk My Battleship!!");
                    this.shipSunks++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You Missed!")
        return false;
    },
    isSunk: function (ship) {
        for (var i=0; i<this.shipLength;i++){
            if(ship.hits[i]!=="hit"){
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function () {
        var locations;
        for (var i=0; i<this.numShips;i++){
            do{
                locations=this.generateShip();
            }while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    
    generateShip: function () {
        var direction = Math.floor(Math.random()*2);
        var row,col;

        if (direction===1){
            row = Math.floor(Math.random()*this.boardSize);
            col = Math.floor(Math.random()*(this.boardSize-this.shipLength));
        }else{
            row = Math.floor(Math.random()*(this.boardSize-this.shipLength));
            col = Math.floor(Math.random()*this.boardSize);
        }

        var newShipLocaions=[];
        for (var i=0; i<this.shipLength;i++){
            if(direction===1){
                newShipLocaions.push(row+""+(col+i));
            }else{
                newShipLocaions.push((row+i)+""+col);
            }
        }
        return newShipLocaions;
    },

    collision: function (locations) {
        for(var i=0;i<this.numShips;i++){
            var ship = model.ships[i];
            for(var j=0;j<locations.length;j++){
                if(ship.locations.indexOf(locations[j])>=0){
                    return true;
                }
            }
        }
        return false;
    }
};

var controller = {
    guesses:0,

    praseGuess: function (guess) {
        var alperbet = ["A","B","C","D","E","F","G"];

        if(guess === null || guess.length !== 2){
            alert("Oops, please enter a letter and a number on the board.");
        }
        else {
            var firstChar = guess.charAt(0);
            var row = alperbet.indexOf(firstChar);
            var column = guess.charAt(1);

            if (isNaN(row) || isNaN(column)){
                alert("Oops, that isn't on the board.");
            }
            else if (row<0 || row>=model.boardSize || column<0 || column>=model.boardSize){
                alert("Oops, that is off the board.");
            }else{
                return row+column;
            }
        }
        return null;
    },

    processGuess: function (guess) {
        var location = this.praseGuess(guess);
        if (location){
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipSunks === model.numShips){
                view.displayMessage("You sunk my battleships, in " + this.guesses + " guesses!");
            }
        }
    }
};

function init() {
    var fireButton = document.getElementById("fire");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guess");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations()
}

function handleFireButton() {
    var guessInput = document.getElementById("guess");
    var guess = guessInput.value;
    if (guessess.indexOf(guess)<0){
        guessess.push(guess);
        controller.processGuess(guess);
    }
    else{
        alert("Oops, you enter same input again.")
    }
    guessInput.value="";
}

window.onload = init();

function handleKeyPress(e) {
    var fireButton = document.getElementById("fire");
    if(e.keyCode ===13){
        fireButton.click();
        return false;
    }
}