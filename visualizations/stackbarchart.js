var author;
var startdate;
var rawdata;

function setAuthor(x){
    author = x;
}

function setRawData(data){
    rawdata = data;
}

function setStartDate(date){
    startdate = date;
}

function filter(rawdata, author){
    var filteredData = [];
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (var i=0; i<rawdata.length; i++) {
        if(rawdata[i].author.login === author){
            for (var j=0; j<rawdata[i].weeks.length; j++) {
                //console.error(rawdata[i].weeks[j].w + " " + startdate);
                if(rawdata[i].weeks[j].w>startdate){
                    var date = new Date(rawdata[i].weeks[j].w*1000);
                    filteredData.push({
                        week: monthNames[date.getMonth()] + ", " + date.getFullYear().toString().substr(2),
                        additions: rawdata[i].weeks[j].a,
                        deletions: rawdata[i].weeks[j].d,
                        commits: rawdata[i].weeks[j].c
                    });
                }
            }

        }
    }

    return filteredData;
}

function displayStackedBarchart(filteredData){

    // Setup svg using Bostock's margin convention
    d3.select("#stacked_bar").remove();

    var margin = {top: 20, right: 160, bottom: 35, left: 30};

    var width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select(".stackedbarchart").append("svg")
        .attr("id", "stacked_bar")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    /* Data in strings like it would be if imported from a csv */
    var data = filteredData;
    var transformedData = [];

    for (var i=0; i<data.length; i++) {
        if (transformedData.length === 0) {
            transformedData.push({
                week: data[i].week,
                additions: data[i].additions,
                deletions: data[i].deletions,
                commits: data[i].commits
            });
        } else {
            var found = 0;
            for (var j=0; j<transformedData.length; j++) {
                if (data[i].week === transformedData[j].week) {
                    transformedData[j].additions += data[i].additions;
                    transformedData[j].deletions += data[i].deletions;
                    transformedData[j].commits += data[i].commits;
                    found = 1;
                    break;
                }
            }

            if (found === 0) {
                transformedData.push({
                    week: data[i].week,
                    additions: data[i].additions,
                    deletions: data[i].deletions,
                    commits: data[i].commits
                });
            }
        }
    }

    var parse = d3.time.format("%B, %Y").parse;


    // Transpose the data into layers
    var dataset = d3.layout.stack()(["additions", "deletions", "commits"].map(function(commitType) {
        return transformedData.map(function(d) {
            return {x: d.week, y: +d[commitType]};
        });
    }));

    // Set x, y and colors
    var x = d3.scale.ordinal()
        .domain(dataset[0].map(function(d) { return d.x; }))
        .rangeRoundBands([10, width-10], 0.04);

    var y = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) { return d3.max(d, function(d) { return d.y0 + d.y; });  })])
        .range([height, 0]);

    var colors = ["#f2b447", "#d25c4d", "#d9d574"];

    // Define and draw axes
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5)
        .tickSize(-width, 0, 0)
        .tickFormat( function(d) { return d } );

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
        //.tickFormat(d3.time.format("%B, %Y"));

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Create groups for each series, rects for each segment
    var groups = svg.selectAll("g.cost")
        .data(dataset)
        .enter().append("g")
        .attr("class", "cost")
        .style("fill", function(d, i) { return colors[i]; });

    var rect = groups.selectAll("rect")
        .data(function(d) { return d; })
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y0 + d.y); })
        .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
        .attr("width", x.rangeBand())
        .on("mouseover", function() { tooltip.style("display", null); })
        .on("mouseout", function() { tooltip.style("display", "none"); })
        .on("mousemove", function(d) {
            var xPosition = d3.mouse(this)[0] - 15;
            var yPosition = d3.mouse(this)[1] - 25;
            tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            tooltip.select("text").text(d.y);
        });


    // Draw legend
    var legend = svg.selectAll(".legend")
        .data(colors)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d, i) {return colors.slice().reverse()[i];});

    legend.append("text")
        .attr("x", width + 5)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d, i) {
            switch (i) {
                case 0: return "commits";
                case 1: return "deletions";
                case 2: return "additions";
            }
        });


    // Prep the tooltip bits, initial display is hidden
    var tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

    tooltip.append("rect")
        .attr("width", 30)
        .attr("height", 20)
        .attr("fill", "white")
        .style("opacity", 0.5);

    tooltip.append("text")
        .attr("x", 15)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

}

function makeAjaxCall2(callback, helper, url) {
    $.ajax({
        url: url, //GET /repos/:owner/:repo/stats/contributors
        type: "GET",
        dataType: "json",

        success: function(result) {
            setRawData(result);
            //callback(helper(result));
            if (helper !== null)
                callback(helper(result, author));
            else
                callback(result);
        },
        error: function(result) {
            console.log("Error" + result);
        }
    });
}