<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",

  mounted() {
    const app = document.getElementById('app');
    const deviceWidth = window.screen.availHeight;
    app.style.minHeight = deviceWidth * 0.89 + 'px';
  }
};
</script>

<style>
#app {
  margin: 0;
  padding: 0;
  /*  背景图定位 / 背景图尺寸  cover 完全铺满容器  contain 完整显示在容器内 */
  background: url(./assets/bg.jpg) no-repeat #000;
  background-size: cover;
}
</style>
