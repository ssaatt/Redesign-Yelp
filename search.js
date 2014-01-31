var auth = { 
  //
  // Update with your auth tokens.
  //
  consumerKey: "5xrfSTuUlQhRTPrKjlDl9w", //WA 
  consumerSecret: "6XBX-EHbXf6fMpNgBocBmBak2-8",
  accessToken: "B_XMRoMQfz0GMi-scvg3gJVwMrbYea1n",
  // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
  // You wouldn't actually want to expose your access token secret like this in a real application.
  accessTokenSecret: "KTrtxlMgA7ThGT7yUpoB-fRMD48",
  serviceProvider: { 
    signatureMethod: "HMAC-SHA1"
  }
};
function Restaurant(id,name,rating,picUrl,url,longitude,latitude,address,categories,tags,reviewPicUrl,reviewText,reviewCount,dealTitle,city){
	this.id=id;
	this.name=name;				//String
	this.rating=rating;			//double
	this.picUrl=picUrl;			//String
	this.url=url;				//String
	this.longitude=longitude;
	this.latitude=latitude;
	this.address=address;		//String, with HTML tags, with phone
	this.categories=categories;	//String, just categories[0][0]
	this.tags=tags;				//Array of Strings
	this.reviewPicUrl=reviewPicUrl;
	this.reviewText=reviewText;
	this.reviewCount=reviewCount;
	this.dealTitle=dealTitle;
	this.city=city;
	
	if(this.rating>=4) this.cube=2;
	else this.cube=1;
	this.distance=countDistance(longitude,latitude,NowCoordinate[0],NowCoordinate[1]);	
	this.toString = function(){
		return "(name: "+this.name+", rating: "+this.rating+", cube: "+this.cube+")";
	}
}

// in google (lat,long), in yelp (long,lat)
var NowAddressList=["Columbia University","Time Square"];
var NowAddress="";
var NowCoordinate=[-73.961808,40.80693];
var tempTags=Array("Family","Couple");
var favRestaurant=new Array(5);
	favRestaurant[0]=new Restaurant("amici-2-new-york","Amici 2",3.5,"http://s3-media1.ak.yelpcdn.com/bphoto/RxvLBtUi_S_imOlh7B6v4A/ms.jpg",
									"http://www.yelp.com/biz/amici-2-new-york",-73.9972318,40.7197281,"165 Mulberry St<br>(b/t Grand St & Broome St)<br>Little Italy<br>New York, NY 10013<br>Phone: 2123343869"
									,"Italian",tempTags,"http://s3-media1.ak.yelpcdn.com/photo/M3rE9bDPnoJQNO23NozdJg/ms.jpg","I had taken my wife, 2 kids and mother to Amici II after spending a day in the city.   I work in NY but rarely get to play tourist with my family so I...",
									46,"$20 for $25","New York");
	favRestaurant[1]=new Restaurant("la-lucha-nyc-new-york","La Lucha NYC",4.5,"http://s3-media1.ak.yelpcdn.com/bphoto/RxvLBtUi_S_imOlh7B6v4A/ms.jpg",
									"http://www.yelp.com/biz/amici-2-new-york",-73.9972318,40.7197281,"165 Mulberry St<br>(b/t Grand St & Broome St)<br>Little Italy<br>New York, NY 10013<br>Phone: 2123343869"
									,"Chinese",tempTags,"http://s3-media1.ak.yelpcdn.com/photo/M3rE9bDPnoJQNO23NozdJg/ms.jpg","I had taken my wife, 2 kids and mother to Amici II after spending a day in the city.   I work in NY but rarely get to play tourist with my family so I...",
									46,"$20 for $25","New York");
	favRestaurant[2]=new Restaurant("alewife-nyc-long-island-city-2","Alewife NYC",3,"http://s3-media1.ak.yelpcdn.com/bphoto/RxvLBtUi_S_imOlh7B6v4A/ms.jpg",
									"http://www.yelp.com/biz/amici-2-new-york",-73.9972318,40.7197281,"165 Mulberry St<br>(b/t Grand St & Broome St)<br>Little Italy<br>New York, NY 10013<br>Phone: 2123343869"
									,"Japanese",tempTags,"http://s3-media1.ak.yelpcdn.com/photo/M3rE9bDPnoJQNO23NozdJg/ms.jpg","I had taken my wife, 2 kids and mother to Amici II after spending a day in the city.   I work in NY but rarely get to play tourist with my family so I...",
									46,"$20 for $25","San Francisco");
	favRestaurant[3]=new Restaurant("bonchon-manhattan-3","BonChon",3.5,"http://s3-media1.ak.yelpcdn.com/bphoto/RxvLBtUi_S_imOlh7B6v4A/ms.jpg",
									"http://www.yelp.com/biz/amici-2-new-york",-73.9972318,40.7197281,"165 Mulberry St<br>(b/t Grand St & Broome St)<br>Little Italy<br>New York, NY 10013<br>Phone: 2123343869"
									,"Japanese",['Couple','Friend'],"http://s3-media1.ak.yelpcdn.com/photo/M3rE9bDPnoJQNO23NozdJg/ms.jpg","I had taken my wife, 2 kids and mother to Amici II after spending a day in the city.   I work in NY but rarely get to play tourist with my family so I...",
									46,"$20 for $25","Las Vegas");
	favRestaurant[4]=new Restaurant("stecchino-new-york","Stecchino",5,"http://s3-media1.ak.yelpcdn.com/bphoto/RxvLBtUi_S_imOlh7B6v4A/ms.jpg",
									"http://www.yelp.com/biz/amici-2-new-york",-73.9972318,40.7197281,"165 Mulberry St<br>(b/t Grand St & Broome St)<br>Little Italy<br>New York, NY 10013<br>Phone: 2123343869"
									,"Italian",tempTags,"http://s3-media1.ak.yelpcdn.com/photo/M3rE9bDPnoJQNO23NozdJg/ms.jpg","I had taken my wife, 2 kids and mother to Amici II after spending a day in the city.   I work in NY but rarely get to play tourist with my family so I...",
									46,"$20 for $25","New York");
	//id,picUrl,url,name,distance,rating,address,phone,categories,tags
var tempRestaurant; //20 items, initiated after success

	var offset = 0;
	var total = 0;
