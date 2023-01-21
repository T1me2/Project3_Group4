let stateDict = {'01':'AL', '02':'AK', '04':'AZ', '05':'AR', '06':'CA', '08':'CO', '09':'CT', '10':'DE', 
                '11':'DC', '12':'FL', '13':'GA', '15':'HI', '16':'ID', '17':'IL', '18':'IN', '19':'IA', 
                '20':'KS', '21':'KY', '22':'LA', '23':'ME','24':'MD', '25':'MA', '26':'MI', '27':'MN', 
                '28':'MS', '20':'MO', '30':'MT', '31':'NE', '32':'NV', '33':'NH', '34':'NJ', '35':'NM', 
                '36':'NY', '37':'NC', '38':'ND', '39':'OH', '40':'OK', '41':'OR', '42':'PA', '72':'PR', 
                '44':'RI', '45':'SC', '46':'SD', '47':'TN', '48':'TX', '49':'UT', '50':'VT', '51':'VA', 
                '53':'WA', '54':'WV', '55':'WI', '56':'WY'
};

// Define the street and toner tile layers
let toner = new L.StamenTileLayer("toner-lite");

// States Layer
let stateLayer = L.geoJson(statesData, {
    style: {
        fillColor: 'rgb(153,216,201)',
        weight: 2,
        opacity: 1,
        color: 'gray',
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
                color: 'gray',
                dashArray: '3',
                fillOpacity: 0.7
                })
            },
            click: e => {
                myMap.fitBounds(e.target.getBounds());
                // Identify current state
                let selectedStateId = feature.id;
                // Retrieve current state ID number from dictionary
                let selectedStateAbb = stateDict[feature.id]

                console.log("ID", selectedStateAbb);
                // Create markers for selected state
                showSchoolMarkers(selectedStateAbb)
            }
        });
    }
});

// Counties Layer
// let countyLayer = L.geoJson(countiesData, {
//     style: {
//         fillColor: 'rgb(229,245,249)',
//         weight: 2,
//         opacity: 1,
//         color: 'white',
//         dashArray: '3',
//         fillOpacity: 0.7
//     },
//     onEachFeature: (feature,layer) => {
//         // console.log(feature);
//         layer.on({
//         mouseover: e => {
//             let layer = e.target
//             layer.setStyle({
//             weight: 5,
//             color: "white",
//             dashArray: '',
//             fillOpacity: 0.7
//             })
//             layer.bringToFront()
//         },
//         mouseout: e => {
//             e.target.setStyle({
//             fillColor: 'rgb(229,245,249)',
//             weight: 2,
//             opacity: 1,
//             color: 'white',
//             dashArray: '3',
//             fillOpacity: 0.7
//             })
//         },
//         click: e => {
//             myMap.fitBounds(e.target.getBounds());
//             createSchoolMarkers
//         }
//         }).bindPopup(`${feature.properties.NAME} County`);
//     }
// });

// Create base and overlay maps
let baseMaps = {
    Toner: toner
}


let overlayMaps = {
    // "School Markers": markersLayer,
    // "Heat Map": heat,
    States: stateLayer
}

// Create the map object
let myMap = L.map("map", {
    center: [40.2659, -96.7467],
    zoom: 3,
    layers: [toner, stateLayer]
    });

// Add layer control
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);


function updateMap(existingMap, markerLayer) {
    markerLayer.addTo(myMap);
}




function createSchoolMarkers(schoolJson, existingMap) {
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

    // Iterate through each element 
    schoolJson.forEach(element => {

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

            updateMap(myMap, schoolLocations, markers)
    });
}

function showSchoolMarkers(state) {
    
    // Initialize first (and last - may not be necessary) indices of each "page" to 0 and 1999
    let firstIndex = 0;
    // Set default for current length of api return call (can only do 2000 at a time)
    let currentLength = 2000;
    
    // Define query for specific state data
    let stateQuery = `query?where=LSTATE%20%3D%20'${state}'%20AND%20OBJECTID>${firstIndex}&&outFields=*&outSR=4326&f=json`;
  
    while (currentLength === 2000) {
        d3.json(url+stateQuery).then(response => {

            // From https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates?answertab=votes#tab-top
            // Filter array to unique schools
            let uniqueSchools = response.features.filter((value, index, self) => self.indexOf(value) === index)
            
            
            if (uniqueSchools.length < 2000) {
                // Create school markers from json data
                createSchoolMakers(uniqueSchools);
            }
            else {
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
            }
            // Update currentLength of API call to see if there 
            currentLength = response.features.length;
    
            
            
        });
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
}