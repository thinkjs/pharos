define({ "api": [  {    "type": "DELETE",    "url": "/site/:id",    "title": "删除网站",    "group": "Site",    "version": "0.0.1",    "filename": "src/logic/api/site.js",    "groupTitle": "Site",    "name": "DeleteSiteId"  },  {    "type": "GET",    "url": "/site",    "title": "获取网站列表",    "group": "Site",    "version": "0.0.1",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "page",            "description": "<p>页数</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "pagesize",            "description": "<p>分页大小</p>"          }        ]      }    },    "filename": "src/logic/api/site.js",    "groupTitle": "Site",    "name": "GetSite"  },  {    "type": "GET",    "url": "/site",    "title": "查询网站信息",    "group": "Site",    "version": "0.0.1",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "keywords",            "description": "<p>url 或 name</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "page",            "description": "<p>页数</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "pagesize",            "description": "<p>分页大小</p>"          }        ]      }    },    "filename": "src/logic/api/site.js",    "groupTitle": "Site",    "name": "GetSite"  },  {    "type": "GET",    "url": "/site/:id",    "title": "获取网站信息",    "group": "Site",    "version": "0.0.1",    "filename": "src/logic/api/site.js",    "groupTitle": "Site",    "name": "GetSiteId"  },  {    "type": "POST",    "url": "/site",    "title": "添加网站",    "group": "Site",    "version": "0.0.1",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "url",            "description": "<p>网站地址</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>网站名称</p>"          }        ]      }    },    "filename": "src/logic/api/site.js",    "groupTitle": "Site",    "name": "PostSite"  },  {    "type": "PUT",    "url": "/site/:id",    "title": "修改网站信息",    "group": "Site",    "version": "0.0.1",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>网站名称</p>"          }        ]      }    },    "filename": "src/logic/api/site.js",    "groupTitle": "Site",    "name": "PutSiteId"  },  {    "type": "DELETE",    "url": "/token",    "title": "用户登出",    "group": "User",    "version": "0.0.1",    "filename": "src/logic/api/token.js",    "groupTitle": "User",    "name": "DeleteToken"  },  {    "type": "DELETE",    "url": "/user/:id",    "title": "用户删除",    "group": "User",    "version": "0.0.1",    "filename": "src/logic/api/user.js",    "groupTitle": "User",    "name": "DeleteUserId"  },  {    "type": "GET",    "url": "/token",    "title": "获取验证码",    "group": "User",    "version": "0.0.1",    "filename": "src/logic/api/token.js",    "groupTitle": "User",    "name": "GetToken"  },  {    "type": "GET",    "url": "/token/intranet",    "title": "内网登录",    "group": "User",    "version": "0.0.1",    "filename": "src/logic/api/token/intranet.js",    "groupTitle": "User",    "name": "GetTokenIntranet"  },  {    "type": "GET",    "url": "/user",    "title": "获取用户列表",    "group": "User",    "version": "0.0.1",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "keyword",            "description": "<p>搜索关键词</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "page",            "description": "<p>页数</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "pagesize",            "description": "<p>分页大小</p>"          }        ]      }    },    "filename": "src/logic/api/user.js",    "groupTitle": "User",    "name": "GetUser"  },  {    "type": "POST",    "url": "/token",    "title": "用户登录",    "group": "User",    "version": "0.0.1",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "credential",            "description": "<p>用户名或者密码</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "password",            "description": "<p>用户密码</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "captcha",            "description": "<p>验证码</p>"          }        ]      }    },    "filename": "src/logic/api/token.js",    "groupTitle": "User",    "name": "PostToken"  },  {    "type": "POST",    "url": "/user",    "title": "用户注册",    "group": "User",    "version": "0.0.1",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>用户 ID</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "display_name",            "description": "<p>用户昵称</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "email",            "description": "<p>用户邮箱</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "password",            "description": "<p>用户密码</p>"          }        ]      }    },    "filename": "src/logic/api/user.js",    "groupTitle": "User",    "name": "PostUser"  },  {    "type": "PUT",    "url": "/user/:id",    "title": "更新用户信息",    "group": "User",    "version": "0.0.1",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "display_name",            "description": "<p>用户昵称</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "password",            "description": "<p>用户密码</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "status",            "description": "<p>用户状态</p>"          }        ]      }    },    "filename": "src/logic/api/user.js",    "groupTitle": "User",    "name": "PutUserId"  }] });
