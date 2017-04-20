/**
 * Created by Jeremy on 4/19/16.
 */
//init google map
var map;
var geocoder;

function initMap(){
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'),{
    center: {lat:40.442764,lng:-79.943178},
    zoom: 13
    });
}


//define object Rider
var Rider = function(andrewid,longitude,latitude,address){
    this.AndrewID = andrewid;
    this.Longitude = longitude;
    this.Latitude = latitude;
    this.Address = address;
    //this.Weight = 0;
};


// automatically and peridocially update the table
// on the webpage to show riders' information
var intervalID = window.setInterval(addRiders, 50000);

// add global variable to store geocoordinate
var riderGeoCor = [];


// the geoCoordinates of last escort station around
// campus and the escort parking place is stored in the
// global variable
riderGeoCor.push(new Rider('startStation',40.441424,79.946336,'4869 Frew Street'));
riderGeoCor.push(new Rider('destStation',40.446717,-79.947397, '4634 Fifth Ave'));

function addRiders(event){
    var date = document.getElementById('dayDate').value;
    var time = document.getElementById('Time').value;
    var route = document.getElementById('dayRoute').value;
    var busID = document.getElementById('BusID').value;
    var requirement = '?Date=' + date + "&Time=" + time + "&Route=" + route
                        + "&BusID=" + busID;
    $("#riders").load("escortAssist_driver.html #riders");
    $.ajax({
        url:'/addRiders/'+requirement,success:function(result){
            console.log(result);
            dataStrings = result.split(';');
            for(var i=0;i<dataStrings.length-1;i++){
                attributes = dataStrings[i].split(',');
                transAddressToGeo(attributes[1], attributes[0]);
                if(verAndEdges.length > 0){
                    console.log(JSON.stringify(verAndEdges));
                    setTimeout(acquireDataToDraw,2500)
                }
                var row = $("<tr><td>"+attributes[0]+"</td><td>"+attributes[1]+"</td></tr>");
                $("#riders > tbody").append(row);
            }
        }
    });
}

// The function to transform address to geological coordinates(latitude,longitude)
function transAddressToGeo(address,andrewID){
    geocoder.geocode({address :address}, function(result,status){
        if(status == google.maps.GeocoderStatus.OK){
             var latitude = result[0].geometry.location.lat();
             var longtitude = result[0].geometry.location.lng();
             var marker = new google.maps.Marker({
                 map: map,
                 label: andrewID,
                 position: result[0].geometry.location
             });
            var newRider = new Rider(andrewID,latitude,longtitude,address);
            if(isLegalAddRider(newRider.AndrewID)) {
                riderGeoCor.push(newRider);
                calMapDist();
            }
        }
        else if(status == google.maps.GeocoderStatus.OVER_QUERY_LIMITS){
            transAddressToGeo(address,andrewID);
        }
        else{
            alert("Geocode was not successful for the following reason: " + status);
        }
    })
}

// helper function judge isLegalAddRider
function isLegalAddRider(attribute){
    if(riderGeoCor.length==0){
        return true
    }
    else{
        for(var i = 0 ; i < riderGeoCor.length; i++){
           if(riderGeoCor[i].AndrewID == attribute){
               return false
           }
        }
        return true
    }
}

// define a global variable to store andrewIDs and distance(vertex and edges)
var verAndEdges = [];


//googel map calculate distance between any two addresses
//a backup way to do this is using the algorithm
//to calcualte the distance between two address()
function calMapDist(){
    var existedVertexPairs = [];
    var startAddress = [];
    var endAddress = [];
    for(i=0;i<riderGeoCor.length;i++){
        for(j=i+1;j<riderGeoCor.length;j++){
            var vertex = riderGeoCor[i].AndrewID + "-" + riderGeoCor[j].AndrewID;
            if(!isVertexRed(vertex,existedVertexPairs)) {
                existedVertexPairs.push(vertex);
                startAddress.push(riderGeoCor[i].Address);
                endAddress.push(riderGeoCor[j].Address);
            }
        }
    }
    verReqTran(existedVertexPairs,startAddress,endAddress)
}

//check if the vertex is redundant
function isVertexRed(vertex,existedPairs){
    if (vertex == 'startStation-destStation'||
        vertex == 'destStation-startStation'){
        return true
    }
    if (existedPairs.length == 0){
        return false
    }
    for(var i= 0; i< existedPairs.length; i++){
        if(vertex == existedPairs[i]||
            stringReverse(vertex) == existedPairs[i]){
            return true
        }
    }
    return false
}

//string reverse helper function
function stringReverse(s){
    return s.split('-').reverse().join('-')
}

