function makeAjaxCall(callback, helper, url) {
    $.ajax({
        url: url, //GET /repos/:owner/:repo/stats/contributors
        type: "GET",
        dataType: "json",

        success: function(result) {
            if (helper !== null)
                callback(helper(result));
            else
                callback(result);
        },
        error: function(result) {
            console.log("Error" + result);
        }
    });
}

function refine(receivedData) {
    var refinedData = {};
    var items = [];

    for (var i=0; i<receivedData.length; i++) {
        refinedData[receivedData[i].author.login] = receivedData[i].total
    }

    return refinedData;
}

function displayBubbles(data) {
    var diameter = 600;

    var colors = d3.scale.category20();

    var svg = d3.select('.bubbleChart').append('svg')
        .attr('width', diameter)
        .attr('height', diameter);

    var bubble = d3.layout.pack()
        .size([diameter, diameter])
        .value(function(d) {return d.size;})
        // .sort(function(a, b) {
        //  return -(a.value - b.value)
        // })
        .padding(3);

    // generate data with calculated layout values
    var nodes = bubble.nodes(processData(data))
        .filter(function(d) { return !d.children; }); // filter out the outer bubble

    var vis = svg.selectAll('circle')
        .data(nodes);

    vis.enter().append('circle')
        .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
        .attr('r', function(d) { return d.r; })
        .attr("fill", function(d, i) { return colors(i); })
        .attr('class', function(d) { return d.className; });

    $('svg circle').tipsy({
        gravity: 'w',
        html: true,
        title: function() {
            var d = this.__data__, c = colors(d.i);
            return 'Contributor: ' + d.name + ', Commits: ' + d.size;
        }
    });

    function processData(data) {
        var obj = data;

        var newDataSet = [];

        for(var prop in obj) {
            newDataSet.push({name: prop, className: prop.toLowerCase(), size: obj[prop]});
        }
        return {children: newDataSet};
    }
}

//function refine(receivedData) {
//    var refinedData = {};
//
//    console.log("WEEK: " + receivedData);
//
//    for (var i=0; i<receivedData.length; i++) {
//        var weekData = receivedData[i].weeks;
//
//        var totalCode = 0;
//
//        for(var j=0 ; j<weekData; j++) {
//            totalCode += weekData[j].a - weekData[j].d;
//            console.log("Test: " + receivedData[i].author.login + "==" + totalCode);
//        }
//
//        console.log(receivedData[i].author.login + "==" + receivedData[i].total + totalCode);
//        refinedData[receivedData[i].author.login] = (receivedData[i].total + totalCode);
//    }
//
//    return refinedData;
//}