/**
 * Created by cdpmac on 15/10/10.
 */
//1:一个promise可能有三种状态：等待（pending）、已完成（fulfilled）、已拒绝（rejected）
//2:一个promise的状态只可能从“等待”转到“完成”态或者“拒绝”态，不能逆向转换，同时“完成”态和“拒绝”态不能相互转换
//3:promise必须实现then方法（可以说，then就是promise的核心），而且then必须返回一个promise，同一个promise的then可以调用多次，并且回调的执行顺序跟它们被定义时的顺序一致
//4:then方法接受两个参数，第一个参数是成功时的回调，在promise由“等待”态转换到“完成”态时调用，另一个是失败时的回调，在promise由“等待”态转换到“拒绝”态时调用。同时，then可以接受另一个promise传入，也接受一个“类then”的对象或方法，即thenable对象。

Deferred = function() {
    this.promise = new Promise();
};
Deferred.prototype.resolve = function(result) {
    if (!this.promise.isPending()) {
        return;
    }
    this.promise.setStatus('fulfilled', result);
};

Deferred.prototype.reject = function(err) {
    if (!this.promise.isPending()) {
        return;
    }
    this.promise.setStatus('rejected', err);
}



//因为1 设置status字段，并添加修改方法
var Promise= function() {
    this.status="pending";
//    this.next=null;
}

Promise.prototype.setStatus = function(s, value) {
    if (s === 'fulfilled' || s === 'rejected') {
        this.status = s;
        this.value = value || null;
//        this.queue = [];
        var freezeObject = Object.freeze || function(){};
        freezeObject(this);// promise的状态是不可逆的
    } else {
        throw new Error({
            message: "doesn't support status: " + s
        });
    }
};

Promise.prototype.getStatus = function() {
    return this.status;
};
Promise.prototype.isFulfilled = function() {
    return this.status === 'fulfilled';
};
Promise.prototype.isRejected = function() {
    return this.status === 'rejected';
}
Promise.prototype.isPending = function() {
    return this.status === 'pending';
}

//setStatus根据函数调用直接设置不公开对象方法


//3 以then为基础
Promise.prototype.then=function(onFulfilled,onRejected){
//    console.log(this);
    var transition = function(deferred, type, result) {
        if (type === 'fulfilled') {
            deferred.resolve(result);
        } else if (type === 'rejected') {
            deferred.reject(result);
        } else if (type !== 'pending') {
            throw new Error({
                'message': "doesn't support type: " + type
            });
        }
    };
    var func=null;

    if(this.status=="rejected"){
        func=onRejected;
    }
    else if(this.status=="fulfilled"){
        func=onFulfilled;
    }
    var def= new Deferred();
    try {
        //该执行单元调用 调用会执行 resolve/或reject 方法，设置status状态
        var newResult = func(this.value);

        if (newResult && typeof newResult.then === 'function') {
            //如果 调用反回是个promise 那就调用
            newResult.then(function(data){
                def.resolve(newResult);
            },function(err){
                def.reject(newResult);
            })
        } else {
            //status状态，传递到下一个promise,下一个promise调用再设置 下下一个继续
            if(this.status=="rejected"){
                def.reject(newResult);
            }
            else if(this.status=="fulfilled"){
                def.resolve(newResult);
            }
        }
    } catch(err) {
        var pro=new Promise();
        //status状态，传递到下一个promise,下一个promise调用再设置 下下一个继续
        def.reject(newResult);
    }
    console.log("then")
    console.log(def.promise);
    return def.promise;
}

var obj=0;
add=function(a){
    var def=new Deferred()
    obj=obj+a;
    def.resolve(obj);
    return def.promise;
}
var k=add(3)


//    .then(function(result){
////        console.log(result);
////        console.log("res1 "+result);
////        console.log(add);
//        return add(result);
//    }
//    ,function(err){})
//    .then(function(result){
////        console.log(result);
////        console.log("res2 "+result);
//    }
//    ,function(err){})
    .then(function(result){
        return "help";
//        console.log(result);
//        console.log("res3 "+result);
    }
    ,function(err){})

console.log(k.value)