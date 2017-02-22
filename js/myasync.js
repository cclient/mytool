//最终效果 同async
//目前实现了个人最常用的 serial 和 waterfall

//实现waterfall
//   async.waterfall([
//         function(callback){
//             callback(null, 'one', 'two');
//         },
//         function(arg1, arg2, callback){
//             callback(null, 'three');
//         },
//         function(arg1, callback){
//             // arg1 now equals 'three'
//             callback(null, 'done');
//         }
//     ], function (err, result) {
//        // result now equals 'done'    
//     });


var async = (function () {
	//这个比较简单
	function whilst(fntest, fniterator, fnend) {
		if (fntest()) {
			fniterator(function (err) {
				if (err) {
					fnend(err)
				}
				whilst(fntest, fniterator, fnend)
			})
		} else {
			fnend()
		}
	}
	//后一项作为前一项的最后一列参数 只用修改next指向
	function serial(tasks, endcallback) {
		function makeCallBack(index) {
			var hasnext = (index < tasks.length);
			if (hasnext) {
				var fn = function () {
					var args = Array.prototype.slice(arguments)
					var next = makeCallBack(index + 1)
					args.push(next)
					tasks[index].apply(null, args)
				}
				fn.hasNext = hasnext
				return fn
			} else return function () {
				endcallback()
			}
		}
		makeCallBack(0)()

	}
	function waterfall(tasks, endcallback) {
		function makeCallBack(index) {
			var hasnext = (index < tasks.length);
			if (hasnext) {
				var fn = function () {
					//现在需要错误处理，如果第一项参数为err 则endcallback
					//arguments 也要从第一项开始过滤
					var args = Array.prototype.slice(arguments, 1)
					if (arguments[0]) {
						endcallback(arguments[0], null)
						endcallback = null
					} else {
						var next
						if (index + 1 == tasks.length) {
							next = endcallback
						} else {
							next = makeCallBack(index + 1)
							// args.push(next);	
						}
						//这样只是把后一项函数，接在前一项之后。
						//而前一项函数的其他参数，后一项并不能得到。
						//把下一项调用的参数加到arg的前面
						for (var key in arguments) {
							if (key != "0") {
								args.push(arguments[key]);
							}
						}
						args.push(next);
						tasks[index].apply(null, args)
					}
				}
				return fn
			}
			//这样只是调用end方法，不能传参,要传参，需要向之前一样，把后一项接到tasks最后一项的callback上 
			// else return function () {	
			// 	//返回 result
			// 	endcallback(null)
			// }
		}
		//这样是直接调用返回的函数，下一个函数再调用下一个。
		//怎么把前一项的多余参赛传到下一项？
		makeCallBack(0)()
	}
	return {
		waterfall: waterfall,
		serial: serial,
		whilst: whilst
	}
})()


async.serial([
	function (callback) { console.log("1"); callback() },
	function (callback) { console.log("2"); callback() },
	function (callback) { console.log("3"); callback() }
], function () {
	console.log("end")
})


async.waterfall([
	function (callback) { console.log("1"); callback(null, "a"); },
	function (arg1, callback) { console.log("arg1" + arg1); console.log("2"); callback(null, "err3", "d"); },
	function (arg1, arg2, callback) { console.log("3"); callback(null, "res"); }
], function (err, result) {
	console.log("end");
	console.log(result);
})


var count = 0;

async.whilst(
	function () { return count < 10; },
	function (callback) {
		count++;
		console.log(count)
		setTimeout(callback, 100);
	},
	function (err) {
		// 5 seconds have passed
	}
    );

//迭代器
// (function () {
// 	function getiter(tasks) {
// 		var i;
// 		for (i = 0; i < tasks.length; i++) {
// 			(function (index) {
// 				var hasnext = ((index + 1) < tasks.length);
// 				tasks[index].hasNext = hasnext;
// 				console.log(index + " " + tasks[index].hasNext)
// 				if (tasks[index].hasNext) {
// 					tasks[index].next = tasks[index + 1]
// 				}
// 			})(i)
// 		}
// 		return tasks[0]
// 	}
// 	var tasks = [
// 		function () { console.log("1") },
// 		function () { console.log("2") },
// 		function () { console.log("3") },
// 		function () { console.log("4") },
// 	]
// 	var task = getiter(tasks)
// 	while (task.hasNext) {
// 		task();
// 		task = task.next;
// 	}

// })()
