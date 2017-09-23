 (function(){
	function testPerformance(){
		var performance = window.performance;
	
		if (!performance) {
				// 当前浏览器不支持
				console.log('你的浏览器不支持 performance 接口');
				return false;
		}else {
			return performance;
		}
	}

	// 计算加载时间
	function getPerformanceTiming() {  
			var performance = testPerformance();

			if(performance === false) return;

			var t = performance.timing;
			var times = {};
	
			//【重要】重定向的时间
			times.redirect = t.redirectEnd - t.redirectStart;
	
			//【重要】DNS 查询时间
			times.dns = t.domainLookupEnd - t.domainLookupStart;
			
			// TCP 建立连接完成握手的时间
			times.connect = t.connectEnd - t.connectStart;

			//【重要】内容加载完成的时间
			times.request = t.responseEnd - t.requestStart;

			//【重要】读取页面第一个字节的时间
			times.ttfb = t.responseStart - t.navigationStart;

			//【重要】白屏时间，用户开始看到内容
			times.white = t.domLoading - t.navigationStart;
			
			//【重要】内容渲染的时间
			times.render = t.domComplete - t.domLoading;
			
			// DOM树创建好了，内容还未加载，如图片啥的
			times.active = t.domInteractive - t.navigationStart;

			//【重要】DOM加载完成， jquery中的dom ready
			times.domready = t.domContentLoadedEventEnd - t.navigationStart;

			// 页面加载时间
			times.loadPage = t.loadEventEnd - t.navigationStart;

			return times;
	}

	function getElePermance(){
		var tagCount = document.querySelectorAll('*').length,
				imgCount = document.querySelectorAll('img[src]').length,
				bgImgCount = document.querySelectorAll('[style*="background-image"]').length;

		var counts = {
			tagCount: tagCount,
			imgCount: imgCount + bgImgCount
		};
		
		return counts;
	}

	var report = (function(){
		var imgs = [];
		return function(src){
			var img = new Image();
			imgs.push(img);
			img.src = src;
		}
	})();

	var searchStr = '';
	var getSearchParmas = function(obj){
		for(var i in obj){
			if(Object.prototype.toString.call(obj[i]) === '[object Object]'){
				getSearchParmas(obj[i])
			}else{
				searchStr += i + '=' + obj[i] + '&'
			}
		}
	}

	var times = {};
	window.onload = function(){
		 setTimeout(function(){
			var performance = testPerformance();
			
			if(performance !== false){
				times = getPerformanceTiming();
			}

			times.counts = getElePermance();

			getSearchParmas(times);
			report('/static/srp.gif?'+searchStr);

			console.log('重定向的时间: ' + times.redirect);
			console.log('DNS解析: ' + times.dns);
			console.log('建立连接: ' + times.connect);
			console.log('发起请求得到相应时间: ' + times.request);
			console.log('距离接收到首字节: ' + times.ttfb);
			console.log('白屏: ' + times.white);
			console.log('DOM树创建时间: ' + times.active);
			console.log('DOM加载完成时间: ' + times.domready);
			console.log('渲染页面耗时: ' + times.render);
			console.log('页面加载时间: ' + times.loadPage);
			console.log('标签数量: ' + times.counts.tagCount);
			console.log('图片数量: ' + times.counts.imgCount);
			
		}, 0)
	}

 
})()