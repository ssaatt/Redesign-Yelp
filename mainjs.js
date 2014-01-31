/**  mainjs.js
 * @author Binyan Chen
 */
(function($)  
{  
    jQuery.fn.setfocus = function()  
    {  
        return this.each(function()  
        {  
            var dom = this;  
            setTimeout(function()  
            {  
                try { dom.focus(); } catch (e) { }   
            }, 0);  
        });  
    };  
})(jQuery); 

$(document).ready(function(){
	loadLocation();
	loadFavorite();
	sortFav(favRestaurant,0);
	createFullLayout(favRestaurant);
	alignment(favRestaurant);
	$("#nav-favorites").mouseenter(function(){
		HideComparebox();
		HideSearchbox();
	});
	
	$("#nav-search").mouseenter(function(){
		HideComparebox();
		//alert("hi");
		if(document.getElementById("searchbox").style.display=="none")
		{
			$("#nav-search").css('background-position','0px -100px');
	
		    setTimeout(ShowSearchbox,220);

		}	
	});
	$("#searchbox").mouseleave(function(){
		
			HideSearchbox();
	});
	
	$("#nav-compare").mouseenter(function(){
		HideSearchbox();
		if(document.getElementById("comparebox").style.display=="none")
		{
			$("#nav-compare").css('background-position','-324px -100px');
		    setTimeout(ShowComparebox,220);
		}	
	});
	$("#comparebox").mouseleave(function(){
		
			HideComparebox();
	});
	
	$("#nav-doc").mouseenter(function(){
		HideComparebox();
		HideSearchbox();
	});
	
	$("#nav-favorites").click(function(){
		loadFavorite();
		refreshFullLayout(favRestaurant);
		fullFilter(favRestaurant);
		ShowFavorite();
	});
	$("#sbutton").click(function(){
		ShowSearch();
		
	});
	$("#cbutton").click(function(){
		loadFavorite();
		createCompareTable(CompareList);
		ShowCompare();
		var mapNode=document.getElementById('map_canvas');
		setTimeout(function(){$('#mapcontainer').append(mapNode)},100);
		setTimeout(function(){$('#map_canvas').css("visibility","visible")},100);
		setTimeout(function(){$('#map_canvas').css("display","block")},100);
		generatePinnedMap();
	});
	$("#screen-cover").click(function(){
		HideDialog();
	});
	$("#nav-doc").click(function(){
		ShowSetLocation();
	});
});

function ShowSearch(){
	$(".container").css("display","none");
	$("#searchresults").css("display","block");
}
function ShowFavorite(){
	$('#loadingbox').css("display","none");
	$(".container").css("display","none");
	$("#favoriteresults").css("display","block");
}
function ShowCompare(){
	$(".container").css("display","none");
	$("#compareresults").css("display","block");
}
function ShowSetLocation(){
	$(".container").css("display","none");
	$("#setlocation").css("display","block");
}

