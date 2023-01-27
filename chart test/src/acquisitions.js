// import Chart from '/chart.js/auto'

import countydata from '../countydata.json' assert { type: "json" };
// console.log(countydata)

let data = countydata.features
console.log(data)

// const stateid = "03"

let scatter;
let histo;

function updateChartjs (stateid) {
    //initialize list to fill with data points
    scatter = []
    histo = []
    //loop through selected state to get data points for each county based on walkability score and total population
    let statedata = data.filter(obj => obj.properties.STATE == stateid); 
    for (var i = 0; i < statedata.length; i++) {
          scatter.push({
            x: statedata[i].properties.population,
            y: statedata[i].properties.walkability_score
            });
            histo.push({
            x: statedata[i].properties.walkability_score,
            y: statedata[i].properties.population
            });

    }
    console.log(scatter)

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
        data: scatter
      }]
    },
    // options:{...}
  });

  Highcharts.chart('container', {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Histogram using a column chart'
    },
    subtitle: {
      text: ''
    },
    xAxis: {
      categories: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16'
      ],
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0,
        borderWidth: 0,
        groupPadding: 0,
        shadow: false
      }
    },
    series: [{
      name: 'Data',
      data: histo,
      binWidth: (3 - 18) / 6
    }]
  });