function reanalyze2() {
    var repolink = document.getElementById("repolink").value;
    repolink = repolink.substring(19);
    var author = $('#author-list').val();
    var startDate = $('#datepicker-start').datepicker('getDate');
    startDate = Date.parse(startDate.toString()) / 1000;
    var endDate = (new Date).getTime() / 1000;

    //alert(author + " " + startDate + " " + endDate);
    if(author.localeCompare("") != 0) {
        sweetAlert(TITLE_SUCCESS, MESSAGE_SUCCESS, SUCCESS);
    } else {
        sweetAlert(TITLE_ERROR, MESSAGE_EMPTY_ERROR, ERROR);
    }

    // Refresh commit list
    var dataSet = "[";
    var hasData = false;

    // Retrieve first 300 commits
    for(var page = 0; page < 10; page++) {
        readDataFromGit(false, 'https://api.github.com/repos/' + repolink + '/commits?page=' + page, function(text) {
            var data = JSON.parse(text);

            for(var i in data) {
                if(data[i] && data[i].author && data[i].author.login) {
                    var currAuthor = data[i].author.login;
                    var dateMilli = new Date(data[i].commit.author.date).getTime() / 1000;
                    var date = new Date(data[i].commit.author.date).toDateString();
                //    console.log(startDate + " <= " + dateMilli + " <= " + endDate);

                    // Found author, extract all its commits
                    if (author.localeCompare(currAuthor) == 0
                        && dateMilli >= startDate && dateMilli <= endDate) {

                        var message = data[i].commit.message;
                        message = message.replace(/[\[\],']/g,'' );
                        message = message.replace(/(\r\n|\n|\r)/gm,"");
                        message = message.replace(/"/g, '');

                    //    console.log("Author: " + currAuthor + "\nMessage: " + message);

                        dataSet += "\n    [ \"" + date + "\", \"" + message + "\" ],";
                        hasData = true;
                    }
                }
            }
        });
    }

    if(hasData) {
        $('.commitH2').text("Historical commit of " + author);
        //alert(dataSet);
        dataSet = dataSet.substring(0, dataSet.length - 1);
        dataSet += "\n]";

        //alert("final data: " + dataSet);

        $(document).ready(function() {
            dataSet = JSON.parse(dataSet);
            $('#tableCommits').show().DataTable({
                destroy: true,
                data: dataSet,
                order: [[ 0, "desc" ]],
                columnDefs: [
                    { "width": "20%", "targets": 0 }
                ],
                columns: [
                    { title: "Date" },
                    { title: "Commits" }
                ]
            });
        });
    } else {
        $('.commitH2').text("No historical commit of " + author + " found");
        sweetAlert(TITLE_ERROR, "No data found", ERROR);
        $(document).ready(function() {
            $('#tableCommits').hide();
        });
    }

    // Show bar chart
    setAuthor(author);
    setStartDate(startDate);
    var url = "https://api.github.com/repos/" + repolink + "/stats/contributors";
    makeAjaxCall2(this.displayStackedBarchart, this.filter, url);
}

function reanalyze3() {
    $(".pieChart").show();
    var repolink = document.getElementById("repolink").value;
    repolink = repolink.replace("https://github.com/","");
    var authors = $('#author-list-multiple').val();
    var startDate = $('#datepicker-list-start').datepicker('getDate');
    startDate = Date.parse(startDate.toString())/1000;
    var endDate = $('#datepicker-list-end').datepicker('getDate');
    endDate = Date.parse(endDate.toString())/1000;
    displayPieChart(repolink, authors, startDate, endDate);
    sweetAlert(TITLE_SUCCESS, MESSAGE_SUCCESS, SUCCESS);
}

function reanalyze4() {
    var repolink = document.getElementById("repolink").value;
    repolink = repolink.substring(19);
    var filePath = $('#file-list').val();
    var startCode = $('#code-start').val();
    var endCode = $('#code-end').val();

    if(!filePath) {
        sweetAlert(TITLE_ERROR, MESSAGE_INVALID_RANGE_ERROR, ERROR);
    } else {
        // Refresh commit list
        var dataSet = "[";
        var hasData = false;

        // Retrieve first 90 commits
        for(var page = 0; page < 1; page++) {
            readDataFromGit(false, 'https://api.github.com/repos/' + repolink + '/commits?page=' + page, function(text) {
                var data = JSON.parse(text);

                for(var i in data) {
                    if(data[i] && data[i].author && data[i].author.login) {
                        var author = data[i].author.login;
                        var sha = data[i].sha;
                        var message = data[i].commit.message;
                        message = message.replace(/[\[\],']/g,'' );
                        message = message.replace(/(\r\n|\n|\r)/gm,"");
                        message = message.replace(/"/g, '');

                        readDataFromGit(false, 'https://api.github.com/repos/' + repolink + '/commits/' + sha, function(text) {
                            var data = JSON.parse(text);

                            var currFile = data.files;
                            for(var j in currFile) {
                                //alert("FILE: " + currFile[j].filename);
                                if(currFile[j].filename == filePath) {
                                    //alert("FOUND: " + author + " " + currFile[j].filename);
                                    dataSet += "\n    [ \"" + author + "\", \"" + message + "\" ],";
                                    hasData = true;
                                }
                            }
                        })
                    }
                }

                if(hasData) {
                    //alert(dataSet);
                    dataSet = dataSet.substring(0, dataSet.length - 1);
                    dataSet += "\n]";

                    //alert("final data: " + dataSet);

                    $(document).ready(function() {
                        dataSet = JSON.parse(dataSet);
                        $('#table4').show().DataTable({
                            destroy: true,
                            data: dataSet,
                            order: [[ 0, "desc" ]],
                            columnDefs: [
                                { "width": "20%", "targets": 0 }
                            ],
                            columns: [
                                { title: "Author" },
                                { title: "Commits" }
                            ]
                        });
                    });
                } else {
                    //$('.commitH2').text("No historical commit of " + author + " found");
                    //alert("No data!");
                    sweetAlert(TITLE_ERROR, "No data found", ERROR);
                    $(document).ready(function() {
                        $('#table4').hide();
                    });
                }
            });
        }
    }
}