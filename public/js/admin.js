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
          var afterReMove = tr.remove();
        }
      }
    });
  });
  $("#douban").blur(function(){
    var douban = $(this);
    var id = douban.val();
    console.log("blur");
    if(id){
      $.ajax({
        url: "https://api.douban.com/v2/movie/subject/" +id,
        cache: true,
        type: "get",
        dataType: "jsonp",
        crossDomain:true,
        jsonp: "callback",
        success: function(data){
          console.log(data);
          $("#inputTitle").val(data.title);
          $("#inputDoctor").val(data.directors[0].name);
          $("#inputCountry").val(data.countries[0]);
          $("#inputPoster").val(data.images.large);
          // $("#inputFlash").val(data.);
          $("#inputYear").val(data.year);
          $("#inputSummary").val(data.summary);
        }
      });
    }
  });
});