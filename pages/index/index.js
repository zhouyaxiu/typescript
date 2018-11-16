/// <reference path="../../wxAPI.d.ts"/>
const pdfobject = require('punycode')
// var pdfobject = require('../../utils/pdfobject.min.js')
var app = getApp();
Page({
    data: {
        motto: 'Hello World',
        userInfo: {}
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        });
    },
    onLoad: function () {
        console.log(pdfobject,'pdfobject')
        // pdfobject.embed("https://s301.fanhantech.com/descrpition/Bk1YQddkZgfC1sILBbyxzZPx5zq3pr2J.pdf", "this.data.motto");
        // var success = new PDFObject({ url: "https://s301.fanhantech.com/descrpition/Bk1YQddkZgfC1sILBbyxzZPx5zq3pr2J.pdf" }).embed();
    },
    getUserInfo: function (e) {
        console.log(e);
        app.globalData.userInfo = e.detail.userInfo;
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
    }
});
