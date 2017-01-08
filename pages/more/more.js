const AV = require('../../utils/av-weapp.js')
Page({
    data: {
        kevent: {},
        id: '',
        hasContent: true
    },
   onLoad: function (params) {
        var that = this
        this.setData({id: params.id})
    },
    onShow: function () {
        var that = this
        new AV.Query('Kevent')
            .get(that.data.id)
            .then(function(kevent) {
                that.setData({                
                    kevent: kevent
                })
                console.log("description:"+kevent.get("description"));
                console.log("tempFilePaths:"+kevent.get("tempFilePaths"));
                if ( kevent.get("description")=="" && kevent.get("tempFilePaths")=="" ) {
                    that.setData({hasContent:false})
                } else {
                    that.setData({hasContent:true})
                }
            })
            .catch(console.error);
        console.log(".............more:"+that.data.id)
    }
})