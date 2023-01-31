////////////////////////////////////////////////////////////////////////////
//////////// VARIABLES /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

// Initialize global variables
let countiesData;
let stateLayer;
let myMap;
let layerControl;
let counties;
let legend;
let counties_list = [];
let prevLayerClicked = null;
let prevWalkInd = null;
// Initialize the marker cluster group (will add markers in while loop)
let markers = L.markerClusterGroup();
// Initialize empty county layer group to store county boundary layers 
let countyLayer = L.layerGroup();


// Define URL for our rendered walkability/school GeoJSON API
let walkabilityUrl = "https://test-wsuz.onrender.com/api/v1.0/project3/group4/data";

// Dictionary to convert state codes to state abbreviations
let stateDict = {'01':'AL', '02':'AK', '04':'AZ', '05':'AR', '06':'CA', '08':'CO', '09':'CT', '10':'DE', 
                '11':'DC', '12':'FL', '13':'GA', '15':'HI', '16':'ID', '17':'IL', '18':'IN', '19':'IA', 
                '20':'KS', '21':'KY', '22':'LA', '23':'ME','24':'MD', '25':'MA', '26':'MI', '27':'MN', 
                '28':'MS', '29':'MO', '30':'MT', '31':'NE', '32':'NV', '33':'NH', '34':'NJ', '35':'NM', 
                '36':'NY', '37':'NC', '38':'ND', '39':'OH', '40':'OK', '41':'OR', '42':'PA', '72':'PR', 
                '44':'RI', '45':'SC', '46':'SD', '47':'TN', '48':'TX', '49':'UT', '50':'VT', '51':'VA', 
                '53':'WA', '54':'WV', '55':'WI', '56':'WY'
};

// Dictionary to convert state abbreviations to full names
let stateNames = {
    'AK': 'Alaska',
    'AL': 'Alabama',
    'AR': 'Arkansas',
    'AS': 'American Samoa',
    'AZ': 'Arizona',
    'CA': 'California',
    'CO': 'Colorado',
    'CT': 'Connecticut',
    'DC': 'District of Columbia',
    'DE': 'Delaware',
    'FL': 'Florida',
    'GA': 'Georgia',
    'GU': 'Guam',
    'HI': 'Hawaii',
    'IA': 'Iowa',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'MA': 'Massachusetts',
    'MD': 'Maryland',
    'ME': 'Maine',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MO': 'Missouri',
    'MP': 'Northern Mariana Islands',
    'MS': 'Mississippi',
    'MT': 'Montana',
    'NA': 'National',
    'NC': 'North Carolina',
    'ND': 'North Dakota',
    'NE': 'Nebraska',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NV': 'Nevada',
    'NY': 'New York',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PA': 'Pennsylvania',
    'PR': 'Puerto Rico',
    'RI': 'Rhode Island',
    'SC': 'South Carolina',
    'SD': 'South Dakota',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VA': 'Virginia',
    'VI': 'Virgin Islands',
    'VT': 'Vermont',
    'WA': 'Washington',
    'WI': 'Wisconsin',
    'WV': 'West Virginia',
    'WY': 'Wyoming'
}

// Define endpoints for walkability score ranges (for county choropleth coloring and legend)
// let walkability_scores = [0, 4, 6.5, 9, 13];
let walkability_scores = [0, 5, 5.8, 6.8, 12];


// Create CyclOSM tile baselayer
let cyclosm = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  minZoom: 0,
  maxZoom: 20,
});


// Set default style for state choropleth
let stateStyle = {
                  fillColor: 'rgb(190,210,258)',
                  weight: 2,
                  opacity: 1,
                  color: 'gray',
                  dashArray: '',
                  fillOpacity: 0.4
                  };

// Set state style for mouseover
let stateHighlightStyle = {
                            fillColor: 'rgb(153,216,201)',
                            weight: 5,
                            color: "gray",
                            dashArray: '',
                            fillOpacity: 0.7
                          };

// Set state style when clicked
let stateSelectedStyle = {
                            weight: 5,
                            color: "gray",
                            dashArray: '',
                            fillOpacity: 0.5
                          };

////////////////////////////////////////////////////////////////////////////
//////////// FUNCTIONS /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

