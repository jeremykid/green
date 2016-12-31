const AV = require('../../utils/av-weapp.js')
var app = getApp()
Page({
    data: {
        category_array: [],
        id: '',
        kevent: {},
        process: [],
    },
    onLoad: function (params) {
        this.setData({id: params.id, category_array: app.category_array})
    },
    onShow: function () {
        var that = this
        var now_time = new Date()
        const user = AV.User.current();
        new AV.Query('Kevent')
            .get(that.data.id)
            .then(kevent => that.setData({
                kevent:kevent,
                day_count: ((now_time - kevent.createdAt)/1000/3600/24|0)
            }))
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
