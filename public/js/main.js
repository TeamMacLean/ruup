$(function () {
    console.log('loaded main.js');

    var overlay = $('.md-overlay');
    var modal = $('.md-modal');

    $('.md-trigger').on('click', function () {
        modal.toggleClass('md-show');
        overlay.toggleClass('md-show');
    });

    overlay.on('click', function () {
        if (overlay.hasClass('md-show')) {
            modal.removeClass('md-show');
            overlay.removeClass('md-show');
        }
    });

});