// Set default style for county choropleth
function countyStyle(feature) {
    return {
        fillColor: getCountyColor(feature.properties.walkability_score),
        weight: 2,
        opacity: 1,
        color: 'gray',
        dashArray: '',
        fillOpacity: 0.8
    };
}

// Reset style for county choropleth
function countyStyleReset(walkInd) {
    return {
        fillColor: getCountyColor(walkInd),
        weight: 2,
        opacity: 1,
        color: 'gray',
        dashArray: '',
        fillOpacity: 0.8
    }
};

// Set county style for mouseover
function countyHighlightStyle(walkInd) {
    return {
        fillColor: getCountyColor(walkInd),
        weight: 7,
        color: "lightgray",
        dashArray: '',
        fillOpacity: 0.3
    }   
};

// Set county style when clicked
function countySelectedStyle(walkInd) {
    return {
        fillColor: getCountyColor(walkInd),
        weight: 7,
        color: getCountyColor(walkInd),
        dashArray: '',
        fillOpacity: 0
    }
};

// Set default style for static county layer
function staticCountyStyle(feature) {
    return {
        fillColor: getCountyColor(feature.properties.walkability_score),
        weight: .1,
        opacity: .9,
        color: 'gray',
        dashArray: '3',
        fillOpacity: 0.7
    };
    }

// Define color function for county walkability choropleth 
function getCountyColor(walkInd) {
        return walkInd >= walkability_scores[4] ? '#7a0177' :
                walkInd >= walkability_scores[3] ? '#c51b8a' :
                walkInd >= walkability_scores[2]  ? '#f768a1' :
                walkInd >= walkability_scores[1]  ? '#fbb4b9' :
                                '#feebe2' ;
}

// Create function to define actions when each state feature is clicked
function onEachState(feature,layer) {  

    // Identify which state ID was just selected
    let selectedStateId = feature.properties.GEO_ID.slice(-2);

    // Retrieve current state abbreviation from dictionary
    let selectedStateAbb = stateDict[selectedStateId];

    // Filter countiesData geojson to only county features within selected state
    let selectedStateCounties = countiesData.features.filter(feature => {
        return feature.properties.STATE === selectedStateId;
    });

    // Define actions for interacting with state feature
    layer.on({

        // Set state highlight style on hover
        mouseover: e => {
            layer.setStyle(stateHighlightStyle);
        },

        // Reset state style when hover 
        mouseout: e => {
            stateLayer.setStyle(stateStyle);
        },

        // Set state style when selected
        click: e => {
            // Set selected state style when clicked
            layer.setStyle(stateSelectedStyle);

            // Zoom to fit state boundaries
            myMap.fitBounds(e.target._bounds);

            // Create/display county choropleth layer for selected state
            showCounties(selectedStateCounties, myMap);

            // Create markers for selected state
            showSchoolMarkers(selectedStateAbb);

            // Update panel info to show name of state and school count
            updatePanelInfo(feature, true);
            
            // Update charts on page
            updateScatter(selectedStateCounties);
            updateBar(selectedStateCounties);

            // Store as last layer clicked
            let prevLayerClicked = layer;
            }
        });
}

