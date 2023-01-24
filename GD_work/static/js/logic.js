let stateDict = {'01':'AL', '02':'AK', '04':'AZ', '05':'AR', '06':'CA', '08':'CO', '09':'CT', '10':'DE', 
                '11':'DC', '12':'FL', '13':'GA', '15':'HI', '16':'ID', '17':'IL', '18':'IN', '19':'IA', 
                '20':'KS', '21':'KY', '22':'LA', '23':'ME','24':'MD', '25':'MA', '26':'MI', '27':'MN', 
                '28':'MS', '29':'MO', '30':'MT', '31':'NE', '32':'NV', '33':'NH', '34':'NJ', '35':'NM', 
                '36':'NY', '37':'NC', '38':'ND', '39':'OH', '40':'OK', '41':'OR', '42':'PA', '72':'PR', 
                '44':'RI', '45':'SC', '46':'SD', '47':'TN', '48':'TX', '49':'UT', '50':'VT', '51':'VA', 
                '53':'WA', '54':'WV', '55':'WI', '56':'WY'
};

// Create array of state abbreviations 
let stateNames = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 
                  'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 
                  'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA',
                  'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

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
                  fillColor: 'rgb(140,150,198)',
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
let countyStyle = {
                    fillColor: 'rgb(224,236,244)',
                    weight: 2,
                    opacity: 1,
                    color: 'gray',
                    dashArray: '',
                    fillOpacity: 0.7
                  };
// Set county style for mouseover
let countyHighlightStyle = {
                            fillColor: 'rgb(65,182,196)',
                            weight: 5,
                            color: "gray",
                            dashArray: '',
                            fillOpacity: 0.7
                          };

// Set county style when clicked
let countySelectedStyle = {
                            fillColor: 'rgb(65,182,196)',
                            weight: 5,
                            color: "gray",
                            dashArray: '',
                            fillOpacity: 0.5
                          };

// Define color function for county walkability choropleth 
function getCountyColor(walkInd) {
  return walkInd > 16 ? '#810f7c' :
         walkInd > 12 ? '#8856a7' :
         walkInd > 8  ? '#8c96c6' :
         walkInd > 4  ? '#b3cde3' :
                        '#edf8fb' ;

  //rgb("244,200,96") //least walkable (1-5.75)
  //rgb("255,255,163") //below avg walkable (5.76-10.5)
  //rgb("204,253,166") //above avg walkable (10.51-15.25)
  //rgb("133,192,95") // most walkable (15.26 - 20)
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
        //   let layer = e.target;
          layer.setStyle(stateHighlightStyle);
      },

      // Reset state style when hover 
      mouseout: e => {
          stateLayer.setStyle(stateStyle);
        //   let layer = e.target;
      },

      // Set state style when selected
      click: e => {
          let layer = e.target;
          layer.setStyle(stateSelectedStyle);

          // Update panel title to state abbr.
          d3.select('.panel-title').text(selectedStateAbb);
          
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
          showSchoolMarkers(selectedStateAbb);
      }
  });
}

