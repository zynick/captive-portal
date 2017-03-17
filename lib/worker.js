'use strict';

const Worker         = require('mongoose').model('Worker');
const SERVER_KEY     = 'AAAAmzbMPXE:APA91bFwdGqPSCG8Dfztv3i8BIl6w_qrkuI-tcLOw8HQrZMEBGjEyXqWkP0KmnlB08KjxWaXacKmJ60Ci2-wlnA_4W4Qt1-nupZYIZR3RrjhkkV074dXOrsUnG8KO5YMxqmIUdoYw8-6';
const DEFAULT_WORKER = 'dQn0L1Opln8:APA91bEkw5D6zFtCE-26-xuvMHSQRcJtkY9Z4E9-4yzJUaoYfmCkYkpAAe5BxD2vDV1iYxGIjnBZ_bqNIxOBOPrs7sabx4z7Eu6T8h2i0mZBlUvgUI86Aus7n7-xfXRlKBjhGis6pPCW';
const FCM_HOST       = 'fcm.googleapis.com';
const FCM_PATH       = '/fcm/send';

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
        return next(new Error('no workers available'));
      }

      const worker = workers[0];
            worker.lastActivated = new Date();
            worker.save();

      return next(worker);
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
      'authorization': `key=${SERVER_KEY}`,
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