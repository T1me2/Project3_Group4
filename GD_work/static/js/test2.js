function showSchoolMarkers(state, county='') {
    markers.clearLayers();

    const stateIdsOnly = `query?where=LSTATE%20%3D%20'${state}'&outFields=*&returnIdsOnly=true&outSR=4326&f=json`

    // Initialize first indices of each "page" to 0 and 1999
    let firstIndex = 0;
    let lastIndex = 2000;

    // Set default for current length of api return call (can only do 2000 at a time)
    let currentLength = 2000;
    let offsetCount = 0;

    if (county !== '') {county = `${county} County`
        const url = "https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/School_Characteristics_Current/FeatureServer/2/";
        let stateQuery = `query?where=LSTATE%20%3D%20'${state}'%20AND%20NMCNTY%20%3D%20'${county}'%20AND%20OBJECTID>${firstIndex}&&outFields=*&outSR=4326&f=json`;
        let stateQueryOffset = `query?where=LSTATE%20%3D%20'${state}'%20AND%20NMCNTY%20%3D%20'${county}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;

        d3.json(url+stateQueryOffset).then(data => {
        
          let schoolCount = data.features.length;
          let schoolsRemaining = schoolCount;
        //   console.log("count schools",schoolCount);

            if (schoolCount <= 2000) {
                d3.json(url+stateQueryOffset).then(response => {
                    addMarkers(response);
                    console.log("markers in showschoolmarkers", markers);
                });
            }
            else {
                while (schoolsRemaining > 0) {
                    stateQueryOffset = `query?where=LSTATE%20%3D%20'${state}'%20AND%20NMCNTY%20%3D%20'${county}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;
                    d3.json(url+stateQueryOffset).then(response => {
                        // console.log(response);
                        addMarkers(response)
                        console.log("markers in showschoolmarkers", markers);
                    });

                    offsetCount += 2000;
                    schoolsRemaining -= 2000;
                    
                }
                // console.log(response);
                console.log(state);
                console.log(county);
            }
        });
    }
    else { 
        d3.json(url+stateIdsOnly).then(data => {

            let schoolCount = data.objectIds.length;
            let schoolsRemaining = schoolCount;
    
            if (schoolCount <= 2000) {
                d3.json(url+stateQueryOffset).then(response => {
                    addMarkers(response)
                });
            }
            else {
                while (schoolsRemaining > 0) {
                    stateQueryOffset = `query?where=LSTATE%20%3D%20'${state}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;
                    d3.json(url+stateQueryOffset).then(response => {
                        addMarkers(response)
                    });
    
                    offsetCount += 2000;
                    schoolsRemaining -= 2000;
                }
            }
        });
    }
}