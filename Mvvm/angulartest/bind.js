/**
 * Created by MI177 on 2014/11/5.
 */
function PhoneListCtrl($scope,$document,$http) {

    $scope.postdata={};
    $scope.files = [
        {"index": "1",
            "snippet": "Fast just got faster with Nexus S."},
        {"index": "2",
            "snippet": "The Next, Next Generation tablet."},
        {"index": "3",
            "snippet": "The Next, Next Generation tablet."}
    ];
    $scope.callfile = function(index) {
        var t=  $document[0].getElementById("file" + index);
        if($document[0].all) { //IE
            t.fireEvent("onclick");
        } else  {   //firefox不支持fireEvent
            var evt = $document[0].createEvent('HTMLEvents');
            evt.initEvent('click',true,true);
            t.dispatchEvent(evt);
        }
    }
    $scope.removefile = function(index,obj) {
        $scope.postdata["file" + index] = "";
    }
    $scope.filechange=function(index){
        var file = this.files[0];
        var url = webkitURL.createObjectURL(file);
        /* 生成图片
         * ---------------------- */
        var $img = new Image();
        $img.src = url;
        $img.onload = function () {
            //生成比例
            var width = this.width,
                height = this.height,
                scale = width / height;
            width = parseInt(800);
            height = parseInt(width / scale);
            //生成canvas
            var $canvas = $('#canvas');
            var ctx = $canvas[0].getContext('2d');
            $canvas.attr({ width: width, height: height });
            ctx.drawImage($img, 0, 0, width, height);
            var base64 = $canvas[0].toDataURL('image/jpeg', 0.5);
            var cc = $("#pic" + index);
            cc.attr("src", url);
            postdata["file" + index] = base64.substr(23);
        }
    }
    $scope.upload=function(){
        $http.post('UploadFile/FenXiangImg?wxopenid=222&orderid=111&templateid=1',$scope.postdata).success(function(data) {
            alert("sucess");
        });
    }
}