

var testSketch = function(p){
	var asdf;
	
	p.setup = function() {
	p.createCanvas(400, 400);
	p.asdf = 534;
} 

	p.draw = function() {
	  p.background(150);
	  p.point(30,30);
}

}

//var myp5 = new p5(testSketch, 'c1');
var myp5 = new p5(testSketch, document.getElementById('testDiv'));