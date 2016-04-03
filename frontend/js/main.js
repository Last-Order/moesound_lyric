var randomLyric = new RandomLyric();
var detailPage = new DetailPage();
var submitPage = new SubmitPage();
var userInfo = new UserInfo();
$(function() {
    $.material.init();
    //注册组件
    //首页
    Vue.directive('on').keyCodes.f7 = 118;
    var randomBar = Vue.extend({
        template: '#xtpl-random',
        data: function() {
            return randomLyric.lyric;
        }
    });
    var mainContent = Vue.extend({
        template: '#xtpl-maincontent'
    });
    Vue.component('random', randomBar);
    Vue.component('main-content', mainContent);
    var mainApp = Vue.extend({
        template: '<div><random></random><main-content></main-content></div>',
        route: {
            data: function() {
                randomLyric.random();
            }
        }
    });
    //详情页
    var detail = Vue.extend({
        template: '#xtpl-detail',
        data: function() {
            return detailPage.lyric;
        },
        route: {
            data: function() {
                var detailId = this.$route.params.id;
                detailPage.updateById(detailId, function() {
                    buildDuoshuoCommentBox(detailId);
                });
            }
        }
    });
    //投稿
    var post = Vue.extend({
        template: '#xtpl-post',
        data: function() {
            return submitPage;
        },
        methods: {
            dosubmit: function() {
                submitPage.submit();
            }
        }
    });
    //API文档
    var getApi = Vue.extend({
        template: '#xtpl-getapi'
    });
    //审核
    var check = Vue.extend({
        template: "#xtpl-check",
        data: function() {
            if (userInfo.user.is_login) {
                var checkPage = new CheckPage();
                window.checkPage = checkPage;
                return checkPage;
            } else {
                return { checkList: [{ "origin": "ERROR!" }] };
            }
        },
        route: {
            canActivate: function(transition) {
                if (userInfo.user.is_login) {
                    transition.next();
                } else {
                    transition.abort();
                }
            }
        },
        methods: {
            check: function(event){
                var id = $(event.target).data('id');
                this.$data.check(id);
            },
            reject: function(event){
                var id = $(event.target).data('id');
                this.$data.reject(id);
            }
        }
    });
    //登录
    var loginDialog = Vue.extend({
        template: "#xtpl-login",
        data: function() {
            var storagedEmail = localStorage.getItem('email');
            var email = "";
            if (storagedEmail != null) {
                email = storagedEmail;
            }
            return {
                "is_login": userInfo.user.is_login,
                "email": email,
                "password": "",
            }
        },
        methods: {
            dologin: function() {
                var email = this.email;
                $.ajax({
                    url: apiUrl + "/login",
                    type: "post",
                    data: {
                        email: email,
                        password: this.password
                    },
                    dataType: "json",
                    success: function(data) {
                        modal("登录成功", "登录成功");
                        localStorage.setItem('email', email);
                        userInfo.user.token = data.token;
                        userInfo.user.name = data.nickname;
                        userInfo.user.is_login = true;
                        router.go('/');
                    },
                    error: function(xhr, error, obj) {
                        if (xhr.responseText.length > 0) {
                            try {
                                var data = JSON.parse(xhr.responseText);
                                modal("发生了错误" + xhr.status + "：<br>" + data.info, "登录失败");
                            } catch (err) {
                                modal("服务器出现错误：" + xhr.status + "：<br>" + error + "<br>" + err, "登录失败");
                            }
                        } else {
                            modal("发生了错误" + xhr.status + "：<br>" + error, "登录失败");
                        }
                    }
                });
            },
            logout: function() {
                userInfo.user.is_login = false;
                userInfo.user.name = "";
                userInfo.user.token = "";
            }
        }
    });
    Vue.component('login-dialog', loginDialog);
    var App = Vue.extend({
        data: function() {
            return userInfo.user;
        },
        methods: {
            random: function() {
                randomLyric.random();
            },
            randomPage: function() {
                detailPage.updateRandom();
            }
        }
    });
    var router = new VueRouter({
        history: true
    });
    router.map({
        '/': {
            component: mainApp
        },
        '/detail/:id': {
            name: "detail",
            component: detail
        },
        '/post': {
            component: post
        },
        '/getapi': {
            component: getApi
        },
        '/check': {
            component: check
        }
    });
    //键盘事件绑定
    $(document).on("keydown", function(event) {
        var keyid = event.which;
        //F7
        if (keyid == 118) {
            modal("<div id=\"login-f\"><login-dialog></login-dialog></div>", "登录", {
                oncreated: function() {
                    new Vue({
                        el: "#login-f"
                    });
                }
            });
        }
    })
    router.start(App, '#app');
    window.router = router;
});

//弹出框
function modal(content, title, option) {
    option = option || {};
    var suicide = option.suicide || false;
    var oncreated = option.oncreated || function() { };
    var callback = option.callback || function() { };

    $("#modal-content").html(content);
    $("#modal-title").html(title);

    if (option.type == "okcancel") {
        $("#modal-closebtn").hide();
        $("#modal-okbtn").show();
        $("#modal-cancelbtn").show();
        $("#modal-okbtn").on("click", function() {
            callback();
            $("#modal-okbtn").unbind();
            $("#modal").modal('hide');
        })
    } else if (option.type == "ok") {
        $("#modal-closebtn").hide();
        $("#modal-okbtn").show();
        $("#modal-cancelbtn").hide();
        $("#modal-okbtn").on("click", function() {
            if (callback() === false) return false;
            $("#modal-okbtn").unbind();
            $("#modal").modal('hide');
        })
    } else {
        $("#modal-closebtn").show();
        $("#modal-okbtn").hide();
        $("#modal-cancelbtn").hide();
    }

    $("#modal").modal();
    $("#modal").on("hidden.bs.modal", function() {
        $("#modal-okbtn").unbind();
        if (suicide) {
            callback();
        }
    });
    oncreated();
}
window.modal = modal;

//建立多说评论框
function buildDuoshuoCommentBox(id) {
    var el = document.createElement('div');
    el.setAttribute('data-thread-key', id);
    el.setAttribute('data-url', 'http://lyric.moesound.org/detail/' + id);
    DUOSHUO.EmbedThread(el);
    $("#comment-box").html(el);
}