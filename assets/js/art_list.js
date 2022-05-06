$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)

        var y = dt.getFullYear()
        var m = addZero(dt.getMonth() + 1)
        var d = addZero(dt.getDay())

        var hh = addZero(dt.getHours())
        var mm = addZero(dt.getMinutes())
        var ss = addZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '  ' + hh + ':' + mm + ':' + ss
    }
    // 补零函数
    function addZero(q) {
        return q > 9 ? q : '0' + q
    }
    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象 提交到服务器
    var q = {
        pagenum: 1, //页码值,默认请求第一页的数据
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '', //文章的状态，可选值有：已发布、草稿
    }

    initTable()
    initCate()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,

            success: function (res) {

                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('获取文章列表信息失败')
                }
                // console.log(res)
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 调用渲染分页的方法
                renderPage(res.total)

            }
        })
    }

    // 初始化文章分类额方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {

                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过layui重新渲染表单区域的ui结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格中的数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total)
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox' ,//注意，这里的 test1 是 ID，不用加 # 号
            count: total , //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits:[2,3,5,10],
            // 分页发生切换的时候触发jump回调
            // jump触发的方式有两种
            // 1、点击页码的时候，会触发jump回调
            // 2、只要调用 laypage.render方法就会触发该回调
            jump: function (obj, first) {
                // 可以通过first的值来判断是通过那种方式触发jump回调，first为true为方式2，反之方式1
                 // console.log(first)
                // console.log(obj.curr)
                // 把最新的页码值赋值到q中
                q.pagenum = obj.curr

                //  把最新的条目数，赋值到q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit

                
                // 根据最新的q获取对应的 数据列表，并渲染表格
                if (!first) {
                    initTable()
                }
              
            }
        })
    }

    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length 
        //获取到文章的id
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method:'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章信息失败')
                    }
                    layer.msg('删除文章信息成功')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
          })
    })
}) 