// 第一步：引入必要的文件
import Vue from 'vue' //加载全局组件时，都需要引入vue
import Router from 'vue-router'  // 引入vue-router

// 引入路由中需要用到的组件
import Layout from '@/layout/index'

// 第二步：加载Router
Vue.use(Router)
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

// 第三步：配置路由实例
export default new Router({
  // mode: "hash",  // 路由模式：默认为hash，如果改为history，需要后端进行配合
  // base: "/", //基路径，默认为'/'，如果整个单页面应用再/app/下，base就应该设'/app/'，一般可以写成__dirname,在webpack中配置.
  routes: [
    {
      path: '/',
      redirect: '/visual',
      component: Layout,
      children: [
        {
          path: 'predict',
          component: () => import('@/views/predict/sick')
        },
        {
          path: 'readmission',
          component: () => import('@/views/predict/readmission')
        },
        {
          path: 'graph',
          component: () => import('@/views/graph')
        },
        {
          path: 'sick-history',
          component: () => import('@/views/history/sickRecord')
        },
        {
          path: 'rm-history',
          component: () => import('@/views/history/rmRecord')
        },
        {
          path: 'visual',
          component: () => import('@/views/visual')
        },
        {
          path: 'ano-detec',
          component: () => import('@/views/ano-detec')
        },
        {
          path: 'asso-rule',
          component: () => import('@/views/asso-rule')
        }
      ]
    },
  ]
})
