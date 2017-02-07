function genDatamap(containerName, dataName, mapName, metricName, periodName){

var fills_green={  
      grad1:'#123104', 
      grad2:'#1b4906',
      grad3:'#296d09',
      grad4:'#37910c',
      grad5:'#44b50f',
      grad6:'#52da12',
      grad7:'#66ed26',
      grad8:'#a0f479',
      grad9:'#c1f8a8',
      grad10:'#dbfbcc',
      defaultFill: '#626262'
   };
var fills_redgreen={
      grad1:'#2b842d', 
      grad2:'#3ec041',
      grad3:'#79d47b',
      grad4:'#b4e7b5',
      grad5:'#d2f0d2',
      grad6:'#f0d2d2',
      grad7:'#e7b5b4',
      grad8:'#d47b79',
      grad9:'#c0413e',
      grad10:'#842d2b',
      defaultFill: '#626262'
   };

//if pct_growth then use red green shading, otherwise use green shading
if (metricName=="pct_growth"){var fill_gradient=fills_redgreen;}
else {var fill_gradient=fills_green;}

for (var country in dataName){
  if (metricName=="pct_growth"){
    var popup=_.template([
             '<div class="hoverinfo">',
             '<%= geography.properties.name %><br>',
             '<% if (data.growth_1mo_ago_s) { %>',
             'User Growth % (1 Mo. Ago): <%=data.growth_1mo_ago_s%><br>','<% } %>',
             '<% if (data.growth_3mo_ago_s) { %>',
             'User Growth % (3 Mo. Ago): <%=data.growth_3mo_ago_s%><br>','<% } %>',
             '<% if (data.growth_6mo_ago_s) { %>',
             'User Growth % (6 Mo. Ago): <%=data.growth_6mo_ago_s%><br>','<% } %>',
             '<% if (data.growth_12mo_ago_s) { %>',
             'User Growth % (12 Mo. Ago): <%=data.growth_12mo_ago_s%><br>','<% } %>',
             '</div>'
            ].join('')) ;

    if (periodName=="mo_1"){dataName[country].fillKey=gradient_growth(dataName[country].growth_1mo_ago);}
    else if (periodName=="mo_3"){dataName[country].fillKey=gradient_growth(dataName[country].growth_3mo_ago);}
    else if (periodName=="mo_6"){dataName[country].fillKey=gradient_growth(dataName[country].growth_6mo_ago);}
    else if (periodName=="mo_12"){dataName[country].fillKey=gradient_growth(dataName[country].growth_12mo_ago);}
  }
  else if (metricName=="mau"){
    var popup=_.template([
             '<div class="hoverinfo">',
             '<%= geography.properties.name %><br>',
             '<% if (data.users_0mo_ago_s) { %>',
             'Users (Current): <%=data.users_0mo_ago_s%><br>','<% } %>',
             '<% if (data.users_1mo_ago_s) { %>',
             'Users(1 Mo. Ago): <%=data.users_1mo_ago_s%><br>','<% } %>',
             '<% if (data.users_3mo_ago_s) { %>',
             'Users(3 Mo. Ago): <%=data.users_3mo_ago_s%><br>','<% } %>',
             '<% if (data.users_6mo_ago_s) { %>',
             'Users(6 Mo. Ago): <%=data.users_6mo_ago_s%><br>','<% } %>',
             '<% if (data.users_12mo_ago_s) { %>',
             'Users(12 Mo. Ago): <%=data.users_12mo_ago_s%><br>','<% } %>',
             '</div>'
            ].join('')) ;

    if (periodName=="mo_0"){dataName[country].fillKey=gradient_mau(dataName[country].users_0mo_ago);}
    else if (periodName=="mo_1"){dataName[country].fillKey=gradient_mau(dataName[country].users_1mo_ago);}
    else if (periodName=="mo_3"){dataName[country].fillKey=gradient_mau(dataName[country].users_3mo_ago);}
    else if (periodName=="mo_6"){dataName[country].fillKey=gradient_mau(dataName[country].users_6mo_ago);}
    else if (periodName=="mo_12"){dataName[country].fillKey=gradient_mau(dataName[country].users_12mo_ago);}
  }
  else if (metricName=="pct_pen_pop"){
    var popup=_.template([
             '<div class="hoverinfo">',
             '<%= geography.properties.name %><br>',
             '<% if (data.pen_0mo_ago_s) { %>',
             'User Penetration (Current): <%=data.pen_0mo_ago_s%><br>','<% } %>',
             '<% if (data.pen_1mo_ago_s) { %>',
             'User Penetration (1 Mo. Ago): <%=data.pen_1mo_ago_s%><br>','<% } %>',
             '<% if (data.pen_3mo_ago_s) { %>',
             'User Penetration (3 Mo. Ago): <%=data.pen_3mo_ago_s%><br>','<% } %>',
             '<% if (data.pen_6mo_ago_s) { %>',
             'User Penetration (6 Mo. Ago): <%=data.pen_6mo_ago_s%><br>','<% } %>',
             '<% if (data.pen_12mo_ago_s) { %>',
             'User Penetration (12 Mo. Ago): <%=data.pen_12mo_ago_s%><br>','<% } %>',
             '</div>'
            ].join('')) ;

    if (periodName=="mo_0"){dataName[country].fillKey=gradient_pen(dataName[country].pen_0mo_ago);}
    else if (periodName=="mo_1"){dataName[country].fillKey=gradient_pen(dataName[country].pen_1mo_ago);}
    else if (periodName=="mo_3"){dataName[country].fillKey=gradient_pen(dataName[country].pen_3mo_ago);}
    else if (periodName=="mo_6"){dataName[country].fillKey=gradient_pen(dataName[country].pen_6mo_ago);}
    else if (periodName=="mo_12"){dataName[country].fillKey=gradient_pen(dataName[country].pen_12mo_ago);}
  }
  
}



$(containerName).datamap({
   scope: mapName,
   geography_config: {
     borderColor: 'rgba(255,255,255,0.3)',
     highlightBorderColor: 'rgba(59,59,59,0.7)',
     highlightBorderWidth: 3,
     popupTemplate: popup
   },
   fills: fill_gradient,
   data: dataName

});


genLegend(metricName);

}

