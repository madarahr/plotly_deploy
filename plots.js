function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
  
  init();

  optionChanged(940);

  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }

  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");

      PANEL.html("");
      PANEL.append("h6").text('ID: '+ result.id);
      PANEL.append("h6").text('ETHNICITY: ' + result.ethnicity);
      PANEL.append("h6").text('GENDER: '+ result.gender);
      PANEL.append("h6").text('AGE: ' + result.age);
      PANEL.append("h6").text('LOCATION: ' + result.location);
      PANEL.append("h6").text('BBTYPE: ' + result.bbtype);
      PANEL.append("h6").text('WFREQ: ' + result.wfreq);
    });
  }


  function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];

      var sampleOTU = data.samples;
      var sampleArray = sampleOTU.filter(sampleObj => sampleObj.id == sample);
      var sampleValue = sampleArray[0];


    var metadata = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        type: "indicator",
        value: result.wfreq,
        mode: "gauge+number",
        id: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
        gauge: {
          axis: { range: [null, 9], tickmode: 'auto', ticks: 'inside'},
          steps: [{ range: [0, 1], color: '#ffffff' },
                  { range: [1, 2], color: '#eeffcc'},
                  { range: [2, 3], color: '#ddff99' },
                  { range: [3, 4], color: '#ccff66'},
                  { range: [4, 5], color: '#bbff33' },
                  { range: [5, 6], color: '#aaff00'},
                  { range: [6, 7], color: '#88cc00' },
                  { range: [7, 8], color: '#669900'},
                  { range: [8, 9], color: '#446600'}
                ],
          bordercolor: 'white'
           },
    }
    ];
      
    var layout = {width: 450, height: 250, margin: { t: 0, b: 0 }};

    // render the gauge plot to the div tag with id "gauge"
    Plotly.newPlot('gauge', metadata, layout);

  // Bubble chart
    var samples = {
        x: sampleValue.otu_ids,
        y: sampleValue.sample_values,
        text: sampleValue.otu_labels,
        mode: 'markers',
        marker: { color: sampleValue.sample_values,
        size: sampleValue.sample_values},
      };
    var plot = {showlegend: false,
      xaxis: {
        title: {
          text: "OTU ID",
          standoff: 20}},
      height: 600, width: 1200};
    // Render the plot to the div tag with id "bubble"
    Plotly.newPlot('bubble', [samples], plot);


  // Bar chart

    var barData = 
      { 
        x: sampleValue.sample_values.slice(0,10).reverse(),
        y: sampleValue.otu_ids.map(OTU => "OTU " + OTU).reverse(),
        // otu_labels as hover text for the bar graph
        text: sampleValue.otu_labels,
        orientation: "h",
        type: "bar",
        };

    var barLayout = {
      width: 400,
      height: 500,
    };

    // Render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", [barData], barLayout);
    });
    }
