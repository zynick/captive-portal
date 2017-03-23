'use strict';

// version 3.2.1-r6
// "ga_ssid": "ACE E400",
// "ga_ap_mac": "00-04-56-AC-B3-AA",
// "ga_nas_id": "00:04:56:AC:B3:AA",
// "ga_srvr": "192.168.0.70",
// "ga_cmac": "70-56-81-C2-9C-23",
// "ga_rssi": "56",
// "ga_Qv": "eUROBR86HBgAGDEEVgQGBRtPFwsdFzc-DkRaR0A3Vk9AJkxaUUNeVGRERFwVBB8mDw..",
// "ga_orig_url": "http://init-s01st.push.apple.com/bag"
// "ga_error_code": "timeout | reject | not-found"

// version 3.1-b17
// "ga_ssid": "ACE E400",
// "ga_ap_mac": "00-04-56-AC-B3-AA",
// "ga_nas_id": "00:04:56:AC:B3:AA",
// "ga_srvr": "192.168.0.70",
// "ga_cmac": "C0-EE-FB-D5-C9-B4",
// "ga_Qv": "yDN\u0005\u001f:\u001c\u0018\u0000\u00181\u0004V\u0004\u0006\u0005\u001bO\u0017\u000b\u001d\u00177>\u000eD]7@M,OG!L)/C-$dD0\\\u0015\u0004\u001f&\u000f",
// "ga_orig_url": "http://www.tideanalytics.com/"

const parse = (req, res, next) => {

  const {
    ga_ap_mac,
    ga_nas_id,
    ga_srvr,
    ga_cmac,
    ga_Qv,
    ga_orig_url,
    ga_error_code
  } = req.query;

  const nas = ga_ap_mac.replace(/-/g, ':');
  const mac = ga_cmac.replace(/-/g, ':');
  const loginUrl = `${ga_srvr}:880/cgi-bin/hotspot_login.cgi`;  // body: ga_user=xxx&ga_pass=xxx


/*

192.168.0.70:880/cgi-bin/hotspot_login.cgi?ga_ap_mac=00-04-56-AC-B3-AA&ga_nas_id=00:04:56:AC:B3:AA&ga_srvr=192.168.0.70&ga_cmac=70-56-81-C2-9C-23&ga_Qv=yDN\u0005\u001f:\u001c\u0018\u0000\u00181\u0004V\u0004\u0006\u0005\u001bO\u0017\u000b\u001d\u00177>\u000eDZG@7VO@&LZQC^TdDD\\\u0015\u0004\u001f&\u000f

{"ga_ssid":"ACE Cambium","ga_ap_mac":"00-04-56-AC-B3-AA","ga_nas_id":"00:04:56:AC:B3:AA","ga_srvr":"192.168.0.70","ga_cmac":"70-56-81-C2-9C-23","ga_Qv":"yDN\u0005\u001f:\u001c\u0018\u0000\u00181\u0004V\u0004\u0006\u0005\u001bO\u0017\u000b\u001d\u00177>\u000eDZG@7VO@&LZQC^TdDD\\\u0015\u0004\u001f&\u000f","ga_orig_url":"http://neverssl.com/"}

http://192.168.0.190/connect?nas=00:04:56:AC:B3:AA&mac=70:56:81:C2:9C:23&loginUrl=192.168.0.70:880/%3CWLAN_IDX%3E/login.html&redirectUrl=http://neverssl.com/&trial=yes&error=undefined&p1=yDN%05%1F%3A%1C%18%00%181%04V%04%06%05%1BO%17%0B%1D%177%3E%0EDZG%407VO%40%26LZQC%5ETdDD%5C%15%04%1F%26%0F

curl -X POST \
  -i "192.168.0.70:880/cgi-bin/hotspot_login.cgi?ga_ap_mac=00-04-56-AC-B3-AA&ga_nas_id=00:04:56:AC:B3:AA&ga_srvr=192.168.0.70&ga_cmac=70-56-81-C2-9C-23&ga_Qv=yDN%05%1F%3A%1C%18%00%181%04V%04%00%1B%0E%14Y%15%02%00%26%152%01OF_Y%2C%5B_W\"FXVEW%7CYCVK%06%13%143%0C" \
  -H "User-Agent: Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "ga_user=70:56:81:C2:9C:23&ga_pass=fd2e021a7ef74087b243a959896033ef"

*/

  const redirectUrl = ga_orig_url;
  const trial = 'yes';              // TODO really yes ke?
  const error =
    ga_error_code === 'timeout' ? 'Authentication server failed to respond, retry again in few minutes' :
    ga_error_code === 'reject' ? 'The username or password you entered is incorrect' :
    ga_error_code === 'not-found' ? 'The authentication server not available, contact network admin' : '';
  const p1 = ga_nas_id;
  const p2 = ga_srvr;
  const p3 = encodeURIComponent(ga_Qv);

  const url = `/portal/connect?nas=${nas}&mac=${mac}&loginUrl=${loginUrl}&redirectUrl=${redirectUrl}&trial=${trial}&error=${error}&p1=${p1}&p2=${p2}&p3=${p3}&type=cambium`;
  res.redirect(url);
};

const generateGuestForm = (req, res, next) => {

  // TODO do we ever come here? does trial is really yes?

  next();
};

const generateSuccessForm = (req, res, next) => {

  const { loginUrl, nas, mac, p1, p2, p3, redirectUrl } = req.query;
  const { token, impressionUrl } = req.bag;

  const ga_ap_mac = nas.replace(/:/g, '-');
  const ga_nas_id = p1;
  const ga_srvr = p2;
  const ga_cmac = mac.replace(/:/g, '-');
  const ga_Qv = encodeURIComponent(p3);

  const redirectForm = {
    url: `${loginUrl}?ga_ap_mac=${ga_ap_mac}&ga_nas_id=${ga_nas_id}&ga_srvr=${ga_srvr}&ga_cmac=${ga_cmac}&ga_Qv=${ga_Qv}&ga_orig_url=${redirectUrl}`,
    method: 'POST',
    body: {
      ga_user: mac,
      ga_pass: token
    }
  };

  const impressionForm = {
    url: `${loginUrl}?ga_ap_mac=${ga_ap_mac}&ga_nas_id=${ga_nas_id}&ga_srvr=${ga_srvr}&ga_cmac=${ga_cmac}&ga_Qv=${ga_Qv}&ga_orig_url=${impressionUrl}`,
    method: 'POST',
    body: {
      ga_user: mac,
      ga_pass: token
    }
  };

  req.bag.redirectForm = redirectForm;
  req.bag.impressionForm = impressionForm;

  next();
};

module.exports = {
  parse,
  generateGuestForm,
  generateSuccessForm
};
