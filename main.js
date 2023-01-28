
var heures = ["08:00 - 09:30", "09:40 - 11:10", "11:20 - 12:50", "13:00 - 14:30", "14:40 - 16:10", "16:20 - 17:50" ];
var day = ["Sam", "Dim", "Lun", "Mar", "Mer", "Jeu"];
var classrooms = [];
selected = [];
var svg; 
var map; 
/////////////
// var zoom = d3.behavior.zoom()
// .scaleExtent([1, 10])
// .on('zoom', doZoom);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////functions////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
    ////make combo box for choices 
    function comboBox(array,id){
        
        var comboList = document.createElement('datalist');
        comboList.id = id;
        array.forEach(array=>{
        var option = document.createElement('option');
        option.innerHTML = array;
        option.value = array;
        comboList.appendChild(option);
        })
        document.body.appendChild(comboList);
       }

       comboBox(heures,"heure");
       comboBox(day,"day");
       

 
   
   ///mouse over tooltip infoes 
        function mouseOverTooltipinfo(d, tooltip)
        {
            if(d.properties.name != ""){
                        tooltip.html(d.properties.name)
                            .style("color", "white")
                            .style('visibility', 'visible')
                            .style("top", (event.pageY - 35)+"px")
                            .style("left", (event.pageX + 35)+"px");
                    }
        }
 ///mouse over tooltip class number 
        function mouseover(html, tooltip)
        {
            tooltip.html(html)
                .style("color", "white")
                .style('visibility', 'visible')
                .style("top", (event.pageY - 35)+"px")
                .style("left", (event.pageX + 35)+"px");
        }
        //*************************************************************************************
        //function mouseOut
        function mouseOut(tooltip)
        {
            tooltip.html('')
                .style('visibility', 'hidden');
        }  








        function resetColor(geojson, classrooms, color, selected)
        {
         
            geojson.features.forEach(function(d){ 
                classrooms.forEach(function(salle){
                    if(salle.nomSalle == String(d.properties.name))
                    {
                        svg.select("#_"+salle.nomSalle)
                            .style('fill', color)
                    }
                });
            });
        }


        function colorClass(geojson, classrooms)
        {
            geojson.features.forEach(function(d){ 
                classrooms.forEach(function(salle){
                    if(salle.nomSalle == String(d.properties.name))
                    {
                        svg.select("#_"+salle.nomSalle)
                            .style('fill', salle.color)
                            .on('mouseover', function(d){
                                var html =   '<u>salle </u> : '+salle.nomSalle+'<br>'
                               
                                        +'<u>spec:</u> '+salle.speciality+'<br>'
                                        +'<u>G </u>:'+salle.grade+'<br>'
                                        +'<u>Sec:</u>'+salle.section+'<br>'
                                        +'<u>Groupe : </u>'+salle.groupe+'<br>'
                                        +'<u>td/tp :</u>'+salle.type+'<br>';
                                        +'<u>Module:</u>'+salle.module+'<br>'
                                        +'<u>Enseignant :</u>'+salle.prof+'<br>'
                                       
                                       
                                mouseover(html, tooltip);
                            })
                            .on("mouseout", function(){
                                mouseOut(tooltip);
                            });
                    }
                });
            });
        }

        //get the classrooms 
function fill(x, schedule, classrooms, color)
{
    var object = {};
    x.forEach(function(d){
            object = {
            speciality : schedule.Filere,
            grade : schedule.Grade,
            section : schedule.Section,
            module : d.Module,
            nomSalle : d.Salle,
            prof : d.Prof,
            groupe : d.Groupe,
            type : d.Type,
            color : color
        };
        classrooms.push(object);
    });
}



