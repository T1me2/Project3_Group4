// Show school marker clusters when county is selected
function showSchoolMarkers(state, county='') {
    // Clear any existing marker cluster layer
    markers.clearLayers();

    // Reset any existing county school count text in panel-body
    d3.select("#county-school-count").text('');
  
    // Format county name to match public school API
    if (county !== '') {
        county = `${county} County`;
        let countyParameter = `'%20AND%20NMCNTY%20%3D%20'${county}'`;
    }

    // Set default for current length of api return call (can only do 2000 at a time)
    let offsetCount = 0;

    // Define base URL for Public School API call
    const url = "https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/School_Characteristics_Current/FeatureServer/2/";
  
    // Define query to return school count for selected county
    let countyCountQuery = `query?where=LSTATE%20%3D%20'${state}'${countyParameter}'&outFields=*&returnCountOnly=true&outSR=4326&f=json`;
    // Define query for selected state with offset count parameter
    let stateQueryOffset = `query?where=LSTATE%20%3D%20'${state}'%20AND%20NMCNTY%20%3D%20'${county}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;

    // Make API call to get school count for selected county
    d3.json(url+countyCountQuery).then(data => {
        // Store school count (total number of schools in county)
        let schoolCount = data.count;
        // Initialize number of schools left to check
        let schoolsRemaining = schoolCount;
        
        // Clear existing county school count text in panel-body
        d3.select("#county-school-count").text('');
        // Update panel-body to show total school count for selected state
        d3.select("#state-school-count").text(`${schoolsRemaining} schools in ${state}`);
        // Update panel-body with school count for selected county
        d3.select("#county-school-count").text(`${schoolCount} schools in ${county}`);

        // Looop until no schools left to check
        while (schoolsRemaining > 0) {
            stateQueryOffset = `query?where=LSTATE%20%3D%20'${state}'%20AND%20NMCNTY%20%3D%20'${county}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;
            // Reset query with updated offset count
            d3.json(url+stateQueryOffset).then(response => {
                // Create/display marker cluster layer of schools for selected state
                addMarkers(response);
            });

            // Update offset count
            offsetCount += 2000;
            // Update number of schools left
            schoolsRemaining -= 2000;
        }
    });
}