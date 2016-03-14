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
        $.extend({list:{
        server_url:"http://103.55.27.51:8080/wohuodong/WHD/",//服务器程序地址
        right_nav:null,//右侧导航栏
        head_nav:null,//当前导航
        init:function(){//页面初始化
            var that=this;
            that.init_css()//兼容性js css
            that.getgroup_list(4,1);
            that.get_groupclasses()//获取圈子类别的分类
            that.select_model();//圈子类型查找
        },
        
        init_css:function(){
            var that=this;
           
            
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


        // 圈子接口开始
        // 圈子类型选择加载
        /*圈子分类 getclasses
           圈子地区*/
        get_groupclasses:function(){
            var that=this;
            var _group_classes_ul=['<li><a href="javascript:;" class="this">全部圈子</a></li>'];
            that.model_ajax(null,"Group /getGroupType1/v1",function($data){
                if($data.status==1){
                    $.each($data.message, function(i,object){
                          _group_classes_ul.push('<li><a href="javascript:;" id="'+object.Id+'">'+object.TypeName+'</a></li>');  
                    });
                    $("#grouplist .classify .classes ul").empty().append(_group_classes_ul.join(''));

                }
            }); 
        },

        get_grouparea:function(){
            var that=this;
            var _group_area_ul=['<li><a href="javascript:;">全部圈子</a></li>'];
            that.model_ajax(null,"Group/getGroupType2/v1",function($data){
                if($data.status==1){
                    $.each($data.message, function(i,object){
                          _group_classes_ul.push('<li><a href="javascript:;">'+object.TypeName+'</a></li>');  
                    });
                    $("#grouplist .classify .classes ul").empty().append(_group_classes_ul.join(''));

                }
            }); 
        },

        // 圈子类型查找列表
        select_model:function(){
            var that=this;
            // 圈子类型查找
            $("#grouplist .classes ul li a").live("click",function(){
                var id=$(this).attr('id');
                console.log(id);
                that.getgroup_list(4,1,id);
            });
        },



        // 获取圈子展示列表
        getgroup_list:function($showCount,$page,$GroupType1,$CityId){
            var that=this;
            var _re_circle=[];
            that.model_ajax({
                showCount:$showCount,
                pageNum:$page,
                GroupType1:$GroupType1,
                CityId:$CityId
            },"Group/getGroupList/v1",function($data){
                if($data.status==1){
                    if($data.message.GroupMsg.length> 0){
                        $.each($data.message.GroupMsg, function(i,object){
                            console.log(object);
                            _re_circle.push('<li>'+
                                    '<div class="circle_img">'+
                                        '<img src="'+object.GroupCover+'">'+
                                    '</div>'+
                                    '<div class="item_info">'+
                                        '<div class="info_title">'+object.GroupName+
                                        '<p>'+object.Remark+'</p>'+
                                        '</div>'+
                                        '<div class="other">'+
                                        '<div class="other_right">'+
                                            '<div class="publisher">'+
                                                '<img src="assets/images/publisher.jpg"><span>'+object.CreateUserName+'<span>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="other_right middle">'+
                                            '<div class="publisher">'+
                                                '<div class="publiserimg"></div><span>'+object.MemberCount+'人已经加入<span>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="other_right right">'+
                                            '<div class="publisher">'+
                                                '<div class="publiserimg"></div><span>我要加入<span>'+
                                            '</div>'+
                                        '</div>'+
                                        '</div>'+ 
                                    '</div>'+
                                '</li>');
                        });
                        $("#grouplist .re_circle ul").empty().append(_re_circle.join(''));
                        $("#grouplist .page_content  .page_info").html("共"+$data.message.PageMsg.TotalPage+"页");
                        $("#grouplist .page_content").show();
                        $("#grouplist .pagination").pagination($data.message.PageMsg.TotalResult, {
                            "items_per_page":$showCount,
                            "num_display_entries":5,
                            "prev_text":"上一页",
                            "next_text":"下一页",
                            "callback":window.page_grouplist_callback
                        });
                    } else {
                        $("#grouplist .re_circle ul").empty().append('<p class="error">暂无数据</p>');
                        $("#grouplist .page_content").hide();
                    } 
                }
                else{
                    $("#grouplist .re_circle ul").empty().append('<p class="error">暂无数据</p>');
                    $("#grouplist .page_content").hide();
                }
            });
                
        },



        // 活动接口开始
        // 获取活动展示列表
        getactivity_list:function($page){
            var that=this;
            var _re_circle=[];
            that.model_ajax({
                showCount:4,
                pageNum:$page
            },"Group/getGroupList/v1",function($data){
                if($data.status==1){
                    if($data.message.GroupMsg.length> 0){
                        $.each($data.message.GroupMsg, function(i,object){
                            _re_circle.push('<li>'+
                                    '<div class="circle_img">'+
                                        '<img src="'+object.GroupCover+'">'+
                                    '</div>'+
                                    '<div class="item_info">'+
                                        '<div class="info_title">'+object.GroupName+
                                        '<p>'+object.Remark+'</p>'+
                                        '</div>'+
                                        '<div class="other">'+
                                        '<div class="other_right">'+
                                            '<div class="publisher">'+
                                                '<img src="assets/images/publisher.jpg"><span>'+object.CreateUserName+'<span>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="other_right middle">'+
                                            '<div class="publisher">'+
                                                '<div class="publiserimg"></div><span>'+object.MemberCount+'人已经加入<span>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="other_right right">'+
                                            '<div class="publisher">'+
                                                '<div class="publiserimg"></div><span>我要加入<span>'+
                                            '</div>'+
                                        '</div>'+
                                        '</div>'+ 
                                    '</div>'+
                                '</li>');
                        });
                        $("#grouplist .re_circle ul").empty().append(_re_circle.join(''));
                        $("#grouplist .page_content  .page_info").html("共"+$data.message.PageMsg.TotalPage+"页");
                        $("#grouplist .page_content").show();
                        $("#grouplist .pagination").pagination($data.message.PageMsg.TotalResult, {
                            "items_per_page":4,
                            "num_display_entries":5,
                            "prev_text":"上一页",
                            "next_text":"下一页",
                            "callback":window.page_grouplist_callback
                        });
                    } else {
                        $("#grouplist .list_content").empty().append("<p align=\"center\ style='margin-top:100px'>暂无数据</p>");
                        $("#grouplist .page_content").hide();
                    } 
                }
                else{
                    $("#grouplist .list_content").empty().append("<p align=\"center\ style='margin-top:100px'>暂无数据</p>");
                    $("#grouplist .page_content").hide();
                }
            });
                
        }


            


        

    }});
})(jQuery)


