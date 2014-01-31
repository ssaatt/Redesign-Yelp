function Restaurant(id,name,rating,picUrl,url,longitude,latitude,address,categories,tags,reviewPicUrl,reviewText,reviewCount,dealTitle){
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
	
	if(this.rating>=4) this.cube=2;
	else this.cube=1;	
	this.toString = function(){
		return "(name: "+this.name+", rating: "+this.rating+", cube: "+this.cube+")";
	}
}
var favRestaurant=new Array(5);
	favRestaurant[0]=new Restaurant("amici-2-new-york","Amici 2",3.5,"http://s3-media1.ak.yelpcdn.com/bphoto/RxvLBtUi_S_imOlh7B6v4A/ms.jpg",
									"http://www.yelp.com/biz/amici-2-new-york",-73.9972318,40.7197281,"165 Mulberry St<br>(b/t Grand St & Broome St)<br>Little Italy<br>New York, NY 10013<br>Phone: 2123343869"
									,"Italian",tempTags,"http://s3-media1.ak.yelpcdn.com/photo/M3rE9bDPnoJQNO23NozdJg/ms.jpg","I had taken my wife, 2 kids and mother to Amici II after spending a day in the city.   I work in NY but rarely get to play tourist with my family so I...",
									46,"$20 for $25");
	favRestaurant[1]=new Restaurant("la-lucha-nyc-new-york","La Lucha NYC",4.5,"http://s3-media1.ak.yelpcdn.com/bphoto/RxvLBtUi_S_imOlh7B6v4A/ms.jpg",
									"http://www.yelp.com/biz/amici-2-new-york",-73.9972318,40.7197281,"165 Mulberry St<br>(b/t Grand St & Broome St)<br>Little Italy<br>New York, NY 10013<br>Phone: 2123343869"
									,"Italian",tempTags,"http://s3-media1.ak.yelpcdn.com/photo/M3rE9bDPnoJQNO23NozdJg/ms.jpg","I had taken my wife, 2 kids and mother to Amici II after spending a day in the city.   I work in NY but rarely get to play tourist with my family so I...",
									46,"$20 for $25");
	favRestaurant[2]=new Restaurant("alewife-nyc-long-island-city-2","Alewife NYC",3,"http://s3-media1.ak.yelpcdn.com/bphoto/RxvLBtUi_S_imOlh7B6v4A/ms.jpg",
									"http://www.yelp.com/biz/amici-2-new-york",-73.9972318,40.7197281,"165 Mulberry St<br>(b/t Grand St & Broome St)<br>Little Italy<br>New York, NY 10013<br>Phone: 2123343869"
									,"Italian",tempTags,"http://s3-media1.ak.yelpcdn.com/photo/M3rE9bDPnoJQNO23NozdJg/ms.jpg","I had taken my wife, 2 kids and mother to Amici II after spending a day in the city.   I work in NY but rarely get to play tourist with my family so I...",
									46,"$20 for $25");
	favRestaurant[3]=new Restaurant("bonchon-manhattan-3","BonChon",3.5,"http://s3-media1.ak.yelpcdn.com/bphoto/RxvLBtUi_S_imOlh7B6v4A/ms.jpg",
									"http://www.yelp.com/biz/amici-2-new-york",-73.9972318,40.7197281,"165 Mulberry St<br>(b/t Grand St & Broome St)<br>Little Italy<br>New York, NY 10013<br>Phone: 2123343869"
									,"Italian",tempTags,"http://s3-media1.ak.yelpcdn.com/photo/M3rE9bDPnoJQNO23NozdJg/ms.jpg","I had taken my wife, 2 kids and mother to Amici II after spending a day in the city.   I work in NY but rarely get to play tourist with my family so I...",
									46,"$20 for $25");
	favRestaurant[4]=new Restaurant("stecchino-new-york","Stecchino",5,"http://s3-media1.ak.yelpcdn.com/bphoto/RxvLBtUi_S_imOlh7B6v4A/ms.jpg",
									"http://www.yelp.com/biz/amici-2-new-york",-73.9972318,40.7197281,"165 Mulberry St<br>(b/t Grand St & Broome St)<br>Little Italy<br>New York, NY 10013<br>Phone: 2123343869"
									,"Italian",tempTags,"http://s3-media1.ak.yelpcdn.com/photo/M3rE9bDPnoJQNO23NozdJg/ms.jpg","I had taken my wife, 2 kids and mother to Amici II after spending a day in the city.   I work in NY but rarely get to play tourist with my family so I...",
									46,"$20 for $25");
	//id,picUrl,url,name,distance,rating,address,phone,categories,tags
var tempRestaurant; //20 items, initiated after success


function addFavoriteFromTemp(num){
	//pushRecordtoArray(tempRestaurant[num],favRestaurant);
	favRestaurant.push(tempRestaurant[num]);
	alert(favRestaurant);
}
var tempTags=["Family","Couple"];
function pushRecordtoArray(record,ary){
	var rest=new Restaurant(record.id,record.name,record.rating,record.image_url,record.url,
							record.location.coordinate.longitude,record.location.coordinate.latitude,
							getAddressString(record),record.phone,record.categories,tempTags,record.snippet_image_url,
							record.snippet_text,record.review_count,getDealString(record));
	ary.push(rest);
}
function assignDiv(rt){ //input restaurant array
	var newdivs = new Array(rt.length); 
//	alert("newdivs created");
	for(var i=0; i<newdivs.length;i++)
	{
		$("body").append(createDiv(rt[i]));
	}
}

function createDiv(restaurant){
	//decide width
	var align;
	if(restaurant.cube==1)align="25%";
	else align="50%";
	newdiv=document.createElement('div');
	newdiv.setAttribute('id',restaurant.id);
	newdiv.innerHTML=restaurant.name;
	newdiv.setAttribute('style', "width:"+align+"; height:100px; float:left; background-color:red;");
//	alert('newDiv created');
	return newdiv;
}

//        ALIGNMENT FUNCTIONS

 
function alignment(RealAry){
	var ary=RealAry.slice();
//	alert("clicked");
	alert(ary);
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
	 alert(ary);
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
	alert("JSONSTRING: "+JSONString);
	storeData('restaurants',JSONString);
}
function loadFavorite(){
	var JSONdata=getData('restaurants');
	alert("JSONData: "+JSONdata);
	var myObject = JSON.parse(JSONdata);
	favRestaurant=[];
	for(var i=0;i<myObject.length;i++){
		favRestaurant.push(new Restaurant(myObject[i].id,myObject[i].name,myObject[i].rating,myObject[i].picUrl,
											myObject[i].url, myObject[i].longitude,	myObject[i].latitude, myObject[i].address,
											myObject[i].categories,	myObject[i].tags, myObject[i].reviewPicUrl,myObject[i].reviewText,
											myObject[i].reviewCount,myObject[i].dealTitle,myObject[i].cube));
	}
	alert(favRestaurant);
}
