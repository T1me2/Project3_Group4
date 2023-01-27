// Initialize variables to store API response
let countiesData;
let stateLayer;
let myMap;
let countyLayer;
let layerControl;
let markers;
let counties;
let legend;

// Create empty list to store school locations
let schoolLocations = [];


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
let walkability_scores = [0, 4, 6.5, 9, 13];

// Define URL for our rendered walkability/school GeoJSON API
let walkabilityUrl = "https://test-wsuz.onrender.com/api/v1.0/project3/group4/data";

// Define toner tile baselayer
let toner = new L.StamenTileLayer("toner-lite");

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

// Set default style for county choropleth
function style(feature) {
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
function countyStyle(walkInd) {
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
    weight: 5,
    color: "lightgray",
    dashArray: '',
    fillOpacity: 0.5
}   
};

// Set county style when clicked
function countySelectedStyle(walkInd) {
return {
    fillColor: getCountyColor(walkInd),
    weight: 5,
    color: "gray",
    dashArray: '',
    fillOpacity: 0.8
}
};

// // Define color function for county walkability choropleth 
function getCountyColor(walkInd) {
        return walkInd >= walkability_scores[4] ? '#7a0177' :
                walkInd >= walkability_scores[3] ? '#c51b8a' :
                walkInd >= walkability_scores[2]  ? '#f768a1' :
                walkInd >= walkability_scores[1]  ? '#fbb4b9' :
                                '#feebe2' ;
}


///// Initialize Map
// Wrap in function that calls our API for school/county data
d3.json(walkabilityUrl).then(results => {

    countiesData = results;
    console.log(results);

    // State Layer
    stateLayer = L.geoJson(statesData, {
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
    myMap = L.map("map", {
        center: [40.2659, -96.7467],
        zoom: 3,
        layers: [cyclosm, stateLayer]
        });

    // Create layer group to store county boundary layers 
    countyLayer = L.layerGroup();

    // Add layer control
    layerControl = L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Initialize the marker cluster group (will add markers in while loop)
    markers = L.markerClusterGroup();
    counties = L.geoJson();

    // Create legend object
    legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {
            let div = L.DomUtil.create('div', 'info legend');
            let categories = ['Least Walkable', 'Below Average', 'Average', 'Above Average', 'Most Walkable'];
            let labels = ['<strong>Walkability Index</strong><br>'];
        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < walkability_scores.length; i++) {
            
            div.innerHTML += labels.push(
                '<i style="background:' + getCountyColor(walkability_scores[i]) + '"></i> ' +
                // walkability_scores[i] + (walkability_scores[i + 1] ? '&ndash;' + walkability_scores[i + 1] + '<br>' : '+'));
                categories[i] + '<br>');
            }
        div.innerHTML = labels.join('');

        return div;
    };

    legend.addTo(myMap);
});


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
            console.log("Mouseover on each state");
        },

        // Reset state style when hover 
        mouseout: e => {
            stateLayer.setStyle(stateStyle);
        },

        // Set state style when selected
        click: function(e) {
            // let layer = e.target;

            layer.setStyle(stateSelectedStyle);

            // Update panel title to state abbr.
            d3.select('.panel-title').text(stateNames[selectedStateAbb]);
            
            // Check for previously selected states and reset them
            if (prevLayerClicked !== null) {
                prevLayerClicked.setStyle(stateStyle);
            }

            // Zoom to fit state boundaries
            myMap.fitBounds(e.target._bounds);

            // Store current selection for later restyling
            prevLayerClicked = layer;

            // Create/display county choropleth layer for selected state
            showCounties(selectedStateCounties, myMap);

            // Create markers for selected state
            showSchoolMarkersState(selectedStateAbb);
                // showSchoolMarkers(selectedStateAbb);

            // PLOT HERE

            }
        });
    }
    // addGeoJson();
// }




