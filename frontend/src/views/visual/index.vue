<template>
  <div 
  class="visual-wrap"
  v-loading="loading" 
  element-loading-text="正在分析中，请稍候"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-row class="mainbox">
      <el-col :span="6">
        <div class="column" ref="column">
          <div class="panel probality">
            <h2>
              <el-upload
                class="upload-sick"
                action="http://127.0.0.1:3000/multer/upload"
                :show-file-list="false"
                :before-upload="handleBeforeUpload"
                :on-success="handleSickSuccess"
                :on-error="handleSickError"
                :on-change="handleSickChange"
                :multiple="false"
                :limit="2"
                :file-list="sickFileList"
                :disabled="isDisabled">
                <i class="el-icon-upload" @mouseenter="uploadTip(0)"></i>
              </el-upload>
              <span @click="goTo('predict')">糖尿病患病风险预测</span>
            </h2>
            <div class="chart"></div>
            <div class="panel-footer"></div>
          </div>
          <div class="panel age">
            <h2>年龄分布</h2>
            <div class="chart"></div>
            <div class="panel-footer"></div>
          </div>
          <div class="panel sex">
            <h2>男女比例</h2>
            <div class="chart"></div>
            <div class="panel-footer"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="column">
          <div class="no">
            <div class="no-hd">
              <ul>
                <li>14,0005</li>
                <li>{{totalPatients}}</li>
              </ul>
            </div>
            <div class="no-bd">
              <ul>
                <li>全国人数（万）</li>
                <li>糖尿病患者人数（万）</li>
              </ul>
            </div>
          </div>
          <div class="map" ref="map">
            <div class="chart"></div>
            <div class="map1"></div>
            <div class="map2"></div>
            <div class="map3"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="column">
          <div class="panel readmission">
            <h2>
              <el-upload
                class="upload-readmission"
                action="http://127.0.0.1:3000/multer/upload"
                :show-file-list="false"
                :before-upload="handleBeforeUpload"
                :on-success="handleRmSuccess"
                :on-error="handleRmError"
                :on-change="handleRmChange"
                :multiple="false"
                :limit="2"
                :file-list="rmFileList"
                :disabled="isDisabled">
                <i class="el-icon-upload" @mouseenter="uploadTip(1)"></i>
              </el-upload>
              <span @click="goTo('readmission')">糖尿病患者再入院预测</span>
            </h2>
            <div class="chart">
            </div>
            <div class="panel-footer"></div>
          </div>
          <div class="panel graph">
            <h2 @click="goTo('graph')">知识图谱</h2>
            <div class="chart">
            </div>
            <div class="panel-footer"></div>
          </div>
          <div class="panel data-analysis">
            <h2 >数据分析</h2>
            <div class="chart"></div>
            <div class="panel-footer"></div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const echarts = require('echarts');
