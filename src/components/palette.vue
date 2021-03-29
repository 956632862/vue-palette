<template>
  <div class="container">

      <!--  画板-->
      <div class="canvas-container">
          <canvas
              width="740"
              height="600"
              ref="myPalette"
              class="palette"
              @mousedown="handleDownCanvas"
              @mouseup="handleUpCanvas"
              @mousemove="handleMove"
          />
      </div>

      <div>
        鼠标坐标x: {{movex}}y:{{movey}}
      </div>
      <div class="container-item">
        <h4>画笔颜色</h4>
        <div class="color-item" v-for="(item,index) in colors" :style="{'background':item}" :key="index"></div>
      </div>

      <div class="container-item">
        <h4>画笔大小</h4>
        <div class="color-item" v-for="(item,index) in colors" :style="{'background':item}" :key="index"></div>
      </div>

  </div>
</template>

<script>
export default {
  name: "palette",
  data(){
    return{
      // 画笔颜色
      colors:[
        '#f1d506','#0924de','#08e31e','#f32f15','#cccccc','#5ab639'
      ],
      // canvas对象
      context: {},
      // 是否开始绘制
      canvasMoveUse: false,
      // 画笔的设置
      config:{
        lineWidth:1,              //  线条的宽度
        shadowBlur:1,             //  阴影模糊的程度
        shadowColor:"#f1d506",    //  阴影的颜色
        strokeStyle:"#f10649"     //  笔触的颜色
      },
      preHandle:[],   // 上一步
      nextHandle:[],   // 下一步
      movex:0,
      movey:0
    }
  },
  mounted() {
    this.init()
  },
  methods:{
    init(){
      const canvas = this.$refs.myPalette
      this.context = canvas.getContext("2d")
    },
    // 判断当前是否是pc
    isPC(){
      this.flag = navigator.userAgent.match(
          /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return this.flag === null
    },

    // 获取当前元素按下的坐标client是基于整个页面的坐标  offset是canvas距离顶部以及左边的距离
    getEventXY(e){
      console.log(e)
      // 默认获取pc
      let canvasX = e.offsetX
      let canvasY = e.offsetY
      this.movex =  canvasX
      this.movey =  canvasY
      // 使用手机的时候
      if(!this.isPC()){
        canvasX = e.changedTouches[0].clientX - e.target.parentNode.offsetLeft
        canvasY = e.changedTouches[0].clientY - e.target.parentNode.offsetTop
      }
      return {canvasX,canvasY}
    },

    // 设置画笔的配置
    handleSetConfig(){
      this.context.lineWidth = this.config.lineWidth
      this.context.shadowBlur = this.config.shadowBlur
      this.context.shadowColor = this.config.shadowColor
      this.context.strokeStyle = this.config.strokeStyle
    },

    // 在canvas中按下鼠标
    handleDownCanvas(e){
      this.canvasMoveUse = true
      // 获取当前鼠标按下的位置
      const {canvasX,canvasY} = this.getEventXY(e)
      // 重置画笔配置
      this.handleSetConfig()
      //清除子路径
      this.context.beginPath()
      // 移动的起点
      console.log("当前设置的移动起点是x,y",canvasX,canvasY)
      this.context.moveTo(canvasX, canvasY)
      // 参数的值 x y width height
      const pre = this.context.getImageData(0, 0, 700, 600)
      // 记录当前操作，便于后续的撤销操作
      this.preHandle.push(pre)
    },
    // 抬起
    handleUpCanvas(){
      this.canvasMoveUse = false
      // console.log("抬起",e)
    },
    // 移动e
    handleMove(e){
      if (!this.canvasMoveUse) return
      // 获取坐标点
      const {canvasX,canvasY} = this.getEventXY(e)
      // 链接每个点
      this.context.lineTo( canvasX ,canvasY)
      //绘制已定义的路径
      this.context.stroke()
    }
  }
}
</script>

<style scoped lang="scss">

.container{
  padding: 10px 0;

  .canvas-container{
    border: 1px #585858 solid;
    .palette{
      background: #e2e2e2;
    }
  }

  .container-item{
    width: 100%;
    text-align: center;
  }

  .color-item{
    display: inline-block;
    padding: 10px;
    width: 20px;
    height: 20px;
    margin: 5px;
  }
}



</style>
