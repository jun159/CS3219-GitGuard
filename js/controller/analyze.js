const TITLE_SUCCESS = "Success!";
const TITLE_ERROR = "Oops...";
const MESSAGE_SUCCESS = "Successfully generated statistics.";
const MESSAGE_ERROR = "Something went wrong. Please try again.";
const MESSAGE_EMPTY_ERROR = "Please ensure that no field is empty.";
const MESSAGE_INVALID_RANGE_ERROR = "Please ensure that start line < end line.";
const MESSAGE_INVALID = "You have entered an invalid url. Please try again.";
const SUCCESS = "success";
const ERROR = "error";

function analyze() {
    var repolink = document.getElementById("repolink").value;
    resetAllData();

    // Check if repository link is valid
    if(repolink && isRepoLinkValid(repolink)) {
        // Valid, pass link to all visualizations
        repolink = repolink.substring(19);

        if(isGenerateStatsSuccess(repolink)) {
            sweetAlert(TITLE_SUCCESS, MESSAGE_SUCCESS, SUCCESS);
            switchDivToStats(repolink);
        } else {
            sweetAlert(TITLE_ERROR, MESSAGE_ERROR, ERROR);
        }
    } else {
        // Invalid
        sweetAlert(TITLE_ERROR, MESSAGE_INVALID, ERROR);
    }
}

function isRepoLinkValid(repolink) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    var githubLink = repolink.substring(0, 19);
    return regexp.test(repolink) && (githubLink.localeCompare("https://github.com/") == 0);
}

function isGenerateStatsSuccess(repolink) {
    getAllData(repolink);

    return isGenerateTablesSuccess(repolink);
}

function resetAllData() {
    $(".pieChart").hide();
    d3.select("#pie_chart").remove();
    d3.select("#stacked_bar").remove();
    d3.select("#atas_bar").remove();
    d3.select("svg").remove();
    localStorage.clear();
}