function refreshPage(){
	
	var terms = setQueryLocation($('#queryfield').val())+"+food";
	var near = setQueryLocation($('#addressfield').val());
	var deal = $('#deal').is(":checked");
	var sort = $('input:radio[name=sort]:checked').val();;
	//alert(terms+","+near+","+deal+","+sort);
	var accessor = {
	  consumerSecret: auth.consumerSecret,
	  tokenSecret: auth.accessTokenSecret
	};
	
	if(near=='') {
		near=NowAddress;
		if(near==''){
		setTimeout(function(){$('#setloc').css("display","block");},1);
		setTimeout(function(){$('#setloc').animate({"opacity":"1"},500);},500);
		setTimeout(function(){$('#setloc').animate({"opacity":"0"},500);},5000);
		setTimeout(function(){$('#setloc').css({"display":"none"});},5500);    
			return 0;
			
		}
	}
	
	parameters = [];
	parameters.push(['term', terms]);
	parameters.push(['location', near]);
	parameters.push(['offset', offset*20]);
	parameters.push(['sort', sort]);
	parameters.push(['deals_filter',deal]);
	parameters.push(['callback', 'cb']);
	parameters.push(['oauth_consumer_key', auth.consumerKey]);
	parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
	parameters.push(['oauth_token', auth.accessToken]);
	parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
	
	var message = { 
  	'action': 'http://api.yelp.com/v2/search',
  	'method': 'GET',
  	'parameters': parameters 
	};
	
	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);
	
	var parameterMap = OAuth.getParameterMap(message.parameters);
	parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
	console.log(parameterMap);
	$('#business-table tbody > tr').remove();
	$("#searchresults").css("display","none");
	$("#loadingbox").css("display","block");
	$("#totalnum").empty();
	$("#totalnumfoot").empty();
  	$.ajax({
  	'url': message.action,
  	'data': parameterMap,
  	'cache': true,
  	'dataType': 'jsonp',
  	'jsonpCallback': 'cb',
  	'success': function(data, textStats, XMLHttpRequest) {
    	console.log(data);
    	total=data.total;
    	tempRestaurant=[];
		var currentCor=data.region.center;
		$.each(data.businesses,function(i,record){
			pushRecordtoArray(record,tempRestaurant);
			var coordinate=record.location.coordinate;
			var string="<tr><td class='left'><img style='border-radius:3px;' src='"+checkUrlExist(record.image_url)+"'></td>"
						//Column 2
						+"<td class='middle' onclick='window.open(\""+record.url+"\",\"_blank\")'><h3 class='busname'> "+record.name+getDealStringWithPic(record)+"</h3><span style='font-size:12px; font-family:Arial;'>Catagories:"+getCategoriesString(record)+"</span><br> <div style='width:100px; height: 20px; margin:3px; background:url(./JBresource/stars.png); background-position:"+ showStars(record.rating) + "'> </div> "+record.review_count +" reviews </td>"
						//Column 3
						+"<td class='middle-right' style='font-size:15px;'>Distance: " + countDistance(coordinate.longitude,coordinate.latitude,currentCor.longitude,currentCor.latitude)
						+ " km<br>"+getAddressString(record)+"</td><td name='addtofav' class='right'  onclick='showAddDialog("+(tempRestaurant.length-1)+")'>  <span class='addtxt'>ADD</span><span style='font-size:40px;color:#666666;margin:0px;padding:0px;'> +</span><br><span class='addtxt'>FAV</span> </td></tr>";
			//alert('Current tempRestaurant'+tempRestaurant[tempRestaurant.length-1]); addFavoriteFromTemp("+(tempRestaurant.length-1)+");	
			$("#business-table").append(string);
		});
			$("#offsetselect").find('option').remove().end();
//			$("#offsetselectfoot").find('option').remove().end();
			$("#totalnum").append(total);
			$("#totalnumfoot").append(total);
			$("#loadingbox").css("display","none");
			$("#searchresults").css("display","block");
    		for(var i=0;i<(total/20);i++){
				$("#offsetselect").append(new Option(i+1,i,false,false));
//				$("#offsetselectfoot").append(new Option(i+1,i,false,false));
    			}
    			$("#offsetselect").val(offset);
//    			$("#offsetselectfoot").val(offset);
    	}
    });
    
}

$(document).ready(function(){
	
	
	$('#sbutton').click(function(){ offset=0; refreshPage();});
	$('#prev').click(function(){
		if(offset>0){
		offset--;
		refreshPage();
		}
		else 
		{
			$('#firstpage').css("display","block");
			$('#firstpage').animate({"opacity":"1"},500);
			setTimeout(function(){$('#firstpage').animate({"opacity":"0"},500);},2500);
			setTimeout(function(){$('#firstpage').css({"display":"none"});},3000);
		}
		
	});
	$('#prevfoot').click(function(){
		if(offset>0){
		offset--;
		refreshPage();
		}
		else {
			$('#firstpage').css("display","block");
			$('#firstpage').animate({"opacity":"1"},500);
			setTimeout(function(){$('#firstpage').animate({"opacity":"0"},500);},2500);
			setTimeout(function(){$('#firstpage').css({"display":"none"});},3000);
		}
	});
	$('#next').click(function(){
		if(offset<(total/20)){
		offset++;
		refreshPage();
		}
		else{
			$('#lastpage').css("display","block");
			$('#lastpage').animate({"opacity":"1"},500);
			setTimeout(function(){$('#lastpage').animate({"opacity":"0"},500);},2500);
			setTimeout(function(){$('#lastpage').css({"display":"none"});},3000);
		};
	});	
	$('#nextfoot').click(function(){
		if(offset<(total/20)){
		offset++;
		refreshPage();
		}
		else{
			$('#lastpage').css("display","block");
			$('#lastpage').animate({"opacity":"1"},500);
			setTimeout(function(){$('#lastpage').animate({"opacity":"0"},500);},2500);
			setTimeout(function(){$('#lastpage').css({"display":"none"});},3000);
		};
	});	
	/*$('#SF').click(function(){
	setQueryLocation("San Francisco");
	refreshPage();
	});
	$('#NY').click(function(){
	setQueryLocation("New York");
	refreshPage();
	});*/
	$("#offsetselect").change(function(){

          $("select option:selected").each(function () {
                offset = $(this).val();
              
              });
              		  refreshPage();

       });

/*	$("#offsetselectfoot").change(function(){
		  alert('bottom offset'+offset);
          $("select option:selected").each(function () {
                offset = $(this).val();
              refreshPage();
              });

       });
  */     
       
       
       
       
	});

