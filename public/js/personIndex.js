//发布简单的node
$('.tools .submit').on('click',function (e) {
	e.preventDefault()
	if (!$('textarea').val()){
		alert('请输入文章内容')
		return 
	}
	var n_Content = `<p>${$('textarea').val().replace(/'/g,'\'\'')}</p>`
	$.post('/Seditor',{n_Content: n_Content, n_Title: ''},function (res) {
		if (res === 'success'){
			alert('发表成功！')
			window.location.href = '/'
		}
	})
})
$('.unfocus').on('click',function () {
	alert('取关成功！')
	$('.note').fadeOut(200)
})

