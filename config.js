'use strict';

const {
  AD_HOST = 'manager-api-dev.tideanalytics.com',
  AD_KEY = 'DuS6YR9aCMJc0345mPNAkAIzaSyCChtVm4UlxD4',
  API_TOKEN = 'T9C6CXztdVhOdAc2azRdBfZrNW1FrHOJ',
  FIREBASE_TOKEN = 'AAAAmzbMPXE:APA91bFwdGqPSCG8Dfztv3i8BIl6w_qrkuI-tcLOw8HQrZMEBGjEyXqWkP0KmnlB08KjxWaXacKmJ60Ci2-wlnA_4W4Qt1-nupZYIZR3RrjhkkV074dXOrsUnG8KO5YMxqmIUdoYw8-6',
  DEFAULT_FIREBASE_WORKER = 'dQn0L1Opln8:APA91bEkw5D6zFtCE-26-xuvMHSQRcJtkY9Z4E9-4yzJUaoYfmCkYkpAAe5BxD2vDV1iYxGIjnBZ_bqNIxOBOPrs7sabx4z7Eu6T8h2i0mZBlUvgUI86Aus7n7-xfXRlKBjhGis6pPCW',
  MONGO = 'localhost:27017/radius',
  NODE_ENV = 'development',
  PORT = 3000
} = process.env;

module.exports = {
  AD_HOST,
  AD_KEY,
  API_TOKEN,
  FIREBASE_TOKEN,
  DEFAULT_FIREBASE_WORKER,
  MONGO,
  NODE_ENV,
  PORT
};
