"use strict";



function WordSearchLogic(gameId,list) {

	//object to hold common board variables
	var board = {

		matrix: [], 
		size: 10 

	};

	
	var thisWord = {

		viablePaths: [], 
		wordFitted: false 
	};

	//empty object to hold the locations of each fitted word
	var wordLocations = {};

	
	this.setUpGame = function() {

		//creates a 2D array with the given board size
		board.matrix = createMatrix(board.size);

		//fits the list of words into the board matrix
		fitWordsIntoMatrix(list, board.matrix);

		//inserts random letters in the empty indexes of the matrix
		fillWithRandomLetters(board.matrix);

	}

	
	function createMatrix(size) {

		//creates an array of length size
		var matrix = new Array(size);

		//sets each index inside the array to be another array of length size
		for (var i = 0; i < size; i++) {

			matrix[i] = new Array(size);

		}

		return matrix;

	}

	
	function fitWordsIntoMatrix(wordList, matrix) {

		//loops through rows
		for (var i = 0; i < wordList.length; i++) {

			//loops through columns
			for (var j = 0; j < wordList[i].length; j++) {

				//removes spaces/apostrophes/the like from the word
				var trimmedWord = trimWord(wordList[i][j]);

				//tries 50 times to fit the word into the matrix
				for (var k = 0; thisWord.wordFitted == false && k < 100; k++) {		

					insertWordIntoMatrix(trimmedWord, matrix);	

				}

				if (thisWord.wordFitted == false) {

					//removes it from the given row of words
					wordList[i] = remove(wordList[i], wordList[i][j]);
					j--;

				}

				//otherwise, set it to false for next iteration
				else {

					thisWord.wordFitted = false; 

				}	

			}

		}

	}

	
	function insertWordIntoMatrix(word, matrix) {

		//random row and column value
		var randX = getRandomNum(matrix.length);
		var randY = getRandomNum(matrix.length);

		//if the index is empty or if the index has the value as the word's starting letter
		if (jQuery.isEmptyObject(matrix[randX][randY]) ||
			matrix[randX][randY] == word.charAt(0)) {

			checkPossibleOrientations(word, matrix, randX, randY);

		}

	}

	
	function checkPossibleOrientations(w, m, x, y) {

		
		Object.keys(paths).forEach(function(i) {

			//checks if the orientation fits using the property name (i) in the paths object
			doesOrientationFit(w, m, x, y, paths[i]);

		});

		
		if (thisWord.viablePaths.length != 0) {

			var randIndex = getRandomNum(thisWord.viablePaths.length);
			var finalOrientation = thisWord.viablePaths[randIndex];


			thisWord.viablePaths = [];


			wordLocations[w] = {x: x, y: y, p: finalOrientation};

			
			setWordIntoMatrix(w, m, x, y, finalOrientation);

		}

	}
	
	
	function setWordIntoMatrix(w, m, x, y, p) {

		
		for (var k = 0, x, y; k < w.length; k++, x = incr[p](x, y).x, y = incr[p](x, y).y) {

			m[x][y] = w.charAt(k); 

		}
		thisWord.wordFitted = true;

	}
	function doesOrientationFit(w, m, x, y, p) {

		
		var letterCount = 0;
		var wl = w.length;
		var ml = m.length;

		for (var k = 0, x, y; k < wl && bounds[p](x, y, ml); k++, x = incr[p](x, y).x, y = incr[p](x, y).y) {
			if (jQuery.isEmptyObject(m[x][y]) ||
				m[x][y] == w.charAt(k)) {

				letterCount++;

			}

		}
		if (letterCount == wl) {

			thisWord.viablePaths.push(p);

		}

	}

	/** fills empty indices in the 2D array with randomly generated letters
	 *
	 * @param {Array[]} matrix
	 */
	function fillWithRandomLetters(matrix) {

		for (var i = 0; i < matrix.length; i++ ) {

			
			for (var j = 0; j < matrix[i].length; j++) {

				
				if (jQuery.isEmptyObject(matrix[i][j])) {

					
					matrix[i][j] = String.fromCharCode(65 + Math.random()*26);

				}

			}

		}

	}

	
	function remove(array, indexElement) {

		return array.filter(i => i !== indexElement);

	}

	function getRandomNum(bound) {

		return Math.floor(Math.random()*(bound));

	}
	function trimWord(word) {

		return word.replace(/\W/g, "");

	}

	this.getMatrix = function() {

		return board.matrix;

	}

	this.getWordLocations = function() {

		return wordLocations; 

	}
	
	this.getListOfWords = function() {

		return list;

	}

}