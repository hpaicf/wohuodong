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
        $.extend({oop:{
        server_url:"http://115.28.133.46:8080/wohuodong/WHD/",//服务器程序地址
        target:0,
        loginCount:0,//用户登录次数
        phoneCode:"",
        second:60,
        right_nav:null,//右侧导航栏
        init:function(){//页面初始化
            var that=this;
            that.init_css()//兼容性js css
            this.tabs_model();//推荐活动切换
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
                    var _ck_slide_wrapper="";
                    var _dot_wrap="";
                    // 成功
                    if ($data.status==1) {
                        $.each($data.message,function(item,i){
                            // 轮播大图
                            _ck_slide_wrapper+='<li style="display:none">'+
                                                  '<a href="javascript:;"><img src="'+item.activityCover+'" alt="'+item.activityName+'"></a>'+
                                                '</li>';
                            // 圆点聚焦
                             _dot_wrap+='<li><em>'+(i+1)+'</em></li>';

                        });
                        //轮播dom加载
                        $(".slide_wrap ul.ck-slide-wrapper").empty().append(_ck_slide_wrapper);
                        $(".slide_wrap .dot-wrap").empty().append(_dot_wrap);
                    }
                    // 其他情况
                    else if($data.status<=0){
                        alert("正在加载....."+$data.message);
                    }
                });

        },
        
        // 首页三个板块数据模型
        index_data_global:function(listCommodity,listMission,id){
            var that=this;
                        var buyhtml="<div class='content cfirst'>"+
                                        "<label class='label'>求购</label>"+
                                        "<img src='"+that.server_url+listCommodity[0].PIC+"'>"+
                                    "</div>";//国外数据 海外专区第一个长一点
                        var item;
                        for (var i = 1; i <4; i++) {
                            item=listCommodity[i];
                            buyhtml+="<div class='content'>"+
                                    "<label class='label'>求购</label>"+
                                    "<img src='"+that.server_url+item.PIC+"'>"+
                                  "</div>";
                        }
                        var missionhtml="";
                        for (var i =0; i <3; i++) {
                            item=listMission[i];
                            missionhtml+="<div class='content'>"+
                                    "<label class='label'>求售</label>"+
                                    "<img src='"+that.server_url+item.PIC+"'>"+
                                  "</div>";
                        }
                        missionhtml+="<div class='content cfirst'>"+
                                        "<label class='label'>求售</label>"+
                                        "<img src='"+that.server_url+listMission[3].PIC+"'>"+
                                    "</div>";//最后长一点
                        $("#"+id+" .buy").empty().append(buyhtml);
                        $("#"+id+" .sell").empty().append(missionhtml);
                     
        },

        // 首页数据信息接口
        index_data:function(){
            var that=this;
             that.index_data_ajax(function($data){
                    // 成功
                    if ($data.status==1) {
                        // 海外专区
                        that.index_data_global($data.message.abroadCommodityMsg,$data.message.abroadMissionMsg,"out");
                        // 国内专区
                        that.index_data_global($data.message.domesticCommodityMsg,$data.message.domesticMissionMsg,"in");
                        // 实时任务专区
                        var taskhtml="";
                        var realTimeCommodityMsg=new Array();;
                        var realTimeMissionMsg=new Array();;
                        for (var i = 0; i<=3; i++) {
                            realTimeCommodityMsg.push($data.message.realTimeMissionMsg[i]);
                        }
                        for (var i = 4; i<8; i++) {
                            realTimeMissionMsg.push($data.message.realTimeMissionMsg[i]);
                        }
                        that.index_data_global(realTimeCommodityMsg,realTimeMissionMsg,"task");
                    }
                    // 其他提示
                    else if($data.status<=0){

                    }
            });
        },

        index_data_ajax:function($fn){
            $.ajax({
                type: 'GET',
                url: this.server_url +'main',
                dataType: 'jsonp',
                success: function($data){
                    if ($fn){$fn($data);}
                }
            });
        },

        // 右侧栏快速到达
        // quick_to:function(){
        //     /*鼠标向下滚动后触发的左边固定栏目出现事件*/
        //     var scrollFunc = function (e) { 
        //         e = e || window.event;
        //         if (e.wheelDelta < 0&& $(this).scrollTop()>150) { //当滑轮向下滚动时  
        //             $('.right_fixed').removeClass('bounceOut hide').addClass('bounceInDown animated');
        //             // setTimeout(function() {$('.right_fixed').removeClass('bounceInUp').addClass('bounceInDown animated');},10000);
        //         }
        //         if (e.wheelDelta> 0&& $(this).scrollTop()<500) { //当滑轮向上滚动时  
        //             $('.right_fixed').removeClass('bounceIn').addClass('bounceOut'); 
        //             // setTimeout(function() {$('.right_fixed').removeClass('bounceInDown').addClass('bounceInUp animated');},10000);
        //         }
        //         var thisright="l1";
        //         if (($(this).scrollTop()>=$("#out").offset().top-$(".blocktr").height())&&$(this).scrollTop()<$("#in").offset().top) {
        //             thisright="l2"
        //         }
        //         if (($(this).scrollTop()>=$("#in").offset().top-$(".blocktr").height())&&$(this).scrollTop()<$("#task").offset().top) {
        //             thisright="l3"
        //         }
        //         if (($(this).scrollTop()>=$("#task").offset().top-$(".blocktr").height())) {
        //             thisright="l4"
        //         }
        //         $("#"+thisright).siblings().removeClass("this_right");
        //         $("#"+thisright).addClass('this_right');
                
        //     }  
        //     //给页面绑定滑轮滚动事件  
        //     if (document.addEventListener) {//firefox  
        //         document.addEventListener('DOMMouseScroll', scrollFunc, false);  
        //     }

        //     //滚动滑轮触发scrollFunc方法  //ie 谷歌  
        //     window.onmousewheel = document.onmousewheel = scrollFunc;  
            
        //     // 右侧栏快速链接
        //     navMenu = $(".right .right_content");
        //     menuItems = navMenu.find("a");
        //     var offsetTop = 0;
        //     menuItems.click(function(e){
        //         var href = $(this).attr("href");
        //         $(this).parents('li').addClass('this_right');
        //         $(this).parents('li').siblings().removeClass("this_right");
        //         if(href == "#top"){
        //              offsetTop = 0;
        //         }else{
        //              offsetTop = href === "#" ? 0 : $(href).offset().top;
        //         }
        //         $('html, body').stop().animate({ 
        //             scrollTop: offsetTop
        //         }, 600);
        //         e.preventDefault();
        //     }); 

        //     //回到顶部效果
        //     $(".totop").hover(function(){
        //         $('.toptips').stop().animate({ 
        //             left: -80,opacity:'1'
        //         }, 400);
        //     },function(){
        //         $('.toptips').stop().animate({ 
        //             left: -120,opacity:'0'
        //         }, 400);
        //     });
        // },


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

            var newsRoll = new LineRoll(list_focus, 1500);
            newsRoll.rollContainer = $(box_focus);
            newsRoll.speed = 1500;
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
            var roleRoll = new LineRoll('.school_ul', 1500);
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


        // // 导航栏滑块
        // nav_to:function(){
        //     $(".nav ul li").hover(function(){
        //         var thisid=$(this).attr('id');
        //         var leftx=(thisid-1)*150;
        //         $('#this_nav').stop().animate({ 
        //             left: leftx
        //         }, 500);
        //     },function(){
        //         $('#this_nav').stop().animate({ 
        //             left:0
        //         }, 500);
        //     });
        // }

       

    }});
})(jQuery)


$(function(){
    $.oop.init();
    // 焦点图设置
    $('.ck-slide').ckSlide({
        autoPlay: true
    });
});

  