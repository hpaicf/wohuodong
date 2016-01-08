var console=console||{log:function(){}};
(function($){
        $.extend({footer:{
        server_url:"http://115.28.133.46:8080/PurchasingProjectNew/",//服务器程序地址
        footerDom:null,//注册弹出框
        init:function(){//页面初始化
        	var that=this;
            that.init_css()//兼容性js css
        },
        
        init_css:function(){
            var that=this;
            // 底部footer  dom加载
            that.footerDom=$(' <!-- 底部 -->'+
							    '<div class="footer">'+
							      '<div class="foot_main">'+
							        '<div class="foot_b1 foot">'+
							          '关注我们：'+
							            '<div class="users">'+
							                '<a href="javascript:;" id="qq"></a>'+
							                '<a href="javascript:;" id="weibo"></a>'+
							                '<a href="javascript:;" id="weichat"></a>'+
							            '</div>'+
							        '</div>'+
							        '<div class="foot_b2 foot ">'+
							          ' <ul>'+
							              '<li><a href="javascript:;">使用帮助</a></li>'+
							              '<li><a href="javascript:;">关于我们</a></li>'+
							              '<li><a href="javascript:;">合作申请</a></li>'+
							              '<li class="noline"><a href="javascript:;">意见反馈</a></li>'+
							              '<li class="link noline">友情链接：<a href="javascript:;">背景师范大学珠海分校官网</a></li>'+
							          '</ul>'+
							        '</div>'+
							        '<div class="foot_b3 foot">'+
							           
							        '</div>'+
							        '<div class="foot_bottom">'+
							            '<ul>'+
							              '<li><a href="javascript:;">广ICP备120110119号</a></li>'+
							              '<li><a href="javascript:;">copyright@wohuodong.com </a></li>'+
							              '<li><a href="javascript:;">沃活动网</a></li>'+
							            '</ul>'+
							        '</div>'+
							      '</div>'+ 
							    '</div>');
            // 插入注册框
             $(".wrapper_html").after(that.footerDom);
        }
    }});
})(jQuery)

$(function(){
   $.footer.init();
});

  