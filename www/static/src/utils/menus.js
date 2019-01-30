const menus = [
  {
    name: '项目列表',
    key: 'site-list',
    url: '/site/list',
    hideSlider: true,
    hideProject: true,
    children: [
      {
        name: '项目列表',
        icon: 'database',
        url: '/site/list'
      }
    ]
  },
  {
    name: '性能分析',
    key: 'perf',
    url: '/perf/overview',
    children: [
      {
        name: '概览',
        icon: 'desktop',
        url: '/perf/overview'
      },
      {
        name: '数据分析',
        icon: 'line-chart',
        children: [
          {
            name: '按时段',
            url: '/perf/specific/hour'
          },
          {
            name: '按日期',
            url: '/perf/specific/day'
          },
          {
            name: '按耗时区间',
            url: '/perf/specific/interval'
          },
          {
            name: '按操作系统',
            url: '/perf/specific/os'
          },
          {
            name: '按浏览器',
            url: '/perf/specific/browser'
          }
          // {
          //   name:'按地域',
          //   url:'/perf/specific/region'
          // },
        ]
      },
      {
        name: '报错监控',
        icon: 'bell',
        children: [
          {
            name: '实时数据（分）',
            url: '/perf/js-error/day.mins'
          },
          {
            name: '实时数据（时）',
            url: '/perf/js-error/day.hour'
          },
          {
            name: '详细错误（分）',
            url: '/perf/js-error/mins'
          },
          {
            name: '详细错误（时）',
            url: '/perf/js-error/hour'
          }
        ]
      }
    ]
  },
  {
    name: '项目管理',
    key: 'site',
    url: '/site/field',
    children: [
      {
        name: '性能指标',
        icon: 'bars',
        url: '/site/field'
      },
      {
        name: '用户管理',
        icon: 'user',
        url: '/site/user'
      },
      {
        name: '项目配置',
        icon: 'calculator',
        url: '/site/setting'
      }
    ]
  },
  {
    name: '基础设置',
    hidden: window.USER.status !== 1,
    key: 'setting',
    url: '/setting/user',
    children: [
      {
        name: '用户管理',
        icon: 'user',
        url: '/setting/user'
      }
    ]
  }
];

export default menus;
