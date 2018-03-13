// ==UserScript==
// @name         Make timezones
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       yujinis
// @include      *
// @require      https://internal-cdn.amazon.com/btk.amazon.com/ajax/libs/jquery/2.1.4/jquery-2.1.4.min.js
// @grant        GM_setClipboard
// ==/UserScript==

var hassecond = true;

function t(time,zone){
    var weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    var YYYY = time.getFullYear();
    var MM = ('0' + (time.getMonth()+1) ).slice(-2); /* Date has month starting from 0 */
    var DD = ('0' + time.getDate()).slice(-2);
    var hh = ('0' + time.getHours()).slice(-2);
    var mm = ('0' + time.getMinutes()).slice(-2);
    var ss = ('0' + time.getSeconds()).slice(-2);
    var day = weekday[ time.getDay() ];

    /* No way to take expected timezone...
    var offset = time.getTimezoneOffset();
    var zone = "";
    if(offset === 0){
        zone = "UTC";
    }else if(offset === -540 ){
        zone = "JST";
    }else if(offset === 480 ){
        zone = "PST";
    }
    */

    if(hassecond){
        return YYYY+"/"+MM+"/"+DD+" "+day+" "+hh+":"+mm+":"+ss+" "+zone;
    }else{
        return YYYY+"/"+MM+"/"+DD+" "+day+" "+hh+":"+mm+" "+zone;
    }
}

