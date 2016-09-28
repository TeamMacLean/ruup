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
        return 'green';
    }
    else if (percent > 99) {
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