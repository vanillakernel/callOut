var name = "";
var address = "";


// When the page is rendered, grab check the cookie.
// Make sure you load jQuery in your html doc FIRST!!
jQuery(document).ready(function($) {
  cookieAddress = checkCookie();
  console.log(cookieAddress);
  if (cookieAddress != "" && cookieAddress != undefined){
     address=cookieAddress;
     getReps();
  } 
});


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function checkCookie() {
    var address=getCookie("address");
    if (address!="" && address!=undefined) {
        console.log(address + " is in the cookie.");
	return address;
    } 
}

function clearCookie(){
    setCookie("address", "", 1);
    document.getElementById('results').innerHTML =("<center><h2> Address cleared.</br>Enter another location.</h2></center>");
}


////////////////////////////////////////////////
// This is the most important method, and does a bunch
// of stuff. TODO handle error cases for loading the key.
// And  make it more legible.
/////////////////////////////////////////////////
function getReps(){
  var apiKey = "default";
  
  // Api key is stored outside the web root cause security.
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
        document.getElementById('results').innerHTML =("<center><p><b>Your congressional representatives for " +address+ "</center></b></p>" );
        twitterHandle = "";
        parsed_json['officials'].forEach( function (object)
        {
	 object.channels.forEach( function (channel){

           // Check their twitter handle.
           if (channel['type'] == "Twitter"){
             twitterHandle=channel['id'];
           }
         });
         // TODO break this up and only render elements if they exist.
	 document.getElementById('results').innerHTML +=("<div class=\"well well-lg\"><h3>"+object.name+"</h3>"+
         "<p> Call: <a class=\"btn btn-success\" href=tel:1-"+ object.phones[0].replace(/\s+/g, '-')+">"+object.phones[0]+"</a>"+
         "</br>"+" Web: <b><a class=\"btn btn-sm btn-link\" style=\"font-size:.8em;\" href="+object.urls[0]+">"+"Click to go to website."+"</b></a>  </br>"+
         " Twitter: "+"<a style=\"background:white;color:#4099FF;border-color:#4099FF;\" class=\"twitter-mention-button btn btn-primary\" href=\"https://twitter.com/intent/tweet?"+
           "&text=" + encodeURIComponent("@"+ twitterHandle  + " I am a constituent and I am not happy!   #callthem") + "\" >@"+twitterHandle+"</a>"
            //+" or<a class=\"twitter-mention-button btn btn-link\" href=twitter://post?message=@"+object.channels[1]['id']+"%20%20%20%23callthem>"+"launch app.</a>"
           +" </p></div>" );
         });
        },
        error: function(data){
          console.log(data);
          //get the status code
          if (data.status == 400) {
              document.getElementById('results').innerHTML =('<h2> <span class=\"text blockquote text-danger \">The address is invalid. </br> Please try a full street address, zip code, or city.</span></h2>');
          }
          if (data.status == 404) {
              document.getElementById('results').innerHTML =('<h2> <span class=\"text blockquote text-danger \">Something went wrong. </br> Please try again.</span></h2>');
          }
          if (data.code == 500) {
              document.getElementById('results').innerHTML =('<h2> <span class=\"text blockquote text-danger \">Something went wrong with the server.</br> Please try again.</span></h2>');
          }
        },
       })
      }
    })
};


// In case I need to take a nap.
function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}


// Just grabs the input value and sets a cookie. Nothing exciting.
function getAddress (){
	address=document.getElementById('address_input').value;
        document.getElementById('address_input').innerHTML = document.getElementById('address_input').value;
        if (address != "" && address != undefined){
           setCookie("address",address,365)
        } 
	console.log(address);
	getReps();
	return
}


