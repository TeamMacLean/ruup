const CronJob = require('cron').CronJob;
const request = require('request');

const Response = require('../models/response');
const Monitor = require('../models/monitor');

var Cron = {};

Cron.add = (monitor)=> {
    var job = new CronJob('*/5 * * * *', function () { //5 mins
            request(monitor.url, function (error, response, body) {
                new Response({
                    time: 0,
                    monitorID: monitor.id,
                    up: (!error && response.statusCode == 200),
                    responseCode: response.statusCode,
                    error: error
                });
            })

        }, function () {
            //TODO reschedule
            // Cron.add(monitor);
        },
        true, /* Start the job right now */
    );

};

Cron.startAll = () => {
    Monitor.run().then((monitors)=> {
        monitors.map((monitor)=> {
            Cron.add(monitor);
        })
    })
};


module.exports = Cron;