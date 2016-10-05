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

    if (percent == null) {
        return generate('uptime', 'unknown', 'grey');
    }

    return generate('uptime', percent + '%', colorForPercent(percent))
};

Badge.status = (siteName, up) => {

    if (up == null) {
        return generate(siteName, 'unknown', 'grey');
    }

    var upText = 'Down';
    var color = 'red';
    if (up) {
        upText = 'Up';
        color = 'green';
    }


    return generate(siteName, upText, color)
};

Badge.averageResponseTime = (siteName, average) => {

    if (average == null) {
        return generate('avg response time', 'unknown', 'grey');
    }

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