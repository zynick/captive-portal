'use strict';

// const log = require('debug')('portal:cambium');


const init = (req, res, next) => {

  // "ga_ssid": "ACE E400",
  // "ga_ap_mac": "00-04-56-AC-B3-AA",
  // "ga_nas_id": "E400-ACB3AA",
  // "ga_srvr": "192.168.0.70",
  // "ga_cmac": "70-56-81-C2-9C-23",
  // "ga_rssi": "56",
  // "ga_Qv": "eUROBR86HBgAGDEEVgQGBRtPFwsdFzc-DkRaR0A3Vk9AJkxaUUNeVGRERFwVBB8mDw..",
  // "ga_orig_url": "http://init-s01st.push.apple.com/bag"
  // "ga_error_code": "timeout | reject | not-found"
  //     timeout - Authentication server failed to respond, retry again in few minutes
  //     reject - The username or password you entered is incorrect
  //     not-found - The authentication server not available, contact network admin

  const {
    ga_ap_mac,
    ga_srvr,
    ga_cmac,
    ga_orig_url,
    ga_error_code
  } = req.query;

  const loginUrl = `${ga_srvr}:880/<WLAN_IDX>/login.html`;
  const trial = 'yes';

  let error;
  if (ga_error_code === 'timeout') {
    error = 'Authentication server failed to respond, retry again in few minutes';
  } else if (ga_error_code === 'reject') {
    error = 'The username or password you entered is incorrect';
  } else if (ga_error_code === 'not-found') {
    error = 'The authentication server not available, contact network admin';
  } else {
    error = ga_error_code;
  }

  const url = `/connect?nas=${ga_ap_mac}&mac=${ga_cmac}&loginUrl=${loginUrl}&redirectUrl=${ga_orig_url}&trial=${trial}&error=${error}`;
  res.redirect(url);
};

module.exports = {
  init
};
