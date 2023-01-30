# Project3_Group4

**Project Background**


For this project we used the [Walkability Index](https://catalog.data.gov/dataset/walkability-index) data to map out all the counties and schools within a walkability range for every state within the United States.  The Goal was determine the number of schools within each county, the walkability score vs the students population for that county vs the total county population

The Walkability Index dataset characterizes every Census 2019 block group in the U.S. based on its relative walkability. Walkability depends upon characteristics of the built environment that influence the likelihood of walking being used as a mode of travel. The Walkability Index is based on the EPA's previous data product, the Smart Location Database (SLD)


**Solution Approach**
The following data sets, tools, programming languages and libraries were used for this project 

*Data: Walkability Index and  public school info from catalog.data.gov, state and county Geojson
*Cleaned data was inserted into to properties of county geojson and inserted into Mongo Atlas
*Flask app was used with render to make a call to the Mongo Atlas DB, allowing access to our custom Geojson for API calls.
*Used HTML with bootstrap, CSS,  and JavaScript
*Leaflet to create a map that plots all the Walkability Index from your dataset based on their longitude and latitude.
*Connects to geojson API using D3
*Chart.js for the scatter plot and Plotly bar chart was used to create the histogram plot visualization


Open with live server via the index.Html will show the map where user can select any state by simply clicking on the state
![This is an image](images/map-with-states.png)


Below screenshot shows both states and counties with no state selected to begin
![This is an image](images/map-view-states-counties.png)


The Walkability Score for Marion County in Florida. A total number of 65 schools are in Marion county with a walkability score of 7.35
![This is an image](images/marion-county-walkability.png)


The scatter plot is measuring the walkability index vs the number of students per capita. 
![This is an image](images/chart1.png)


Histogram plot

![This is an image](images/chart2.png)


Below is a screnshot of the completed Project which shows the map, scatter plot and Histogram plot
![This is an image](images/mn-with-charts.png)


**Reference:**
[Chart.js](https://www.chartjs.org/), 
[Walkability Index](https://catalog.data.gov/dataset/walkability-index)

**Project Team Members:** 
[Jack Miller](jmiller10@css.edu),
[Nicholas Erdos-Thayer](erdos.thayer@gmail.com),
[Cherno Jallow](cjallow@hotmail.com),
[Glen Dagger](glendagger@gmail.com)

