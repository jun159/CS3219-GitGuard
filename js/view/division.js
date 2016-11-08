$(document).ready(function() {
    $("#introstatistics1").show();
    $("#introstatistics2").show();
    $("#introstatistics3").show();
    $("#introstatistics4").show();
    $("#introstatistics5").show();
    $("#download").show();

    $("#statistics1").hide();
    $("#statistics2").hide();
    $("#statistics3").hide();
    $("#statistics4").hide();
    $("#statistics5").hide();
});

function switchDivToStats(repolink) {
    switchDiv1(repolink);
    switchDiv2();
    switchDiv3();
    switchDiv4();
    switchDiv5(repolink);
}

function switchDiv1(repolink) {
    var url = "https://api.github.com/repos/" + repolink + "/stats/contributors";
    makeAjaxCall(this.displayBubbles, this.refine, url);
    $("#statistics1").show();
    $("#introstatistics1").hide();
    $("a[href='#introstatistics1']").attr('href', '#statistics1');
}

function switchDiv2() {
    //var url = "https://api.github.com/repos/" + repolink + "/stats/contributors";
    //makeAjaxCall2(this.displayStackedBarchart, this.filter, url);
    $("#statistics2").show();
    $("#introstatistics2").hide();
    $('#tableCommits').hide();
    $("a[href='#introstatistics2']").attr('href', '#statistics2');
}

function switchDiv3() {
    $("#statistics3").show();
    $("#introstatistics3").hide();
    $("a[href='#introstatistics3']").attr('href', '#statistics3');
}

function switchDiv4() {
    $("#statistics4").show();
    $("#introstatistics4").hide();
    $('#table4').hide();
    $("a[href='#introstatistics4']").attr('href', '#statistics4');
}

function switchDiv5(repolink) {
    $("#statistics5").show();
    $("#introstatistics5").hide();
    $("a[href='#introstatistics5']").attr('href', '#statistics5');
    displayBarChart(repolink);
}

$.fn.DataTable.ext.pager.numbers_length = 4;