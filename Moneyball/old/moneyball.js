function createChart(dataset, svg_container, svg_class_name, g_class_name, dataAxis){

//Width and height
var margin = {top: 0, right: 0, bottom: 0, left: 0},
    xAxisHeight = 34;
    yAxisWidth = 55,
    width = 360 - margin.left - margin.right ,
    height = 550 - margin.top - margin.bottom ;

//create group key using nest.key
var nest = d3.nest()
    .key(function(d) { return d.group; });
var nestIndex = d3.nest()
    .key(function(d) { return d.index; });

var indexArray = [];
for (var i = 0; i < dataset.length; i++) {
    indexArray.push(dataset[i].index);
}


//Set up stack layout and its methods
var stack = d3.layout.stack()
    .values(function(d) { return d.values; }) //specifies how to read each "row" a.k.a. accessor function
    .x(function(d) { return d.index; }) //specify how to access the x-coordinate of each value's position
    .y(function(d) { return d.value; })
    .out(function(d, y0) { d.valueOffset = y0; });
;

//Create stacked data
var dataByGroup = nest.entries(dataset);
stack(dataByGroup);

//Set up scales
var xScale = d3.scale.ordinal()
    .domain(dataByGroup[0].values.map(function(d) { return d.index; })) 
    .rangeRoundBands([0, width-yAxisWidth], 0.15);
var y0 = d3.scale.ordinal()
    .domain(dataByGroup.map(function(d) {return d.key; }))
    .rangeRoundBands([ height,0], .25);
var y1 = d3.scale.linear()
    .domain([0, d3.max(dataAxis, function(d) {return d.value;})])
    .range([y0.rangeBand(),0]);

var valueByIndex = dataset.reduce(function(previous, current){
    previous[current.index-getMinOfArray(indexArray)] += current.value;
    return previous;
},createZeroArray(nestIndex.entries(dataset).length));
var valueHeightByIndex = dataset.reduce(function(previous, current){
    previous[current.index-getMinOfArray(indexArray)] += (y0.rangeBand() - y1(current.value));
    return previous;
},createZeroArray(nestIndex.entries(dataset).length));
var y2 = d3.scale.linear()
    .domain([0,getMaxOfArray(valueByIndex)])
    .range([getMaxOfArray(valueHeightByIndex),0]);



//xAxis format
var formatNumber = d3.format(",.3s");
var formatCurrency = function(d) {return "$" + formatNumber(d);}; 
var xAxisFormat = d3.svg.axis().scale(xScale)
    .orient("bottom");
var yAxisSeparatedFormat = d3.svg.axis()
    .scale(y1)
    .orient("left")
    .tickFormat(function(d) {return formatCurrency(d);})
    .ticks(5);
var yAxisStackedFormat = d3.svg.axis()
    .scale(y2)
    .orient("left")
    .tickFormat(function(d) {return formatCurrency(d);})
    .ticks(10);

//Easy colors accessible via a 10-step ordinal scale
var colors = d3.scale.category10();

//Create SVG element
var svg = d3.select(svg_container)
            .append("svg")
            .attr("class", svg_class_name)
            .attr("width", width)
            .attr("height", height);

// Add a group for each row of data
var groups = svg.selectAll("g")
    .data(dataByGroup)
    .enter().append("g")
    .attr("class", g_class_name)
    .attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; })
    .style("fill", function(d, i) {return colors(i);})
    .style("stroke", function(d, i) {return colors(i);})
    ;


// Add a rect for each data value
var rects = groups.selectAll("rect")
    .data(function(d) { return d.values; })
    .enter().append("rect")
    .attr("x", function(d, i) { return xScale(d.index)+yAxisWidth; })
    .attr("y", function(d) { return (y1(d.value)); })
    .attr("height", function(d) { return y0.rangeBand() - y1(d.value); })
    .attr("width", xScale.rangeBand())
    .style("fill",function(d,i){ return gradientColorGreenToRed(d.war); })
    //.style("stroke", function(d, i) {console.log(d.value);})
    .style("stroke-width","3")
    ;

//add xAxis to show year
var xAxis = groups.filter(function(d, i) { return !i; })
    .append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(" + yAxisWidth +"," + (y0.rangeBand()) + ")")
    .style("stroke-width","1")
    .style("stroke","none")
    .call(xAxisFormat);

var yAxisSeparated = groups.append("g")
    .attr("class", "yAxisSeparated")
    .attr("transform", "translate(" + yAxisWidth +","+ (-1) +")")
    .style("stroke-width","1")
    .style("stroke","none")
    .call(yAxisSeparatedFormat);
    
var yAxisStacked = groups.filter(function(d, i) { return !i; })
    .append("g")
    .attr("class", "yAxisStacked")
    .attr("transform", "translate(" + yAxisWidth +"," + (-y0(y0.domain()[0])+height-getMaxOfArray(valueHeightByIndex)-xAxisHeight) + ")")
    .attr("opacity","0")
    .style("stroke-width","1")
    .style("stroke","none")
    .call(yAxisStackedFormat);

var labels= groups.append("text")
    .attr("class", "group-label") 
    .attr("transform", "translate(" + (width/2+yAxisWidth) +","+ 0 +")")
    .text(function(d) { return d.key; })
    .style("stroke-width","0");


d3.selectAll("." + svg_class_name).on("click", changeView);

function changeView(){
    if ($("g."+g_class_name)[0].attributes[1].value ===$("g."+g_class_name)[1].attributes[1].value) transitionSeparated();
    else transitionStacked();
}

function transitionSeparated() {
var t = svg.transition().duration(750),
    g = t.selectAll("."+g_class_name).attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });
    g.selectAll("rect")
        .attr("y", function(d) { return (y1(d.value)); })
        .style("stroke-width","3")
        .style("fill",function(d,i){ return gradientColorGreenToRed(d.war); });
    g.selectAll(".yAxisSeparated").attr("opacity","1");
    g.selectAll(".group-label").attr("opacity","1");
    t.selectAll(".yAxisStacked").attr("opacity","0");
}
function transitionStacked() {
var t = svg.transition().duration(750),
    g = t.selectAll("."+g_class_name).attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
    g.selectAll("rect")
        .attr("y", function(d) { return y1(d.value + d.valueOffset);  })
        .style("stroke-width","0")
        //.style("fill",function(d,i){ console.log (groups[i]); });
        .style("fill"); //set fill to be the same as the group label
    g.selectAll(".yAxisSeparated").attr("opacity","0");
    g.selectAll(".group-label").attr("opacity","0");
    t.selectAll(".yAxisStacked").attr("opacity","1");
}

}


function createZeroArray(length){
  var zeroArray = [];
  for (var i = 0; i < length; i++) {
      zeroArray.push(0);
  }
  return zeroArray;
}
function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}
function getMinOfArray(numArray) {
    return Math.min.apply(null, numArray);
}

// the legend color guide - green to red
function gradientColorGreenToRed(val){
  if (val>=8.0){return '#2b842d';}
  else if (val>=6.0 && val<8.0){return '#3ec041';}
  else if (val>=4.0 && val<6.0){return '#79d47b';}
  else if (val>=2.0 && val<4.0){return '#b4e7b5';}
  else if (val>=0.0 && val<2.0){return '#d2f0d2';}
  else if (val>=-2.0 && val<0.0){return '#f0d2d2';}
  else if (val>=-4.0 && val<-2.0){return '#e7b5b4';}
  else if (val>=-6.0 && val<-4.0){return '#d47b79';}
  else if (val>=-8.0 && val<-6.0){return '#c0413e';}
  else{return '#842d2b';} //10th group
}