// Display county choropleth when state is clicked
function showCounties(selectedStateCounties) {

    // Store selected state ID and abbreviation
    let selectedStateId = selectedStateCounties[0].properties.STATE;
    let selectedState = stateDict[selectedStateId];

    // Clear existing county layers from previously clicked states
    countyLayer.clearLayers();

    // Create county geoJSON layer 
    counties = L.geoJson(selectedStateCounties, {
        style: countyStyle,

        // Define actions on each County feature
        onEachFeature: (feature,layer) => {
            layer.on({
                // Highlighted county actions
                mouseover: e => {
                    // Set to highlighted county style
                    let layer = e.target;
                    layer.setStyle(countyHighlightStyle(feature.properties.walkability_score));

                    // Maintain selected style for last county that was clicked (only resets on new county click)
                    if (prevLayerClicked) {
                        prevLayerClicked.setStyle(countySelectedStyle(prevWalkInd));
                    }
                },
                // Mouseout actions
                mouseout: e => {
                    // Reset to default color based on walkability index
                    let layer = e.target;
                    layer.setStyle(countyStyleReset(feature.properties.walkability_score));

                    // Maintain selected style for last county that was clicked (only resets on new county click)
                    if (prevLayerClicked) {
                        prevLayerClicked.setStyle(countySelectedStyle(prevWalkInd));
                    }
                },
                // Selecting state actions
                click: e => {
                    // Maintain selected style for last county that was clicked (only resets on new county click)
                    if (prevLayerClicked) {
                        prevLayerClicked.setStyle(countyStyleReset(prevWalkInd));
                    }

                    // Reset the state layer to default
                    let layer = e.target;
                    stateLayer.setStyle(stateStyle);

                    // Get selected county name
                    let selectedCountyId = `${feature.properties.STATE}${feature.properties.COUNTY}`;

                    // Adjust selected county style
                    layer.setStyle(countySelectedStyle(feature.properties.walkability_score));

                    // Update panel header with county/state name
                    updatePanelInfo(feature, false);
                    
                    // Create and display marker clusters for schools within selected county
                    showSchoolMarkers(selectedState, selectedCountyId);
                    
                    // Zoom to fit county boundaries
                    myMap.fitBounds(layer.getBounds(), false);

                    // Store last layer clicked and its walkability score to later reset it
                    prevLayerClicked = layer;
                    prevWalkInd = feature.properties.walkability_score;
                }
                // Show county name in pop-up when clicked
            }).bindPopup(`${feature.properties.NAME} ${feature.properties.LSAD}`);
        }
    });

    // Add leaflet geojson layer to existing countyLayer
    countyLayer.addLayer(counties);

    // Add county layer to map
    myMap.addLayer(countyLayer);
}


// Create markers from Public School data (function takes in and parses geoJSON data)
function addMarkers(data) {
  // Create icons for school markers
    let schoolIcon = L.icon({
        iconUrl: 'education.png',
        iconSize:     [40, 40], // size of the icon
        iconAnchor:   [20, 40], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
    });

    // Create icons for school markers for mouseover
    let bigIcon = L.icon({
        iconUrl: 'education.png',
        iconSize:     [60, 60], // size of the icon
        iconAnchor:   [30, 60], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -50] // point from which the popup should open relative to the iconAnchor
    });

    // Create school marker clusters for each state/county feature
    data.features.forEach(element => {
        // Add each location as individual marker with popup info
        schoolMarker = L.marker([element.geometry.y, element.geometry.x], {icon:schoolIcon})
                        .on({
                        mouseover: e => {
                            // Marker icon magnifies on mouseover
                            e.target.setIcon(bigIcon);
                        },
                        mouseout: e => 
                            // Marker icon size resets on mouseout
                            e.target.setIcon(schoolIcon)
                        // Display school name, city, and state in pop-up info
                        }).bindPopup(`<h6>${element.attributes.NAME}</h6><hr>
                                    <text>${element.attributes.CITY}, ${element.attributes.STATE}</text>`
                        );
        // Add marker to markers layer
        markers.addLayer(schoolMarker);
    });

    // Add marker layer to map object
    markers.addTo(myMap);
}


// Show marker clusters for selected county or state using data from Public Schools dataset
function showSchoolMarkers(state, county='') {

    // Clear any existing marker cluster layer
    markers.clearLayers();

    // Set county parameter to be empty by default
    let countyParameter = '';

    // Define base URL for Public School API call
    const url = "https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/Public_School_Location_201819/FeatureServer/0/";
    
    // Set default for current length of api return call (can only do 2000 at a time)
    let offsetCount = 0;

    // Check if county was entered and format additional query parameter for filtering data
    if (county !== '') {
        countyParameter = `%20AND%20CNTY%20%3D%20'${county}'`;
    }

    // Define query to return school count only for selected state (and county)
    let schoolCountQuery = `query?where=STATE%20%3D%20'${state}'${countyParameter}&outFields=*&returnCountOnly=true&outSR=4326&f=json`;
    // Define query for selected state (and county) with offset count parameter
    let schoolQueryOffset = `query?where=STATE%20%3D%20'${state}'${countyParameter}&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;

    // D3 call to Public School dataset
    d3.json(url+schoolCountQuery).then(data => {
        // Initialize variables to track total school count and number remaining to check
        let schoolsRemaining = data.count;
        let schoolCount = schoolsRemaining;

        // Only update total school count by state if new state selected
        if (county==='') {
            d3.select("#state-school-count").text(`${schoolCount} schools in ${state}`);
        }        

        // Loop until no schools left to check
        while (schoolsRemaining > 0) {
            // Update query URL for new offset amount
            schoolQueryOffset = `query?where=STATE%20%3D%20'${state}'${countyParameter}&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;
            
            // Reset query with updated offset count
            d3.json(url+schoolQueryOffset).then(response => {
                // Check if county was selected
                if (county!=='') {
                    // Store name of county in variable
                    let selectedCountyName = `${response.features[0].attributes.NMCNTY}`;
                    
                    // Update panel-body with school count for selected county
                    d3.select("#county-school-count").text(`${schoolCount} schools in ${selectedCountyName}`);
                }
                // Add markers for filtered data based on state or county
                addMarkers(response);
            });

            // Update offset count
            offsetCount += 2000;
            // Update number of schools left to check
            schoolsRemaining -= 2000;
        }
    });
}


