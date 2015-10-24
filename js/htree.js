var cols = {
dred: "#A24555",
eblue: "#5D5DFB",
purgrey: "#998EA0"
}; 

var dlines = [
  {x1: 0, y1: 0, x2: 6, y2: 10 , level: 1, pos: 2},
  {x1: 6, y1: 10, x2: 9, y2: 15 , level: 2, pos: 4},
  {x1: 6, y1: 10, x2: 3, y2: 15 , level: 2, pos: 3},
  {x1: 0, y1: 0, x2: -6, y2: 10 , level: 1, pos: 1},
  {x1: -6, y1: 10, x2: -9, y2: 15 , level: 2, pos: 1},
  {x1: -6, y1: 10, x2: -3, y2: 15 , level: 2, pos: 2},
  {x1: 9, y1: 15, x2: 8, y2: 17 , level: 3, pos: 7},
  {x1: 9, y1: 15, x2: 10, y2: 17 , level: 3, pos: 8},
  {x1: 3, y1: 15, x2: 4, y2: 17 , level: 3, pos: 6},
  {x1: 3, y1: 15, x2: 2, y2: 17 , level: 3, pos: 5},
  {x1: -9, y1: 15, x2: -8, y2: 17 , level: 3, pos: 2},
  {x1: -9, y1: 15, x2: -10, y2: 17 , level: 3, pos: 1},
  {x1: -3, y1: 15, x2: -4, y2: 17 , level: 3, pos: 3},
  {x1: -3, y1: 15, x2: -2, y2: 17 , level: 3, pos: 4}
]; 

var width = 900, height = 800; 

var x = d3.scale.linear().domain([-15,15]).range([0, width])
var y = d3.scale.linear().domain([-5,25]).range([0,height])

var svg = d3.select("#htree").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")

  var line = svg.selectAll(".lines")
    .data(dlines)
    .enter()
    .append("line")

  line
    .attr("class", function(d) {return "lines " + "level-" + d.level })
    .attr("x1", function(d) {return x(d.x1); })  
    .attr("y1", function(d) {return y(d.y1); })  
    .attr("x2", function(d) {return x(d.x2); })    
    .attr("y2", function(d) {return y(d.y2); })
    .attr("id", function(d) { return "line-level-" + d.level + "-pos-" +  d.pos;})
    ;    