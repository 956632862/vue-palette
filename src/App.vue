<template>
  <div id="app" class="app_">
    <div>
      <palette/>
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
.app_{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
