const CronJob = require('cron').CronJob;
const request = require('request');
const LOG = require('./log');
const moment = require('moment');
const Response = require('../models/response');
const Monitor = require('../models/monitor');

var Cron = {};

Cron.add = (monitor)=> {
    var job = new CronJob('*/5 * * * *', function () { //5 mins
            // var job = new CronJob('*/1 * * * *', function () { //1mins
            LOG.log('Checking site', monitor.name);

            //add 'http://' if missing
            var URL = monitor.url;
            var prefix = 'http://';
            if (URL.substr(0, prefix.length) !== prefix) {
                URL = prefix + URL;
            }
            var start = moment(); //pre request time
            request(URL, function (error, response, body) { //do we need body?
                var end = moment(); //post request time
                if (!response) {
                    response = {}; //make sure it exists
                }
                new Response({
                    time: start.diff(end, 'seconds'),
                    monitorID: monitor.id,
                    up: (!error && response.statusCode == 200),
                    statusCode: response.statusCode || null,
                    error: error ? error.toString() : null
                }).save().then((newResponse)=> {
                    // LOG.success('saved response');
                    Response.filter({monitorID: monitor.id}).run()
                        .then((responses)=> {
                            var up = responses.filter((r)=> {
                                return r.up;
                            }).length;
                            monitor.upPercent = Math.floor((up / responses.length) * 100);
                            monitor.isUp = newResponse.up;
                            monitor.save()
                                .then(()=> {
                                    // LOG.success('updated monitor up percentage', monitor.upPercent);
                                })
                                .catch((err)=> {
                                    LOG.error('failed to save monitor up percentage', err);
                                })
                        })
                        .catch((err)=> {
                            LOG.error('failed to update monitor', monitor.name, 'up percent, because', err);
                        })
                })
            })

        }, function () {
            //TODO reschedule
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