var bucket = new AWS.S3({params: {Bucket: 'group12.assignment5.cs3219.sem1.20162017'}});

function subscribe() {
    var textarea1 = document.getElementById('repo_link1');
    var textarea2 = document.getElementById('user_email1');
    var button = document.getElementById('upload-button1');
    //var results = document.getElementById('results');

    //results.innerHTML = "";
    var git_link = textarea1.value;
    var re = /\//g;
    var trimmed_git_link = git_link.replace(re, ",");
    var file_name = trimmed_git_link + '.txt';
    var params = {Key: file_name};
    var date = new Date();
    var timestamp = date.toString();
    bucket.getObject(params, function(err, data) {
        // user repo record doesn't exist, create it
        if (err) {
            params.Body = textarea2.value + '\n' + timestamp;
            bucket.upload(params, function (err, data) {
                //results.innerHTML = err ? console.log(err) : 'new repo link file saved.';
            });
        }
        // user repo record exists, write the additional email into it
        else{
            var existing_emails_array = data.Body.toString('ascii').split('\n');
            var existing_emails = "";
            for(i=0; i<existing_emails_array.length-1;i++){
                existing_emails += existing_emails_array[i] + '\n';
            }
            params.Body = existing_emails + textarea2.value + '\n' + timestamp;
            bucket.upload(params, function (err, data) {
                //results.innerHTML = err ? console.log(err) : 'existing repo link file overwritten.';
            });
        }
    });
}

function updateUserTime() {
    var textarea3 = document.getElementById('repolink');
    var textarea4 = document.getElementById('user_email');

    var git_link = textarea3.value;
    var re = /\//g;
    var trimmed_git_link = git_link.replace(re, ",");
    var file_name = trimmed_git_link + '.txt';
    var params = {Key: file_name};

    bucket.getObject(params, function(err, data) {
        // user repo record doesn't exist, create it
        if (!err) {
            var content = data.Body.toString('ascii').split('\n');
            var existing_emails_array = content.slice(0, content.length-1);
            var subscribed_email = textarea4.value;
            var existing_emails = "";
            // if the anonymous user is indeed a subscriber
            if(existing_emails_array.indexOf(subscribed_email) > -1){
                for(i=0; i<existing_emails_array.length; i++){
                    existing_emails += existing_emails_array[i] + '\n';
                }
                var date = new Date();
                var timestamp = date.toString();
                params.Body = existing_emails + timestamp;
                bucket.upload(params, function (err, data) {
                    //results.innerHTML = err ? console.log(err) : 'existing repo link file overwritten.';
                });
            }
            else{
                //sweetAlert(TITLE_ERROR, "You haven't subscribed to our notification service.", ERROR);
            }
        }
    });
}