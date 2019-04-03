$(function() {
  //返回头部开始
  var dHeight = $(document).height()
  ;(function() {
    var $returnTop = $('.returnTOP i')
    $(window).scroll(function() {
      if ($(this).scrollTop() > 600) {
        $returnTop.show()
      } else {
        $returnTop.hide()
      }
    })
    $returnTop.click(function() {
      $('html').animate({ scrollTop: 0 })
    })
    function toWhite() {
      $returnTop.stop().animate({ opacity: 1 }, 1500, 'linear', function() {
        toBlue()
      })
    }
    function toBlue() {
      $returnTop.stop().animate({ opacity: 0 }, 1500, 'linear', function() {
        toWhite()
      })
    }
    toWhite()
  })()
  //返回头部结束
  //自制滚动条开始
  ;(function() {
    var keepScroll = 0
    var $scrollBar = $('.scroll_bar')
    var $scrollPoint = $('.scroll_point')
    var barTop
    var $html = $('html')
    $scrollBar.get(0).onselectstart = function() {
      return false
    }
    $('.slide_right_bar_m').get(0).onselectstart = function() {
      return false
    }
    $(window).scroll(function() {
      dHeight = $(document).height()
      $scrollPoint.css(
        'top',
        (window.pageYOffset / (dHeight - $(window).height())) * 400
      )
    })
    var getMousePosition = function(e) {
      var mouseY = e.clientY
      return mouseY
    }
    var changePointPosition = function(mouseY, barTop) {
      var mouseRTop = mouseY - barTop
      if (mouseRTop >= 15 && mouseRTop <= 415) {
        $scrollPoint.css('top', mouseRTop - 15) //pointTop
        return mouseRTop - 15
      } else if (mouseRTop < 15) {
        $scrollPoint.css('top', 0)
        return 0
      } else {
        $scrollPoint.css('top', 400)
        return 400
      }
    }
    $scrollBar.on('mousedown', function(e) {
      var mouseY = getMousePosition(e)
      barTop = parseInt($scrollBar.css('top'))
      var pointTop = changePointPosition(mouseY, barTop)
      keepScroll = 1
      $html.scrollTop(((dHeight - $(window).height()) / 400) * pointTop)
    })
    $html.on('mousemove', function(e) {
      if (keepScroll === 1) {
        var mouseY = getMousePosition(e)
        var pointTop = changePointPosition(mouseY, barTop)
        $html.scrollTop(((dHeight - $(window).height()) / 400) * pointTop)
      }
    })
    $html.on('mouseup', function() {
      keepScroll = 0
    })
  })()
  //自制滚动条结束
  //自适应图片形状方法开始
  ;(function() {
    function initSetHW() {
      var $notePt = $('.note_info_pt')
      var img = []
      var i
      for (i = 0; i < $notePt.length; i++) {
        img.push(new Image())
        img[i].src = $notePt
          .eq(i)
          .css('backgroundImage')
          .substring(5, $notePt.eq(i).css('backgroundImage').length - 2)
      }
      img[$notePt.length - 1].onload = function() {
        for (i = 0; i < $notePt.length; i++) {
          $notePt
            .eq(i)
            .css('height', ($notePt.width() / img[i].width) * img[i].height)
        }
      }
    }
    function setHW(newNoteArray) {
      var i
      var img = []
      for (i = 0; i < newNoteArray.length; i++) {
        var $findPT = newNoteArray[i].find('.note_info_pt')
        img.push(new Image())
        img[i].src = $findPT
          .css('backgroundImage')
          .substring(5, $findPT.css('backgroundImage').length - 2)
      }
      img[newNoteArray.length - 1].onload = function() {
        for (i = 0; i < newNoteArray.length; i++) {
          var $findPT = newNoteArray[i].find('.note_info_pt')
          $findPT.animate(
            { height: ($findPT.width() / img[i].width) * img[i].height },
            400
          )
        }
      }
    }
    //初始化图片自适应方法和ajax方法封装
    window.initSetHW = initSetHW
    window.setHW = setHW
  })()
  //自适应图片放置
  ;(function() {
    initSetHW()
    var keep = 1
    var num = 8
    function getCMax() {
      var $contentBox = $('.content_box')
      var contentLengthMax = Math.min(
        $contentBox.eq(0).height(),
        $contentBox.eq(1).height(),
        $contentBox.eq(2).height(),
        $contentBox.eq(3).height()
      )
      if (contentLengthMax === $contentBox.eq(0).height()) {
        return $contentBox.eq(0)
      } else if (contentLengthMax === $contentBox.eq(1).height()) {
        return $contentBox.eq(1)
      } else if (contentLengthMax === $contentBox.eq(2).height()) {
        return $contentBox.eq(2)
      } else {
        return $contentBox.eq(3)
      }
    }
    var pullNode = function(re) {
      //获得与填充node
      keep = 0
      $.get('/getNode', function(data) {
        var newNoteArray = []
        for (i = 0; i < 8; i++) {
          var $Cbox = getCMax()
          var htmlText = template('temp', data[num++])
          newNoteArray.push(
            $(htmlText)
              .appendTo($Cbox)
              .animate({ opacity: 1 }, 600)
          )
          if (num === 52) {
            num = 0
          }
        }
        setHW(newNoteArray)
        keep = 1
        if (re) {
          re()
        }
      })
    }
    $(window).on('scroll', function() {
      //下拉时放置
      if (
        keep === 1 &&
        dHeight - $(window).height() - $(document).scrollTop() < 25
      ) {
        pullNode()
      }
    })
    $('.left_bar li')
      .first()
      .addClass('left_bar_click')
      .end()
      .not('li:last-child')
      .on('click', function() {
        //点击时放置
        $(this)
          .siblings()
          .removeClass('left_bar_click')
        $(this).addClass('left_bar_click')
        $('.content_box').empty()
        function re() {
          $(window).scrollTop(700)
        }
        pullNode(re)
      })
  })()
  //自适应图片放置结束
  //轮播图开始
  ;(function() {
    var $slideP = $('.slide_left_main_pt')
    var $slideL = $('.slide_right_bar_m li')
    var line = 0
    var setTime = function() {
      if (line === 4) {
        line = -1
      }
      $slideP
        .fadeOut(500)
        .eq(++line)
        .fadeIn(500)
      $slideL
        .css({
          fontSize: '16px',
          textDecoration: 'none',
          color: '#3eccff'
        })
        .eq(line)
        .css({
          fontSize: '20px',
          textDecoration: 'underline',
          color: 'burlywood'
        })
    }
    var time = setInterval(function() {
      setTime()
    }, 4000)
    $slideL.on('mouseover', function() {
      clearInterval(time)
    })
    $slideL.on('mouseout', function() {
      time = setInterval(function() {
        setTime()
      }, 4000)
    })
    $slideL.on('click', function() {
      line = parseInt($(this).attr('name'))
      $slideL.css({
        fontSize: '16px',
        textDecoration: 'none',
        color: '#3eccff'
      })
      $(this).css({
        fontSize: '20px',
        textDecoration: 'underline',
        color: 'burlywood'
      })
      $slideP
        .fadeOut(500)
        .eq(line)
        .fadeIn(500)
    })
  })()
  //轮播图结束
  //详细note呼出开始
  ;(function() {
    $('.content_box').on('click', '.content_box_small', function() {
      $('.hide').fadeIn(300)
      var $this = $(this)
      $.get('/getOutNodes', { index: $this.attr('index') }, function(data) {
        console.log(data)
        data[0].user_birth =
          new Date().getFullYear() -
          new Date(data[0].user_birth).getFullYear() +
          1
        data[0].n_Title = $this.find('.note_info_describe_small p').text()
        var htmlText = template('tempOutNode', data[0])
        var $nodeContent = $('.node_out_position')
          .html(htmlText)
          .find('.node_out_main_contain')
        var contentP = data[0].n_Content.split('\n')
        for (i = 0; i < contentP.length; i++) {
          $nodeContent.append('<p>' + contentP[i] + '</p>')
        }
        $('.hide').on('click', function() {
          $('.hide').fadeOut(300)
        })
        $('.node_out_big_box').on('click', function(event) {
          //阻止冒泡事件
          event.stopPropagation()
        })
      })
    })
  })()
  //详细note呼出结束
})
