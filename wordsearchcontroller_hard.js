"use strict";

function WordSearchController(gameId, listId, solveId, newGameId, instructionsId, themeId) {

	
	function createMatrix(words) {
		// Shuffle the words randomly
		const shuffled = words.sort(() => Math.random() - 0.5);
	  
		// Create a 5x2 matrix
		const matrix = [];
		let index = 0;
	  
		for (let i = 0; i < 5; i++) {
		  const row = [];
	  
		  for (let j = 0; j < 2; j++) {
			row.push(shuffled[index]);
			index++;
		  }
	  
		  matrix.push(row);
		}
	  
		return matrix;
	  }
	  
	
	var words = ["apple", "banana", "carrot", "dog", "elephant", "fish", "guitar", "house", "ice cream", "jellyfish",
		"kangaroo", "lemon", "monkey", "notebook", "orange", "pizza", "queen", "rabbit", "strawberry", "turtle",
		"ant", "bird", "cat", "dragon", "elephant", "fox", "giraffe", "hedgehog", "insect", "jaguar",
		"koala", "lion", "mango", "noodle", "octopus", "panda", "quail", "raccoon", "snake", "tiger",
		"unicorn", "vampire", "whale", "xylophone", "yak", "zebra", "astronaut", "balloon", "cactus", "dolphin",
		"eagle", "fireworks", "globe", "honey", "igloo", "joker", "kite", "lighthouse", "moon", "ninja",
		"oasis", "penguin", "quill", "rainbow", "sailboat", "tornado", "umbrella", "volcano", "waterfall", "xylophone",
		"yacht", "zombie", "airplane", "beach", "candle", "desert", "elephant", "forest", "guitar", "horse",
		"island", "jungle", "kangaroo", "lake", "mountain", "night", "ocean", "palm", "queen", "river",
		"sunflower", "tree", "unicorn", "valley", "waterfall", "xylophone", "yoga", "zebra"];

	
	// Create the matrix and store game logic
	
	var game;
	var view;

	//instructions to display in h2 header
	var mainInstructions = "Search for the list of words inside the box and click-and-drag to select them!";

	setUpWordSearch();

	
	function setUpWordSearch() {

		var matrix = createMatrix(words);

		var listOfWords = matrix
		convertToUpperCase(listOfWords); 
		updateHeadings(mainInstructions);

		
		game = new WordSearchLogic(gameId, listOfWords.slice());
		game.setUpGame();
		view = new WordSearchView(game.getMatrix(), game.getListOfWords(), gameId, listId, instructionsId);
		view.setUpView();
		view.triggerMouseDrag();

	}

	//functions to shuffle
	function convertToUpperCase(wordList)  {

		for (var i = 0; i < wordList.length; i++) {

			for(var j = 0; j < wordList[i].length; j++) {

				wordList[i][j] = wordList[i][j].toUpperCase();

			}

		}

	}

	
	function updateHeadings(instructions) {

		$(instructionsId).text(instructions);

	}

	$(solveId).click(function() {

		view.solve(game.getWordLocations(), game.getMatrix());

	});

	$(newGameId).click(function() {

		//empties the game and list elements, as well as the h3 theme span element
		$(gameId).empty();
		$(listId).empty();
		$(themeId).empty();
		setUpWordSearch();

	})

}