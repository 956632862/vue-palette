export default {
    methods: {
        // 判断是否是pc
        isPC() {
            this.flag = navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            );
            return this.flag === null
        },
        // 获取当前元素按下的坐标client是基于整个页面的坐标  offset是canvas距离顶部以及左边的距离
        getEventXY(e){
            // 默认获取pc
            let canvasX = e.offsetX
            let canvasY = e.offsetY
            this.movex =  canvasX
            this.movey =  canvasY
            // 使用手机的时候
            if(!this.isPC()){
                canvasX = e.changedTouches[0].offsetX
                canvasY = e.changedTouches[0].offsetY
                // canvasX = e.changedTouches[0].clientX - e.target.parentNode.offsetLeft
                // canvasY = e.changedTouches[0].clientY - e.target.parentNode.offsetTop
            }
            return {canvasX,canvasY}
        },
        // 删除路径里面的数据
        deleteLines(preKey){
            // 查找当前preKey在记录中哪里开始
            const linesKey =  this.lines.findIndex(n => n  && n.preKey === preKey)
            // 将路径参数添加到对应的nextHandle的数组中
            const nextArrIndex =  this.nextHandle.findIndex(n=>n&&n.preKey === preKey)
            if (linesKey === -1) return false
            let i = linesKey
            let saveData = []
            // 删除当前位置到下一次遇到PreKey
            for (i;i<this.lines.length;i++){
                if(!this.lines[i])  {
                    saveData.push(null)
                    continue
                }
                let flag = this.lines[i] !== null &&
                    this.lines[i].preKey !== void(0) &&
                    this.lines[i].preKey !== preKey
                // 找到下一次的preKey就结束
                if(flag) break;
                saveData.push(this.lines[i])
            }

            this.$nextTick(()=>{
                // 删除
                this.lines.splice(linesKey,i)
                // 添加绘制路径到下一步
                this.nextHandle[nextArrIndex].lines = saveData
            })
        },
    }
}
