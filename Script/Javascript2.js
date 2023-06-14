$(document).ready(function () {
    var input = $('.field').find('input, textarea');
    input.keyup(function () {
        inputTest(this);
    });
});

function inputTest(that) {
    var field = $(that).closest('.field');
    var form = $(that).closest('form, .form');
    var length = $.trim($(that).val()).length;

    //  FILLED
    if (length > 0) field.addClass('filled');
    else field.removeClass('filled');

    //  VALIDATED
    if (length >= 4) {
        field.addClass('validated');
        form.addClass('validated');
    } else {
        field.removeClass('validated');
        form.removeClass('validated');
    }
}

var Identity = {
    duration: 1400,
    delay: 500,
    iteration: 0,
    processing: false,
    enough: false,
    interval: null,
    callback: null,
    classes: 'working rest robot',

    //  WORK
    work: function () {
        if (Identity.status != 'loading') Identity.status = 'working';
        Identity.wait(function () {
            $(Identity.id).addClass('working');
        });
    },


    //  WAIT
    wait: function (call) {
        if (Identity.processing != true) {
            Identity.abort();
            Identity.processing = true;

            setTimeout(function () {
                if (typeof call === 'function' && call) call();
                Identity.waiting();
                Identity.interval = setInterval(Identity.waiting, Identity.duration);
            }, Identity.delay);
        }
    },

    //  STOP
    stop: function (callback) {
        setTimeout(function () {
            if (Identity.processing == true) {
                Identity.enough = true;
                Identity.callback = callback;

                $(Identity.selector).attr('style', 'animation-iteration-count: ' + Identity.iteration + '; -webkit-animation-iteration-count: ' + Identity.iteration + ';');
            }
        }, Identity.delay);
    },

    //  ABORT
    abort: function () {
        if (Identity.status == 'robot') $(Identity.id).removeClass('robot');
        else if (Identity.status != 'loading' && Identity.processing != true) $(Identity.id).removeClass(Identity.classes + ' loading');
        else $(Identity.id).removeClass(Identity.classes);
    },

};
var Router = {
    wrapper: [],
    location: null,

    //	ROUTE
    route: function (location, callback) {
        Identity.work();
        Router.location = Router.processLocation(location);

        //	ROUTES
        Router.routes(callback);
    },

    //	PROCESS LOCATION
    processLocation: function (location) {
        if (location === undefined) location = window.location.hash;

        return location.replace('#', '');
    },

    //	CALLBACK
    callback: function (callback) {
        setTimeout(function () {
            Identity.stop();
            Router.updateWrapper();
            Router.updateTemplate(Router.wrapper[0]);
            window.location.hash = Router.location;
            Router.location = null;

            //  CALLBACKS
            Router.callbacks(Router.wrapper[0]);
            if (typeof callback === 'function' && callback) callback();
        }, 200);
    },

    //	UPDATE TEMPLATE
    updateTemplate: function (template) {
        var templates = $('.template');
        var current = $('.template[data-template=' + template + ']');

        templates.removeClass('current');
        setTimeout(function () {
            templates.hide();
            current.show().addClass('current');
        }, 1120);
    },

    //	UPDATE WRAPPER
    updateWrapper: function (push, pull) {
        if (push) Router.push(push);
        if (pull) Router.pull(pull);

        var wrapper = Router.wrapper.toString().replace(/,/g, ' ');
        $('.wrapper').attr('class', 'wrapper ' + wrapper);
    },

    //	PUSH
    push: function (items) {
        items = items.split(' ');

        for (i = 0; i < items.length; i++) {
            if (!Router.wrapper.includes(items[i]) && items[i] != '') Router.wrapper.push(items[i]);
        }
    }
};
Router.routes = function (callback) {
    Router.wrapper = [];
    var location = Router.location.split('/').filter(Boolean);

    //  HOME
    Router.push('home');

    //  CALLBACK
    Router.callback(callback);
};

function loadProject() {
    Router.route(undefined, function () {

        //  CALLBACK
        Router.listen();
        Submit.listen('.submit');
    });
};

loadProject();