const CronJob = require('cron').CronJob;
const request = require('request');
const LOG = require('./log');
const moment = require('moment');
const Response = require('../models/response');
const Monitor = require('../models/monitor');
const Email = require('../lib/email');
const async = require('async');

var Cron = {};

const emailTimeStampFormat = "dddd, MMMM Do YYYY, h:mm:ss a";

var q = async.queue(function (task, callback) {

    var monitor = task.monitor;

    var start = moment(); //pre request time
    request(monitor.url, function (error, response, body) { //do we need body?
        LOG.log(monitor.name, 'being processed in queue');
        // LOG.log('Got response from', monitor.name);
        var end = moment(); //post request time




        if (!response) {
            response = {}; //make sure it exists
        }

        var duration = moment.duration(end.diff(start));
        var timeDiff = duration.asMilliseconds();


        var isUp = (!error && response.statusCode == 200);
        if (!isUp && monitor.up) {//ITS DOWN!

            if (!monitor.emailSent) {
                Email.isDown(monitor, response, end.format(emailTimeStampFormat));
                monitor.emailSent = true;
            }
        }

        if (isUp && !monitor.up) { //ITS BACK UP!
            Email.isUp(monitor, response, end.format(emailTimeStampFormat));
            monitor.emailSent = false;
        }


        new Response({
            time: isUp ? timeDiff : null, //9999 aka didnt return
            monitorID: monitor.id,
            up: isUp,
            statusCode: response.statusCode || null,
            error: error ? error.toString() : null
        }).save().then(()=> {
            // LOG.success('saved response');
            Response.filter({monitorID: monitor.id}).run()
                .then((responses)=> {
                    var up = responses.filter((r)=> {
                        return r.up;
                    }).length;
                    monitor.upPercent = Math.floor((up / responses.length) * 100);
                    monitor.up = isUp;

                    //calculate average response time (optimal)
                    var respt = 0;
                    responses.map((resp)=> {
                        respt += resp.time;
                    });
                    // monitor.avgResponseTime = Math.floor(respt / responses.length);
                    monitor.avgResponseTime = (respt / responses.length).toFixed(2);

                    monitor.save()
                        .then(()=> {
                            // LOG.success('updated monitor up percentage', monitor.upPercent);
                            return callback();
                        })
                        .catch((err)=> {
                            LOG.error('failed to save monitor up percentage', err);
                            return callback(err);
                        })
                })
                .catch((err)=> {
                    LOG.error('failed to update monitor', monitor.name, 'up percent, because', err);
                    return callback(err);
                })
        });
    });
}, 1);

Cron.add = (monitor)=> {

    LOG.log(monitor.name, 'added to monitor list');

    new CronJob('*/5 * * * *', function () { //5 mins, add job
            q.push([{monitor}], function (err) {
                if (err) {
                    LOG.error(err);
                } else {
                    LOG.log(monitor.name, 'finished job');
                }
            });
        }, function () {
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