//transmit existedVertexPairs and requests and call calDist
function verReqTran(existedVertexPairs, startAddress,endAddress){
    for(var i=0; i<existedVertexPairs.length;i++){
        var request = {
            origin: startAddress[i] + "," + "Pittsburgh" + "," + "PA",
            destination: endAddress[i] + "," + "Pittsburgh" + "," + "PA",
            travelMode: google.maps.TravelMode.DRIVING
        };
        setTimeout(calDist(existedVertexPairs[i],request),2500)
    }
}


//calculate distance between anytwo vertexes(addresses)
function calDist(vertex,request) {
    var pairs={};
    console.log(vertex);
    //initialize google map direction service
    var directionService = new google.maps.DirectionsService();
    directionService.route(request,function(result, status) {
            console.log(status);
            console.log(vertex);
            if (status == google.maps.DirectionsStatus.OK) {
                //console.log(result.routes[0].legs[0].distance.value);
                pairs[vertex] = result.routes[0].legs[0].distance.value;
                if (isLegalVertex(vertex)) {
                    verAndEdges.push(pairs);
                }
            }
            else if(status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT){
                setTimeout(calDist(vertex,request),2500);
            }
    });
}


// helper function to judge is vertex legal to add
function isLegalVertex(vertex){
    if(verAndEdges.length == 0){
        return true
    }
    else{
        for(i=0; i<verAndEdges.length; i++){
            for(var key in verAndEdges[i]){
                if(verAndEdges[i].hasOwnProperty(key)){
                    if(key == vertex){
                        return false
                    }
                }
            }
        }
        return true
    }
}


// Acaquire data from database and draw
function acquireDataToDraw() {
    $.ajax({
        url: '/transVerAndEdges/',
        datatype: 'json',
        data: {'vertexAndEdges': JSON.stringify(verAndEdges)},
        success: function (result) {
            console.log(result);
            vertexes = result.split('-');
            // draw markers
            var waypoints = [];
            var path = [];
            for (var i = 0; i < vertexes.length; i++) {
                for (var j = 0; j < riderGeoCor.length; j++) {
                    if (riderGeoCor[j].AndrewID == vertexes[i]) {
                        setTimeout(drawVertex(riderGeoCor[j]),2500);
                        if (i == 0) {
                            var start = riderGeoCor[j].Address + 'Pittsburgh' + 'PA';
                            path.push(start)
                        }
                        else if (i == vertexes.length - 1) {
                            var end = riderGeoCor[j].Address + 'Pittsburgh' + 'PA';
                            path.push(end)
                        }
                        else {
                            var wayPoint = riderGeoCor[j].Address + 'Pittsburgh' + 'PA';
                            waypoints.push({
                                location: wayPoint,
                                stopover: true
                            });
                            path.push(wayPoint)
                        }
                    }
                }
            }
            setTimeout(drawEdges(start, end, waypoints),1000);
        }
    })

}

// a vertex means the address of a client
function drawVertex(rider){
    var latitude = rider.Latitude;
    var longtitude = rider.Longitude;
    var latlng = new google.maps.LatLng(latitude,longtitude);
    var marker = new google.maps.Marker({
        map:map,
        labelcontent:rider.AndrewID,
        position: latlng
    })
}

// an edge means the connection (route) between
// two addresses
function drawEdges(starts,ends, wayPoints) {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);
    setTimeout(calcualteAndDisplayRoute(directionsService, directionsDisplay,starts,ends, wayPoints),2500)
}

function calcualteAndDisplayRoute(directionsService, directionsDisplay,starts,ends, wayPoints){
    var request = {
        origin: starts,
        destination: ends,
        waypoints: wayPoints,
        travelMode:google.maps.TravelMode.DRIVING
    };
    directionsService.route(request,function(result,status){
        console.log(status);
        if(status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
            var route = result.routes[0];
            //console.log(route);
        }
    })
}

//email Notification
function sendEmail(event){
    var date = document.getElementById('dayDate').value;
    var time = document.getElementById('Time').value;
    var route = document.getElementById('dayRoute').value;
    var busID = document.getElementById('BusID').value;
    var sendInfo = '?Date=' + date + "&Time=" + time + "&Route=" + route
                   + "&BusID=" + busID;
    $.ajax({
        url:'/sendEmail/' + sendInfo, success:function(result){
            console.log(result)
        }
    })
}

//ajax wrap up function to initilize the webpage
$(document).ready(function(){
    initMap();
    $('#dayDate').change(addRiders);
    $('#Time').change(addRiders);
    $('#dayRoute').change(addRiders);
    $('#BusID').change(addRiders);
    $('#sendEmail').click(sendEmail);
});

