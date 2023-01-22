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

// Define the street and toner tile layers
let toner = new L.StamenTileLayer("toner-lite");


// Define color function for county walkability choropleth 
function getCountyColor(walkInd) {
  return walkInd > 16 ? '#810f7c' :
         walkInd > 12 ? '#8856a7' :
         walkInd > 8  ? '#8c96c6' :
         walkInd > 4  ? '#b3cde3' :
                        '#edf8fb' ;
}

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
                            fillOpacity: 0.7
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
                            fillOpacity: 0.7
                          };

// Counties Layer
function showCounties(state, map) {

  let selectedStateId = state[0].properties.STATE;
  let selectedState = stateDict[selectedStateId];
  showSchoolMarkers(selectedState);
  // console.log("selectedState", selectedState);
  

  countyLayer.clearLayers();
  let counties = L.geoJson(state, {
      style: countyStyle,

      onEachFeature: (feature,layer) => {
          layer.on({
            mouseover: e => {
                let layer = e.target;
                layer.setStyle(countyHighlightStyle);
                // layer.bringToFront();
            },
            mouseout: e => {
                let layer = e.target;
                layer.setStyle(countyStyle);
                if (prevLayerClicked !== null) {
                  prevLayerClicked.setStyle(countyStyle);
                }
                layer.bringToFront();

            },
            click: e => {
              markers.clearLayers();
                stateLayer.setStyle(stateStyle);

                if (prevLayerClicked !== null) {
                  prevLayerClicked.setStyle(stateStyle);
                }

                let layer = e.target;
                layer.setStyle(countySelectedStyle);
                layer.bringToFront();
                
                map.fitBounds(layer.getBounds());
                let selectedCounty = `${feature.properties.NAME}`
                
                showSchoolMarkers(selectedState, selectedCounty);
                prevLayerClicked = layer;
            }
            }).bindPopup(`${feature.properties.NAME} County`);
      }
  });
  
  countyLayer.addLayer(counties);
  map.addLayer(countyLayer);
}


function onEachState(feature,layer) {
  // Identify current state
  let selectedStateId = feature.id;

  // Retrieve current state ID number from dictionary
  let selectedStateAbb = stateDict[feature.id]

  let selectedStateCounties = countiesData.features.filter(feature => {
    return feature.properties.STATE === selectedStateId;
  });

  layer.on({
      mouseover: e => {
          let layer = e.target;
          layer.setStyle(stateHighlightStyle);
          layer.bringToFront();
          console.log("onEachState mouseover", layer);
      },
      mouseout: e => {
          let layer = e.target;
          layer.setStyle(stateStyle);
          if (prevLayerClicked === null) {layer.bringToFront();}
          // if (prevLayerClicked !== null) {
          //   prevLayerClicked.setStyle(stateStyle);
          // }
          console.log("onEachState mouseout", layer);
      },
      click: e => {
          let layer = e.target;
          layer.setStyle(stateSelectedStyle);
          
          if (prevLayerClicked !== null) {
            prevLayerClicked.setStyle(stateStyle);
          }

          myMap.fitBounds(e.target.getBounds());
          // layer.bringToFront();
          prevLayerClicked = layer;

          // Create/display county choropleth layer for selected state
          showCounties(selectedStateCounties, myMap);

          // Create markers for selected state
          // showSchoolMarkers(selectedStateAbb);

          console.log("onEachState click", layer);
      }
  });
}

let prevLayerClicked = null;

// States Layer
let stateLayer = L.geoJson(statesData, {
    style: stateStyle,
    onEachFeature: onEachState
});

// let heat = L.heatLayer(locations, {
//     radius:30,
//     blur:10
//   });

// Create base and overlay maps
let baseMaps = {
    Toner: toner
}


let overlayMaps = {
    States: stateLayer,
    // Counties: countyLayer
}

// Create the map object
let myMap = L.map("map", {
    center: [40.2659, -96.7467],
    zoom: 3,
    layers: [toner, stateLayer]
    });

let countyLayer = L.layerGroup();

// Add layer control
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);



// Create icons for school markers
let schoolIcon = L.icon({
    iconUrl: 'education.png',
    iconSize:     [40, 40], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
// Create icons for school markers for mouseover
let bigIcon = L.icon({
    iconUrl: 'education.png',
    iconSize:     [80, 80], // size of the icon
    iconAnchor:   [40, 130], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

// Create empty list to store school locations
let schoolLocations = [];

// Initialize the marker cluster group (will add markers in while loop)
let markers = L.markerClusterGroup();

function showSchoolMarkers(state, county='*') {
  // console.log("SHOW SCHOOL MARKERS:",state, county)
    markers.clearLayers();
    const stateIdsOnly = `query?where=LSTATE%20%3D%20'${state}'&outFields=*&returnIdsOnly=true&outSR=4326&f=json`

    if (county !== '*') {county = `${county} County`}
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


function addMarkers(data) {
    markers.clearLayers();

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


///// Create function to initialize dashboard and create dropdown menu
function createDropdownMenu() {
    // Loop through sample data to add sample IDs to dropdown menu
    for (i=0; i<stateNames.length; i++) {
      // Select the dropdown menu element using D3
      let dropDownMenu = d3.select("#selDataset");
      // Add new "option" element for every sample in dataset
      let newOption = dropDownMenu.append("option");
      // Set text in each option to the sample ID
      newOption.text(stateNames[i]);
    }
  };
  
  // ///// Create function to update page based on changes in dropdown menu
  // function optionChanged(state = stateNames[0]) {
  //   // Update charts to data for selected sample ID
  //   createCharts(sampleID);
  //   // Updata demographic info panel for selected sample ID
  //   getMetadata(sampleID);
  // }
  
  createDropdownMenu();