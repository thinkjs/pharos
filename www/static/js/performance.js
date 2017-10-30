(function() {
  var PagePerformance = function() {
  };
  PagePerformance.prototype = {
    isSupport: function() {
      var performance = window.performance;
      if (!performance) {
        console.log('你的浏览器不支持 performance 接口');
        return false;
      } else {
        return performance;
      }
    },
    getPerformanceTiming: function() {
      var _this = this;

      var performance = _this.isSupport();
      if (performance === false) {
        return {};
      }

      var t = performance.timing;
      var times = {};

      // 【重要】页面加载完成的时间
      // 【原因】这几乎代表了用户等待页面可用的时间
      times.loadPage = t.loadEventEnd - t.navigationStart;

      // 【重要】解析 DOM 树结构的时间
      // 【原因】反省下你的 DOM 树嵌套是不是太多了！
      times.domReady = t.domComplete - t.responseEnd;

      // 【重要】重定向的时间
      // 【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
      times.redirect = t.redirectEnd - t.redirectStart;

      // 【重要】DNS 查询时间
      // 【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
      // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)            
      times.lookupDomain = t.domainLookupEnd - t.domainLookupStart;

      // 【重要】读取页面第一个字节的时间
      // 【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
      // TTFB 即 Time To First Byte 的意思
      // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
      times.ttfb = t.responseStart - t.navigationStart;

      // 【重要】内容加载完成的时间
      // 【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
      times.request = t.responseEnd - t.requestStart;

      // 【重要】执行 onload 回调函数的时间
      // 【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
      times.loadEvent = t.loadEventEnd - t.loadEventStart;

      // DNS 缓存时间
      times.appcache = t.domainLookupStart - t.fetchStart;

      // 浏览器卸载前一个页面（同一个域下）的时间
      times.unloadEvent = t.unloadEventEnd - t.unloadEventStart;

      // TCP 建立连接完成握手的时间
      times.connect = t.connectEnd - t.connectStart;

      return times;
    },
  };

	var Pharos = function(config){
		this.searchStr = '';
		this.performance = {};
		this.info = {};
	};
	Pharos.prototype = {
		isEmpty: function(obj){
			return obj === undefined || JSON.stringify(obj) === JSON.stringify({});
		},
		generateSearchStr: function(obj) {
      var _this = this;
      for (var i in obj) {
        if (Object.prototype.toString.call(obj[i]) === '[object Object]') {
          _this.generateSearchStr(obj[i]);
        } else {
          _this.searchStr += i + '=' + obj[i] + '&';
        }
      }
    },
		sendLog: function(data) {
      if (!data) return;

      window.sadLog = {};
      var log = `log_${+(new Date())}`;
      sadLog[log] = new Image();
      sadLog[log].onload = sadLog[log].onerror = function() {
        delete sadLog[log];
      };
      sadLog[log].src = data;
		},
		monitor: function(info) {
			var _this = this;
			
			info = _this.isEmpty(info) ? _this.info : info;
			_this.performance.info = JSON.stringify(info);
      _this.performance.title = document.title;
			_this.performance.screen = window.screen.width + 'x' + window.screen.height;
			
			/* 获取site_id, host */
      var scriptEl = document.querySelector('[data-siteid]');
      var siteId = '', host = '';
      if (scriptEl.tagName.toLowerCase() === 'script') {
				siteId = scriptEl.getAttribute('data-siteid');
				host = scriptEl.getAttribute('data-host');
      }
			_this.performance.site_id = siteId;

      _this.generateSearchStr(_this.performance);
			_this.sendLog('//' + host + '/api/disp?' + _this.searchStr);
			_this.searchStr = '';
		},
		time: function(name){
			console.time(name);
		},
		timeEnd: function(name){
			return console.timeEnd(name);
		},
		add: function(moreInfo){
			var _this = this;
			_this.info = Object.assign({}, _this.info, moreInfo);

			return _this.info;
		},
		delete: function(infoKeys){
			var _this = this;
			if(_this.info === undefined) return;

			infoKeys.forEach(function(item, index){
				if(_this.info[item] !== undefined){
					delete _this.info[item]
				}
			});
			return _this.info;
		},
		search: function(key){
			var _this = this;
			if(_this.info === undefined) return;

			if(key){
				return _this.info[key];
			}else{
				return _this.info;
			}
		},
	}

	window.__pharos__ = new Pharos();
	window.addEventListener('load', function() {
    setTimeout(function() {
			window.__pagePerformanceTiming__ = new PagePerformance().getPerformanceTiming();
			window.__pharos__.add(window.__pagePerformanceTiming__);
    }, 0);
	});
})();