function showStars(rating){
	//alert(rating);
	switch (rating){
		case 0:
			return "0px 0px;";
			break;
		case 0.5:
			return "0px -20px;";
			break;
		case 1:
			return "0px -40px;";
			break;
		case 1.5:
			return "0px -60px;";
			break;
		case 2:
			return "0px -80px;";
			break;
		case 2.5:
			return "0px -100px;";
			break;
		case 3:
			return "0px -120px;";
			break;
		case 3.5:
			return "0px -140px;";
			break;
		case 4:
			return "0px -160px;";
			break;
		case 4.5:
			return "0px -180px;";
			break;
		case 5:
			return "0px -200px;";
			break;
	}
}
function getDealString(record){
	var dealptr;
	var str="";
	if(record.deals){
		dealptr=record.deals[0];
		str=dealptr.title;
//		str="Deal: <b class='dealdescription'>"+dealptr.title+"</b><br>"+dealptr.what_you_get+"<br><i>"+dealptr.additional_restrictions+"</i>";
	}
	else str="";
	return str;
}

function getDealStringWithPic(record){
	var dealptr;
	var str="";
	if(record.deals){
		dealptr=record.deals[0];
		str="<img src='./JBresource/DEAL.png' class='dealpic'><span class='dealstr'>"+dealptr.title+"</span>";
//		str="Deal: <b class='dealdescription'>"+dealptr.title+"</b><br>"+dealptr.what_you_get+"<br><i>"+dealptr.additional_restrictions+"</i>";
	}
	else str="";
	return str;
}

function getAddressString(record){
	var str="";
	for(var i=0;i<record.location.display_address.length;i++)
	{
		str=str+record.location.display_address[i]+"<br>";
	}
	if(record.phone)
		str=str+"Phone: "+record.phone;
	return str;
}

function getCategoriesString(record){
	var str="";
	if(record.categories==null) return str;
	else for(var i=0;i<record.categories.length;i++)
			str=str+" "+record.categories[i][0];
	return str;
}

function setQueryLocation(name){
	for(var i=0;i<name.length;i++)
		name=name.replace(' ','+');
		return name;
}

function setDeal(d){
	deal=d;
}

function countDistance(AX,AY,BX,BY){ //1 => 111000m
	var Xsqr=(AX-BX)*(AX-BX)*111*111;
	var Ysqr=(AY-BY)*(AY-BY)*111*111;
	var result=Math.round(Math.sqrt(Xsqr+Ysqr)*10)/10;
	return result;
}
function setSortMethod(value){
	sort=value;
}

function addFavoriteFromTemp(num,tags){

	tempRestaurant[num].tags=tags;
	favRestaurant.push(tempRestaurant[num]);
	//alert('tempRestaurant[num].tags'+tempRestaurant[num].tags);
	//alert(tempRestaurant[num]+" added!");
	storeFavorite();
}

function pushRecordtoArray(record,ary){
	var rest=new Restaurant(record.id,record.name,record.rating,record.image_url,record.url,
							record.location.coordinate.longitude,record.location.coordinate.latitude,
							getAddressString(record),getCategories(record),tempTags,record.snippet_image_url,
							record.snippet_text,record.review_count,getDealString(record),record.location.city);
	//alert(rest);
	ary.push(rest);
}
function getCategories(record){
	if(record.categories==null) return "undefined";
	else return record.categories[0][0];
}

function assignDiv(rt){ //input restaurant array
	$("#fav-content").empty();
	var newdivs = new Array(rt.length); 
//	alert("newdivs created");
	for(var i=0; i<newdivs.length;i++)
	{
		$("#fav-content").append(createDiv(rt[i]));
	}
}

function createDiv(restaurant){
	//decide width
	newdiv=document.createElement('div');
	newdiv.setAttribute('class','fav-div'+restaurant.cube);
	newdiv.setAttribute('id',restaurant.id);
	
	if(restaurant.cube==2){
		newdiv.innerHTML="<div class='fav-div-inner'><div class='front face'><div class='fav-bus-rate' style='background:url(./JBresource/stars.png);width:100px;height:20px;background-position:"+ showStars(restaurant.rating) 
						+"'></div><img class='fav-bus-img' src='"+ checkUrlExist(restaurant.picUrl) +"'/><h4 class='fav-bus-name'>"+restaurant.name+"</h4>"
						+ "<p class='fav-bus-loc'><strong class='fav-city'>"+ restaurant.city +"</strong><br><span class='fav-in-titles'>Tags:</span>"+ parseTags(restaurant.tags) +"<br><span class='fav-in-titles'>Category:</span>"+ restaurant.categories 
						+"<br><span class='fav-in-titles'>Distance:</span>"+restaurant.distance+" km<br>"+ checkDeal(restaurant.dealTitle) +"</p>" 
						+"<div class='cover'></div></div><div class='back face'> <img class='reviewpic' src='"+ checkUrlExist(restaurant.reviewPicUrl) +"'><img class='coverback' src='./JBresource/coverback.png'><div class='fav-back-txt'><h4 class='fav-rev-title'>Reviews <span class='fav-rev-count'>("+ restaurant.reviewCount 
						+")</span></h4><p class='fav-rev-txt'> "+ restaurant.reviewText +"</p> </div> <div class='fav-op'><a href='#' onclick=\"addToCompareList(\'"+ restaurant.id +"\');\">Compare</a> | <a href='"+ restaurant.url
						+"' target='_blank'>Yelp</a> | <a href=\"javascript:manageTags(favRestaurant,'"+restaurant.id+"')\">Manage</a></div><img class='fav-div-remove' onclick='deleteFavItem(\""+restaurant.id+"\",favRestaurant);' src='./JBresource/delete.png'></div></div>";
	}
	else{
		newdiv.innerHTML="<div class='fav-div-inner'><div class='front face'><h4 class='fav-bus-name'>"+restaurant.name+"</h4><div class='fav-bus-rate' style='background:url(./JBresource/stars.png);width:100px;height:20px;background-position:"+ showStars(restaurant.rating) 
						+"'></div><img class='fav-bus-img' src='"+ checkUrlExist(restaurant.picUrl) +"'><div class='cover'></div>"
						+ "<p class='fav-bus-loc'><strong class='fav-city'>"+ restaurant.city +"</strong><br><span class='fav-in-titles'>Tags:</span>"+ parseTags(restaurant.tags) +"<br><span class='fav-in-titles'>Category:</span>"+ restaurant.categories 
						+"<br><span class='fav-in-titles'>Distance:</span>"+restaurant.distance+" km<br>"+ checkDeal(restaurant.dealTitle) +"</p>" 
						+"</div><div class='back face'><div class='fav-back-txt'><h4 class='fav-rev-title'>Reviews <span class='fav-rev-count'>("+ restaurant.reviewCount 
						+")</span></h4><p class='fav-rev-txt'> "+ stringcut(restaurant.reviewText) +"...</p><div class='fav-op'><a href='#' onclick=\"addToCompareList(\'"+ restaurant.id +"\');\">Compare</a>|<a href='"+ restaurant.url
						+"' target='_blank'>Yelp</a>|<a href=\"javascript:manageTags(favRestaurant,'"+restaurant.id+"')\">Manage</a></div><img class='fav-div-remove' onclick='deleteFavItem(\""+restaurant.id+"\",favRestaurant);' src='./JBresource/delete.png'> </div> </div></div>";
	}

//	alert('newDiv created');
	return newdiv; 
}

