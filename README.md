# ALyric

ALyric http://lyric.moesound.org/

ALyric 是一个可以和大家分享歌词的网站。

ALyric 支持将歌词以单句的形式展示，并提供了API，可以在第三方网站展示。

## API 说明

API 默认返回 JSON 格式的数据，支持跨域调用。

### 获得一条随机歌词

调用地址：`http://lyric.moesound.org/Api/random`

**成功返回示例**

```JavaScript
{
    "status" : "success",
    "data"   : [
        {
            "id": "233", // 歌词ID
            "origin" : "いまはいまの楽しさで はしゃぎたいなみんなと", // 歌词原文
            "translated" : "当下只想和大家 在现在的快乐中一起嬉戏呢", // 歌词翻译
            "song" : "さようならへさよなら! ", // 出自歌曲
            "artist" : "μ's", // 歌手
            "lyricist" : "畑亜貴", // 作词
            "status" : 1, // 审核状态 0 未审核 1 已审核 450 已删除
            "email" : "test@test.com" // 提交者Email
        }
    ]
}
```
**错误返回示例**

```JavaScript
{
    "status" : "fail",
    "info" : "" // 错误详细信息
}
```

### 获得指定 ID 歌词的详细信息

调用地址：`http://lyric.moesound.org/Api/info`

调用方式：GET

**调用参数**

| 参数名 | 参数值类型 | 说明 |
|--------|-----------|--------|
| id     |  int      | 歌词 ID  |


**成功返回示例**

```JavaScript
{
    "status" : "success",
    "data"   : [
        {
            "id": "233", // 歌词ID
            "origin" : "いまはいまの楽しさで はしゃぎたいなみんなと", // 歌词原文
            "translated" : "当下只想和大家 在现在的快乐中一起嬉戏呢", // 歌词翻译
            "song" : "さようならへさよなら! ", // 出自歌曲
            "artist" : "μ's", // 歌手
            "lyricist" : "畑亜貴", // 作词
            "status" : 1, // 审核状态 0 未审核 1 已审核 450 已删除
            "email" : "test@test.com" // 提交者Email
        }
    ]
}
```

**错误返回示例**

```JavaScript
{
    "status" : "fail",
    "info" : "" // 错误详细信息
}
```
