var latitude = undefined;
var longitude = undefined;
var name = "";
var temp_c=undefined;
var temp_f=undefined;
var userLocation = undefined;
// Get their location.
var options = {
  //enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

// When the page is rendered, grab location.
// Make sure you load jQuery in your html doc FIRST!!
jQuery(document).ready(function($) {
 //navigator.geolocation.getCurrentPosition(success, error, options);
  $.ajax({
     url: "https://www.govtrack.us/api/v2/role?current=true",
     dataType: "json",
     success: function(parsed_json) {
       console.log(parsed_json);
       document.getElementById('results').innerHTML =("<p><b>OMG REPS!</b></p>" );

       parsed_json['objects'].forEach( function (object)
       {
	console.log(object.person.name);
	document.getElementById('results').innerHTML +=("<p>"+object.person.name +" 1-"+object.phone+" Web: "+object.website+" twitter :"+object.person.twitterid+"</p>" );
       });
         //name = parsed_json[person]['person']['name'];
       }//temp_f = parsed_json['current_observation']['temp_f'];
       //temp_c = parsed_json['current_observation']['temp_c'];
       //var conditions=(parsed_json['current_observation']['weather']);
       //var windSpeed=parsed_json['current_observation']['wind_mph'];
       //var windDir=parsed_json['current_observation']['wind_dir'];
       //tempFlag="F";
       //if (conditions="Overcast"){
       //conditions="Cloudy" //the iconset has an issue with overcast.
       //}
       //document.getElementById('results').innerHTML =("<p>"+name+"</p>" );
       //document.getElementById('temperature').innerHTML =temp_f + " F";
       //document.getElementById('weather').innerHTML = ("Conditions in "+userLocation + ":</br> " + conditions + " with winds at " +windSpeed+ "mph from the " + windDir);
     //}
  })
})
//On successful browser location, get weather and update div.
function success(pos) {
  crd = pos.coords;
  longitude = crd.longitude;
  // crd.accuracy
  latitude = crd.latitude;
  $.ajax({
       url: "https://www.govtrack.us/api/v2/role?current=true.json",
     dataType: "jsonp",
     success: function(parsed_json) {
       console.log(parsed_json)
       userLocation = parsed_json['location']['city'];
       temp_f = parsed_json['current_observation']['temp_f'];
       temp_c = parsed_json['current_observation']['temp_c'];
       var conditions=(parsed_json['current_observation']['weather']);
       var windSpeed=parsed_json['current_observation']['wind_mph'];
       var windDir=parsed_json['current_observation']['wind_dir'];
       tempFlag="F";
       if (conditions="Overcast"){
	conditions="Cloudy" //the iconset has an issue with overcast.
       }
       document.getElementById('icon').innerHTML ="<img src='http://icons.wxug.com/i/c/i/"+conditions.toLowerCase() +".gif'></img>";
       document.getElementById('temperature').innerHTML =temp_f + " F";
       document.getElementById('weather').innerHTML = ("Conditions in "+userLocation + ":</br> " + conditions + " with winds at " +windSpeed+ "mph from the " + windDir);
     }
   });
  console.log("geolocations successful", latitude, longitude);
};

// If something goes wrong getting weather.
function error(err) {
  if (error.code == error.PERMISSION_DENIED) {
        document.getElementById('results').innerHTML ="Populating with desfault reps.";
    }
  else{
  console.warn('ERROR(' + err.code + '): ' + err.message);
  document.getElementById('weather').innerHTML ="Something went wrong: "+err.message;}
};


// In case I need to take a nap.
function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}

function toggleFC (){
	if (tempFlag=="F"){
        document.getElementById('temperature').innerHTML = temp_c + " C";
	tempFlag="C";
	return
       }

	if (tempFlag=="C"){
        document.getElementById('temperature').innerHTML = temp_f + " F";
	tempFlag="F";
	return
       }
}


