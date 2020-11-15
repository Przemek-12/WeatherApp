window.addEventListener('load', ()=>{

var form = document.getElementById('form');
var email = document.getElementById('emailinput');
var topic = document.getElementById('topicinput');
var message = document.getElementById('messageinput');

form.addEventListener("submit",(event)=>{
    event.preventDefault();
    Email.send({
        Host : "smtp.gmail.com",
        Username : "wick789123@gmail.com",
        Password : "tgaspwdyjkfjbjnk",
        To : "wick789123@gmail.com",
        From : email.value,
        Subject : topic.value,
        Body : message.value
    }).then(
      resp => console.log(resp)
    );
});

});