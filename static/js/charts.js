
let scatterPlot;
let histogramPlot;

function getCountyColor(walkInd) {
  return walkInd >= walkability_scores[4] ? '#7a0177' :
          walkInd >= walkability_scores[3] ? '#c51b8a' :
          walkInd >= walkability_scores[2]  ? '#f768a1' :
          walkInd >= walkability_scores[1]  ? '#fbb4b9' :
                          '#feebe2' ;
}

function updateChartjs (stateData) {
    //initialize list to fill with data points
    counties_list = [];
    let county_labels = [];
    let colors_list = [];
    let names_list = [];

    //loop through selected state to get data points for each county based on walkability score and total population
    for (let i = 0; i < stateData.length; i++) {
        counties_list.push({
            x: stateData[i].properties.student_pop / stateData[i].properties.population,
            y: stateData[i].properties.walkability_score
            });
        county_labels.push(`${stateData[i].properties.NAME} ${stateData[i].properties.LSAD}`);
        colors_list.push(getCountyColor(stateData[i].properties.walkability_score));
        // console.log(`${stateData[i].properties.NAME} ${stateData[i].properties.LSAD}`)
        names_list.push(`${stateData[i].properties.NAME} ${stateData[i].properties.LSAD}`)

    }
    console.log("COUNTIESLIST",counties_list);
    if (scatterPlot) {
      scatterPlot.destroy();
    }
    scatterPlot = new Chart(
        document.getElementById('scatter-plot'),
        {
        type: "scatter",
        data: {
          datasets: [{
            pointRadius: 4,
            pointBackgroundColor: colors_list,
            data: counties_list
            // trendlineLinear: {
            //   style: "gray",
            //   lineStyle: "dotted|solid",
            //   width: 4
            // }
          }]
        },
        options: {
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

// let bin0to2;
// let bin2to4;
// let bin4to6;
// let bin6to8;
// let bin8to10;
// let bin10to12;
// let bin12to14;
// let bin14to16;
// let bin16to18;
// let bin18to20;



function updateHistojs (stateData) {
    //initialize list to fill with data points
    walkability_list = []
    zerotofour = 0
    fourtosix = 0
    sixtonine = 0
    nineto13 = 0
    greaterthan13 = 0
    // walkability_list = [zerotofour, fourtosix, sixtonine, nineto13, greaterthan13]
    
      // bin0to2 = 0;
      // bin2to4 = 0;
      // bin4to6 = 0;
      // bin6to8 = 0;
      // bin8to10 = 0;
      // bin10to12 = 0;
      // bin12to14 = 0;
      // bin14to16 = 0;
      // bin16to18 = 0;
      // bin18to20 = 0;

      // walkability_list = [bin0to2, bin2to4, bin4to6, bin6to8, bin8to10, bin10to12, bin12to14, bin14to16, bin16to18, bin18to20];
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
        
    // for (var i = 0; i < stateData.length; i++) {
    //   if (stateData[i].properties.walkability_score < 2) {
    //     bin0to2 += 1;

    //   } else if (stateData[i].properties.walkability_score >= 2 && 
    //     stateData[i].properties.walkability_score < 4) {
    //       bin2to4 += 1;

    //   } else if (stateData[i].properties.walkability_score >= 4 && 
    //     stateData[i].properties.walkability_score < 6) {
    //       bin4to6 += 1;

    //   } else if (stateData[i].properties.walkability_score >= 6 && 
    //     stateData[i].properties.walkability_score < 8) {
    //       bin6to8 += 1; 

    //   } else if (stateData[i].properties.walkability_score >= 8 && 
    //     stateData[i].properties.walkability_score < 10) {
    //       bin8to10 += 1;
  
    //   } else if (stateData[i].properties.walkability_score >= 10 && 
    //     stateData[i].properties.walkability_score < 12) {
    //       bin10to12 += 1;
      
    //   } else if (stateData[i].properties.walkability_score >= 12 && 
    //         stateData[i].properties.walkability_score < 14) {
    //           bin12to14 += 1;
      
    //   } else if (stateData[i].properties.walkability_score >= 12 && 
    //         stateData[i].properties.walkability_score < 14) {
    //           bin12to14 += 1;
      
    //   } else if (stateData[i].properties.walkability_score >= 14 && 
    //         stateData[i].properties.walkability_score < 16) {
    //           bin14to16 += 1;
      
    //   } else if (stateData[i].properties.walkability_score >= 16 && 
    //         stateData[i].properties.walkability_score < 18) {
    //           bin16to18 += 1;

    //   } else (bin18to20 += 1);
  

    // walkability_list = [bin0to2, bin2to4, bin4to6, bin6to8, bin8to10, bin10to12, bin12to14, bin14to16, bin16to18, bin18to20];


        };

        console.log("WALKABILITY_LIST",walkability_list)

        if (histogramPlot) {histogramPlot.destroy();}
        histogramPlot = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['Least Walkable', 'Below Average', 'Average', 'Above Average', 'Most Walkable'],
              // labels: ['0-2', '2-4', '4-6', '6-8', '8-10', '10-12', '12-14', '14-16', '16-18', '18-20'],
              datasets: [{
                // label: ['Least Walkable', 'Below Average', 'Average', 'Above Average', 'Most Walkable'],
                data: walkability_list,
                // backgroundColor: 'rgb(190,210,258)',
                backgroundColor: ['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177']
              }]
            },
            options: {
              legend: {
                display: false
              },
              scales: {
                datasets: [{
                  display: true,
                  barPercentage: 1.3,
                  ticks: {
                    autoSkip: false,
                    max: 10,
                    }
                  }],
                  xAxes: [{
                    ticks: {
                      beginAtZero: true,
                    },
                    scaleLabel: {
                      display: true,
                      // labelString: "Walkability Index"
                    }
                  }],
                  yAxes: [{
                    ticks: {
                      beginAtZero: true,
                    },
                    scaleLabel: {
                      display: true,
                      labelString: "# of Counties"
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

