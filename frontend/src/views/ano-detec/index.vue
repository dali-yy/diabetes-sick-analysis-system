<template>
  <div 
  class="anoDetec-wrap"
  v-loading="loading" 
  element-loading-text="异常检测分析中，请稍候"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-row>
      <el-col :span="8">
        <el-upload
          class="upload-ad"
          ref="upload"
          action="http://127.0.0.1:3000/multer/upload"
          :before-upload="handleBeforeUpload"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-change="handleChange"
          :multiple="false"
          :limit="2"
          :file-list="fileList"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">基于自动编码器的糖尿病数据异常检测</el-button>
          <div slot="tip" class="el-upload__tip">只能上传csv文件</div>
        </el-upload>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-upload
          class="upload-ad"
          ref="upload"
          action="http://127.0.0.1:3000/multer/upload"
          :before-upload="handleBeforeUpload"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-change="handleChange"
          :multiple="false"
          :limit="2"
          :file-list="fileList"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">基于LSTM的糖尿病时序数据异常检测</el-button>
          <div slot="tip" class="el-upload__tip">只能上传csv文件</div>
        </el-upload>
      </el-col>
    </el-row>
    <el-row type="flex" v-if="isShow" justify="center">
      <img src="http://127.0.0.1:3000/image/getFig?img=fig1.png" width="1000px">
    </el-row>
    <el-row type="flex" v-if="isShow" justify="center">
      <img src="http://127.0.0.1:3000/image/getFig?img=fig2.png">
    </el-row>
    <el-row type="flex" v-if="isShow" justify="center">
      <img src="http://127.0.0.1:3000/image/getFig?img=fig4.png">
    </el-row>
  </div>
</template>

<script>
import {anomalyDetection} from "@/api/analysis";
export default {
  data() {
    return {
      fileList: [],
      isShow: false,
      loading: false
    };
  },
  methods: {
    /**
     * @abstract 上传文件前类型检查，仅接受.xlsx和.csv的文件
     * @param file element-ui uplaod 组件的文件对象
     */
    handleBeforeUpload(file) {
      let format = file.name
        .substring(file.name.lastIndexOf(".") + 1)
        .toLowerCase();
      if (["xlsx", "csv"].indexOf(format) === -1) {
        this.$message.error("请上传正确格式的数据文件！");
        this.$notify({
          title: "支持的文件格式",
          message: "xlsx、csv",
          position: "bottom-left",
          duration: 0
        });
        this.resetFileList();
        return false;
      } else if (/\s/.test(file.name)) {
        this.$message.error("文件名不能含有空格和中文括号！");
        this.resetFileList();
        return false;
      }
      return true;
    },

    /**
     * @abstract 上传文件
     * @param file element-ui uplaod 组件的文件对象
     */
    submitUpload() {
      this.$refs.upload.submit();
    },

    /**
     * @abstract 异常检测
     * @param file element-ui uplaod 组件的文件对象
     */
    handleSuccess(file) {
      this.loading = true;
      anomalyDetection({filename: file.originalname}).then(res => {
        this.loading = false;
        let _res = JSON.parse(res);  // 将json字符串转换成json对象
        if (_res.code === 200) {
          this.$message("异常检测成功！");
          this.isShow = true; // 显示分析结果
        }else {
          this.$message("异常检测失败！上传的文件内容错误！")
          this.isShow = false;
        }
      })      
    },

    /**
     * @abstract 上传失败的回调
     * @param res 后台返回的错误信息
     * @param file element-ui uplaod 组件的文件对象
     */
    handleError(res, file) {
      console.log("上传失败：", res);
      this.$message.error("上传失败！");
      this.resetFileList();
    },

    /**
     * @abstract 文件列表更新的回调
     * @param file element-ui uplaod 组件的文件对象
     * @param fileList element-ui uplaod 组件的绑定的文件列表
     */
    handleChange(file, fileList) {
      console.log("切换文件")
      this.fileList = fileList.slice(-1);
      console.log("添加文件：", this.fileList[0]);
    },

    /**
     * @abstract 重置上传文件状态
     */
    resetFileList(flag) {
      this.fileList = [];
    },
  }
}
</script>

<style scoped>
.anoDetec-wrap {
  margin: 20px;
}
</style>