//        ALIGNMENT FUNCTIONS

 
function alignment(RealAry){
	var ary=RealAry.slice();
//	alert("clicked");
	//alert(ary);
	var tmp="";
	for(var i=0;i<ary.length;i++)
		tmp+=ary[i].toString();
	var sum = 0;
	for(var i=0;i<ary.length;i++)
		sum = sum + ary[i].cube;
	switch(sum%4){
		case 0:
			alignCheck(ary);
			break;
		case 1:
			addEmptyInstance(ary,3);
			alignCheck(ary);
			break;
		case 2:
			addEmptyInstance(ary,2);
			alignCheck(ary);
			break;
		case 3:
			addEmptyInstance(ary,1);
			alignCheck(ary);
			break;
		default:
			alert("default");	
	}
	 //alert(ary);
	 assignDiv(ary);
}

function addEmptyInstance(ary,num){
	for(var i=0;i<num;i++)
	ary.push(new Restaurant("empty","empty",1));
}

function alignCheck(ary){
	var str="";
	var acc = 0;	//temp counter
		for(var i = 0;i < ary.length; i++){
				if(parseInt(acc)+parseInt(ary[i].cube)>4) {
					exchangeOne(i,ary);
				}
				str=str+ary[i].cube+" ";
				acc = (parseInt(acc) + parseInt(ary[i].cube));
				if(acc==4) str=str+"|";
				acc = acc%4;
			}
}

function exchangeOne(index,ary){
	for (var i = index; i < ary.length; i++)
	{
		if(ary[i].cube==1) {
			swapElement(ary,index,i);
			break;
		}
	}
}
function swapElement(ary,x,y){
	var temp;
	temp=ary[x]; ary[x]=ary[y]; ary[y]=temp;
}

function storeFavorite(){

	var JSONString=JSON.stringify(favRestaurant);
	//alert("JSONSTRING: "+JSONString);
	storeData('restaurants',JSONString);
}
function loadFavorite(){
	var JSONdata=getData('restaurants');
//	alert("JSONData: "+JSONdata);
	if(JSONdata!=""){
		
		
		$('#welback').css("display","block");
		$('#welback').animate({"opacity":"1"},500);
		setTimeout(function(){$('#welback').animate({"opacity":"0"},500);},2500);
		setTimeout(function(){$('#welback').css({"display":"none"});},3000);
		
		var myObject = JSON.parse(JSONdata);
		favRestaurant=[];
		for(var i=0;i<myObject.length;i++){
			favRestaurant.push(new Restaurant(myObject[i].id,myObject[i].name,myObject[i].rating,myObject[i].picUrl,
												myObject[i].url, myObject[i].longitude,	myObject[i].latitude, myObject[i].address,
												myObject[i].categories,	myObject[i].tags, myObject[i].reviewPicUrl,myObject[i].reviewText,
												myObject[i].reviewCount,myObject[i].dealTitle,myObject[i].city));
		}
	//alert(favRestaurant);
	}
	else {
		$('#welcome').css("display","block");
		$('#welcome').animate({"opacity":"1"},500);
		setTimeout(function(){$('#welcome').animate({"opacity":"0"},500);},2500);
		setTimeout(function(){$('#welcome').css({"display":"none"});},3000);
	};
}
var currentRestaurant;
function fullFilter(fav){
	var sortMethod=document.getElementsByName('fav-sort');
	for(var i=0;i<sortMethod.length;i++) {
	if(sortMethod[i].checked==true){ 
		sortFav(fav,sortMethod[i].value);
		}
	}
	currentRestaurant=[];
	currentRestaurant=fullCityFilter(fullRatingFilter(fullCatFilter(fullTagFilter(fav))));
	alignment(currentRestaurant);
}

