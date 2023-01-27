// Starting a rating count
let sum = 0;

// Arrays to hold movies by decade
movies1930s = [];
movies1940s = [];
movies1950s = [];
movies1960s = [];
movies1970s = [];
movies1980s = [];
movies1990s = [];
movies2000s = [];
movies2010s = [];






// For loop to go through all movies
for (let i = 0; i < movies.length; i++) {
  // Variable to hold current movie in loop
  let movie = movies[i]
  // Increment sum variable by amount of profit
  sum += movie.profit

  // Conditional statement to determine array assignment
  if (movie.year < 1940) {
    movies1930s.push(movie);
  } else if (movie.year < 1950) {
    movies1940s.push(movie);
  } else if (movie.year < 1960) {
    movies1950s.push(movie);
  } else if (movie.year < 1970) {
    movies1960s.push(movie);
  } else if (movie.year < 1980) {
    movies1970s.push(movie);
  } else if (movie.year < 1990) {
    movies1980s.push(movie);
  } else if (movie.year < 2000) {
    movies1990s.push(movie);
  } else if (movie.year < 2010) {
    movies2000s.push(movie);
  } else {
    movies2010s.push(movie);
  }
}


































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
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
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
      '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
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
    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 124.1, 95.6, 54.4]

  }]
});