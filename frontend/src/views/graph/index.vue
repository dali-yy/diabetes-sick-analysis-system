<template>
  <iframe id="show-iframe"  frameborder=0 scrolling=auto src="http://127.0.0.1:3000/graph"></iframe>
</template>

<script>
export default {
  name: 'graph',
  mounted(){
    const oIframe = document.getElementById('show-iframe');
    const deviceWidth = document.documentElement.clientWidth;
    const deviceHeight = document.documentElement.clientHeight;
    oIframe.style.width = deviceWidth * 0.88 + 'px';
    oIframe.style.height = deviceHeight * 0.84 + 'px';

    oIframe.style.marginTop = deviceWidth * 0.015 + 'px';
    oIframe.style.marginBottom = deviceWidth * 0.015 + 'px';
    oIframe.style.marginLeft = deviceWidth * 0.05 + 'px';
  }
}
</script>

<style scoped>
  iframe {
    margin: 18px 80px 20px 50px;
  }
</style>