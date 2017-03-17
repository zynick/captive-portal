'use strict';


const parse = (req, res, next) => {

  // version 3.2.1-r6
  // "ga_ssid": "ACE E400",
  // "ga_ap_mac": "00-04-56-AC-B3-AA",
  // "ga_nas_id": "E400-ACB3AA",
  // "ga_srvr": "192.168.0.70",
  // "ga_cmac": "70-56-81-C2-9C-23",
  // "ga_rssi": "56",
  // "ga_Qv": "eUROBR86HBgAGDEEVgQGBRtPFwsdFzc-DkRaR0A3Vk9AJkxaUUNeVGRERFwVBB8mDw..",
  // "ga_orig_url": "http://init-s01st.push.apple.com/bag"
  // "ga_error_code": "timeout | reject | not-found"

  // version 3.1-b17
  // "ga_ssid": "ACE E400",
  // "ga_ap_mac": "00-04-56-AC-B3-AA",
  // "ga_nas_id": "E400-ACB3AA",
  // "ga_srvr": "192.168.0.70",
  // "ga_cmac": "C0-EE-FB-D5-C9-B4",
  // "ga_Qv": "yDN\u0005\u001f:\u001c\u0018\u0000\u00181\u0004V\u0004\u0006\u0005\u001bO\u0017\u000b\u001d\u00177>\u000eD]7@M,OG!L)/C-$dD0\\\u0015\u0004\u001f&\u000f",
  // "ga_orig_url": "http://www.tideanalytics.com/"

  const {
    ga_ap_mac,
    ga_srvr,
    ga_cmac,
    ga_Qv,
    ga_orig_url,
    ga_error_code
  } = req.query;

  const nas = ga_ap_mac.replace(/-/g, ':');
  const mac = ga_cmac.replace(/-/g, ':');
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

  const url = `/connect?nas=${nas}&mac=${mac}&loginUrl=${loginUrl}&redirectUrl=${ga_orig_url}&trial=${trial}&error=${error}&p1=${ga_Qv}`;
  res.redirect(url);
};

const generateUrl = (req, res, next) => {
  next();
};

module.exports = {
  parse,
  generateUrl
};
