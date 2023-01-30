// Initialize chart variable
let scatterPlot;
// Initialize plot variable
let barChart;

// Define function to create scatter plot (students per capita vs. walkability) in 'scatter-plot' div when state selected
function updateScatter (stateData) {
  
  // Initialize array to store x, y values for each point
  let counties_list = [];
  // Initialize array to store county colors based on walkability index
  let colors_list = [];
  // Initialize array to store county names
  let county_names = [];

  // Loop through selected state to get walkability/students per capita, choropleth color, and name for each county, 
  for (let i = 0; i < stateData.length; i++) {
      counties_list.push({
          x: stateData[i].properties.student_pop / stateData[i].properties.population,
          y: stateData[i].properties.walkability_score
          });
      colors_list.push(getCountyColor(stateData[i].properties.walkability_score));
      county_names.push(`${stateData[i].properties.NAME} ${stateData[i].properties.LSAD}`)

  }
  // Clear any existing scatterPlot
  if (scatterPlot) {
    scatterPlot.destroy();
  }
  // Create new scatter plot in scatter-plot div
  scatterPlot = new Chart(
      document.getElementById('scatter-plot'),
      {
      type: "scatter",
      data: {
        datasets: [{
          pointRadius: 4,
          pointBackgroundColor: colors_list,
          data: counties_list
        }]
      },
      options: {
          // Hide legend
          legend: {
            display: false
          },
          // Set chart title
          plugins: {
            title: {
                display: true,
                text: 'Student population vs. Walkability Index by County'
            }
          },
          scales: {
            // Set x-axis label
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: "# Students per Capita"
              }
            }],
            // Set y-axis label
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: "Walkability Index"
              }
            }]
          },
          // Set hover text to county names
          tooltips: {
            callbacks: {
                label: function(tooltipItem) {
                    return (county_names[tooltipItem.index]);
                }
            }
        },
      }
    });
}

// Define function to create bar chart in 'bar-chart' div when new state selected
function updateBar (stateData) {

  let walkabilityRanges = [0, 5, 5.8, 6.8, 12];

  // Initialize range counts for x-axis
  let leastWalkable = 0;
  let belowAverage = 0;
  let averageWalkability = 0;
  let aboveAverage = 0;
  let mostWalkable = 0;

  //loop through selected state to get data points for each county based on walkability score and total population
  for (var i = 0; i < stateData.length; i++) {
    if (stateData[i].properties.walkability_score < walkabilityRanges[1]) {
      leastWalkable += 1;

    } else if (stateData[i].properties.walkability_score > walkabilityRanges[1] && 
        stateData[i].properties.walkability_score < walkabilityRanges[2]) {
          belowAverage += 1;

    } else if (stateData[i].properties.walkability_score > walkabilityRanges[2] &&
        stateData[i].properties.walkability_score < walkabilityRanges[3]) {
          averageWalkability += 1;

    } else if (stateData[i].properties.walkability_score > walkabilityRanges[3] &&
        stateData[i].properties.walkability_score < walkabilityRanges[4]) {
          aboveAverage += 1; 
    
    } else {mostWalkable += 1}
  }
  // Define list of range bins for x-axis
  let walkability_list = [leastWalkable, belowAverage, averageWalkability, aboveAverage, mostWalkable];

  // Clear any existing bar chart
  if (barChart) {
    barChart.destroy();
  }
  // Create new bar chart in 'bar-chart' div
  barChart = new Chart(document.getElementById('bar-chart'), {
      type: 'bar',
      data: {
        labels: ['Least Walkable', 'Below Average', 'Average', 'Above Average', 'Most Walkable'],
        datasets: [{
          data: walkability_list,
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
