var diceRoller = function(p){
	var curDice;
	var dotSize
	
	p.randRoll = function(){
		p.curDice = Math.ceil(Math.random() * 6);	
		return p.curDice
	}
	p.setup = function() { 
		p.randRoll()
		p.createCanvas(200,200);
		dotSize = p.width/8;
	}
	
	p.draw = function(){
		p.fill(255);
		//p.square(p.width/6,p.height/6,(4/6)*p.width, 20, 15, 10, 5);
		p.rect(p.width/6,p.height/6,(4/6)*p.width,(4/6)*p.height)
		p.fill(0);

		if (p.curDice == 1){
			p.ellipse(p.width/2,p.height/2,dotSize,dotSize);
		}else if (p.curDice == 2){
			p.ellipse(p.width/3,2*p.height/3,dotSize,dotSize);
			p.ellipse(2*p.width/3,p.height/3,dotSize,dotSize);
		}else if (p.curDice == 3){
			p.ellipse(p.width/3,2*p.height/3,dotSize,dotSize);
			p.ellipse(2*p.width/3,p.height/3,dotSize,dotSize);
			p.ellipse(p.width/2,p.height/2,dotSize,dotSize);
		}else if (p.curDice == 4){
			p.ellipse(p.width/3,2*p.height/3,dotSize,dotSize);
			p.ellipse(2*p.width/3,p.height/3,dotSize,dotSize);
			p.ellipse(p.width/3,p.height/3,dotSize,dotSize);
			p.ellipse(2*p.width/3,2*p.height/3,dotSize,dotSize);
		}else if (p.curDice == 5){
			p.ellipse(p.width/3,2*p.height/3,dotSize,dotSize);
			p.ellipse(2*p.width/3,p.height/3,dotSize,dotSize);
			p.ellipse(p.width/3,p.height/3,dotSize,dotSize);
			p.ellipse(2*p.width/3,2*p.height/3,dotSize,dotSize);
			p.ellipse(p.width/2,p.height/2,dotSize,dotSize);
		}else if (p.curDice == 6){
			p.ellipse(p.width/3,2*p.height/3,dotSize,dotSize);
			p.ellipse(2*p.width/3,p.height/3,dotSize,dotSize);
			p.ellipse(p.width/3,p.height/3,dotSize,dotSize);
			p.ellipse(2*p.width/3,2*p.height/3,dotSize,dotSize);
			p.ellipse(p.width/3,p.height/2,dotSize,dotSize);
			p.ellipse(2*p.width/3,p.height/2,dotSize,dotSize);
		} else { // Should never happen, but whatever
			p.ellipse(1.5*p.width/3,1.5*p.height/3,p.width/3,p.height/3);
		}
	}
	
	p.mousePressed = function(){
		p.randRoll();
	}
	
}


var p5_diceRoller = new p5(diceRoller,"diceRollerDiv");

var autoDiceSketch = function(p){
	
	var rolls;
	
	p.randRoll = function(){
		return Math.ceil(Math.random() * 6)
	}
	
	
	var plot;
	var rollPoints;
	var points;
	var autoRoll;
	
	
	p.setup = function() {
		p.rolls = [];
		p.points = [];
		p.rollPoints = [];
		p.autoRoll = false;

		
		  p.createCanvas(720,480);
		  
		  plot = new GPlot(this,0,0,p.width,p.height);
		  // plot.getXAxis().setAxisLabelText("x [a]");
		  // plot.getYAxis().setAxisLabelText("wave-function [a^0.5]");
		  //plot.setXLim(-1.5,1.5);
		  plot.setYLim(0,7);
	  
		  //par = p.createP();
		  
		  p.fill(0);
		  p.frameRate(30);
		  plot.setLineColor(p.color(150, 150, 150))
			plot.addLayer("layer 1", p.points);
			plot.getLayer("layer 1").setPointSize(0);
		  /* 
		  plot.addLayer("earth",earthPoint);
		  
		  plot.getLayer("earth").setPointColor(p.color(100, 255, 100));
		  plot.getLayer("earth").setPointSize(20);
		  
		  
		  plot.getMainLayer().setPointColor(p.color(100, 100, 100)); */
	  
	};
	p.draw = function() {
		//p.background(255);
		var plotTitle = "Click to start auto-roll";
		if (p.autoRoll) {
			plotTitle = "Click to pause and reset";
			if ((p.frameCount % 10) == 0){
				// Roll a random dice, and add to the rolls list
				p.rolls.push(p5_diceRoller.randRoll());
			}	
		}
		// Get the length
		len = p.rolls.length;
		
		// Initialize the sum
		var rollSum = 0;
		
		// Loop through all rools
		for(var i = 0;i<len;i++){
			var x = i;
		
			rollSum = rollSum + p.rolls[i];
			var y = rollSum/(i+1);
			
			// Add point to list for plotting
			p.points[i] = new GPoint(x,y);
			p.rollPoints[i] = new GPoint(x,p.rolls[i]);
		}
		//console.log(points[len-1])
		plot.setPoints(p.rollPoints);
		plot.getLayer("layer 1").setPoints(p.points)
		plot.getLayer("layer 1").setLineColor(p.color(0,0,0));
		plot.setTitleText(plotTitle);
		//plot.defaultDraw();
		
		plot.beginDraw();
		plot.drawBackground();
		plot.drawBox();
		plot.drawXAxis();
		plot.drawYAxis();
		plot.drawTopAxis();
		plot.drawRightAxis();
		plot.drawTitle();
		plot.getMainLayer().drawPoints();
		plot.getLayer("layer 1").drawLines();
		plot.endDraw();

	
	};
	
	p.resetRolls = function(){
		p.rolls = [];
		p.points = [];	
		p.rollPoints = [];		
	}
	p.mousePressed = function(){
		if (p.autoRoll == false){
			p.resetRolls();
			p.autoRoll = true;
		} else {
			p.autoRoll = false;
		}
	}
}
