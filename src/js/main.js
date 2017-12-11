$(document).ready(function(){
    $('head').breakpoints({
        init: true,
    });

    console.log('You are in '+ window.breakpoint +' breakpoint');
});

$(window).resize(function(){
   $('head').breakpoints();

   console.log('You are in '+ window.breakpoint +' breakpoint');
});