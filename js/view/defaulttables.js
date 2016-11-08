function isGenerateTablesSuccess(repolink) {
    generateTableBubble(repolink);
    generateTableStackBar(repolink);

    return true;
}

function generateTableBubble(repolink) {
    var totalCommits = 0;
    var dataSet1 = "[";
    var dataSet3 = "[";

    readDataFromGit(true, 'https://api.github.com/repos/' + repolink + '/stats/contributors', function(text) {
        var data = JSON.parse(text);

        for (var k in data) {
            totalCommits += data[k].total;
        }

        for(var i in data) {
            var author = data[i].author.login;
            var weekData = data[i].weeks;
            var commits = 0;
            var additions = 0;
            var deletions = 0;
            dataSet1 += "\n    [ \"" + author + "\", ";
            dataSet3 += "\n    [ \"" + author + "\", ";

            for (var j in weekData) {
                commits += data[i].weeks[j].c;
                additions += data[i].weeks[j].a;
                deletions += data[i].weeks[j].d;
            }

            var contributions = parseFloat((commits / totalCommits) * 100).toFixed(2);
            dataSet1 += "\"" + commits + "\", \"" + additions + "\", \"" + deletions + "\", \"" + contributions + "\" ],";
            dataSet3 += "\"" + commits + "\", \"" + contributions + "\" ],";
        }

        dataSet1 = dataSet1.substring(0, dataSet1.length - 1);
        dataSet1 += "\n]";
        dataSet3 = dataSet3.substring(0, dataSet3.length - 1);
        dataSet3 += "\n]";

        $(document).ready(function() {
            dataSet1 = JSON.parse(dataSet1);
            $('#table1').DataTable({
                destroy: true,
                data: dataSet1,
                order: [[ 4, "desc" ]],
                columns: [
                    { title: "Author" },
                    { title: "Commits" },
                    { title: "Additions" },
                    { title: "Deletions" },
                    { title: "% Contribution" }
                ]
            });
        });

        $(document).ready(function() {
            dataSet3 = JSON.parse(dataSet3);
            $('#table3').DataTable({
                destroy: true,
                data: dataSet3,
                order: [[ 2, "desc" ]],
                columns: [
                    { title: "Author" },
                    { title: "Commits" },
                    { title: "% Contribution" }
                ]
            });
        });
    });
}

function generateTableStackBar(repolink) {
    var dataSet = "[";
    var data;

    readDataFromGit(true, 'https://api.github.com/repos/' + repolink + '/stats/contributors', function(text) {

        data = JSON.parse(text);
        for(var i in data) {
            var author = data[i].author.login;
            var weekData = data[i].weeks;
            var additions = 0;
            var deletions = 0;

            for (var j in weekData) {
                additions += data[i].weeks[j].a;
                deletions += data[i].weeks[j].d;
            }

            dataSet += "\n    [ \"" + author + "\", ";
            dataSet += "\"" + (additions + deletions) + "\" ],";
        }

        dataSet = dataSet.substring(0, dataSet.length - 1);
        dataSet += "\n]";

        $(document).ready(function() {
            dataSet = JSON.parse(dataSet);
            $('#table5').DataTable({
                destroy: true,
                data: dataSet,
                order: [[ 1, "desc" ]],
                columns: [
                    { title: "Author" },
                    { title: "Number of Code Lines" }
                ]
            });
        });
    });
}