$(function () {
    var overlay = $('.md-overlay');
    var modal = $('.md-modal');

    $('.md-trigger').on('click', function () {
        modal.toggleClass('md-show');
        overlay.toggleClass('md-show');
    })

});