function ShowSearchbox(){
		
		document.getElementById("searchbox").style.display="block";
		setTimeout(function(){$("#searchbox").css('height','10px')},10);
		setTimeout(function(){$("#searchbox").css('height','30px')},30);
		setTimeout(function(){$("#searchbox").css('height','50px')},50);
		setTimeout(function(){$("#searchbox").css('height','70px')},70);
		setTimeout(function(){$("#searchbox").css('height','90px')},90);
		setTimeout(function(){$("#searchbox").css('height','110px')},110);
		setTimeout(function(){$("#searchbox").css('height','130px')},130);
		setTimeout(function(){$("#searchboxcontent").css('display','block')},140);
		setTimeout(function(){$("#searchboxcontent").css('opacity','0.2')},160);
		setTimeout(function(){$("#searchboxcontent").css('opacity','0.4')},180);
		setTimeout(function(){$("#searchboxcontent").css('opacity','0.7')},200);
		setTimeout(function(){$("#searchboxcontent").css('opacity','1')},220);
		setTimeout(function(){$('#queryfield').setfocus()},230);
}
function HideSearchbox(){
		$("#nav-search").css('background-position','0px 0px');
		setTimeout(function(){$("#searchboxcontent").css('opacity','0.7')},10);
		setTimeout(function(){$("#searchboxcontent").css('opacity','0.4')},20);
		setTimeout(function(){$("#searchboxcontent").css('opacity','0.1')},30);
		setTimeout(function(){$("#searchboxcontent").css('display','none')},40);
		setTimeout(function(){$("#searchbox").css('height','110px')},50);
		setTimeout(function(){$("#searchbox").css('height','90px')},70);
		setTimeout(function(){$("#searchbox").css('height','70px')},90);
		setTimeout(function(){$("#searchbox").css('height','50px')},110);
		setTimeout(function(){$("#searchbox").css('height','30px')},130);
		setTimeout(function(){$("#searchbox").css('height','10px')},150);
		setTimeout(function(){document.getElementById("searchbox").style.display="none";},170);

}
function ShowComparebox(){
		
		document.getElementById("comparebox").style.display="block";
		setTimeout(function(){$("#comparebox").css('height','10px')},10);
		setTimeout(function(){$("#comparebox").css('height','30px')},30);
		setTimeout(function(){$("#comparebox").css('height','50px')},50);
		setTimeout(function(){$("#comparebox").css('height','70px')},70);
		setTimeout(function(){$("#comparebox").css('height','90px')},90);
		setTimeout(function(){$("#comparebox").css('height','110px')},110);
		setTimeout(function(){$("#comparebox").css('height','130px')},130);
		setTimeout(function(){$("#compareboxcontent").css('display','block')},140);
		setTimeout(function(){$("#compareboxcontent").css('opacity','0.2')},160);
		setTimeout(function(){$("#compareboxcontent").css('opacity','0.4')},180);
		setTimeout(function(){$("#compareboxcontent").css('opacity','0.7')},200);
		setTimeout(function(){$("#compareboxcontent").css('opacity','1')},220);
}
function HideComparebox(){
		$("#nav-compare").css('background-position','-324px 0px');
		setTimeout(function(){$("#compareboxcontent").css('opacity','0.7')},10);
		setTimeout(function(){$("#compareboxcontent").css('opacity','0.4')},20);
		setTimeout(function(){$("#compareboxcontent").css('opacity','0.1')},30);
		setTimeout(function(){$("#compareboxcontent").css('display','none')},40);
		setTimeout(function(){$("#comparebox").css('height','110px')},50);
		setTimeout(function(){$("#comparebox").css('height','90px')},70);
		setTimeout(function(){$("#comparebox").css('height','70px')},90);
		setTimeout(function(){$("#comparebox").css('height','50px')},110);
		setTimeout(function(){$("#comparebox").css('height','30px')},130);
		setTimeout(function(){$("#comparebox").css('height','10px')},150);
		setTimeout(function(){document.getElementById("comparebox").style.display="none";},170);

}
	var CompareList = [];
function addToCompareList(id){
	var i;
	for(i=0;i<CompareList.length;i++)
	{
		if (CompareList[i]==id)
		{
		$('#alcompare').css("display","block");
		$('#alcompare').animate({"opacity":"1"},500);
		setTimeout(function(){$('#alcompare').animate({"opacity":"0"},500);},2500);
		setTimeout(function(){$('#alcompare').css({"display":"none"});},3000);
			return;
		}
	}
	
		if(CompareList.length<6){
			CompareList.push(id);
			$('#addedtolist').css("display","block");
			$('#addedtolist').animate({"opacity":"1"},500);
			setTimeout(function(){$('#addedtolist').animate({"opacity":"0"},500);},2500);
			setTimeout(function(){$('#addedtolist').css({"display":"none"});},3000);
			
			
			refreshCompareBox();
		}
		else{
			$('#full').css("display","block");
			$('#full').animate({"opacity":"1"},500);
			setTimeout(function(){$('#full').animate({"opacity":"0"},500);},2500);
			setTimeout(function(){$('#full').css({"display":"none"});},3000);
		}
}

