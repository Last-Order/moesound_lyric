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
DetailPage.prototype.updateById = function(id, callback) {
    callback = callback || function() { };

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
            callback();
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
function UserInfo() {
    this.user = {
        _is_login: false,
        _token: "",
        _name: "",
        get token() {
            if (this._token != "") {
                return this._token;
            } else {
                var token = localStorage.getItem("token");
                if (token != null && token.length > 0) {
                    return token;
                } else {
                    return "";
                }
            }
        },
        set token(value) {
            localStorage.setItem("token", value);
            this._token = value;
        },
        get name() {
            if (this._name != "") {
                return this._name;
            } else {
                var name = localStorage.getItem("name");
                if (name != null && name.length > 0) {
                    return name;
                } else {
                    return "";
                }
            }
        },
        set name(value) {
            localStorage.setItem("name", value);
            this._name = value;
        },
        get is_login() {
            if (this._is_login != "") {
                return this._is_login;
            } else {
                var is_login = localStorage.getItem("is_login");
                if (is_login != null && is_login.length > 0) {
                    return is_login == "true";
                } else {
                    return false;
                }
            }
        },
        set is_login(value) {
            localStorage.setItem("is_login", value);
            this._is_login = value;
        },
    }
}
function CheckPage() {
    this.checkList = [];
    this.getUnchecked();
}
CheckPage.prototype.getUnchecked = function() {
    var self = this;
    if (userInfo.user.is_login) {
        $.ajax({
            url: apiUrl + "/unchecked",
            type: "get",
            data: {
                token: userInfo.user.token
            },
            dataType: "json",
            success: function(data) {
                var list = data.data;
                for (var i in list) {
                    self.checkList.push(new Lyric(list[i]));
                }
            },
            error: function(xhr, error, obj) {
                if (xhr.responseText.length > 0) {
                    try {
                        var data = JSON.parse(xhr.responseText);
                        modal("发生了错误" + xhr.status + "：<br>" + data.info, "拉取列表失败");
                    } catch (err) {
                        modal("服务器出现错误：" + xhr.status + "：<br>" + error + "<br>" + err, "拉取列表失败");
                    }
                } else {
                    modal("发生了错误" + xhr.status + "：<br>" + error, "拉取列表失败");
                }
            }
        });
    } else {
        console.error("需要登录。");
    }
}
CheckPage.prototype.deleteId = function(id) {
    if (userInfo.user.is_login) {
        for (var i in this.checkList) {
            if (this.checkList[i].id == id) {
                this.checkList.splice(i, 1);
                return;
            }
        }
    } else {
        console.error("需要登录。");
    }
}
CheckPage.prototype.getReason = function(id) {
    if (userInfo.user.is_login) {
        for (var i in this.checkList) {
            if (this.checkList[i].id == id) {
                return this.checkList[i].reason;
            }
        }
    } else {
        console.error("需要登录。");
    }
}
CheckPage.prototype.check = function(id) {
    var self = this;
    if (userInfo.user.is_login) {
        $.ajax({
            url: apiUrl + "/check",
            type: "post",
            data: {
                token: userInfo.user.token,
                id: id
            },
            dataType: "json",
            success: function(data) {
                self.deleteId(id);
            },
            error: function(xhr, error, obj) {
                if (xhr.responseText.length > 0) {
                    try {
                        var data = JSON.parse(xhr.responseText);
                        modal("发生了错误" + xhr.status + "：<br>" + data.info, "审核通过请求失败");
                    } catch (err) {
                        modal("服务器出现错误：" + xhr.status + "：<br>" + error + "<br>" + err, "审核通过请求失败");
                    }
                } else {
                    modal("发生了错误" + xhr.status + "：<br>" + error, "审核通过请求失败");
                }
            }
        });
    } else {
        console.error("需要登录。");
    }
}
CheckPage.prototype.reject = function(id) {
    var self = this;
    if (userInfo.user.is_login) {
        var reason = this.getReason(id);
        $.ajax({
            url: apiUrl + "/reject",
            type: "post",
            data: {
                token: userInfo.user.token,
                id: id,
                reason: reason
            },
            dataType: "json",
            success: function(data) {
                self.deleteId(id);
            },
            error: function(xhr, error, obj) {
                if (xhr.responseText.length > 0) {
                    try {
                        var data = JSON.parse(xhr.responseText);
                        modal("发生了错误" + xhr.status + "：<br>" + data.info, "审核拒绝请求失败");
                    } catch (err) {
                        modal("服务器出现错误：" + xhr.status + "：<br>" + error + "<br>" + err, "审核拒绝请求失败");
                    }
                } else {
                    modal("发生了错误" + xhr.status + "：<br>" + error, "审核拒绝请求失败");
                }
            }
        });
    } else {
        console.error("需要登录。");
    }
}