function filleClassArr(schedules, geojson, color, selected)
        {
           
            var x;
            console.log(selected)
            var keyJ = selected[1];
            var keyH = selected[0];
        
            console.log(selected[0], selected[1])
            resetColor(geojson, classrooms, color);
      
            console.log(classrooms)
            classrooms.length = 0; // empty the classrooms array
            schedules.forEach(function (schedule){ 
                x = d3.values(schedule.Jour[keyJ][keyH]);
             
                console.log(x);
                if(selected[2] == schedule.Filere)
                {
                    fill(x, schedule, classrooms, "#00FF00");
                    console.log("hey this is first log showing classrooms")
                    console.log(classrooms);
                }else{
                    fill(x, schedule, classrooms, "#FF0000");
                }
            });
        }
       
///button functions
function show(submit,schedules,geojson,selected) {
    console.log('Button Clicked');
    submit.onclick = function (){
    selected = []
    
    heurvalue = document.getElementById('heurs').value;
    selected.push(heurvalue);

    dayvalue = document.getElementById('days').value;
    selected.push(dayvalue);

    specvalue = document.getElementById('specs').value;
    selected.push(specvalue);

    console.log(selected);

    if(selected.length != 0)
        {
            filleClassArr(schedules, geojson, '#FFFAFA', selected);
            colorClass(geojson, classrooms,selected);
        }else{
            resetColor(geojson, classrooms, '#FFFAFA', selected);
        }
    }

 }




 //fill arrays function 

 function trim(str){
    return str.trim().toUpperCase();
  }


 function fillSpecialities (data){
    var speciality = [];
    for (var i in data)
    {
        speciality.push(trim(data[i].Filere))
    }

    // remove duplicates
      var speciality = speciality.reduce(function (acc, curr) {
        if (!acc.includes(curr))
            acc.push(curr);
        return acc;
    }, [])
 
    console.log(speciality);
    speciality.sort();

    comboBox(speciality,"spec");

 }

/**
 * Zoom the features on the map. This rescales the features on the map.
 
function doZoom() {
    mapFeatures.attr("transform",
      "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
  }*/
  
 
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////map html and stuff///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
 

            //Width and height
			 var w = 800;
			 var h = 600;
           // var w= Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
               // h= Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			//Define map projection
			var proj = d3.geo.mercator()
								   .translate([0,0])
								   .scale([1])
                                   .rotate([10,41]);

			//Define path generator
			var path = d3.geo.path()
							 .projection(proj);
							 
			
            //create a tooltip
            var tooltip = d3.select("body")
                            .append("div")
                            .attr('class', 'tooltip');	
            //create the svg                
			var svg = d3.select("body")
						.append("svg")
						.attr("width", w)
						.attr("height", h);


		d3.json("usthb.geojson", function(json) {
            var b = path.bounds(json);
            console.log(b);
               s = .99 / Math.max( (b[1][0] - b[0][0]) / w , (b[1][1] - b[0][1]) / h ); 
               t = [ (w - s * (b[1][0] +b[0][0])) / 2 , (h - s * (b[1][1]+b[0][1])) / 2 ];
               console.log(s,t);
            proj.translate(t).scale(s);


		     map = svg.selectAll("path")
					   .data(json.features);//call(zoom)
                                   
             		map.enter()
					   .append("path")
					   .attr("d", path)
					   .attr("class","bloc")
                       .attr('fill', '#00205b')
                       .style('stroke', 'white')
                       .attr('id', function(d){
                        var t = "_"+String(d.properties.name);
                        return t; 
                         //add id to svg path from the geojson file
                    })
                       .style('stroke-width', '.5px')
                       .on('mouseover', function(d){
                        mouseOverTooltipinfo(d, tooltip);
                    })
                    .on('mouseout', function(){
                        mouseOut(tooltip);
                    });
                    
                    
                    d3.json("dataF.json", (data) => {
                        console.log('data loaded ');
                        fillSpecialities(data);
                        var submit = document.getElementById("show")
                        console.log(submit)
                        show(submit,data,json,selected);
                   
                    })
                    
				}
                
                );
        
