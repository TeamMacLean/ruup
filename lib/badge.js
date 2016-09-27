const badge = require('gh-badges');

var Badge = {};

Badge.generate = function (site, percent) {
    return new Promise((good, bad)=> {
        badge.loadFont('Verdana.ttf', function (err) {
            if (err) {
                return bad(err);
            }
            badge({text: [site, percent + '% uptime'], colorscheme: colorForPercent(percent), template: "flat"},
                function (svg, err) {
                    if (err) {
                        return bad(err);
                    }
                    return good(svg);
                });
        });
    })
};

function colorForPercent(percent) {

    if (percent == 100) {
        return 'brightgreen';
    }
    if (percent > 99) {
        return 'green';
    }
    if (percent > 95) {
        return 'yellowgreen';
    }
    if (percent > 90) {
        return 'yellow';
    }
    if (percent > 80) {
        return 'orange'
    } else {
        return 'red';
    }

}


module.exports = Badge;