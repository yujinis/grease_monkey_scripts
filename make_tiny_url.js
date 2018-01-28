// ==UserScript==
// @name         Make tiny url
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      *
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// ==/UserScript==
 
(function() {
    'use strict';
 
    //long to short
    document.addEventListener('keydown', function(event){
        if(!event.ctrlKey || event.keyCode != 84) return;
        var path = window.location.href.split(/[/.]/);
        var comm = "";
        comm = window.prompt("Alias", path[path.length-2]);
        if(comm === null) return;
        $.getJSON('https://tinyurl.com/create.php',
                  {url:window.location.href,alias:comm},
                  function(data) {
                      var text = "";
                      if(data.short_url) {
                          GM_setClipboard(data.short_url);
                          text = "<font color='lawngreen' size='5'>✓</font> Copied tinified URL → <b>"+data.short_url;
                      }else{
                          text = "<font color='lawngreen' size='5'>✓</font> Failed to tinify url... ";
                      }
                      $(document.body).append(
                          $("<div id='tinyurl_show' align='center'>"+text+"</div>").css(
                              {'background-color':"aliceblue",
                               "color":"black",
                               opacity: 0.7,
                               padding : "5px",
                               height:"35px",
                               width:window.innerWidth+"px",
                               position: "absolute",
                               "z-index":10000,
                               "font-size": "16px",
                               top: $(window).scrollTop()+"px",
                               left: "0px",
                               display: "none",
                          })
                      );
                      $(window).scroll(function(){
                          $("#tinyurl_show").css({top: $(window).scrollTop()});
                      });
                      $("#tinyurl_show").slideDown(275);
                      setTimeout(function(){$("#tinyurl_show").slideUp(275, function(){$(this).remove();});},3500);
                  }
        );
    });
})();
