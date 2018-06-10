(function($) {
    // Add smooth scrolling to all links in navbar
    $(".navbar a,a.btn-appoint, .quick-info li a, .banner a").on('click', function(event) {
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
    $(window).scroll(function() {
        if ($(".navbar").offset().top > 50) {
            $(".fixed-top").addClass("top-nav-collapse");
        } else {
            $(".fixed-top").removeClass("top-nav-collapse");
        }
    });

})(jQuery);

$( '.navbar-nav a' ).on( 'click', function () {
	$( '.navbar-nav' ).find( 'li.active' ).removeClass( 'active' );
	$( this ).parent( 'li' ).addClass( 'active' );
});


var trackInnerLink = function(url) {
   ga('send', 'event', 'navigation', 'clicked', 'appointment', {
     'transport': 'beacon',
     'hitCallback': function(){document.location = url;}
   });
}