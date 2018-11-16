/// <reference path="../../wxAPI.d.ts"/>
var wxDraw = require("../../utils/wxdraw.min.js").wxDraw;
var Shape = require("../../utils/wxdraw.min.js").Shape;
var app = getApp();
Page({
  data: {
    wxCanvas: null,
    savePng:null
  },
  //事件处理函数
  bindtouchstart: function (e) {
    console.log(e)
    this.wxCanvas.touchstartDetect(e)
  },
  bindtouchmove: function (e) {
    console.log(e)
    // this.setData({
    //     left:e.touches[0].x,
    //     top:e.touches[0].y
    // })
    this.wxCanvas.touchmoveDetect(e)
  },
  bindtouchend: function (e) {
    console.log(e)
    this.wxCanvas.touchendDetect(e)
  },
  bindtap: function (e) {
    this.wxCanvas.tapDetect(e)
  },
  bindlongpress: function (e) {
    this.wxCanvas.longpressDetect(e)
  },
  onReady: function () {
    // var context = wx.createCanvasContext('Canvas')
    // this.wxCanvas = new wxDraw(context, 0, 0, 400, 500);
    // let Sp = [];
    // let Sps = {
    //   ellipse: { x: 180, y: 200, a: 100, b: 140, fillStyle: "#2964cc", rotate: Math.PI / 2, opacity: 1, shadow: { blur: 2 } },
    //   polygon: { x: 150, y: 100, r: 40, sides: 7, fillStyle: "#fc354c", rotate: Math.PI / 4 },
    //   cshape: {
    //     rotate: Math.PI / 2,
    //     points: [[70, 85], [400, 200], [204, 46], [120, 104], [104, 361], [104, 46], [80, 20], [20, 16], [20, 40], [104, 61]],
    //     lineWidth: 5,
    //     fillStyle: "#00A0B0",
    //     rotate: Math.PI / 7,
    //     needGra: 'circle',
    //     smooth: false,
    //     gra: [[0, '#00A0B0'], [0.2, '#6A4A3C'], [0.4, '#CC333F'], [0.6, '#EB6841'], [1, '#EDC951']]
    //   },
    //   rect: { x: 150, y: 400, w: 80, h: 80, fillStyle: "#36BBA6" },
    //   circle: { x: 160, y: 300, r: 40, sA: 0, fillStyle: "#C0D860", strokeStyle: "#CC333F", rotate: 10, lineWidth: 0, needGra: 'line', gra: [[0, '#00A0B0'], [0.2, '#6A4A3C'], [0.4, '#CC333F'], [0.6, '#EB6841'], [1, '#EDC951']] }
    // }
    // let text = new Shape('text', { x: 0, y: 50, fontSize: 20, text: "点击，拖拽任意一个图形", fillStyle: "#d6254d" }, 'fill', true);
    // this.wxCanvas.add(text)
    // let keys = Object.keys(Sps);
    // for (var i = 0; i < keys.length; i++) {
    //   Sp[i] = new Shape(keys[i], Sps[keys[i]], 'fill', true);
    //   this.wxCanvas.add(Sp[i]);
    //   (function (i) {
    //     Sp[i].bind('tap', function () {
    //       text.updateText('你在点击' + keys[i])
    //     });
    //     Sp[i].bind('drag', function () {
    //       text.updateText('你在拖拽' + keys[i])
    //     });
    //     Sp[i].bind('touchstart', function () {
    //       text.updateText('你开始点击' + keys[i])
    //     });
    //     Sp[i].bind('touchmove', function () {
    //       text.updateText('你在' + keys[i] + '上移动')
    //     });
    //     Sp[i].bind('touchend', function () {
    //       text.updateText('你点击结束' + keys[i])
    //     });
    //     Sp[i].bind('longpress', function () {
    //       text.updateText('你长长的点击' + keys[i])
    //     });
    //   })(i)
    // }

    // context.fillStyle="#FF0000";
    // context.fillRect(0,0,150,75);
    // context.moveTo(0,0);
    // context.lineTo(200,100);
    // context.stroke();
    // context.beginPath();
    // context.arc(95,50,30,0,2*Math.PI)
    // context.stroke();
    // context.font="30px Arial";
    // context.fillText("Hello world",100,50);
    // context.strokeText("Hello world",100,50);
    // context.stroke();
    // context.draw();
  },
  onUnload: function () {
    this.wxCanvas.clear()
  },
  ellipse: function () {
    var context = wx.createCanvasContext('Canvas');
    this.wxCanvas = new wxDraw(context,0,0,400,500);
    let ellipse = new Shape('ellipse', { x: 180, y: 200, a: 100, b: 140, fillStyle: "#2964CC", rotate: Math.PI / 2, opacity: 1, shadow: { blur: 2 } }, 'fill', true)
    this.wxCanvas.add(ellipse);
    let a = ellipse.clone();
    // let b = ellipse.clone();
    // let c = ellipse.clone();
    ellipse.destroy();
    this.wxCanvas.add(a);
    context.globalCompositeOperation="destination-over";
    // this.wxCanvas.add(b);
    // this.wxCanvas.add(c);
    // b.updateOption({fillStyle:"#ff65ff",rotate:Math.PI/4,y:80});
    // a.updateOption({ fillStyle: "#29ffff", rotate: Math.PI,y:340,a:10 });
  },
  save:function(){
    wx.canvasToTempFilePath({
      x:0,
      y:0,
      width:400,
      height:500,
      destWidth:800,
      destHeight:1000,
      canvasId:'Canvas',
      success:res=>{
        console.log(res)
        this.setData({
          savePng:res.tempFilePath
        })
        // wx.saveImageToPhotosAlbum({
        //   filePath:res.tempFilePath
        // })
      }
    })
  },
  download:function(){
    wx.saveImageToPhotosAlbum({
      filePath: this.data.savePng
    })
    // wx.downloadFile({
    //   url: 'wss://www.fanhantech.com', //仅为示例，并非真实的资源
    //   success (res) {
    //     // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
    //     if (res.statusCode === 200) {
    //       wx.saveImageToPhotosAlbum({
    //         filePath: this.data.savePng
    //       })
    //     }
    //   }
    // })
  },
  cancel:function(){

  },
  clear: function () {
    var context = wx.createCanvasContext('Canvas');
    context.fillStyle="blue";
    context.globalCompositeOperation = "destination-out";
    context.fillRect(0,0,400,500);	
    context.draw(true)
  }
});