function fullTagFilter(fav){
	// Input: favRestaurant, Output: the total filtered result of Tags

	// create checkbox, and return the record array
	// var recordAry=createTagLayout(fav); 
	// need to make sure checkbox are created.

	var checkedAry=[];	
	// calculate unchecked index, store into an array
	var checkboxItem=document.getElementsByName('tagcheckbox');	
	for(var i=0;i<checkboxItem.length;i++){
		if(checkboxItem[i].checked==true) checkedAry.push(checkboxItem[i].value);
	}
	// read the array, and construct matched restaurant iteratively
	var fullTagRestaurant=[];
	for(var i=0;i<fav.length;i++){
		for(var k=0;k<fav[i].tags.length;k++){
			for(var j=0;j<checkedAry.length;j++){
				if(checkedAry[j]==fav[i].tags[k] && !contains(fullTagRestaurant,fav[i])){
					fullTagRestaurant.push(fav[i]);
					break;
				}
			}
		}
	}
//	alert(fullTagRestaurant);
	return fullTagRestaurant;
}
function contains(ary,item){
	for(var i=0;i<ary.length;i++){
		if(ary[i]==item) return true;		
	}
	return false;
}
function createTagLayout(fav){
	if(fav!=null){
	var tagrecord=[];
	var match;
	for(var i=0;i<fav.length;i++){
		for(var k=0;k<fav[i].tags.length;k++){
			for(var j=0;j<tagrecord.length;j++){
				if(tagrecord[j][0]==fav[i].tags[k]) {
					tagrecord[j][1]++;
					match=true;
					break;
				}
				else match=false;
			}
			if(!match)	tagrecord.push(new Array(fav[i].tags[k],1));
		}
	}
	
	// sort by first character
	for(var i=0;i<tagrecord.length-1;i++){
		for(var j=i+1;j<tagrecord.length;j++){
			if(tagrecord[i][0].charAt(0)>tagrecord[j][0].charAt(0)) swapElement(tagrecord,i,j);		
		}
	}
	
	var str="";
	for(var i=0;i<tagrecord.length;i++){
		str=str+"<li><input type='checkbox' class='styled' name='tagcheckbox' value='"+tagrecord[i][0]+"' onclick='fullFilter(favRestaurant);' checked><span ondblclick=\"dblclickFullFilter('tagcheckbox','"+tagrecord[i][0]+"',favRestaurant);\" class=\"radio-txt\">"+tagrecord[i][0]+"("+tagrecord[i][1]+")</span></li>";
	}
//	$("body").append(str);
	return str;
}
}
function fullCatFilter(fav){
	// Input: favRestaurant, Output: the total filtered result of Catgories

	// create checkbox, and return the record array
	// var recordAry=createCatLayout(fav); 
	// need to make sure checkbox are created.

	var checkedAry=[];	
	// calculate unchecked index, store into an array
	var checkboxItem=document.getElementsByName('catcheckbox');	
	for(var i=0;i<checkboxItem.length;i++){
		if(checkboxItem[i].checked==true) checkedAry.push(checkboxItem[i].value);
	}
	// read the array, and construct matched restaurant iteratively
	var fullCatRestaurant=[];
	for(var i=0;i<fav.length;i++){
		for(var j=0;j<checkedAry.length;j++){
			if(checkedAry[j]==fav[i].categories){
				fullCatRestaurant.push(fav[i]);
				break;
			}
		}
	}
//	alert(fullCatRestaurant);
	return fullCatRestaurant;
}
function createCatLayout(fav){
	var catrecord=[];
	var match;
	for(var i=0;i<fav.length;i++){
		for(var j=0;j<catrecord.length;j++){
			if(catrecord[j][0]==fav[i].categories) {
				catrecord[j][1]++;
				match=true;
				break;
			}
			else match=false;
		}
		if(!match)	catrecord.push(new Array(fav[i].categories,1));
	}
	// sort by first character
	for(var i=0;i<catrecord.length-1;i++){
		for(var j=i+1;j<catrecord.length;j++){
			if(catrecord[i][0].charAt(0)>catrecord[j][0].charAt(0)) swapElement(catrecord,i,j);		
		}
	}
	var str="";
	for(var i=0;i<catrecord.length;i++){
		str=str+"<li><input type='checkbox' class='styled' name='catcheckbox' value='"+catrecord[i][0]+"' onclick='fullFilter(favRestaurant);' checked><span ondblclick=\"dblclickFullFilter('catcheckbox','"+catrecord[i][0]+"',favRestaurant);\" class=\"radio-txt\">"+catrecord[i][0]+"("+catrecord[i][1]+")</span></li>";
	}
//	$("body").append(str);
	return str;
}

function fullCityFilter(fav){
	// Input: favRestaurant, Output: the total filtered result of Catgories

	// create checkbox, and return the record array
	// var recordAry=createCatLayout(fav); 
	// need to make sure checkbox are created.

	var checkedAry=[];	
	// calculate unchecked index, store into an array
	var checkboxItem=document.getElementsByName('citycheckbox');	
	for(var i=0;i<checkboxItem.length;i++){
		if(checkboxItem[i].checked==true) checkedAry.push(checkboxItem[i].value);
	}
	// read the array, and construct matched restaurant iteratively
	var fullCityRestaurant=[];
	for(var i=0;i<fav.length;i++){
		for(var j=0;j<checkedAry.length;j++){
			if(checkedAry[j]==fav[i].city){
				fullCityRestaurant.push(fav[i]);
				break;
			}
		}
	}
//	alert(fullCityRestaurant);
	return fullCityRestaurant;
}
function createCityLayout(fav){
	var cityrecord=[];
	var match;
	for(var i=0;i<fav.length;i++){
		for(var j=0;j<cityrecord.length;j++){
			if(cityrecord[j][0]==fav[i].city) {
				cityrecord[j][1]++;
				match=true;
				break;
			}
			else match=false;
		}
		if(!match)	cityrecord.push(new Array(fav[i].city,1));
	}
		// sort by first character
	for(var i=0;i<cityrecord.length-1;i++){
		for(var j=i+1;j<cityrecord.length;j++){
			if(cityrecord[i][0].charAt(0)>cityrecord[j][0].charAt(0)) swapElement(cityrecord,i,j);		
		}
	}
	var str="";
	for(var i=0;i<cityrecord.length;i++){
		str=str+"<li><input type='checkbox' class='styled' name='citycheckbox' value='"+cityrecord[i][0]+"' onclick='fullFilter(favRestaurant);' checked><span ondblclick=\"dblclickFullFilter('citycheckbox','"+cityrecord[i][0]+"',favRestaurant);\" class=\"radio-txt\">"+cityrecord[i][0]+"("+cityrecord[i][1]+")</></li>";
	}
//	$("body").append(str);
	return str;
}

