	var UserData = {
        userData : null,
        name : location.hostname,
        init:function(){
            if (!UserData.userData) {
                try {
                    UserData.userData = document.createElement('INPUT');
                    UserData.userData.type = "hidden";
                    UserData.userData.style.display = "none";
                    UserData.userData.addBehavior ("#default#userData");
                    document.body.appendChild(UserData.userData);
                    var expires = new Date();
                    expires.setDate(expires.getDate()+365);
                    UserData.userData.expires = expires.toUTCString();
                } catch(e) {
                    return false;
                }
            }
            return true;
        },

        setItem : function(key, value) {
            if(UserData.init()){
                UserData.userData.load(UserData.name);
                UserData.userData.setAttribute(key, value);
                UserData.userData.save(UserData.name);
            }
        },

        getItem : function(key) {
            if(UserData.init()){
             UserData.userData.load(UserData.name);
             return UserData.userData.getAttribute(key)
            }
        },

        remove : function(key) {
            if(UserData.init()){
             UserData.userData.load(UserData.name);
             UserData.userData.removeAttribute(key);
             UserData.userData.save(UserData.name);
            }

        }
    };

    function storeData(key,value){
        if(!window.localStorage){
            UserData.setItem(key,value);
        }else{
            localStorage.setItem(key,value);
        }

    };
    function getData(key){
    	var value;
        if(!window.localStorage){
            if(UserData.getItem(key)==undefined) {
               	value="";
            }else{
                value=UserData.getItem(key);
            }
        }else{
            if(localStorage.getItem(key)!=null){
                value=localStorage.getItem(key);
            }else{
                value="";
            }
        }
		return value;
    };
    function deleteData(key){
 //       var value="";
        if(!window.localStorage){
            UserData.remove(key);
        }else{
            localStorage.removeItem(key);
        }
    };