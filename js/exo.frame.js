(function ($, Drupal) {

/**
 * Add an extra function to the Drupal ajax object
 * which allows us to trigger an ajax response without
 * an element that triggers it.
 */
Drupal.ajax.prototype.run = function() {
  var ajax = this;
  // Do not perform another ajax command if one is already in progress.
  if (ajax.ajaxing) {
    return false;
  }
  try {
    ajax.beforeSerialize(ajax.element, ajax.options);
    $.ajax(ajax.options);
  }
  catch (err) {
    alert('An error occurred while attempting to process ' + ajax.options.url);
    return false;
  }
  return false;
};

/**
 * Clone the success method so it is not overrided by configurable callbacks.
 */
Drupal.ajax.prototype.successful = Drupal.ajax.prototype.success;

/**
 * Command to insert new content into eXo.
 */
Drupal.ajax.prototype.commands.exoHtml = function (ajax, response, status) {
  var settings = response.settings || ajax.settings || Drupal.settings;
  $('#exo-content').exoFrame('paneHide').exoFrame('insertHtml', response.data);
};

/**
 * Command to insert new content into eXo.
 */
Drupal.ajax.prototype.commands.exoPane = function (ajax, response, status) {
  var settings = response.settings || ajax.settings || Drupal.settings;
  $('#exo-content').exoFrame('paneShow').exoFrame('paneHtml', response.data, settings);
};

/**
 * eXo Frame Globals
 */
$.exoFrame = {};
$.exoFrame.resourcesAfter = [];
$.exoFrame.sidebarBefore = [];
$.exoFrame.ckeditorBefore = [];
$.exoFrame.ckeditorAfter = [];
$.exoFrame.updateBefore = [];
$.exoFrame.enable = function(exo) {
  return $('#exo-content').exoFrame({exo:exo});
};

/**
 * eXo Frame Widget
 */
var exoFrame = {};
exoFrame.transEndEventNames = {
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd',
  msTransition: 'MSTransitionEnd',
  transition: 'transitionend'
};
exoFrame.options = {
  id: null,
  label: null
};
exoFrame.sidebar = [];
exoFrame.urlHistory = [];

/**
 * Run once no matter how many instances of eXo.
 */
exoFrame._create = function() {
  this.$html = $('#exo-html');
  this.$body = $('#exo-body');
  this.$wrapper = $('#exo-wrapper');
  this.$instance = $('#exo-instance');
  this.$pane = $('#exo-pane');
  this.$finish = $('#exo-finish');
  this.$finish.click(this.disable.bind(this));
};

/**
 * Run once for each eXo instance.
 */
exoFrame._init = function() {
  var _this = this;
  this.exo = this.options.exo;
  delete this.options.exo;
  this.options = $.extend(this.options, this.exo.options);
  this.sidebar = [];
  this.content = this.exo.content;

  // Sidebar Setup
  this.sidebarInit();

  // Fetch resources if needed
  this.resourceFetch(this.ckeditorInit.bind(this));
};

/**
 * Fetch field-specific resources.
 */
exoFrame.resourceFetch = function(callback) {
  var _this = this, url;
  // Resource loading
  if(this.options.id){
    url = Drupal.settings.basePath + 'exo/frame/resources/' + this.options.type + '/' + this.options.id + '/' + this.options.field_name + '/' + this.options.delta;
    // Only load resources once.
    if(this.urlHistory.indexOf(url) < 0){
      this.urlHistory.push(url);
      Drupal.ajax['exo_resources'] = new Drupal.ajax(null, this.$body, {
        url: url,
        event: 'onload',
        keypress: false,
        prevent: false,
        success: function(response, status) {
          Drupal.ajax['exo_resources'].successful(response, status);
          // resourcesAfter Hook
          $.exoFrame.resourcesAfter.forEach(function(func) {
            func(_this);
          });
          callback();
        }
      });
      Drupal.ajax['exo_resources'].run();
    }
    else{
      callback();
    }
  }
  else{
    callback();
  }
};

/**
 * Initialize CKEditor.
 */
exoFrame.ckeditorInit = function(){
  var _this = this, target, ckconfig;

  // This property tells CKEditor to not activate every element with contenteditable=true element.
  CKEDITOR.disableAutoInline = true;
  CKEDITOR.config.resize_enabled = false;
  // Plugins
  CKEDITOR.plugins.addExternal('divarea', Drupal.settings.exoFrame.path + '/ckeditor/divarea/');
  CKEDITOR.plugins.addExternal('widget', Drupal.settings.exoFrame.path + '/ckeditor/widget/');
  CKEDITOR.plugins.addExternal('lineutils', Drupal.settings.exoFrame.path + '/ckeditor/lineutils/');
  CKEDITOR.plugins.addExternal('exoLink', Drupal.settings.exoFrame.path + '/ckeditor/exolink/');
  CKEDITOR.config.extraPlugins = 'divarea,exoLink';

  // ckeditorBefore Hook
  $.exoFrame.ckeditorBefore.forEach(function(func) {
    func(_this);
  });

  // CKEDITOR Config
  ckconfig = {
    toolbar: [["Format"], ["Bold", "Italic", "Blockquote", "-", "ExoLink", "Unlink"], ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"], ["Source"]]
  };

  target = this.element.get(0);
  this.ckeditor = CKEDITOR.appendTo(target, ckconfig);
  this.ckeditor.setData(this.content);

  return this.ckeditor.on('loaded', function() {
    // ckeditorAfter Hook
    $.exoFrame.ckeditorAfter.forEach(function(func) {
      func(_this);
    });

    _this.ckeditorResize();
    $(window).resize(function() {
      _this.ckeditorResize();
    });

    // Editor is now setup and loaded. Tell eXo to swap.
    _this.exo.swap();
    _this.ckeditor.focus();
  });
};

/**
 * Resize ckeditor for perfect fit.
 */
exoFrame.ckeditorResize = function(){
  var ckeContents = $('.cke_contents');
  ckeContents.height($('.cke_inner').height() - $('.cke_top').outerHeight() - $('.cke_bottom').outerHeight());
}

/**
 * Get CKEditor instance.
 */
exoFrame.ckeditorGet = function(){
  return this.ckeditor;
}

/**
 * Initialize sidebar.
 */
exoFrame.sidebarInit = function(){
  var _this = this;
  if(this.$sidebar){
    this.$sidebar.remove();
  }
  // sidebarBefore Hook
  $.exoFrame.sidebarBefore.forEach(function(func) {
    func(_this);
  });
  if(this.sidebar.length){
    this.$sidebar = $('<div id="exo-sidebar"></div>');
    this.sidebar.forEach(function(item) {
      item.appendTo(_this.$sidebar);
    });
    this.$sidebar.prependTo(this.$wrapper)
  }
};

/**
 * Insert HTML into CKEditor
 */
exoFrame.insertHtml = function(html) {
  this.ckeditor.insertHtml(html);
  this.ckeditor.focus();
};

/**
 * Close instance.
 */
exoFrame.disable = function(event) {
  event.preventDefault();
  var _this = this, data = {html: this.ckeditor.getData()};

  $.exoFrame.updateBefore.forEach(function(func) {
    func(_this, data);
  });

  this.exo.content = data.html;
  this.exo.disable();
  return setTimeout(this.destroy.bind(this), 1000);
};

/**
 * Destroy instance.
 */
exoFrame.destroy = function() {
  this.ckeditor.destroy();
};

/**
 * Show pane
 */
exoFrame.paneShown = 0;
exoFrame.paneShow = function() {
  if(exoFrame.paneShown === 0){
    exoFrame.paneShown = 1;
    var _this = this, close;

    close = function(event){
      event.preventDefault();
      _this.paneHide();
    };

    this.$html.addClass('animate-pre');
    setTimeout( function() { _this.$html.addClass('animate'); }, 25 );
    this.$wrapper.bind('click', close);
  }
};

/**
 * Insert HTML into pane
 */
exoFrame.paneHtml = function(html, settings) {
  var _this = this, hasContent, onTransEnd, transEndEventName;
  transEndEventName = this.transEndEventNames[Modernizr.prefixed('transition')];
  hasContent = this.$pane.html();
  settings = settings || Drupal.settings;

  onTransEnd = function(event){
    if(!event.originalEvent || (event.originalEvent && event.originalEvent.propertyName === 'transform')){
      _this.$pane.off(transEndEventName);
      if(hasContent){
        Drupal.detachBehaviors(_this.$pane, settings);
      }
      _this.$pane.html(html);

      Drupal.attachBehaviors(_this.$pane, settings);

      $('.exo-pane-close', _this.$pane).click(function(event){
        event.preventDefault();
        _this.paneHide();
      });

      setTimeout( function() { _this.$pane.removeClass('swap'); }, 25);
    }
  };

  this.$pane.on(transEndEventName, onTransEnd);

  if(hasContent){
    this.$pane.addClass('swap');
  }
  else{
    this.$pane.trigger(transEndEventName);
  }

};

/**
 * Hide pane
 */
exoFrame.paneHide = function() {
  if(exoFrame.paneShown === 1){
    exoFrame.paneShown = 0;
    var _this = this, onTransEnd, transEndEventName;
    transEndEventName = this.transEndEventNames[Modernizr.prefixed('transition')];

    onTransEnd = function(event){
      if(!event.originalEvent || (event.originalEvent && event.originalEvent.propertyName === 'transform')){
        _this.$html.off(transEndEventName);
        _this.$html.removeClass('animate-pre');
        // settings = settings || Drupal.settings;
        // Drupal.detachBehaviors(_this.$pane, settings);
        _this.$pane.html('');
      }
    };
    this.$html.on(transEndEventName, onTransEnd);
    this.$html.removeClass('animate');
    this.$wrapper.unbind('click');
  }
};

/**
 * Add item to pane
 */
exoFrame.sidebarAdd = function(title, icon, callback){
  var wrapper, item;
  wrapper = $('<div class="exo-sidebar-item"></div>');
  item = $('<a class="exo-sidebar-item-link" href=""><i class="fa fa-' + icon + '"></i> ' + title + '</a>').click(callback).appendTo(wrapper);
  return this.sidebar.push(wrapper);
};

return $.widget('EXO.exoFrame', exoFrame);

})(jQuery, Drupal);
