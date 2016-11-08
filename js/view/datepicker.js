$(function() {
    $( "#datepicker-start" ).datepicker({
        showOtherMonths:true,
        selectOtherMonths: true,
        dateFormat: "dd-M-yy",
        maxDate: 0,
        onSelect: function (date) {
            var datepickerEnd = $( '#datepicker-end' );
            var startDate = $(this).datepicker('getDate');
            var endDate = $(this).datepicker('getDate');
            endDate.setDate(startDate.getDate() + 6);
            datepickerEnd.datepicker('setDate', endDate);
            datepickerEnd.datepicker('option', 'minDate', endDate);
        }
    });

    $( "#datepicker-end" ).datepicker({
        showOtherMonths:true,
        selectOtherMonths: true,
        maxDate: 0,
        dateFormat: "dd-M-yy"
    });

    $( "#datepicker-list-start" ).datepicker({
        showOtherMonths:true,
        selectOtherMonths: true,
        dateFormat: "dd-M-yy",
        maxDate: 0,
        onSelect: function (date) {
            var datepickerEnd = $( '#datepicker-list-end' );
            var startDate = $(this).datepicker('getDate');
            var endDate = $(this).datepicker('getDate');
            endDate.setDate(startDate.getDate() + 6);
            datepickerEnd.datepicker('setDate', endDate);
            datepickerEnd.datepicker('option', 'minDate', endDate);
        }
    });

    $( "#datepicker-list-end" ).datepicker({
        showOtherMonths:true,
        selectOtherMonths: true,
        maxDate: 0,
        dateFormat: "dd-M-yy"
    });
});