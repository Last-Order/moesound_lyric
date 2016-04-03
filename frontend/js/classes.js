var apiUrl = "http://127.0.0.1/api";
function Lyric(data) {
    this.id = data.id;
    this.origin = data.origin;
    this.translated = data.translated;
    this.song = data.song;
    this.artist = data.artist;
    this.lyricist = data.lyricist;
}
Lyric.prototype.update = function(data) {
    this.id = data.id;
    this.origin = data.origin;
    this.translated = data.translated;
    this.song = data.song;
    this.artist = data.artist;
    this.lyricist = data.lyricist;
}
function RandomLyric() {
    this.lyric = new Lyric({});
}
RandomLyric.prototype.random = function() {
    var self = this;
    $.getJSON(apiUrl + "/random", {}, function(data) {
        var songLyric = data.data[0];
        self.lyric.update(songLyric);
    })
}
function DetailPage() {
    this.lyric = new Lyric({});
}
DetailPage.prototype.updateById = function(id) {
    var self = this;
    $.ajax({
        url: apiUrl + "/info",
        type: "get",
        data: {
            id: id
        },
        dataType: "json",
        success: function(data) {
            var songLyric = data.data;
            self.lyric.update(songLyric);
        },
        error: function(xhr, error, obj) {
            if (xhr.responseText.length > 0) {
                try {
                    var data = JSON.parse(xhr.responseText);
                    self.lyric.update({
                        id: -1,
                        origin: xhr.status,
                        translated: data.info,
                        song: "ERROR",
                        artist: "ERROR",
                        lyricist: "ERROR"
                    });
                } catch (err) {
                    alert("服务器出现错误。" + err);
                    window.location.href = '/';
                }
            } else {
                self.lyric.update({
                    id: -1,
                    origin: xhr.status,
                    translated: "",
                    song: "ERROR",
                    artist: "ERROR",
                    lyricist: "ERROR"
                });
            }
        }
    });
}
DetailPage.prototype.updateRandom = function() {
    var self = this;
    $.getJSON(apiUrl + "/random", {}, function(data) {
        var songLyric = data.data[0];
        self.lyric.update(songLyric);
        router.go({
            name: "detail",
            params: {
                id: songLyric.id
            }
        });
    });
}
function SubmitPage() {
    var storagedEmail = localStorage.getItem('email');
    if (storagedEmail != null) {
        this.email = storagedEmail;
    } else {
        this.email = "";
    }
    this.origin = "";
    this.translated = "";
    this.song = "";
    this.artist = "";
    this.lyricist = "";
}
SubmitPage.prototype.submit = function() {
    var requires = [];
    var self = this;
    var reason = {
        'email': "Email",
        'song': "出处",
        'lyricist': "作词",
        'artist': "歌手",
        'origin': "歌词"
    };
    ['email', 'origin', 'song', 'artist', 'lyricist'].map(function(i) {
        if (self[i] == "") {
            requires.push(reason[i] + " 是必填的。");
        }
    });

    if (requires.length > 0) {
        modal("<p>发现 " + requires.length + " 个错误，请修改后重试：</p><p>" + requires.join("<br>") + "</p>", "提交");
    } else {
        $.ajax({
            url: apiUrl + "/create",
            type: "post",
            data: {
                email: this.email,
                origin: this.origin,
                translated: this.translated,
                song: this.song,
                artist: this.artist,
                lyricist: this.lyricist
            },
            dataType: "json",
            success: function(data) {
                modal("感谢您的提交。审核通过后会以邮件的形式通知您。", "提交成功");
                localStorage.setItem('eamil', this.email);
                this.origin = "";
                this.translated = "";
                this.song = "";
                this.artist = "";
                this.lyricist = "";
                router.go('/');
            },
            error: function(xhr, error, obj) {
                if (xhr.responseText.length > 0) {
                    try {
                        var data = JSON.parse(xhr.responseText);
                        modal("发生了错误" + xhr.status + "：<br>" + data.info, "提交失败");
                    } catch (err) {
                        modal("服务器出现错误：" + xhr.status + "：<br>" + error + "<br>" + err, "提交失败");
                    }
                } else {
                    modal("发生了错误" + xhr.status + "：<br>" + error, "提交失败");
                }
            }
        });
    }
}