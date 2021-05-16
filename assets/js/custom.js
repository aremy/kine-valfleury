(function($) {
    // Add smooth scrolling to all links in navbar
    $(".navbar a, .quick-info li a, .banner a").on('click', function(event) {
        var hash = this.hash;
        if (hash) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 900, function() {
                window.location.hash = hash;
            });
        }
    });

    //jQuery to collapse the navbar on scroll
    $(window).on( "scroll", function() {
        if ($(".navbar").offset().top > 50) {
            $(".fixed-top").addClass("top-nav-collapse");
        } else {
            $(".fixed-top").removeClass("top-nav-collapse");
        }
    });

})(jQuery);



var trackInnerLink = function(url) {
   ga('send', 'event', 'navigation', 'clicked', 'appointment', {
     'transport': 'beacon',
     'hitCallback': function(){document.location = url;}
   });
}