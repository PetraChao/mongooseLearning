$(function(){
  $(".del").click(function(e){
    var target = $(e.target);
    var id = target.data("id");
    var tr = $(".item-id-" + id);
    $.ajax({
      url:"/admin/list?id="+id,
      type:"DELETE"
    }).done(function(results){
      if(results.success ==1 ){
        if(tr.length > 0){
          console.log("before remove tr:", tr);
          var afterReMove = tr.remove();
          console.log("after remove tr:", tr);
          console.log("afterReMove:", afterReMove);
        }
      }
    });
  });
})