const AV = require('../../utils/av-weapp.js')
var util = require('../../utils/util.js')
var app = getApp()
Page({
    data: {
        category_array: [],
        my_kevents: [],
        lbs_kevents: [],
        userInfo: {},
        title: 'title',
        loading: false
    },
    onLoad: function () {
        var that = this
        const user = AV.User.current();
        wx.getUserInfo({
            success: ({userInfo}) => {
                // 更新当前用户的信息
                user.set(userInfo).save().then(user => {
                    // 成功，此时可在控制台中看到更新后的用户信息
                    app.globalData.user = user.toJSON();
                    console.log(app.globalData.user)
                }).then(that.setData({userInfo:user.toJSON(),category_array: app.category_array})
).catch(console.error);
            }
        });
    },
    onShow:function () {
        var that = this;
        new AV.Query('Kevent')
            .include('user')
            .equalTo('isDeleted',0)
            .greaterThan('expiredAt', new Date())            
            .descending('createdAt')
            .find()
            .then(function(kevents){
                var my_event_array = [];
                var lbs_event_array = [];
                for (var i=0; i<kevents.length; i++) {
                    if (kevents[i].get('user').id == AV.User.current().id) {
                        my_event_array.push({
                            'category':kevents[i].get('category'),
                            'objectId':kevents[i].get('objectId'),
                            'title':kevents[i].get('title'),
                            'count':kevents[i].get('count'),
                            'attendCount':kevents[i].get('attendCount'),
                            'createdAt':util.formatTime2(kevents[i].get('createdAt')),
                            'user_nickName':kevents[i].get('user').get('nickName')
                        });
                    } else {
                        lbs_event_array.push({
                            'category':kevents[i].get('category'),
                            'objectId':kevents[i].get('objectId'),
                            'title':kevents[i].get('title'),
                            'count':kevents[i].get('count'),
                            'attendCount':kevents[i].get('attendCount'),
                            'createdAt':util.formatTime2(kevents[i].get('createdAt')),
                            'user_nickName':kevents[i].get('user').get('nickName')
                        });
                    }
                }
                that.setData({ my_kevents: my_event_array, lbs_kevents: lbs_event_array })
            })
            .catch(console.error);
    },
})
