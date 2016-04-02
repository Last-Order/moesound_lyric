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
    public function info($id){
        return [
            'status'=>'success',
            'data'=>M('Lyrics')->where(['id'=>I('id')])->find()
        ];
    }

    /**
     * 获得未审核歌词列表
     */
    public function unchecked(){
        return [
            'status'=>'success',
            'data' =>M('Lyrics')->where(['status'=>0])->select()
        ];
    }

    /**
     * 审核歌词
     * @param $id
     * @return array
     */
    public function check($id){
        if (IS_POST /* && isLogin() */){
            if (I('id'))
            $result = M('Lyrics')->where(['id'=>I('ID')])->save(['status'=>'1']);
            if ($result){
                return ['status'=>'success','affected_rows'=>$result];
            }
            else{
                header("HTTP/1.0 403 Forbidden");
                return ['status'=>'failed','info'=>'Unauthorized action.'];
            }
        }
    }

    /**
     * 获得一条随机歌词
     * @return array
     */
    public function random(){
        return [
            'status' =>'success',
            'data' => M('Lyrics')->query('SELECT * FROM `lyrics` WHERE `status` = 1 ORDER BY RAND() LIMIT 1')
        ];
    }

    /**
     * 创建新歌词
     * @return array
     */
    public function create(){
        $Lyrics = M('Lyrics');
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
}
