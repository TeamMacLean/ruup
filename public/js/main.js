var MAX_RESPONSE_TIME = 2500;


var easeOutQuad = function (x, t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
};

$(document).ready(function () {



    $('.format-time').each(function(){

        var $this = $(this);


        var thisData = $this.text();

        console.log(thisData);

        $this.text(
            moment(new Date(thisData)).format('MMMM Do YYYY, h:mm:ss a')
        );

    });




    var updateCharts = function () {
        $('.ct-chart').each(function () {
            var el = this;
            var seq = 0;
            var animationComplete = false;
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
                                fancyTime = time.format("DD/MM/YY hh:mm");
                            }


//                            if (res.time > MAX_RESPONSE_TIME) {
//                                res.time = 0;
//                            }

                            labels.push(fancyTime);
                            series.push(res.time);
                        });

                        var chart = new Chartist.Line(el, {
                            labels: labels,
                            series: [series]
                        }, {showArea: true});

                        chart.on('created', function () {
                            seq = 0;
                            animationComplete = true;
                            setUpChartInteraction($(el));
                        });


                        chart.on('draw', function (data) {
                            if (!animationComplete) {

                                if (data.type === 'area') {
                                    seq++;
                                    data.element.animate({
                                        opacity: {
                                            from: 0,
                                            to: 1,
                                            begin: seq * 100,
                                            dur: 400
                                        }
                                    });
                                }
                                if (data.type === 'line') {
                                    seq++;
                                    data.element.animate({
                                        opacity: {
                                            from: 0,
                                            to: 1,
                                            begin: seq * 80,
                                            dur: 400
                                        }
                                    })
                                }

                                if (data.type === 'point') {
                                    seq++;
                                    data.element.animate({
                                        y1: {
                                            from: data.y - 50,
                                            to: data.y,
                                            begin: seq * 80,
                                            dur: 400,
                                            easing: Chartist.Svg.Easing.easeOutQuint
                                        },
                                        opacity: {
                                            from: 0,
                                            to: 1,
                                            begin: seq * 80,
                                            dur: 100
                                        }
                                    });
                                }
                            }
                        });

                    } else {
                        $(el).append('<h3>No data yet...</h3>');
                    }
                });
            }
        });
    };


    function setUpChartInteraction($chart) {


        {
            var points = $chart.find('.ct-point');
            points.each(function () {
                var point = $(this);
                var value = point.attr('ct:value');
                if (value == 0 || value > MAX_RESPONSE_TIME) {
                    point.css('stroke', '#E74C3C');
                }
            });
        }


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

    function newMonitorForm() {

        function poly() {
            var val = $('#newMonitorForm').find('#typeSelect').val();
            if (val == 1) {
                $('#urlInput').clone().attr('type', 'text').attr('placeholder', 'example.com').insertAfter('#urlInput').prev().remove();
            } else if (val == 2) {
                $('#urlInput').clone().attr('type', 'url').attr('placeholder', 'http://example.com').insertAfter('#urlInput').prev().remove();

            }
        }

        $('#newMonitorForm').find('#typeSelect').change(function () {
            poly();
        });

        poly();
    }

    $(window).bind("load", function () {
        updateCharts();
        scrollManager();


        newMonitorForm();
    });

});