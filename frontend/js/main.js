var randomLyric = new RandomLyric();
var detailPage = new DetailPage();
var submitPage = new SubmitPage();
$(function() {
    $.material.init();
    //注册组件
    //首页
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
        template: '#xtpl-getapi',
    });
    var App = Vue.extend({
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
        }
    });
    router.start(App, '#app');
    window.router = router;
});

//弹出框
function modal(content, title, option) {
    option = option || {};
    var suicide = option.suicide || false;
    var callback = option.callback || function() { }

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