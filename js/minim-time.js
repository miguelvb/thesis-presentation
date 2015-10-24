var total_time = 0,
  last_big_quake_time = 0,
  n_times = 150, 
  time_point_w = 800,
  time_point_h = 500, 
  time_h = 400
  ; 


var svg_time = d3.select("#minim-time").append("svg")
    .attr("width", time_point_w + 100)
    .attr("height", time_point_h + 100)
  .append("g")
    .attr("transform", "translate(" + 100 + "," + 50 + ")");

var time_data = []; 

// time data: from n = 0 to n= 200... 
for (i = 0; i < n_times +1; i++) { 
    time_data.push(
      {
        x: i, 
        frequency: 0, 
        frequency_cum: 0,
        ny: 0, 
        cumy: 0
      }
    );
}

// 
//console.log("time_data", time_data);
//console.log("data", data);

var t1_data = data[0]; 
var t2_data = data[1];

var time_r_width = 30;  

//var time_point_h = 450; var time_point_w = 650; 

var y_time = d3.scale.linear()
  .range([time_point_h, 0]).domain([-1, 1]);

var ytimeAxis = d3.svg.axis()
  .scale(y_time)
  .orient("left")
  .innerTickSize(-time_point_w)
  .tickPadding(10); 

var xp_time = d3.scale.linear()
  .domain([0, n_times])
  .range([0, time_point_w]);

var xtimeAxis = d3.svg.axis()
  .scale(xp_time)
  .orient("bottom")
  .innerTickSize(-time_point_h)
  .tickPadding(10);

// points_time:: ///////////////////////////////////////////////////////////////////////////

var pointsg_time = svg_time.append("g")
  .attr("transform", "translate(" +  0 +"," +  0 + ")")

pointsg_time.append("g")
  .attr("class", "x axis xpoint-time")
  .attr("transform", "translate(" + 0 + ", " +  time_point_h + ")")
  .call(xtimeAxis)
.append("text")
  .attr("y", 35)
  .attr("x",  time_point_w/2)
  //.attr("dy", ".71em")
  .style({"text-anchor": "middle", "font-size": "14px"})
  .text("Return Time");

pointsg_time.append("g")
  .attr("class", "y axis ypoint-time")
  .call(ytimeAxis)
.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -60)
  .attr("x", - time_point_h/2)
  .attr("dy", ".71em")
  .style({"text-anchor": "middle", "font-size": "14px"})
  .text("Count");


pointsg_time.selectAll(".pointtime")
  .data(time_data)
.enter().append("circle")
  .attr("class", "pointtime")
  .attr("id", function(d){ return "point-time-" + d.x })
  .attr("cx", function(d) { return xp_time(d.x); })
  .attr("r", 3)
  .attr("cy", function(d) { return y_time(0); })
  .attr("fill", rect_color)
  .attr("opacity", 1)
  ;


// points_time_cumul:: ///////////////////////////////////////////////////////////////////////////

var y_time_cumul = d3.scale.linear()
  .range([time_point_h, 0]).domain([0, 1]);

var ytimeAxis_cumul = d3.svg.axis()
  .scale(y_time_cumul)
  .orient("left")
  .innerTickSize(-time_point_w)
  .tickPadding(10); 

var svg_time_cumul = d3.select("#minim-time-cumul").append("svg")
    .attr("width", time_point_w + 100)
    .attr("height", time_point_h + 100)
  .append("g")
    .attr("transform", "translate(" + 100 + "," + 50 + ")");


var pointsg_time_cumul = svg_time_cumul.append("g")
  .attr("transform", "translate(" +  0 +"," +  0 + ")")

pointsg_time_cumul.append("g")
  .attr("class", "x axis xpoint-time")
  .attr("transform", "translate(" + 0 + ", " +  time_point_h + ")")
  .call(xtimeAxis)
.append("text")
  .attr("y", 35)
  .attr("x",  time_point_w/2)
  //.attr("dy", ".71em")
  .style({"text-anchor": "middle", "font-size": "14px"})
  .text("Return Time");

pointsg_time_cumul.append("g")
  .attr("class", "y axis ypoint-time")
  .call(ytimeAxis_cumul)
.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -60)
  .attr("x", - time_point_h/2)
  .attr("dy", ".71em")
  .style({"text-anchor": "middle", "font-size": "14px"})
  .text("Cumulative Probability");


pointsg_time_cumul.selectAll(".pointtime-cumul")
  .data(time_data)
.enter().append("circle")
  .attr("class", "pointtime-cumul")
  .attr("id", function(d){ return "point-time-cumul" + d.x })
  .attr("cx", function(d) { return xp_time(d.x); })
  .attr("r", 3)
  .attr("cy", function(d) { return y_time_cumul(0); })
  .attr("fill", rect_color)
  .attr("opacity", 1)
  ;


function update_full_quake(){

  var interval_q = total_time - last_big_quake_time; 
  last_big_quake_time = total_time; 

  
  if(interval_q >= 0 && interval_q < n_times+1) {
    var td = time_data[interval_q]
    td.ny +=1; 
    //console.log("Quake", total_time, interval_q, td.ny); 
  }
  var Nt = 0; 
  // set the total: 
  time_data.forEach(function(d){
    Nt += d.ny;
    d.cumy = Nt; 
  });
  // set the freqs: 
  time_data.forEach(function(d){
    d.frequency = d.ny / Nt; 
    d.frequency_cum = d.cumy / Nt; 
  });

  //console.log("time_data", time_data);

  var time_max = d3.max(time_data, function(d){ return d.ny  * 1.1;}); 
  y_time.domain([-1, time_max]); 

  d3.select(".ypoint-time")
    .transition().duration(500)
    //.ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
    .call(ytimeAxis);  

  pointsg_time.selectAll(".pointtime")
    .data(time_data)
    .attr("fill", function(d){ if(interval_q == d.x) return rect_avalanche; else return rect_color;})
    .transition()
    .duration(transition_time * 3/2)
    .attr("cy", function(d) { 
      return y_time(d.ny); 
    })
    .attr("opacity", c_opacity)
    .attr("fill", rect_color)

  pointsg_time_cumul.selectAll(".pointtime-cumul")
    .data(time_data)
    .attr("fill", function(d){ if(interval_q == d.x) return rect_avalanche; else return rect_color;})
    .transition()
    .duration(transition_time * 3/2)
    .attr("cy", function(d) { 
      return y_time_cumul(d.frequency_cum); 
    })
    .attr("opacity", c_opacity)
    .attr("fill", rect_color)


}; 