=========================
Webfont Load Enhancer 1.2
=========================

A little script mashup by Michael van Laar, using existing JavaScript solutions
for a better Webfont loading and display experience

Original scripts credits: 
- Zoltan Hawryluk (EventHelpers.js and TypeHelpers.js), http://www.useragentman.com
- Paul Irish (FOUT prevent script), http://www.paulirish.com

For comments, suggestions etc. see http://www.michael-van-laar.de


-----------------------
(Minimal) configuration
-----------------------

The script performs the fontsmooting test on all plattforms. However, only Windows
machines are the problematic ones. The following mini configuration only affects
Windows. On a usual Mac or iOS plattform you will always receive the "font smooting
is on" result - as far as I tested this.

Case 1: Use webfonts for any kind of fontsmooting under Windows
---------------------------------------------------------------
By default the script will come to the result that font smooting is active if a
browser uses either traditional greyscale fontsmooting or modern subpixel rendering.
For big font sizes this should be perfectly OK. No configuration needed.

Case 2: Use webfonts only for Windows browsers if ClearType is active
---------------------------------------------------------------------
If you use webfonts for the website's copy text, you may want to display webfonts
only if a Windows user has ClearType (Windows' subpixel rendering technology) turned
on. To find out if a chosen webfont looks OK or crappy in copy text size, you have
to test this. By the way, testing a lot (and even a lot more) is always a good idea
when using webfonts.
But back on topic. To have the script grade Window's greyscale fontsmooting (as I
said, MacOS and iOS are not affected by this) as not good enough for webfonts, just
open webfontloadenhancer.js and/or webfontloadenhancer.min.js in your text editor and
do a quick search and replace operation. Replace "32px Arial" with "12px Arial".
That's all. Save the file(s) and have fun.

(For those who are interested: This changes the size of the test letter which is used
to detect if the this letter is displayed in plain back and white or if it includes
pixels of other colors. Now the trick is, that Windows with activated greyscale
fontsmooting will display 12px Arial the same way as if no fontsmooting was used.
MacOS and iOS in contrast to this perform fontsmooting for 32px Arial as well as for
12px Arial. Even if iOS "only" uses greyscale fontsmooting. But since this looks OK,
that's not a problem.)

Credits and thanks to Lars G. Sehested for coming up with this great configuration idea:
http://www.useragentman.com/blog/2009/11/29/how-to-detect-font-smoothing-using-javascript/#comment-2311


----------------------
Installation and usage
----------------------

Just use a script element to include webfontloadenhancer-1.2.js (not minified) or
webfontloadenhancer-1.2.min.js (minified) in the head of your HTML page, just above
your CSS call.

It will prevent the FOUT (Flash of unstyled text) in Firefox 3.5 and 3.6, Internet
Explorer 9 and Opera 10.5+ right away. The complete page is hidden until webfonts are
completely loaded, but for a maximum of three seconds. This should be enough in most
cases.

To use webfonts only in browsers with sufficient fontsmooting support you can use
simple CSS. The script adds one of the three classes to the html element of the DOM:

".hasFontSmoothing-true"    indicates activated fontsmooting.
".hasFontSmoothing-false"   indicates no resp. not sufficient fontsmooting.
".hasFontSmoothing-unknown" is the result for Opera browsers since unfortunately the
                            fontsmooting test doesn't work here.

With these classes you can do things like this:

p {font-family: Arial, Helvetica, sans-serif;}
.hasFontSmoothing-true p {font-family: "Your cool webfont", Arial, Helvetica, sans-serif;}


-----------
Pro and con
-----------

Pro
---

- Works with any kind of webfont inclusion (direct @font-face, JavaScript or whatever)

- Almost no configuration needed

- You don't have to rely on JavaScript for webfont loading if you don't want to.
  (In this case just serve Webfonts as the standard case in your stylesheet and use 
  the ".hasFontSmoothing-false" class to display system fonts for those who are not
  "smoth enough". But remember: For Visitors with the combination of deactivated font
  smooting and deactivated JavaScript your website will probably look horrible.)

- Only 1.3 KB when delivering the minified version wigh gzip. That's much smaller
  than the Google WebFont Loader (in case you use Google's WebFont Loader only to
  fight FOUT).

- No additional DNS lookup
  (like when using Google WebFont Loader, especially in combination with self hosted
  webfonts)

Con
---

- Doesn't prevent the webfont files to be loaded by browsers which will then not
  display these webfonts because of deactivated fontsmooting. At least it does not do
  so in the "out of the box" version.
  (With a few lines of JavaScript you can load either a separate CSS file [with only
  the @font-face rules in it] or a fire up any kind of JavaScript based font loading
  routine only in case of a positive fontsmooting detection. The downside (depends on
  your attitude towards this) of this can be that webfont loading is then completely
  JavaScript based.)
  
- Doesn't solve the FOUT for Opera versions below 10.5.
