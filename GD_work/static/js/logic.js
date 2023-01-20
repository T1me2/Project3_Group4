// Return IDs only
const idURL = "https://nces.ed.gov/opengis/rest/services/K12_School_Locations/EDGE_ADMINDATA_PUBLICSCH_1920/MapServer/0/query?where=1%3D1&outFields=*&returnIdsOnly=true&outSR=4326&f=json";

// Define base URL for API call
const url = "https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/School_Characteristics_Current/FeatureServer/2/";

// Define initial query (all data)
let query = `query?where=OBJECTID>0&outFields=*&outSR=4326&f=geojson`

// Define GeoJSON url (may not be necessary)
const geojsonUrl = "https://data-nces.opendata.arcgis.com/datasets/nces::public-school-characteristics-current-1.geojson?outSR=%7B%22latestWkid%22%3A3857%2C%22wkid%22%3A102100%7D"

// Initialize school count (should be 100,455)
let numberOfSchools = [];

// Get count of all schools in database (can only get it to work when pushed it to array)
d3.json(idURL).then(response => {
  numberOfSchools.push(response.objectIds.length)
  console.log("School count", numberOfSchools);
});

// Create icons for school markers
let schoolIcon = L.icon({
  iconUrl: 'education.png',
  iconSize:     [40, 40], // size of the icon
  iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

let bigIcon = L.icon({
  iconUrl: 'education.png',
  iconSize:     [80, 80], // size of the icon
  iconAnchor:   [40, 130], // point of the icon which will correspond to marker's location
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});


// Initialize first (and last - may not be necessary) indices of each "page" to 0 and 1999
let firstIndex = 0;
// let lastIndex = 1999;

// Create empty list to store location of each school
let schoolLocations = [];

// Initialize the marker cluster group (will add markers in while loop)
let markers = L.markerClusterGroup();

// Create array of state abbreviations 
let stateNames = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 
                  'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 
                  'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA',
                  'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 
                    'WA', 'WV', 'WI', 'WY' ];

let currentLength = 2000;

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

// Loop to make repeated API calls (2000 at a time) until all data is collected
// while (firstIndex < 100455) {
while (currentLength === 2000) {

  // Update the query string to get next 2000 data points
  query = `query?where=OBJECTID>${firstIndex}&&outFields=*&outSR=4326&f=json`
  

  // New state query where specific state can be selected???
  let stateName = 'MN';
  let stateQuery = `query?where=LSTATE%20%3D%20'${stateName}'%20AND%20OBJECTID>${firstIndex}&&outFields=*&outSR=4326&f=json`;
      
  d3.json(url+query).then(response => {

    // Update currentLength of API call to see if there 
    currentLength = response.features.length;
    
    // console.log(currentLength);
    // console.log("response",response);

    // From https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates?answertab=votes#tab-top
    // Filter array to unique schools
    let uniqueSchools = response.features.filter((value, index, self) => self.indexOf(value) === index)

    // Iterate through each element 
    uniqueSchools.forEach(element => {

      // Add each location as individual marker with popup info
      markers.addLayer(L.marker([element.geometry.y, element.geometry.x], {icon:schoolIcon})
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
                        ));

      // Add coordinates to schoolLocations for heat map                
      schoolLocations.push([element.geometry.y, element.geometry.x]);
    });
    // console.log("length", schoolLocations.length);
  });
  // End API call

  // Increment firstIndex by 2000 to define starting point for next D3 call
  firstIndex += 2000;
  // lastIndex += 2000;

  // Check if firstIndex now exceeds number of schools
  if ((firstIndex) > 100455) {

    // If so, create the map from the marker cluster group
    createMap(schoolLocations, markers);

    // Exit while loop
    break;
  }
}


// Function to create map (cluster marker AND heat layers), taking in location array, marker cluster group as arguments
function createMap(locations, newLayer) {

  // Define the street and toner tile layers
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let toner = new L.StamenTileLayer("toner-lite");

  // Layers
  let heat = L.heatLayer(locations, {
    radius:30,
    blur:10
  });

  // States Layer
  let stateLayer = L.geoJson(statesData, {
    style: {
      fillColor: 'rgb(153,216,201)',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    },
    onEachFeature: (feature,layer) => {
      layer.on({
        mouseover: e => {
          let layer = e.target
          layer.setStyle({
            weight: 5,
            color: "white",
            dashArray: '',
            fillOpacity: 0.7
          })
          layer.bringToFront()
        },
        mouseout: e => {
          e.target.setStyle({
            fillColor: 'rgb(153,216,201)',
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
          })
        },
        click: e => {
          myMap.fitBounds(e.target.getBounds());
        }
      })
    }

  })
  ;

  // Counties Layer
  let countyLayer = L.geoJson(countiesData);

  // Create base and overlay maps
  let baseMaps = {
    "Street": street,
    Toner: toner
    }


  let overlayMaps = {
    "School Markers": newLayer,
    "Heat Map": heat,
    States: stateLayer,
    Counties: countyLayer
  }

  // Create the map object
  let myMap = L.map("map", {
    center: [40.2659, -96.7467],
    zoom: 3,
    layers: [street, newLayer]
    });
    
    // Add layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);
}