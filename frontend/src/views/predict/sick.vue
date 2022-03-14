<template>
  <div 
  class="predict-wrap" 
  v-loading="loading" 
  element-loading-text="正在预测中，请稍候"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-form :model="form" ref="form" :inline="true" label-width="140px" class="sickForm">

      <el-row>
        <el-form-item label="姓名" :rules="[ { required: true } ]">
          <el-input v-model="form.name" :disabled="isDisabled"></el-input>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="性别" :rules="[ { required: true } ]">
          <el-radio-group v-model="form.sex" :disabled="isDisabled">
            <el-radio-button label="男" :disabled="isDisabled"></el-radio-button>
            <el-radio-button label="女" :disabled="isDisabled"></el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-row>

      <el-row>  
        <el-form-item label="年龄" :rules="[ { required: true } ]">
          <el-input-number 
            v-model="form.age"
            :step="1" 
            :max="110"
            :disabled="isDisabled"
          ></el-input-number>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="是否填写症状描述" :prop="isDesc">
          <el-radio-group v-model="isDesc" :disabled="isDescDisable">
            <el-radio-button label="是" :disabled="isDisabled"></el-radio-button>
            <el-radio-button label="否" :disabled="isDisabled"></el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="症状描述" :prop="form.desc" v-show="isDescShow" :rules="[ { required: true } ]">
          <el-input 
            type="textarea" 
            v-model="form.desc" 
            :autosize="{ minRows: 5}" 
            placeholder="请输入症状"
            class="desc"
            :disabled="isDisabled"
          ></el-input>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="是否填写体检数据" :prop="isExam">
          <el-radio-group v-model="isExam" :disabled="isExamDisable">
            <el-radio-button label="是" :disabled="isDisabled"></el-radio-button>
            <el-radio-button label="否" :disabled="isDisabled"></el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item v-for="(item,i) in metrics" :label="item[0]" :prop="item[1]"  v-show="isExamShow">
          <div class="metrics"><el-input-number 
            v-model="form['exam'][item[1]]" 
            :precision="2" 
            :step="0.1" 
            :min="0"
            :disabled="isDisabled"
          ></el-input-number></div>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :disabled="isDisabled">开始判定</el-button>
          <el-button @click="resetForm('form')" :disabled="isDisabled">重置</el-button>
        </el-form-item>
      </el-row>
      
    </el-form>
  </div>
</template>

<script>
import { saveExam, analysis } from '@/api/analysis'

export default {
  data() {
    return {
      isDisabled: false,
      isDesc: '是',
      isExam: '是',
      metrics: [
        ['糖化血红蛋白', 'thxhdb'],
        ['γ-谷氨酰转肽酶', 'gaxztm'],
        ['乳酸脱氢酶', 'rstqm'],
        ['低密度脂蛋白', 'dmdzdb'],
        ['前白蛋白', 'qbdb'],
        ['尿素', 'ns1'],
        ['尿酸', 'ns2'],
        ['总胆固醇', 'zdgc'],
        ['总胆汁酸', 'zdzs'],
        ['总胆红素', 'zdhs'],
        ['总蛋白', 'zdb'],
        ['球蛋白', 'qdb'],
        ['甘油三脂', 'gysz'],
        ['白球比', 'bqb'],
        ['白蛋白', 'bdb'],
        ['直接胆红素', 'zjdhs'],
        ['碱性磷酸酶', 'jxlsm'],
        ['肌酐', 'jg'],
        ['肌酸激酶', 'jsjm'],
        ['胆碱脂酶', 'djzm'],
        ['脂蛋白(a)', 'zdba'],
        ['葡萄糖', 'ptt'],
        ['载脂蛋白A1', 'zzdba1'],
        ['载脂蛋白B', 'zzdbb'],
        ['间接胆红素', 'jjdhs'],
        ['高密度脂蛋白', 'gmdzdb']
      ],
      form: {
        name: '',
        sex: '男',
        age: '',
        desc: '',
        exam: {
          thxhdb: '',
          gaxztm: '',
          rstqm: '',
          dmdzdb: '',
          qbdb: '',
          ns1: '',
          ns2: '',
          zdgc: '',
          zdzs: '',
          zdhs: '',
          zdb: '',
          qdb: '',
          gysz: '',
          bqb: '',
          bdb: '',
          zjdhs: '',
          jxlsm: '',
          jg: '',
          jsjm: '',
          djzm: '',
          zdba: '',
          ptt: '',
          zzdba1: '',
          zzdbb: '',
          jjdhs: '',
          gmdzdb: ''
        }
      },
      loading: false
    }
  },

  computed: {
    isDescShow () {
      return this.isDesc == '是'
    },

    isExamShow () {
      return this.isExam == '是'
    },

    isDescDisable () {
      return this.isExam == '否'
    },

    isExamDisable () {
      return this.isDesc == '否'
    }
  },

  mounted () {
    this.$notify.info({
      title: '操作指南',
      message: '您可以同时填入症状描述和体检信息，也可以仅填入其中一项数据。点击下方的提交按钮，后台将为您完成疾病的判别。',
      duration: 8000
    });
  },

  methods: {
    onSubmit() {
      if (this.form.name == '') {
        this.$message({
          message: '请输入姓名！',
          type: 'warning'
        });
        return
      } else if (this.isDesc == '是' && this.form.desc == '') {
        this.$message({
          message: '请输入症状描述！若不想输入症状可以点击按钮选“否”。',
          type: 'warning',
          duration: 5000
        });
        return
      }
      this.isDisabled = true;
      this.loading = true;
      let formData = {}
      for (let key in this.form) {
        formData[key] = this.form[key]
      }
      formData['isDesc'] = this.isDesc
      formData['isExam'] = this.isExam
      let _this = this
      if (this.isExam == '是') {
        saveExam(formData).then(res => {
          analysis(formData).then(res => {
            _this.loading = false;
            _this.$alert(res, '判定结果', {
              dangerouslyUseHTMLString: true
            });
            _this.isDisabled = false
          })
        })
      } else {
        analysis(formData).then(res => {
          _this.loading = false;
          _this.$alert(res, '判定结果', {
            dangerouslyUseHTMLString: true
          });
          _this.isDisabled = false
        })
      }
    },

    resetForm(formName) {
      this.form.desc = ''
      this.form.age = 0
      this.form.name = ''
      this.form.sex = '男'
      this.isDesc = '是'
      this.isExam = '是'
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style>
  .predict-wrap {
    padding: 20px;
  }
  .desc {
    width: 515px;
  }
  .metrics {
    margin-right: 35px;
  }
  .sickForm .el-form-item__label{
  color: white;
  font-size: .3rem;
}
</style>