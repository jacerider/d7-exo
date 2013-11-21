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
    jQuery.exoFrame = {
      enable: function() {
        return jQuery('#exo-content').exoFrame();
      }
    };
    return jQuery.widget('EXO.exoFrame', {
      parentOps: null,
      $instance: null,
      $contentWrapper: null,
      $finish: null,
      content: null,
      options: {
        id: null,
        label: null,
        plugins: {},
        pluginsHallo: {}
      },
      _create: function() {
        this.$instance = jQuery('#exo-instance');
        this.$contentWrapper = jQuery('#exo-content-wrapper');
        this.$finish = jQuery('#exo-finish');
        this.$sidebar = jQuery('#exo-sidebar');
        this.$finish.click(this.disable.bind(this));
        return this._loadCss();
      },
      _init: function() {
        var ckconfig, options, target,
          _this = this;
        this.parentOps = parent.jQuery.exo;
        options = {
          $exo: this.element
        };
        this.options = jQuery.extend(options, this.parentOps.options);
        this.$parent = this.parentOps.selectors.$element;
        this.$instance.removeAttr('class');
        if (this.options.sidebar) {
          this.$instance.addClass('exo-has-sidebar');
        }
        this.$sidebar.exoSidebar(this.options);
        this.content = this.parentOps.content;
        jQuery.event.trigger({
          type: "exoEnable",
          exo: this,
          time: new Date()
        });
        ckconfig = {
          extraPlugins: 'divarea,widget,exo_asset,exo_link',
          height: 'auto'
        };
        CKEDITOR.config.toolbar = [["Format"], ["Bold", "Italic"], ["NumberedList", "BulletedList", "-", "Outdent", "Indent", "-", "Blockquote"], ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"], ["ExoLink", "Source"]];
        CKEDITOR.config.extraAllowedContent = 'div(*)[*]; img(*)[*]; a(*)[*]; i(*)';
        target = this.element.get(0);
        this.ckeditor = CKEDITOR.appendTo(target, ckconfig);
        this.ckeditor.setData(this.content);
        this.ckeditor.on('loaded', function() {
          if (Modernizr.draganddrop) {
            return _this.element.exoDragon({
              ckeditor: _this.ckeditor
            });
          }
        });
        return this.element.focus();
      },
      ckeditorUpdate: function() {
        this.ckeditor.mode = 'source';
        return this.ckeditor.setMode('wysiwyg');
      },
      destroy: function() {
        this.ckeditor.destroy();
        this.$sidebar.exoSidebar('destroy');
        if (Modernizr.draganddrop) {
          return this.element.exoDragon('destroy');
        }
      },
      disable: function(event) {
        event.preventDefault();
        this.content = jQuery('<div>' + this.ckeditor.getData() + '</div>');
        jQuery.event.trigger({
          type: "exoDisable",
          exo: this,
          time: new Date()
        });
        parent.jQuery.exo.content = this._cleanSource();
        this.element.blur();
        this.$parent.exo('disable');
        return setTimeout(this.destroy.bind(this), 1000);
      },
      _cleanSource: function() {
        jQuery('[contentEditable]', this.content).each(function() {
          var inside;
          inside = jQuery(this).html();
          return jQuery(this).replaceWith(inside);
        });
        return this.content.html().replace(/(\r\n|\n|\r)/gm, "");
      },
      _loadCss: function() {
        var i, path, script, _ref, _results;
        if (parent.Drupal && parent.Drupal.settings && parent.Drupal.settings.exoInstance && parent.Drupal.settings.exoInstance.css) {
          _ref = parent.Drupal.settings.exoInstance.css;
          _results = [];
          for (i in _ref) {
            script = _ref[i];
            Drupal.settings.ajaxPageState.css[script] = 1;
            path = '<link media="screen" href="' + parent.Drupal.settings.basePath + script + '" rel="stylesheet" type="text/css">';
            _results.push(jQuery('head').append(path));
          }
          return _results;
        }
      }
    });
  })(jQuery);

}).call(this);

(function() {


}).call(this);

(function() {


}).call(this);

(function() {


}).call(this);

