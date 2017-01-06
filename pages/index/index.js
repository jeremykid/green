const AV = require('../../utils/av-weapp.js')
var util = require('../../utils/util.js')
var app = getApp()
Page({
    data: {
        category_array: [],
        my_kevents: [],
        attended_kevents: [],
        lbs_kevents: [],
        userInfo: {},
        title: 'title',
        loading: false,
        loading_count: 2,
        my_kevents_count: 0,
        my_attended_count: 0,
        xiaoyu: '<<'
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
        that.setData({loading:true, loading_count:2});
        var my_kevents_query = new AV.Query('Kevent');
        my_kevents_query.equalTo('user', AV.User.current());

        var lbs_kevents_query = new AV.Query('Kevent');
        lbs_kevents_query.equalTo('isDeleted',0).greaterThan('expiredAt', new Date());

        new AV.Query('Kevent')
            .equalTo('isDeleted',0)//.greaterThan('expiredAt', new Date())
            .include('user')         
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
                that.setData({ my_kevents: my_event_array, lbs_kevents: lbs_event_array, my_kevents_count: my_event_array.length })
                that.data.loading_count = that.data.loading_count - 1
                if (that.data.loading_count < 1) {that.setData({loading: false})}
            })
            .catch(function(error){
                console.error;that.setData({loading:false})
            });

        new AV.Query('Attendee')
            .equalTo('user', AV.User.current())
            .include('targetKevent')
            .descending('createdAt')
            .find()
            .then(function(attendees) {
                console.log("length:"+attendees.length);
                var attended_event_array = [];
                for(var i=0; i<attendees.length; i++) {
                    console.log("my.....123...:"+attended_event_array.length+"i:"+i)

                    if (attendees[i].get('targetKevent')) {
                        attended_event_array.push({
                            'category':attendees[i].get('targetKevent').get('category'),
                            'objectId':attendees[i].get('targetKevent').get('objectId'),
                            'title':attendees[i].get('targetKevent').get('title'),
                            'count':attendees[i].get('targetKevent').get('count'),
                            'attendCount':attendees[i].get('targetKevent').get('attendCount'),
                            'createdAt':util.formatTime2(attendees[i].get('targetKevent').get('createdAt')),
                            'user_nickName':attendees[i].get('targetKevent').get('user').get('nickName')
                        });
                    } else {
                        //attended_event_array.push({
                        //    'objectId':attendees[i].get('targetKevent')
                        //})
                    }
                }
                console.log("my2........:"+attended_event_array.length);

                that.setData({ 
                    attended_kevents: attended_event_array, 
                    my_attended_count: 10
                });
                that.data.loading_count = that.data.loading_count - 1;
                
                if (that.data.loading_count < 1) {that.setData({loading: false})}
            })
            .catch(function(error){
                console.error;that.setData({loading:false})
            });
    },
})
