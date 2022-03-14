<template>
  <el-container>
    <el-header :height="screenHeight*0.1+'px'"> 
      <my-header></my-header>
    </el-header>
    <el-main :height="screenHeight*0.9+'px'">
      <app-main></app-main>
    </el-main>
  </el-container>
</template>

<script>
import MyHeader from "./components/MyHeader";
import AppMain from "./components/AppMain";

export default {
  name: "Layout",
  components: {
    MyHeader,
    AppMain
  },

  computed: {
    screenHeight() {
      return window.screen.availHeight;
    }
  }
};
</script>

<style>
.el-header {
  padding: 0 !important;
  margin: 0;
}

.el-main {
  padding: 0 !important;
  margin: 0;
}
</style>
