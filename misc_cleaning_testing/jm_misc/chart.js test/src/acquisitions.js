// import Chart from '/chart.js/auto'

import countydata from '../countydata.json' assert { type: "json" };
// console.log(countydata)

let data = countydata.features
console.log(data)

// const stateid = "03"
let county_dict;
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

//initialize function to update state based on optionchange
function optionChanged(selection) {
    updateChartjs(selection)
}

    optionChanged('27');

new Chart(
    document.getElementById('acquisitions'),
    {
    type: "scatter",
    data: {
      datasets: [{
        pointRadius: 4,
        pointBackgroundColor: "rgba(0,0,255,1)",
        data: counties_list
      }]
    },
    // options:{...}
  });