// Show school marker clusters when county is selected
function showSchoolMarkersCounty(state, county='') {
        // Clear any existing marker cluster layer
        markers.clearLayers();

        // Reset any existing county school count text in panel-body
        d3.select("#county-school-count").text('');
      
        // Format county name to match public school API
        // if (county !== '') {
        //     county = `${county} County`
        // }


        // Set default for current length of api return call (can only do 2000 at a time)
        let offsetCount = 0;

        // Define base URL for Public School API call
        // const url = "https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/School_Characteristics_Current/FeatureServer/2/";
        const url = "https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/Public_School_Location_201819/FeatureServer/0/"
        // Define query to return school count for selected county
        let countyCountQuery = `query?where=STATE%20%3D%20'${state}'%20AND%20CNTY%20%3D%20'${county}'&outFields=*&returnCountOnly=true&outSR=4326&f=json`;
                                // query?where=1%3D1&outFields=*&returnCountOnly=true&outSR=4326&f=json
        // Define query for selected state with offset count parameter
        let stateQueryOffset = `query?where=STATE%20%3D%20'${state}'%20AND%20CNTY%20%3D%20'${county}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;
  
        // Make API call to get school count for selected county
        d3.json(url+countyCountQuery).then(data => {

            // Store school count (total number of schools in county)
            let schoolCount = data.count;
    
            // Initialize number of schools left to check
            let schoolsRemaining = schoolCount;
            
            

            // Looop until no schools left to check
            while (schoolsRemaining > 0) {
                stateQueryOffset = `query?where=STATE%20%3D%20'${state}'%20AND%20CNTY%20%3D%20'${county}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;
                // Reset query with updated offset count
                d3.json(url+stateQueryOffset).then(response => {
                    let selectedCountyName = `${response.features[0].attributes.NMCNTY}`;
                    
                    // Update panel-body with school count for selected county
                    d3.select("#county-school-count").text(`${schoolCount} schools in ${selectedCountyName}`);
                    // d3.select("#walkability-score").text()

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
function showCounties(selectedStateCounties) {

    let selectedStateId = selectedStateCounties[0].properties.STATE;
    let selectedState = stateDict[selectedStateId];

    countyLayer.clearLayers();
    counties = L.geoJson(selectedStateCounties, {
        style: style,

        onEachFeature: (feature,layer) => {
            layer.on({
                mouseover: e => {
                    let layer = e.target;
                    layer.setStyle(countyHighlightStyle(feature.properties.walkability_score));
                    layer.bringToFront();
                },
                mouseout: e => {
                    let layer = e.target;
                    layer.setStyle(countyStyle(feature.properties.walkability_score));
                    if (prevLayerClicked !== null) {
                        prevLayerClicked.setStyle(style);
                    }
                    layer.bringToFront();

                },
                click: e => {
                    // Get selected county name
                    let selectedCountyId = `${feature.properties.STATE}${feature.properties.COUNTY}`;
           
                    // Adjust selected county style
                    let layer = e.target;
                    layer.setStyle(countySelectedStyle(feature.properties.walkability_score));

                    // Update panel header with county/state name
                    d3.select(".panel-title").text(`${feature.properties.NAME}, ${selectedState}`);

                    // Create and display marker clusters for schools within selected county
                    showSchoolMarkersCounty(selectedState, selectedCountyId);

                    // Reset the state layer to default
                    // stateLayer.setStyle(stateStyle);

                    // Check if a county was selected before and reset its style
                    if (prevLayerClicked !== null) {
                        // prevLayerClicked.setStyle(countyStyle(prevWalkInd));
                    }

                    layer.bringToFront();
                    
                    // Zoom to fit county boundaries
                    myMap.fitBounds(layer.getBounds());
                    
                    // Store current selection for later restyling
                    prevLayerClicked = layer;
                    prevWalkInd = feature.properties.walkability_score
                }
            }).bindPopup(`${feature.properties.NAME} ${feature.properties.LSAD}`);
            console.log(feature.properties);
        }
  });

  // Add leaflet geojson layer to existing countyLayer
  countyLayer.addLayer(counties);

  // Remove any existing county layers
  layerControl.removeLayer(countyLayer);
  // Add county layer to layer control
  layerControl.addOverlay(countyLayer, "Counties");
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
                        }).bindPopup(`<h7>${element.attributes.NAME}</h7><hr>
                                    <p>${element.attributes.CITY}, ${element.attributes.STATE}</p>`
                        )
        markers.addLayer(schoolMarker);

        // Add coordinates to schoolLocations for heat map                
        schoolLocations.push([element.geometry.y, element.geometry.x]);
    }); // End ForEach


    markers.addTo(myMap);
}





let prevLayerClicked = null;
let prevWalkInd = null;





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
        countyParameter = `'%20AND%20CNTY%20%3D%20'${county}'`;
    }

    // Set default for current length of api return call (can only do 2000 at a time)
    let offsetCount = 0;

    // Define base URL for Public School API call
    const url = "https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/School_Characteristics_Current/FeatureServer/2/";
  
    // Define query to return school count for selected county
    let countyCountQuery = `query?where=STATE%20%3D%20'${state}'${countyParameter}'&outFields=*&returnCountOnly=true&outSR=4326&f=json`;
    // Define query for selected state with offset count parameter
    let stateQueryOffset = `query?where=STATE%20%3D%20'${state}'%20AND%20CNTY%20%3D%20'${county}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;

    let schoolsRemaining = 2000;
    let schoolCount = 0;

    // Loop until no schools left to check
    while (schoolsRemaining > 0) {
        stateQueryOffset = `query?where=STATE%20%3D%20'${state}'%20AND%20CNTY%20%3D%20'${county}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;
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
