/**
 * Created by cdpmac on 15/1/4.
 */
var pinyinhanziarr = require('./pinyinhanziarr');
var allhanzitopinyin= require('./allhanzitopinyin');
function hanzitopinyin(hanzi){
    for(var i =0;i<allhanzitopinyin.allhanzitopinyin.length;i++){
        var eve=allhanzitopinyin.allhanzitopinyin[i];
        if(eve[0]==hanzi){return eve[1]}
    }
    return ""
}

function hanzimohu(pinyin){
    for(var i =0;i<pinyinhanziarr.pinyinhanziarr.length;i++){
        var eve=pinyinhanziarr.pinyinhanziarr[i];
        if(eve[0]==pinyin){return eve[1]}
    }
    return [];
}


function getalllikes(name){
    var ziarr=[];
    if(name){
        for(var i =0;i<name.length;i++){
            var zi=name[i];
            var likes=hanzimohu(hanzitopinyin(zi));
            ziarr.push(likes);
        }
    }
    var result=new Array();//结果保存到这个数组
    function toResult(arrIndex,aresult)
    {
        if(arrIndex>=ziarr.length) {
            result.push(aresult);return;};
        var aArr=ziarr[arrIndex];
        if(!aresult) aresult=new Array();
        for(var i=0;i<aArr.length;i++)
        {
            var theResult=aresult.slice(0,aresult.length);
            theResult.push(aArr[i]);
            toResult(arrIndex+1,theResult);
        }
    }
    toResult(0);//函数执行后result数组就是所需结果
    var endresult=[];
    result.forEach(function(item){
        endresult.push(item.join(""));
    });
    return endresult
}
exports.getAllLikeNames=getalllikes;
exports.ToHanZi=hanzimohu;
exports.ToPinyin=hanzitopinyin;