(function() {
  (function(jQuery) {
    this.Drupal.behaviors.exoDragon = {
      attach: function(context, settings) {
        var wrapper;
        wrapper = jQuery('#exo-content');
        if (Modernizr.draganddrop && wrapper.data("EXO-exoDragon")) {
          return wrapper.exoDragon('bindDraggables', context);
        }
      }
    };
    return jQuery.widget("EXO.exoDragon", {
      $dropzones: null,
      ckeditor: null,
      content: null,
      _create: function() {
        return this.ckeditor = this.options.ckeditor;
      },
      bindDraggables: function(context) {
        var _this = this;
        this.$draggables = jQuery('.exo-draggable', context);
        if (!this.$draggables.length) {
          return false;
        }
        this.$draggables.attr("draggable", "true");
        this.$draggables.attr("contentEditable", "false");
        this.$draggables.off("dragstart").on("dragstart", function(event) {
          var dt, e;
          e = event.originalEvent;
          dt = e.dataTransfer;
          _this.content = event.target.outerHTML;
          jQuery.event.trigger({
            type: "exoDragonInsert",
            dragon: _this,
            time: new Date()
          });
          dt.dropEffect = 'copy';
          try {
            dt.setData("text/html", _this.content);
          } catch (_error) {
            e = _error;
            dt.setData("Text", _this.content);
          }
          return true;
        });
        return this.$draggables.off('dragend').on('dragend', function(event) {
          return true;
        });
      }
    });
  })(jQuery);

}).call(this);

(function() {
  (function(jQuery) {
    Drupal.ajax.prototype.commands.exoPane = function(ajax, response, status) {
      var $wrapper, options;
      $wrapper = jQuery('#exo-body');
      options = {
        ajax: ajax,
        response: response,
        status: status
      };
      jQuery($wrapper)['exoPane'](options);
      if (!!$wrapper.length) {
        return $wrapper.exoPane;
      }
    };
    Drupal.ajax.prototype.commands.exoPaneHide = function(ajax, response, status) {
      var $wrapper;
      $wrapper = jQuery('#exo-body');
      if (!!jQuery('#exo-pane').length) {
        return $wrapper.exoPane('destroy');
      }
    };
    return jQuery.widget("EXO.exoPane", {
      paneWrapper: null,
      pane: null,
      options: {
        ajax: null,
        response: null,
        status: null
      },
      _create: function() {
        this.element.addClass('exo-pane-active');
        this.paneWrapper = jQuery('#exo-pane-wrapper');
        this.paneWrapper.click(this._clickWrapper.bind(this));
        return this.pane = jQuery('#exo-pane');
      },
      _init: function() {
        var _this = this;
        this.pane.html(this.options.response.data);
        jQuery('.exo-pane-close', this.pane).click(this._clickClose.bind(this));
        return setTimeout(function() {
          var settings;
          _this.element.addClass('exo-pane-open');
          settings = _this.options.response.settings || _this.options.ajax.settings || Drupal.settings;
          return Drupal.attachBehaviors(_this.pane, settings);
        }, 10);
      },
      destroy: function() {
        var _this = this;
        this.element.removeClass('exo-pane-open');
        return setTimeout(function() {
          _this.element.removeClass('exo-pane-active');
          _this.pane.html('');
          return jQuery.Widget.prototype.destroy.call(_this);
        }, 300);
      },
      _clickWrapper: function(event) {
        if (jQuery(event.target).attr('id') === 'exo-pane-wrapper') {
          return this.destroy();
        }
      },
      _clickClose: function(event) {
        event.preventDefault();
        return this.destroy();
      }
    });
  })(jQuery);

}).call(this);

