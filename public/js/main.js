function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$('.ct-chart').each(function () {
    var series = [];
    var labels = [];

    for (var i = 1; i < 9; i++) {
        series.push(getRandomInt(3, 5));
        labels.push(i);
    }

    new Chartist.Line(this, {
        labels: labels,
        series: [series]
    }, {
        low: 0,
        showArea: true
    });
});