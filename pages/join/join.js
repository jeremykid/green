const AV = require('../../utils/av-weapp.js');
const user = AV.User.current();
var app = getApp()
Page({
    data: {
        memo_string: '',
        kevent_id: '',
        user_id: '',
    },
    onLoad: function(params) {
        var that = this;
        if (params.kevent_id) {
            console.log(params.kevent_id);
        }
    },
    onShow: function() {
        console.log(user.id);
    }
})
