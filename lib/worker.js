'use strict';

/**
 *   require('../lib/worker')
 *     .sendSMS(
 *       {title: "commited", body: "", recipient: "0173040802"},
 *       err => {
 *         if (err) { return next(err); };
 *         res.jsonp('ok');
 *       });
 **/

const {FIREBASE_TOKEN, DEFAULT_FIREBASE_WORKER} = require('../config');

const https    = require('https');
const Worker   = require('mongoose').model('Worker');
const FCM_HOST = 'fcm.googleapis.com';
const FCM_PATH = '/fcm/send';

const sendSMS = ({title, body, recipient}, next) => {

  latestWorker((err, worker) => {

    if (err) { return next(err); }

    const id = worker.identifier;
    triggerFirebase({id, title, body, recipient}, next);
  });

};

const latestWorker = (next) => {

  Worker
    .find({type:'sms'})
    .sort('lastActivated')
    .limit(1)
    .exec( (err, workers) => {

      if (err) { return next(err); }
      if (!workers || workers.length < 1) {
        return next(null, {identifier: DEFAULT_FIREBASE_WORKER});
      }

      const worker = workers[0];
            worker.lastActivated = new Date();
            worker.save();

      return next(null, worker);
    });

};

const triggerFirebase = ({id, title, body, recipient}, next) => {

  const payload = JSON.stringify({
    to:           id || DEFAULT_WORKER,
    priority:     'high',
    data:         {title, recipient, body}
  });

  const options = {
    host:    FCM_HOST,
    path:    FCM_PATH,
    method: 'POST',
    headers: {
      'authorization': `key=${FIREBASE_TOKEN}`,
      'Content-Type':  'application/json'
    }
  };

  const req = https
                .request(options, res => {

                  let data = '';
                  res.setEncoding('utf8')
                    .on('data', d => data += d)
                    .on('end', () => {

                      try {
                        res.body = JSON.parse(data);
                      } catch (e) {
                        res.body = data;
                      }

                      next(null, res);
                    })
                    .on('error', next);

                })
                .on('error', next)
                .on('socket', socket => {

                  socket
                    .setTimeout(30 * 1000) // 30 seconds;
                    .on('timeout', () => {
                      const err  = new Error(`FCM timeout: ${FCM_HOST}${FCM_PATH}`);
                      err.status = 504;
                      next(err);
                    });

                });

  req.write(payload);
  req.end();

};

module.exports = {sendSMS};