<?php

    /* http://sandbox.onlinephpfunctions.com/ */

// $array = array("1" => "PHP code tester Sandbox Online",
//               "foo" => "bar", 5 , 5 => 89009,
//               "case" => "Random Stuff: " . rand(100,999),
//               "PHP Version" => phpversion()
//               );

// foreach( $array as $key => $value ){
//     echo $key."\t=>\t".$value."\n";
// }

echo encode_password('password', '8ba0377025298612b8da6952a5457dbd', '');

function encode_password($plain, $challenge, $secret) {

    echo "\npassword\t: ".$plain;
    echo "\nchallenge\t: ".$challenge;
    echo "\nsecret\t\t: ".$secret;

    if ((strlen($challenge) % 2) != 0 ||
        strlen($challenge) == 0)
        return FALSE;

    $hexchall = hex2bin($challenge);

    echo "\nhex\t\t\t: ".$hexchall;

    if ($hexchall === FALSE)
        return FALSE;

    if (strlen($secret) > 0) {
        $crypt_secret = md5($hexchall . $secret, TRUE);
        $len_secret = 16;
    } else {
        $crypt_secret = $hexchall;
        $len_secret = strlen($hexchall);
    }

    echo "\ncrypt_secret\t: ".$crypt_secret;
    echo "\nlen_secret\t: ".$len_secret;

    /* simulate C style \0 terminated string */
    $plain .= "\x00";
    $crypted = '';
    for ($i = 0; $i < strlen($plain); $i++)
        $crypted .= $plain[$i] ^ $crypt_secret[$i % $len_secret];

    echo "\ncrypted\t\t: ".$crypted;

    $extra_bytes = 0;//rand(0, 16);
    for ($i = 0; $i < $extra_bytes; $i++)
        $crypted .= chr(rand(0, 255));

    echo "\ncrypted2\t\t: ".$crypted;

    $result = bin2hex($crypted);

    echo "\nresult\t\t: ".$result;

    return $result;
}
