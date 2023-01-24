// Show school marker clusters when county is selected
function showSchoolMarkersCounty(state, county='') {
    // console.log("SHOW SCHOOL MARKERS:",state, county)
      markers.clearLayers();
      d3.select("#county-school-count").text('');

      const stateIdsOnly = `query?where=LSTATE%20%3D%20'${state}'&outFields=*&returnIdsOnly=true&outSR=4326&f=json`;
      if (county !== '') {county = `${county} County`}
  
      // Initialize first indices of each "page" to 0 and 1999
      let firstIndex = 0;
      let lastIndex = 2000;
  
      // Set default for current length of api return call (can only do 2000 at a time)
      let currentLength = 2000;
      let offsetCount = 0;
  
      const url = "https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/School_Characteristics_Current/FeatureServer/2/";
      let stateQuery = `query?where=LSTATE%20%3D%20'${state}'%20AND%20NMCNTY%20%3D%20'${county}'%20AND%20OBJECTID>${firstIndex}&&outFields=*&outSR=4326&f=json`;
      let stateQueryOffset = `query?where=LSTATE%20%3D%20'${state}'%20AND%20NMCNTY%20%3D%20'${county}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;
  
      d3.json(url+stateQueryOffset).then(data => {
            let schoolCount = data.features.length;
            let schoolsRemaining = schoolCount;
            let morePages = data.exceededTransferLimit;

            let countySchoolCount = 0;

            // Check if there are more than 2000 results
            while (morePages){
                countySchoolCount = 2000;
                console.log("in if statement:", countySchoolCount);

                    console.log("schoolsRemaining", schoolsRemaining)
                    // console.log("in while statement:", countySchoolCount);
                    stateQueryOffset = `query?where=LSTATE%20%3D%20'${state}'%20AND%20NMCNTY%20%3D%20'${county}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;
                    
                    // let fullResponse = [];
                    d3.json(url+stateQueryOffset).then(response => {
                        schoolsRemaining += response.features.length;
                        console.log("schoolsRemaining", schoolsRemaining);
                        // console.log("COUNT", schoolsRemaining);
                        addMarkers(response);
                        // console.log("data", response);
                        // console.log("in d3:", countySchoolCount);
                        // console.log("type", typeof response);
                        
                        // console.log("in d3:", schoolsRemaining);
                        countySchoolCount += schoolsRemaining;
                    });
                    schoolsRemaining -= 2000;
                    offsetCount += 2000;
                        

                //   d3.select("#county-school-count").text(`${countySchoolCount} schools in ${county}`);
            }

        countySchoolCount = schoolCount
        d3.select("#county-school-count").text(`${countySchoolCount} schools in ${county}`);
        
        addMarkers(data);
        console.log("data", data);

        });
  }