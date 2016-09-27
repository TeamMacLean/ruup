const badge = require('gh-badges');

var Badge = {};

Badge.generate = function (site, percent) {
    return new Promise((good, bad)=> {
        badge.loadFont('Verdana.ttf', function (err) {
            if (err) {
                return bad(err);
            }
            badge({text: [site, percent + '% uptime'], colorscheme: "green", template: "flat"},
                function (svg, err) {
                    if (err) {
                        return bad(err);
                    }
                    return good(svg);
                });
        });
    })
};


module.exports = Badge;