function refreshCompareBox(){
	$('#comparelistcontainer').empty();
	var i;
	var tempName;
	for(i=0;i<CompareList.length;i++)
	{
		for(var j=0; j<favRestaurant.length; j++)
		{
			if (CompareList[i]==favRestaurant[j].id)
			  tempName=favRestaurant[j].name;
		}
		$('#comparelistcontainer').append("<div class='div-for-compare'>"+tempName+"<img class='compare-del' onclick='removeCompare("+ i +")' src='./JBresource/delete.png'></div>");
	}
}

function removeCompare(i)
{
	var firsthalf=CompareList.slice(0,i);
	var secondhalf=CompareList.slice(i+1,CompareList.length);
	CompareList = firsthalf.concat(secondhalf);
	refreshCompareBox();
}
function clearCompareList(){
	CompareList=[];
	refreshCompareBox();
}

function searchKeyPress(e){
	if(typeof e == 'undefined' && window.event) { e=window.event;}
	if(e.keyCode == 13) {document.getElementById('sbutton').click();}
}
function HideDialog(){
	if((event.target.id=='screen-cover')||(event.target.id=='cancel-tag')||(event.target.id=='cancel-tag-mng')){
			$("#screen-cover").css("display","none");
		}
}

function createCompareTable(CompareList){
	
	var comdivid;
	var tempRest;
	for(var i=0; i<6; i++)
	{
		comdivid="#com"+(i+1);
		$(comdivid).empty();
		$(comdivid).css("background","none");
	}
	
	for(var i=0; i<6; i++)
	{
		comdivid="#com"+(i+1);
		if(i<CompareList.length)
		{
			for(var j=0; j<favRestaurant.length; j++)
			{
				if(CompareList[i]==favRestaurant[j].id)
				{
					$(comdivid).append(createCompareDiv(i,j));
				}
			}
		}
		else{
			$(comdivid).css("background","#404040");
		}
		
	}
}

function createCompareDiv(i,j){
	var newdiv;
	var str='';
	newdiv=document.createElement('div');
	newdiv.setAttribute('class','com-div');
	newdiv.setAttribute('id','com-div'+favRestaurant[j].id);
	
	//add info img, name, url
	str+="<div class='com-inner com-info'><img src='"+checkUrlExist(favRestaurant[j].picUrl)+"'><h3>"+favRestaurant[j].name+"</h3><a class='in-com-url' href='"+favRestaurant[j].url+"'>Learn more &#62</a></div>";
	//add popularity
	str+="<div class='com-inner com-pop'>";
	if(i==0){ str+="<h4 class='in-com-title'>Popularity</h4>"; }
	str+="<span class='com-rate-txt'>"+favRestaurant[j].rating+"</span><div class='com-rate' style='width:100px;height:20px; background:url(./JBresource/stars.png);background-position:"
		+showStars(favRestaurant[j].rating)+"'></div><p>"+favRestaurant[j].reviewText+"</p><p class='in-com-count'>"+favRestaurant[j].reviewCount+" reviews in total</p></div></div>";
	//add location
	str+="<div class='com-inner com-loc'>"
	if(i==0){ str+="<h4 class='in-com-title'>Location</h4>"; }
	str+="<p class='in-com-distance'>"+ favRestaurant[j].distance +"</p><p class='in-com-km'>KM</p><p class='in-com-city'>"+ favRestaurant[j].city +"</p><p class='in-com-addr'>"+favRestaurant[j].address+"</p><p class='in-com-coor'>Coordinate<br>"+favRestaurant[j].longitude+",<br>"+favRestaurant[j].latitude+"</p></div>";
	//add classification
	str+="<div class='com-inner com-cls'>"
	if(i==0){ str+="<h4 class='in-com-title'>Classification</h4>"; }
	str+="<p class='in-com-cat'>category<br><span class='in-com-catname'>"+ favRestaurant[j].categories +"</span></p><p class='in-com-tag'>Tag:<br><span class='in-com-tagname'>"+parseTagsForCompare(favRestaurant[j].tags)+"</span></p>"
	
	
	
		newdiv.innerHTML=str;

//	alert('newDiv created');
	return newdiv; 
}
