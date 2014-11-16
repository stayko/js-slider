window.onload=function(){
	
	var rVal = 0;
	var gVal = 0;
	var bVal = 0;

	//'change' callback function can be passed in the configs object  
	var red = document.getElementById('r-channel');
	var rslider = new Slider(red, {minvalue: 0, maxvalue: 255, step: 1, change: function(val){
		document.getElementById('colour').style.backgroundColor = "rgb(" +val+ "," +gVal+"," +bVal+" )"; 
		rVal = val; 
	}});
	
	var green = document.getElementById('g-channel');
	var gslider = new Slider(green, {minvalue: 0, maxvalue: 255, step: 1, change: function(val){
		document.getElementById('colour').style.backgroundColor = "rgb(" +rVal+ "," +val+"," +bVal+" )"; 
		gVal = val; 
	}});


	var blue = document.getElementById('b-channel');	
	var bslider = new Slider(blue, {minvalue: 0, maxvalue: 255, step: 1});
	//OR you can also use the 'onchange' method to bind a callback function when slider moves 
	bslider.onchange( 
		function(val){
			document.getElementById('colour').style.backgroundColor = "rgb(" +rVal+ "," +gVal+"," +val+" )"; 
			bVal = val; 
		}
	);

	//default slider values
	rslider.setPercentage(0.35);
	gslider.setValue(128);
	bslider.setPercentage(0.65);

};