import "echarts/map/js/china.js";
import {analysisFile, rmAnalysis} from "@/api/analysis";
import {rmFileToSql, sickFileToSql} from "@/api/sqlTools";
import {download} from "@/api/fileTools";
export default {
  name: 'visual',

  data() {
    return {
      // 城市数据
      cityData: [
        {name: "北京", value: 904.53},
        {name: "天津", value: 532},
        {name: "上海", value: 834},
        {name: "重庆", value: 683},
        {name: "河北", value: 283},
        {name: "河南", value: 345},
        {name: "云南", value: 72},
        {name: "辽宁", value: 194},
        {name: "黑龙江", value: 342},
        {name: "湖南", value: 389},
        {name: "安徽", value: 267},
        {name: "山东", value: 675},
        {name: "新疆", value: 14},
        {name: "江苏", value: 974},
        {name: "浙江", value: 978},
        {name: "江西", value: 528},
        {name: "湖北", value: 144},
        {name: "广西", value: 448},
        {name: "甘肃", value: 197},
        {name: "山西", value: 203},
        {name: "内蒙古", value: 73},
        {name: "陕西", value: 563},
        {name: "吉林", value: 147},
        {name: "福建", value: 112},
        {name: "贵州", value: 373},
        {name: "广东", value: 277},
        {name: "青海", value: 38},
        {name: "西藏", value: 12},
        {name: "四川", value: 215},
        {name: "宁夏", value: 172},
        {name: "海南", value: 77},
        {name: "台湾", value: 123},
        {name: "香港", value: 32},
        {name: "澳门", value: 43},
        {name: "南海诸岛", value: 53}
      ],
      // 概率分布数据
      probaData:[],
      // 年龄分布数据
      ageData: [],
      // 性别分布数据
      sexData:[],
      // 再入院概率分布图
      rmData: [702, 350],
      // 患病风险预测上传的文件列表
      sickFileList: [],
      // 再入院预测上传的文件列表
      rmFileList: [],
      loading: false,
      isDisabled: false
    }
  },

  computed: {
    // 患者总人数
    totalPatients () {
      let total = 0;
      for (const {name, value} of this.cityData){
        total += value;
      }
      total = total.toFixed(2);
      return total.slice(0, -7) + "," + total.slice(-7);
    },
  },

  created() {
    this.$http.get('http://127.0.0.1:3000/result/getResult?type=sick').then(res => {
      this.probaData = Object.values(res.data.proba);
      this.ageData = this.convertType(res.data.age);
      this.sexData = this.convertType(res.data.sex);
      this.$http.get('http://127.0.0.1:3000/result/getResult?type=readmission').then(res => {
        this.rmData = Object.values(res.data);
        this.drawMap(this.cityData);
        this.drawProbaBar(this.probaData);
        this.drawAgePie(this.ageData);
        this.drawSexPie(this.sexData);
        this.drawReadmissionBar(this.rmData);
        this.drawKGGraph();
        this.drawAnalysis();
      })
    });
  },

  mounted() {
    // setInterval(this.updateCityData, 3000);
    this.setHeight();
  },

  watch: {
    // 监视probaData
    probaData: {
      deep: true,
      handler(newValue, oldValue){
        this.drawProbaBar(newValue);
      }
    },

    // 监视ageData
    ageData: {
      deep: true,
      handler(newValue, oldValue){
        this.drawAgePie(newValue);
      }
    },

    // 监视sexData
    sexData: {
      deep: true,
      handler(newValue, oldValue){
        this.drawSexPie(newValue);
      }
    },

    // 监视rmData
    rmData: {
      deep: true,
      handler(newValue, oldValue){
        this.drawReadmissionBar(newValue);
      }
    },
  },


  methods: {
    // 设置每个小组件的高度
    setHeight() {
      let columnWidth = this.$refs.column.offsetWidth;
      let items = ['.probality', '.age', '.sex', '.readmission', '.graph', '.data-analysis'];
      items.forEach(function(e) {
        let panel =document.querySelector(e);
        panel.style.height = parseInt(columnWidth*0.55) + 'px';
      });
      let mapWidth = this.$refs.map.offsetWidth;
      let mapPanel = document.querySelector('.map');
      mapPanel.style.height = parseInt(mapWidth*0.7) + 'px';
    },
    // 鼠标经过上传按钮触发的提示 
    uploadTip(flag) {
      let msg = "";
      if (flag === 0){
        msg = "点击该按钮可上传体检及症状描述数据文件<br/>并对文件中的数据进行患病风险预测";
      }else{
        msg = "点击该按钮可上传糖尿病患者相关信息数据文件<br/>并对文件中的数据进行再入院风险预测"
      }
      this.$notify.closeAll(); //提示之前关闭所有提示 
      this.$notify({
        title: '提示',
        dangerouslyUseHTMLString: true,
        message: '<strong>' + msg +'</strong>',
        type: 'info',
        duration: 2000
      });
    },

    // 更新城市糖尿病人数数据
    updateCityData() {
      let length = this.cityData.length;  // 城市的个数
      let increment = 0; //增量
      let reduction = 0; //减量
      // 随机修改0-length个城市的数据
      for(let i=0; i < Math.floor(Math.random()*length); i++) {
        let idx = Math.floor(Math.random()*length) // 随机选取要修改的元素
        let proba = Math.random();  // 加或者减的概率（大于0.5加，小于0.5减）
        if (proba > 0.5) {
          increment = Math.random()
          this.cityData[idx].value = parseFloat((this.cityData[idx].value + increment).toFixed(2));
        }else{
          reduction = Math.random() 
          if (this.cityData[idx].value > reduction){
            this.cityData[idx].value = parseFloat((this.cityData[idx].value - reduction).toFixed(2));
          }
        }
        this.drawMap(this.cityData);
      }
    },

    // 绘制糖尿病患者人数地区分布热力图
    drawMap(cityData) {
      const myEcharts = echarts.init(document.querySelector(".map .chart"));

      var yMax = 1000;
      var dataShadow = [];

      var titledata = [];
      var bartop10 = [];
      function NumDescSort(a, b) {
        return b.value - a.value;
      }

      function NumAsceSort(a, b) {
        return a.value - b.value;
      }
      // 先进行一次降序排序，找出最大的前十个
      cityData.sort(NumDescSort);

      for (var i = 0; i < 20; i++) {
        var top10 = {
          name: cityData[i].name,
          value: cityData[i].value
        };
        bartop10.push(top10);
        dataShadow.push(yMax);
      }

      bartop10.sort(NumAsceSort);
      for (var i = 0; i < bartop10.length; i++) {
          titledata.push(bartop10[i].name);
      }

      let option = {
        title: [{
            show: false,
            text: '地域分布',
          },
          {
            show: true,
            text: '省份/糖尿病患者数(万)',
            top:"50",
            right: '0',
            textStyle: {
              color: '#FFFFFF',
              fontSize: 12
            }
          }
        ],
        tooltip: {
          trigger: "item"
        },
        legend: {
          show: false
        },
        grid: {
          // 仅仅控制条形图的位置
          show: false,
          containLabel: false,
          right: 10,
          top: 80,
          bottom: 0,
          width: '15%'
        },
        visualMap: {
          type: 'continuous',
          min: 0,
          max: 1000,
          text: ['多', '少'],
          textStyle: {
            color: '#FFFFFF',
            fontSize: 14
          },
          seriesIndex: [0, 2],
          dimension: 0,
          realtime: false,
          left: 0,
          itemWidth: 18,
          itemHeight: 100,
          calculable: true,
          inRange: {
            color: ['rgba(159,205,253,0.50)', '#60ACFC'],
            symbolSize: [100, 100]
          },
          outOfRange: {
            color: ['#eeeeee'],
            symbolSize: [100, 100]
          },
        },
        toolbox: {
          show: false
        },

        xAxis: [{
          type: "value",
          position: 'top',
          inside: false,
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          },
          margin: 10
        }],
        yAxis: [{
          type: "category",
          boundaryGap: true,
          axisLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#FFFFFF',
              fontSize: 12
            },
            align: "right",
            margin: 10,
            showMaxLabel: true,
          },
          data: titledata
        }],
        series: [
          {
          name: "糖尿病患者数",
          type: "map",
          mapType: "china",
          left: '50',
          width: '70%',
          roam: 'move',
          mapValueCalculation: "sum",
          zoom: 1,
          selectedMode: false,
          showLegendSymbol: false,
          label: {
            normal: {
              textStyle: {
                  color: '#666'
                }
            },
            emphasis: {
              textStyle: {
                color: '#234EA5'
              }
            }
          },
          itemStyle: {
              normal: {
                  areaColor: '#EEEEEE',
                  borderColor: '#FFFFFF'
              },
              emphasis: {
                  areaColor: '#E5F39B'
              }
          },
          data: cityData
        },
        {
          name: "背景",
          type: "bar",
          roam: false,
          visualMap: false,
          itemStyle: {
            color: "#eeeeee",
            opacity: 0.5
          },
          label: {
            show: false
          },
          emphasis: {
            itemStyle: {
              color: "#eeeeee",
              opacity: 0.5
            },
            label: {
              show: false
            },
          },
          silent: true,
          barWidth: 18,
          barGap: '-100%',
          data: dataShadow,
          animation: false
        },
        {
          name: "占比",
          type: "bar",
          roam: false,
          visualMap: false,
          // itemStyle: {
          //   color: "#60ACFC"
          // },
          barWidth: 18,
          label: {
            normal: {
              show: true,
              fontSize: 12,
              position: 'insideLeft'
            },
            emphasis: {
              show: true
            }
          },
          data: bartop10
        }]
      }
      myEcharts.setOption(option);  
      window.addEventListener("resize", function() {
        myEcharts.resize();
      });                                                   
    },

    // 绘制患病概率分布图
    drawProbaBar(probaData) {
      // 实例化对象
      const myChart = echarts.init(document.querySelector(".probality .chart"));
      const colors = ["#2f89cf","#585eaa", "#50b7c1", "#faa755"];
      // 指定配置和数据
      let option = {
        color: colors,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "1%",
          top: "5%",
          right: "1%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            name: "患病概率",
            nameLocation: "center",
            nameTextStyle:{
              color: "#FFFFFF",
              fontSize: 12,
            },
            nameGap: 25,
            data: ["<25%", "25%-50%", "50%-75%", ">75%"],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              textStyle: {
                color: "rgba(255,255,255,.6)",
                fontSize: "12"
              }
            },
            axisLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              textStyle: {
                color: "rgba(255,255,255,.6)",
                fontSize: "12"
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)"
                // width: 1,
                // type: "solid"
              }
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)"
              }
            }
          }
        ],
        series: [
          {
            name: "人数",
            type: "bar",
            barWidth: "35%",
            data: this.probaData,
            itemStyle: {
              normal:{
                barBorderRadius: 5,
                color: function(params){
                  return colors[params.dataIndex]; 
                  // 取每条数据的 index 对应 colors 中的 index 返回这个颜色
                }
              }
            }
          }
        ]
      };
      // 把配置给实例对象
      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },

    // 绘制患者年龄分布图
    drawAgePie(ageData) {
      //实例化对象
      const myChart = echarts.init(document.querySelector(".age .chart"));
      const colors = ["#2f89cf","#585eaa", "#50b7c1", "#faa755", "#f3715c", "#afdfe4"];
      // 2. 指定配置项和数据
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          bottom: 0,
          left: 'center',
          itemWidth: 10,
          textStyle: {
            color:"rgba(255,255,255,.5)",
          },
          data: ['婴幼儿', '少儿', '青少年', '青年', '中年', '老年']
        },
        series: [
          {
            name: '人数',
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: this.ageData,
            itemStyle: {
              normal:{
                color: function(params){
                  return colors[params.dataIndex]; 
                  // 取每条数据的 index 对应 colors 中的 index 返回这个颜色
                }
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              }
            }
          }
        ]
      };
      // 将配置项和数据给实例化对象
      myChart.setOption(option);
      window.addEventListener("resize",function() {
        myChart.resize()
      })
    },

    // 绘制患者性别分布图
    drawSexPie(sexData) {
      //实例化对象
      const myChart = echarts.init(document.querySelector(".sex .chart"));
      var symbols = [
      'path://M18.2629891,11.7131596 L6.8091608,11.7131596 C1.6685112,11.7131596 0,13.032145 0,18.6237673 L0,34.9928467 C0,38.1719847 4.28388932,38.1719847 4.28388932,34.9928467 L4.65591984,20.0216948 L5.74941883,20.0216948 L5.74941883,61.000787 C5.74941883,65.2508314 11.5891201,65.1268798 11.5891201,61.000787 L11.9611506,37.2137775 L13.1110872,37.2137775 L13.4831177,61.000787 C13.4831177,65.1268798 19.3114787,65.2508314 19.3114787,61.000787 L19.3114787,20.0216948 L20.4162301,20.0216948 L20.7882606,34.9928467 C20.7882606,38.1719847 25.0721499,38.1719847 25.0721499,34.9928467 L25.0721499,18.6237673 C25.0721499,13.032145 23.4038145,11.7131596 18.2629891,11.7131596 M12.5361629,1.11022302e-13 C15.4784742,1.11022302e-13 17.8684539,2.38997966 17.8684539,5.33237894 C17.8684539,8.27469031 15.4784742,10.66467 12.5361629,10.66467 C9.59376358,10.66467 7.20378392,8.27469031 7.20378392,5.33237894 C7.20378392,2.38997966 9.59376358,1.11022302e-13 12.5361629,1.11022302e-13',
      'path://M28.9624207,31.5315864 L24.4142575,16.4793596 C23.5227152,13.8063773 20.8817445,11.7111088 17.0107398,11.7111088 L12.112691,11.7111088 C8.24168636,11.7111088 5.60080331,13.8064652 4.70917331,16.4793596 L0.149791395,31.5315864 C-0.786976655,34.7595013 2.9373074,35.9147532 3.9192135,32.890727 L8.72689855,19.1296485 L9.2799493,19.1296485 C9.2799493,19.1296485 2.95992025,43.7750224 2.70031069,44.6924335 C2.56498417,45.1567684 2.74553639,45.4852068 3.24205501,45.4852068 L8.704461,45.4852068 L8.704461,61.6700801 C8.704461,64.9659872 13.625035,64.9659872 13.625035,61.6700801 L13.625035,45.360657 L15.5097899,45.360657 L15.4984835,61.6700801 C15.4984835,64.9659872 20.4191451,64.9659872 20.4191451,61.6700801 L20.4191451,45.4852068 L25.8814635,45.4852068 C26.3667633,45.4852068 26.5586219,45.1567684 26.4345142,44.6924335 C26.1636859,43.7750224 19.8436568,19.1296485 19.8436568,19.1296485 L20.3966199,19.1296485 L25.2043926,32.890727 C26.1862111,35.9147532 29.9105828,34.7595013 28.9625083,31.5315864 L28.9624207,31.5315864 Z M14.5617154,0 C17.4960397,0 19.8773132,2.3898427 19.8773132,5.33453001 C19.8773132,8.27930527 17.4960397,10.66906 14.5617154,10.66906 C11.6274788,10.66906 9.24611767,8.27930527 9.24611767,5.33453001 C9.24611767,2.3898427 11.6274788,0 14.5617154,0 L14.5617154,0 Z',
      'path://M512 292.205897c80.855572 0 146.358821-65.503248 146.358821-146.358821C658.358821 65.503248 592.855572 0 512 0 431.144428 0 365.641179 65.503248 365.641179 146.358821 365.641179 227.214393 431.144428 292.205897 512 292.205897zM512 731.282359c-80.855572 0-146.358821 65.503248-146.358821 146.358821 0 80.855572 65.503248 146.358821 146.358821 146.358821 80.855572 0 146.358821-65.503248 146.358821-146.358821C658.358821 796.273863 592.855572 731.282359 512 731.282359z'
      ];
      var bodyMax = 100; //指定图形界限的值
      var labelSetting = {
      normal: {
          show: true,
          position: 'bottom',
          offset: [0, 5],
          formatter: function(param) {
            return (param.value / bodyMax * 100).toFixed(0) + '%';
          },
          textStyle: {
            fontSize: 12,
            fontFamily: 'Arial',
          }
        }
      };
      // 2. 指定配置项和数据
      let option = {
        tooltip: {
          show: true, //鼠标放上去显示悬浮数据
        },
        color:['#69cce6','#ff8282'],
        grid: {
          left: '40%',
          right: '40%',
          top: '30%',
          bottom: '35%',
          containLabel: true
        },
        xAxis: {
          // position: 'left',
          data: ['男性', '女性'],
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show:false,
          }
        },
        yAxis: {
          max: bodyMax,
          splitLine: {
            show: false
          },
          axisTick: {
            // 刻度线
            show: false
          },
          axisLine: {
            // 轴线
            show: false
          },
          axisLabel: {
            // 轴坐标文字
            show: false
          }
        },
        legend: {
          top: "90%",
          right: "0%",
          itemWidth: 10,
          itemHeight: 10,
          data: ["男性", "女性"],
          textStyle: {
            color: "rgba(255,255,255,.5)",
            fontSize: "12"
          }
        },
        series: [{
          name: '男性',
          type: 'pictorialBar',
          symbolClip: true,
          symbolBoundingData: bodyMax,
          label: labelSetting,
          data: [{
            value: (sexData[0].value) / (sexData[0].value + sexData[1].value) * 100,
            symbol: symbols[0],
            itemStyle: {
              normal: {
                color: 'rgba(105,204,230)' //单独控制颜色
              }
            },
          },
          {

          }],
          // markLine: markLineSetting,
          z: 10
        },
        {
          name: '女性',
          type: 'pictorialBar',
          symbolClip: true,
          symbolBoundingData: bodyMax,
          label: labelSetting,
          data: [{
            },
            {
              value: (sexData[1].value) / (sexData[0].value + sexData[1].value) * 100,
              symbol: symbols[1],
              itemStyle: {
                normal: {
                  color: 'rgba(255,130,130)' //单独控制颜色
                }
              },
            }
          ],
          // markLine: markLineSetting,
          z: 10
        },
        {
          // 设置背景底色，不同的情况用这个
          // name: 'full',
          type: 'pictorialBar', //异型柱状图 图片、SVG PathData
          symbolBoundingData: bodyMax,
          animationDuration: 0,
          itemStyle: {
            normal: {
              color: '#ccc' //设置全部颜色，统一设置
            }
          },
          z: 10,
          data: [{
            itemStyle: {
              normal: {
                color: 'rgba(105,204,230,0.40)' //单独控制颜色
              }
            },
            value: 100,
            symbol: symbols[0]
          },
          {
            itemStyle: {
              normal: {
                color: 'rgba(255,130,130,0.40)' //单独控制颜色
              }
            },
            value: 100,
            symbol: symbols[1]
          }
          ]
        },
        {
          name:'男女比例',
          type:'pie',
          radius: ['65%', '85%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: false,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data:sexData,
        }
      ]};
      
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },

    // 绘制再入院概率分布图
    drawReadmissionBar(rmData) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.querySelector(".readmission .chart"));
      var proba1 = (rmData[0]/(rmData[0] + rmData[1])*100).toFixed(2);
      var proba2 = (rmData[1]/(rmData[0] + rmData[1])*100).toFixed(2);
      var myColor = ["#1089E7", "#F57474"];
      let option = {
        //图标位置
        grid: {
          top: "10%",
          left: "22%",
          bottom: "10%"
        },
        xAxis: {
          show: false
        },
        yAxis: [
          {
            show: true,
            data: ["<50%", ">50%"],
            inverse: true,
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#fff",

              rich: {
                lg: {
                  backgroundColor: "#339911",
                  color: "#fff",
                  borderRadius: 15,
                  // padding: 5,
                  align: "center",
                  width: 15,
                  height: 15
                }
              }
            }
          },
          {
            show: true,
            inverse: true,
            data: rmData,
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                fontSize: 12,
                color: "#fff"
              }
            }
          }
        ],
        series: [
          {
            name: "条",
            type: "bar",
            yAxisIndex: 0,
            data: [proba1, proba2],
            barCategoryGap: 50,
            barWidth: 20,
            itemStyle: {
              normal: {
                barBorderRadius: 20,
                color: function(params) {
                  var num = myColor.length;
                  return myColor[params.dataIndex % num];
                }
              }
            },
            label: {
              normal: {
                show: true,
                position: "inside",
                formatter: "{c}%"
              }
            }
          },
          {
            name: "框",
            type: "bar",
            yAxisIndex: 1,
            barCategoryGap: 50,
            data: [100, 100, 100],
            barWidth: 24,
            itemStyle: {
              normal: {
                color: "none",
                borderColor: "#00c1de",
                borderWidth: 2,
                barBorderRadius: 15
              }
            }
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },

    // 绘制糖尿病知识图谱
    drawKGGraph() {
      const myChart = echarts.init(document.querySelector(".graph .chart"));

      let option = {
        legend: {
          textStyle: {
            color:"#fff",
          }
        },
        series: [
          {
            type: 'graph', // 类型:关系图
            layout: 'force',
            legendHoverLink: true,
            symbolSize: 70,
            zoom: 0.2,
            force: {
              repulsion: 2000,
              edgeLength: 10,
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: 10,
            draggable: true,
            roam: true,
            legend: [{ name: '疾病' }, { name: '症状' }, { name: '检查' }, { name: '病因' },  { name: '关系'}],
            label: {
              show: true,
              position: 'inside',
              fontFamily: 'Arial', //字体系列
              fontSize: 10,
              formatter: '{b}',
            },
            edgeLabel: {
              // show: true,
              position: 'middle',
              formatter: function (x) {
                return x.data.name;
              },
              fontSize: 10,
            },
            // roma: true,
            categories: [{ name: '疾病' }, { name: '症状' }, { name: '检查' }, { name: '治疗方法' },  { name: '关系'}],
            data: [
              {
                name: '糖尿病',
                category: '疾病',
              },
              {
                name: '症状',
                category: '关系',
              },
              {
                name: '检查指标',
                category: '关系',
              },
              {
                name: '并发症',
                category: '关系',
              },
              {
                name: '治疗',
                category: '关系',
              },
              {
                name: '类型',
                category: '关系',
              },
              {
                name: '预防',
                category: '关系',
              },
              {
                name: '多食',
                category: '症状',
              },
              {
                name: '多饮',
                category: '症状',
              },
              {
                name: '多尿',
                category: '症状',
              },
              {
                name: '运动治疗',
                category: '治疗方法',
              },
              {
                name: '手术治疗',
                category: '治疗方法',
              },
              {
                name: '营养治疗',
                category: '治疗方法',
              },
              {
                name: '控制血糖',
                category: '治疗方法',
              },
              {
                name: '控制血压',
                category: '治疗方法',
              },
              {
                name: '控制血脂',
                category: '治疗方法',
              },
              {
                name: '血糖',
                category: '检查',
              },
              {
                name: '糖化血红蛋白',
                category: '检查',
              },
              {
                name: '糖尿病肾变',
                category: '疾病',
              },
              {
                name: '糖尿病足',
                category: '疾病',
              },
              {
                name: '糖尿病神经病变',
                category: '疾病',
              },
              {
                name: '1型糖尿病',
                category: '疾病',
              },
              {
                name: '2型糖尿病',
                category: '疾病',
              },
              {
                name: '妊娠型糖尿病',
                category: '疾病',
              },
            ],
            links:[
              {
                source: '糖尿病',
                target: '症状',
                name: "关系",
              },
              {
                source: '症状',
                target: '多食',
              },
              {
                source: '症状',
                target: '多饮',
              },
              {
                source: '症状',
                target: '多尿',
              },
              {
                source: '糖尿病',
                target: '检查指标',
                name: "关系",
              },
              {
                source: '检查指标',
                target: '血糖',
              },{
                source: '检查指标',
                target: '糖化血红蛋白',
              },
              {
                source: '糖尿病',
                target: '并发症',
                name: "关系",
              },
              {
                source: '并发症',
                target: '糖尿病肾变',
              },
              {
                source: '并发症',
                target: '糖尿病足',
              },
              {
                source: '并发症',
                target: '糖尿病神经病变',
              },
              {
                source: '糖尿病',
                target: '治疗',
                name: "关系",
              },
              {
                source: '治疗',
                target: '手术治疗',
              },
              {
                source: '治疗',
                target: '运动治疗',
              },
              {
                source: '治疗',
                target: '营养治疗',
              },
              {
                source: '糖尿病',
                target: '类型',
                name: '关系',
              },
              {
                source: '类型',
                target: '1型糖尿病',
              },
              {
                source: '类型',
                target: '2型糖尿病',
              },
              {
                source: '类型',
                target: '妊娠型糖尿病',
              },
              {
                source: '糖尿病',
                target: '预防',
                name: '关系',
              },
              {
                source: '预防',
                target: '控制血糖',
              },
              {
                source: '预防',
                target: '控制血脂',
              },
              {
                source: '预防',
                target: '控制血压',
              },
            ]
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      })
    },

    // 绘制数据分析图例
    drawAnalysis() {
      const myChart = echarts.init(document.querySelector(".data-analysis .chart"));
      
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: "#dddc6b"
            }
          }
        },
        legend: {
          top: "0%",
          textStyle: {
            color: "rgba(255,255,255,.5)",
            fontSize: "12"
          }
        },
        grid: {
          left: "10",
          top: "30",
          right: "10",
          bottom: "10",
          containLabel: true
        },

        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLabel: {
              textStyle: {
                color: "rgba(255,255,255,.6)",
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,.2)"
              }
            },

            data: [
              "01",
              "02",
              "03",
              "04",
              "05",
              "06",
              "07",
              "08",
              "09",
              "11",
              "12",
              "13",
              "14",
              "15",
              "16",
              "17",
              "18",
              "19",
              "20",
              "21",
              "22",
              "23",
              "24",
              "25",
              "26",
              "27",
              "28",
              "29",
              "30"
            ]
          },
          {
            axisPointer: { show: false },
            axisLine: { show: false },
            position: "bottom",
            offset: 20
          }
        ],

        yAxis: [
          {
            type: "value",
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)"
              }
            },
            axisLabel: {
              textStyle: {
                color: "rgba(255,255,255,.6)",
                fontSize: 12
              }
            },

            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)"
              }
            }
          }
        ],
        series: [
          {
            name: "1型糖尿病",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                color: "#0184d5",
                width: 2
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(1, 132, 213, 0.4)"
                    },
                    {
                      offset: 0.8,
                      color: "rgba(1, 132, 213, 0.1)"
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)"
              }
            },
            itemStyle: {
              normal: {
                color: "#0184d5",
                borderColor: "rgba(221, 220, 107, .1)",
                borderWidth: 12
              }
            },
            data: [
              30,
              40,
              30,
              40,
              30,
              40,
              30,
              60,
              20,
              40,
              20,
              40,
              30,
              40,
              30,
              40,
              30,
              40,
              30,
              60,
              20,
              40,
              20,
              40,
              30,
              60,
              20,
              40,
              20,
              40
            ]
          },
          {
            name: "2型糖尿病",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                color: "#00d887",
                width: 2
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0, 216, 135, 0.4)"
                    },
                    {
                      offset: 0.8,
                      color: "rgba(0, 216, 135, 0.1)"
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)"
              }
            },
            itemStyle: {
              normal: {
                color: "#00d887",
                borderColor: "rgba(221, 220, 107, .1)",
                borderWidth: 12
              }
            },
            data: [
              50,
              30,
              50,
              60,
              10,
              50,
              30,
              50,
              60,
              40,
              60,
              40,
              80,
              30,
              50,
              60,
              10,
              50,
              30,
              70,
              20,
              50,
              10,
              40,
              50,
              30,
              70,
              20,
              50,
              10,
              40
            ]
          }
        ]
      };
      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      })
    },

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
        this.$notify.closeAll(); //提示之前关闭所有提示 
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
     * @abstract 糖尿病患病风险预测数据文件上传成功后的执行的回调，预测患病概率，并统计
     * @param file element-ui uplaod 组件的文件对象
     */
    handleSickSuccess(file) {
      console.log("上传的糖尿病患病风险预测数据："+file.originalname);
      this.isDisabled = true;
      this.loading = true;
      analysisFile({ filename: file.originalname}).then(res => {
        this.isDisabled = false;
        this.loading = false;
        let _res = JSON.parse(res);  // 将json字符串转换成json对象
        // 分析成功
        if(_res.code === 200){
          // 更新数据
          this.probaData = Object.values(_res.data.proba);
          this.ageData = this.convertType(_res.data.age);
          this.sexData = this.convertType(_res.data.sex);
          download(file.originalname.slice(0, -4) + "_pred.csv");
          console.log(res);
          this.$confirm("分析成功!  是否将患病风险预测结果保存到数据库？", "提示", {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            sickFileToSql({ filename: file.originalname}).then(res => {
              this.$message("分析成功");
            })
          }).catch(() => {
            this.$message("预测记录未保存！");
          })
        } else {
          this.$message("分析失败！文件内部格式错误");
        }
      }).catch(e => {
        console.log("请求后端数据失败！");
        this.loading = false;
        this.isDisabled = false;
      });
    },

    /**
     * @abstract 糖尿病患者在入院预测数据文件上传成功后的执行的回调，预测再入院概率，并统计
     * @param file element-ui uplaod 组件的文件对象
     */
    handleRmSuccess(file){
      console.log("上传的糖尿病患者再入院预测数据文件："+file.originalname);
      this.isDisabled = true;
      this.loading = true;
      rmAnalysis({filename: file.originalname}).then(res => {
        this.isDisabled = false;
        this.loading = false;
        let _res = JSON.parse(res);  // 将json字符串转换成json对象
        // 分析成功
        if(_res.code === 200) {
          let result = _res.data.split(" ");
          this.rmData = [parseInt(result[0]), parseInt(result[1])];
          download(file.originalname.slice(0, -4) + "_pred.csv");
          this.$confirm("分析成功！ 是否将再入院预测结果保存到数据库？", "提示", {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
              rmFileToSql({filename: file.originalname}).then(res => {
              this.$message(res.msg);
            })
          }).catch(() => {
            this.$message("预测记录未保存！");
          })
        }else {
          this.$message("分析失败！文件内部格式错误");
        }
      }).catch(e => {
        console.log("请求后端数据失败！");
        this.loading = false;
        this.isDisabled = false;
      });
    },

    /**
     * @abstract 上传失败的回调
     * @param res 后台返回的错误信息
     * @param file element-ui uplaod 组件的文件对象
     */
    handleSickError(res, file) {
      console.log("上传失败：", res);
      this.$message.error("上传失败！");
      this.resetFileList('sick');
    },

    handleRmError(res, file) {
      console.log("上传失败：", res);
      this.$message.error("上传失败！");
      this.resetFileList('rm');
    },

    /**
     * @abstract 文件列表更新的回调
     * @param file element-ui uplaod 组件的文件对象
     * @param fileList element-ui uplaod 组件的绑定的文件列表
     */
    handleSickChange(file, fileList) {
      this.sickFileList = fileList.slice(-1);
      console.log("添加文件：", this.sickFileList[0]);
    },

    handleRmChange(file, fileList) {
      this.rmFileList = fileList.slice(-1);
      console.log("添加文件：", this.rmFileList[0]);
    },

    /**
     * @abstract 重置上传文件状态
     */
    resetFileList(flag) {
      if (flag === "sick"){
        this.sickFileList = [];
      }else{
        this.rmFileList = [];
      }
    },

    // 路由跳转
    goTo(index) {
      this.$router.push(index);
    },

    // 转换数据格式
    convertType(data){
      let result = [];
      for (var key in data){
        result.push({value: data[key], name: key});
      }
      return result;
    }
  }
}

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
li {
  list-style: none;
}
.mainbox {
  min-width: 12.8rem;
  padding: 0.125rem 0.125rem 0;
}
.mainbox .column:nth-child(2) {
  margin: 0 0.125rem 0.1875rem;
  overflow: hidden;
}
.panel {
  position: relative;
  min-height: 4.25rem;
  border: 1px solid rgba(25, 186, 139, 0.17);
  background: rgba(255, 255, 255, 0.04) url(../../assets/line1.png);
  padding: 0 0.1875rem 0.5rem;
  margin-bottom: 0.1875rem;
}
.panel::before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 10px;
  height: 10px;
  border-top: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5;
}
.panel::after {
  position: absolute;
  top: 0;
  right: 0;
  content: "";
  width: 10px;
  height: 10px;
  border-top: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5;
}
.panel .panel-footer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}
.panel .panel-footer::before {
  position: absolute;
  bottom: 0;
  left: 0;
  content: "";
  width: 10px;
  height: 10px;
  border-bottom: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5;
}
.panel .panel-footer::after {
  position: absolute;
  bottom: 0;
  right: 0;
  content: "";
  width: 10px;
  height: 10px;
  border-bottom: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5;
}

