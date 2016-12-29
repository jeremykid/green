const AV = require('./utils/av-weapp.js')
App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        //var logs = wx.getStorageSync('logs') || []
        //logs.unshift(Date.now())
        //wx.setStorageSync('logs', logs)
        AV.init({
            appId:"6IkiQ1QmPKMayoS8DKVi7067-gzGzoHsz",
            appKey:"z2mzXszuCiHLIiru2XNSwAb9",
        });
        AV.User.loginWithWeapp().then(user => {
            this.globalData.user = user.toJSON();
        }).catch(console.error);
    },
    globalData:{
        user:null
    },
    category_array: ['未指定','饭局', '游戏', '拼单'],
})