// Create function to update panel for county or state
function updatePanelInfo (feature, stateOnly) {
    // Retrieve state abbreviation for selected state
    let stateAbbr = stateDict[feature.properties.STATE];
    // Retrieve full state anme for selected state
    let stateName = stateNames[stateAbbr];

    // State level info updates
    if (stateOnly) {
        // Update panel title to state abbreviation
        d3.select(".panel-title").text(stateName);

        // Clear existing county panel-body text
        d3.select("#county-school-count").text('(Select a county for more information)');
        d3.select("#walkability-score").text('')
        d3.select("#total-pop").text('');
        d3.select("#student-pop").text('');

    // County info updates
    } else {
        // Retrieve full county name
        let selectedCounty = `${feature.properties.NAME} ${feature.properties.LSAD}`;

        // Update panel title with county name and state abbreviation
        d3.select(".panel-title").text(`${selectedCounty}, ${stateAbbr}`);

        // Define variables from API for county stats
        let walkabilityIndex = parseFloat(feature.properties.walkability_score.toFixed(2));
        let studentPop = feature.properties.student_pop;
        let totalPop = feature.properties.population;
        // Calculate student percent of total county population
        let percentStud = parseFloat((studentPop/totalPop*100).toFixed(2));

        // Use D3 to add info to panel-body element
        d3.select("#walkability-score").text(`Avg Walkability Index: ${walkabilityIndex}`)
        d3.select("#total-pop").text(`Total County Population (Census 2019): ${totalPop}`);
        d3.select("#student-pop").text(`Total Student Population: ${studentPop} (${percentStud}%)`);
    }
}


// D3 to call our API for school/county data
d3.json(walkabilityUrl).then(results => {

    // Store results in global countiesData
    countiesData = results;

    // Create static county layer
    countyStatic = L.geoJson(countiesData, {
        style: staticCountyStyle});

    // State Layer from statesData geoJSON variable (state boundaries)
    stateLayer = L.geoJson(statesData, {
        // Set default state style
        style: stateStyle,
        // Call oneEachState function for each state (begins chain of interactive features)
        onEachFeature: onEachState
    });

    // Create the map object
    myMap = L.map("map", {
        center: [40.2659, -96.7467],
        zoom: 3,
        // Set only base map layer and state layer to start
        layers: [cyclosm, stateLayer],
        scrollWheelZoom: false
        });

    // Create legend object
    legend = L.control({position: 'bottomright'});

    // 
    legend.onAdd = function (myMap) {
        
        let div = L.DomUtil.create('div', 'info legend');
        let categories = ['Least Walkable', 'Below Average', 'Average', 'Above Average', 'Most Walkable'];
        let labels = ['<strong>Walkability Index</strong><br>'];
        // Loop through our walkability intervals and generate a label with a colored square for each interval
        for (let i = 0; i < walkability_scores.length; i++) {
            // Add color icons for each range
            div.innerHTML += labels.push(
                '<i style="background:' + getCountyColor(walkability_scores[i]) + '"></i> ' +
                categories[i] + '<br>');
            }
        div.innerHTML = labels.join('');

        return div;
    };

    // Add legend to map
    legend.addTo(myMap);

});