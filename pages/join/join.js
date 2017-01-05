const AV = require('../../utils/av-weapp.js');
const user = AV.User.current();
var app = getApp()
Page({
    data: {
        loading: false,
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
    formSubmit: function(e) {
        var that = this
        that.setData({loading:true})
        console.log("user_id:"+user.id);
        console.log("kevent_id:"+that.data.kevent_id);
        console.log("memo:"+e.detail.value.memo);

        var targetKevent = AV.Object.createWithoutData('Kevent', that.data.kevent_id);
        
        var attendee = new AV.Object('Attendee');
        attendee.set('user', AV.User.current());
        attendee.set('memo', e.detail.value.memo);
        attendee.set('targetKevent', targetKevent);
        attendee.save().then(function() {
            targetKevent.increment('attendCount',1);
            targetKevent.fetchWhenSave(true);
            targetKevent.save();
        })
        .then( function() {
            that.setData({loading:false});
            wx.navigateBack();
        });
    }
})
