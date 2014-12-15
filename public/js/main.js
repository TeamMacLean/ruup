var updateCharts = function () {
    $('.ct-chart').each(function () {
        var el = this;
        var id = $(el).attr('data-monitor');
        var count = $(el).attr('data-mcount') || 8;
        if (id) {
            $.getJSON('/monitors/' + id + '/status/' + count, function (data) {
                $(el).empty();
                if (data && data.length > 0) {
                    var series = [];
                    var labels = [];
                    data.forEach(function (res) {

                        var time = moment(res.createdAt);
                        var now = moment();

                        var fancyTime = 'unknown';

                        if (now.year(time)) {
                            fancyTime = time.format("DD/MM");
                            if (now.month(time)) {
                                fancyTime = time.format("ddd Do");
                                if (now.week(time)) {
                                    fancyTime = time.format("ddd");
                                    if (now.day(time)) {
                                        fancyTime = time.format("hh:mm");
                                        if (now.hour(time)) {
                                            fancyTime = time.fromNow();
                                        }
                                    }
                                }
                            }
                        } else {
                            fancyTime = time.format("DD/MM/YY");
                        }


                        labels.push(fancyTime);
                        series.push(res.time);
                    });
                    var chart = new Chartist.Line(el, {
                        labels: labels,
                        series: [series]
                    }, {showArea: true});
                    chart.on('created', function () {
                        setUpChartInteraction($(el));
                    });
                } else {
                    $(el).append('<h3>No data yet...</h3>');
                }
            });
        }
    });
};
function setUpChartInteraction($chart) {
    var easeOutQuad = function (x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    };
    $chart
        .append('<div class="chartTooltip"></div>');
    var $toolTip = $chart.find('.chartTooltip')
        .hide();
    $chart.find('.ct-point').mouseenter(function () {
        var $point = $(this);
        var value = $point.attr('ct:value');
        $point.animate({'stroke-width': '30px'}, 300, easeOutQuad);
        $toolTip.html(value + 'ms').show();
    });
    $chart.find('.ct-point').mouseleave(function () {
        var $point = $(this);
        $point.animate({'stroke-width': '10px'}, 300, easeOutQuad);
        $toolTip.hide();
    });
    $chart.find('.ct-point').mousemove(function (event) {
        $toolTip.css({
            left: (event.originalEvent.layerX) - $toolTip.width() / 2,
            top: (event.originalEvent.layerY) - $toolTip.height() - 40
        });
    });
}

function scrollManager() {
    $(".navbar").headroom({
        "offset": 50,
        "tolerance": 5,
        "classes": {
            "initial": "animated",
            "pinned": "slideDown",
            "unpinned": "slideUp"
        }
    });
}

$(window).bind("load", function () {
    updateCharts();
    scrollManager();
});