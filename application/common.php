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

/**
 * 发送审核通过通知
 * @param $mail
 * @param $lyric
 * @param $id
 * @return string
 */
function sendPassMail($mail, $lyric, $id){
    $url = 'http://sendcloud.sohu.com/webapi/mail.send.json';
    $params = [
        'api_user' => 'lyric_system',
        'api_key'  => 'APIKEY',
        'from'     => 'no-reply@system.moesound.org',
        'to' => $mail,
        'subject' => 'ALyric 审核通过通知',
        'html' => '<p>感谢您为 ALyric 提交歌词。</p>

                    <p>您提交的歌词 “' . $lyric . '” 已经通过审核，您可以&nbsp;<a href="http://lyric.moesound.org/detail/' . $id .'">点击此链接</a>&nbsp;查看详情。</p>
                    
                    <p>本邮件由系统自动发送，请勿直接回复本邮件。</p>
                    
                    <hr />               
                    <p>ALyric - Project Moesound</p>
                    ',
        'fromname' => 'ALyric'
    ];
    $options = array('http' => array('method'  => 'POST','content' => http_build_query($params)));
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    return $result;
}
/**
 * 发送审核未通过通知
 * @param $mail
 * @param $lyric
 * @param $id
 * @return string
 */
function sendNotPassMail($mail, $lyric, $reason){
    $url = 'http://sendcloud.sohu.com/webapi/mail.send.json';
    $params = [
        'api_user' => 'lyric_system',
        'api_key'  => 'APIKEY',
        'from'     => 'no-reply@system.moesound.org',
        'to' => $mail,
        'subject' => 'ALyric 审核未通过通知',
        'html' => '<p>感谢您为 ALyric 提交歌词。</p>

        <p>很抱歉，您提交的歌词 &ldquo;' . $lyric . '&rdquo; 由于' . $reason . '未通过审核。</p>

        <p>欢迎您再次提交，如有任何疑问请邮件联系<a href="mailto:help@moesound.org">help@moesound.org</a>。</p>

        <p>本邮件由系统自动发送，请勿直接回复本邮件。</p>

        <hr />
        <p>ALyric - Project Moesound</p>
        ',
        'fromname' => 'ALyric'
    ];
    $options = [
        'http' => [
            'method'  => 'POST',
            'content' => http_build_query($params),
            'header' =>  "Content-Type: application/x-www-form-urlencoded"
        ]
    ];
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    return $result;
}