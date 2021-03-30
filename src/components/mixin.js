export default {
    methods: {
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
                canvasX = e.changedTouches[0].clientX - e.target.parentNode.offsetLeft
                canvasY = e.changedTouches[0].clientY - e.target.parentNode.offsetTop
            }
            return {canvasX,canvasY}
        },
    }
}
