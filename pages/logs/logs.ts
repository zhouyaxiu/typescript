/// <reference path="../../wxAPI.d.ts"/>
import {formatTime} from '../../utils/util.js'

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: ((wx.getStorageSync('logs') as Array<any>) || []).map((log) => {
        return formatTime(new Date(log))
      })
    });
    wx.showModal({
      title:'提示',
      content:'这是模态框',
      success:function(res){
        if(res.confirm){
          console.log('用户点击确定')
        }
      }
    })
  }
})
