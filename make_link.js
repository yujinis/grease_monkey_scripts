// ==UserScript==
// @name         Make link to take title of tag
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      *
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_setClipboard
// ==/UserScript==
 
(function() {
    'use strict';
 
    //long to short
    document.addEventListener('keydown', function(event){
        if(!event.ctrlKey || event.keyCode != 69) return; // 65 = A ... 69 = E ... Z = 90
        var paths = window.location.href.split("/");
        var last = paths[paths.length-1];
        var id = "";
        if( 0 <= last.indexOf("#") ){
            id = last.split("#")[1];
        }
 
        var title = "";
        if(id===""){
            title = document.title;
        }else{
            if(0 <= id.indexOf(".")){
                title = $("#"+id.replace(/\./g,"\\\.")).text();
            }else{
                title = $("#"+id).text();
            }
        }
        alert(title);
        var text = "";
        text += title;
        text += "\n";
        text += window.location.href;
        alert("Copied link.\n\n" + text);
        GM_setClipboard(text);
    });
})();

