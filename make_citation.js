// ==UserScript==
// @name         Make citation
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       yujinis
// @include      *
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_setClipboard
// ==/UserScript==
 
(function() {
    'use strict';
    document.addEventListener('keydown', function(event){
        if(!event.ctrlKey || event.keyCode != 68) return; // Ctrl-D
        var sel = String(window.getSelection());
        if(sel==="") return;
        var sels = sel.split("\n");
        var text = "";
        var sel_len = 0;
        for(var i=0; i < sels.length; i++){
            if(sels[i]===""){
                text += "\n";
            }else{
                text += "> "+sels[i]+"\n";
                if(sel_len < sels[i].length){
                    sel_len = sels[i].length;
                }
            }
        }
 
        var font_size = 15;
        $(document.body).append(
            $("<div id='citation_show' align='left'> Copied the selected with citation.<br><br><b>"+text.replace(/\n/g,"<br>")+"</div>").css(
                {'background-color':"gold",
                 "color":"black",
                 "font-size": font_size+"px",
                 position: "absolute",
                 top: $(window).scrollTop()+"px",
                 left: "0px",
                 height:sels.length*font_size*Math.sqrt(sel_len/sels.length)+"px",
                 padding : "10px",
                 "z-index":10000,
                 "line-height":font_size+"px",
                 opacity: 0.9,
                 display: "none",
            })
        );
 
        $(window).scroll(function(){
            $("#citation_show").css({top: $(window).scrollTop()});
        });
        $("#citation_show").slideDown(275);
        setTimeout(function(){$("#citation_show").slideUp(275, function(){$(this).remove();});},4500);
 
        GM_setClipboard(text);
    });
})();
