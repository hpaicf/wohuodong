var console=console||{log:function(){}};
var isIE=!!window.ActiveXObject;
   //模态框的设置
var oMask=document.getElementById("mask");
//获取页面的高度和宽度
var sHeight=document.documentElement.scrollHeight;
var sWidth=document.documentElement.scrollWidth;
//可视区域，就是用户所看到的部分
var wHeight=document.documentElement.clientHeight;
var wWidth=document.documentElement.clientWidth;
function maskopen(){
    $('#mask').css('height',wHeight+"px");
    $('#mask').css('width',wWidth+"px");
    $("#mask").addClass("mask").fadeIn();
}
function maskclose(){
    $("#mask").removeClass("mask").fadeOut("slow");
}

(function($){
        $.extend({index:{
        server_url:"http://103.55.27.51:8080/wohuodong/WHD/",//服务器程序地址
        target:0,
        loginCount:0,//用户登录次数
        phoneCode:"",
        second:60,
        right_nav:null,//右侧导航栏
        init:function(){//页面初始化
            var that=this;
            that.init_css()//兼容性js css
            this.tabs_model();//推荐活动切换
            that.group_data();
            that.activity_data();
            that.slide_interface();
            // that.slide_interface()//轮播图接口
            // that.quick_to();//快捷链接
            // that.index_data();//首页信息数据接口
            // that.nav_to();
        },
        
        init_css:function(){
            var that=this;
            // 推荐活动右侧4的整数去掉margin
            $(".article_list ul li").each(function(i){
                if (i%4==3) {
                   console.log(i);
                   $(this).css('margin-right','0');
                }
            });
        },

        //接口封装
        /* $param:传递的数据上传参数
           $url:接口拼接子地址
           $fn：函数
           */
        model_ajax:function($param,$url,$fn){
            var that=this;
            $.ajax({
                type: 'GET',
                url: that.server_url +$url,
                dataType: 'jsonp',
                data:$param,
                success: function($data){
                    if ($fn){$fn($data);}
                }
            });
        },

        // 轮播图接口交互
        slide_interface:function(){
            var that=this;
            that.model_ajax(null,'MainPageController/loopPic/v1',function($data){
                var _ck_slide_wrapper=[];
                // 成功
                if ($data.status==1) {
                    $.each($data.message,function(i,item){
                        // 轮播大图
                        _ck_slide_wrapper.push('<li >'+
                                            '<a href="javascript:;"><img src="'+item.activityCover+'" alt="'+item.activityName+'"></a>'+
                                            '</li>');
                    });
                    //轮播dom加载
                    $(".slide_container .slide ul.ck-slide-wrapper").empty().append(_ck_slide_wrapper.join(''));
                    
                }
                // 其他情况
                else if($data.status<=0){
                    alert("正在加载....."+$data.message);
                }
            });
        },

        // 首页活动接口加载
        activity_data:function(){
            var that=this;
            that.model_ajax(null,'MainPageController/activity/v1',function($data){
                var _con_title_ul=[];
                var _activity_box=[];
                // 成功
                if ($data.status==1) {
                    $.each($data.message,function(i,item){
                        // 数据加载
                        var _activity_list=[];
                        var _activity_list_ul=[];
                        console.log(item.ActivityType.ActivityTypeName);
                        if (i==0) {
                            _con_title_ul.push('<li class="thistab" attr-href="#1"><a href="javascript:;">'+item.ActivityType.ActivityTypeName+'</a><span class="line"></span></li>')
                            _activity_list.push('<div class="article_list" style="display:block;"><ul>');
                        }else{
                            _con_title_ul.push('<li attr-href="#1"><a href="javascript:;">'+item.ActivityType.ActivityTypeName+'</a><span class="line"></span></li>')
                            _activity_list.push('<div class="article_list" style="display: none;"><ul>');
                        }
                        $.each(item.Activities,function(i,item){ 
                            console.log(item.activityName);
                             _activity_list_ul.push('<li>'+
                                            '<div class="item">'+
                                              '<div class="item_img">'+
                                                  '<img src="'+item.activityCover+'">'+
                                              '</div>'+
                                              '<div class="item_title">'+
                                              ''+item.activityName+'</div>'+
                                              '<div class="item_info">'+
                                                '<div class="time">'+item.beginTime+
                                                '</div>'+
                                                '<div class="place">'+item.activityLocation+
                                                '</div>'+
                                              '</div>'+
                                              '<div class="other">'+
                                                '<div class="join">'+
                                                  '<span>'+item.memberCount+'</span>人已参加'+
                                                '</div>'+
                                                '<div class="share">'+
                                                  '<a href="javascript:;"></a>'+
                                                '</div>'+
                                              '</div>'+       
                                            '</div>'+
                                          '</li>');
                        });
                        _activity_list.push(_activity_list_ul.join(''));
                        _activity_list.push('</ul></div>');
                        _activity_box.push(_activity_list.join(''));
                    });
                    //标题加载
                    $(".re_activity .activity_list .con_title ul").empty().append(_con_title_ul.join(''));
                    $(".re_activity .activity_list .slide_wrap .activity_box").empty().append(_activity_box.join(''));
                }
                // 其他情况
                else if($data.status<=0){
                    alert("正在加载....."+$data.message);
                }
            });
        },
        
        // 首页圈子接口加载
        group_data:function(){
            var that=this;
                that.model_ajax(null,'MainPageController/group/v1',function($data){
                    var _re_circle_ul=[];
                    // 成功
                    if ($data.status==1) {
                        $.each($data.message,function(i,item){
                            // 数据加载
                            console.log(item.ProvinceName);
                            _re_circle_ul.push('<li>'+
                                                    '<div class="circle_img">'+
                                                        '<img src="'+item.GroupCover+'">'+
                                                        '<div class="circle_place">'+
                                                           '<img src="assets/images/cplace.png">'+item.CityName+''+
                                                           '<span>'+item.ProvinceName+'</span>'+
                                                       ' </div>'+
                                                    '</div>'+
                                                   ' <div class="item_info">'+
                                                        '<div class="info_title">'+item.GroupName+
                                                         ' <span>'+item.Remark+'</span>'+
                                                       ' </div>'+
                                                       ' <div class="other">'+
                                                        '<div class="join">'+
                                                            '<span>'+item.MemberCount+'</span>人已参加'+
                                                        '</div>'+
                                                        '<div class="join_icon">'+
                                                            '<a href="javascript:;"></a>'+
                                                        '</div>'+
                                                    '</div> '+
                                                   ' </div>'+
                                                '</li>');
                        });
                        
                        //轮播dom加载
                        $(".re_circle ul").empty().append(_re_circle_ul.join(''));
                    }
                    // 其他情况
                    else if($data.status<=0){
                        alert("正在加载....."+$data.message);
                    }
                });
        },


        // 首页数据信息接口
        

        // 推荐活动切换模板
        slides_news_module:function(list_focus,box_focus,article_list){ 
            /*  滚动切换  */
            function LineRoll(_ctrl, _speed) {
                this.ctrller = $(_ctrl);
                this.speed = _speed;
                this.bindClick();
            }

            LineRoll.prototype.bindClick = function () {
                var _self = this;
                _self.ctrller.delegate('.con_title li', {
                        'click': function () {
                            var _t = $(this).index();
                            var _link = $(this).attr('attr-href');
                            var $adom = $(this).parents('.con_title').find('.focus_more_link');
                            $($adom).attr('href',_link)
                            _self.fn(_t);

                        }
                    }
                );
            };

            var newsRoll = new LineRoll(list_focus, 500);
            newsRoll.rollContainer = $(box_focus);
            newsRoll.speed = 500;
            newsRoll.rolllist = $(article_list);
            newsRoll.rolllist.eq(0).show();
            newsRoll.rolllwidth = function () {
                return this.rolllist.width();
            };
            newsRoll.currentNum = 0;
            newsRoll.fn = function (t) {
                var _self = this, _t = t;
                if (!_self.rollContainer.is(':animated')) {
                    _self.ctrller.find('li').eq(_t).addClass('thistab').siblings().removeClass('thistab');
                    if (_t !== _self.currentNum) {
                        _self.rolllist.eq(_t).show();
                        if (_t < _self.currentNum) {
                            _self.rollContainer.css({'left': -1 * _self.rolllwidth() + 'px'});
                        }
                        var abs = (_self.currentNum - _t ) / Math.abs(_t - _self.currentNum) > 0 ? 0 : -1;
                        _self.rollContainer.animate({'left': abs * _self.rolllwidth() + 'px'}, _self.speed, function () {
                            _self.rolllist.eq(_self.currentNum).hide();
                            _self.rollContainer.css({'left': 0});
                            _self.currentNum = _t;
                        });
                    }
                }
            };
            var roleRoll = new LineRoll('.school_ul', 500);
            roleRoll.tabtime = 1;
            roleRoll.fn = function (t) {
                var $rolegroup = $('.school_box'), _t = t;
                var _self = this;
                _self.ctrller.find('li').eq(_t).addClass('thistab').siblings().removeClass('thistab');
                $rolegroup.removeClass('thistab');
                setTimeout(function () {
                    $rolegroup.eq(_t).addClass('sch_active').siblings().removeClass('sch_active');
                }, roleRoll.tabtime);
            };

        },

        // 推荐活动切换添加
        tabs_model : function(){ //选项卡
            var that=this;        
            that.slides_news_module('.activity_list_focus','.activity_box_focus','.activity_box_focus .article_list');
        }


      
    }});
})(jQuery)


