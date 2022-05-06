$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['530px', '260px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理的形式，为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (e) {
                if (e.status !== 0) {
                    return layer.msg('添加失败')
                }
                initArtCateList()
                layer.msg('添加成功')
                // 关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式，为btn-edit按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '#btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['530px', '260px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id')
        // console.log(id)
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的形式，为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新失败')
                }
                initArtCateList()
                layer.msg('更新成功')
                 // 关闭弹出层
                layer.close(indexEdit)
            }
        })
    })

    // 通过代理的形式，为删除按钮btn-delete绑定点击事件
    $('body').on('click', '#btn-delete', function () {
        var id = $(this).attr('data-id')
        // 提示是否删除
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    initArtCateList()
                    layer.msg('删除成功')
                    layer.close(index);
                   
                }
            })
            
           
          });
    })
})