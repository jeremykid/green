const AV = require('../../utils/av-weapp.js');
const user = AV.User.current();
var app = getApp()
Page({
    data: {
        memo_string: '',
        kevent_id: '',
    },
    onLoad: function(params) {
        var that = this;
        if (params.kevent_id) {
            that.setData({kevent_id: params.kevent_id})
        }
    },
    onShow: function() {
        //console.log(user.id);
    },
    formSubmit: function() {
        var that = this
        console.log("user_id:"+user.id);
        console.log("kevent_id:"+that.data.kevent_id);
    }
})
