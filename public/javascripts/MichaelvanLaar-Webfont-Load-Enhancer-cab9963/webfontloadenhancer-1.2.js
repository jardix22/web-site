/*
* Webfont Load Enhancer
*
* A little script mashup by Michael van Laar, using existing JavaScript solutions
* for a better Webfont loading and display experience
*
* For (minimal) configuration and usage instructions, see readme.txt
* (included in the zip file)
* Always use the minified version webfontloadenhancer.min.js for the final website
* to save some kilobytes.
*
* Original scripts credits (details see below):
* - Zoltan Hawryluk, http://www.useragentman.com
* - Paul Irish, http://www.paulirish.com
*
* For comments, suggestions etc. see http://www.michael-van-laar.de
*
*/



/*
* Stripped down EventHelpers.js script
* Original script by Zoltan Hawryluk
* EventHelpers.js v.1.3 available at http://www.useragentman.com/
* Original script released under the MIT License. http://www.opensource.org/licenses/mit-license.php
*/

 var EventHelpers = new function () {
var me = this;

var safariTimer;
var isSafari = /WebKit/i.test(navigator.userAgent);
    var globalEvent;

me.init = function () {
if (me.hasPageLoadHappened(arguments)) {
return;
}

if (document.createEventObject){
// dispatch for IE
globalEvent = document.createEventObject();
} else if (document.createEvent) {
globalEvent = document.createEvent("HTMLEvents");
}

me.docIsLoaded = true;
}

/**
* Adds an event to the document. Examples of usage:
* me.addEvent(window, "load", myFunction);
* me.addEvent(docunent, "keydown", keyPressedFunc);
* me.addEvent(document, "keyup", keyPressFunc);
*
* @author Scott Andrew - http://www.scottandrew.com/weblog/articles/cbs-events
* @author John Resig - http://ejohn.org/projects/flexible-javascript-events/
* @param {Object} obj - a javascript object.
* @param {String} evType - an event to attach to the object.
* @param {Function} fn - the function that is attached to the event.
*/
    me.addEvent = function(obj, evType, fn){
    
        if (obj.addEventListener) {
            obj.addEventListener(evType, fn, false);
        } else if (obj.attachEvent) {
            obj['e' + evType + fn] = fn;
            obj[evType + fn] = function(){
                obj["e" + evType + fn](self.event);
            }
            obj.attachEvent("on" + evType, obj[evType + fn]);
        }
    }


    /**
* Will execute a function when the page's DOM has fully loaded (and before all attached images, iframes,
* etc., are).
*
* Usage:
*
* EventHelpers.addPageLoadEvent('init');
*
* where the function init() has this code at the beginning:
*
* function init() {
*
* if (EventHelpers.hasPageLoadHappened(arguments)) return;
*
* // rest of code
* ....
* }
*
* @author This code is based off of code from http://dean.edwards.name/weblog/2005/09/busted/ by Dean
* Edwards, with a modification by me.
*
* @param {String} funcName - a string containing the function to be called.
*/
    me.addPageLoadEvent = function(funcName){
    
        var func = eval(funcName);
        
        // for Internet Explorer (using conditional comments)
        /*@cc_on @*/
        /*@if (@_win32)
pageLoadEventArray.push(func);
return;
/*@end @*/
        if (isSafari) { // sniff
            pageLoadEventArray.push(func);
            
            if (!safariTimer) {
            
                safariTimer = setInterval(function(){
                    if (/loaded|complete/.test(document.readyState)) {
                        clearInterval(safariTimer);
                        
                        /*
* call the onload handler
* func();
*/
                        me.runPageLoadEvents();
                        return;
                    }
                    set = true;
                }, 10);
            }
            /* for Mozilla */
        } else if (document.addEventListener) {
            var x = document.addEventListener("DOMContentLoaded", func, null);
            
            /* Others */
        } else {
            me.addEvent(window, 'load', func);
        }
    }
    
    var pageLoadEventArray = new Array();
    
    me.runPageLoadEvents = function(e){
        if (isSafari || e.srcElement.readyState == "complete") {
        
            for (var i = 0; i < pageLoadEventArray.length; i++) {
                pageLoadEventArray[i]();
            }
        }
    }
    /**
* Determines if either addPageLoadEvent('funcName') or addEvent(window, 'load', funcName)
* has been executed.
*
* @see addPageLoadEvent
* @param {Function} funcArgs - the arguments of the containing. function
*/
    me.hasPageLoadHappened = function(funcArgs){
        // If the function already been called, return true;
        if (funcArgs.callee.done)
            return true;
        
        // flag this function so we don't do the same thing twice
        funcArgs.callee.done = true;
    }

    /* EventHelpers.init () */
    function init(){
        // Conditional comment alert: Do not remove comments. Leave intact.
        // The detection if the page is secure or not is important. If
        // this logic is removed, Internet Explorer will give security
        // alerts.
        /*@cc_on @*/
        /*@if (@_win32)
document.write('<script id="__ie_onload" defer src="' +
((location.protocol == 'https:') ? '//0' : 'javascript:void(0)') + '"><\/script>');
var script = document.getElementById("__ie_onload");
me.addEvent(script, 'readystatechange', me.runPageLoadEvents);
/*@end @*/
        
    }
    
    init();
}

