#jquery实现的小工具
开发的移动端html自动生成中的辅助模块
#原理是
用图片，绝对定位和相对定位，通过透明覆盖层触发事件
1选择图片,上传
2设置绝对定位坐标,自动生成保存div设置
3编写js文件，向div添加事件

移动端加载时，注入js文件。
实现功能。

写此demo为了取到选择区域的定位
测的不准，取的坐标有误，应该取元素的事件坐标，目前取的是页面的
误差在10像素内