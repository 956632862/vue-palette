<template>
  <div class="container">

      <!--  画板-->
      <div class="canvas-container">
          <canvas
              :width="760"
              :height="610"
              ref="myPalette"
              class="palette"
              @mousedown="handleDownCanvas"
              @mouseup="handleOverMove"
              @mousemove="handleMove"
              @mouseout="handleOverMove"
          />
      </div>

      <div>
        鼠标坐标x: {{movex}}y:{{movey}}
      </div>

      <div class="container-item">
        <button class="button-item" @click="handlePre">上一步</button>
        <button class="button-item" @click="handleNext">下一步</button>
        <button class="button-item" @click="handleSetImg">选择图片</button>
      </div>

      <div class="container-item">
        <h4>画笔颜色</h4>
        <span
            class="color-item"
            v-for="(item,index) in colors"
            :style="{'background':item}"
            @click="handleSetColor(item)"
            :key="index"
        />
      </div>

      <div class="container-item">
        <h4>画笔大小</h4>
        <div class="size-item" v-for="(item,index) in size" :key="index" @click="handleSetSize(item.size)">{{item.name}}</div>
      </div>

  </div>
</template>

<script>
import mixin from "./mixin"
export default {
  name: "palette",
  mixins:[mixin],
  data(){
    return{
      // 画笔颜色
      colors:[
        '#f1d506','#0924de','#08e31e','#f32f15','#cccccc','#5ab639'
      ],
      size:[
        {name:"小",size:1},
        {name:"中",size:2},
        {name:"大",size:3}
      ],
      // canvas对象
      context: {},
      // 保存绘画的路径
      lines:[],
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
      this.config.shadowColor = this.colors[0]
      this.config.strokeStyle = this.colors[0]
    },

    // 结束绘画
    handleOverMove(){
      this.canvasMoveUse = false
      // 往记录中添加短点
      this.lines.push(null)
    },

    // 选择图片设置
    handleSetImg(){
      let input = document.createElement("input")
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = this.putImageToCanvas
      input.click()
    },

    putImageToCanvas(event){
      const e = event.target;
      const { files } = e; // 拿到所有的文件
      const file = files[0]

      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        // console.log('file 转 base64结果：' + reader.result)
        let imag = new Image();
        imag.src = reader.result
        imag.onload = () =>{
          // 获取canvas的宽高
          const  {clientWidth,clientHeight} = this.$refs.myPalette

          // 绘制之前还是需要将当前页面添加到上一步
          this.preHandle.push(this.context.getImageData(0, 0, 760, 610))
          // 这里没办法解决画图被覆盖的问题，只能绘制完图片之后将线条绘制回去
          this.context.drawImage(imag,0,0,clientWidth,clientHeight)
          this.resetLine()
        }
      }
    },

    // 重新绘制之前绘画
    resetLine(){
      this.context.beginPath();
      // 这里是将绘制的记录返回回来，但是这里返回之后，就没法再进行上下了
      this.lines.forEach((item,index) => {
        // item === null 代表着抬起手指，断开绘制
        if (item){
          const next_item = this.lines[index+1] ||  item
          this.context.moveTo(item.x,item.y);
          this.context.lineTo(next_item.x,next_item.y);
          this.context.strokeStyle=item.strokeStyle;
          this.context.shadowColor=item.shadowColor
          this.context.stroke();
        }else{
          // 清除子路径
          console.log('清除子路径')
          this.context.beginPath();
        }
      })
    },

    // 上一步
    handlePre(){
      if(!this.preHandle.length) return false
      const pre =  this.preHandle.pop()
      // 这里应该是把当前的canvas保存进下一步
      const next = this.context.getImageData(0, 0, 760, 610)
      this.nextHandle.push(next)
      this.context.putImageData(pre,0, 0)
    },

    // 下一步
    handleNext(){
      if(!this.nextHandle.length) return false
      const next = this.nextHandle.pop()
      // 这里应该是把当前的canvas保存进下一步
      const pre = this.context.getImageData(0, 0, 760, 610)
      this.preHandle.push(pre)
      this.context.putImageData(next,0, 0)
    },

    // 设置画笔的颜色
    handleSetColor(color){
      this.config.shadowColor = color
      this.config.strokeStyle = color
      this.handleSetConfig()
    },

    // 设置画笔大小
    handleSetSize(size){
      this.config.lineWidth = size
      this.handleSetConfig()
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
      this.context.moveTo(canvasX, canvasY)
      // 参数的值 x y width height
      const pre = this.context.getImageData(0, 0, 700, 600)
      // 记录当前操作，便于后续的撤销操作
      this.preHandle.push(pre)

      // todo 重新绘画之后清除所有下一步，考虑是否合理
      this.nextHandle = []

      // 按下就保存路径位置
      this.lines.push({
        x:canvasX,
        y:canvasY,
        strokeStyle:this.context.strokeStyle,
        shadowColor:this.context.shadowColor
      })
    },


    // 移动
    handleMove(e){
      if (!this.canvasMoveUse) return
      // 获取坐标点
      const {canvasX,canvasY} = this.getEventXY(e)
      // 链接每个点
      this.context.lineTo( canvasX ,canvasY)
      // 按下就保存路径位置
      this.lines.push({
        x:canvasX,
        y:canvasY,
        strokeStyle:this.context.strokeStyle,
        shadowColor:this.context.shadowColor
      })
      //绘制已定义的路径
      this.context.stroke()
    }
  }
}
</script>

<style scoped lang="scss">
div,span{
  -moz-user-select:none;/*火狐*/
  -webkit-user-select:none;/*webkit浏览器*/
  -ms-user-select:none;/*IE10*/
  -khtml-user-select:none;/*早期浏览器*/
  user-select:none;
}
.container{
  padding: 10px 0;
  .canvas-container{
    .palette{
      background: #e2e2e2;
    }
  }

  .container-item{
    width: 100%;
    text-align: center;
  }

  .button-item{
    padding: 5px 10px;
    margin: 5px;
  }

  .color-item,.size-item{
    display: inline-block;
    padding: 10px;
    width: 20px;
    height: 20px;
    margin: 5px;
  }
  .size-item{
    border: 1px solid black;
  }
}



</style>
