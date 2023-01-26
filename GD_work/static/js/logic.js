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

// Define toner tile baselayer
let toner = new L.StamenTileLayer("toner-lite");

// Create CyclOSM tile baselayer
let cyclosm = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  minZoom: 0,
  maxZoom: 20,
});

walkabilityUrl = "https://test-wsuz.onrender.com/api/v1.0/project3/group4/data";

// Set default style for state choropleth
let stateStyle = {
                  fillColor: 'rgb(200,210,258)',
                  weight: 2,
                  opacity: 1,
                  color: 'gray',
                  dashArray: '',
                  fillOpacity: 0.7
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

// $.getJSON(walkabilityUrl, function(data) {
//     console.log(data);
// });


// addGeoJson();





// // Define color function for county walkability choropleth 
// function getCountyColor(walkInd) {
//         return walkInd > 16 ? '#810f7c' :
//                 walkInd > 12 ? '#8856a7' :
//                 walkInd > 8  ? '#8c96c6' :
//                 walkInd > 4  ? '#b3cde3' :
//                                 '#edf8fb' ;

function getCountyColor(walkInd) {
    return walkInd > 9 ? '#810f7c' :
            walkInd > 7 ? '#8856a7' :
            walkInd > 4 ? '#8c96c6' :
            walkInd > 1  ? '#b3cde3' :
                            '#edf8fb' ;
}

  //rgb("244,200,96") //least walkable (1-5.75)
  //rgb("255,255,163") //below avg walkable (5.76-10.5)
  //rgb("204,253,166") //above avg walkable (10.51-15.25)
  //rgb("133,192,95") // most walkable (15.26 - 20)


// Create function to define actions when each state feature is clicked
function onEachState(feature,layer) {

    async function addGeoJson() {
        const response = await fetch("static/data/countygeo_jack.json");
        const countiesData = await response.json();

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
            let layer = e.target;
            layer.setStyle(stateSelectedStyle);

            // Update panel title to state abbr.
            d3.select('.panel-title').text(stateNames[selectedStateAbb]);
            
            // Check for previously selected states and reset them
            if (prevLayerClicked !== null) {
                prevLayerClicked.setStyle(stateStyle);
            }

            // Zoom to fit state boundaries
            myMap.fitBounds(layer.getBounds());

            // Store current selection for later restyling
            prevLayerClicked = layer;

            // Create/display county choropleth layer for selected state
            showCounties(selectedStateCounties, myMap);

            // Create markers for selected state
            showSchoolMarkersState(selectedStateAbb);
                // showSchoolMarkers(selectedStateAbb);
            }
        });
    }
    addGeoJson();
}




