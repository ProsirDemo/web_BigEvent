// 每次調用$.get或者調用$.post、$.ajax的時候都会先
// 调用ajaxPrefilter这个函数
$.ajaxPrefilter(function (options) {
    // 在发起真正的ajax请求之前，统一拼接根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    // console.log(options.url);

    // 统一为有权限的接口，shezhiheader请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }

    }

    // 全局统一挂载complete回调函数
    options.complete = function (res) {
        // console.log(res)
        // 在complete回调函数中，可以使用
        // res.responseJSON拿到服务器响应回来的数据
        if (res.responseJSON.status !== 0) {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }

    }
})
