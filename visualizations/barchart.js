function displayBarChart(repolink){
  $.ajax({
        url: "https://api.github.com/repos/" + repolink + "/stats/contributors", //GET /repos/:owner/:repo/stats/contributors
        type: "GET"
      }).done(function(result) {

        console.log("entered");
        var json = result;
        var entries = [];
        var count = 0;
        

        for(var i=0;i<json.length;i++){
          var addCount = 0;
          var delCount = 0;
          for(var j=0;j<json[i].weeks.length;j++){
            addCount = addCount + json[i].weeks[j].a;
            delCount = delCount + json[i].weeks[j].d;
          }
          count = count + (addCount + delCount);          
        }

        for(var i=0;i<json.length;i++){
          var addCount = 0;
          var delCount = 0;
          for(var j=0;j<json[i].weeks.length;j++){
            addCount = addCount + json[i].weeks[j].a;
            delCount = delCount + json[i].weeks[j].d;
          }
          entries.push(
            {key: json[i].author.login, val: (addCount + delCount)/count});        
        }


        entries = entries.sort(function (a, b) {
          return b.val - a.val;
        });

        var data = [];
        for(var i=0;i<10;i++){
          if(entries[i] && entries[i].key && entries[i].val) {
            var obj = {
              author: entries[i].key,
              lines: entries[i].val
            };
            data.push(obj);
          }
        }
        console.log(data);

        var margin = {top: 40, right: 20, bottom: 30, left: 40},
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        var formatPercent = d3.format(".0%");

        var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
        .range([height, 0]);

        var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

        var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatPercent);

        var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
          return "<strong>Lines:</strong> <span style='color:red'>" + (d.lines.toFixed(2) * 100) + "%</span>";
        })

        var svg = d3.select('.atasBarChart').append("svg")
        .attr("id", "atas_bar")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.call(tip);

        x.domain(data.map(function(d) { return d.author; }));
        y.domain([0, d3.max(data, function(d) { return d.lines; })]);

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Lines");

        svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.author); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.lines); })
        .attr("height", function(d) { return height - y(d.lines); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

        console.log("DONE");

        function type(d) {
          d.lines = +d.lines;
          return d;
        }
      });
    }