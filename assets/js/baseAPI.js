// 每次調用$.get或者調用$.post、$.ajax的時候都会先
// 调用ajaxPrefilter这个函数
$.ajaxPrefilter(function(options){
// 在发起真正的ajax请求之前，统一拼接根路径
options.url = 'http://www.liulongbin.top:3007' + options.url;
console.log(options.url);
})