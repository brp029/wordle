window.onload = function() {
	getSolution();
	newGame();
	buildBoard();
	
	document.querySelectorAll(".qwerty").forEach(
	function(item){
		item.addEventListener("click", selectedLetter);
	})
	
	document.getElementById("playAgain").addEventListener("click", newGame);
	document.getElementById("debugMode").addEventListener("click", debugMode);
	document.getElementById("clearGuess").addEventListener("click", clearGuess);
	document.getElementById("submitGuess").addEventListener("click", submitGuess);
} //end window.onload

var currentGame, currentGuess, values, solutionArray, solution, valid, word;


function getSolution() {
	
	var req = new XMLHttpRequest();
	req.withCredentials = true;
	
	req.open("GET", "https://random-words5.p.rapidapi.com/getRandom?wordLength=5");
	req.setRequestHeader("X-RapidAPI-Key", "d5854d4252msha90e3c0562d13e4p17f839jsn0992e24ab6da");
	req.setRequestHeader("X-RapidAPI-Host", "random-words5.p.rapidapi.com");
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			solution = req.responseText;
		}
	}
	req.send();
}

function checkIfWord() {
	
	// find submitted word
	values = [];
	if (currentGame.activeRow == "0") {
		document.querySelectorAll("#row0 > .boxes").forEach(obj=>
		{values.push(obj.innerHTML)})
	}
	else if (currentGame.activeRow == "1") {
		document.querySelectorAll("#row1 > .boxes").forEach(obj=>
		{values.push(obj.innerHTML)})
	}
	else if (currentGame.activeRow == "2") {
		document.querySelectorAll("#row2 > .boxes").forEach(obj=>
		{values.push(obj.innerHTML)})
	}
	else if (currentGame.activeRow == "3") {
		document.querySelectorAll("#row3 > .boxes").forEach(obj=>
		{values.push(obj.innerHTML)})
	}
	else if (currentGame.activeRow == "4") {
		document.querySelectorAll("#row4 > .boxes").forEach(obj=>
		{values.push(obj.innerHTML)})
	}
	else if (currentGame.activeRow == "5") {
		document.querySelectorAll("#row5 > .boxes").forEach(obj=>
		{values.push(obj.innerHTML)})
	}
	
	word = JSON.stringify(values);
	word = word.replace("[", "");
	word = word.replaceAll(",", "");
	word = word.replace("]", "");
	word = word.replaceAll('"', '');
	//console.log(word);
	
	//check to see if the word is valid
	var req2 = new XMLHttpRequest();
	
	req2.open("GET", "https://www.dictionaryapi.com/api/v3/references/collegiate/json/"+word+"?key=c454bd4e-1aa5-4f81-abaf-7b9afda6d169");
	req2.onreadystatechange = function() {
		if (req2.readyState == 4) {
			text = req2.responseText;
			//console.log(text);
			if (text.includes('"meta":')) {
				valid = true;
				scoreSubmission();
			}
			else {
				valid = false;
				alert("Please enter a valid English word.");
				clearGuess();
			}
			//console.log(valid);
		}
	}
	req2.send();
}


function LetterSpace (id, value) {
	this.id = id;
	this.value = value;
	this.correct = checkCorrect;
}

function Game (turnCounter, activeColumn, activeRow, gameOver, gameWon, debugMode, solution) {
	this.turnCounter = turnCounter;
	this.activeColumn = activeColumn;
	this.activeRow = activeRow;
	this.gameOver = gameOver; 
	this.gameWon = gameWon;
	this.debugMode = debugMode; // "on", "off", "available"
	this.solution = solution;
}

function buildBoard() {	
	
	newRow();
	
	// create keyboard
	let arrayQwerty = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"];
	keyboardDivs = arrayQwerty.map(i=>"<div class='qwerty' id='" + i + "'>" + i + "</div>");
	
	document.getElementById("qwerty").innerHTML = keyboardDivs.join('');
}

function newGame() {
	
	getSolution();
	currentGame = new Game(0, 0, 0, false, false, "pending", solution);
	document.getElementById("row0").innerHTML = "";
	document.getElementById("row1").innerHTML = "";
	document.getElementById("row2").innerHTML = "";
	document.getElementById("row3").innerHTML = "";
	document.getElementById("row4").innerHTML = "";
	document.getElementById("row5").innerHTML = "";
	keyboard = document.getElementsByClassName("qwerty");
	for (i = 0; i < keyboard.length; i++) {
		keyboard[i].style.backgroundColor = "#acc9f4";
	}
	newRow();
	document.getElementById("playAgain").style.visibility = "hidden";
	document.getElementById("debugMode").style.visibility = "visible";
	
}

