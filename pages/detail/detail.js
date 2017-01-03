const AV = require('../../utils/av-weapp.js')
var util = require('../../utils/util.js')
var app = getApp()
Page({
    data: {
        category_array: [],
        id: '',
        kevent: {},
        process: [],
        attendees: [],
        loginUser: {},
        expiredAt: {}
    },
    onLoad: function (params) {
        this.setData({id: params.id, category_array: app.category_array})
    },
    onShow: function () {
        var that = this
        var now_time = new Date()
        const loginUser = AV.User.current();         
        
        console.log("loginuser:"+loginUser.id);        

        new AV.Query('Kevent')
            .get(that.data.id)
            .then(kevent => that.setData({                
                kevent:kevent,
                loginUser:loginUser,
                day_count: ((now_time - kevent.createdAt)/1000/3600/24|0),                                     expiredAt: util.formatTime(kevent.get("expiredAt"))
            }))
            .then(function(){
                console.log("kevent_user:"+that.data.kevent.get('user').get('objectId'));     
                console.log("kevent_expiredAt:"+that.data.kevent.get('expiredAt'));
                console.log("kevent_createdAt:"+that.data.kevent.get('createdAt'));
                var query = new AV.Query('Attendee');
                query.include('user');
                query.equalTo('targetKevent', that.data.kevent);
                query.descending('createdAt');
                query.find().then(function(attendees) {
                    var attendee_array = [];
                    for (var i=0; i<attendees.length; i++) {
                        attendee_array.push({
                            'memo': attendees[i].get('memo'),
                            'createdAt': util.formatTime2(attendees[i].get('createdAt')),
                            'user': {
                                'nickName': attendees[i].get('user').get('nickName'),
                                'avatarUrl': attendees[i].get('user').get('avatarUrl'),
                            }
                        });
                        console.log(attendees[i].get('user').get('avatarUrl'));
                    }
                    that.setData({
                        attendees: attendee_array
                    });
                });
            })
            .catch(console.error);
    },
    tapDelete: function () {
        var that = this
        var kevent = AV.Object.createWithoutData('Kevent',that.data.kevent.id);
        kevent.set('isDeleted',1);
        kevent.save().then(
            wx.showToast({
                title: '已删除',
                icon: 'success',
                duration: 800
            })
        ).then(wx.navigateBack())
    },
    tapEdit: function() {
        //var that = this;
        console.log('tapEdit');
        wx.navigateTo({url:"/pages/publisher/publisher?id="+this.data.kevent.id});
    },
    tapJoin: function() {
        //var that= this;
        console.log('tapJoin');
        wx.navigateTo({url:"/pages/join/join?kevent_id="+this.data.kevent.id})
    }
})
