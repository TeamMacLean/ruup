var updateCharts = function () {
    $('.ct-chart').each(function () {
        var el = this;
        var id = $(el).attr('data-monitor');
        var count = $(el).attr('data-count') || 8;
        if (id) {
            $.getJSON('/monitors/' + id + '/status/' + count, function (data) {
                $(el).hide();
                $(el).empty();
                if (data && data.length > 0) {
                    var series = [];
                    var labels = [];
                    data.forEach(function (res) {
                        var fancyTime = moment(res.createdAt).fromNow();
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
                $(el).show();
            });
        }
    });
};
function setUpChartInteraction($chart) {


    var easeOutQuad = function (x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    };

    //TODO point color by value
    //    var points = $chart.find('.ct-series').find('line');
    //    points.each(function () {
    //        var $point = $(this);
    //        var value = $point.attr('ct:value');
    //        console.log(value);
    //
    //        if (value == 0) {
    //            $point.css({'stroke': '#E74C3C'});
    //        } else if (value > 0 && value <= 320) {
    //            $point.css({'stroke': '#2ECC71'});
    //        } else {
    //            $point.css({'stroke': '#E67E22'});
    //        }
    //    });

    $chart
        .append('<div class="chartTooltip"></div>');

    var $toolTip = $chart.find('.chartTooltip')
        .hide();

    console.log($toolTip);


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

updateCharts();
//setInterval(updateCharts, 6000);