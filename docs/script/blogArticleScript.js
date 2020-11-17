window.addEventListener('load', ()=>{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    var background = document.getElementById('background');
    var topic = document.getElementById('topic');
    var text = document.getElementById('article');

    background.style.backgroundImage = 'url(css/media/'+urlParams.get('art')+'.jpg)';

    setValues(urlParams.get('art'));

    function setValues(art){
        switch(art){
                case 'art1':
                    setter(top1(), article1());
                    break;
                case 'art2':
                    setter(top2(), article2());
                    break;
                case 'art3':
                    setter(top3(), article3());
                    break;
                case 'art4':
                    setter(top4(), article4());
                    break;
        }
    }

    function setter(top, article){
        topic.innerHTML =top;
        text.innerHTML =article;
    }

    function top1(){
        return "What are causes of weather";
    };
    function top2(){
        return "Shaping the planet Earth";
    };
    function top3(){
        return "Forecasting";
    };
    function top4(){
        return "Effect on humans";
    };


    function article1(){
        return "On Earth, the common weather phenomena include wind, cloud, rain, snow, fog and dust storms. Less common events include natural disasters such as tornadoes, hurricanes, typhoons and ice storms. Almost all familiar weather phenomena occur in the troposphere (the lower part of the atmosphere).[3] Weather does occur in the stratosphere and can affect weather lower down in the troposphere, but the exact mechanisms are poorly understood.[5]Weather occurs primarily due to air pressure, temperature and moisture differences between one place to another. These differences can occur due to the sun angle at any particular spot, which varies by latitude from the tropics. In other words, the farther from the tropics one lies, the lower the sun angle is, which causes those locations to be cooler due to the spread of the sunlight over a greater surface.[6] The strong temperature contrast between polar and tropical air gives rise to the large scale atmospheric circulation cells and the jet stream. Weather systems in the mid-latitudes, such as extratropical cyclones, are caused by instabilities of the jet stream flow (see baroclinity). Weather systems in the tropics, such as monsoons or organized thunderstorm systems, are caused by different processes.";
    };
    function article2(){
        return "Weathering is the breaking down of rocks, soils, and minerals as well as wood and artificial materials through contact with the Earth's atmosphere, water, and biological organisms. Weathering occurs in situ (i.e., on site, without displacement), that is, in the same place, with little or no movement, and thus should not be confused with erosion, which involves the transport of rocks and minerals by agents such as water, ice, snow, wind, waves and gravity and then being transported and deposited in other locations. Two important classifications of weathering processes exist – physical and chemical weathering; each sometimes involves a biological component. Mechanical or physical weathering involves the breakdown of rocks and soils through direct contact with atmospheric conditions, such as heat, water, ice and pressure. The second classification, chemical weathering, involves the direct effect of atmospheric chemicals or biologically produced chemicals also known as biological weathering in the breakdown of rocks, soils and minerals.[1] While physical weathering is accentuated in very cold or very dry environments, chemical reactions are most intense where the climate is wet and hot. However, both types of weathering occur together, and each tends to accelerate the other. For example, physical abrasion (rubbing together) decreases the size of particles and therefore increases their surface area, making them more susceptible to chemical reactions. The various agents act in concert to convert primary minerals (feldspars and micas) to secondary minerals (clays and carbonates) and release plant nutrient elements in soluble forms.   The materials left over after the rock breaks down combined with organic material creates soil. The mineral content of the soil is determined by the parent material; thus, a soil derived from a single rock type can often be deficient in one or more minerals needed for good fertility, while a soil weathered from a mix of rock types (as in glacial, aeolian or alluvial sediments) often makes more fertile soil. In addition, many of Earth's landforms and landscapes are the result of weathering processes combined with erosion and re-deposition.";
    };
    function article3(){
        return "Weather forecasting is the application of science and technology to predict the state of the atmosphere for a future time and a given location. Human beings have attempted to predict the weather informally for millennia, and formally since at least the nineteenth century.[27] Weather forecasts are made by collecting quantitative data about the current state of the atmosphere and using scientific understanding of atmospheric processes to project how the atmosphere will evolve.[28 Once an all-human endeavor based mainly upon changes in barometric pressure, current weather conditions, and sky condition,[29][30] forecast models are now used to determine future conditions. On the other hand, human input is still required to pick the best possible forecast model to base the forecast upon, which involve many disciplines such as pattern recognition skills, teleconnections, knowledge of model performance, and knowledge of model biases.  The chaotic nature of the atmosphere, the massive computational power required to solve the equations that describe the atmosphere, the error involved in measuring the initial conditions, and an incomplete understanding of atmospheric processes mean that forecasts become less accurate as of the difference in current time and the time for which the forecast is being made (the range of the forecast) increases. The use of ensembles and model consensus helps to narrow the error and pick the most likely outcome.[31][32][33]There are a variety of end users to weather forecasts. Weather warnings are important forecasts because they are used to protect life and property.[34][35] Forecasts based on temperature and precipitation are important to agriculture,[36][37][38][39] and therefore to commodity traders within stock markets. Temperature forecasts are used by utility companies to estimate demand over coming days.[40][41][42] In some areas, people use weather forecasts to determine what to wear on a given day. Since outdoor activities are severely curtailed by heavy rain, snow and the wind chill, forecasts can be used to plan activities around these events and to plan ahead to survive through them.";
    };
    function article4(){
        return "Weather, seen from an anthropological perspective, is something all humans in the world constantly experience through their senses, at least while being outside. There are socially and scientifically constructed understandings of what weather is, what makes it change, the effect it has on humans in different situations, etc.[22] Therefore, weather is something people often communicate about.The weather has played a large and sometimes direct part in human history. Aside from climatic changes that have caused the gradual drift of populations (for example the desertification of the Middle East, and the formation of land bridges during glacial periods), extreme weather events have caused smaller scale population movements and intruded directly in historical events. One such event is the saving of Japan from invasion by the Mongol fleet of Kublai Khan by the Kamikaze winds in 1281.[23] French claims to Florida came to an end in 1565 when a hurricane destroyed the French fleet, allowing Spain to conquer Fort Caroline.[24] More recently, Hurricane Katrina redistributed over one million people from the central Gulf coast elsewhere across the United States, becoming the largest diaspora in the history of the United States";
    };

});