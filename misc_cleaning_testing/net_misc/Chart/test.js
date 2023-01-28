
// import Chart from '/chart.js/auto'

import countydata from '../countydata.json' assert { type: "json" };
// console.log(countydata)

let data = countydata.features
console.log(data)

// const stateid = "03"
let counties_list;
function updateChartjs (stateid) {
    //initialize list to fill with data points
    counties_list = []
    
    //loop through selected state to get data points for each county based on walkability score and total population
    let statedata = data.filter(obj => obj.properties.STATE == stateid); 
    for (var i = 0; i < statedata.length; i++) {
        counties_list.push({
            x: statedata[i].properties.population,
            y: statedata[i].properties.walkability_score
            });
    }
    console.log(counties_list)

}
