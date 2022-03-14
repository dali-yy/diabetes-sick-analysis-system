<template>
  <div 
  class="readmission-wrap"
  v-loading="loading" 
  element-loading-text="正在预测中，请稍候"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-form 
    ref="form" :model="form" 
    :inline="true" 
    label-width="200px" 
    class="rmForm" 
    :disabled="isDisabled">
      <el-row>
        <el-form-item label="种族" prob="race" >
          <el-select v-model="form.race">
            <el-option label="Caucasian" value="0"></el-option>
            <el-option label="AfricanAmerican" value="1"></el-option>
            <el-option label="Asina" value="2"></el-option>
            <el-option label="Hispanic" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      
      <el-row>
        <el-form-item label="性别" prob="sex" >
          <el-radio-group v-model="form.sex">
            <el-radio-button label="0">女</el-radio-button>
            <el-radio-button label="1">男</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-row>
      
      <el-row>
        <el-form-item label="年龄" prob="age" >
          <el-input-number 
            v-model="form.age"
            :step="1" 
            :max="110"
            :min="0"
          ></el-input-number>
        </el-form-item>
      </el-row>
      
      <el-row>
        <el-form-item label="入院形式" prob="admissionType" >
          <el-select v-model="form.admissionType">
            <el-option label="None" value="0"></el-option>
            <el-option label="普通" value="1"></el-option>
            <el-option label="紧急入院" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      
      <el-row>
        <el-form-item label="出院去向" prob="discharge" >
          <el-select v-model="form.discharge">
            <el-option label="None" value="0"></el-option>
            <el-option label="出院回家" value="1"></el-option>
            <el-option label="转向其他护理机构" value="2"></el-option>
            <el-option label="病情加重转向高级医院" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      
      <el-row>
        <el-form-item label="入院来源" prob="admissionSource" >
          <el-select v-model="form.admissionSource">
            <el-option label="None" value="0"></el-option>
            <el-option label="从家里来" value="1"></el-option>
            <el-option label="从普通护理机构来" value="2"></el-option>
            <el-option label="从紧急病房来" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <br/>
      <el-row>
        <el-form-item label="住院天数" prob="timeHospital" >
          <el-input-number v-model="form.timeHospital" :step="1" :min="0"  ></el-input-number>
        </el-form-item>
        <el-form-item label="住院期间实验室检测次数" prob="numLab" >
          <el-input-number v-model="form.numLab" :step="1" :min="0"  ></el-input-number>
        </el-form-item>
        <el-form-item label="除实验室测试的检查次数" prob="numProcedures" >
          <el-input-number v-model="form.numProcedures" :step="1" :min="0"  ></el-input-number>
        </el-form-item>
        <el-form-item label="住院期间不同药物数量" prob="numMedications" >
          <el-input-number v-model="form.numMedications" :step="1" :min="0"  ></el-input-number>
        </el-form-item>
        <el-form-item label="就诊前一年的门诊次数" prob="numOutpatient" >
          <el-input-number v-model="form.numOutpatient" :step="1" :min="0"  ></el-input-number>
        </el-form-item>
        <el-form-item label="就诊前一年的急诊次数" prob="numEmergency" >
          <el-input-number v-model="form.numEmergency" :step="1" :min="0"  ></el-input-number>
        </el-form-item>
        <el-form-item label="就诊前一年的住院次数" prob="numInpatient" >
          <el-input-number v-model="form.numInpatient" :step="1" :min="0"  ></el-input-number>
        </el-form-item>
        <el-form-item label="诊断次数" prob="numDiagnoses" >
          <el-input-number v-model="form.numDiagnoses" :step="1" :min="0"  ></el-input-number>
        </el-form-item>
      </el-row>
      <br/>
      <el-row>
        <el-form-item label="血糖监测" prob="maxGluSerum" >
          <el-select v-model="form.maxGluSerum">
            <el-option label="None" value="0"></el-option>
            <el-option label="Norm" value="1"></el-option>
            <el-option label=">200" value="2"></el-option>
            <el-option label=">300" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="糖化血红蛋白测试" prob="a1Result" >
          <el-select v-model="form.a1Result">
            <el-option label="None" value="0"></el-option>
            <el-option label="Norm" value="1"></el-option>
            <el-option label=">7" value="2"></el-option>
            <el-option label=">8" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-row>

      <el-row>
        <h3 style="color: white; font-size: 20px">相关药物的具体增量变化</h3>
      </el-row>
      
      <el-row>
        <el-form-item v-for="(item, i) in medicine" :label="item" :prob="item" >
          <el-select v-model="form[item]">
            <el-option label="None" value="0"></el-option>
            <el-option label="平稳" value="1"></el-option>
            <el-option label="上升" value="2"></el-option>
            <el-option label="下降" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-row>

      <br/><br/>

      <el-row>
        <el-form-item label="糖尿病药物是否有变化" prob="change" >
          <el-radio-group v-model="form.change">
            <el-radio label="0">无变化</el-radio>
            <el-radio label="1">有变化</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="糖尿病价值观是否发生改变" prob="diabetesMed" >
          <el-radio-group v-model="form.diabetesMed">
            <el-radio label="0">无改变</el-radio>
            <el-radio label="1">有改变</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
        
      <br/>
      
      <el-row>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" >开始判定</el-button>
          <el-button @click="resetForm('form')" >重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {rmSave, rmAnalysisOne} from "@/api/analysis"
