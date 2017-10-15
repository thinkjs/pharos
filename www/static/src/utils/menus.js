const menus = [
  {
    name:'项目管理',
    icon:'credit-card',
    url:'/site'
  },
  {
    name:'性能分析',
    icon:'line-chart',
    children:[
      {
        name:'速度概况',
        url:'/perf/overview',
      },
      {
        name:'按指标分析',
        url:'/perf/specific',
      }
    ]
  },
  {
    name:'基础设置',
    icon:'user',
    children:[
      {
        name:'用户管理',
        url:'/setting/user'
      }
    ]
  },
];

export default menus;
