"use strict";
exports.__esModule = true;
/// <reference path="../../wxAPI.d.ts"/>
var util_js_1 = require("../../utils/util.js");
Page({
    data: {
        logs: []
    },
    onLoad: function () {
        this.setData({
            logs: (wx.getStorageSync('logs') || []).map(function (log) {
                return util_js_1.formatTime(new Date(log));
            })
        });
        wx.showModal({
            title: '提示',
            content: '这是模态框',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定');
                }
            }
        });
    }
});
