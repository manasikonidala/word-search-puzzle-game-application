"use strict";



function WordSearchView(matrix, list, gameId, listId, instructionsId) {

	"use strict";	
	var selfSolved = true;	
	var names = { 

		cell: "cell",
		pivot: "pivot",
		selectable: "selectable",
		selected: "selected",
		path: "path"

	};
 	 
	var select = {  

		cells: "." + names.cell,
		pivot: "#" + names.pivot,
		selectable: "." + names.selectable,
		selected: "." + names.selected

	};

	var searchGrid = {

		row: "row",
		column: "column"

	};

	
	 this.setUpView = function() {

		createSearchGrid(matrix, names.cell, searchGrid.row, searchGrid.column, gameId);
		createListOfWords(list, listId);

	}

	
	function createSearchGrid(matrix, cellName, rowAttr, colAttr, boardId) {

		//loops through rows
		for (var i = 0; i < matrix.length; i++) {

			var row = $("<div/>");
			row.attr({class: "boardRow"}); 
			//loops through columns
			for (var j = 0; j < matrix[i].length; j++) {

				//each letter in the row is a button element
				var letter = $("<button/>");
				
				letter.attr({
					class: cellName, 
					[rowAttr]: i, 
					[colAttr]: j}).text(matrix[i][j]); 

				letter.appendTo(row);

			}


			row.appendTo($(boardId));
		}

	}

	
	function createListOfWords(wordList, wordListId) {

		//loops through rows
		for (var i = 0; i < wordList.length; i++) {

			//creates a div for the row
			var row = $("<div/>");
			row.attr({class: "listRow"}); //gives the rows a list row class
			for (var j = 0; j < wordList[i].length; j++) {

				var word = $("<li/>");
				word.attr({class: "listWord", text: wordList[i][j].replace(/\W/g, "")});
				word.text(wordList[i][j]);
				word.appendTo(row);

			}
			row.appendTo($(wordListId));

		}

	}

	
	this.solve = function(wordLoc, matrix) {

		
		Object.keys(wordLoc).forEach(function(word) {  	

			//path of the word
			var p = wordLoc[word].p;

			//the x and y value the word starts from
			var startX = wordLoc[word].x;
			var startY = wordLoc[word].y;

			
			for (var k = 0, x = startX, y = startY; k < word.length; k++, x = incr[p](x, y).x, y = incr[p](x, y).y) {

				//finds the puzzle cell with the respective x and y value and sets it as found
				$(select.cells + "[row = " + x + "][column = " + y + "]").addClass("found");	

			}

			//set to false since the program solved it for the player
			selfSolved = false;

			//checks if valid word made (which it was)
			validWordMade(list, word, instructionsId);	
	
		});

	}

	
	 this.triggerMouseDrag = function() {	
		var selectedLetters = []; 
		var wordMade = ''; 
		var mouseIsDown = false;	

	 	
		$(select.cells).mousedown(function() {
			
			//sets true that mouse is down
			mouseIsDown = true;

			//selects the pressed cell
			$(this).addClass(names.selected);

			//sets the pressed cell to be the 'pivot' of the move
			$(this).attr({id: names.pivot});

			highlightValidDirections($(this), matrix, names.selectable);

		});

		
		$(select.cells).mouseenter(function() {  
			
			
			if (mouseIsDown && $(this).hasClass(names.selectable)) {  

				//holds the direction of the path the mouse is currently on
				var currentDirection = $(this).attr(names.path);  

				
				for (var i = 0; i < selectedLetters.length; i++) {

					selectedLetters[i].removeClass(names.selected);

				}

				selectedLetters = [];
				wordMade = '';
				var cells = selectCellRange(select.cells, $(this), names.path, currentDirection, selectedLetters, wordMade);

				wordMade = cells.word;
				selectedLetters = cells.array;

			}

		});

		
		$(select.cells).mouseup(function() {
			endMove();
		});

		$(gameId).mouseleave (function() {

			if (mouseIsDown) { 
				endMove();
			}	

		});

		
		function endMove() {

			mouseIsDown = false;

			
			if (validWordMade(list, wordMade, instructionsId)) {

				$(select.selected).addClass("found");

			}

			//unselects any selected letters
			$(select.selected).removeClass(names.selected);

			$(select.cells).removeAttr(names.path);

			
			$(select.pivot).removeAttr("id");

			$(select.selectable).removeClass(names.selectable);

			
			wordMade = '';
			selectedLetters = [];

			}

	}

	
	function highlightValidDirections(selectedCell, matrix, makeSelectable) {

		//gets the row and column of where the cell the mouse pressed on is
		var cellRow = parseInt(selectedCell.attr(searchGrid.row));
		var cellCol = parseInt(selectedCell.attr(searchGrid.column));

		
		Object.keys(paths).forEach(function(path) { 
			//makes each cell in each of the paths selectable
			makeRangeSelectable(cellRow, cellCol, matrix.length, paths[path], makeSelectable);

		});

	}

	
	function makeRangeSelectable(x, y, l, p, selectable) {  

		
		for (var i = incr[p](x, y).x, j = incr[p](x, y).y;  
			bounds[p](i, j, l);  							
			i = incr[p](i, j).x, j=incr[p](i, j).y) {		

			//select the specific DOM elements with the specific row/column attribute values
			$("[" + searchGrid.row + "= " + i + "][" + searchGrid.column + "= " + j + "]")
				.addClass(selectable) 
				.attr({[names.path]: p}); 
		}

	}

	
	function selectCellRange(cellsSelector, hoveredCell, pathAttr, path, selectedCells, wordConstructed) {

		//variable to hold index of cell hovered on
		var hoverIndex;

		//variable to hold index of pivot
		var pivotIndex;  

		//selector for cells in the particular path the mouse is on
		var cellRange = cellsSelector + "[" + pathAttr + " =" + path + "]";

		//setting indices depending on how the paths flow
		switch(path) {

			case paths.vert:
			case paths.horizon:
			case paths.priDiag: 
			case paths.secDiag:				

				//hoverIndex > pivotIndex 
				hoverIndex = hoveredCell.index(cellRange)+1;
				pivotIndex = 0;

				//sets up wordConstructed with the pivot's letter (to start it off)
				wordConstructed = $(select.pivot).text();

				//using the pivot text, selects cells and adds their text to wordConstructed
				wordConstructed = selectLetters(selectedCells, wordConstructed, cellRange, pivotIndex, hoverIndex);
				

				break;
			
			case paths.vertBack:   
			case paths.horizonBack:
			case paths.priDiagBack:
			case paths.secDiagBack:

				//hoverIndex < pivotIndex
				hoverIndex = hoveredCell.index(cellRange);
				pivotIndex = $(cellRange).length;

				//selects range of cells between the pivot and the cell the mouse is on
			 	wordConstructed += selectLetters(selectedCells, wordConstructed, cellRange, hoverIndex, pivotIndex);

			 	//adds pivot text to the end
				wordConstructed += $(select.pivot).text();

				break;

		}

		return {word: wordConstructed, array: selectedCells};
		
	}

	
	function selectLetters(selectedCells, wordConstructed, range, lowerIndex, upperIndex) {

		
		$(range).slice(lowerIndex, upperIndex).each(function() {

			$(this).addClass(names.selected);
			
			selectedCells.push($(this));

			
			wordConstructed += $(this).text();

		});

		return wordConstructed;

	}
	
	
	function validWordMade (list, wordToCheck, instructionsId) {

		//loops through rows
		for (var i = 0; i < list.length; i++) {

			//loops through columns
			for (var j = 0; j < list[i].length; j++) {


				var trimmedWord = list[i][j].replace(/\W/g, "")				
				if (wordToCheck == trimmedWord ||
					wordToCheck == reversedWord(trimmedWord)) {					
					
					$(".listWord[text = " + trimmedWord + "]").addClass("found");

					//checks if the last word to find was found
					checkPuzzleSolved(".listWord", ".listWord.found", instructionsId);
					
					return true;
									
				}

			}

		}

	}	

	
	function checkPuzzleSolved (fullList, foundWordsList, instructionsId) {		
		if ($(fullList).length == $(foundWordsList).length) {
			if (selfSolved) {
				//updates h2 text
				$(instructionsId).text("You have completed the puzzle!!");
			}

			//if user used the solve button 
			else {
				$(instructionsId).text("Here is the solution!!");
			}	
			return true;
 		}
 		return false;

	}

	
	function reversedWord(word) {
		var reversedWord = "";

		
		for (var i = word.length - 1; i >= 0; i--) {
			reversedWord += word.charAt(i);
		}

		return reversedWord;

	}

}