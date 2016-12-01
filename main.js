var latitude = undefined;
var longitude = undefined;
var name = "";
var userLocation = undefined;
var address = "";

// Get their location, maybe
var options = {
  //enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

// When the page is rendered, grab location.
// Make sure you load jQuery in your html doc FIRST!!
//jQuery(document).ready(function($) {
//  navigator.geolocation.getCurrentPosition(success, error, options);
//}

function getReps(){
  var apiKey = "default";
  // Api key is stored outside the web root cause security
  $.ajax({ 
      type: "GET",
      url: "../google-api-key.json", 
      success: function(file_content) {
        apiKey=file_content.key;
        $.ajax({   
        //url: "https://www.govtrack.us/api/v2/role?current=true",
    
        url: ("https://www.googleapis.com/civicinfo/v2/representatives?address="+encodeURIComponent(address)+"&includeOffices=true&levels=country&levels=regional&roles=legislatorLowerBody&roles=legislatorUpperBody&key="+apiKey),
        dataType: "json",
        success: function(parsed_json) {
        console.log(parsed_json);
        document.getElementById('results').innerHTML =("<p><b>OMG REPS!</b></p>" );

        parsed_json['officials'].forEach( function (object)
        {
	 console.log(object.name);
	 document.getElementById('results').innerHTML +=("<p>"+object.name+" <a href=tel:1-"+ object.phones[0].replace(/\s+/g, '-')+">"+object.phones[0]+"</a>"+" Web: <a href="+object.urls[0]+">"+object.urls[0]+"</a>  "+" Tweet: "+"<a class=\"twitter-mention-button\" href=\"https://twitter.com/intent/tweet?screen_name="+object.channels[1]['id']+"&text=" + encodeURIComponent("I am a constituent and I am not happy!") + "\" >@"+object.channels[1]['id']+"</a> or <a href=twitter:"+object.channels[1]['id']+">"+"launch your twitter app.</a></p>" );
         });
        }
       })
      }
    })
};

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

function getAddress (){
	address=document.getElementById('address_input').value;
        document.getElementById('address_input').innerHTML = document.getElementById('address_input').value;
	console.log(address);
	getReps();
	return
}