(function() {
  (function(jQuery) {
    jQuery.widget('EXO.exoSidebar', {
      $exo: null,
      $active: null,
      _create: function() {
        var options, plugin, _ref, _results;
        this.$exo = this.options.$exo;
        this.$sidebarWrapper = jQuery('#exo-sidebar-wrapper');
        _ref = this.options.plugins;
        _results = [];
        for (plugin in _ref) {
          options = _ref[plugin];
          if (!jQuery.isPlainObject(options)) {
            options = {};
          }
          jQuery.extend(options, {
            $exo: this.$exo
          });
          _results.push(jQuery(this.element)[plugin](options));
        }
        return _results;
      },
      _init: function() {
        var instance, plugin, populate, _results;
        _results = [];
        for (plugin in this.options.plugins) {
          instance = this.getPluginInstance(plugin);
          if (!instance) {
            continue;
          }
          populate = instance.populateSidebar;
          if (!jQuery.isFunction(populate)) {
            continue;
          }
          _results.push(this.element[plugin]('populateSidebar', this));
        }
        return _results;
      },
      destroy: function() {
        var plugin;
        for (plugin in this.options.plugins) {
          jQuery(this.element)[plugin]('destroy');
        }
        this.element.html('');
        this.$sidebarWrapper.removeClass('active');
        return jQuery.Widget.prototype.destroy.call(this);
      },
      getPluginInstance: function(plugin) {
        var instance;
        instance = jQuery(this.element).data("EXO-" + plugin);
        if (instance) {
          return instance;
        }
        instance = jQuery(this.element).data(plugin);
        if (instance) {
          return instance;
        }
        throw new Error("Plugin " + plugin + " not found");
      },
      setActive: function(id) {
        this.$active = id;
        return this.element.parent().addClass('active');
      },
      setInactive: function() {
        this.$active = false;
        return this.element.parent().removeClass('active');
      },
      getActive: function() {
        if (this.$active) {
          return this.$active;
        } else {
          return false;
        }
      }
    });
    return jQuery.widget('EXO.exoSidebarButton', {
      $exo: null,
      $sidebar: null,
      $content: null,
      loaded: false,
      options: {
        id: this.uuid,
        label: null,
        icon: null,
        plugin: null
      },
      _create: function() {
        this.$exo = this.options.$exo;
        this.$sidebar = this.options.$sidebar;
        this.id = "exo-widget-" + this.widgetName + "-" + this.options.id;
        this._createButton(this.options.label, this.options.icon);
        if (jQuery.isFunction(this.options.plugin.populateSidebarContent)) {
          return this._createContent();
        }
      },
      _createButton: function(label, icon) {
        var classes;
        classes = ['exo-button', this.id];
        this.$button = jQuery("<button id=\"" + this.id + "\"        class=\"" + (classes.join(' ')) + "\" title=\"" + label + "\">          <span class=\"ui-button-text\">            <i class=\"fa fa-" + icon + "\"></i> <span class=\"label\">" + label + "<span>          </span>        </button>");
        return this.$button.appendTo(this.element).click(this._click.bind(this));
      },
      _click: function(event) {
        var active;
        event.preventDefault();
        if (!jQuery.isFunction(this.options.plugin.populateSidebarContent)) {
          return;
        }
        active = this.$sidebar.exoSidebar('getActive');
        if (this.id === active) {
          jQuery("#" + this.id, this.$sidebar).removeClass('active');
          jQuery("#" + this.id + "-content", this.$sidebar).removeClass('active');
          this.$content.parent().removeClass('active');
          return this.$sidebar.exoSidebar('setInactive');
        } else {
          if (!!active) {
            jQuery("#" + active, this.$sidebar).removeClass('active');
          }
          if (!!active) {
            jQuery("#" + active + "-content", this.$sidebar).parent().removeClass('active');
          }
          jQuery("#" + this.id, this.$sidebar).addClass('active');
          this.$content.parent().addClass('active');
          this.$sidebar.exoSidebar('setActive', this.id);
          return this._setContent();
        }
      },
      _createContent: function() {
        var classes;
        classes = ['exo-button-content'];
        this.$content = jQuery("<div id=\"" + this.id + "-content\" class=\"" + (classes.join(' ')) + "\"></div>");
        return this.$content.appendTo(this.element).wrap('<div class="exo-button-content-wrapper" />');
      },
      _setContent: function() {
        var instance, plugin, populate;
        if (this.loaded) {
          return;
        }
        this._showLoader();
        plugin = this.options.plugin.widgetName;
        instance = this.$sidebar.exoSidebar('getPluginInstance', plugin);
        if (!instance) {
          return;
        }
        populate = instance.populateSidebarContent;
        if (!jQuery.isFunction(populate)) {
          return;
        }
        this.$sidebar[plugin]('populateSidebarContent', this.$content, this.options);
        return this.loaded = true;
      },
      _showLoader: function() {
        return this.$content.html('<div class="exo-button-content-loader"><i class="fa fa-cog fa-spin fa-large"></i></div>');
      }
    });
  })(jQuery);

}).call(this);
