$(function () {
  // 点击去注册登录的链接
  $('#link_reg').on('click', () => {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 点击去登录的链接
  $('#link_login').on('click', () => {
    $('.reg-box').hide()
    $('.login-box').show()
  })

  // 从layui中获取form对象
  var form = layui.form
  // 消息提示
  var layer = layui.layer
  // 通过form.verify()函数自定义校验规则
  form.verify({
    // 自定义名叫pwd的校验规则
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    //   校验两次密码是否一致的规则
    repwd: function (values) {
      // 通过形参拿到确认密码框的值
      // 拿到密码框中的内容
      var pwd = $('.reg-box [name=password]').val()
      // 进行等于判断
      if (pwd !== values) {
        return '两次输入密码不一致'
      }
      // 如果判断失败则返回一个错误的提示信息

    }
  })

  // 提交用户注册信息
  $('#form_reg').on('submit', (e) => {
    e.preventDefault()
    var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
    $.post('/api/reguser', data, (res) => {
      if (res.status !== 0) {
        return layer.msg(res.message)
      }
      layer.msg('注册成功')
      // 模拟人的点击行为
      $('#link_login').click()
    })

  })

  // 监听登录表单的提交事件
  $('#form_login').submit(function (e) {
    // 阻止默认提交行为
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登录失败！')
        }
        layer.msg('登录成功！')
        //   成功登录的得到的token值存储到localStorage中
        localStorage.setItem('token', res.token)
        // 跳转到后台
        location.href = '/index.html'
      }
    })

  })

})
