const CronJob = require('cron').CronJob;
const request = require('request');
const LOG = require('./log');
const moment = require('moment');
const Response = require('../models/response');
const Monitor = require('../models/monitor');

var Cron = {};

Cron.add = (monitor)=> {
    var job = new CronJob('*/5 * * * *', function () { //5 mins

            var start = moment();

            LOG.log('Checking site', monitor.name);

            //TODO add 'http://' if missing
            var URL = monitor.url;
            var prefix = 'http://';
            if (URL.substr(0, prefix.length) !== prefix) {
                URL = prefix + URL;
            }

            request(URL, function (error, response, body) {

                var end = moment();

                new Response({
                    time: start.diff(end, 'seconds'),
                    monitorID: monitor.id,
                    up: (!error && response && response.statusCode == 200),
                    statusCode: response.statusCode || 'NONE',
                    error: error
                }).save().then(()=> {
                    //TODO noting?
                    LOG.success('saved response');
                })
            })

        }, function () {
            //TODO reschedule
            // Cron.add(monitor);

            Cron.add(monitor);
            LOG.error('CRON', monitor.name, 'ENDED', 'RESCHEDULED IT');
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