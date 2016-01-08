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
        server_url:"http://115.28.133.46:8080/PurchasingProjectNew/",//服务器程序地址
        right_nav:null,//右侧导航栏
        head_nav:null,//当前导航
        init:function(){//页面初始化
            var that=this;
            that.init_css()//兼容性js css
            that.quick_to();//快捷链接
            that.index_data();//首页信息数据接口
            that.change();//图片滑动效果
            that.item_more();
            that.nav_to();//导航栏滑块
        },
        
        init_css:function(){
            var that=this;
            $(".blocktr .content:last-child,.login_div ul li:last-child").css("margin-right","0");
            // 登录注册框的按钮初始化隐藏
            $('#login_frame #loginBtn,#register_frame #registerBtn').addClass("hide");
            
             // 右侧栏dom加载
            that.right_nav=$('<!-- 右侧栏-->'+
                              '<div class="right">'+
                                '<div class="right_fixed hide">'+
                                   '<div class="uhead">'+
                                      '<img src="assets/images/user.png">'+
                                   '</div>'+
                                   '<div class="right_content">'+
                                    ' <div class="totop">'+
                                       ' <a href="#top" id="totopBtn"></a>'+
                                     '</div>'+
                                     '<div class="toptips">'+
                                      ' 回到顶部'+
                                     '</div>'+
                                  ' </div>'+
                                   
                                '</div>'+
                              '</div>');
            
            // 右侧栏dom加载
            $(".main_center").append(that.right_nav);
            // 列表每排最后一个没有margin
            $("#sellDiv .list_item,#missionDiv .list_item").each(function(i){
                 if (i%4==3) {
                    console.log(i);
                    $(this).css('margin-right','0px');
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
        quick_to:function(){

            /*鼠标向下滚动后触发的左边固定栏目出现事件*/
            var scrollFunc = function (e) { 
                e = e || window.event;
                if (e.wheelDelta < 0&& $(this).scrollTop()>150) { //当滑轮向下滚动时  
                    $('.right_fixed').removeClass('bounceOut hide').addClass('bounceInDown animated');
                    // setTimeout(function() {$('.right_fixed').removeClass('bounceInUp').addClass('bounceInDown animated');},10000);
                }
                if (e.wheelDelta> 0&& $(this).scrollTop()<500) { //当滑轮向上滚动时  
                    $('.right_fixed').removeClass('bounceIn').addClass('bounceOut'); 
                    // setTimeout(function() {$('.right_fixed').removeClass('bounceInDown').addClass('bounceInUp animated');},10000);
                }
                
            }  
            //给页面绑定滑轮滚动事件  
            if (document.addEventListener) {//firefox  
                document.addEventListener('DOMMouseScroll', scrollFunc, false);  
            }  
            //滚动滑轮触发scrollFunc方法  //ie 谷歌  
            window.onmousewheel = document.onmousewheel = scrollFunc;  
            $(".totop").bind("click",function(){
                $('html, body').stop().animate({ 
                    scrollTop: 0
                }, 600);
            });
            //回到顶部效果
            $(".totop").hover(function(){
                $('.toptips').stop().animate({ 
                    left: -80,opacity:'1'
                }, 1000);
            },function(){
                $('.toptips').stop().animate({ 
                    left: -120,opacity:'0'
                }, 1000);
            });
        },

        // 图片滑动效果和切换
        change:function() {

            // // 图片滑动效果
            // $('.item_img').live("mouseover",function(event){

            //     $(this).find('.item_decrip').stop(true).animate({height:"90px"},200);
            // });
            //  $('.item_img').live("mouseout",function(event){
            //     console.log("leave");
            //     $(this).find('.item_decrip').stop(true).animate({height:"36px"},200);
            // });

            // 祝福墙的图片音频展示切换
            $("#sellBtn").bind("click",function(){
                $("#missionDiv").fadeOut("slow");
                $("#sellDiv").fadeIn("slow");
                $("#missionBtn").removeClass("thischange");
                $("#sellBtn").addClass("thischange");
            });
            $("#missionBtn").bind("click",function(){
                $("#sellDiv").fadeOut("slow");
                $("#missionDiv").fadeIn("slow");
                $("#sellBtn").removeClass("thischange");
                $("#missionBtn").addClass("thischange");
            });
        },

        // 每个list项目小图切换
        item_more:function() {
            $(".more_img li a").bind("mouseover",function(){
                var thisimg=$(this).find('img').attr('src');

                $(this).parent('li').siblings().removeClass('thismoreimg');
                $(this).parent('li').addClass('thismoreimg');
                $(this).parents('.more_img').prev('.item_img').find('img').attr('src',thisimg);
                console.log($(this).prev('li'));
            });           
        },

         // 导航栏滑块
        nav_to:function(){
            $(".nav ul li").hover(function(){
                var thisid=$(this).attr('id');
                var leftx=(thisid-1)*150;
                $('#this_nav').stop().animate({ 
                    left: leftx
                }, 500);
            },function(){
                $('#this_nav').stop().animate({ 
                    left:150
                }, 500);
            });
        }

    }});
})(jQuery)


$(function(){
    $.oop.init();
    // 焦点图设置
    $('.ck-slide').ckSlide({
        autoPlay: true
    });
});

  