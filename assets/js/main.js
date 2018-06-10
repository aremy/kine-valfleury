requirejs.config({
    paths: {
        jquery: "jquery.min",
        jqueryeasing: "jquery.easing.min",
        bootstrap: "bootstrap.min",
        custom: "custom"
    },
    shim: {
        jqueryeasing: {
            deps: ['jquery']
        },
        bootstrap: {
            deps: ['jqueryeasing']
        },
        custom: {
            deps: ['jqueryeasing']
        },
    }
});
//Define dependencies and pass a callback when dependencies have been loaded
require(["jquery", "jqueryeasing", "bootstrap", "custom"], function ($) {
    //Bootstrap and jquery are ready to use here
    //Access jquery and bootstrap plugins with $ variable
});

