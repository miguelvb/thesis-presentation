var levels = 10, 
  rect_width = rect_height = 50,
  rect_color = "#BFE5FF", //#246BB2", //"#CCEBFF",
  circle_r = 9,
  circle_color = "#008F47",
  rect_avalanche = "#CC4040",
  x_pos = 30, 
  y_padding_rects = 3, 
  new_circle_col = "#FF3333",
  new_c_opacity = 1,
  c_opacity = 0.8, 
  part_opacity = 0.8, 
  time_interval = 1000/4, 
  tot_width= 960, 
  bars_width = 800, 
  bars_height = 200, 
  transition_time  = time_interval /2, 
  transition_in = d3.min([50,transition_time]), 
  domain_log_min = 0.003, 
  efficient_time = false,
  draw_animation = true
  ; 

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = tot_width - margin.left - margin.right,
    height = (rect_height + y_padding_rects) * (levels +2) - margin.top - margin.bottom;
    height = 600; 

// audios: 
// audios, in the sounds object sound["3"] == bell-3-1.wav; 
var sounds = []; var nm_;

for (i = 1; i < 11; i++) { 
    nm_ = "./audio/bell-"+ i + ".mp3"; 
    sounds.push(new Audio(nm_));
}
var play_sounds = false; 

//var svg = d3.select("#minim").append("svg").append("rect").attr("fill", "#fff").attr("width", width).attr("height", height).attr("stroke","#D1E0E0"); 

var svg = d3.select("#minim").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  /*svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "white");
  */
  //svg.append("rect").attr("fill", "none").attr("width", width).attr("height", height).attr("stroke","#D1E0E0"); 


data = []; 
bar_data = [];
time_data = []; 

var d_levels = d3.range(0,levels); //console.log("levs", levels); 

d_levels.forEach(function(d){
  dd = {}; 
  dd.x = x_pos; 
  dd.width = rect_width; 
  dd.height = rect_height; 
  dd.color = rect_color; 
  dd.av_color = rect_avalanche; 
  dd.status = "empty";
  dd.level = d;
  dd.y = margin.bottom + (dd.level) * (dd.height + y_padding_rects);
  // data are the status, x, y, etc. of the "cells".
  data.push(dd); 
  // bar data: 
  // data to make the bars in the graphs, and the circles... 
  bar_data.push({
    x: dd.level + 1, 
    ny: 0,
    frequency: 1, // Math.random(),
    label: String(dd.level + 1)
  })
})

var get_y = function(d) { return height - rect_height - d.y;}; 

// the model :: 
svg.selectAll(".rects")
      .data(data)
    .enter().append("rect")
      .attr("class", "rects")
      .attr("x", function(d) { return d.x; })
      .attr("width", function(d) { return d.width; })
      .attr("height",  function(d) { return d.height; })
      .attr("y",  function(d) { return get_y(d); })
      .attr("stroke", "#fff")
      .attr("fill", rect_color)
      //.attr("opacity", function(d) { return d.level/levels;})
      .attr("opacity", part_opacity)
      .attr("id", function(d){ return "rect-" + d.level;})
      ;

svg.selectAll(".circles")
      .data(data)
    .enter().append("circle")
      .attr("r", circle_r)
      .attr("class", "particle")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("opacity", 0.0)
      .attr("fill", circle_color)
      .attr("cx",function(d){ return d.x + d.width/2;})
      .attr("cy",function(d){ return get_y(d) + rect_height/2 ;})
      .attr("id", function(d){ return "circle-" + d.level;})

      ;

// THE BARS /////////////////
var bar_margin = {top: 50, right: 20, bottom: 30, left: 200},
    bar_width = bars_width - bar_margin.left - bar_margin.right,
    bar_height = bars_height;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, bar_width], .1);

    //console.log("rband", x.rangeBand());

var xlog = d3.scale.log()
    .domain([1,levels])
    .range([30, bar_width]);

var x_scale = x; 

var y = d3.scale.linear()
    .range([bar_height, 0]);

var ylog = d3.scale.log()
    .domain([domain_log_min,1])
    .range([bar_height, 0]);

var xAxis = d3.svg.axis()
    .scale(x_scale)
    .orient("bottom")
    .innerTickSize(-bar_height)

var xlogAxis = d3.svg.axis()
    .scale(xlog)
    .orient("bottom")
    .innerTickSize(-bar_height)
    .tickFormat(function(d) {return d3.format(".1s")(d) });

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .innerTickSize(-bar_width)