.upload-sick {
  display: inline;

}
.upload-readmission {
  display: inline;
}
.panel h2 {
  height: 0.6rem;
  line-height: 0.6rem;
  text-align: center;
  color: #fff;
  font-size: 0.3rem;
  font-weight: 400;
}

.panel .chart {
  height: 95%;
}

.probality span:hover, .readmission span:hover, .graph h2:hover {
  color: antiquewhite;
  cursor: pointer;
}
.no {
  background: rgba(101, 132, 226, 0.1);
  padding: 0.1875rem;
}
.no .no-hd {
  position: relative;
  border: 1px solid rgba(25, 186, 139, 0.17);
}
.no .no-hd::before {
  content: "";
  position: absolute;
  width: 30px;
  height: 10px;
  border-top: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5;
  top: 0;
  left: 0;
}
.no .no-hd::after {
  content: "";
  position: absolute;
  width: 30px;
  height: 10px;
  border-bottom: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5;
  right: 0;
  bottom: 0;
}
.no .no-hd ul {
  display: flex;
}
.no .no-hd ul li {
  position: relative;
  flex: 1;
  text-align: center;
  height: 1rem;
  line-height: 1rem;
  font-size: 0.875rem;
  color: #ffeb7b;
  padding: 0.05rem 0;
  font-family: electronicFont;
  font-weight: bold;
}
.no .no-hd ul li:first-child::after {
  content: "";
  position: absolute;
  height: 50%;
  width: 1px;
  background: rgba(255, 255, 255, 0.2);
  right: 0;
  top: 25%;
}
.no .no-bd ul {
  display: flex;
}
.no .no-bd ul li {
  flex: 1;
  height: 0.5rem;
  line-height: 0.5rem;
  text-align: center;
  font-size: 0.225rem;
  color: rgba(255, 255, 255, 0.7);
  padding-top: 0.125rem;
}
.map {
  position: relative;
  min-height: 10.125rem;
}
.map .chart {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  height: 100%;
  width: 100%;
}
.map .map1,
.map .map2,
.map .map3 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6.475rem;
  height: 6.475rem;
  background: url(../../assets/map.png) no-repeat;
  background-size: 100% 100%;
  opacity: 0.3;
}
.map .map2 {
  width: 8.0375rem;
  height: 8.0375rem;
  background-image: url(../../assets/lbx.png);
  opacity: 0.6;
  animation: rotate 15s linear infinite;
  z-index: 2;
}
.map .map3 {
  width: 7.075rem;
  height: 7.075rem;
  background-image: url(../../assets/jt.png);
  animation: rotate1 10s linear infinite;
}
@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
@keyframes rotate1 {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
}
@media screen and (max-width: 1024px) {
  html {
    font-size: 42px !important;
  }
}
@media screen and (min-width: 1920) {
  html {
    font-size: 80px !important;
  }
}
</style>
