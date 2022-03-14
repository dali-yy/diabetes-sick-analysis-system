<template>
  <div class="rmRecord-wrap">
    <el-table
        :data="tableData.filter(data => !search || data.race.toLowerCase().includes(search.toLowerCase()))"
        height="700"
        border
        stripe
        style="width: 100%">

        <el-table-column label="糖尿病患者相关信息">
            <el-table-column
            v-if="false"
            prop="id"
            label="id"
            width="100">
            </el-table-column>
            <el-table-column
            v-for="(item, index) in headers.slice(0,-1)"
            :key="index"
            :prop="item"
            :label="item"
            align="center"
            width="150">
            </el-table-column>
        </el-table-column>
        
        <el-table-column
        prop="proba"
        label="再入院概率"
        sortable 
        align="center"
        width="150"
        fixed="right">
        </el-table-column>

        <el-table-column fixed="right" align="center" width="250">
            <template slot="header" slot-scope="scope">
                <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"/>
            </template>
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {rmGetList, rmDelete} from '@/api/sqlTools'
export default {
    data() {
        return {
            tableData: [],
            headers: [
                "race",
                "sex",
                "age",
                "admissionType",
                "discharge",
                "admissionSource",
                "timeHospital",
                "numLab",
                "numProcedures",
                "numMedications",
                "numOutpatient",
                "numEmergency",
                "numInpatient",
                "numDiagnoses",
                "maxGluSerum",
                "a1Result",
                "metformin",
                "repaglinide",
                'nateglinide',	
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
                "change",
                "diabetesMed",
                "proba"
            ],
            search: ""
        }
    },
    created () {
      this.getBaseList()
    },

    methods: {
        
        getBaseList() {
        /**
         * 获取所有再入院的预测记录
         */
            rmGetList().then(res => {
            this.tableData = [];
            let tmp = {};
            let race = ["Caucasian", "AfricanAmerican", "Asina", "Hispanic"];
            let sex = ["", "女"];
            let admissionType = ["None", "普通", "紧急入院"];
            let discharge = ["None", "转院回家", "转向其他护理机构", "病情加重转向高级医院"];
            let admissionSource = ["None", "从家里来", "从普通护理机构来", "从紧急病房来"];
            let detection1 = ["None", "Norm", ">200", ">300"];
            let detection2 = ["None", "Norm", ">7", ">8"];
            let medicine = ['None', 'Steady', 'Up', 'Down'];

            res.forEach(element => {
                tmp = element;                
                tmp["race"] = race[parseInt(tmp["race"])];
                tmp["sex"] = (tmp["sex"] === 0) ? "女" : "男";
                tmp["admissionType"] = admissionType[parseInt(tmp["admissionType"])];
                tmp["discharge"] = discharge[parseInt(tmp["discharge"])];
                tmp["admissionSource"] = admissionSource[parseInt(tmp["admissionSource"])];
                tmp["maxGluSerum"] = detection1[parseInt(tmp["maxGluSerum"])];
                tmp["a1Result"] = detection1[parseInt(tmp["a1Result"])];
                for (let key of this.headers.slice(16, 38)) {
                    tmp[key] = medicine[parseInt(tmp[key])];
                }
                tmp["change"] = (tmp["change"] === 0) ? "无变化" : "有变化";
                tmp["diabetesMed"] = (tmp["diabetesMed"] === 0) ? "无改变" : "有改变";
                this.tableData.push(tmp)
            });
        })
        },

        handleDelete(index, row) {
        /**
         * 删除记录
         */
            console.log("删除再入院预测记录：" + row.id);
            rmDelete({"id": row.id}).then(res => {
                if (res['code'] == 200) {
                    // 更新列表
                    this.getBaseList();
                } 
                this.$alert(res['msg'], '操作结果', {});
            })
        }
    }
}
</script>

<style>
.rmRecord-wrap {
    margin: 20px;
}
</style>