export default {
  data() {
      return {
        form: {
          race: '0',
          sex: '0',
          age: '0',
          admissionType: '0',
          discharge: '0',
          admissionSource: '0',
          timeHospital: '0',
          numLab: '0',
          numProcedures: '0',
          numMedications: '0',
          numOutpatient: '0',
          numEmergency: '0',
          numInpatient: '0',
          numDiagnoses: '0',
          maxGluSerum: '0',
          a1Result: '0',
          metformin: '0',
          repaglinide: '0',
          nateglinide: '0',	
          chlorpropamide: '0',	
          glimepiride: '0',
          acetohexamide: '0',	
          glipizide: '0',	
          glyburide: '0',	
          tolbutamide: '0',	
          pioglitazone: '0',	
          rosiglitazone: '0',	
          acarbose: '0',	
          miglitol: '0',	
          troglitazone: '0',	
          tolazamide: '0',	
          examide: '0',	
          citoglipton: '0',	
          insulin: '0',
          glyburideMetformin: '0',	
          glipizideMetformin: '0',	
          glimepiridePioglitazone: '0',	
          metforminRosiglitazone: '0',	
          metforminPioglitazone: '0',
          change: '0',
          diabetesMed: '0'
        },
        medicine:[
          "metformin",
          "repaglinide",
          "nateglinide",	
          "chlorpropamide",	
          "glimepiride",
          "acetohexamide",	
          "glipizide",	
          "glyburide",	
          "tolbutamide",	
          "pioglitazone",	
          "rosiglitazone",	
          "acarbose",	
          "miglitol",	
          "troglitazone",	
          "tolazamide",	
          "examide",	
          "citoglipton",	
          "insulin",
          "glyburideMetformin",	
          "glipizideMetformin",	
          "glimepiridePioglitazone",	
          "metforminRosiglitazone",	
          "metforminPioglitazone",
        ],
        isDisabled: false,  
        loading: false,    
      }
    },
    methods: {
      // 提交表单
      onSubmit() {
        // 所有组件禁用
        this.isDisabled = true;
        this.loading = true;
        // 将表单数据保存到后端json文件中
        rmSave(this.form).then(res => {
          // 再入院预测
          rmAnalysisOne(this.form).then(res => {
            this.loading = false;
            this.$alert(res, '再入院概率：', {
              dangerouslyUseHTMLString: true
            });
            this.isDisabled = false;
          })
        })
      },

      // 重置表单
      resetForm(formName) {
        console.log(Object.keys(this.form).length)
        for (let key in this.form) {
          this.form[key] = '0';
        }
      }
    }
}
</script>

<style>
.rmForm{
  margin: 20px;
}

.rmForm .el-form-item__label{
  color: white;
  font-size: .29rem;
}

</style>