function fullRatingFilter(fav){
	// Input: favRestaurant, Output: the total filtered result of Catgories

	// create checkbox, and return the record array
	// var recordAry=createRatingLayout(fav); 
	// need to make sure checkbox are created.

	var checkedAry=[];	
	// calculate unchecked index, store into an array
	var checkboxItem=document.getElementsByName('ratingcheckbox');	
	for(var i=0;i<checkboxItem.length;i++){
		if(checkboxItem[i].checked==true) checkedAry.push(checkboxItem[i].value);
	}
	// read the array, and construct matched restaurant iteratively
	var fullRatingRestaurant=[];
	for(var i=0;i<fav.length;i++){
		for(var j=0;j<checkedAry.length;j++){
			if(checkedAry[j]==Math.ceil(fav[i].rating)){
				fullRatingRestaurant.push(fav[i]);
				break;
			}
		}
	}
//	alert(fullRatingRestaurant);
	return fullRatingRestaurant;
}
function createRatingLayout(fav){
	var ratingrecord=[];
	for(var i=1;i<=5;i++)	ratingrecord.push(new Array(i,0));
	var match;
	for(var i=0;i<fav.length;i++){
		ratingrecord[Math.ceil(fav[i].rating)-1][1]++;
	}
	var str="";
	
	for(var i=0;i<ratingrecord.length;i++){
		str=str+"<li><input type='checkbox' class='styled' name='ratingcheckbox' value='"+ratingrecord[i][0]+"' onclick='fullFilter(favRestaurant);' checked><span ondblclick=\"dblclickFullFilter('ratingcheckbox','"+ratingrecord[i][0]+"',favRestaurant);\" class=\"radio-txt\">"
				+ratingFix(ratingrecord[i][0]-0.5)+" - "+(ratingrecord[i][0])+".0 ("+ratingrecord[i][1]+")</span></li>";
	}
//	$("body").append(str);
	return str;
}
function ratingFix(num){
	if(num==0.5) return "0.0";
	else return num;
}
// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

function createFullLayout(fav){		//first time use (document.ready?)
	var str=""
	$('#filtercategory').append(createCatLayout(fav));
	$('#filtertag').append(createTagLayout(fav));
	$('#filterrate').append(createRatingLayout(fav));
	$('#filtercities').append(createCityLayout(fav));
	$('#filterend').html("<div class='tag-button' id='reset' onclick='FullLayoutReset();createFullLayout(favRestaurant);fullFilter(favRestaurant);'>Reset</div>");
}
function FullLayoutReset(){
	$('#filtercategory').html("");
	$('#filtertag').html("");
	$('#filterrate').html("");
	$('#filtercities').html("");
}
function refreshFullLayout(fav){	//after first time use
	//clean Div and remember unchecked items
	var ratingcheckedAry=[];	
	var ratingcheckboxItem=document.getElementsByName('ratingcheckbox');	
	for(var i=0;i<ratingcheckboxItem.length;i++){
		if(ratingcheckboxItem[i].checked==false) ratingcheckedAry.push(ratingcheckboxItem[i].value);
	}
	var catcheckedAry=[];	
	var catcheckboxItem=document.getElementsByName('catcheckbox');	
	for(var i=0;i<catcheckboxItem.length;i++){
		if(catcheckboxItem[i].checked==false) catcheckedAry.push(catcheckboxItem[i].value);
	}
	var citycheckedAry=[];	
	var citycheckboxItem=document.getElementsByName('citycheckbox');	
	for(var i=0;i<citycheckboxItem.length;i++){
		if(citycheckboxItem[i].checked==false) citycheckedAry.push(citycheckboxItem[i].value);
	}
	var tagcheckedAry=[];	
	var tagcheckboxItem=document.getElementsByName('tagcheckbox');	
	for(var i=0;i<tagcheckboxItem.length;i++){
		if(tagcheckboxItem[i].checked==false) tagcheckedAry.push(tagcheckboxItem[i].value);
	}
	$('#filtercategory').html("");
	$('#filtertag').html("");
	$('#filtercities').html("");
	$('#filterrate').html("");
	//recover
	var str=""
	$('#filtercategory').append(createCatLayout(fav));
	$('#filtertag').append(createTagLayout(fav));
	$('#filterrate').append(createRatingLayout(fav));
	$('#filtercities').append(createCityLayout(fav));

	tagcheckboxItem=document.getElementsByName('tagcheckbox');
	for(var i=0;i<tagcheckedAry.length;i++){
		for(var j=0;j<tagcheckboxItem.length;j++)
			if(tagcheckboxItem[j].value==tagcheckedAry[i]) {
				tagcheckboxItem[j].checked=false;
			}
		}
	ratingcheckboxItem=document.getElementsByName('ratingcheckbox');
	for(var i=0;i<ratingcheckedAry.length;i++){
		for(var j=0;j<ratingcheckboxItem.length;j++)
			if(ratingcheckboxItem[j].value==ratingcheckedAry[i]) {
				ratingcheckboxItem[j].checked=false;
			}
		}
	catcheckboxItem=document.getElementsByName('catcheckbox');
	for(var i=0;i<catcheckedAry.length;i++){
		for(var j=0;j<catcheckboxItem.length;j++)
			if(catcheckboxItem[j].value==catcheckedAry[i]) {
				catcheckboxItem[j].checked=false;
			}
		}
	citycheckboxItem=document.getElementsByName('citycheckbox');
	for(var i=0;i<citycheckedAry.length;i++){
		for(var j=0;j<citycheckboxItem.length;j++)
			if(citycheckboxItem[j].value==citycheckedAry[i]) {
				citycheckboxItem[j].checked=false;
			}
		}

}
function deleteFavItem(id,fav){
	var r=confirm('Do you want to remove this business from your favorites?');
	if (r==false) return;
	for(var i=0;i<fav.length;i++){
		if(id==fav[i].id) {
			fav.remove(i);
		}
	}
	storeFavorite();
	refreshFullLayout(fav);
	fullFilter(fav);
	$('#removed').css("display","block");
	$('#removed').animate({"opacity":"1"},500);
	setTimeout(function(){$('#removed').animate({"opacity":"0"},500);},2500);
	setTimeout(function(){$('#removed').css({"display":"none"});},3000);
}


function showAddDialog(index){
	var contains=false;
	for(var i=0;i<favRestaurant.length;i++){
		if(favRestaurant[i].id==tempRestaurant[index].id){
			contains=true;
			break;
		}	
	}
	if(!contains){ 
	$('#screen-cover').css("display","block");
	$('#add-dialog').html("");
	$('#add-dialog').append(createTagLayoutMini(favRestaurant,index));
	}
	else {
		$('#exist').css("display","block");
		$('#exist').animate({"opacity":"1"},500);
		setTimeout(function(){$('#exist').animate({"opacity":"0"},500);},2500);
		setTimeout(function(){$('#exist').css({"display":"none"});},3000);
	};
}

