window.addEventListener('load', ()=>{
   
    var folder = "media/portfolio/";

    for(var i=1; i<15; i++){
        console.log(folder + i+'.JPG')
        $("main").append( "<img id='"+i+"' src='"+ folder + i+'.JPG'+"'>" );
    }

    $('img').click((item)=>{
        var lightboxDisplay = $('#lightbox').css('display');
        if(lightboxDisplay==='none'){
            $('#lightbox').css('display', 'flex');
            $('#lightboxImg').css('background-image', "url('media/portfolio/"+item.target.id+".JPG')");

        }
        else{
            $('#lightbox').css('display', 'none');
        }  
    });

    $('#lightbox').click(()=>{
        $('#lightbox').css('display', 'none');
    });
});

