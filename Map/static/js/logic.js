
let map = L.map("map", {
    center: [40, -100],
    zoom: 4
  });
  

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

const queryUrl = "https://test-wsuz.onrender.com/api/v1.0/project3/group4/data"
  d3.json(queryUrl).then(function (data) {
    console.log(data)
    createFeatures(data.features);
  });

async function addGeoJson() {
    const response = await fetch("static/data/countygeo_jack.json");
    const data = await response.json();
    console.log(data);
    L.geoJson(data).addTo(map);

    function getColor(walkInd) {
        return walkInd > 12 ? '#810f7c' :
                walkInd > 8 ? '#8856a7' :
                walkInd > 4  ? '#8c96c6' :
                walkInd > 1  ? '#b3cde3' :
                                '#edf8fb' ;
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.walkability_score),
        weight: .5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.7
    };
}

L.geoJson(data, {style: style}).addTo(map);
}

var legend = L.control({position: 'bottomright'});


addGeoJson()