function checkDeal(dealTitle){
	if((dealTitle!=undefined)&&(dealTitle!=''))
	return "<span style='color:#A9CEE6' class='fav-in-titles'>Deal:</span>"+dealTitle;
	else
	return '';
}

function parseTags(tags){
	var str="";
	if(tags==undefined) return '';
	for(var i=0;i<tags.length;i++)
	{
		
		if(i==3) 
		{
			str+="...";
			return str
		}
		else if(i==tags.length-1)
			str+=tags[i];
		else
			str+=tags[i]+',';
			
	}
	return str;
}


function parseTagsForCompare(tags){
	var str="";
	if(tags==undefined) return '';
	for(var i=0;i<tags.length;i++)
	{
		if(i==3) 
		{
			str+="...";
			return str
		}
		else	
			str+=tags[i]+'<br>';
			
	}
	return str;
}

function createTagLayoutMini(fav,index){
	var tagrecord=[];
	var match;
	for(var i=0;i<fav.length;i++){
		for(var k=0;k<fav[i].tags.length;k++){
			for(var j=0;j<tagrecord.length;j++){
				if(tagrecord[j][0]==fav[i].tags[k]) {
					tagrecord[j][1]++;
					match=true;
					break;
				}
				else match=false;
			}
			if(!match)	tagrecord.push(new Array(fav[i].tags[k],1));
		}
		
	}
	
	// sort by first character
	for(var i=0;i<tagrecord.length-1;i++){
		for(var j=i+1;j<tagrecord.length;j++){
			if(tagrecord[i][0].charAt(0)>tagrecord[j][0].charAt(0)) swapElement(tagrecord,i,j);		
		}
	}
	
	var str="<h2 id='add-boxtitle'>Add Favorite.</h2>";
	str=str+"<div id='add-boxcontent'><h3 class='add-box-opt'>Exist Tags:</h3><div id='ext-tag-box'><ul>";
	for(var i=0;i<tagrecord.length;i++){
		str=str+"<li><input type='checkbox' class='styled' name='tagcheckboxmini' value='"+tagrecord[i][0]+"' onclick=''><span class='radio-txt'>"+tagrecord[i][0]+"</span>";
	}
	str=str+"</ul></div><h3 class='add-box-opt'>Create New Tag:</h3> ";
	str=str+"<input type='text' id='add-tag-text' value=''>"+"<div id='add-tag-button' class='tag-button' onclick=\"appendTagtoDiv(document.getElementById('add-tag-text').value,'add-tag-div');\">Add</div></li>";
	str=str+"<div id='add-tag-div'></div>";
	str=str+"<div id='cancel-tag' class='tag-button' onclick=\"HideDialog();\">Cancel</div><div id='save-tag' class='tag-button' onclick=\"createTagsCollection("+index+");\">Save</div></div>"
	return str;
}
function appendTagtoDiv(text,divid){
	var str="<div class='tag-div' name='add-tags-collection' style=\"display: block\" id='"+text+"-li'><img class='new-tag-del' onclick=\"this.style.display='none';document.getElementById('"+text+"-li').style.display='none';\" src='./JBresource/delete.png'>"
	str=str+text+"</div>";
	if(text!=""){
		$("#"+divid).append(str);
		$("#add-tag-text").val("");
	}
}
function createTagsCollection(index){
	var checkboxTags=document.getElementsByName('tagcheckboxmini');
	var createdTags=document.getElementsByName('add-tags-collection');
	var array=[];
	for(var i=0;i<checkboxTags.length;i++){
		if(checkboxTags[i].checked==true) array.push(checkboxTags[i].value);
		}
		
	var match=false;
	for(var i=0;i<createdTags.length;i++){
		for(var j=0;j<array.length;j++){
				if(array[j]==createdTags[i].id.split("-li")[0]) {
					match=true;
					break;
					}
				else match=false;
				}
		if(match==false && createdTags[i].style.display=='block') array.push(createdTags[i].id.split('-li')[0]);
		}
		if(array=="") array.push('Others');
		addFavoriteFromTemp(index,array);
		$('#screen-cover').css("display","none");
		$('#favadded').css("display","block");
		$('#favadded').animate({"opacity":"1"},500);
		setTimeout(function(){$('#favadded').animate({"opacity":"0"},500);},2500);
		setTimeout(function(){$('#favadded').css({"display":"none"});},3000);
	}
function sortFav(fav,method){
	switch(method){
		case 0:	//rating
		for(var i=0;i<fav.length-1;i++){
			for(var j=i+1;j<fav.length;j++){
				if(fav[i].rating<fav[j].rating) swapElement(fav,i,j);		
			}
		}
		storeFavorite();
		break;
		case 1:	//distance
		for(var i=0;i<fav.length-1;i++){
			for(var j=i+1;j<fav.length;j++){
				if(fav[i].distance>fav[j].distance) swapElement(fav,i,j);		
			}
		}		
		storeFavorite();
		break;
		case 2:	//most reviewed
		for(var i=0;i<fav.length-1;i++){
			for(var j=i+1;j<fav.length;j++){
				if(fav[i].reviewCount<fav[j].reviewCount) swapElement(fav,i,j);		
			}
		}
		storeFavorite();
		break;
	}
}



