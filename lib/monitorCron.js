const CronJob = require('cron').CronJob;
const request = require('request');
const LOG = require('./log');

const Response = require('../models/response');
const Monitor = require('../models/monitor');

var Cron = {};

Cron.add = (monitor)=> {
    var job = new CronJob('*/5 * * * *', function () { //5 mins
            LOG.log('Checking site', monitor.name);


            //TODO add 'http://' if missing
            var URL = monitor.url;
            var prefix = 'http://';
            if (URL.substr(0, prefix.length) !== prefix) {
                URL = prefix + URL;
            }

            request(URL, function (error, response, body) {

                LOG.log(monitor.name, 'response:', response || 'none');
                LOG.log(monitor.name, 'error:', error || 'none');

                new Response({
                    time: 0,
                    monitorID: monitor.id,
                    up: (!error && response && response.statusCode == 200),
                    responseCode: response.statusCode || 'NONE',
                    error: error
                }).save().then((response)=> {
                    //TODO noting?
                })
            })

        }, function () {
            //TODO reschedule
            // Cron.add(monitor);
        },
        true /* Start the job right now */
    );

};

Cron.startAll = () => {
    Monitor.run().then((monitors)=> {
        LOG.log('Starting', monitors.length, 'monitor(s)');
        monitors.map((monitor)=> {
            Cron.add(monitor);
        })
    })
};


module.exports = Cron;