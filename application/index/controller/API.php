<?php
namespace app\index\controller;

use think\Controller;

class API extends Controller{
    public function index(){
        return ['test'=>'test'];
    }

    /**
     * 获得指定id歌词的详细信息
     * @param $id
     * @return mixed
     */
    public function info(){
        $Lyrics = D('Lyrics');
        $result = $Lyrics->where(['id'=>I('id')])->find();
        if ($result){
            if ($result['status'] == 1){
                return [
                    'status'=>'success',
                    'data'=> $result
                ];
            }
            else if (I('token') && checkToken(I('token'))){
                // 登录用户可以获取未审核、删除的歌词详情
                return [
                    'status'=>'success',
                    'data'=> $result
                ];
            }
            else{
                header("X-Powered-By:Misaka Network/1.0", true, 404);
                return [
                    'status' => 'fail',
                    'info' => 'Lyric not found.'
                ];
            }
        }
        else{
            header("X-Powered-By:Misaka Network/1.0", true, 404);
            return [
                'status' => 'fail',
                'info' => 'Lyric not found.'
            ];
        }
    }

    /**
     * 获得未审核歌词列表
     */
    public function unchecked(){
        return [
            'status'=>'success',
            'data' =>D('Lyrics')->where(['status'=>0])->select()
        ];
    }

    /**
     * 审核歌词
     * @param $id
     * @return array
     */
    public function check(){
        if (IS_POST){
            if (I('token') && checkToken(I('token'))){
                if (I('id')){
                    $Lyrics = D('Lyrics');
                    $result = $Lyrics->where(['id'=>I('id')])->save(['status'=>'1']);
                    if ($result){
                        return ['status'=>'success','affected_rows'=>$result];
                    }
                }
                else{
                    header("X-Custom-Header", true, 400);
                    return ['status'=>'failed','info'=>'Parameter Missed'];
                }
            }
            else{
                header("X-Powered-By:Misaka Network/1.0", true, 403);
                return [
                    'status' => 'fail',
                    'info' => 'Invalid token.'
                ];
            }
        }
        else{
            header("X-Powered-By:Misaka Network/1.0", true, 405);
            return [
                'status' => 'fail',
                'info' => 'POST!POST!POST!Baka!'
            ];
        }
    }

    /**
     * 获得一条随机歌词
     * @return array
     */
    public function random(){
        return [
            'status' =>'success',
            'data' => D('Lyrics')->query('SELECT * FROM `lyrics` WHERE `status` = 1 ORDER BY RAND() LIMIT 1')
        ];
    }

    /**
     * 创建新歌词
     * @return array
     */
    public function create(){
        if (IS_POST){
            $Lyrics = D('Lyrics');
            if (I('email') && I('origin') && I('translated') && I('song') && I('artist') && I('lyricist')){
                $Lyrics->auto([
                    'status'=> 0
                ])->create();
                $result = $Lyrics->add();
                if ($result){
                    return [
                        'status'=>'success'
                    ];
                }
                else{
                    return [
                        'status'=>'fail'
                    ];
                }
            }
            else{
                header("X-Powered-By:Misaka Network/1.0", true, 400);
                return [
                    'status' => 'fail',
                    'info' => 'Parameter missed.'
                ];
            }
        }
        else{
            header("X-Powered-By:Misaka Network/1.0", true, 405);
            return [
                'status' => 'fail',
                'info' => 'POST!POST!POST!Baka!'
            ];
        }
    }

    /**
     * 登录
     * @return array
     */
    public function login(){
        if (!IS_POST){
            header("X-Powered-By:Misaka Network/1.0", true, 405);
            return [
                'status' => 'fail',
                'info' => 'POST!POST!POST!Baka!'
            ];
        }
        else{
            $email = I('email');
            $password = encrypt(I('password'));
            $User = D('User');
            $result = $User->where([
                'email' => $email,
                'password' => $password
            ])->find();
            if ($result){
                // 登录成功 设置Session
                session_start();
                $_SESSION['email'] = $email;
                $_SESSION['is_login'] = true;
                return [
                    'status' => 'success',
                    'token' => session_id()
                ];
            }
            else{
                return [
                    'status' => 'fail',
                    'info' => 'Unmatched email and password.'
                ];
            }
        }
    }


    
}
