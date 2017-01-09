const AV = require('../../utils/av-weapp.js')
var util = require('../../utils/util.js')
var app = getApp()
const LONGITUDE_RANGE = 10
const LATITUDE_RANGE = 20
Page({
    data: {
        category_array: [],
        my_kevents: [],
        attended_kevents: [],
        nearby_kevents: [],
        userInfo: {},
        title: 'title',
        loading: false,
        loading_count: 3,
        my_kevents_count: 0,
        my_attended_count: 0,
        nearby_kevents_count: 0,
        xiaoyu: '<<',        
        hasLocation:false,
        location:{}
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

        //这里查附近的局        
        wx.getLocation({
            success: function( res ) {
                console.log( res )
                that.setData({
                    hasLocation: true,
                    location: {
                        longitude: res.longitude,
                        latitude: res.latitude
                    }
                })
                that.fetchNearbyKevents(res.longitude, res.latitude)                
            }
        });
               
    },
    onShow:function () {        
        var that = this;
        that.setData({loading:true, loading_count:3});                                              

        that.fetchNearbyKevents(that.data.location.longitude, that.data.location.latitude)

        //这里是查自己开的局
        new AV.Query('Kevent') 
            .equalTo('isDeleted',0)//.greaterThan('expiredAt', new Date())
            .equalTo('user', AV.User.current())
            .include('user')         
            .descending('createdAt')
            .find()
            .then(function(kevents){
                var my_event_array = [];
                var lbs_event_array = [];
                for (var i=0; i<kevents.length; i++) {
                    my_event_array.push({
                        'category':kevents[i].get('category'),
                        'objectId':kevents[i].get('objectId'),
                        'title':kevents[i].get('title'),
                        'count':kevents[i].get('count'),
                        'attendCount':kevents[i].get('attendCount'),
                        'createdAt':util.formatTime2(kevents[i].get('createdAt')),
                        'expiredAt':util.formatTime3(kevents[i].get('expiredAt')),
                        'user_nickName':kevents[i].get('user').get('nickName'),
                        'user_avatarUrl':kevents[i].get('user').get('avatarUrl')
                    });
                }
                that.setData({ my_kevents: my_event_array, my_kevents_count: my_event_array.length, loading_count: that.data.loading_count-1 })
                if (that.data.loading_count < 1) {that.setData({loading: false})}
            })
            .catch(function(error){
                console.error;that.setData({loading:false})
            });        

        //这里查参加的局
        new AV.Query('Attendee') 
            .equalTo('user', AV.User.current())
            .include('targetKevent')
            .include('targetKevent.user')
            .descending('createdAt')
            .find()
            .then(function(attendees) {
                console.log("attended events count:"+attendees.length);
                var attended_event_array = [];
                for(var i=0; i<attendees.length; i++) {
                    if (attendees[i].get('targetKevent')) { //要考虑活动被原主人删除
                        attended_event_array.push({
                            'category':attendees[i].get('targetKevent').get('category'),
                            'objectId':attendees[i].get('targetKevent').get('objectId'),
                            'title':attendees[i].get('targetKevent').get('title'),
                            'count':attendees[i].get('targetKevent').get('count'),
                            'attendCount':attendees[i].get('targetKevent').get('attendCount'),
                            'createdAt':util.formatTime2(attendees[i].get('targetKevent').get('createdAt')),
                            'expiredAt':util.formatTime3(attendees[i].get('targetKevent').get('expiredAt')),
                            'user_nickName':attendees[i].get('targetKevent').get('user').get('nickName'),
                            'user_avatarUrl':attendees[i].get('targetKevent').get('user').get('avatarUrl'),
                            'isDeleted':attendees[i].get('targetKevent').get('isDeleted')
                        });
                    } else {
                        //这里要不要给删除的Kevent补充告知。。。。
                        //好像不会哈，因为Kevent不会真正删除，只会给isDeleted设置为1
                    }
                }
                console.log("attended events count remain:"+attended_event_array.length);

                that.setData({ 
                    attended_kevents: attended_event_array, 
                    my_attended_count: attended_event_array.length,
                    loading_count: that.data.loading_count-1 
                });
                if (that.data.loading_count < 1) {that.setData({loading: false})}
            })
            .catch(function(error){
                console.error
                that.setData({loading:false})
            }); 
              
    },

    fetchNearbyKevents: function(longitude, latitude) {
        //这里是查附近的局
        var that = this
        console.log("fetching Nearby Kevents..."+longitude+","+latitude)
        new AV.Query('Kevent')
            .equalTo('isDeleted',0).greaterThan('expiredAt', new Date())
            .lessThan('locLongitude', longitude + LONGITUDE_RANGE)
            .greaterThan('locLongitude', longitude - LONGITUDE_RANGE)
            .lessThan('locLatitude', latitude + LATITUDE_RANGE)
            .greaterThan('locLatitude', latitude - LATITUDE_RANGE)
            .include('user')
            .descending('createdAt')
            .find()
            .then(function(kevents){
                var nearby_event_array = [];
                for (var i=0; i<kevents.length; i++) {
                    console.log(kevents[i].get('locLongitude'))
                    nearby_event_array.push({
                        'category':kevents[i].get('category'),
                        'objectId':kevents[i].get('objectId'),
                        'title':kevents[i].get('title'),
                        'count':kevents[i].get('count'),
                        'attendCount':kevents[i].get('attendCount'),
                        'createdAt':util.formatTime2(kevents[i].get('createdAt')),
                        'expiredAt':util.formatTime3(kevents[i].get('expiredAt')),
                        'user_nickName':kevents[i].get('user').get('nickName'),
                        'user_avatarUrl':kevents[i].get('user').get('avatarUrl')
                    });
                }
                that.setData({ 
                    nearby_kevents: nearby_event_array, 
                    nearby_kevents_count: nearby_event_array.length,
                    loading_count: that.data.loading_count-1 
                });
                if (that.data.loading_count < 1) {that.setData({loading: false})}
                console.log(".................................................")
                console.log("nearby:"+kevents.length)
            })
            .catch(function(error){
                console.error
                that.setData({loading:false})
            })
    } 
})