function gradient_mau(dataValue){
  if (dataValue > 100000000){return 'grad1';}
  else if (dataValue <= 100000000 && dataValue > 50000000){return 'grad2';}
  else if (dataValue <= 50000000 && dataValue > 10000000){return 'grad3';}
  else if (dataValue <= 10000000 && dataValue > 5000000){return 'grad4';}
  else if (dataValue <= 5000000 && dataValue > 2000000){return 'grad5';}
  else if (dataValue <= 2000000 && dataValue > 1000000){return 'grad6';}
  else if (dataValue <= 1000000 && dataValue > 500000){return 'grad7';}
  else if (dataValue <= 500000 && dataValue > 250000){return 'grad8';}
  else if (dataValue <= 250000 && dataValue > 100000){return 'grad9';}
  else {return 'grad10'}
}

function gradient_growth(dataValue){
  if (dataValue > 0.5){return 'grad1';}
  else if (dataValue <= 0.5 && dataValue > 0.25){return 'grad2';}
  else if (dataValue <= 0.25 && dataValue > 0.1){return 'grad3';}
  else if (dataValue <= 0.1 && dataValue > 0.05){return 'grad4';}
  else if (dataValue <= 0.05 && dataValue > 0){return 'grad5';}
  else if (dataValue <= 0 && dataValue > -0.05){return 'grad6';}
  else if (dataValue <= -0.05 && dataValue > -0.1){return 'grad7';}
  else if (dataValue <= -0.1 && dataValue > -0.25){return 'grad8';}
  else if (dataValue <= -0.25 && dataValue > -0.5){return 'grad9';}
  else {return 'grad10'}
}

function gradient_pen(dataValue){
  if (dataValue > 0.5){return 'grad1';}
  else if (dataValue <= 0.5 && dataValue > 0.4){return 'grad2';}
  else if (dataValue <= 0.4 && dataValue > 0.3){return 'grad3';}
  else if (dataValue <= 0.3 && dataValue > 0.25){return 'grad4';}
  else if (dataValue <= 0.25 && dataValue > 0.20){return 'grad5';}
  else if (dataValue <= 0.20 && dataValue > 0.15){return 'grad6';}
  else if (dataValue <= 0.15 && dataValue > 0.10){return 'grad7';}
  else if (dataValue <= 0.10 && dataValue > 0.05){return 'grad8';}
  else if (dataValue <= 0.05 && dataValue > 0.025){return 'grad9';}
  else {return 'grad10'}
}


