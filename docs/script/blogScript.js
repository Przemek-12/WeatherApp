window.addEventListener('load', ()=>{
   
    document.querySelectorAll('article').forEach(item=>{
        item.addEventListener('click', ()=>{window.location.href='blogArticle.html?art='+item.id});
    })
});