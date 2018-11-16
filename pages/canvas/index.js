var app = getApp();
var clearC
Page({
  data: {
    isClear: false,
    penColor: 'red',
    lineWidth: 5,
    curContexts: [],
    pathCount: 0,
    contextCount: 0,
    alpha: '',
    screen: ''
  },
  onLoad: function () {
    wx.getBatteryInfo({
      success(res){
        console.log(res,'res')
      }
    })
    // wx.onAccelerometerChange({
    //   success(res){
    //     console.log(res,'res')
    //   }
    // })
    wx.onUserCaptureScreen(res=>{
     
        console.log(res,'res')
    })
    wx.getHCEState({
      success (res) {
        console.log(res)
      }
    })
    wx.onDeviceMotionChange({
      success (res) {
        console.log(res)
      }
    })
    wx.onDeviceMotionChange(res=> {
      // onDeviceMotionChange
      var alpha = parseFloat(res.alpha);
      if (alpha > 45 && alpha < 136) {
        this.setData({ screen: '左侧' })
      } else if (alpha > 225 && alpha < 316) {
        this.setData({ screen: '右侧' })
      } else if (alpha > 135 && alpha < 226) {
        this.setData({ screen: '反面' })
      } else {
        this.setData({ screen: '正面' })
      }
      this.setData({
        alpha: alpha
      })
    })
    // wx.startDeviceMotionListening({
    //   success (res) {
    //     console.log(res)
    //   }
    // })
    wx.getSystemInfo({
      success(res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
        const ctx = wx.createCanvasContext('bgCanvas');
        // ctx.setFillStyle('red');

        //进行绘制一个直角梯形
        ctx.moveTo(0, 0)
        ctx.lineTo(res.windowWidth, 0)
        ctx.lineTo(res.windowWidth, 130)
        ctx.lineTo(0, 80)
        ctx.lineTo(0, 0)

        //在图形中添加所需的图片信息
        const pattern = ctx.createPattern('http://img2.imgtn.bdimg.com/it/u=2391103472,3552675862&fm=15&gp=0.jpg', 'repeat-x');
        ctx.fillStyle = pattern;  //将图片信息进行填充

        ctx.fill();

        ctx.stroke()
        ctx.draw()
      }
    })

  },
   /**
   * 开始监听屏幕方向
   */
  startScreen(res) {
    wx.startDeviceMotionListening({
      success: function (r) {
        console.log(r);
      }
    })
  },
  /**
   * 结束监听屏幕方向
   */
  endScreen: function (res) {
    wx.stopDeviceMotionListening()
  },
  //事件处理函数
  bindtouchstart: function (e) {
    //得到触摸点的坐标
    this.startX = e.changedTouches[0].x;
    this.startY = e.changedTouches[0].y;
    this.context = wx.createCanvasContext('Canvas', this)
    clearC = this.context
    var arr = new Array();
    this.data.curContexts[this.data.pathCount] = arr;
    this.setData({
      curContexts: this.data.curContexts,
      contextCount: 0,
    })
    if (this.data.isClear) {//判断是否启用的橡皮擦功能  ture表示清除  false表示画画
      this.context.setStrokeStyle('#ffffff') //设置线条样式 此处设置为画布的背景颜色  橡皮擦原理就是：利用擦过的地方被填充为画布的背景颜色一致 从而达到橡皮擦的效果
      this.context.setLineCap('round') //设置线条端点的样式
      this.context.setLineJoin('round') //设置两线相交处的样式
      this.context.globalCompositeOperation = "destination-out";
      // this.context.setGlobalAlpha(0);
      this.context.setLineWidth(20) //设置线条宽度
      this.context.save();  //保存当前坐标轴的缩放、旋转、平移信息
      this.context.beginPath() //开始一个路径
      this.context.arc(this.startX, this.startY, 5, 0, 2 * Math.PI, true);  //添加一个弧形路径到当前路径，顺时针绘制  这里总共画了360度  也就是一个圆形
      this.context.fill();  //对当前路径进行填充
      this.context.restore();  //恢复之前保存过的坐标轴的缩放、旋转、平移信息
    } else {
      // 设置画笔颜色
      this.context.setStrokeStyle(this.data.penColor);
      // 设置线条宽度
      this.context.setLineWidth(this.data.lineWidth);
      this.context.setLineCap('round') // 让线条圆润
      this.context.beginPath()
      this.context.globalCompositeOperation = "destination-over";
    }
  },
  bindtouchmove: function (e) {
    var startX1 = e.changedTouches[0].x
    var startY1 = e.changedTouches[0].y
    if (this.data.isClear) { //判断是否启用的橡皮擦功能  ture表示清除  false表示画画
      this.context.save();  //保存当前坐标轴的缩放、旋转、平移信息
      this.context.moveTo(this.startX, this.startY);  //把路径移动到画布中的指定点，但不创建线条
      this.context.lineTo(startX1, startY1);  //添加一个新点，然后在画布中创建从该点到最后指定点的线条
      this.context.stroke();  //对当前路径进行描边
      this.context.restore()  //恢复之前保存过的坐标轴的缩放、旋转、平移信息
      this.context.globalCompositeOperation = "destination-out";
      this.startX = startX1;
      this.startY = startY1;

    } else {
      this.context.moveTo(this.startX, this.startY)
      this.context.lineTo(startX1, startY1)
      this.context.stroke()
      this.startX = startX1;
      this.startY = startY1;
      this.context.globalCompositeOperation = "destination-over";
    }

    //只是一个记录方法调用的容器，用于生成记录绘制行为的actions数组。context跟<canvas/>不存在对应关系，一个context生成画布的绘制动作数组可以应用于多个<canvas/>
    // wx.drawCanvas({
    //   canvasId: 'Canvas',
    //   reserve: true,
    //   actions: this.context.getActions() // 获取绘图动作数组
    // })
    var actions = this.context.getActions();
    this.data.curContexts[this.data.pathCount][this.data.contextCount] = actions;
    this.setData({
      curContexts: this.data.curContexts
    })
    wx.drawCanvas({
      canvasId: 'Canvas',
      reserve: true,
      actions: actions // 获取绘图动作数组
    });
    this.data.contextCount++;

  },
  bindtouchend: function (e) {
    this.bindtouchmove(e);
    this.setData({
      pathCount: (this.data.pathCount + 1),
      contextCount: 0
    });
  },
  bindtap: function (e) {
  },
  bindlongpress: function (e) {
  },
  /**
   * 画笔选择
   */
  penselect: function (options) {
    var lineWidth = options.target.dataset.param;
    // console.log("lineWidth:" + lineWidth);
    this.setData({
      isClear: false,
      lineWidth: lineWidth,
    });
  },
  /**
   * 颜色选择
   */
  colorselect: function (options) {
    var penColor = options.target.dataset.param;
    // console.log("penColor:" + penColor);
    this.setData({
      isClear: false,
      penColor: penColor,
    });
  },
  // 撤销

  recover: function () {
    this.context.clearRect(0, 0, 400, 500);
    this.context.draw();
    if (this.data.pathCount > 0) {
      for (var i = 0; i < this.data.pathCount - 1; i++) {
        for (var j = 0; j < this.data.curContexts[i].length; j++) {
          wx.drawCanvas({
            canvasId: 'Canvas',
            reserve: true,
            actions: this.data.curContexts[i][j] // 获取绘图动作数组
          });
        }
      }

      var pathCount = this.data.pathCount - 1;
      this.data.curContexts[pathCount] = null;
      this.setData({
        pathCount: pathCount,
        contextCount: 0,
      });
    }
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

  },

  save: function () {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 400,
      height: 500,
      destWidth: 800,
      destHeight: 1000,
      canvasId: 'Canvas',
      success: res => {
        // console.log(res)
        this.setData({
          savePng: res.tempFilePath
        })
        // wx.saveImageToPhotosAlbum({
        //   filePath:res.tempFilePath
        // })
      }
    })
  },
  download: function () {
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
  cancel: function () {
    // var context = wx.createCanvasContext('Canvas');
    // context.fillStyle="blue";
    // context.globalCompositeOperation = "destination-out";
    // context.fillRect(0,0,400,500);
    // context.draw(true)
    this.setData({
      pathCount: 0,
      contextCount: 0,
    })
    clearC.clearRect(0, 0, 400, 500);
    clearC.draw()
  },
  clear: function () {
    this.setData({
      isClear: true
    });
  }
});
