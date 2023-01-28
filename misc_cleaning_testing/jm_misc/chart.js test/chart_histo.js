const ctx = document.getElementById('histogram').getContext('2d');

import countydata from './countydata.json' assert { type: "json" };
console.log(countydata)

let data = countydata.features
console.log(data)

let walkability_list;
let zerotofour;
let fourtosix;
let sixtonine;
let nineto13;
let greaterthan13;

function updateChartjs (stateid) {
    //initialize list to fill with data points
    // walkability_list = []
    zerotofour = 0
    fourtosix = 0
    sixtonine = 0
    nineto13 = 0
    greaterthan13 = 0
    // walkability_list = [zerotofour, fourtosix, sixtonine, nineto13, greaterthan13]
    
    //loop through selected state to get data points for each county based on walkability score and total population
    let statedata = data.filter(obj => obj.properties.STATE == stateid); 
    for (var i = 0; i < statedata.length; i++) {
        if (statedata[i].properties.walkability_score < 4) {
            zerotofour = zerotofour + 1;

        } else if (statedata[i].properties.walkability_score > 4 && 
            statedata[i].properties.walkability_score < 6.5) {
            fourtosix = fourtosix + 1;

        } else if (statedata[i].properties.walkability_score > 6.5 &&
            statedata[i].properties.walkability_score < 9) {
            sixtonine = sixtonine + 1;

        } else if (statedata[i].properties.walkability_score > 9 &&
            statedata[i].properties.walkability_score < 13) {
            nineto13 = nineto13 + 1;  
        
        } else (greaterthan13 = greaterthan13 + 1);

        walkability_list = [zerotofour, fourtosix, sixtonine, nineto13, greaterthan13]
        

        };

        console.log(walkability_list)
    }
    
    // walkability_list = [zerotofour, fourtosix, sixtonine, nineto13, greaterthan13]


//initialize function to update state based on optionchange
function optionChanged(selection) {
    updateChartjs(selection)
}

    optionChanged('27');

const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [0, 4, 6.5, 9, 13],
    datasets: [{
      label: 'Number of Arrivals',
      data: walkability_list,
      backgroundColor: 'green',
    }]
  },
  options: {
    scales: {
      datasets: [{
        display: false,
        barPercentage: 1.3,
        ticks: {
          max: 10,
        }
      }, {
        display: true,
        ticks: {
          autoSkip: false,
          max: 10,
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});