$(function(){
    $.list.init();
   
    //列表分页回调
    
});
function page_grouplist_callback($page,jq){
            var that=this;
            var _re_circle=[];
            // var showCount,pageNum,GroupType1,CityId;
            // showCount=$param.showCount;
            // pageNum=$param.pageNum;
            // GroupType1=$param.GroupType1;
            // CityId=$param.CityId;
            // console.log(showCount+"v"+pageNum+"v"+GroupType1);
            $.list.model_ajax({
                showCount:4,
                pageNum:$page+1,
            },"Group/getGroupList/v1",function($data){
                if($data.status==1){
                    if($data.message.GroupMsg.length> 0){
                        $.each($data.message.GroupMsg, function(i,object){
                            _re_circle.push('<li>'+
                                    '<div class="circle_img">'+
                                        '<img src="'+object.GroupCover+'">'+
                                    '</div>'+
                                    '<div class="item_info">'+
                                        '<div class="info_title">'+object.GroupName+
                                        '<p>'+object.Remark+'</p>'+
                                        '</div>'+
                                        '<div class="other">'+
                                        '<div class="other_right">'+
                                            '<div class="publisher">'+
                                                '<img src="assets/images/publisher.jpg"><span>'+object.CreateUserName+'<span>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="other_right middle">'+
                                            '<div class="publisher">'+
                                                '<div class="publiserimg"></div><span>'+object.MemberCount+'人已经加入<span>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="other_right right">'+
                                            '<div class="publisher">'+
                                                '<div class="publiserimg"></div><span>我要加入<span>'+
                                            '</div>'+
                                        '</div>'+
                                        '</div>'+ 
                                    '</div>'+
                                '</li>');
                        });
                        $("#grouplist .re_circle ul").empty().append(_re_circle.join(''));
                       
                    } else {
                        $("#grouplist .list_content").empty().append("<p align=\"center\ style='margin-top:100px'>暂无数据</p>");
                        $("#grouplist .page_content").hide();
                    } 
                }
                else{
                    $("#grouplist .list_content").empty().append("<p align=\"center\ style='margin-top:100px'>暂无数据</p>");
                    $("#grouplist .page_content").hide();
                }
            });
    }

  