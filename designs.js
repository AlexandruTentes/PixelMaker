$( function(){
	
	window.scrollTo(0, 0);
	const getTable = $("#pixel_canvas");
	let maxHeightVal = 55;
	let maxWidthVal = 55;
	let audio = document.getElementById("myAudio");
	let initialWidth;
	let initialHeight;
	let getWidth;
	let getHeight;
	let getColor;
	let count = 0;
	let grid = "";
	let check = false;
	let secCheck = false;
	let thirdCheck = false;
	const clearColor = "rgb(125, 115, 125)";
	audio.volume = 0.1;
	
	$("#input_width").attr("max", maxWidthVal);
	$("#input_width").attr("value", "20");
	$("#input_height").attr("max", maxHeightVal);
	$("#input_height").attr("value", "20");
	getTable.css("overflow", "hidden");
	getTable.css("background-color", clearColor);
	
	$("#musicCh").click(function(){
		$( this ).toggleClass("checkingPress");
		
		if($( this ).hasClass("checkingPress")){
			$("#musicChText").text("OFF");
			audio.pause();
		}else{
			$("#musicChText").text("ON");
			audio.play();
		}
	});
	
	$("input[type=submit]").click(function(e){
		e.preventDefault();
		
		getWidth = $("#input_width").val();
		getHeight = $("#input_height").val();
		getColor = $("input[type=color]").val();
		
		if(getWidth < maxWidthVal && getHeight < maxHeightVal){
			$("#hiddenMessage").css("display", "none");

			if($("input[type=submit]").attr("value") !== "Reset"){
				getTable.css("display", "table");
				makeGrid();
				window.scrollTo(0, document.body.scrollHeight);
			}else onReset();
		}else{
			if($( this ).attr("value") === "Reset")
				onReset();
			else{
				getTable.css("display", "none");
				$("#hiddenMessage").css("display", "block");
				$("#hiddenMessage > p").text("Try use a max width of " + maxWidthVal + " and a max height of " + maxHeightVal);
				window.scrollTo(0, document.body.scrollHeight);
			}
		}
	});

	$("#addingS").click(function(){
		initialWidth += 1;
		initialHeight += 1;
		
		$("td").css("width", initialWidth);
		$("tr").css("height", initialHeight);
	});
	
	$("#substractingS").click(function(){
		initialWidth -= 1;
		initialHeight -= 1;
		
		$("td").css("width", initialWidth);
		$("tr").css("height", initialHeight);
	});
	
	$("#toolbarOpt").click(function(){
		if($( this ).text() === "OFF"){
			$( this ).text("ON");
			$("#toolPoz").css("display", "block")
		}else{
			if($( this ).text() === "ON"){
				$( this ).text("OFF");
				$("#toolPoz").css("display", "none");
			}
		}
	});
	
	$("#addingC").click(function(){
		if(getWidth){
			$("tr").append("<td></td>");
		
			$("#input_width").attr("value", ++getWidth);
			$("td").css("width", initialWidth);
		}else{
			$("#hiddenMessage > p").text("Create a grid first");
			$("#hiddenMessage").css("display", "block");
			window.scrollTo(0, document.body.scrollHeight);
		}
		
		if($("#borderCh").text() === "OFF"){
			$("table > tr > td").css ("border", "0")
		}
	});
	
	$("#substractingC").click(function(){
		if($("#input_width").val() > 1 && getWidth){
			$("#input_width").attr("value", --getWidth);
			$("tr").find("td:eq(" + getWidth + ")").remove();
		}
	});
	
	$("#addingR").click(function(){
		if(getHeight){
			let addRow = "<tr>";
			$("#input_height").attr("value", ++getHeight);
		
			for(let i = 0; i < $("#input_width").val(); i++){
				addRow += "<td></td>";
			}
			addRow += "</tr>"
			getTable.append(addRow);
			$("tr").css("height", initialHeight);
		}else{
			$("#hiddenMessage > p").text("Create a grid first");
			$("#hiddenMessage").css("display", "block");
			window.scrollTo(0, document.body.scrollHeight);
		}
		if($("#borderCh").text() === "OFF"){
			$("table > tr > td").css ("border", "0")
		}
	});
	
	$("#substractingR").click(function(){
		if($("#input_height").val() > 1 && getHeight){
			$("#input_height").attr("value", --getHeight);
			$("tr")[getHeight].remove();
		}
	});
	
	$("#gridCheck").click(function(){
		$( this ).toggleClass("pressed");
		
		if($( this ).hasClass("pressed")){
			$("#borderCh").text("OFF");
			$("table > tr > td").css("border", "0");
		}
		else{
			$("#borderCh").text("ON");
			$("table > tr > td").css("border", "1px solid black");
		}
	});
	
	$("input[type=color]").click(function(){
		$( this ).toggleClass("col", true);
	});
	
	$("#toolPoz").on("click", "#backgrd", function(e){
		e.preventDefault();
		
		$("#backgrd").toggleClass("clicked");

		if($("#backgrd").hasClass("clicked")){
			$("#backgrdText").text("OFF");
		}
		else
			$("#backgrdText").text("ON");
	});
	
	$(document).on("mousedown", "td", function(e){
		e.preventDefault();	
		check = true;
	});
	
	$(document).on({
		"mouseup" : function(e){
		check = false;
		},
		"keydown" : function(e){
			if(e.keyCode == 16) secCheck = true;
			if(e.keyCode === 81) thirdCheck = true;
		
			if(e.keyCode == 17 && secCheck)
				$(getTable).children().children().css("background-color", clearColor);
			
			if(secCheck && thirdCheck){
				$("#toolbarOpt").trigger("click");
			}
		},
		"keyup" : function(e){
			if(e.keyCode == 16) secCheck = false;
			if(e.keyCode == 81) thirdCheck = false;
		}
	});
	
	$("#pixel_canvas").on({
		"click" : function(e){ 
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
		},
		"mousemove" : function(e){
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
		}
	}, "td");
	
	function onReset(){
		getTable.css("display", "none");
		window.scrollTo(0, 0);
		$("#hiddenMessage").css("display", "none");
		getTable.toggleClass("hasClass", false);
		getTable.toggleClass("hasSecondClass", true);
		getTable.toggleClass("hasThirdClass", false);
		$("td").remove();
		$("tr").remove();
		$("input[type=submit]").attr("value", "Submit");
		getWidth = undefined;
		getHeight = undefined;
	}

	function colorChangeCheck(){
		if(getColor !== $("input[type=color]").val()){
			getColor = $("input[type=color]").val();
			$("input[type=color]").toggleClass("col", false);
		} 
		else
			$("input[type=color]").toggleClass("col", false);
	}

	function makeGrid() {
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
		initialWidth = $("td").width();
		initialHeight = $("tr").height();
	}
	
});
