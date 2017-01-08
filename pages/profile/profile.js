const AV = require('../../utils/av-weapp.js')
var app = getApp()
Page({
    data: {
        id: '',
        user: {},
        motto: "男，北京",
        loading: false,
        gender: ['性别未知','男','女']
    },
   onLoad: function (params) {
        var that = this
        this.setData({id: params.id})
        const user = AV.User.current();
        wx.getUserInfo({
            success: ({userInfo}) => {
                // 更新当前用户的信息
                user.set(userInfo).save().then(user => {
                    // 成功，此时可在控制台中看到更新后的用户信息
                    app.globalData.user = user.toJSON();
                    console.log(app.globalData.user)
                }).catch(console.error);
            }
        });
    },
    onShow: function () {
        var that = this
        new AV.Query('User')
            .get(that.data.id)
            .then(user => that.setData({                
                user: user
            }))
    }
})
