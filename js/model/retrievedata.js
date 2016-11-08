// Extract all authors from repository
function getAllData(repolink) {
    var data;

    readDataFromGit(true, 'https://api.github.com/repos/' + repolink + '/contributors', function(text){
        // Author dropdown
        $('#author-list option').remove();
        data = JSON.parse(text);
        $.each(data, function(i, v) {
            var ul = document.getElementById("author-list");
            var li = document.createElement("option");
            var linkText = document.createTextNode(v.login);
            li.appendChild(linkText);
            ul.appendChild(li);
        });
        $('#author-list').selectpicker('refresh');

        // Author-list dropdown
        $('#author-list-multiple option').remove();
        data = JSON.parse(text);
        $.each(data, function(i, v) {
            var ul = document.getElementById("author-list-multiple");
            var li = document.createElement("option");
            var linkText = document.createTextNode(v.login);
            li.appendChild(linkText);
            ul.appendChild(li);
        });
        $('#author-list-multiple').selectpicker('refresh');
    });

    readDataFromGit(true, 'https://api.github.com/repos/' + repolink + '/git/trees/master?recursive=1', function(text){
        $('#file-list option').remove();
        data = JSON.parse(text);
        //console.log(data);
        for(var i in data) {
            var trees = data.tree;
            //console.log(trees);
            for (var j in trees) {
                var ul = document.getElementById("file-list");
                var li = document.createElement("option");
                var linkText = document.createTextNode(trees[j].path);
                li.appendChild(linkText);
                ul.appendChild(li);
            }
        }
        $('#file-list').selectpicker('refresh');
    });
}

function readDataFromGit(isBackground, link, callback) {
    var request = new XMLHttpRequest();
    request.overrideMimeType("application/json");
    request.open('GET', link, isBackground);
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status == "200") {
            callback(request.responseText);
        }
    };
    request.send(null);
}