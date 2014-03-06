/*
* eXo - text editor of awesomeness for Drupal
* by JaceRider and contributors. Available under the MIT license.
* See http://ashenrayne.com for more information
*
* Hallo 1.0.4 - rich text editor for jQuery UI
* by Henri Bergius and contributors. Available under the MIT license.
* See http://hallojs.org for more information
*/
(function() {
  (function(jQuery) {
    this.Drupal.behaviors.exo = {
      attach: function(context, settings) {
        var i, options, self, _results;
        if (!settings.exo) {
          return;
        }
        self = this;
        _results = [];
        for (i in settings.exo) {
          options = settings.exo[i];
          _results.push(jQuery('#' + options.id).once().exo(options));
        }
        return _results;
      }
    };
    jQuery.exo = {
      created: false,
      initialized: false,
      selectors: {},
      content: null
    };
    return jQuery.widget('EXO.exo', {
      animateIn: 'pt-page-moveFromLeft pt-page-delay200',
      animateOut: 'pt-page-rotateLeftSideFirst',
      animEndEventNames: {
        WebkitAnimation: "webkitAnimationEnd",
        OAnimation: "oAnimationEnd",
        msAnimation: "MSAnimationEnd",
        animation: "animationend"
      },
      options: {
        id: null,
        label: null,
        plugins: {},
        pluginsHallo: {}
      },
      _create: function() {
        var _this = this;
        if (!jQuery.exo.created) {
          jQuery.exo.created = true;
          jQuery('html').addClass('exo-exists');
          if (Drupal.behaviors.quickbar) {
            delete Drupal.behaviors.quickbar;
          }
          return setTimeout(function() {
            jQuery('head').append("<link href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,300italic,700' rel='stylesheet' type='text/css'>");
            jQuery('body').wrapInner('<div id="exo-page" class="exo-page" />').wrapInner('<div id="exo-wrapper" />');
            _this.$exoPage = jQuery.exo.selectors.$exoPage = jQuery('#exo-page');
            _this.$exoPage.data('originalClassList', _this.$exoPage.attr('class')).addClass('exo-page-current');
            return jQuery('html').addClass('exo-created');
          }, 10);
        }
      },
      _init: function() {
        var $placeholder;
        this.hideTextarea();
        $placeholder = jQuery('<a class="exo-placeholder" href="#" />');
        this.element.after($placeholder);
        return $placeholder.html('<span><i class="fa fa-edit"></i> Edit <strong>' + this.options.label + '</strong></span>').click(this.enableClick.bind(this));
      },
      enableClick: function(event) {
        event.preventDefault();
        return this.enable();
      },
      enable: function() {
        var i, r, selector, _ref;
        if (/msie|trident/i.test(navigator.userAgent)) {
          r = confirm('Your browser (Internet Explorer) is not support at this time. Please use Firefox, Chrome or Opera when administering content on this site. Would you like to download one of these browsers now?');
          if (r === true) {
            alert('You will now be redirected to a Better Browser...');
            window.location("http://abetterbrowser.org/");
          }
          return;
        }
        if (!jQuery.exo.initialized) {
          jQuery.exo.initialized = true;
          return this.initialize();
        } else {
          _ref = jQuery.exo.selectors;
          for (i in _ref) {
            selector = _ref[i];
            this[i] = selector;
          }
          jQuery.exo.selectors.$element = this.element;
          jQuery.exo.options = this.options;
          this.activePage(this.$exo, this.animateIn, this.animateOut);
          jQuery.exo.content = this.element.val();
          return this.$main[0].contentWindow.jQuery.exoFrame.enable();
        }
      },
      initialize: function() {
        var $wrapper;
        $wrapper = jQuery('#exo-wrapper');
        this.$loader = jQuery('<div id="exo-loading"><span class="fa-stack fa-2x"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-cog fa-spin fa-stack-1x fa-inverse"></i></span></div>');
        this.$loader.appendTo($wrapper);
        this.$exo = jQuery.exo.selectors.$exo = jQuery('<div id="exo" class="exo-page" />');
        this.$exo.data('originalClassList', this.$exo.attr('class')).appendTo($wrapper);
        this.$main = jQuery.exo.selectors.$main = jQuery('<iframe id="exo-main" src="/exo/frame"></iframe>');
        this.$main.appendTo(this.$exo).wrap('<div id="exo-main-wrapper" />');
        return this.watch();
      },
      watch: function() {
        var _this = this;
        this.$frame = jQuery.exo.selectors.$frame = this.$main.contents().find('#exo-content');
        if (this.$frame.length) {
          clearTimeout(this.watchTimer);
          delete this.watchTimer;
          this.$loader.remove();
          return this.enable();
        } else {
          return this.watchTimer = setTimeout(function() {
            return _this.watch();
          }, 100);
        }
      },
      disable: function() {
        this.element.val(jQuery.exo.content);
        return this.activePage(this.$exoPage, this.animateIn, this.animateOut);
      },
      activePage: function($selector, animateIn, animateOut) {
        var animEndEventName;
        if (!$selector.hasClass('exo-page')) {
          return false;
        }
        animEndEventName = this.animEndEventNames[Modernizr.prefixed('animation')];
        this.$exo.on(animEndEventName, this.activePageFinish.bind(this));
        $selector.addClass('exo-page-current exo-page-ontop exo-focus ' + animateIn);
        return jQuery('.exo-page:not(.exo-focus)').addClass(animateOut);
      },
      activePageFinish: function(event) {
        var $in, $out, animEndEventName;
        animEndEventName = this.animEndEventNames[Modernizr.prefixed('animation')];
        this.$exo.off(animEndEventName);
        $out = jQuery('.exo-page:not(.exo-focus)');
        $out.attr('class', $out.data('originalClassList'));
        $in = jQuery('.exo-focus');
        return $in.attr('class', $in.data('originalClassList') + ' exo-page-current');
      },
      hideTextarea: function() {
        return this.element.hide();
      }
    });
  })(jQuery);

}).call(this);
