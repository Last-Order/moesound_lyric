<?php
\think\Route::bind('module','index');
// 主摘要函数
function encrypt($string){
    $salt1 = '166C:)<|{FfFFff2016=+-E172(╯‵□′)╯︵┻━┻62B54##20152014@_@:)166C666';
    $salt2 = 'KashikoiKawaiiErichika' . crc32($string);
    return md5(md5($salt1 . $string . strrev($string) . $salt2));
}
/**
 * 验证Token有效性
 * @param $token
 * @return bool
 */
function checkToken($token){
    session_id($token);
    session_start();
    return isset($_SESSION['is_login']) ? true : false;
}

function sendPassMail($mail, $id){
    $url = 'http://sendcloud.sohu.com/webapi/mail.send_template.json';
    $params = [
        'api_user' => ''
    ];
}