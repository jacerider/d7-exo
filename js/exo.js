(function ($, Drupal) {

Drupal.behaviors.exo = {
  attach: function(context, settings) {
    var i, options, self, _results;
    if (!settings.exo) {
      return;
    }
    self = this;
    _results = [];
    for (i in settings.exo) {
      options = settings.exo[i];
      _results.push($('#' + options.selector).once().exo(options));
    }
    return _results;
  }
};

/**
 * eXo Globals
 */
$.exo = {};
$.exo.created = 0;
$.exo.initialized = 0;
$.exo.$exo; // div#exo
$.exo.$wrapper; // body.exo-wrapper
$.exo.$main; // iframe#exo-main
$.exo.$loader; // div#exo-loading
$.exo.$frame; // frame div#exo-content

/**
 * eXo Widget
 */
var exo = {};
exo.content = '';
exo.transEndEventNames = {
  WebkitTransition : 'webkitTransitionEnd',
  MozTransition    : 'transitionend',
  OTransition      : 'oTransitionEnd',
  msTransition     : 'msTransitionEnd',
  transition       : 'transitionend'
}
exo.options = {
  id: null,
  label: null
};

/**
 * Run once no matter how many instances of eXo.
 */
exo._create = function() {
  if (!$.exo.created) {
    var _this = this;
    $.exo.created = 1;
    $('html').addClass('exo-exists');
    return setTimeout(function() {
      $.exo.$wrapper = $('body').addClass('exo-wrapper');
      return $('html').addClass('exo-created');
    }, 50);
  }
};

/**
 * Run once for each eXo instance.
 */
exo._init = function() {
  var $placeholder;
  this.hideTextarea();
  $placeholder = $('<a class="exo-placeholder" href="#" />');
  this.element.after($placeholder);
  return $placeholder.html('<span><i class="fa fa-edit"></i> Edit <strong>' + this.options.label + '</strong></span>').click(this.enableClick.bind(this));
};

/**
 * Enable eXo instance and display.
 */
exo.enable = function() {
  $.exo.$wrapper.addClass('exo-top');
  if (!$.exo.initialized) {
    return this.initialize();
  }
  else{
    $.exo.options = this.options;
    this.content = this.element.val();
    return $.exo.$main[0].contentWindow.jQuery.exoFrame.enable(this);
  }
};

/**
 * Animate into editor.
 */
exo.swap = function() {
  // Remove Loader
  $.exo.$loader.remove();
  $.exo.$wrapper.addClass('exo-active');
}

/**
 * Disable eXo instance and remove.
 */
exo.disable = function() {
  var transEndEventName;
  transEndEventName = this.transEndEventNames[Modernizr.prefixed('transition')];
  this.element.val(this.content);
  $.exo.$wrapper.removeClass('exo-active');
  $.exo.$exo.on(transEndEventName, this.disableFinish.bind(this));
}

/**
 * Animate in has finished.
 */
exo.disableFinish = function(event) {
  var transEndEventName;
  transEndEventName = this.transEndEventNames[Modernizr.prefixed('transition')];
  $.exo.$exo.off(transEndEventName);
  $.exo.$wrapper.removeClass('exo-top');
};

/**
 * Initialize is called only the first time an eXo editor is requested.
 */
exo.initialize = function() {
  $.exo.initialized = 1;
  $.exo.$loader = $('<div id="exo-loading"><span class="fa-stack fa-2x"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-cog fa-spin fa-stack-1x fa-inverse"></i></span></div>');
  $.exo.$loader.appendTo($.exo.$wrapper);
  $.exo.$exo = $('<div id="exo" class="exo-page" />');
  $.exo.$exo.data('originalClassList', $.exo.$exo.attr('class')).appendTo($.exo.$wrapper);
  $.exo.$main = $('<iframe id="exo-main" src="/exo/frame"></iframe>');
  $.exo.$main.appendTo($.exo.$exo).wrap('<div id="exo-main-wrapper" />');
  return this.watch();
};

/**
 * Watch for eXo frame to load.
 */
exo.watch = function() {
  var _this = this;
  this.$frame = $.exo.$main.contents().find('#exo-content');
  if (this.$frame.length) {
    clearTimeout(this.watchTimer);
    delete this.watchTimer;
    return this.enable();
  } else {
    return this.watchTimer = setTimeout(function() {
      return _this.watch();
    }, 100);
  }
};

/**
 * Click event for placeholder.
 */
exo.enableClick = function(event) {
  event.preventDefault();
  return this.enable();
};

/**
 * Hide an eXo textarea.
 */
exo.hideTextarea = function() {
  return this.element.hide();
};

return $.widget('EXO.exo', exo);

})(jQuery, Drupal);
