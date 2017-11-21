/**
Author: Priyank Jain
This is the core js logic for adding markes and radarchart for Purdue 2016 Ironhacks Tutorials
**/

//variables for map and marks
var elevator;
var map;
var d;
// 2-level array for washed markets data
var washedData = [];

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

//init the google map in the webpage
function initMap() {
    
    //create the google map
    map = new google.maps.Map(document.getElementById('map'), {
        //center: {lat: 41.85081542, lng: -87.69123528},
       center: {lat: 40.7291, lng: -73.9965},
        zoom: 12
    });


    var infowindow = new google.maps.InfoWindow({
                            content: ""
                        });
    
    //create a new httprequest for this session
    var xmlhttp = new XMLHttpRequest();
    //json format data resource url 
    //var url = "https://data.cityofchicago.org/api/views/hu6v-hsqb/rows.json?accessType=DOWNLOAD";
    var url = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";
    //console.log(json.data[0][18]);
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    //once the request is accepted, process the fowllowing function to get data and complete the app information
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //get the text content from the page response
            var myArr = xmlhttp.responseText;
            var text = myArr;
            json = JSON.parse(text);
            console.log(json);
            //alert(json.data[1][1]);
            //document.getElementById("id01").innerHTML = myArr;
            
            //
            //add the information of the markets here 
            //
            for (var i = 0; i<44; i++) {

                var dataLine = [];

                //latitude - 0
                dataLine.push(json.data[i][23]);
                //longitude - 1
                dataLine.push(json.data[i][24]);
                // //name - 2
                 dataLine.push(json.data[i][9]);
                // //street - 3
                dataLine.push(json.data[i][14]);
                // //Extremely Low Income - 4
                // dataLine.push();
                // //start time - 5
                // dataLine.push(json.data[i][11]);
                // //end time - 6
                // dataLine.push(json.data[i][12]);
                // //start date -7
                // dataLine.push(json.data[i][13]);
                // //end date - 8
                // dataLine.push(json.data[i][14]);
                // //website - 9
                // dataLine.push(json.data[i][15][0]);

                washedData.push(dataLine);
            };
            //alert(washedData);
            //number of the markets
            //var numberOfMarkets = washedData.length;
            var numberOfMarkets = washedData.length;
            //add markers on the map
            var markers = [];
            google.maps.event.addListener(map, 'idle', function() {
            // Create an ElevationService
            elevator = new google.maps.ElevationService();
            $.each(markers, function(key, value)
            {
                value.setMap(null);
            });
            // getting bounds of current location
            var boundBox = map.getBounds();
            var southWest = boundBox.getSouthWest();
            var northEast = boundBox.getNorthEast();
            var lngSpan = northEast.lng() - southWest.lng();
            var latSpan = northEast.lat() - southWest.lat();
            // adding 20 markers to the map at random locations
            var locations = [];
            //lat: 41.85081542, lng: -87.69123528
            for (var j = 0; j < numberOfMarkets; j++)
            {
                var location = new google.maps.LatLng(
                        southWest.lat() + latSpan * Math.random(),
                        southWest.lng() + lngSpan * Math.random()
                        );
                locations.push(location);
            }

            // Create a LocationElevationRequest object using the array's one value
            var positionalRequest = {
                'locations': locations
            };


            elevator.getElevationForLocations(positionalRequest, function(results, status)
            {
                if (status === google.maps.ElevationStatus.OK)
                {
                    //if the infowindow is open
                    var prev_infowindow =false;

                    $.each(results, function(key, value) {

                        //alert(key);
                        markers[key] = new google.maps.Marker({
                            position: {lat: Number(washedData[key][0]), lng: Number(washedData[key][1])},
                            map: map,
                            //icon: 'http://google-maps-icons.googlecode.com/files/red' + ('0' + key.toString()).slice(-2) + '.png'
                        });
                        google.maps.event.addListener(markers[key], 'click', function() {
                            //if another window is open, close it
                            if( prev_infowindow ) {
                                prev_infowindow.close();
                            }
                            infowindow.setContent(washedData[key][2]);
                            infowindow.open(map, markers[key]);
                            //set the menu information about the market
                            //document.getElementById("market-name").innerHTML = "<b>Property Name</b>: " + washedData[key][2] + "</em>";
                            //document.getElementById("street-name").innerHTML = "<b>Address</b>: <em>" + washedData[key][3] + "</em>";
                    
                            document.getElementById("open-status").innerHTML = "<b>Market Status</b>: <em>" + contain(washedData[key][4], day()).capitalizeFirstLetter() + "</em>";

                            //dtata - scored stores
                            //you will use scoring algorithm to get these value in the final project
                            //here we only use random method to show the process
                            var w = 200,
                            h = 250;
                            var array  = [];
                            for (var i = 0; i<9; i++) {
                                array[i] = Math.random();
                            }
                            d = [
                                    [
                                    {axis:"Open hours",value:array[0]},
                                    {axis:"Availability",value:array[1]},
                                    {axis:"Freshness",value:array[2]},
                                    {axis:"Distance",value:array[3]},
                                    {axis:"Prices",value:array[4]},
                                    {axis:"Customer ratings",value:array[5]},
                                    {axis:"Personal preference",value:array[6]},
                                    {axis:"Other",value:array[7]},
                                    {axis:"service",value:array[8]}
                                    ]
                                ];

                            document.getElementById("scores").innerHTML = "The final score for this market is <b><em>" + parseInt(score(array)*100) + "</b></em> out of <b><em>100</b></em>";                            

                            var mycfg = {
                              w: w,
                              h: h,
                              maxValue: 0.6,
                              levels: 6,
                              ExtraWidthX: 200
                            }

                            RadarChart.draw("#chart", d, mycfg);
                        });
                        
                    });
                }
            });
        
        });

        }
    };
}

