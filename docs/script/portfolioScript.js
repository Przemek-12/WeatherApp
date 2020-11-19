window.addEventListener('load', ()=>{
   
    var folder = "./media/portfolio/";

    for(var i=1; i<15; i++){
        console.log(folder + i+'.jpg')
        $("main").append( "<img id='"+i+"' src='"+ folder + i+'.jpg'+"'>" );
    }

    $('img').click((item)=>{
        var lightboxDisplay = $('#lightbox').css('display');
        if(lightboxDisplay==='none'){
            $('#lightbox').css('display', 'flex');
            $('#lightboxImg').css('background-image', "url('"+folder+item.target.id+".jpg')");

        }
        else{
            $('#lightbox').css('display', 'none');
        }  
    });

    $('#lightbox').click(()=>{
        $('#lightbox').css('display', 'none');
    });
});

