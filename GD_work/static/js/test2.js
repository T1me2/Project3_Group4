function showSchoolMarkers(state, county='') {
    // console.log("SHOW SCHOOL MARKERS:",state, county)
      markers.clearLayers();
      const stateIdsOnly = `query?where=LSTATE%20%3D%20'${state}'&outFields=*&returnIdsOnly=true&outSR=4326&f=json`
      console.log("County length:", county.length)
      if (county !== '') {county = `${county} County`}
      // console.log("Inside showschoolmarkers",county);
  
      // Initialize first indices of each "page" to 0 and 1999
      let firstIndex = 0;
      let lastIndex = 2000;
  
      // Set default for current length of api return call (can only do 2000 at a time)
      let currentLength = 2000;
      let offsetCount = 0;
  
      const url = "https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/School_Characteristics_Current/FeatureServer/2/";
      let stateQuery = `query?where=LSTATE%20%3D%20'${state}'%20AND%20NMCNTY%20%3D%20'${county}'%20AND%20OBJECTID>${firstIndex}&&outFields=*&outSR=4326&f=json`;
      let stateQueryOffset = `query?where=LSTATE%20%3D%20'${state}'%20AND%20NMCNTY%20%3D%20'${county}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;
  
      d3.json(url+stateIdsOnly).then(data => {
  
          let stateCount = data.objectIds.length;
          let schoolsRemaining = stateCount;
  
          if (stateCount <= 2000) {
              d3.json(url+stateQueryOffset).then(response => {
                  addMarkers(response)
              });
          }
          else {
              while (schoolsRemaining > 0) {
                  stateQueryOffset = `query?where=LSTATE%20%3D%20'${state}'%20AND%20NMCNTY%20%3D%20'${county}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;
                  d3.json(url+stateQueryOffset).then(response => {
                      addMarkers(response)
                  });
  
                  offsetCount += 2000;
                  schoolsRemaining -= 2000;
              }
          }
      });
  }
  
  function showSchoolMarkersState(state) {
    markers.clearLayers();
  
    const stateIdsOnly = `query?where=LSTATE%20%3D%20'${state}'&outFields=*&returnIdsOnly=true&outSR=4326&f=json`
    
    console.log("Inside showschoolmarkers",state);
  
    // Initialize first indices of each "page" to 0 and 1999
    let firstIndex = 0;
    let lastIndex = 2000;
  
    // Set default for current length of api return call (can only do 2000 at a time)
    let currentLength = 2000;
    let offsetCount = 0;
  
    const url = "https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/School_Characteristics_Current/FeatureServer/2/";
    let stateQuery = `query?where=LSTATE%20%3D%20'${state}'%20AND%20OBJECTID>${firstIndex}&&outFields=*&outSR=4326&f=json`;
    let stateQueryOffset = `query?where=LSTATE%20%3D%20'${state}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;
  
    d3.json(url+stateIdsOnly).then(data => {
  
        let stateCount = data.objectIds.length;
        let schoolsRemaining = stateCount;
  
        if (stateCount <= 2000) {
            d3.json(url+stateQueryOffset).then(response => {
                addMarkers(response)
            });
        }
        else {
            while (schoolsRemaining > 0) {
                stateQueryOffset = `query?where=LSTATE%20%3D%20'${state}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;
                d3.json(url+stateQueryOffset).then(response => {
                    console.log("Inside showschoolmarkers D3",response);
                    addMarkers(response)
                });
  
                offsetCount += 2000;
                schoolsRemaining -= 2000;
            }
        }
    });
  }