function makeRadarChart() {

    // var margin = {top: 100, right: 100, bottom: 100, left: 100}, width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right, height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
    // //var data = d;
    // var color = d3.scale.ordinal().range(["#EDC951","#CC333F","#00A0B0"]);
        
    // var radarChartOptions = {
    //     w: width,
    //     h: height,
    //     margin: margin,
    //     maxValue: 0.5,
    //     levels: 5,
    //     roundStrokes: true,
    //     color: color
    // };
    // //Call function to draw the Radar chart
    // RadarChart(".radarChart", d, radarChartOptions);

    //here

    var margin = {top: 100, right: 100, bottom: 100, left: 100},
        width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
        height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
          
      ////////////////////////////////////////////////////////////// 
      ////////////////////////// Data ////////////////////////////// 
      ////////////////////////////////////////////////////////////// 
      var data = d;
      [
            [//iPhone
            {axis:"Cost Of Housing",value:0.22},
            {axis:"Brand",value:0.28},
            {axis:"Contract Cost",value:0.29},
            {axis:"Design And Quality",value:0.17},
            {axis:"Have Internet Connectivity",value:0.22},
            {axis:"Large Screen",value:0.02},
            {axis:"Price Of Device",value:0.21},
            {axis:"To Be A Smartphone",value:0.50}      
            ]
            // ,[//Samsung
            // // {axis:"Battery Life",value:0.27},
            // {axis:"Brand",value:0.16},
            // {axis:"Contract Cost",value:0.35},
            // {axis:"Design And Quality",value:0.13},
            // {axis:"Have Internet Connectivity",value:0.20},
            // {axis:"Large Screen",value:0.13},
            // {axis:"Price Of Device",value:0.35},
            // {axis:"To Be A Smartphone",value:0.38}
            // ],[//Nokia Smartphone
            // {axis:"Battery Life",value:0.26},
            // {axis:"Brand",value:0.10},
            // {axis:"Contract Cost",value:0.30},
            // {axis:"Design And Quality",value:0.14},
            // {axis:"Have Internet Connectivity",value:0.22},
            // {axis:"Large Screen",value:0.04},
            // {axis:"Price Of Device",value:0.41},
            // {axis:"To Be A Smartphone",value:0.30}
            // ]
          ];
      ////////////////////////////////////////////////////////////// 
      //////////////////// Draw the Chart ////////////////////////// 
      ////////////////////////////////////////////////////////////// 
      var color = d3.scale.ordinal()
        .range(["#EDC951","#CC333F","#00A0B0"]);
        
      var radarChartOptions = {
        w: width,
        h: height,
        margin: margin,
        maxValue: 0.5,
        levels: 5,
        roundStrokes: true,
        color: color
      };
      //Call function to draw the Radar chart

      RadarChart(".radarChart", data, radarChartOptions);
  }

function calcIncome (json) {


}

//show the request function in the text format
function myRequestFunction(arr) {
        var out = "";
        var i;
        for(i = 0; i < arr.length; i++) {
            out += '<a href="' + arr[i].url + '">' + 
            arr[i].display + '</a><br>';
        }
        document.getElementById("id01").innerHTML = out;
    }
// Add a listener for idle event and call getElevation on a random set of marker in the bound

//get the result of whether contains a substring
function contain(str, substr) {
    if(str.indexOf(substr) > -1)
        return "open";
    else
        return "closed";
}

//get the day in a week by the number
function day() {
    var d = new Date();
    var weekday = new Array(7);
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    return weekday[d.getDay()];
}

//the algorithm for scoring
//you should create your own reasonable methods for calculating scores
function score(data) {
    return data[0]*0.1 + data[2]*0.01 + data[3]*0.11 + data[1]*0.1 + data[4]*0.2 + data[5]*0.1 + data[6]*0.2 + data[7]*0.01 + data[8]*0.01;
}




