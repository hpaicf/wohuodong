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
        $.extend({header:{
        server_url:"http://115.28.133.46:8080/wohuodong/WHD/",//服务器程序地址
        phoneCode:"",
        second:60,
        headDom:null,//头部dom的加载
        init:function(){//页面初始化
            var that=this;
            that.init_css()//兼容性js css
            // that.select_city();//全国地点选择
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

        // 页面初始化加载
        init_css:function(){
            var that=this;
             // 登录注册框的按钮初始化隐藏
            $('.main_logo img').addClass("hide");
            // 头部header  dom加载
            that.headDom=$('<!-- 头部 -->'+
                            '<div class="head">'+
                                '<div class="head_top comWidth">'+
                                    '<!-- logo -->'+
                                    '<div class="logo">'+
                                        
                                    '</div>'+
                                    '<!-- head右边部分 -->'+
                                    '<div class="head_right">'+
                                        '<div class="selectfirst" id="area">全国'+
                                            '<img src="assets/images/up.png">'+
                                            '<div class="select">'+
                                                '<ul>'+
                                                  '<li>珠海</li>'+
                                                  '<li>广州</li>'+
                                                  '<li>成都</li>'+
                                                  '<li>重庆</li>'+
                                                '</ul>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="choice">'+
                                          '<a href="../../index.html" id="indexBtn">首页</a>'+
                                          '<a href="javascript:;" id="publishaBtn">+发活动</a>'+
                                          '<a href="javascript:;" id="downloadBtn">下载APP</a>'+
                                        '</div>'+
                                        '<div class="login_div">'+
                                        '<!-- 登录后 -->'+
                                         
                                        '<!-- 登录后结束-->'+
                                        '<!-- 登录前 -->'+
                                            '<ul>'+
                                              '<li><a href="../../login.html"  id="head_loginBtn">登录</a></li>'+
                                              '<li><a href="../../register.html" id="head_registerBtn" >注册</a></li>'+
                                            '</ul>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                       '<!-- 头部结束-->');         
            // wrapper_html 最前面dom插入页面
            $(".wrapper_html").prepend(that.headDom);
            console.log("head");
        },

        //城市信息地理加载
        head_city_interface:function(){
            var that=this;
                that.model_ajax(null,'Location/AllCities/v1',function($data){
                    var _city_info="";
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

        // // 全国地点选择
        // select_city:function(){
        //     $(".selectfirst").live("mouseenter",function(){
        //         $(".select").slideDown();
        //         return false;
        //     });
        //     $(document).on("mouseleave",":not('.select,#area')",function(e){
        //         var target  = $(e.target);
        //         if(target.closest(".select").length == 0){
        //             $(".select").slideUp("fast");
        //         };
        //         e.stopPropagation();
        //     });
           
        // }

        // 首页活动接口交互
        index_activity:function(){
            var that=this;
            that.model_ajax(null,'MainPageController/activity/v1',function($data){
                    var _activity_hot_html="";
                    var _activity1_html="";
                    var _activity2——html="";
                    var _activity3_html="";
                    var _activity4_html="";
                    var _activity5_html="";
                    var _activity6_html="";
                    // 成功
                    if ($data.status==1) {
                        $.each($data.message,function(item,i){
                            // 轮播大图
                            __activity_html+='<li style="display:none">'+
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


        }
     
    }});
})(jQuery)

$(function(){
    $.header.init();
   
});

  