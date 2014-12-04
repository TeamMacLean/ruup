var updateCharts = function () {
    $('.ct-chart').each(function () {
        var el = this;
        var id = $(el).attr('data-monitor');
        var count = $(el).attr('data-count') || 8;
        if (id) {
            $.getJSON('/monitors/' + id + '/status/' + count, function (data) {
                $(el).empty();
                if (data && data.length > 0) {
                    var series = [];
                    var labels = [];
                    data.forEach(function (res) {
                        var fancyTime = moment(res.created_at).fromNow();
                        labels.push(fancyTime);
                        series.push(res.time);
                    });
                    new Chartist.Line(el, {
                        labels: labels,
                        series: [series]
                    }, {showArea: true});
                } else {
                    $(el).append('<h3>No data yet...</h3>');
                }
            });
        }
    });
};
updateCharts();
setInterval(updateCharts, 6000);