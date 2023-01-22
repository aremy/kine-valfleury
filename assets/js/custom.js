"use strict";

window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  document.querySelector(".fixed-top").classList.toggle("top-nav-collapse", (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50));
}

var trackInnerLink = function (url) {
  ga('send', 'event', 'navigation', 'clicked', 'appointment', {
    'transport': 'beacon',
    'hitCallback': function () { document.location = url; }
  });
}
