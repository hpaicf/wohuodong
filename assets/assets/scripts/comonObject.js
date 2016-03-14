var comobject=new comobject();
//接口封装
comobject.prototype.model_ajax=function($param,$url,$fn){
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
};