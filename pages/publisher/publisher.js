const AV = require('../../utils/av-weapp.js')
const Kevent = require('../../model/Kevent.js')
var util = require('../../utils/util.js')
var app = getApp()
var the_date = new Date()
Page({
    data: {
        category_array: [],
        category_index: 0,
        title: '',
        description: '',
        loading: false,
        isLBS: false,
        id: '',
        kevent:{},
        date:util.formatTimeForDate(the_date),
        time:util.formatTimeForTime(the_date),
        tempFilePaths: '',
        showMore: false,
        locLongitude: -1000,
        locLatitude: -1000,
        submitEnabled: true       
    },
    onLoad: function(params) {
        var that = this
        this.setData({category_array: app.category_array})
        if (params.id) {
            console.log(params.id)
            new AV.Query('Kevent')
                .get(params.id)
                .then(kevent => that.setData({
                    kevent: kevent,
                    id: kevent.id,
                    category_index: kevent.get('category'),
                    title: kevent.get('title'),
                    description:kevent.get('description'),
                    count: kevent.get('count'),
                    isLBS: kevent.get('isLBS'),
                    locLongitude: kevent.get('locLongitude'),
                    locLatitude: kevent.get('locLatitude'),
                    date: util.formatTimeForDate(kevent.get('expiredAt')),
                    time: util.formatTimeForTime(kevent.get('expiredAt')),
                    tempFilePaths: kevent.get('tempFilePaths')
                }))
                .catch(console.error);
        }      
    },
    formSubmit: function(e) {
        var that = this
        console.log(that.isLBS)
        that.setData({loading:true})

        var title = e.detail.value.title
        var category = e.detail.value.category
        var count = e.detail.value.count
        var isLBS = that.data.isLBS
        var description = e.detail.value.description
        var tempFilePaths = e.detail.value.tempFilePaths
           
        console.log(title);        
        
        if(!title) {
            console.log('Title None')
            that.setData({loading:false})
            wx.showToast({
                title: '标题不能为空',
                icon: 'loading',
                duration: 1000
            })
            return;
        }

        if(count<=1) {
            console.log('Title None')
            that.setData({loading:false})
            wx.showToast({
                title: '人数不能少于2',
                icon: 'loading',
                duration: 1000
            })
            return;
        }

        if(!that.data.date) {
            console.log('Expired Date None')
            that.setData({loading:false})
            wx.showToast({
                title: '过期时间不能为空',
                icon: 'loading',
                duration: 1000
            })
            return;
        }

        var locLongitude = -1000;
        var locLatitude = -1000;
        if(isLBS) {
            locLongitude = that.data.locLongitude;
            locLatitude = that.data.locLatitude;
        }


        if (that.data.id) {
            console.log("更新")
            that.data.kevent.set('title', title);
            that.data.kevent.set('description', description);
            that.data.kevent.set('count', Number(count));
            that.data.kevent.set('category',Number(category));
            that.data.kevent.set('isLBS',isLBS);
            that.data.kevent.set('expiredAt', new Date((that.data.date + ' ' + that.data.time).replace(/-/g,"/")));
            that.data.kevent.set('locLongitude', locLongitude);
            that.data.kevent.set('locLatitude', locLatitude);
            that.data.kevent.set('tempFilePaths',that.data.tempFilePaths);
            that.data.kevent.save().then(that.setData({loading:false})).then(
                wx.showToast({
                    title: '修改成功',
                    icon: 'success',
                    duration: 800
                })
            ).then(wx.navigateBack())
        } else {
            console.log("新建")
            console.log("tempFilePaths:" + tempFilePaths)
            var the_expiredAt = new Date((that.data.date + ' ' + that.data.time).replace(/-/g,"/"))
            console.log("---------saved expiredAt:"+the_expiredAt)
            new Kevent({
                user: AV.User.current(),
                title: title,
                description: description,
                count: Number(count),
                category: Number(category),
                isDeleted:0,
                isLBS: isLBS,
                expiredAt: new Date((that.data.date + ' ' + that.data.time).replace(/-/g,"/")),
                attendCount: 0,
                tempFilePaths: that.data.tempFilePaths,
                locLongitude: locLongitude,
                locLatitude: locLatitude
            }).save().then(that.setData({loading:false})).then(
                wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 800
                })
            ).then(wx.navigateBack())
        }
    },
    catePickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        if (!e.detail.value) {
            this.setData({category_index: 0})
        } else {
            this.setData({category_index: e.detail.value})
        }
    },
    switchChange: function(e) {
        var that = this
        console.log('开关发生改变，携带值为', e.detail.value)
        if (e.detail.value) {
            that.setData({submitEnabled:false})
            wx.getLocation( {
                success: function( res ) {
                    console.log( res )
                    that.setData({
                        submitEnabled: true,
                        hasLocation: true,
                        locLongitude: res.longitude,
                        locLatitude: res.latitude                
                    })
                },
                fail: function() {
                    that.setData({
                        submitEnabled: true,
                        hasLocation: false,
                        locLongitude: -1000,
                        locLatitude: -1000
                    })
                }
            }); 
        }
        this.setData({isLBS: e.detail.value})
        console.log(that.data.isLBS)
    },
    bindDateChange:function(e){
        this.setData({
            date:e.detail.value
        })
        console.log(this.data.date)
    },
    bindTimeChange:function(e){
        this.setData({
            time:e.detail.value
        })
        console.log(this.data.time)
    },
    tapImage: function () {                  
        var that = this; 
        wx.chooseImage({      
            count: 1, // 默认9        
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
            success: function (res) { 
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({  
                    tempFilePaths: res.tempFilePaths  
                })                              
                var filePath = res.tempFilePaths[0];                
                new AV.File('file-name', { 
                    blob: { 
                    uri: filePath, 
                    }, 
                    }).save().then( 
                        file => that.setData({tempFilePaths: file.url()}) 
                        ).catch(console.error); 
                } 
            }
        )      
    },
    tapShowMore: function() {
        console.log("tapShowMore")
        this.setData({showMore: true})
    }
});
