/// ATTEMPT to combine two functions into one
// Show school marker clusters when county is selected (from state abbr, county code)
function showSchoolMarkers(state, county='') {
    // Clear any existing marker cluster layer
    markers.clearLayers();

    // Reset any existing county school count text in panel-body
    d3.select("#county-school-count").text('');

    // Set county parameter to be empty by default
    let countyParameter = '';

    // Define base URL for Public School API call
    const url = "https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/Public_School_Location_201819/FeatureServer/0/";
    // Set default for current length of api return call (can only do 2000 at a time)
    let offsetCount = 0;

  
    // Format county name to match public school API
    if (county !== '') {
        countyParameter = `%20AND%20CNTY%20%3D%20'${county}'`;
    }

    // Define query to return school count for selected county
    let schoolCountQuery = `query?where=STATE%20%3D%20'${state}'${countyParameter}&outFields=*&returnCountOnly=true&outSR=4326&f=json`;
    // Define query for selected state with offset count parameter
    let schoolQueryOffset = `query?where=STATE%20%3D%20'${state}'${countyParameter}&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;


    d3.json(url+schoolCountQuery).then(data => {
        let schoolsRemaining = data.count;
        let schoolCount = schoolsRemaining;

        // Loop until no schools left to check
        while (schoolsRemaining > 0) {
            schoolQueryOffset = `query?where=STATE%20%3D%20'${state}'${countyParameter}&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;
            // Reset query with updated offset count
            d3.json(url+schoolQueryOffset).then(response => {
                addMarkers(response);
                schoolCount += response.features.length;

            // Clear existing county school count text in panel-body
            d3.select("#county-school-count").text('(Select a county for more information)');
            d3.select("#walkability-score").text('')
            d3.select("#total-pop").text('');
            d3.select("#student-pop").text('');
            // Update panel-body to show total school count for selected state
            d3.select("#state-school-count").text(`${schoolsRemaining} schools in ${state}`);
            });

            // Update offset count
            offsetCount += 2000;
            // Update number of schools left
            schoolsRemaining -= 2000;
        }
    });
}