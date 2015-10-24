// SETUP ////////////////////////////////////////////////////////////////////////////

var occ_total_time = 0,
    time_point_w = 800,
    time_point_h = 500
    occ_data = [], 
    occ_window_interval = 400;


// SVG ////////////////////////////////////////////////////////////////////////////
var svg_occ = d3.select("#minim-occupation").append("svg")
    .attr("width", time_point_w + 100)
    .attr("height", time_point_h + 100)
  .append("g")
    .attr("transform", "translate(" + 100 + "," + 50 + ")");

// DATA ////////////////////////////////////////////////////////////////////////////


var y_occ = d3.scale.linear()
  .range([time_point_h, 0]).domain([0, levels]);

var yoccAxis = d3.svg.axis()
  .scale(y_occ)
  .orient("left")
  .innerTickSize(-time_point_w)
  .tickPadding(10); 

var xp_occ = d3.scale.linear()
  .domain([0, 10])
  .range([0, time_point_w]);

var xoccAxis = d3.svg.axis()
  .scale(xp_occ)
  .orient("bottom")
  .innerTickSize(-time_point_h)
  .tickPadding(10);

// POINTS :: ///////////////////////////////////////////////////////////////////////////



svg_occ.append("g")
  .attr("class", "x axis xpoint-occ")
  .attr("transform", "translate(" + 0 + ", " +  time_point_h + ")")
  .call(xoccAxis)
.append("text")
  .attr("y", 35)
  .attr("x",  time_point_w/2)
  //.attr("dy", ".71em")
  .style({"text-anchor": "middle", "font-size": "14px"})
  .text("Time");

svg_occ.append("g")
  .attr("class", "y axis ypoint-occ")
  .call(yoccAxis)
.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -60)
  .attr("x", - time_point_h/2)
  .attr("dy", ".71em")
  .style({"text-anchor": "middle", "font-size": "14px"})
  .text("occupation");

  // LINES ////////////////////////////////////////////////////////////////////////

var line = d3.svg.area()
    .x(function(d) { return xp_occ(d.x); })
    .y1(function(d) { return y_occ(d.y); })
    .y0(time_point_h);


function update_minim_full_levels(nfull){

  occ_total_time += 1; 
  occ_data.push({x: occ_total_time, y: nfull}); 

  console.log("occ_time", occ_total_time);

    // enter any new lines
  if(occ_total_time == 1){

    var lines = svg_occ.selectAll(".occ-line").data(occ_data).attr("class","occ-line");
     // enter any new lines
    lines.enter()
      .append("path")
      .attr("class","occ-line")
      .attr("d",line(occ_data))
      ;
  }
  
    if(occ_data.length > occ_window_interval) occ_data.splice(0,1);

    xp_occ.domain(d3.extent(occ_data, function(d) { return d.x; }));

  if(draw_animation){
    d3.select(".xpoint-occ")
      .transition().duration(50)
      .call(xoccAxis);  

    svg_occ.select(".occ-line").datum(occ_data).attr("class", "occ-line")  // change the line
        .transition().duration(50)
        .attr("d", line);
  }



}; 