function genLegend(metricName){
  if (metricName=="pct_growth"){var legend_group = ['>  50%','25 to 50%','10 to 25%','5 to 10%',
  '0 to 5%','-5 to 0%','-10 to -5%','-25 to -10%','-50 to -25%','<  -50%'];}
  else if (metricName=="mau"){var legend_group = ['> 100M','50M - 100M','10M - 50M','5.0M - 10M',
  '2.0M - 5.0M','1.0M - 2.0M','500K - 1.0M','250K - 500K','100K - 250K','< 100K'];}
  else if (metricName=="pct_pen_pop"){var legend_group = ['> 50%','40 to 50%','30 to 40%','25 to 30%',
  '20 to 25%','15 to 20%','10 to 15%','5 to 10%','2.5 to 5%','0 to 2.5%'];}
  else{var legend_group = ['Group1','Group2','Group3','Group4',
  'Group5','Group6','Group7','Group8','Group9','Group10'];}
  
  var svg = d3.select(".legend_holder").append("svg").attr("width", 820).attr("height", 50);

  var legend = svg.selectAll("rect")
    .data(legend_group).enter().append("rect")
    .attr({
      x: function(d,i){return 10+i*83},
      y: 0,
      width: 65,
      height: 25
    })
    .style("fill", function(d, i) { 
      if (metricName=="pct_growth"){ return gradientColorRedGreen(i); }
      else if (metricName==""){return '#000000';}
      else{ return gradientColorGreen(i); }
    });

  // legend labels    
  var label = svg.selectAll("text")
    .data(legend_group).enter().append("text")
    .attr({
      x: function(d,i){return 10+i*83},
      y: 40
    })
    .style({
      'font-size': 12.5
    })
    .text(function(d,i) { return (d) });
}



function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// the legend color guide - shades of green
function gradientColorGreen(i){
  if (i==0){return '#123104';}
  else if (i==1){return '#1b4906';}
  else if (i==2){return '#296d09';}
  else if (i==3){return '#37910c';}
  else if (i==4){return '#44b50f';}
  else if (i==5){return '#52da12';}
  else if (i==6){return '#66ed26';}
  else if (i==7){return '#a0f479';}
  else if (i==8){return '#c1f8a8';}
  else{return '#dbfbcc';} //10th group
}


// the legend color guide - red to green
function gradientColorRedGreen(i){
  if (i==0){return '#2b842d';}
  else if (i==1){return '#3ec041';}
  else if (i==2){return '#79d47b';}
  else if (i==3){return '#b4e7b5';}
  else if (i==4){return '#d2f0d2';}
  else if (i==5){return '#f0d2d2';}
  else if (i==6){return '#e7b5b4';}
  else if (i==7){return '#d47b79';}
  else if (i==8){return '#c0413e';}
  else{return '#842d2b';} //10th group
}








  function resetLegend(){
    $('.project-container').append('<div class="legend_holder" style="height: 50px; width: 820px"></div>');
  }
  function resetMapWorld(){
    $('.project-container').append('<div class="svg_holder" style="height: 540px; width: 820px; padding: 0px 0px;"></div>');
  }
  function resetMapEurope(){
    $('.project-container').append('<div class="svg_holder" style="height: 450px; width: 760px; padding: 20px 0px; margin-left: 00px;"></div>');
  }
  function resetMapMiddleEast(){
    $('.project-container').append('<div class="svg_holder" style="height: 575px; width: 575px; padding: 20px 0px; margin-left: 110px;"></div>');
  }
  function resetMapAfrica(){
    $('.project-container').append('<div class="svg_holder" style="height: 650px; width: 650px; padding: 20px 0px; margin-left: 60px;"></div>');
  }
  function resetMapSouthAmerica(){
    $('.project-container').append('<div class="svg_holder" style="height: 650px; width: 400px; padding: 20px 0px; margin-left: 210px;"></div>');
  }
  function resetMapSouthEastAsia(){
    $('.project-container').append('<div class="svg_holder" style="height: 540px; width: 760px; padding: 20px 0px; margin-left: 00px;"></div>');
  }
  function resetMapAsia(){
    $('.project-container').append('<div class="svg_holder" style="height: 525px; width: 760px; padding: 20px 0px; margin-left: 00px;"></div>');
  }