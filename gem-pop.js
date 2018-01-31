$(document).ready(()=> {
	let lives = 15;
	let goal = 5000;
	let level = 1;
	let gameState = {
		previous: {
			gem: null,
			x: null,
			y: null,
			color: null
		},
		current: {
			gem: null,
			x: null,
			y: null,
			color: null
		},
		color: [],
		match: [],
		gemsToPop: [],
		score: 0,
		points: {
			"3": 0,
			"4": 0,
			"5": 0,
		},
		hover: [],
		moves: lives,
		goal: goal,
		level: level,
	}
	
	const colors = [
	"red-gem", 
	"green-gem", 
	"blue-gem",
	"orange-gem",
	"yellow-gem", 
	"purple-gem", 
	"pink-gem",
	"teal-gem"
	];
	const col = 8;
	const row = 7;
	let height = window.innerHeight*0.75;
	let width = height*0.875;
	if(window.innerWidth < width+20) resizeGame();
	function resizeGame(){
		height = window.innerWidth;
		width = height*0.875;
	}
	initState();
	function initGemPop(){
		for(let i = 0; i < row; i++){
			let row = $(document.createElement("div"))
			.addClass("row")
			.css({
				"width": width+"px",
				"height": width/8+"px"
			});
			$(".gem-pop-container")
			.css("width", width+"px")
			.append(row);
			for(let j = 0; j < col; j++){
				let div = $(document.createElement("div"))
				.addClass(gameState.color[i][j])
				.attr("id", i+"-"+j)
				.css({
					"width": width/col+"px",
					"background-size": width/col+"px "+width/col+"px"
				})
				.click(function(){ moveGem(this,i,j)})
				row.append(div);
			}
		}

		$(".moves").html(gameState.moves);
		updateMatches()
		popMatches(true)
	}
	function initState(){
		for(let i = 0; i < row; i++){
			gameState.color.push([])
			gameState.match.push([])
			for(let j = 0; j < col; j++){
				gameState.color[i].push(colors[Math.floor(Math.random()*7)])
				gameState.match[i].push({row: 1, col: 1, color: gameState.color[i][j]});
			}
		}

		

		initGemPop();
	}
	function freeze(){
		console.log(gameState)
		gameState.match.map((row,i) => {
			row.map( (gem, j) => {
				$("#"+i+"-"+j).unbind("click");
			})
		})
	}
	function moveGem(item, x,y){
		let gem = $(item);
		gameState.current.gem = gem;
		gameState.current.x = x;
		gameState.current.y = y;
		gameState.current.color = gameState.match[gameState.current.x][gameState.current.y].color;

		selected(x,y);
	}
	function addHoverClass(x,y){
		

		for(let i = 0; i < 8; i++){
			if(i !== x){
				let gem = $("#"+i+"-"+y);
				gameState.hover.push(gem);
			}
		}
		for(let j = 0; j < 8; j++){
			if(j !== y){
				let gem = $("#"+x+"-"+j);
				gameState.hover.push(gem);
			}
		}
		gameState.hover.map(div => {
			$(div).hover(
				function(){
					let x = $(this).attr("id")[0];
					let y = $(this).attr("id")[2];

					checkMove(x,y);
				}, function(){
					let x = $(this).attr("id")[0];
					let y = $(this).attr("id")[2];
					undoMove(x,y)
				});
		})
		

	}
	function checkMove(i,j){
		
		let x = gameState.previous.x;
		let y = gameState.previous.y;
		let gem = $("#"+i+"-"+j);
		let moveHorizontal = Boolean(x === Number(i));
		let moveVertical = Boolean(y === Number(j));
		if(moveHorizontal){
			if(y > j){
				for(y; y > j; y--){
					shiftGems(i,j,x,y,0,-1)
				}
			}
			if(y < j){
				for(y; y < j; y++){
					shiftGems(i,j,x,y,0,1)
				}
			}
		}
		if(moveVertical){
			if(x > i){
				for(x; x > i; x--){
					shiftGems(i,j,x,y,-1,0)
				}
			}
			if(x < i){
				for(x; x < i; x++){
					shiftGems(i,j,x,y,1,0)
				}
			}
		}
		gem
		.removeClass(gem.attr("class"))
		.addClass("selected-"+gameState.previous.color);

		function shiftGems(i,j,x,y,vertical,horizontal){
			let gemCurrent = $("#"+x+"-"+y);
			let gemNext = $("#"+(x+vertical)+"-"+(y+horizontal));


			
			gemCurrent
			.removeClass(gemCurrent.attr("class"))
			.addClass(gemNext.attr("class"))
		}

		
	}
	function uncheckMove(i,j){

		let x = gameState.current.x;
		let y = gameState.current.y;
		let gem = $("#"+i+"-"+j);
		let moveHorizontal = Boolean(x === Number(i));
		let moveVertical = Boolean(y === Number(j));
		if(moveHorizontal){
			if(y > j){
				for(y; y > j; y--){
					shiftGems(i,j,x,y,0,-1)
				}
			}
			if(y < j){
				for(y; y < j; y++){
					shiftGems(i,j,x,y,0,1)
				}
			}
		}
		if(moveVertical){
			if(x > i){
				for(x; x > i; x--){
					shiftGems(i,j,x,y,-1,0)
				}
			}
			if(x < i){
				for(x; x < i; x++){
					shiftGems(i,j,x,y,1,0)
				}
			}
		}
		gem
		.removeClass(gem.attr("class"))
		.addClass("selected-"+gameState.previous.color);

		function shiftGems(i,j,x,y,vertical,horizontal){
			let gemCurrent = $("#"+x+"-"+y);
			let gemNext = $("#"+(x+vertical)+"-"+(y+horizontal));


			
			gemCurrent
			.removeClass(gemCurrent.attr("class"))
			.addClass(gemNext.attr("class"))
		}

	}



	function undoMove(i,j, bool){
		for(let k = 0; k < 7; k++){
			let gem = $("#"+k+"-"+j);
			gem
			.removeClass(gem.attr("class"))
			.addClass(gameState.match[k][j].color);




		}
		
		for(let l = 0; l < 7; l++){
			let newGem = $("#"+i+"-"+l);
			newGem
			.removeClass(newGem.attr("class"))
			.addClass(gameState.match[i][l].color);
		}
		let gem = $("#"+i+"-"+j)

		
	}

	function selected(x,y){
		gameState.current.gem.addClass("selected-"+gameState.match[gameState.current.x][gameState.current.y].color)
		if(gameState.previous.gem){
			
			removeHover(x,y);

			if(resultInMatch()){ 
				console.log("match")

				
				succesfulMove()
				//swapGems()
			}else{
				console.log("undo")
				uncheckMove(gameState.previous.x, gameState.previous.y)
				gameState.previous.gem
				.removeClass("selected-"+gameState.previous.color)
				.addClass(gameState.previous.color)
				
				
			}
			clearSelection(x,y);

		}else{
			addHoverClass(x,y);
			gameState.previous.gem = gameState.current.gem;
			gameState.previous.x = gameState.current.x;
			gameState.previous.y = gameState.current.y;
			gameState.previous.color = gameState.current.color;
		}
		
	}

	function checkGems(){
		let checkLines = Boolean((
			gameState.previous.x === gameState.current.x || 
			gameState.previous.y === gameState.current.y) && (
			gameState.previous.y !== gameState.current.y || 
			gameState.previous.x !== gameState.current.x))


		if(checkLines && resultInMatch()){
			console.log("checks out")
			return true;
		}else{
			return false;
		}

	}
	function resultInMatch(){
		
		updateColor();
		updateMatches();
		console.log(gameState.match);
		if(checkIfMatch()){
			return true
		};
		return false;
		function checkIfMatch(){
			let bool = false;
			gameState.match.map((row, i) => { 
				row.map((gem, j) => {

					if(gem.row > 2|| gem.col > 2) {
						//console.log("true")
						bool = true;
					};
				})
			})
			if(bool) {
				return true
			}else{
				return false
			}
		}
		/*
		let i = gameState.current.x;
		let j = gameState.current.y;
		let match = gameState.match;
		let checkAbove = i ? checkMatch(match[i-1][j]) :   false;
		let checkBelow = i<6 ? checkMatch(match[i+1][j]) : false;
		let checkLeft  =  j ? checkMatch(match[i][j-1]) :  false;
		let checkRight = j<7 ? checkMatch(match[i][j+1]) : false;

		let checkHorizontal = (j<7&&j) ? checkMatch(match[i][j], match[i][j-1],match[i][j+1]) : false;
		let checkVertical = (i<6&&i) ? checkMatch(match[i][j], match[i-1][j], match[i+1][j]) : false;
		if(
			checkAbove||
			checkBelow||
			checkLeft ||
			checkRight){
			return true;
	}
	if(checkHorizontal || checkVertical){
		return true;
	}
	return false;

	function checkMatch(match, oneSide, otherSide){

		if ((match.col > 1 || match.row > 1) && match.color === gameState.previous.color){
			
			return true
		}
		if(otherSide){
			if(match.color === oneSide.color && match.color === otherSide.color){
				
				return true;
			}}
			return false


		}*/
	}

	
	function updateMatches(){
		gameState.match.map((row, i)=>{
			row.map((obj, j) => {
				obj.col = 1;
				obj.row = 1;
				if(i ? obj.color === gameState.match[i-1][j].color : false){
					incMatch(i,j,-1,0);
				}
				if(j ? obj.color === row[j-1].color : false){
					incMatch(i,j,0,-1);
				}

			})
		})

		//console.log(gameState.match)
	}
	function incMatch(i,j,incI,incJ){
		if(incI){
			let add = gameState.match[i-1][j].col +1;
			for(let c = 0; c < gameState.match[i][j].col; c++){
				gameState.match[i-c][j].col = add;
			}
		}
		if(incJ){
			let add = gameState.match[i][j-1].row +1;
			for(let c = 0; c < gameState.match[i][j].row; c++){
				gameState.match[i][j-c].row  = add;
			}
		}
	}

	function swapGems(){

		let curX = gameState.current.x;
		let curY = gameState.current.y
		let prevX = gameState.previous.x;
		let prevY = gameState.previous.y;
		gameState.current.gem.removeClass(gameState.current.color);
		gameState.previous.gem.removeClass(gameState.previous.color);

		

		gameState.match.map((row, i) => {
			row.map((gem, j) => {
				let error = gem.color.split(" ");
				if(error[1]){
				}
			})
		})



		let temp = gameState.match[curX][curY].color;
		gameState.match[curX][curY].color = gameState.match[prevX][prevY].color;
		gameState.match[prevX][prevY].color = temp;
		clearSelection();

	}
	function clearSelection(x,y){
		gameState.current.gem.removeClass("selected-"+gameState.current.color)
		console.log(gameState.previous.gem)

		console.log(gameState.previous.gem)
		gameState.previous.gem = null;
		gameState.previous.x = null;
		gameState.previous.y = null;
		gameState.previous.color = null;
		gameState.current.gem = null;
		gameState.current.x = null;
		gameState.current.y = null;
		gameState.current.color = null;

		updateColor();

		popMatches();
	}
	function updateColor(){

		gameState.match.map((row, i) => {
			row.map((gem,j) => {
				gem.color = $("#"+i+"-"+j).attr("class");
			})
		})
		

	}
	//popMatches()
	function popMatches(first){
		updateMatches()
		let gemsPopped = false;
		gameState.match.map((row, i) => {
			row.map((item, j)=>{
				if(item.row > 2 || item.col > 2){
					popGems(i,j)
					gemsPopped = true;
					if(!first)addMatch(item.row, item.col);
				}
			})
		})
		if(gemsPopped) setTimeout(() => popMatches(), 800);
	}

	function popGems(i,j){
		for(i; i >= 0; i--){
			let gem = $("#"+i+"-"+j);
			if(i > 0){
				
				let gemAbove = $("#"+(i-1)+"-"+j);
				gem
				.removeClass(gem.attr("class"))
				.addClass(gemAbove.attr("class"));


			}else{
				gem
				.removeClass(gem.attr("class"))
				.addClass(colors[Math.floor(Math.random()*7)])
			}
			gameState.match[i][j].color = gem.attr("class");

		}

	}


	


	function addMatch(rowMatch, colMatch){
		let matches = (rowMatch !== colMatch) ? 
		Math.max(rowMatch, colMatch) : 
		rowMatch + colMatch;

		switch(matches){
			case 3:
			gameState.points[3]++;
			if(gameState.points[3] === 3){
				gameState.points[3] = 0;
				addScore(100, matches);
			}
			break;
			case 4:
			gameState.points[4]++;
			if(gameState.points[4] === 4){
				gameState.points[4] = 0;
				addScore(300, matches);
			}
			break;
			case 5:
			gameState.points[5]++;
			if(gameState.points[5] === 5){
				gameState.points[5] = 0;
				addScore(1000, matches);
			}
			break;
			case 6:
			addScore(1500, matches);
			break;
		}

		let scoreBar = $(".score-bar");
		scoreBar
		.css("width", ((gameState.score/gameState.goal) * 100) + "%");

		$(".gem-score")
		.html(gameState.score)
		


	}
	function addScore(points, match){
		points = points/match;
		totalPoints = 0;
		for(let i = 0; i < match; i++){
			totalPoints +=  points;
		}
		gameState.score += Math.round(totalPoints) 
		checkVictory();
	}
	function checkVictory(){
		if(gameState.score >= gameState.goal){
			goal = Math.round(goal*1.8);
			lives += gameState.moves;
			level++;
			resetGame();
		}
	}
	function succesfulMove(){
		gameState.moves--;
		$(".moves")
		.html(gameState.moves)
		.css("color", "hsl("+(111/lives)*gameState.moves+", 42%, "+63+"%)");

		if(gameState.moves === 0) lost();

	}
	function lost(){

		$(".lost-container").css("display", "block");
		$(".gem-pop-container").css("cursor", "auto");
		freeze();
	}
	function resetGame(){
		gameState = {
			previous: {
				gem: null,
				x: null,
				y: null,
				color: null
			},
			current: {
				gem: null,
				x: null,
				y: null,
				color: null
			},
			color: [],
			match: [],
			gemsToPop: [],
			score: 0,
			points: {
				"3": 0,
				"4": 0,
				"5": 0,
			},
			hover: [],
			moves: lives,
			goal: goal,
			level: level,
		}
		let moves = $(".moves")
		$(".gem-pop-container")
		.empty()
		.append(moves);
		initState();
	}

	function removeHover(x,y){
		gameState.hover.map(div => {
			div.unbind("mouseenter mouseleave");
		});
		gameState.hover = [];

		$("#"+x+"-"+y).removeClass($("#"+x+"-"+y).attr("class")).addClass(gameState.previous.color);
	}
	$(".pop").click(()=> {
		//popMatches()
		lost();
	})
	$(".reset-game").click(()=> {
		$(".lost-container").css("display", "none");
		resetGame();
	})
	
})
