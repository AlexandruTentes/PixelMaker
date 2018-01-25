// Select color input
// Select size input

// When size is submitted by the user, call makeGrid()
$( function(){

	$("#input_width").attr("max", "55");
	$("#input_width").attr("value", "20");
	$("#input_height").attr("max", "55");
	$("#input_height").attr("value", "20");
	
	const getTable = $("#pixel_canvas");
	let getWidth;
	let getHeight;
	let getColor;
	let count = 0;
	let grid = "";
	let check = false;
	let secCheck = false;
	const clearColor = "rgb(125, 115, 125)";
	
	getTable.css("background-color", clearColor)
	
	$("input[type=submit]").click(function(e){
		e.preventDefault();
		
		getWidth = $("#input_width").val();
		getHeight = $("#input_height").val();
		getColor = $("input[type=color]").val();
		
		makeGrid();
	});
	
	$("input[type=color]").click(function(){
		$( this ).toggleClass("col", true);
	});
	
	$("form").on("click", "a#backgrd", function(e){
		e.preventDefault();
		$("a#backgrd").toggleClass("clicked");

		if($("a#backgrd").hasClass("clicked")){
			$("a#backgrd").text("OFF");
		}
		else
			$("a#backgrd").text("ON");
	});
	
	$(document).on("mousedown", "td", function(e){
		e.preventDefault();	
		check = true;
	});
	
	$(document).on("mouseup", function(){
		check = false;
	});
	
	$(document).keydown(function(e){
		if(e.keyCode == 16) secCheck = true;
		
		if(e.keyCode == 17 && secCheck){
			$(getTable).children().children().css("background-color", clearColor);
		}
	});
	
	$(document).keyup(function(e){
		if(e.keyCode == 16) secCheck = false;
	});
	
	$("#pixel_canvas").on("click", "td", function(e){ 
		colorChangeCheck();
		
		if(secCheck){
			if($( this ).attr("class") === "check"){
				$( this ).toggleClass("check", false);
				$( this ).css("background-color", clearColor)
			}
		}
		else{
			$( this ).toggleClass("check", true);
			$( this ).css("background-color", getColor);
		}
	});
	
	$("#pixel_canvas").on("mousemove", "td", function(){
		colorChangeCheck();
		
		if(check && !secCheck){
			if($( this ).attr("class") !== "check"){
				$( this ).toggleClass("check", true);
			}
			$( this ).css("background-color", getColor)
		}else{
			if(check && secCheck){
				if($( this ).attr("class") === "check"){
					$( this ).toggleClass("check", false);
					$( this ).css("background-color", clearColor)
				}
			}
		}
	});
	
	function colorChangeCheck(){
		if(getColor !== $("input[type=color]").val()){
			getColor = $("input[type=color]").val();
			$("input[type=color]").toggleClass("col", false);
		} 
		else
			$("input[type=color]").toggleClass("col", false);
	}

	function makeGrid() {
		
		if($("input[type=submit]").attr("value") !== "Reset"){
		grid = "";
		
		for(let i = 0; i < getHeight; i++){
			grid += "<tr>";
			for(let j = 0; j < getWidth; j++){
				grid += "<td></td>";
			}
			grid += "</tr>"
		}
		
		getTable.prepend(grid);
		getTable.toggleClass("hasClass", true);
		getTable.toggleClass("hasSecondClass", false);
		getTable.toggleClass("hasThirdClass", true);
		$("input[type=submit]").attr("value", "Reset");
		}
		else{
			getTable.toggleClass("hasClass", false);
			getTable.toggleClass("hasSecondClass", true);
			getTable.toggleClass("hasThirdClass", false);
			$("td").remove();
			$("tr").remove();
			$("input[type=submit]").attr("value", "Submit");
		}
	}
	
});
