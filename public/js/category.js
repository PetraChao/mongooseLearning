$(function(){
  $(".del").click(function(e){
    var target = $(e.target);
    var id = target.data("id");
    var tr = $(".item-id-" + id);
    $.ajax({
      url:"/admin/category/list?id="+id,
      type:"delete"
    }).done(function(results){
      if(results.success ==1 ){
        if(tr.length > 0){
          var afterReMove = tr.remove();
        }
      }
    });
  });
})