function newRow() {
	
	var sq0 = new LetterSpace ((currentGame.activeRow + "-0"), "&nbsp;");
	var sq1 = new LetterSpace ((currentGame.activeRow + "-1"), "&nbsp;");
	var sq2 = new LetterSpace ((currentGame.activeRow + "-2"), "&nbsp;");
	var sq3 = new LetterSpace ((currentGame.activeRow + "-3"), "&nbsp;");
	var sq4 = new LetterSpace ((currentGame.activeRow + "-4"), "&nbsp;");
	
	arrayIdx = Array(5).fill().map((_,i)=>i);
	
	//create gameplay row
	divs = arrayIdx.map(i=>"<div class='boxes' id='" + currentGame.activeRow + "-" + i + "'>&nbsp;</div>");
	
	document.getElementById("row"+currentGame.activeRow).innerHTML = divs.join('');
}


async function submitGuess() {
	
	//console.log(solution);
	
	await checkIfWord();
	
	//console.log(valid);
}

function scoreSubmission() {
	
	//console.log(valid);
	currentGame.solution = solution;
	solutionArray = solutionArr();
	
	checkCorrect();
	checkWin();
	
	if (currentGame.activeRow < 5 && currentGame.gameOver == false) {
		currentGame.activeRow++;
		currentGame.activeColumn = 0;
		newRow();
	} 
	else if (currentGame.gameWon == true) {
		alert("You Win!");
		document.getElementById("playAgain").style.visibility = "visible";
	}
	else if (currentGame.activeRow = 5) {
		currentGame.gameOver = true;
		currentGame.gameWon = false;
		alert("The solution was " + solution + ". Better luck next time!")
		document.getElementById("playAgain").style.visibility = "visible";
	}
  }


function solutionArr() {
		answer = currentGame.solution;
		solutionArray = answer.split("");
		solutionArray = solutionArray.map(function(x){return x.toUpperCase();})
		return solutionArray;
	}

function selectedLetter () {
	
	document.getElementById("debugMode").style.visibility = "hidden";
	currentGame.debugMode = "off";
	
	if (currentGame.activeColumn < 5) {
	
		//check id of clicked square

		sqID = (this.getAttribute("id"));
		
		// write selected letter to square
		let activeSelection = currentGame.activeRow + "-" + currentGame.activeColumn;
		document.getElementById(activeSelection).innerHTML = sqID;	
	
		currentGame.activeColumn++;
	}
	
}

function checkCorrect() {
	
	// check if there are duplicate letters in the array
	let dupeCheck = solutionArray.some((val, i) => solutionArray.indexOf(val) !== i); // if true, there are dupilates in the array
	//compare solution to guess
	for (i = 0; i < 5; i++) {
		if (solutionArray[i] == values[i]){  	//if correctly placed, turn green
			document.getElementById(currentGame.activeRow + "-" + i).style.backgroundColor = "green";
			document.getElementById(values[i]).style.backgroundColor = "green";
		}
		else if	(solutionArray.indexOf(values[i]) != -1) {  //if incorrectly placed, turn yellow
			document.getElementById(currentGame.activeRow + "-" + i).style.backgroundColor = "yellow";
			document.getElementById(values[i]).style.backgroundColor = "yellow";
		}
		else {  //if not in solution, turn grey
			document.getElementById(currentGame.activeRow + "-" + i).style.backgroundColor = "gray";
			document.getElementById(values[i]).style.backgroundColor = "gray";
		}
	}
}

function checkWin() {
	
	// check if solution matches guess
	if (JSON.stringify(solutionArray) == JSON.stringify(values)) {
		currentGame.gameOver = true;
		currentGame.gameWon = true;
	} 
}

function debugMode() {
	currentGame.debugMode = "on";
	document.getElementById("debugMode").style.visibility = "hidden";
	console.log("Debug Mode Engaged. The solution is: " + currentGame.solution);
	
}

function clearGuess() {
	for (i = 0; i < 5; i++) {
		document.getElementById(currentGame.activeRow + "-" + i).innerHTML = "&nbsp;";
	}
	currentGame.activeColumn = 0;
}
