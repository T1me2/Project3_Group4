

function updateChartjs (stateData) {
    //initialize list to fill with data points
    counties_list = [];
    let county_labels = [];
    let stateAbbr = stateData[0].properties.STATE;

    //loop through selected state to get data points for each county based on walkability score and total population
    // let statedata = countiesData.filter(obj => obj.properties.STATE == stateid); 
    for (let i = 0; i < stateData.length; i++) {
        counties_list.push({
            x: stateData[i].properties.student_pop / stateData[i].properties.population,
            y: stateData[i].properties.walkability_score
            });
        county_labels.push(`${stateData[i].properties.NAME} ${stateData[i].properties.LSAD}`)
    }
    console.log("COUNTIESLIST",counties_list);

    new Chart(
        document.getElementById('scatter-plot'),
        {
        type: "scatter",
        data: {
          datasets: [{
            pointRadius: 4,
            pointBackgroundColor: "#f768a1",
            data: counties_list
          }]
        },
        options: {
            // tooltips: {
            //     callbacks: {
            //         label: county_labels
            //     }
            // },
            plugins: {
                title: {
                    display: true,
                    text: 'Student population vs. Walkability Index by County'
                }
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "# Students per Capita"
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Walkability Index"
                    }
                }]
            }
        }
      });

}



const ctx = document.getElementById('histogram').getContext('2d');

let walkability_list;
let zerotofour;
let fourtosix;
let sixtonine;
let nineto13;
let greaterthan13;


function updateHistojs (stateData) {
    //initialize list to fill with data points
    // walkability_list = []
    zerotofour = 0
    fourtosix = 0
    sixtonine = 0
    nineto13 = 0
    greaterthan13 = 0
    // walkability_list = [zerotofour, fourtosix, sixtonine, nineto13, greaterthan13]
    
    //loop through selected state to get data points for each county based on walkability score and total population
    for (var i = 0; i < stateData.length; i++) {
        if (stateData[i].properties.walkability_score < 4) {
            zerotofour = zerotofour + 1;

        } else if (stateData[i].properties.walkability_score > 4 && 
            stateData[i].properties.walkability_score < 6.5) {
            fourtosix = fourtosix + 1;

        } else if (stateData[i].properties.walkability_score > 6.5 &&
            stateData[i].properties.walkability_score < 9) {
            sixtonine = sixtonine + 1;

        } else if (stateData[i].properties.walkability_score > 9 &&
            stateData[i].properties.walkability_score < 13) {
            nineto13 = nineto13 + 1;  
        
        } else (greaterthan13 = greaterthan13 + 1);

        walkability_list = [zerotofour, fourtosix, sixtonine, nineto13, greaterthan13]
        

        };

        console.log(walkability_list)

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: [0, 4, 6.5, 9, 13],
              datasets: [{
                label: 'Number of Arrivals',
                data: walkability_list,
                backgroundColor: 'rgb(190,210,258)',
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
    }
    
    // walkability_list = [zerotofour, fourtosix, sixtonine, nineto13, greaterthan13]


//initialize function to update state based on optionchange
// function optionChanged(selection) {
//     updateChartjs(selection)
// }

//     optionChanged('27');