EventHelpers.addPageLoadEvent('EventHelpers.init');



/*
* Slightly modified TypeHelpers.js script (version 1.0)
* Original script by Zoltan Hawryluk
* Original script released under the MIT License. http://www.opensource.org/licenses/mit-license.php
*/

var TypeHelpers = new function(){
   var me = this;
   
   me.hasSmoothing = function(){
   
      // IE has screen.fontSmoothingEnabled - sweet!
      if (typeof(screen.fontSmoothingEnabled) != "undefined") {
         return screen.fontSmoothingEnabled;
      } else {

         try {
          
            // Create a 35x35 Canvas block.
            var canvasNode = document.createElement("canvas");
            canvasNode.width = "35";
            canvasNode.height = "35"
            
            // We must put this node into the body, otherwise
            // Safari Windows does not report correctly.
            canvasNode.style.display = "none";
            document.body.appendChild(canvasNode);
            var ctx = canvasNode.getContext("2d");
            
            // draw a black letter "O", 32px Arial.
            ctx.textBaseline = "top";
            ctx.font = "32px Arial";
            ctx.fillStyle = "black";
            ctx.strokeStyle = "black";
            
            ctx.fillText("O", 0, 0);
            
            // start at (8,1) and search the canvas from left to right,
            // top to bottom to see if we can find a non-black pixel. If
            // so we return true.
            for (var j = 8; j <= 32; j++) {
               for (var i = 1; i <= 32; i++) {
               
                  var imageData = ctx.getImageData(i, j, 1, 1).data;
                  var alpha = imageData[3];
                  
                  if (alpha != 255 && alpha != 0) {
                     return true; // font-smoothing must be on.
                  }
               }
               
            }
         
            // didn't find any non-black pixels - return false.
            return false;
         }
         catch (ex) {
            // Something went wrong (for example, Opera cannot use the
            // canvas fillText() method. Return null (unknown).
            return null;
         }
      }
   }
   
   me.insertClasses = function(){
      var result = me.hasSmoothing();
      var htmlNode = document.getElementsByTagName("html")[0];
      if (result == true) {
         htmlNode.className += " hasFontSmoothing-true";
      } else if (result == false) {
            htmlNode.className += " hasFontSmoothing-false";
      } else { // result == null
            htmlNode.className += " hasFontSmoothing-unknown";
      }
   }
   
}

EventHelpers.addPageLoadEvent("TypeHelpers.insertClasses");



/*
* Slightly modified FOUT prevent script
* Original script by Paul Irish
* http://paulirish.com/2009/fighting-the-font-face-fout/
*/

(function(){
  // if Firefox 3.5 od 3.6, Internet Explorer 9 or Opera 10.5, hide content till load (or 3 seconds) to prevent FOUT
  var d = document, e = d.documentElement, s = d.createElement('style');
  if ( (navigator.userAgent.match('rv:1\.9\.1')) || (navigator.userAgent.match('rv:1\.9\.2')) || (navigator.userAgent.match('MSIE 9')) || (e.style.OTransform === '') ){
    s.textContent = 'body{visibility:hidden}';
    var r = document.getElementsByTagName('script')[0];
    r.parentNode.insertBefore(s, r);
    function f(){ s.parentNode && s.parentNode.removeChild(s); }
    addEventListener('load',f,false);
    setTimeout(f,3000);
  }
})();