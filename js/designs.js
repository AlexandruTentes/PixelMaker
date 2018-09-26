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
	let fileNameInputClickCheck = false;
	let fileFormatInputClickCheck = false;
	let customFileName = "";
	let customFileFormat = "";
	let clearColor = "rgb(" + 
				$("#input_BgrdColR").val() + "," + 
				$("#input_BgrdColG").val() + "," + 
				$("#input_BgrdColB").val() + ")";
	let theCh = false;
	let hiddenMessPopCh = 0;
	//let ok = false;
			
	audio.volume = 0.1;
	
	$("#input_width").attr("max", maxWidthVal);
	$("#input_width").attr("value", "20");
	$("#input_height").attr("max", maxHeightVal);
	$("#input_height").attr("value", "20");
	getTable.css("overflow", "hidden");
	//getTable.css("background-color", clearColor);
	
	$("#backgroundColorChange > input").click(function(){
		theCh = true;
	});
	
	$("#backgroundColorChange").click(function(){
		if(!theCh){
			clearColor = "rgb(" + 
				$("#input_BgrdColR").val() + "," + 
				$("#input_BgrdColG").val() + "," + 
				$("#input_BgrdColB").val() + ")";
				$("#pixel_canvas > tr > td").css("background-color", clearColor);
			//ok = true;
		}else theCh = false;
	});
	
	$("#musicCh").click(function(){
		$( this ).toggleClass("checkingPress");
		
		if($( this ).hasClass("checkingPress")){
			$("#musicChText").text("ON");
			audio.play();
		}else{
			$("#musicChText").text("OFF");
			audio.pause();
		}
	});
	
	$("#hiddenMessage").click(function(){
		$("#hiddenMessage").css("display", "none");
	});
	
	$("#input_fileName").click(function(){
		fileNameInputClickCheck = true;
	});
	
	$("#input_fileFormat").click(function(){
		fileFormatInputClickCheck = true;
	});
	
	//looked online for this one, forgot the link to it tho :(
	$("#download").click(function(){
		if(grid !== ""){
			if(!fileNameInputClickCheck && !fileFormatInputClickCheck){
				customFileName = $("#input_fileName").val();
				customFileFormat = $("#input_fileFormat").val();
				html2canvas($("#pixel_canvas"), {
					onrendered: function(canvas){
						let saveAs = function(uri, filename){
							let link = document.createElement('a');
							
							if(typeof link.download === 'string'){
								document.body.appendChild(link);
								link.download = filename;
								link.href = uri;
								link.click();
								document.body.removeChild(link);
							}else{
								location.replace(uri);
							}
						}
						
						let img = canvas.toDataURL("image/png"),
							uri = img.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
							
						saveAs(uri, customFileName + '.' + customFileFormat);
					}
				});
			}else{
				fileNameInputClickCheck = false;
				fileFormatInputClickCheck = false;
			}
		}else{
			getTable.css("display", "none");
			hiddenMessPopCh = 1;
			hiddenMessageCheck();
		}
	});
	
	$("input[type=submit]").click(function(e){
		e.preventDefault();
		
		getWidth = $("#input_width").val();
		getHeight = $("#input_height").val();
		getColor = $("input[type=color]").val();
		
		if(getWidth <= maxWidthVal && getHeight <= maxHeightVal){
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
				$("#hiddenMessage > p").text("Try use a max width of " + maxWidthVal + " and a max height of " + maxHeightVal + "!");
				window.scrollTo(0, document.body.scrollHeight);
			}
		}
	});
	
	$("#toolbarOpt").click(function(){
		if($( this ).text() === "OFF"){
			$( this ).text("ON");
			$("#toolPoz").css("display", "block");
			$("#toolSecPoz").css("display", "block");
		}else{
			if($( this ).text() === "ON"){
				$( this ).text("OFF");
				$("#toolPoz").css("display", "none");
				$("#toolSecPoz").css("display", "none");
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
	
	$("#addingC").click(function(){
		if($("#input_width").val() < 55){
			$("#hiddenMessage").css("display", "none");
			if(getWidth){
				$("tr").append("<td style=\"background-color:" + clearColor + "\"></td>");
				
				$("#input_width").val(++getWidth);
				$("td").css("width", initialWidth);
			}else{
				hiddenMessPopCh = 1;
				hiddenMessageCheck();
			}
			
			if($("#borderCh").text() === "OFF"){
				$("table > tr > td").css ("border", "0")
			}
		}else{
			hiddenMessPopCh = 2;
			hiddenMessageCheck();
		}
	});
	
	$("#substractingC").click(function(){
		$("#hiddenMessage").css("display", "none");
		if(getWidth){
		if($("#input_width").val() > 1){
			$("#input_width").val(--getWidth);
			$("tr").find("td:eq(" + getWidth + ")").remove();
		}else{
			hiddenMessPopCh = 2;
			hiddenMessageCheck();
		}
		}else{
			hiddenMessPopCh = 1;
			hiddenMessageCheck();
		}
	});
	
	$("#addingR").click(function(){
		if($("#input_height").val() < 55){
			if(getHeight){
				$("#hiddenMessage").css("display", "none");
				let addRow = "<tr>";
				$("#input_height").val(++getHeight);
			
				for(let i = 0; i < $("#input_width").val(); i++){
					addRow += "<td style=\"background-color:" + clearColor + "\"></td>";
				}
				addRow += "</tr>"
				getTable.append(addRow);
				$("tr").css("height", initialHeight);
				$("#myCanvas").css("height", $(document).height());
			}else{
				hiddenMessPopCh = 1;
				hiddenMessageCheck();
			}
			if($("#borderCh").text() === "OFF"){
				$("table > tr > td").css ("border", "0")
			}
		}else{
			hiddenMessPopCh = 0;
			hiddenMessageCheck();
		}
	});
	
	$("#substractingR").click(function(){
		$("#hiddenMessage").css("display", "none");
		if(getHeight){
			if($("#input_height").val() > 1){
				$("#input_height").val(--getHeight);
				$("tr")[getHeight].remove();
				$("#myCanvas").css("height", $("#myCanvas").height() - $("tr").height());
				$("#canvas").css("height", $("#canvas").height() - $("tr").height());
			}else{
				hiddenMessPopCh = 0;
				hiddenMessageCheck();
			}
		}else{
			hiddenMessPopCh = 1;
			hiddenMessageCheck();
		}
	});
	
	$("#gridCheck").click(function(){
		$( this ).toggleClass("pressed");
		
		if($( this ).hasClass("pressed")){
			$("#borderCh").text("OFF");
			$("table > tr > td").css("border", "0px");
		}else{
			$("#borderCh").text("ON");
			$("table > tr > td").css("border", "1px solid black");
		}
	});
	
	$("input[type=color]").click(function(){
		$( this ).toggleClass("col", true);
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
					$( this ).css("background-color", clearColor);
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
				$( this ).css("background-color", getColor);
			}else{
				if(check && secCheck){
					if($( this ).attr("class") === "check"){
						$( this ).toggleClass("check", false);
						$( this ).css("background-color", clearColor);
					}
				}
			}
		}
	}, "td");
	
	function onReset(){
		getTable.css("display", "none");
		window.scrollTo(0, 0);
		$("#hiddenMessage").css("display", "none");
		$("td").remove();
		$("tr").remove();
		$("input[type=submit]").attr("value", "Submit");
		getWidth = undefined;
		getHeight = undefined;
		$("table").toggleClass("hasClass", false);
		$("table").toggleClass("hasSecondClass", true);
	}

	function colorChangeCheck(){
		if(getColor !== $("input[type=color]").val()){
			getColor = $("input[type=color]").val();
			$("input[type=color]").toggleClass("col", false);
		} 
		else
			$("input[type=color]").toggleClass("col", false);
	}
	
	function hiddenMessageCheck(){
		if(hiddenMessPopCh === 0){
			$("#hiddenMessage > p").text("You have reached the height limit!");
			$("#hiddenMessage").css("display", "block");
			window.scrollTo(0, document.body.scrollHeight);
		}else{
			if(hiddenMessPopCh === 1){
				$("#hiddenMessage > p").text("Create a grid first.");
				$("#hiddenMessage").css("display", "block");
				window.scrollTo(0, document.body.scrollHeight);
			}else{
				$("#hiddenMessage > p").text("You have reached the width limit!");
				$("#hiddenMessage").css("display", "block");
				window.scrollTo(0, document.body.scrollHeight);
			}
		}
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
		$("input[type=submit]").attr("value", "Reset");
		initialWidth = $("td").width();
		initialHeight = $("tr").height();
		$("table").toggleClass("hasClass", true);
		$("table").toggleClass("hasSecondClass", false);
	}
	
});
