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
        $.extend({login:{
        server_url:"http://115.28.133.46:8080/wohuodong/WHD/",//服务器程序基础地址
        phoneCode:"",
        second:60,
        headDom:null,//头部dom的加载
        init:function(){//页面初始化
            var that=this;
            that.init_css()//兼容性js css
            that.login_model();//登录接口
            that.register_model();//注册接口
            // that.textvarify();//文本验证码接口
            that.getphone_text();//接收短信接口
            that.login_reg_check();//登录注册为空验证
        },

        // 动画封装
        animated:function(selector,addClassName,removeClassName,time){
            setTimeout(function() {$(' '+selector).removeClass('hide '+removeClassName).addClass('animated '+addClassName);},time);
        },
        
        init_css:function(){

            var that=this;
            // 初始动画加载
            that.animated('.user_label','rollIn','rollOut',600);
            that.animated('.main_logo','fadeIn','fadeOut',100);
            that.animated('.main_logo img','bounceIn','bounceOut',900);
            // 获取页面当前frame
            var frameName=$(".frame").attr('id');
            // 当前动画初始化
            that.animated('#'+frameName,'lightSpeedIn','lightSpeedOut',1100);
            that.animated('#'+frameName+' a#qq','bounceIn','bounceOut',1600);
            that.animated('#'+frameName+' a#weibo','bounceIn','bounceOut',1900);  
            that.animated('#'+frameName+' a#weichat','bounceIn','bounceOut',2300);  

            //协议按钮改变
            $("#register_frame .checkinput input[type='checkbox']").change(function(){
                $("#register_frame .warning").fadeIn();
                $("#register_frame table tr.firsttr").css('margin-top','5px');
                $("#register_frame .warning").html("只有同意协议才能注册沃活动");
                $(this).attr('checked','checked');
            });

        },


        // 登录接口
        login_model:function(){
            var that=this;
            $("#loginBtn").bind("click",function(){
                var user_account=$("#logusername").val();
                var user_psd=$("#logpassword").val();
                var check=false;
                if ($("#logRememberCheck").attr('checked')) {
                     check=true;
                }
                var data={
                    "UserName":user_account,
                    "Password":user_psd,
                    "RemeberMe":check
                };
                // 登录接口交互
                that.login_model_ajax(data,function($data){
                    var html="";
                    // 成功
                    if ($data.status==1) {
                        window.location.href="index.html";//跳转到首页
                        // 顶部状态显示用户信息Dom加载
                        html="<div class='status'>"+
                            "<div class='user'>"+
                            " <img src='"+that.server_url+$data.message.userMsg.user_pic+"'><a href='javascript:;' id='username'>"+$data.message.userMsg.user_name+"</a>"+
                            "</div>"+
                            "<div class='message'>消息<div class='count'>3</div>"+
                            "</div>"+
                            "</div>";
                        $(".login_div").empty().append(html);
                        $(".right .uhead img").attr('src',that.server_url+$data.message.userMsg.user_pic);
                    }
                    // 其他情况
                    else if($data.status<=0){
                        console.log($data.message.tips);
                        $("#login_frame .warning").fadeIn();
                        $("#login_frame .warning").html($data.message.tips);
                    }
                });

            });
        },

        // 登录接口交互
        login_model_ajax:function($param,$fn){
            var that=this;
            $.ajax({
                type: 'GET',
                url: that.server_url +'Login/login',
                dataType: 'jsonp',
                data:$param,
                success: function($data){
                    if ($fn){$fn($data);}
                }
            });
        },

        //登录注册基本验证
        login_reg_check:function(){
            $(".frame input").each(function(){
                $(this).blur(function(){//光标离开，看里面是否有值
                    var val=$(this).val();
                    var text= $(this).attr("placeholder");
                    console.log(text);
                    if(val==""){
                        var html=''+text+'不能为空';
                        $(".warning").fadeIn();
                        $(".frame table tr.firsttr").css('margin-top','5px');
                        $(".warning").empty().append(html);
                    }
                });
            });
        },

        // 注册接口
        register_model:function(){
            var that=this;
            // 点击注册
            $("#registerBtn").bind("click",function(){
                var user_phone=$("#phonenumber").val();
                var user_psd=$("#regpassword").val();
                var user_phonevarify=$("#phonevarifytext").val();
                var data=null;
                data={
                    "password":user_psd,
                    "mobile":user_phone,
                    "code":user_phonevarify
                };
                console.log(data.pwd);
                // 注册接口交互
                that.register_model_ajax(data,function($data){
                    // $data={"messgage":"注册成功","status":1};
                    var html="";
                        // 成功
                        if ($data.status==1) {
                            // 提醒框显示
                            html='<p>恭喜官人！注册沃活动账号成功，马上登录吧<a href="../login.html" id="regsucceedlogin">立即登录</a></p></div>';
                            $("#warning_frame .warning_content").empty().append(html);
                            that.warning_open();
                        }
                        // 其他情况
                        else if($data.status<=0){
                            console.log($data.messgage);
                            $("#register_frame .warning").fadeIn();
                            $("#register_frame  table tr.firsttr").css('margin-top','5px');
                            $("#register_frame .warning").html($data.messgage);
                        }
                });

            });
        },

        register_model_ajax:function($param,$fn){
            var that=this;
            $.ajax({
                type: 'GET',
                url: that.server_url +'register/data',
                dataType: 'jsonp',
                data:$param,
                success: function($data){
                    if ($fn){$fn($data);}
                }
            });
        },

        // 短信倒计时
        seconds:function(){
            var that=this;
            $('#phonegetvarify span').html(that.second);
            if (that.second == 0) {
                html="获取验证码<span></span>";
                $('#phonegetvarify').html(html);
            }
            else {
                setTimeout(function(){
                    that.second--;
                    that.seconds();
                }, 1000);
            }
            console.log(that.second);
        },

        // 接收短信接口
        getphone_text:function(){
            var that=this;
            $("#phonegetvarify").bind("click",function(){              
                var phoneCode=$("#phonenumber").val();
                console.log(phoneCode);
                var data={"mobile":phoneCode};
                that.getphone_text_ajax(data,function($data){
                    console.log($data);
                    // 成功
                    if ($data.status==1) {
                        var s=60;
                        $('#phonegetvarify').empty().append("短信发送成功<span>60</span>");
                        that.seconds();//倒计时
                    }
                    // 其他提示
                    else if($data.status<=0){
                        $("#register_frame .warning").fadeIn();
                        $("#register_frame table tr.firsttr").css('margin-top','5px');
                        $("#register_frame .warning").html($data.messgage);
                    }
                });

            });
        },

        // 短信接口交互
        getphone_text_ajax:function($param,$fn){
            $.ajax({
                type: 'GET',
                url: this.server_url +'verify/getTelCode',
                dataType: 'jsonp',
                data:$param,
                jsonp:"callback",
                success: function($data){
                    console.log($data);
                    if ($fn){$fn($data);}
                },
                error:function(e){
                    console.log("error");
                     console.log(e);
                }
            });
        },

        // // 文本验证码切换
        // textvarify:function(){
        //     var that=this;
        //     $("a#textgetvarify").bind("click",function(){
        //         var random=Math.floor(Math.random()*50+1);
        //         $("#textgetvarify img").attr("src","http://115.28.133.46:8080/PurchasingProjectNew/securityCode/createCode?"+random); 

        //     });
        // },


    }});
})(jQuery)

$(function(){
    $.login.init();

});

  