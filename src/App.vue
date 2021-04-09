<template>
  <div id="app" class="app_">
    <div >
      <palette class="test"/>
    </div>
  </div>
</template>

<script>
import palette from "@/components/palette";
export default {
  name: 'App',
  components: {
    palette
  }
}
</script>

<style lang="scss">
*{
  padding: 0;
  margin: 0;
}
.test{
  width: 90vw;
  height: 60vh;
}
.app_{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