function manageTags(fav,id){
	$('#screen-cover').css("display","block");
	$('#add-dialog').html("");
	var tagrecord=[];
	var match;
	for(var i=0;i<fav.length;i++){
		for(var k=0;k<fav[i].tags.length;k++){
			for(var j=0;j<tagrecord.length;j++){
				if(tagrecord[j][0]==fav[i].tags[k]) {
					tagrecord[j][1]++;
					match=true;
					break;
				}
				else match=false;
			}
			if(!match)	tagrecord.push(new Array(fav[i].tags[k],1));
		}
		
	}
	// sort by first character
	for(var i=0;i<tagrecord.length-1;i++){
		for(var j=i+1;j<tagrecord.length;j++){
			if(tagrecord[i][0].charAt(0)>tagrecord[j][0].charAt(0)) swapElement(tagrecord,i,j);		
		}
	}
	var ThisRestaurant;
	for(var i=0;i<fav.length;i++){
		if(id==fav[i].id) ThisRestaurant=fav[i];
	}
	
	/*
	 var str="<h2 id='add-boxtitle'>Add Favorite.</h2>";
	str=str+"<div id='add-boxcontent'><h3 class='add-box-opt'>Exist Tags:</h3><div id='ext-tag-box'><ul>";
	for(var i=0;i<tagrecord.length;i++){
		str=str+"<li><input type='checkbox' class='styled' name='tagcheckboxmini' value='"+tagrecord[i][0]+"' onclick=''><span class='radio-txt'>"+tagrecord[i][0]+"<br>";
	}
	str=str+"</ul></div><h3 class='add-box-opt'>Create New Tag:</h3> ";
	str=str+"<input type='text' id='add-tag-text' value=''>"+"<div id='add-tag-button' class='tag-button' onclick=\"appendTagtoDiv(document.getElementById('add-tag-text').value,'add-tag-div');\">Add</div></li>";
	str=str+"<div id='add-tag-div'></div>";
	str=str+"<div id='cancel-tag' class='tag-button' onclick=\"HideDialog();\">Cancel</div><div id='save-tag' class='tag-button' onclick=\"createTagsCollection("+index+");\">Save</div></div>"
	return str;
	
	var str="<div class='tag-div' name='add-tags-collection' style=\"display: block\" id='"+text+"-li'><img class='new-tag-del' onclick=\"this.style.display='none';document.getElementById('"+text+"-li').style.display='none';\" src='./JBresource/delete.png'>"
	str=str+text+"</div>";
	if(text!=""){
		$("#"+divid).append(str);
		$("#add-tag-text").val(""); 
	 */
	
	
	var str="<h2 id='mng-boxtitle'>Manage Favorite Tags.</h2>";
	str=str+"<div id='mng-boxcontent'><h3 class='add-box-opt'>Exist Tags:</h3><div id='ext-tag-box-mng'><ul>";
	for(var i=0;i<tagrecord.length;i++){
		str=str+"<li><input type='checkbox' class='styled' name='tagcheckboxfav' value='"+tagrecord[i][0]+"' onclick=''"+checkTags(tagrecord[i][0],ThisRestaurant.tags)+"><span class='radio-txt'>"+tagrecord[i][0]+"</span>";
	}
	str=str+"</ul></div><h3 class='add-box-opt'>Create New Tag:</h3> ";
	str=str+"<input type='text' id='add-tag-text-fav' value=''>"+"<div id='mng-tag-button' class='tag-button' onclick=\"appendManageTagtoDiv(document.getElementById('add-tag-text-fav').value,'mng-tag-div');\">Add</div></li>";
	str=str+"<div id='mng-tag-div'></div>";
	str=str+"<div id='cancel-tag-mng' class='tag-button' onclick=\"HideDialog();\">Cancel</div><div id='save-tag-mng' class='tag-button' onclick=\"manageTagsCollection(favRestaurant,'"+id+"');\">Save</div></div>";
	//alert('part5: str: '+str);
	$('#add-dialog').append(str);
	return str;
	
}
function appendManageTagtoDiv(text,divid){
	var str="<div class='tag-div' name='add-tags-collection-fav' style=\"display: block\" id='"+text+"-li'><img class='new-tag-del' onclick=\"this.style.display='none';document.getElementById('"+text+"-li').style.display='none';\" src='./JBresource/delete.png'>"
	str=str+text+"</div>";
	if(text!=""){
		$("#"+divid).append(str);
		$("#mng-tag-div").val("");
	}
}
function manageTagsCollection(fav,index){
	var checkboxTags=document.getElementsByName('tagcheckboxfav');
	var createdTags=document.getElementsByName('add-tags-collection-fav');
	var array=[];
	for(var i=0;i<checkboxTags.length;i++){
		if(checkboxTags[i].checked==true) array.push(checkboxTags[i].value);
		}
	var match=false;
	for(var i=0;i<createdTags.length;i++){
		for(var j=0;j<array.length;j++){
				if(array[j]==createdTags[i].id.split('-li')[0]) {
					match=true;
					break;
					}
				else match=false;
				}
		if(match==false && createdTags[i].style.display=='block') array.push(createdTags[i].id.split('-li')[0]);
		}
		if(array=="") array.push('Others');
		var ThisRestaurant;
		for(var i=0;i<fav.length;i++){
			if(index==fav[i].id) ThisRestaurant=fav[i];
			}
		ThisRestaurant.tags=array;
		storeFavorite();
		refreshFullLayout(fav);
		fullFilter(fav);
		$('#screen-cover').css("display","none");
		$('#changesaved').css("display","block");
		$('#changesaved').animate({"opacity":"1"},500);
		setTimeout(function(){$('#changesaved').animate({"opacity":"0"},500);},2500);
		setTimeout(function(){$('#changesaved').css({"display":"none"});},3000);
	}
function checkTags(item,tags){
	for(var i=0;i<tags.length;i++){
		if(item==tags[i]) return "checked";
	}
	return "";
	
}
function checkUrlExist(url){
	if(url==null) return "./JBresource/noImageAvailable1.JPG";
	else return url;
	
}

function dblclickFullFilter(name,value,fav){
	var checkboxItems=document.getElementsByName(name);
	for(var i=0;i<checkboxItems.length;i++){
		if(checkboxItems[i].value==value) checkboxItems[i].checked=true;
		else checkboxItems[i].checked=false;
	}
	fullFilter(fav);
}
function stringcut(str){
	if (str!=undefined)
	{
		return str.substring(0,100);
	}
	else
	return "";
}

function getNowCoordinate(address,result){	//After computing, and then loadFavorite.
	if(result!=null){
		NowCoordinate[0]=result[0];	//longitude
		NowCoordinate[1]=result[1];	//latitude
		NowAddress=address;
		storeLocation();
		//alert('address: '+NowAddress);
		//alert('result: '+NowCoordinate);
		}
	else {$('#validadd').css("display","block");
		$('#validadd').animate({"opacity":"1"},500);
		setTimeout(function(){$('#validadd').animate({"opacity":"0"},500);},2500);
		setTimeout(function(){$('#validadd').css({"display":"none"});},3000);};
}

function loadScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "http://maps.google.com/maps/api/js?key=AIzaSyD9bkEUd4rLKk-hb-EKDf8D5JOj4Ff1hUY&sensor=false&callback=initialize";
  document.body.appendChild(script);
}
  
window.onload = loadScript;
