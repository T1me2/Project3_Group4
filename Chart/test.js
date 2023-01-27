// Define URL for our rendered walkability/school GeoJSON API
let walkabilityUrl = "countygeo_jack.json";

d3.json(walkabilityUrl).then(results => {
 
    console.log('raw', results);
    console.log('state', results.features[0].properties.walkability_score);

});