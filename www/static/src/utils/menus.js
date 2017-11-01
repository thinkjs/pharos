const menus = [
  {
    name:'性能分析',
    key: 'perf',
    url:'/perf/overview',
    children:[
      {
        name:'概览',
        icon:'desktop',
        url:'/perf/overview',
      },
      {
        name:'数据分析',
        icon:'line-chart',        
        children:[
          {
            name:'按时段',
            url:'/perf/specific/hour',
          },
          {
            name:'按日期',
            url:'/perf/specific/day'
          },
          {
            name:'按耗时区间',
            url:'/perf/specific/interval'
          },
          {
            name:'按操作系统',
            url:'/perf/specific/os'
          },
          {
            name:'按浏览器',
            url:'/perf/specific/browser'
          },
          {
            name:'按地区',
            url:'/perf/specific/region'
          },
        ]
      }
    ]
  },
  {
    name:'项目管理',
    key:'site',
    url:'/site/list',
    children:[
      {
        name:'项目列表',
        icon:'database',
        url:'/site/list'
      },
      {
        name:'性能指标',
        icon:'bars',
        url:'/site/field'
      }
    ]
  },
  {
    name:'基础设置',
    key:'setting',
    url:'/setting/user',    
    children:[
      {
        name:'用户管理',
        icon:'user',
        url:'/setting/user'
      }
    ]
  }
]

export default menus;
