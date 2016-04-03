<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------
// $Id$

return [
    'url_route_on' => true,
    'log'          => [
        'type' => 'trace', // 支持 socket trace file
    ],
    'default_return_type'=>'json',
    'default_filter'=>'htmlspecialchars',
    'session'                => [
        'id'             => '',
        'var_session_id' => '',  // session_ID的提交变量,解决flash上传跨域
        'prefix'         => 'think',   // session 前缀
        'type'           => '',  // 驱动方式 支持redis memcache memcached
        'auto_start'     => false,  // 是否自动开启 session
    ],
];