var ylogAxis = d3.svg.axis()
    .scale(ylog)
    .orient("left")
    .innerTickSize(-bar_width)
    .ticks(10, ",.3f");
    //.tickValues([0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.]);

  x.domain(bar_data.map(function(d) { return d.x; }));
  //xp.domain(bar_data.map(function(d) { return d.x; }));
  //y.domain([0, d3.max(bar_data, function(d) { return d.frequency; })]);
  y.domain([0, 0.6]);


  barsg = svg.append("g")
  .attr("transform", "translate(" + bar_margin.left +"," + bar_margin.top + ")")


  barsg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + bar_height + ")")
      .call(xAxis)
    .append("text")
      .attr("y", 30)
      .attr("x", bar_width/2)
      .attr("dy", ".71em")
      .style({"text-anchor": "middle", "font-size": "14px"})
      .text("Size");

  barsg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -55)
      .attr("x", -bar_height/2)
      .attr("dy", ".71em")
      .style({"text-anchor": "middle", "font-size": "14px"})
      .text("Frequency");

  //console.log("rangeB: ", x.rangeBand())

  barsg.selectAll(".bar")
      .data(bar_data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("id", function(d){ return "bar-" + d.x })
      //.attr("x", function(d) { return x_scale(d.x) - x.rangeBand()/2.; })
      .attr("x", function(d) { return x_scale(d.x); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(0); })
      .attr("height", function(d) { return bar_height - y(0); })
      .attr("fill", rect_color)
      .attr("opacity", 0)
      ;

    bar_data.forEach(function(d){ d.frequency = 0.1; d.ny = 0;})
    //console.log("bar_data", bar_data);

// THE POINTS /////////////////
var  point_margin = {top: 300, right: 20, bottom: 30, left: 200},
     point_width =  bars_width -  point_margin.left -  point_margin.right,
     point_height =  bars_height;

    var xp = d3.scale.linear()
    .domain([1, levels])
    .range([x.rangeBand(), bar_width - x.rangeBand()]);

    var xpAxis = d3.svg.axis()
    .scale(xp)
    .orient("bottom");


   pointsg = svg.append("g")
    .attr("transform", "translate(" +  point_margin.left +"," +  point_margin.top + ")")

   pointsg.append("g")
      .attr("class", "x axis xpoint")
      .attr("transform", "translate(" + 0 + ", " +  point_height + ")")
      .call(xlogAxis)
    .append("text")
      .attr("y", 30)
      .attr("x",  point_width/2)
      .attr("dy", ".71em")
      .style({"text-anchor": "middle", "font-size": "14px"})
      .text("Size");

   pointsg.append("g")
      .attr("class", "y axis ypoint")
      .call(ylogAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -55)
      .attr("x", - point_height/2)
      .attr("dy", ".71em")
      .style({"text-anchor": "middle", "font-size": "14px"})
      .text("Frequency");

  //console.log("rangeB: ", x.rangeBand());
  //console.log("bd", bar_data);
  //bar_data.push( {x: 2.5, frequency: 0.8, ny: 2} ) ; 
  
   pointsg.selectAll(".point")
      .data(bar_data)
    .enter().append("circle")
      .attr("class", "point")
      .attr("id", function(d){ return "point-" + d.x })
      //.attr("uid", function(d){ console.log("pp: ", d)} )
      //.attr("cx", function(d) { return x(d.x) + x.rangeBand()/2; })
      .attr("cx", function(d) { return xlog(d.x); })
      .attr("r", 6)
      .attr("cy", function(d) { return ylog(domain_log_min / 100); })
      .attr("fill", rect_color)
      .attr("opacity", 1)
      ;

     bar_data.forEach(function(d){ d.frequency = 0; d.ny = 0;})


var intv; 
f_timer = function(time){ intv = setInterval(add_particle, time_interval); }; 
fu_timer = function(time){ 
  clearInterval(intv); 
  time_interval = time; 
  transition_time = time_interval /2; 
  intv = setInterval(add_particle, time);
  };

fu_timer_full_speed = function(time){ 
  clearInterval(intv); 
  time_interval = 6; 
  draw_animation = false; 
  transition_time = time_interval /2; 
  intv = setInterval(add_particle, time);
  };

function reset_data(){

  bar_data.forEach(function(d){
    d.frequency = 0, 
    d.ny = 0
  })

  data.forEach(function(d){
    d.status = "empty"
  })
  update(-1); 

  svg.selectAll(".rects")
  .attr("fill", rect_color); 

  svg.selectAll(".particle")
  .attr("opacity", 0); 


}

function add_particle(){ 

  // add to total time: 
  total_time += 1; 

  // the empty levels: we will hit one of those via random number: 
  empty_levels = []; 
  data.forEach(function(d){
    if(d.status == "empty") empty_levels.push(d.level); 
  })
  n_empty = empty_levels.length
  //console.log("empties:", n_empty, empty_levels);

  if(efficient_time){
    var rlev = Math.floor(Math.random() * n_empty);
    var lev = empty_levels[rlev]; 
  } else {
    var lev = Math.floor(Math.random() * levels);
  };
  

  // update data: 
  nfull = 0; 
  size = 0; 

  data.forEach(function(d){
    if(d.level == lev) d.status = "full";
    if(d.status == "full" && size == d.level) size += 1;  
    if(d.status == "full") nfull+=1; 

  })

  //console.log("level:", lev); 
  //console.log("quake size:", size); 


  if(draw_animation){

  //update circles and rectangles:  
    d3.select("#circle-" + lev)
      .transition()
      .duration(transition_in)
      .attr("opacity", new_c_opacity)
      .transition()
      .duration(transition_time)
      .attr("opacity", c_opacity);

    d3.select("#rect-" + lev)
      .transition()
      .duration(transition_in)
      .attr("opacity", new_c_opacity)
      .attr("fill", "#246BB2")
      .transition()
      .duration(transition_time)
      .attr("opacity",  part_opacity )
      .attr("fill", rect_color);

  }
  // if avalanche: 
  if(size > 0){

    //console.log("size", size);

    if(draw_animation){

      var bb = d3.select("#bar-" + size)
        //.transition()
        //.duration(0)
        .attr("fill", rect_avalanche)
        //.transition()
        //.duration(transition_time)
        //.attr("fill", rect_color)

      //console.log("bb", bb);

      d3.select("#point-" + size)
        .transition()
        .duration(0)
        .attr("fill", rect_avalanche)
        .transition()
        .duration(transition_time)
        .attr("fill", rect_color)

      // flash the rect in the time minim: 
      d3.select("#t2-rect")
        .transition()
        .duration(0)
        .attr("fill", rect_avalanche)
        .transition()
        .duration(transition_time)
        .attr("fill", rect_color)
    }


    data.forEach(function(d){

      if(d.level < size) {

        if(draw_animation){

          d3.selectAll("#circle-" + d.level)
            .transition()
            .duration(transition_in)
            .attr("opacity", new_c_opacity)
            .transition()
            .duration(transition_time * 3/2)
            .attr("opacity", 0);

          d3.selectAll("#rect-" + d.level)
            .transition()
            .duration(transition_in)
            .attr("fill", rect_avalanche)
            .transition()
            .duration(transition_time * 3/2)
            .attr("fill", rect_color);
        }

        d.status = "empty";
      }

    })

    update_quakes(size);
  }
  
};

function update_quakes(size){

  var idx = size - 1; 
  dd = bar_data[idx]; 
  dd.ny += 1; 
  var NN = 0; 
  bar_data.forEach(function(d){
    NN += d.ny;
  })   
  bar_data.forEach(function(d){
    d.frequency = d.ny / NN;
  })  

  //console.log("quake", size, bar_data); 
  // update the bars: 
  update(size); 
  if( size == levels) update_full_quake(); 

};

function update_full_quake(){}; 

function update(size){

  if(draw_animation){

    d3.selectAll(".bar")
      .data(bar_data)
      .attr("fill", function(d){ if(size == d.x) return rect_avalanche; else return rect_color;})
      .transition()
      .duration(transition_time * 3/2)
      .attr("height", function(d) { return bar_height - y(d.frequency); })
      .attr("y", function(d) { return y(d.frequency); })
      .attr("opacity", c_opacity)
      .attr("fill", rect_color)
      //.attr("tt", function(d){ console.log(d.x, d.frequency, y(d.frequency), bar_height);})

    d3.selectAll(".point")
      .data(bar_data)
      .attr("fill", function(d){ if(size == d.x) return rect_avalanche; else return rect_color;})
      .transition()
      .duration(transition_time * 3/2)
      .attr("cy", function(d) { 
        if(d.frequency < domain_log_min) return ylog(domain_log_min / 100); 
        return ylog(d.frequency); 
      })
      .attr("opacity", c_opacity)
      .attr("fill", rect_color)

  }

  minim_play(size); 
};

function minim_play(size){
  //console.log("Playing sound", size, play_sounds); 
  if(play_sounds){
    for (i = 0; i < sounds.length; i++) { 
      sounds[i].pause();
      sounds[i].currentTime = 0; 
      if( i == size - 1) sounds[i].play(); 
    }
  }
};

function toggleSounds(){
  play_sounds = !play_sounds; 

}

function eff_time(){
  efficient_time = !efficient_time; 

}

function draw_anim(){
  draw_animation = !draw_animation; 

}