// Make API call to public school dataset for selected state/county and display on map
function showSchoolMarkers(state, county='') {
    markers.clearLayers();

    const stateIdsOnly = `query?where=LSTATE%20%3D%20'${state}'&outFields=*&returnIdsOnly=true&outSR=4326&f=json`

    // Initialize first indices of each "page" to 0 and 1999
    let firstIndex = 0;
    let lastIndex = 2000;

    // Set default for current length of api return call (can only do 2000 at a time)
    let currentLength = 2000;
    let offsetCount = 0;

    const url = "https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/School_Characteristics_Current/FeatureServer/2/";

    // Check if county was selected
    if (county !== '') {county = `${county} County`
        // Define query to public school API for selected state and county
        let stateQuery = `query?where=LSTATE%20%3D%20'${state}'%20AND%20NMCNTY%20%3D%20'${county}'%20AND%20OBJECTID>${firstIndex}&&outFields=*&outSR=4326&f=json`;
        // Define query with offset count (when more than 2000 school features returned)
        let stateQueryOffset = `query?where=LSTATE%20%3D%20'${state}'%20AND%20NMCNTY%20%3D%20'${county}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;

        // Make initial call to API to check how many
        d3.json(url+stateQueryOffset).then(data => {

            stateQueryOffset = `query?where=LSTATE%20%3D%20'${state}'%20AND%20NMCNTY%20%3D%20'${county}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;
        
            let schoolCount = data.features.length;
            let schoolsRemaining = schoolCount;

            if (schoolCount <= 2000) {
                d3.json(url+stateQueryOffset).then(response => {
                    // Call addMarkers to create marker cluster layer from API response
                    addMarkers(response);
                    console.log(response);
                });
            }
            else {
                while (schoolsRemaining > 0) {
                    d3.json(url+stateQueryOffset).then(response => {
                        // Call addMarkers to create marker cluster layer from API response
                        addMarkers(response)
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
    // When only a state is selected
    else { 
        d3.json(url+stateIdsOnly).then(data => {

            let schoolCount = data.objectIds.length;
            let schoolsRemaining = schoolCount;
    
            if (schoolCount <= 2000) {
                d3.json(url+stateQueryOffset).then(response => {
                    // Call addMarkers to create marker cluster layer from API response
                    addMarkers(response)
                });
            }
            else {
                while (schoolsRemaining > 0) {
                    stateQueryOffset = `query?where=LSTATE%20%3D%20'${state}'&resultOffset=${offsetCount}&outFields=*&outSR=4326&f=json`;
                    d3.json(url+stateQueryOffset).then(response => {
                        // Call addMarkers to create marker cluster layer from API response
                        addMarkers(response)
                    });
    
                    offsetCount += 2000;
                    schoolsRemaining -= 2000;
                }
            }
        });
    }
}

// Display county choropleth when state is clicked
function showCounties(stateJson, map) {

  let selectedStateId = stateJson[0].properties.STATE;
  let selectedState = stateDict[selectedStateId];

  countyLayer.clearLayers();
  let counties = L.geoJson(stateJson, {
      style: countyStyle,

      onEachFeature: (feature,layer) => {
          layer.on({
            mouseover: e => {
                let layer = e.target;
                layer.setStyle(countyHighlightStyle);
                layer.bringToFront();
                // layer.openPopup(`${feature.properties.NAME} County`);
            },
            mouseout: e => {
                let layer = e.target;
                layer.setStyle(countyStyle);
                if (prevLayerClicked !== null) {
                  prevLayerClicked.setStyle(countySelectedStyle);
                }
                layer.bringToFront();

            },
            click: e => {
                // Get selected county name
                let selectedCounty = `${feature.properties.NAME}`;

                // Update panel header with county/state name
                d3.select('.panel-title').text(`${feature.properties.NAME} County, ${selectedState}`);

                // Create and display marker clusters for schools within selected county
                showSchoolMarkers(selectedState, selectedCounty);

                // Reset the state layer to default
                stateLayer.setStyle(stateStyle);

                // Check if a county was selected before and reset its style
                if (prevLayerClicked !== null) {
                  prevLayerClicked.setStyle(countyStyle);
                }

                // Adjust selected county style
                let layer = e.target;
                layer.setStyle(countySelectedStyle);

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
                        }).bindPopup(`<h3>${element.attributes.SCH_NAME}</h3><hr>
                                    <h5>${element.attributes.LCITY}, ${element.attributes.LSTATE}</h5>
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

// States Layer
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
    layers: [toner, stateLayer]
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

myMap.invalidateSize();
///// Create function to initialize dashboard and create dropdown menu
// function createDropdownMenu() {
//     // Loop through sample data to add sample IDs to dropdown menu
//     for (i=0; i<stateNames.length; i++) {
//       // Select the dropdown menu element using D3
//       let dropDownMenu = d3.select("#selDataset");
//       // Add new "option" element for every sample in dataset
//       let newOption = dropDownMenu.append("option");
//       // Set text in each option to the sample ID
//       newOption.text(stateNames[i]);

//       console.log("dropdownMenu", dropDownMenu);
//     }
//   };
  
//   ///// Create function to update page based on changes in dropdown menu
//   function optionChanged(state) {
//     console.log("optionChanged:", state);
//     // Update charts to data for selected sample ID
//     createCharts(sampleID);
//     // Updata demographic info panel for selected sample ID
//     getMetadata(sampleID);
//   }
  
  // createDropdownMenu();


//   let heat = L.heatLayer(schoolLocations, {
//     radius:30,
//     blur:10
//   }).addTo(myMap);

// layerControl.addOverlay(heat, "Heat");




