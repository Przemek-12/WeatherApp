window.addEventListener('load', ()=>{

    var textinput = document.getElementById("textinput");
    var form = document.getElementById('form');
    var longitude;
    var latitude;
    var myLong;
    var myLat;
    var map;
    var mapIsDisplayed=false;

    var forecastElementChosen;
    var hourlyElementData;
    var forecastElementChosenString;

    Geo();

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

    
    var mylocation = document.getElementById('refreshButton');
    mylocation.addEventListener('click', ()=>{

            longitude=myLong;
            latitude=myLat;
            darkSky();
            dispMap();
    });


    //funkcja do geolokacji
    function Geo(){
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
        
        var latitudeDiv= document.getElementById('latitude'); 
        var longitudeDiv= document.getElementById('longitude');
        var timezoneDiv= document.getElementById('timezone');
        var temperatureDiv= document.getElementById('temperature');
        var summaryDiv= document.getElementById('summary');  
        var pressureDiv= document.getElementById('pressure');
        var dayDiv= document.getElementById('day');
        var dateDiv= document.getElementById('date');

        const darkskyproxy = 'https://cors-anywhere.herokuapp.com/';
        const darkskyUrl = (darkskyproxy+'https://api.darksky.net/forecast/b532f37a50e2b7ff19b8bfeca1f319c4/'+latitude+','+longitude+'?extend=hourly');
        
        fetch(darkskyUrl)
            .then((response)=>{
                return response.json();
            })
            .then((data)=>{
                hourlyElementData=data;

                console.log(data);
                var d = new Date();
                var week=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                var months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                document.getElementById('section1').style.backgroundImage = 'url('+data.currently.icon+'.jpg)';
                longitudeDiv.innerHTML='Longitude: '+Math.round(longitude*100)/100;
                latitudeDiv.innerHTML='Latitude: '+Math.round(latitude*100)/100; 
                dayDiv.innerHTML=week[d.getDay()];
                dateDiv.innerHTML=d.getDate()+' '+months[d.getMonth()]+' '+d.getFullYear();;
                timezoneDiv.innerHTML='Timezone: '+data.timezone;
                pressureDiv.innerHTML='Pressure: '+data.currently.pressure+" hPa";
                summaryDiv.innerHTML=data.currently.summary;    
                temperatureDiv.innerHTML=data.currently.apparentTemperature+'°F   '+ Math.round(((data.currently.apparentTemperature-32)*0.556)*100)/100+'℃';

                var days = ["zero","one","two","three","four","five","six","seven"];
                
                hourly(hourlyElementData,forecastElementChosen);

                //ustawianie danych w daily
                for(var x=0;x<8;x++){
                    var da = new Date();
                    da.setTime(data.daily.data[x].time*1000);
                    document.getElementById(days[x]+'Day').innerHTML=week[da.getDay()];
                    document.getElementById(days[x]+'Date').innerHTML=da.getDate()+' '+months[da.getMonth()]+' '+da.getFullYear();
                    document.getElementById(days[x]+'TempMax').innerHTML="Tmax: "+Math.round(((data.daily.data[x].apparentTemperatureMax-32)*0.556)*100)/100+'℃';
                    document.getElementById(days[x]+'TempMin').innerHTML="Tmin: "+Math.round(((data.daily.data[x].apparentTemperatureMin-32)*0.556)*100)/100+'℃';
                    document.getElementById(days[x]+'Summary').innerHTML=data.daily.data[x].summary;
                    document.getElementById(days[x]+'i').className=weatherIcon(data.daily.data[x].icon, x);
                }

                //action listenery do elementow daily
                document.getElementById('zero').addEventListener('click', ()=>{forecastElementChosen=0;forecastElementChosenString='zero'; hourly(data, 0); colorChange('zero',0); });
                document.getElementById('one').addEventListener('click', ()=>{ forecastElementChosen=1;forecastElementChosenString='one'; hourly(data, 1); colorChange('one',1); });
                document.getElementById('two').addEventListener('click', ()=>{ forecastElementChosen=2;forecastElementChosenString='two'; hourly(data, 2); colorChange('two',2); });
                document.getElementById('three').addEventListener('click', ()=>{forecastElementChosen=3;forecastElementChosenString='three';  hourly(data, 3); colorChange('three',3); });
                document.getElementById('four').addEventListener('click', ()=>{ forecastElementChosen=4;forecastElementChosenString='four'; hourly(data, 4); colorChange('four',4);});
                document.getElementById('five').addEventListener('click', ()=>{ forecastElementChosen=5;forecastElementChosenString='five'; hourly(data, 5); colorChange('five',5);});
                document.getElementById('six').addEventListener('click', ()=>{ forecastElementChosen=6;forecastElementChosenString='six'; hourly(data, 6); colorChange('six',6);});
                document.getElementById('seven').addEventListener('click', ()=>{ forecastElementChosen=7;forecastElementChosenString='seven'; hourly(data, 7); colorChange('seven',7);});
                

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


                var clickedElement;//aktualnie klikniety element forecastContainer
                var element='one';//przypisuje nazwe elementu do zmiennej zeby zmienic kolor w changeColor
                var hourlyDisplayStatus=false;
                if(document.getElementById('btnHourlyContainer').style.display==='flex'){
                    hourlyDisplayStatus=true;
                    clickedElement=forecastElementChosenString;
                }

                        //zmiany kolorow daily i animacje przesuwania hourly
                        function colorChange(elem){
                            document.getElementById(element).style.backgroundColor='rgba(150, 164, 185, 0.295)'; 
                            document.getElementById(elem).style.backgroundColor='rgba(150, 164, 185, 0.582)';
                            document.getElementById(element+'Rotated').style.display='none'; 
                            var rotated = document.getElementById(elem+'Rotated'); 
                            rotated.style.display='block';
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




            });
        
    }




    //ikony dla daily
    function weatherIcon(weathericon, number){
        var days = ["one","two","three","four","five","six","seven"];

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

    //ustawianie danych w hourly
    function hourly(jdata, day){ 
        let da =new Date();
        da.setTime(jdata.currently.time*1000);
        var ch = da.getHours();//ch=current hour, aktualna godzina
      
        if(day===0){
            for(let x=1;x<25;x++){
                let d = new Date();
                d.setTime(jdata.hourly.data[x].time*1000);
                document.getElementById(x.toString()+'hour').innerHTML=d.getHours()+':00';
                document.getElementById(x.toString()+'temp').innerHTML=Math.round(((jdata.hourly.data[x].apparentTemperature-32)*0.556)*100)/100+'℃';
                document.getElementById(x.toString()+'icon').className=hourlyIcon(jdata.hourly.data[x].icon, x);
                document.getElementById(x.toString()+'pP').innerHTML=Math.round(jdata.hourly.data[x].precipProbability*100)+'%';
                document.getElementById(x.toString()+'wS').innerHTML=Math.round((jdata.hourly.data[x].windSpeed*1.609344)*100)/100+'kph';
                document.getElementById(x.toString()+'summary').innerHTML=jdata.hourly.data[x].summary;
            }
        }
        if(day===1){
            for(let x=25;x<49;x++){
                let d = new Date();
                d.setTime(jdata.hourly.data[x-ch].time*1000);
                document.getElementById((x-24).toString()+'hour').innerHTML=d.getHours()+':00';
                document.getElementById((x-24).toString()+'temp').innerHTML=Math.round(((jdata.hourly.data[x-ch].apparentTemperature-32)*0.556)*100)/100+'℃';
                document.getElementById((x-24).toString()+'icon').className=hourlyIcon(jdata.hourly.data[x-ch].icon, x-24);
                document.getElementById((x-24).toString()+'pP').innerHTML=Math.round(jdata.hourly.data[x-ch].precipProbability*100)+'%';
                document.getElementById((x-24).toString()+'wS').innerHTML=Math.round((jdata.hourly.data[x-ch].windSpeed*1.609344)*100)/100+'kph';
                document.getElementById((x-24).toString()+'summary').innerHTML=jdata.hourly.data[x-ch].summary;
            }
        }
        if(day===2){
            for(let x=49;x<73;x++){
                let d = new Date();
                d.setTime(jdata.hourly.data[x-ch].time*1000);
                document.getElementById((x-48).toString()+'hour').innerHTML=d.getHours()+':00';
                document.getElementById((x-48).toString()+'temp').innerHTML=Math.round(((jdata.hourly.data[x-ch].apparentTemperature-32)*0.556)*100)/100+'℃';
                document.getElementById((x-48).toString()+'icon').className=hourlyIcon(jdata.hourly.data[x-ch].icon, x-48);
                document.getElementById((x-48).toString()+'pP').innerHTML=Math.round(jdata.hourly.data[x-ch].precipProbability*100)+'%';
                document.getElementById((x-48).toString()+'wS').innerHTML=Math.round((jdata.hourly.data[x-ch].windSpeed*1.609344)*100)/100+'kph';
                document.getElementById((x-48).toString()+'summary').innerHTML=jdata.hourly.data[x-ch].summary;
                
            }
        }
        if(day===3){
            for(let x=73;x<97;x++){
                let d = new Date();
                d.setTime(jdata.hourly.data[x-ch].time*1000);
                document.getElementById((x-72).toString()+'hour').innerHTML=d.getHours()+':00';
                document.getElementById((x-72).toString()+'temp').innerHTML=Math.round(((jdata.hourly.data[x-ch].apparentTemperature-32)*0.556)*100)/100+'℃';
                document.getElementById((x-72).toString()+'icon').className=hourlyIcon(jdata.hourly.data[x-ch].icon, x-72);
                document.getElementById((x-72).toString()+'pP').innerHTML=Math.round(jdata.hourly.data[x-ch].precipProbability*100)+'%';
                document.getElementById((x-72).toString()+'wS').innerHTML=Math.round((jdata.hourly.data[x-ch].windSpeed*1.609344)*100)/100+'kph';
                document.getElementById((x-72).toString()+'summary').innerHTML=jdata.hourly.data[x-ch].summary;
            }
        }
        if(day===4){
            for(let x=97;x<121;x++){
                let d = new Date();
                d.setTime(jdata.hourly.data[x-ch].time*1000);
                document.getElementById((x-96).toString()+'hour').innerHTML=d.getHours()+':00';
                document.getElementById((x-96).toString()+'temp').innerHTML=Math.round(((jdata.hourly.data[x-ch].apparentTemperature-32)*0.556)*100)/100+'℃';
                document.getElementById((x-96).toString()+'icon').className=hourlyIcon(jdata.hourly.data[x-ch].icon, x-96);
                document.getElementById((x-96).toString()+'pP').innerHTML=Math.round(jdata.hourly.data[x-ch].precipProbability*100)+'%';
                document.getElementById((x-96).toString()+'wS').innerHTML=Math.round((jdata.hourly.data[x-ch].windSpeed*1.609344)*100)/100+'kph';
                document.getElementById((x-96).toString()+'summary').innerHTML=jdata.hourly.data[x-ch].summary;
            }
        }
        if(day===5){
            for(let x=121;x<145;x++){
                let d = new Date();
                d.setTime(jdata.hourly.data[x-ch].time*1000);
                document.getElementById((x-120).toString()+'hour').innerHTML=d.getHours()+':00';
                document.getElementById((x-120).toString()+'temp').innerHTML=Math.round(((jdata.hourly.data[x-ch].apparentTemperature-32)*0.556)*100)/100+'℃';
                document.getElementById((x-120).toString()+'icon').className=hourlyIcon(jdata.hourly.data[x-ch].icon, x-120);
                document.getElementById((x-120).toString()+'pP').innerHTML=Math.round(jdata.hourly.data[x-ch].precipProbability*100)+'%';
                document.getElementById((x-120).toString()+'wS').innerHTML=Math.round((jdata.hourly.data[x-ch].windSpeed*1.609344)*100)/100+'kph';
                document.getElementById((x-120).toString()+'summary').innerHTML=jdata.hourly.data[x-ch].summary;
            }
        }
        if(day===6){
            for(let x=145;x<169;x++){
                let d = new Date();
                d.setTime(jdata.hourly.data[x-ch].time*1000);
                document.getElementById((x-144).toString()+'hour').innerHTML=d.getHours()+':00';
                document.getElementById((x-144).toString()+'temp').innerHTML=Math.round(((jdata.hourly.data[x-ch].apparentTemperature-32)*0.556)*100)/100+'℃';
                document.getElementById((x-144).toString()+'icon').className=hourlyIcon(jdata.hourly.data[x-ch].icon, x-144);
                document.getElementById((x-144).toString()+'pP').innerHTML=Math.round(jdata.hourly.data[x-ch].precipProbability*100)+'%';
                document.getElementById((x-144).toString()+'wS').innerHTML=Math.round((jdata.hourly.data[x-ch].windSpeed*1.609344)*100)/100+'kph';
                document.getElementById((x-144).toString()+'summary').innerHTML=jdata.hourly.data[x-ch].summary;
            }
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
                    //d.setTime(jdata.hourly.data[x].time*1000);
                    document.getElementById((x-144-(24-ch)).toString()+'hour').innerHTML='';
                    document.getElementById((x-144-(24-ch)).toString()+'temp').innerHTML='';
                    document.getElementById((x-144-(24-ch)).toString()+'icon').className='';
                    document.getElementById((x-144-(24-ch)).toString()+'pP').innerHTML='';
                    document.getElementById((x-144-(24-ch)).toString()+'wS').innerHTML='';
                    document.getElementById((x-144-(24-ch)).toString()+'summary').innerHTML='';
                }

            }
        }
    }



});