// Show school marker clusters when county is selected
function showSchoolMarkersCounty(state, county='') {
        // Clear any existing marker cluster layer
        markers.clearLayers();

        // Reset any existing county school count text in panel-body
        d3.select("#county-school-count").text('');
      
        // Format county name to match public school API
        if (county !== '') {
            county = `${county} County`
        }

        // Set default for current length of api return call (can only do 2000 at a time)
        let offsetCount = 0;

        // Define base URL for Public School API call
        const url = "https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/School_Characteristics_Current/FeatureServer/2/";
      
        // Define query to return school count for selected county
        let countyCountQuery = `query?where=LSTATE%20%3D%20'${state}'%20AND%20NMCNTY%20%3D%20'${county}'&outFields=*&returnCountOnly=true&outSR=4326&f=json`;
        // Define query for selected state with offset count parameter
        let stateQueryOffset = `query?where=LSTATE%20%3D%20'${state}'%20AND%20NMCNTY%20%3D%20'${county}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;
  
        // Make API call to get school count for selected county
        d3.json(url+countyCountQuery).then(data => {
            // Store school count (total number of schools in county)
            let schoolCount = data.count;
            // Initialize number of schools left to check
            let schoolsRemaining = schoolCount;
            
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
  


  // Show marker cluster layer when state selected
 function showSchoolMarkersState(state) {
    // Clear any existing marker cluster layer
    markers.clearLayers();

    // Set default for current length of api return call (can only do 2000 at a time)
    let offsetCount = 0;
  
    // Define base URL for Public School API call
    const url = "https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/School_Characteristics_Current/FeatureServer/2/";
    // Define query to retrieve list of all school IDs
    const stateIdsOnly = `query?where=LSTATE%20%3D%20'${state}'&outFields=*&returnIdsOnly=true&outSR=4326&f=json`;
    // Define query for selected state with offset count parameter
    let stateQueryOffset = `query?where=LSTATE%20%3D%20'${state}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;
  
    // Make API call to get list of all school IDs
    d3.json(url+stateIdsOnly).then(data => {
  
        // Set number of schools left equal to total school count
        let schoolsRemaining = data.objectIds.length;
        // Clear existing county school count text in panel-body
        d3.select("#county-school-count").text('');
        // Update panel-body to show total school count for selected state
        d3.select("#state-school-count").text(`${schoolsRemaining} schools in ${state}`);

        // Loop until no schools left to check
        while (schoolsRemaining > 0) {
            // Reset query with updated offset count
            stateQueryOffset = `query?where=LSTATE%20%3D%20'${state}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;
            
            // Make API call to get next "page" of schools
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





// Display county choropleth when state is clicked
function showCounties(selectedStateCounties, map) {

    let selectedStateId = selectedStateCounties[0].properties.STATE;
    let selectedState = stateDict[selectedStateId];
    // let walkabilityIndex = stateJson;

    function style(feature) {
        return {
            fillColor: getCountyColor(feature.properties.walkability_score),
            weight: 2,
            opacity: 1,
            color: 'gray',
            dashArray: '',
            fillOpacity: 0.7
        };
    }

    // Set default style for county choropleth
    function countyStyle(walkInd) {
        return {
            fillColor: getCountyColor(walkInd),
            weight: 2,
            opacity: 1,
            color: 'gray',
            dashArray: '',
            fillOpacity: 0.7
        }
    };

    // Set county style for mouseover
    function countyHighlightStyle(walkInd) {
        return {
            fillColor: getCountyColor(walkInd),
            weight: 5,
            color: "gray",
            dashArray: '',
            fillOpacity: 0.7
        }   
    };

    // Set county style when clicked
    function countySelectedStyle(walkInd) {
        return {
            fillColor: getCountyColor(walkInd),
            weight: 5,
            color: "gray",
            dashArray: '',
            fillOpacity: 0.5
        }
    };

    countyLayer.clearLayers();
    let counties = L.geoJson(selectedStateCounties, {
        style: style,

        onEachFeature: (feature,layer) => {
            layer.on({
                mouseover: e => {
                    let layer = e.target;
                    layer.setStyle(countyHighlightStyle(feature.properties.walkability_score));
                    layer.bringToFront();
                    console.log(feature.properties.walkability_score);
                },
                mouseout: e => {
                    let layer = e.target;
                    layer.setStyle(countyStyle(feature.properties.walkability_score));
                    if (prevLayerClicked !== null) {
                    prevLayerClicked.setStyle(countySelectedStyle(feature.properties.walkability_score));
                    }
                    layer.bringToFront();

                },
                click: e => {
                    // Get selected county name
                    let selectedCounty = `${feature.properties.NAME}`;

                    // Update panel header with county/state name
                    d3.select(".panel-title").text(`${feature.properties.NAME} County, ${selectedState}`);

                    // Create and display marker clusters for schools within selected county
                    showSchoolMarkersCounty(selectedState, selectedCounty);
                    // showSchoolMarkers(selectedState, selectedCounty);

                    // Reset the state layer to default
                    stateLayer.setStyle(stateStyle);

                    // Check if a county was selected before and reset its style
                    if (prevLayerClicked !== null) {
                    prevLayerClicked.setStyle(countyStyle(feature.properties.walkability_score));
                    }

                    // Adjust selected county style
                    let layer = e.target;
                    layer.setStyle(countySelectedStyle(feature.properties.walkability_score));

                    layer.bringToFront();
                    
                    // Zoom to fit county boundaries
                    map.fitBounds(layer.getBounds());
                    
                    // Store current selection for later restyling
                    prevLayerClicked = layer;
                }
            }).bindPopup(`${feature.properties.NAME} County`);
        }
  });

  // Add leaflet geojson layer to existing countyLayer
  countyLayer.addLayer(counties);

  // Remove any existing county layers
  layerControl.removeLayer(countyLayer);
  // Add county layer to layer control
  layerControl.addOverlay(countyLayer, "Counties");
  // Add county layer to map
  map.addLayer(countyLayer);
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


    data.features.forEach(element => {
      // console.log(`${element.attributes.SCH_NAME}, ${element.attributes.LCITY}, ${element.attributes.LSTATE}`)
      // Add each location as individual marker with popup info
      
        schoolMarker = L.marker([element.geometry.y, element.geometry.x], {icon:schoolIcon})
                        .on({
                        mouseover: e => {
                            e.target.setIcon(bigIcon);
                        },
                        mouseout: e => 
                            e.target.setIcon(schoolIcon)
                        }).bindPopup(`<h5>${element.attributes.SCH_NAME}</h5><hr>
                                    <h6>${element.attributes.LCITY}, ${element.attributes.LSTATE}</h6>
                                    <p>Level: ${element.attributes.SCHOOL_LEVEL}<br>
                                    Student Population: ${element.attributes.TOTAL}<br>
                                    Total Free/Reduced Lunch: ${element.attributes.TOTFRL}<br>
                                    % Free/Reduced Lunch: ${((element.attributes.TOTFRL/element.attributes.TOTAL)*100).toFixed(2)}%</p>`
                        )
        markers.addLayer(schoolMarker);

        // Add coordinates to schoolLocations for heat map                
        schoolLocations.push([element.geometry.y, element.geometry.x]);
    }); // End ForEach

    // console.log("AddMARKERS FUNCTION:", markers);
    markers.addTo(myMap);
  
    
}





let prevLayerClicked = null;


///// Initialize Map


// State Layer
let stateLayer = L.geoJson(statesData, {
    style: stateStyle,
    onEachFeature: onEachState
});

// Create base and overlay maps
let baseMaps = {
    Toner: toner,
    CyclOSM: cyclosm
}


let overlayMaps = {
    States: stateLayer
}

// Create the map object
let myMap = L.map("map", {
    center: [40.2659, -96.7467],
    zoom: 3,
    layers: [cyclosm, stateLayer]
    });

// Create layer group to store county boundary layers 
let countyLayer = L.layerGroup();

// Add layer control
let layerControl = L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// Create empty list to store school locations
let schoolLocations = [];

// Initialize the marker cluster group (will add markers in while loop)
let markers = L.markerClusterGroup();





/// ATTEMPT to combine two functions into one
// Show school marker clusters when county is selected
function showSchoolMarkers(state, county='') {
    // Clear any existing marker cluster layer
    markers.clearLayers();

    // Reset any existing county school count text in panel-body
    d3.select("#county-school-count").text('');

    // Set county parameter to be empty by default
    let countyParameter = '';
  
    // Format county name to match public school API
    if (county !== '') {
        county = `${county} County`;
        countyParameter = `'%20AND%20NMCNTY%20%3D%20'${county} County'`;
    }

    // Set default for current length of api return call (can only do 2000 at a time)
    let offsetCount = 0;

    // Define base URL for Public School API call
    const url = "https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/School_Characteristics_Current/FeatureServer/2/";
  
    // Define query to return school count for selected county
    let countyCountQuery = `query?where=LSTATE%20%3D%20'${state}'${countyParameter}'&outFields=*&returnCountOnly=true&outSR=4326&f=json`;
    // Define query for selected state with offset count parameter
    let stateQueryOffset = `query?where=LSTATE%20%3D%20'${state}'%20AND%20NMCNTY%20%3D%20'${county}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;

    let schoolsRemaining = 2000;
    let schoolCount = 0;

    // Loop until no schools left to check
    while (schoolsRemaining > 0) {
        console.log(offsetCount, schoolsRemaining);
        stateQueryOffset = `query?where=LSTATE%20%3D%20'${state}'%20AND%20NMCNTY%20%3D%20'${county}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;
        // Reset query with updated offset count
        d3.json(url+stateQueryOffset).then(response => {
            // Create/display marker cluster layer of schools for selected state
            addMarkers(response);
            schoolCount += response.features.length;
            // Clear existing county school count text in panel-body
        // d3.select("#county-school-count").text('');
        // // Update panel-body to show total school count for selected state
        // d3.select("#state-school-count").text(`${schoolCount} schools in ${state}`);
        // // Update panel-body with school count for selected county
        // d3.select("#county-school-count").text(`${schoolCount} schools in ${county}`);
        });

        // Update offset count
        offsetCount += 2000;
        // Update number of schools left
        schoolsRemaining -= 2000;
    }
}
