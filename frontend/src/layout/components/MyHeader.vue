<template>
  <div class="myHeader">
    <el-row>
      <el-col :span="8" >
        <img  class="logo" width="32%"  src="../../assets/logo3.png" @click="goTo('visual')"/>
      </el-col>
      <el-col :span="8">
        <h1>{{tag}}</h1>
      </el-col>
      <el-col :span="8" class="dropdown">
        <h2 class="menu">
        <el-dropdown trigger="click" @command="goTo">
          <span class="el-dropdown-link">
            <i class="el-icon-menu"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-paperclip" command="visual">主页</el-dropdown-item>
            <el-dropdown-item icon="el-icon-paperclip">
              <el-dropdown @command="goTo" placement="top">
                <span class="el-dropdown-link">
                  糖尿病预测<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-first-aid-kit" command="predict">{{headers['predict']}}</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-first-aid-kit" command="readmission">{{headers['readmission']}}</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-notebook-2" command="sick-history">{{headers['sick-history']}}</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-notebook-2" command="rm-history">{{headers['rm-history']}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-dropdown-item>
            <el-dropdown-item icon="el-icon-paperclip" command="graph">{{headers['graph']}}</el-dropdown-item>
            <el-dropdown-item icon="el-icon-paperclip">
              <el-dropdown @command="goTo" placement="top">
                <span class="el-dropdown-link">
                  数据分析<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-search" command="ano-detec">{{headers['ano-detec']}}</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-coin" command="asso-rule">{{headers['asso-rule']}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </h2>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "MyHeader",

  data() {
    return {
      headers: {
        'visual': "糖尿病云平台",
        'predict': "糖尿病患病风险预测",
        'readmission': "糖尿病患者再入院预测",
        'sick-history': "患病风险预测记录",
        'rm-history': "再入院预测记录",
        'graph': "糖尿病知识图谱",
        "ano-detec": "糖尿病数据异常检测系统",
        "asso-rule": "关联规则"
      },
    }
  },

  computed: {
    tag() {
      return this.headers[this.$route.path.slice(1)];
    },

    sreenHeight() {
      return document.documentElement.clientHeight;
    }
  },


  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },

    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },

    goTo(index) {
      this.$router.push(index);
    },

  }
};
</script>

<style scoped>
.myHeader {
  width: 100%;
  height: 100%;
  background: url(../../assets/head_bg.png) no-repeat top center;
  background-size: cover
}

.myHeader .logo{
  margin-left: .5rem;
}

.myHeader .dropdown {
  padding-top: .05rem;
}

.myHeader .el-dropdown-link {
  font-size: .5rem;
  color: aliceblue;
}


.myHeader h1 {
  font-size: .7rem;
  line-height: 0.2rem;
  color: #fff;
  text-align: center;
  font-family: "font1";
  /* font-family: "SimHei"; */
  font-weight:bold;
}

.myHeader .menu {
  text-align: right;
  padding-right:10px ;
}

.myHeader .logo:hover, .el-icon-menu:hover{
  cursor: pointer;
}

</style>