$(function(){
    $.index.init();
    
});

 //首页的图片轮播
  (function($) { //焦点图js
    $.extend({
      'foucs': function(con) {
        var $container = $('.slide_container'),
          $imgs = $container.find('.slide .ck-slide-wrapper li'),
          $leftBtn = $container.find('a.ck-next'),
          $rightBtn = $container.find('a.ck-prev'),
          config = {
            interval: con && con.interval || 3500,
            animateTime: con && con.animateTime || 500,
            direction: con && (con.direction === 'left'),
            _imgLen: $imgs.length
          },
          i = 0;
          getNextIndex = function(y) {
            return i + y >= config._imgLen ? i + y - config._imgLen : i + y;
          },
          getPrevIndex = function(y) {
            return i - y < 0 ? config._imgLen + i - y : i - y;
          },
          silde = function(d) {
            $imgs.eq((d ? getPrevIndex(2) : getNextIndex(2))).css('left', (d ? '-2400px' : '2400px'));
            $imgs.animate({
              'left': (d ? '+' : '-') + '=1200px'
            }, config.animateTime);
            i = d ? getPrevIndex(1) : getNextIndex(1);
          },
          s = setInterval(function() {
            silde(config.direction);
            // $.each($imgs,function(i){
            //         if ($imgs.eq(i).css('left')=="0px"){
            //             $imgs.eq(i+1).addClass('active');
            //         }
            //         else{
            //             $imgs.eq(i+1).removeClass('active');
            //         }
            // });
          }, config.interval);
          $imgs.eq(i).css('left', 0).end().eq(i + 1).css('left', '1200px').end().eq(i - 1).css('left', '-1200px');
        $leftBtn.click(function() {
          if ($(':animated').length === 0) {
            silde(false);
          }
          

        });
        $rightBtn.click(function() {
          if ($(':animated').length === 0) {
            silde(true);
          }
        });
      }
    });
  }(jQuery));
  $.foucs({
    direction: 'right'
  });

  

  