# diabetes-sick-analysis-system
基于Vue/Express以及NLP相关技术完成前端—糖尿病预测模型—数据库之间的数据交互，对前端回到后端的数据AI预测模型进行预测并返回患病概率。 基于医学公式进行数据分析；对分析结果基于Echarts进行可视化，多维度直观地展示其自身健康状况。 使用Echarts+JavaScript构建的可交互的糖尿病知识图谱作为教育板块。



####  1、前端

基于Vue框架，项目热启动于http://localhost:8080，运行以下命令:

```
cd frontend
npm install
npm run dev
```

#### 2、后端

基于node.js express框架，项目热启动于http://localhost:3000，运行以下命令

```
cd backend
npm install
npm run dev
```



项目中涉及到基于深度学习、机器学习的预测模型，需要配置python环境以及安装相关python包

具体需求可见

backend\src\ADModel

backend\src\DhCNNModel

backend\src\RMMModel

三个文件夹中python文件的import需求



#### 3、界面展示

![屏幕截图 2022-03-14 082036](C:\Users\dali\Desktop\屏幕截图 2022-03-14 082036.png)
