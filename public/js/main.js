var updateCharts = function () {

    $('.ct-chart').each(function () {

        var el = this;

        var id = $(el).attr('monitor');
        if (id) {
            $.getJSON('/monitors/' + id + '/status/' + 10, function (data) {
                $(el).empty();
                console.log(data);

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
                    $(el).append('<h3>No data yet</h3>');
                }

            });
        }
    });
};
updateCharts();
setTimeout(updateCharts, 60 * 1000);