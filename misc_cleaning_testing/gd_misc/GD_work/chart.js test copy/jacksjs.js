// //set global variable
data = []

const sample_data = "https://test-wsuz.onrender.com/api/v1.0/project3/group4/data";

//read int the data
d3.json(sample_data).then(function(data){
    // build ddl of names
    names = data.names
    samples = data.samples
    meta_data = data.metadata
    
    // isert id's into dropdown menu
    names.forEach(name => d3.select("#selDataset").append('option').text(name));
        
    optionChanged(940); 

}); 
