const badge = require('gh-badges');

var Badge = {};

var generate = (left, right, color) => {
    return new Promise((good, bad)=> {
        badge.loadFont('Verdana.ttf', function (err) {
            if (err) {
                return bad(err);
            }
            badge({text: [left, right], colorscheme: color, template: 'flat-square'},
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

    const label = 'uptime';

    if (percent == null) {
        return generate(label, 'unknown', 'lightgrey');
    }

    return generate(label, percent + '%', colorForPercent(percent))
};

Badge.status = (siteName, up) => {
    const label = siteName;

    if (up == null) {
        return generate(label, 'unknown', 'lightgrey');
    }

    var upText = 'Down';
    var color = 'red';
    if (up) {
        upText = 'Up';
        color = 'green';
    }


    return generate(label, upText, color)
};

Badge.averageResponseTime = (siteName, average) => {

    const label = 'avg response time';

    if (average == null) {
        return generate(label, 'unknown', 'lightgrey');
    }

    var color = colorForResponseTime(average);
    average = average + 'ms';
    if (!average) {
        average = 'unknown';
        color = 'lightgrey';
    } else {

    }

    return generate(label, average, color)
};

function colorForResponseTime(average) {
    if (average < 500) {
        return 'green';
    }
    else if (average < 1000) {
        return 'yellowgreen';
    }
    else if (average < 2000) {
        return 'yellow';
    }
    else if (average < 3000) {
        return 'orange';
    } else {
        return 'red';
    }
}

function colorForPercent(percent) {

    if (percent >= 99) {
        return 'green';
    }
    else if (percent >= 98) {
        return 'yellowgreen';
    }
    else if (percent >= 97) {
        return 'yellow';
    }
    else if (percent >= 97) {
        return 'orange';
    } else {
        return 'red';
    }

}


module.exports = Badge;