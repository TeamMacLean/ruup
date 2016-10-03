const badge = require('gh-badges');

var Badge = {};

var generate = (left, right, color) => {
    return new Promise((good, bad)=> {
        badge.loadFont('Verdana.ttf', function (err) {
            if (err) {
                return bad(err);
            }
            badge({text: [left, right], colorscheme: color, template: "flat"},
                function (svg, err) {
                    if (err) {
                        return bad(err);
                    }
                    return good(svg);
                });
        });
    })
};

Badge.upPercent = (siteName, percent) => {
    return generate('uptime', percent + '%', colorForPercent(percent))
};

Badge.status = (siteName, up) => {

    var upText = 'Down';
    var color = 'red';
    if (up) {
        upText = 'Up';
        color = 'green';
    }
    return generate(siteName, upText, color)
};

Badge.averageResponseTime = (siteName, average) => {

    var color = colorForResponseTime(average);
    average = average + 'ms';
    if (!average) {
        average = 'unknown';
        color = 'lightgrey';
    } else {

    }

    return generate('avg response time', average, color)
};

function colorForResponseTime(average) {
    if (average < 200) {
        return 'green';
    }
    else if (average < 300) {
        return 'yellowgreen';
    }
    else if (average < 500) {
        return 'yellow';
    }
    else if (average < 1000) {
        return 'orange';
    } else {
        return 'red';
    }
}

function colorForPercent(percent) {

    if (percent > 98) {
        return 'yellowgreen';
    }
    else if (percent > 95) {
        return 'yellow';
    }
    else if (percent > 90) {
        return 'orange';
    } else {
        return 'red';
    }

}


module.exports = Badge;