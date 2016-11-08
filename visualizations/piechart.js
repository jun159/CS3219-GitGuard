/*function reanalyze3(){
	var repolink = 'tungnk1993/scrapy'
	var authors = [ "pablohoffman", "dangra" ];
	var startDate = 1462032000;
	var endDate = 1462550400;
	displayPieChart(repolink, authors, startDate, endDate);
}*/
function displayPieChart(repolink, authors, startDate, endDate) {
    //$("#piechart-img").hide();
    d3.select("#pie_chart").remove();

    console.log(repolink);
    console.log(authors);
    console.log(startDate);
    console.log(endDate);
    $.ajax({
        url: "https://api.github.com/repos/" + repolink + "/stats/contributors", //GET /repos/:owner/:repo/stats/contributors
        type: "GET"
    }).done(function(result) {

        var json = result;
        var commits = [];

        for(var i=0;i<authors.length;i++){
            for(var j=0;j<json.length;j++){
                if(json[j].author.login == authors[i]){
                    var commitCount = json[j].total;

                    //for(var k=0;k<json[j].weeks.length;k++){
                    //    if(json[j].weeks[k].w <= endDate && json[j].weeks[k].w >= startDate){
                    //        commitCount = commitCount + json[j].weeks[k].c;
                    //    }
                    //}
                    commits.push(commitCount);
                }
            }
        }

        var data = [];
        for(var i=0;i<authors.length;i++){
            var obj = {
                author: authors[i],
                commits: commits[i]
            };
            data.push(obj);
        }
        console.log(data);

        var width = 500,
        height = 500,
        radius = Math.min(width, height) / 2;

        var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

        var labelArc = d3.svg.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

        var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.commits; });

        var svg = d3.select('.pieChart').append('svg')
        .attr("id", "pie_chart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

        g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.author); });

        g.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.data.author; });

        function type(d) {
            d.commits = +d.commits;
            return d;
        }
    });
}