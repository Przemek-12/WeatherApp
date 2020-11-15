window.addEventListener('load', ()=>{

    var textinput = document.getElementById("textinput");
    var form = document.getElementById('form');
    var longitude;
    var latitude;
    var myLong;
    var myLat;
    var map;
    var mapIsDisplayed=false;

    var forecastElementChosenString;
    var forecastElementChosen;
    var hourlyElementData;

    geolocation();

    //Wyszkiwanie pogody w danym mieście
    form.addEventListener("submit", (event)=>{
        var city = textinput.value;
        var regex = /[0-9]/;

        if(city===''||city.match(regex)){
            event.preventDefault();//Prevent a link from opening the URL, prevent from submiting form
            alert('Wrong city Name');
        }
        else{
            event.preventDefault();
            const openweatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=00520791fceda31edce55304731ac2f1';

            fetch(openweatherUrl)
                .then(resp=>{
                    //resp is just an HTTP response, not the actual JSON. To extract the JSON body content from the response, we use the json() method 
                    console.log(resp);
                    return resp.json();
                })
                .then(dat=>{
                    console.log(dat);
                    longitude=dat.coord.lon;
                    latitude=dat.coord.lat;
                    darkSky();
                    dispMap();
                });
        }
    });

    
    var mylocation = document.getElementById('myLocationButton');
    mylocation.addEventListener('click', ()=>{
            longitude=myLong;
            latitude=myLat;
            darkSky();
            dispMap();
    });


    function geolocation(){
        //domyslne pobieranie danych dla aktualnej lokalizacji
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((position)=>{
                console.log(position);
                longitude=position.coords.longitude;
                latitude=position.coords.latitude;
                myLong=longitude;
                myLat=latitude;
                darkSky();
                dispMap();  
            });
        }
        else{
            alert("Geolocation is not supported by this browser.")
        }
    }
   
    function dispMap(){
        
        if(mapIsDisplayed===false){
        var platform = new H.service.Platform({
            'apikey':'jjEA1JqngsoyrWvXU5Ruxk8pbQg0Um8SiFR8dS_Z9cg'
        });
        // Obtain the default map types from the platform object:
        var defaultLayers = platform.createDefaultLayers();

        // Instantiate (and display) a map object:
        map = new H.Map(document.getElementById('map'),
        defaultLayers.vector.normal.map,
        {
        zoom: 10,
        center: { lat: latitude, lng: longitude }
        });

        var Marker = new H.map.Marker({
            lat:latitude,
            lng:longitude
        });
        map.addObject(Marker);

        mapIsDisplayed=true;
        new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
        }
        else{
            map.setCenter({lat:latitude, lng:longitude});
            map.setZoom(10);
        }
        map.addEventListener('tap', (event)=>{
            var coord = map.screenToGeo(event.currentPointer.viewportX, event.currentPointer.viewportY);
            longitude=coord.lng;
            latitude=coord.lat;
            darkSky();
            dispMap();
        });
    }

    function darkSky(){
        
        const darkskyproxy = 'https://cors-anywhere.herokuapp.com/';
        const darkskyUrl = (darkskyproxy+'https://api.darksky.net/forecast/b532f37a50e2b7ff19b8bfeca1f319c4/'+latitude+','+longitude+'?extend=hourly');
        
        fetch(darkskyUrl)
            .then((response)=>{
                console.log(response);
                return response.json();
            })
            .then((data)=>{
                console.log(data);
                hourlyElementData=data;   

                //change hourly data when location changes
                hourly(hourlyElementData,forecastElementChosen);
                setDailyAndBasicData(data)
                addHourlyButtonsListeners();
            }); 
    }

    function addHourlyButtonsListeners(){
       //slider elementow hourly
       var counterPosition=0;//licznik pozycji hourlyContainer
       var counterClick=0;//licznik kliknięć
       var hourlyContainer= document.getElementById('hourlyContainer');
       document.getElementById('buttonLeft').addEventListener('click',()=>{
           if(counterClick>1){
               var count=0;
               var slideInterval = setInterval(()=>{
                   if(count===18){
                   clearInterval(slideInterval);
                   }
                   else{
                       count++;
                       hourlyContainer.style.left=counterPosition+count+'vw';
                   }
               },10);
               counterClick--;
               counterPosition=counterPosition+18;
           }
       });

       document.getElementById('buttonRight').addEventListener('click', ()=>{
           if(counterClick<6){
               var count=0;
               var slideInterval = setInterval(()=>{
                   if(count===18){
                   clearInterval(slideInterval);
                   }
                   else{
                       count++;
                       hourlyContainer.style.left=counterPosition-count+'vw';
                   }
               },10);
               counterClick++;
               counterPosition=counterPosition-18;
           }
       });
    }

    function setDailyAndBasicData(data){

        var latitudeDiv= document.getElementById('latitude'); 
        var longitudeDiv= document.getElementById('longitude');
        var timezoneDiv= document.getElementById('timezone');
        var temperatureDiv= document.getElementById('temperature');
        var summaryDiv= document.getElementById('summary');  
        var pressureDiv= document.getElementById('pressure');
        var dayDiv= document.getElementById('day');
        var dateDiv= document.getElementById('date');
        var background = document.getElementById('background');

        var d = new Date();
        var week=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        var months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var days = [["zero",0],["one",1],["two",2],["three",3],["four",4],["five",5],["six",6],["seven",7]];


        var clickedElement;//aktualnie klikniety element forecastContainer
        var element='one';//przypisuje nazwe elementu do zmiennej zeby zmienic kolor w changeColor
        var hourlyDisplayStatus=false;
        if(document.getElementById('btnHourlyContainer').style.display==='flex'){
            hourlyDisplayStatus=true;
            clickedElement=forecastElementChosenString;
        }

        setBasicData(data);
        setDaily(data);
        addDailyListeners(data);

        function setBasicData(data){
            background.style.backgroundImage = 'url(media/'+data.currently.icon+'.jpg)';
            longitudeDiv.innerHTML='Longitude: '+Math.round(longitude*100)/100;
            latitudeDiv.innerHTML='Latitude: '+Math.round(latitude*100)/100; 
            dayDiv.innerHTML=week[d.getDay()];
            dateDiv.innerHTML=d.getDate()+' '+months[d.getMonth()]+' '+d.getFullYear();;
            timezoneDiv.innerHTML='Timezone: '+data.timezone;
            pressureDiv.innerHTML='Pressure: '+data.currently.pressure+" hPa";
            summaryDiv.innerHTML=data.currently.summary;    
            temperatureDiv.innerHTML=data.currently.apparentTemperature+'°F   '+ Math.round(((data.currently.apparentTemperature-32)*0.556)*100)/100+'℃';
        }

        function setDaily(data){
            //ustawianie danych w daily
            for(var x=0;x<8;x++){
                var da = new Date();
                da.setTime(data.daily.data[x].time*1000);
                document.getElementById(days[x][0]+'Day').innerHTML=week[da.getDay()];
                document.getElementById(days[x][0]+'Date').innerHTML=da.getDate()+' '+months[da.getMonth()]+' '+da.getFullYear();
                document.getElementById(days[x][0]+'TempMax').innerHTML="Tmax: "+Math.round(((data.daily.data[x].apparentTemperatureMax-32)*0.556)*100)/100+'℃';
                document.getElementById(days[x][0]+'TempMin').innerHTML="Tmin: "+Math.round(((data.daily.data[x].apparentTemperatureMin-32)*0.556)*100)/100+'℃';
                document.getElementById(days[x][0]+'Summary').innerHTML=data.daily.data[x].summary;
                document.getElementById(days[x][0]+'i').className=weatherIcon(data.daily.data[x].icon, x);
            }
        }

        function addDailyListeners(data){
            //action listenery do elementow daily
            days.forEach(day=>{
                document.getElementById(day[0]).addEventListener('click', ()=>{
                    forecastElementChosenString=day[0]; 
                    hourly(data, day[1]); 
                    colorChange(day[0],day[1]); 
                });
            });
        }   
        
        //zmiany kolorow daily i animacje przesuwania hourly
        function colorChange(elem){

                document.getElementById(element).style.backgroundColor='rgba(150, 164, 185, 0.295)'; 
                document.getElementById(elem).style.backgroundColor='rgba(150, 164, 185, 0.582)';
                document.getElementById(element+'Rotated').style.display='none'; 
                var rotated = document.getElementById(elem+'Rotated'); 
                if(!window.matchMedia('(max-width: 1500px)').matches){
                    rotated.style.display='block';
                }
                element=elem;//element-element po kliknieciu innego kolor bedzie zmieniony na domyslny po kliknieciu w nowy element(elem)
                    
                    if(hourlyDisplayStatus===false){
                        var forecastContainer = document.getElementById('forecastContainer');
                        hourlyDisplayStatus=true;

                        //animacja przesuwania w gore forecastContainer po kliknieciu w element
                        var position = 18;
                        var forecastInterval = setInterval(()=>{
                            if(position===9){
                                document.getElementById('btnHourlyContainer').style.display='flex';
                                clearInterval(forecastInterval);
                            }
                            else{
                                position=position-0.25;
                                forecastContainer.style.top=position+'%';
                            }
                        },5);                           
                    }

                    else if(hourlyDisplayStatus===true && clickedElement===elem ){
                        var forecastContainer = document.getElementById('forecastContainer');
                        hourlyDisplayStatus=false;
                        document.getElementById('btnHourlyContainer').style.display='none';
                        rotated.style.display='none';
                        document.getElementById(elem).style.backgroundColor='rgba(150, 164, 185, 0.295)';
                        
                        //animacja przesuwania w dół forecastContainer po kliknieciu w element
                        var position = 10;
                        var forecastInterval = setInterval(()=>{
                            if(position===18){
                                clearInterval(forecastInterval);
                            }
                            else{
                                position=position+0.25;
                                forecastContainer.style.top=position+'%';
                            }
                        },5);                           
                    }           
                    clickedElement=elem;
        }
    }

    //ustawianie danych w hourly
    function hourly(jdata, day){ 
        let da =new Date();
        da.setTime(jdata.currently.time*1000);
        let ch = da.getHours();//ch=current hour, aktualna godzina
        let xVal = 1+(24*day);

        if(day===0){
            ch=0;
        }
        if(day===7){
                for(let x=169-ch;x<169+(24-ch);x++){
                    let d = new Date();
                    if(x-144-(24-ch)<ch+1){
                        d.setTime(jdata.hourly.data[x].time*1000);
                        document.getElementById((x-144-(24-ch)).toString()+'hour').innerHTML=d.getHours()+':00';
                        document.getElementById((x-144-(24-ch)).toString()+'temp').innerHTML=Math.round(((jdata.hourly.data[x].apparentTemperature-32)*0.556)*100)/100+'℃';
                        document.getElementById((x-144-(24-ch)).toString()+'icon').className=hourlyIcon(jdata.hourly.data[x].icon, x-144);
                        document.getElementById((x-144-(24-ch)).toString()+'pP').innerHTML=Math.round(jdata.hourly.data[x].precipProbability*100)+'%';
                        document.getElementById((x-144-(24-ch)).toString()+'wS').innerHTML=Math.round((jdata.hourly.data[x].windSpeed*1.609344)*100)/100+'kph';
                        document.getElementById((x-144-(24-ch)).toString()+'summary').innerHTML=jdata.hourly.data[x].summary;
                    }
                    else{
                        document.getElementById((x-144-(24-ch)).toString()+'hour').innerHTML='';
                        document.getElementById((x-144-(24-ch)).toString()+'temp').innerHTML='';
                        document.getElementById((x-144-(24-ch)).toString()+'icon').className='';
                        document.getElementById((x-144-(24-ch)).toString()+'pP').innerHTML='';
                        document.getElementById((x-144-(24-ch)).toString()+'wS').innerHTML='';
                        document.getElementById((x-144-(24-ch)).toString()+'summary').innerHTML='';
                    }
                }
        } else{
            for(let x=xVal;x<xVal+24;x++){
                let d = new Date();
                d.setTime(jdata.hourly.data[x-ch].time*1000);
                document.getElementById(x-(24*day).toString()+'hour').innerHTML=d.getHours()+':00';
                document.getElementById(x-(24*day).toString()+'temp').innerHTML=Math.round(((jdata.hourly.data[x-ch].apparentTemperature-32)*0.556)*100)/100+'℃';
                document.getElementById(x-(24*day).toString()+'icon').className=hourlyIcon(jdata.hourly.data[x-ch].icon, x-(24*day));
                document.getElementById(x-(24*day).toString()+'pP').innerHTML=Math.round(jdata.hourly.data[x-ch].precipProbability*100)+'%';
                document.getElementById(x-(24*day).toString()+'wS').innerHTML=Math.round((jdata.hourly.data[x-ch].windSpeed*1.609344)*100)/100+'kph';
                document.getElementById(x-(24*day).toString()+'summary').innerHTML=jdata.hourly.data[x-ch].summary;
            }
        }
    }
    
    //ikony dla daily
    function weatherIcon(weathericon, number){
        let days = ["one","two","three","four","five","six","seven"];

        if(weathericon=="clear-day"){
            return "fas fa-sun";
        }
        if(weathericon=="clear-night"){
            return "fas fa-moon";
        }
        if(weathericon=="rain"){
            return "fas fa-cloud-showers-heavy";
        }
        if(weathericon=="snow"){
            return "fas fa-snowflake";
        }
        if(weathericon=="sleet"){
            document.getElementById(days[number]+'i2').className='fas fa-cloud-showers-heavy';
            return "far fa-snowflake";
        }
        if(weathericon=="wind"){
            return "fas fa-wind";
        }
        if(weathericon=="fog"){
            return "fas fa-smog";
        }
        if(weathericon=="cloudy"){
            return "fas fa-cloud";
        }
        if(weathericon=="partly-cloudy-day"){
            return "fas fa-cloud-sun";
        }
        if(weathericon=="partly-cloudy-night"){
            return "fas fa-cloud-moon";
        }  
    }

    //ikony dla hourly
    function hourlyIcon(weathericon, number){
        var hours = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'];

        if(weathericon=="clear-day"){
            return "fas fa-sun";
        }
        if(weathericon=="clear-night"){
            return "fas fa-moon";
        }
        if(weathericon=="rain"){
            return "fas fa-cloud-showers-heavy";
        }
        if(weathericon=="snow"){
            return "fas fa-snowflake";
        }
        if(weathericon=="sleet"){
            document.getElementById(hours[number]+'i2').className='fas fa-cloud-showers-heavy';
            return "far fa-snowflake";
        }
        if(weathericon=="wind"){
            return "fas fa-wind";
        }
        if(weathericon=="fog"){
            return "fas fa-smog";
        }
        if(weathericon=="cloudy"){
            return "fas fa-cloud";
        }
        if(weathericon=="partly-cloudy-day"){
            return "fas fa-cloud-sun";
        }
        if(weathericon=="partly-cloudy-night"){
            return "fas fa-cloud-moon";
        }   
    }


});
