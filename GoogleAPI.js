/**
 * @author SHarmony
 */
    var geocoder; 
     var map;
      function initialize() {
        geocoder = new google.maps.Geocoder(); 
         
         
        var mapOptions = {
          center: new google.maps.LatLng(40.7189,-74.005674),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);
           // alert('map: '+map);
           // alert('Map Init finished');
      }
      function codeAddress() {
        var address = document.getElementById("Google-address").value;
        geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
           // alert('(lng,lat): '+ [results[0].geometry.location.lng(),results[0].geometry.location.lat()]);
            getNowCoordinate(address,[results[0].geometry.location.lng(),results[0].geometry.location.lat()]);
            $("#current-addr").html("Current Address: "+NowAddress);
//          return [results[0].geometry.location.lng(),results[0].geometry.location.lat()];
          } else {
            alert("Geocode was not successful for the following reason: " + status);
          }
        });
      }
   
  function pining(lat,lng,description,contentString){
    var myLatlng = new google.maps.LatLng(lat,lng);
 
    var infowindow = new google.maps.InfoWindow({
        content: contentString
        });
 
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: description
        });
 
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
        });
    }
   
   
  function generatePinnedMap(){
     
        var CompareListObject=[];
        for(var i=0;i<CompareList.length;i++){
            for(var j=0;j<favRestaurant.length;j++){
                if(CompareList[i]==favRestaurant[j].id){
                    CompareListObject.push(favRestaurant[j]);
                    break;
                }
            }
        }
       // alert('CompareListObject: '+CompareListObject);
        var array=[];
        for(var i=0;i<CompareListObject.length;i++){
            array.push(new Array(CompareListObject[i].latitude,CompareListObject[i].longitude));
        }
       // alert('array: '+array);
//          var array=["33.7189,-74.0056","36.7189,-74.0056","42.9189,-74.025674","38.7489,-74.0056"];
        var myLatlng = new google.maps.LatLng(NowCoordinate[1],NowCoordinate[0]);
        var myOptions = {
            zoom: 10,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            }
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  
    for(var i=0;i<array.length;i++){
        pining(array[i][0],array[i][1],CompareListObject[i].name,CompareListObject[i].address); 
    }
    var marker = new google.maps.Marker({ 
        position: myLatlng, 
        map: map, 
        flat: true, 
        title: "My Location", 
     });
        iconFile = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'; 
        marker.setIcon(iconFile)
    var infowindow = new google.maps.InfoWindow({
        content: NowAddress
        });
        google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
        });
  }
  function storeLocation(){
 
    var JSONCoordinate=JSON.stringify(NowCoordinate);
    var JSONAddress=JSON.stringify(NowAddress);
    var JSONAddressList=JSON.stringify(NowAddressList);
    //alert("JSONSTRING: "+JSONString);
    storeData('NowCoordinate',JSONCoordinate);
    storeData('NowAddress',JSONAddress);
    storeData('NowAddressList',JSONAddressList);    
    }
  function loadLocation(){
    var JSONCoordinate=getData('NowCoordinate');
    var JSONAddress=getData('NowAddress');
    var JSONAddressList=getData('NowAddressList');  
//  alert("JSONData: "+JSONdata);
    if(JSONCoordinate!="" && JSONAddress!="" && JSONAddressList!=""){
        var myObject = JSON.parse(JSONCoordinate);
        NowCoordinate=myObject;
        myObject = JSON.parse(JSONAddressList);
        NowAddressList=myObject;
        myObject = JSON.parse(JSONAddress);
        NowAddress=myObject;
        $("#Google-address").val();
        $("#current-addr").html("Current Address: "+NowAddress);
        }
    else{ 	
    	setTimeout(function(){$('#setloc').css("display","block");},2500);
		setTimeout(function(){$('#setloc').animate({"opacity":"1"},500);},2500);
		setTimeout(function(){$('#setloc').animate({"opacity":"0"},500);},7500);
		setTimeout(function(){$('#setloc').css({"display":"none"});},8000);};    
}
 
function addItem(){
    var value=document.getElementById('Google-address').value;
    //alert('value: '+value);
    NowAddressList.push(value);
    $('#AddressSelect').append("<option value='"+value+"'>"+value+"</option>");
}
/* function removeItem(){
    var value=document.getElementById('Google-address').value;
    var str="";
    var list=[];
    for(var i=0;i<NowAddressList.length;i++){
        if(NowAddressList.[i]!=value) {
            str=str+"<option value='"+NowAddressList.[i]+"'>"+NowAddressList.[i]+"</option>";
            list.push(NowAddressList.[i]);
        }
    }
    alert(NowAddressList+" "+list);
    NowAddressList=list;
    $('#AddressSelect').html("");
    $('#AddressSelect').append(str);
}
*/