(function() {
    'use strict';
    document.addEventListener('keydown', function(event){
        if(!event.ctrlKey || event.keyCode != 66) return; // Ctrl-B
        var selected = String(window.getSelection()).trim();
        if(selected==="") return;

        var jst = null;
        var utc = null;
        var pdt = null;
        var pst = null;

        var zone = "";

        /*02/06(火) 23:07*/
        if(/[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]/.test(selected)){
            zone = "JST";
        }else if(/JST|jst/.test(selected)){
            zone = "JST";
        }else if(/PST|pst/.test(selected)){
            zone = "PST";
        }else if(/PDT|pdt/.test(selected)){ /* Summer time for PST */
            zone = "PDT";
        }else{
            zone = "UTC";
        }

        var isdatejp = false;
        if(/[\u5E74\u6708\u65E5]/.test(selected)){ /* 年月日 */
            isdatejp = true;
        }

        /*2月6日23時07分*/
        var istimejp = false;
        if(/[\u6642\u5206\u79D2]/.test(selected)){ /* 時分秒 */
            istimejp = true;
        }

        /*Tuesday 6 Feburary, 2018 23:07:22 JST*/
        var ismonthen = false;
        if(/January|February|March|April|May|June|July|August|September|October|November|December/.test(selected)){ /* Correct Feburary!!! */
            ismonthen = true;
        }

        var local = new Date(Date.now());
        if(true){
            var date;
            if(isdatejp){
                date = selected.match(/([0-9]{4})[ ]*\u5E74[ ]*([0-9]{1,2})[ ]*\u6708[ ]*([0-9]{1,2})[ ]*\u65E5/i);
                if( date === null ){
                    date = selected.match(/([0-9]{1,2})[ ]*\u6708[ ]*([0-9]{1,2})[ ]*\u65E5/i);
                }
            }else if(ismonthen){
                date = selected.match(/([0-9]{1,2}) [ ]*(January|February|March|April|May|June|July|August|September|October|November|December)[, ]*([0-9]{4})/); /* Correct Feburary!!! */
                if( date === null ){
                    date = selected.match(/([0-9]{1,2}) [ ]*(January|February|March|April|May|June|July|August|September|October|November|December)/); /* Correct Feburary!!! */
                }
            }else{
                date = selected.match(/([0-9]{4})[\/\-]([0-9]{1,2})[\/\-]([0-9]{1,2})/i);
                if( date === null ){
                    date = selected.match(/([0-9]{1,2})[\/\-]([0-9]{1,2})/i);
                }
            }

            var time;
            if(istimejp){
                time = selected.match(/([0-9]{1,2})[ ]*\u6642[ ]*([0-9]{1,2})[ ]*\u5206[ ]*([0-9]{1,2})[ ]*\u79D2/i);
                if( time === null){
                    time = selected.match(/([0-9]{1,2})[ ]*\u6642[ ]*([0-9]{1,2})[ ]*\u5206/i);
                    hassecond = false;
                }
           }else{
			    /* ： \uFF1A */
                time = selected.match(/([0-9]{1,2})[:\uFF1A]([0-9]{1,2})[:\uFF1A]([0-9]{1,2})/i);
                if( time === null){
                    time = selected.match(/([0-9]{1,2}):([0-9]{1,2})/i);
                    hassecond = false;
                }
           }

            var hour, min, year, month, day, sec;
            var date_set = true;
            if(date !== null){
                if(ismonthen){
                    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    if( !isNaN(date[3]) ){
                        year  = Number(date[3]);
                        month = months.indexOf(date[2]); /* Date has month starting from 0 */
                        day   = Number(date[1]);
                    }else if( !isNaN(date[2]) ){
                        year  = local.getFullYear();
                        month = months.indexOf(date[2]); /* Date has month starting from 0 */
                        day   = Number(date[1]);
                    }else{
                        date_set = false;
                    }
                }else{
                    if( !isNaN(date[3]) ){
                        year  = Number(date[1]);
                        month = Number(date[2])-1; /* Date has month starting from 0 */
                        day   = Number(date[3]);
                    }else if( !isNaN(date[2]) ){
                        year  = local.getFullYear();
                        month = Number(date[1])-1; /* Date has month starting from 0 */
                        day   = Number(date[2]);
                    }else{
                        date_set = false;
                    }
                }
            }else{
                date_set = false;
            }

            if( !date_set ){
                var _date = t(local);
                _date = window.prompt("Date : ", _date.split(" ")[0]);
                if( _date === null) return;

                date = _date.match(/([0-9]{4})\/([0-9]{1,2})\/([0-9]{1,2})/i);
                year  = Number(date[1]);
                month = Number(date[2])-1; /* Date has month starting from 0 */
                day   = Number(date[3]);
            }

            var time_set = true;
            if(time !== null ){
                if( !isNaN(time[3]) ){
                    hour = Number(time[1]);
                    min  = Number(time[2]);
                    sec  = Number(time[3]);
                }else if( !isNaN(time[2]) ){
                    hour = Number(time[1]);
                    min  = Number(time[2]);
                    sec  = 0;
                }else{
                    time_set = false;
                }
            }else{
                time_set = false;
            }

            if( !time_set ){
                var _time = t(local);
                _time = window.prompt("Time : ", _time.split(" ")[1]);
                if( _time === null) return;

                time = _time.match(/([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})/i);
                hour = Number(time[1]);
                min = Number(time[2]);
                sec = Number(time[3]);
            }

            console.log(zone);
            if(zone==="JST"){
                jst = new Date(year,month,day,hour,min,sec);
                utc = new Date(year,month,day,hour-9,min,sec);
                pdt = new Date(year,month,day,hour-9-7,min,sec);
                pst = new Date(year,month,day,hour-9-8,min,sec);
            }else if(zone==="UTC"){
                jst = new Date(year,month,day,hour+9,min,sec);
                utc = new Date(year,month,day,hour,min,sec);
                pdt = new Date(year,month,day,hour-7,min,sec);
                pst = new Date(year,month,day,hour-8,min,sec);
            }else if(zone==="PST"){
                jst = new Date(year,month,day,hour+8+9,min,sec);
                utc = new Date(year,month,day,hour+8,min,sec);
                pdt = new Date(year,month,day,hour+1,min,sec);
                pst = new Date(year,month,day,hour,min,sec);
            }else if(zone==="PDT"){
                jst = new Date(year,month,day,hour+7+9,min,sec);
                utc = new Date(year,month,day,hour+7,min,sec);
                pdt = new Date(year,month,day,hour,min,sec);
                pst = new Date(year,month,day,hour-1,min,sec);
            }
        }

        console.log(t(jst,"JST"));
        console.log(t(utc,"UTC"));
        console.log(t(pdt,"PDT"));
        console.log(t(pst,"PST"));

        var text = "";
        text = t(jst,"JST") + "\n" + t(utc,"UTC") + "\n" + t(pdt, "PDT") + "\n" + t(pst,"PST") + "\n";

        var font_size = 16;
        $(document.body).append(
            $("<div id='citation_show' align='left'> Copied the timezones.<br><br><b>"+text.replace(/\n/g,"<br>")+"</div>").css(
                {'background-color':"salmon",
                 "color":"black",
                 "font-size": font_size+"px",
                 position: "absolute",
                 top: $(window).scrollTop()+"px",
                 left: "0px",
                 height:font_size*7+"px",
                 padding : "10px",
                 "z-index":10000,
                 "line-height":font_size+"px",
                 opacity: 1,
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
