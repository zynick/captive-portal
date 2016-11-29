let bin2hex, hex2bin, encode_password;

bin2hex = (s = '') => {
    //  discuss at: http://locutus.io/php/bin2hex/
    // original by: Kevin van Zonneveld (http://kvz.io)
    // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    // bugfixed by: Linuxworld
    // improved by: ntoniazzi (http://locutus.io/php/bin2hex:361#comment_177616)
    //   example 1: bin2hex('Kev')
    //   returns 1: '4b6576'
    //   example 2: bin2hex(String.fromCharCode(0x00))
    //   returns 2: '00'

    var i;
    var l;
    var o = '';
    var n;

    for (i = 0, l = s.length; i < l; i++) {
        n = s.charCodeAt(i).toString(16);
        o += n.length < 2 ? '0' + n : n;
    }

    return o;
};


hex2bin = (s = '') => {
    //  discuss at: http://locutus.io/php/hex2bin/
    //  original by: Dumitru Uzun (http://duzun.me)
    //   example 1: hex2bin('44696d61')
    //   returns 1: 'Dima'
    //   example 2: hex2bin('00')
    //   returns 2: '\x00'
    //   example 3: hex2bin('2f1q')
    //   returns 3: false

    let ret = [];
    let i = 0;
    let l;

    for (l = s.length; i < l; i += 2) {
        let c = parseInt(s.substr(i, 1), 16);
        let k = parseInt(s.substr(i + 1, 1), 16);
        if (isNaN(c) || isNaN(k)) {
            return false;
        }
        ret.push((c << 4) | k);
    }

    return String.fromCharCode.apply(String, ret);
};











encode_password = (plain, challenge = '', secret = '') => {

    console.log(`password\t: ${plain}`);
    console.log(`challenge\t: ${challenge}`);
    console.log(`secret\t\t: ${secret}`);

    if (challenge.length === 0 || (challenge.length % 2) !== 0) {
        return false;
    }

    const hexChallenge = hex2bin(challenge);
    if (hexChallenge === false) {
        return false;
    }

    console.log(`hex\t\t\t: ${hexChallenge}`);
    // console.log('[TEST]\t\t: ' + bin2hex(hexChallenge));

    let hash, length;
    if (secret.length > 0) {
        // TODO need to verify this by adding secret
        hash = md5(`${hexChallenge}${secret}`, null, true);
        hashLength = 16;
    } else {
        hash = hexChallenge;
        hashLength = hexChallenge.length;
    }

    console.log(`crypt_secret: ${hash}`);
    console.log(`len_secret\t: ${hashLength}`);

    // simulate C style \0 terminated string
    plain += '\0';
    let arr = [];
    let char;
    let crypted = '';
    for (let i = 0; i < plain.length; i++) {
        char = plain[i] ^ hash[i % hashLength];
        console.log(`char: ${char}`);
        arr.push(char);
    }
    console.log(`arr: ${arr} - ${arr.toString()}`);

    // console.log(`crypted\t\t: ${crypted}`);
    console.log(`crypted\t\t: ${Buffer.byteLength(crypted, 'utf8')}`);

    // let extra_bytes = 0; //rand(0, 16);
    // for (let i = 0; i < extra_bytes; i++) {
    //     // crypted += chr(rand(0, 255));
    // }

    const result = bin2hex(crypted);
    console.log(`result\t\t: ${result}`);

    return result;
};

encode_password('password', '8ba0377025298612b8da6952a5457dbd', '');
