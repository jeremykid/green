const AV = require('../../utils/av-weapp.js')
var app = getApp()
Page({
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
                }).catch(console.error);
            }
        });
    }
})
