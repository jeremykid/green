const AV = require('../../utils/av-weapp.js')
var app = getApp()
Page({
    data: {
        category_array: [],
        kevents: [],
        userInfo: {},
        title: 'title',
        loading: false
    },
    onLoad: function () {
        var that = this
        const user = AV.User.current();
        that.setData({userInfo:user.toJSON(),category_array: app.category_array})
    },
    onShow:function () {
        var that = this;
        new AV.Query('Kevent')
            .equalTo('isDeleted',0)
            .descending('createdAt')
            .find()
            .then(kevents => that.setData({ kevents: format_time(kevents) }))
            .catch(console.error);
    },
})

function format_time(kevents) {
    var now_time = new Date();
    for (var x in kevents) {
        var interval = (now_time - kevents[x].createdAt)/1000;
        if (interval < 60) {
            kevents[x].createdAt = "刚刚";
        } else if (interval < 3600) {
            kevents[x].createdAt = (interval/60|0)+"分钟前";

        } else if (kevents[x].createdAt.toDateString() == now_time.toDateString()) {
            kevents[x].createdAt = "今天"+kevents[x].createdAt.getHours()+":"+(kevents[x].createdAt.getMinutes()<10?'0':'')+kevents[x].createdAt.getMinutes();
        } else if (kevents[x].createdAt.getFullYear() == now_time.getFullYear()){
            kevents[x].createdAt = (kevents[x].createdAt.getMonth()+1)+"-"+kevents[x].createdAt.getDate()
        } else {
            kevents[x].createdAt = kevents[x].createdAt.getFullYear()+"-"+(kevents[x].createdAt.getMonth()+1)+"-"+kevents[x].createdAt.getDate()
        }
        console.log(kevents[x])
    }
    return kevents
}
