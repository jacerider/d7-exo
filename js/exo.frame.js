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
        var options, settings;
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
        this.element.html(this.content);
        this.element.hallo({
          editable: true,
          plugins: this.options.pluginsHallo,
          parentElement: this.$contentWrapper,
          toolbarCssClass: 'exo-toolbar',
          toolbar: "halloToolbarFixed"
        });
        if (Modernizr.draganddrop) {
          this.element.exoDragon();
        }
        settings = Drupal.settings;
        Drupal.attachBehaviors(this.element, settings);
        return this.element.focus();
      },
      destroy: function() {
        this.element.hallo('destroy');
        this.$sidebar.exoSidebar('destroy');
        if (Modernizr.draganddrop) {
          return this.element.exoDragon('destroy');
        }
      },
      disable: function(event) {
        event.preventDefault();
        this.content = this.element;
        jQuery.event.trigger({
          type: "exoDisable",
          exo: this,
          time: new Date()
        });
        parent.jQuery.exo.content = this.content.html().replace(/(\r\n|\n|\r)/gm, "");
        this.element.blur();
        this.$parent.exo('disable');
        return setTimeout(this.destroy.bind(this), 1000);
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
  (function(jQuery) {
    return jQuery.widget("IKS.exoindent", {
      options: {
        editable: null,
        toolbar: null,
        uuid: '',
        document: document,
        buttonCssClass: null
      },
      populateToolbar: function(toolbar) {
        var buttonize, buttonset,
          _this = this;
        buttonset = jQuery("<div class=\"" + this.widgetName + "\"></div>");
        buttonize = function(cmd, label) {
          var buttonElement;
          buttonElement = jQuery('<span></span>');
          buttonElement.hallobutton({
            uuid: _this.options.uuid,
            document: _this.options.document,
            editable: _this.options.editable,
            label: label,
            command: cmd,
            icon: cmd === 'outdent' ? 'fa-dedent' : 'icon-indent',
            queryState: false,
            cssClass: _this.options.buttonCssClass
          });
          return buttonset.append(jQuery("button", buttonElement));
        };
        buttonize("indent", "Indent");
        buttonize("outdent", "Outdent");
        buttonset.hallobuttonset();
        return toolbar.append(buttonset);
      }
    });
  })(jQuery);

}).call(this);

(function() {
  (function(jQuery) {
    this.Drupal.behaviors.exoLink = {
      attach: function(context, settings) {
        return jQuery('#exo-link-form', context).once(function() {
          var $content;
          $content = jQuery('#exo-content');
          return $content.exolink('linkForm', jQuery(this));
        });
      }
    };
    return jQuery.widget("IKS.exolink", {
      processed: false,
      options: {
        editable: null,
        toolbar: null,
        uuid: '',
        document: document,
        buttonCssClass: null,
        defaultUrl: 'http://'
      },
      linkForm: function($form) {
        var selection, selectionParent;
        this.form = $form;
        this.submit = jQuery('.exo-link-save', this.form);
        this.web = jQuery('#exo-link-web', this.form);
        this.title = jQuery('#exo-link-title', this.form);
        selection = this.lastSelection.toString();
        if (selection) {
          this.title.val(selection);
          this.web.focus();
        } else {
          this.title.focus();
        }
        selectionParent = this.lastSelection.startContainer.parentNode;
        if (!selectionParent.href) {
          this.web.val(this.options.defaultUrl);
          this.submit.text('Insert Link');
        } else {
          this.title.parent().hide();
          this.web.val(jQuery(selectionParent).attr('href'));
          this.submit.text('Update Link');
        }
        return this.submit.on('click', this._linkSave.bind(this));
      },
      _linkSave: function(event) {
        var $wrapper, isEmptyLink, link, linkNode, title,
          _this = this;
        event.preventDefault();
        link = this.web.val();
        title = this.title.val();
        this.options.editable.restoreSelection(this.lastSelection);
        $wrapper = jQuery('#exo-body');
        if (!!jQuery('#exo-pane').length) {
          $wrapper.exoPane('destroy');
        }
        isEmptyLink = function(link) {
          if ((new RegExp(/^\s*$/)).test(link)) {
            return true;
          }
          if (link === _this.options.defaultUrl) {
            return true;
          }
          if (!link) {
            return true;
          }
          return false;
        };
        if (isEmptyLink(link)) {
          document.execCommand("unlink", false, false);
        } else {
          if (this.lastSelection.startContainer.parentNode.href === void 0) {
            if (this.lastSelection.collapsed) {
              linkNode = jQuery("<a href='" + link + "'>" + title + "</a>")[0];
              this.lastSelection.insertNode(linkNode);
            } else {
              document.execCommand("createLink", null, link);
            }
          } else {
            this.lastSelection.startContainer.parentNode.href = link;
          }
        }
        this.options.editable.element.trigger('change');
        this.options.editable.keepActivated(false);
        return false;
      },
      populateToolbar: function(toolbar) {
        var buttonize, buttonset,
          _this = this;
        buttonset = jQuery("<span class=\"" + this.widgetName + "\"></span>");
        buttonize = function(type) {
          var button, buttonHolder, id;
          id = "" + _this.options.uuid + "-" + type;
          buttonHolder = jQuery('<span></span>');
          buttonHolder.hallobutton({
            label: 'Link',
            icon: 'icon-link',
            editable: _this.options.editable,
            command: null,
            queryState: false,
            uuid: _this.options.uuid,
            cssClass: _this.options.buttonCssClass
          });
          buttonset.append(buttonHolder);
          button = buttonHolder;
          button.on("click", _this._click.bind(_this));
          return _this.element.on("keyup paste change mouseup", function(event) {
            var nodeName, start;
            start = jQuery(_this.options.editable.getSelection().startContainer);
            if (start.prop('nodeName')) {
              nodeName = start.prop('nodeName');
            } else {
              nodeName = start.parent().prop('nodeName');
            }
            if (nodeName && nodeName.toUpperCase() === "A") {
              jQuery('button', button).addClass('ui-state-active');
              return;
            }
            return jQuery('button', button).removeClass('ui-state-active');
          });
        };
        buttonize("A");
        toolbar.append(buttonset);
        return buttonset.hallobuttonset();
      },
      _click: function(event) {
        var base, element_settings, nodeName, range, sel, start;
        this.lastSelection = this.options.editable.getSelection();
        this.options.editable.keepActivated(true);
        start = jQuery(this.lastSelection.startContainer);
        if (start.prop('nodeName')) {
          nodeName = start.prop('nodeName');
        } else {
          nodeName = start.parent().prop('nodeName');
        }
        if (nodeName && nodeName.toUpperCase() === "A") {
          sel = window.getSelection();
          range = sel.getRangeAt(0);
          range.selectNode(this.lastSelection.startContainer);
        }
        if (!this.processed) {
          this.processed = true;
          base = this.element.attr('id');
          element_settings = {
            url: "/exo/link/ajax",
            event: "onload",
            keypress: false,
            prevent: false,
            wrapper: base
          };
          Drupal.ajax[base] = new Drupal.ajax(base, this.element, element_settings);
        }
        this.element.trigger('onload');
        return false;
      }
    });
  })(jQuery);

}).call(this);

(function() {
  (function(jQuery) {
    return jQuery.widget("IKS.hallobutton", jQuery.IKS.hallobutton, {
      _createButton: function(id, command, label, icon) {
        var classes;
        classes = ['ui-button', 'ui-widget', 'ui-state-default', 'ui-corner-all', 'ui-button-text-only', "" + command + "_button"];
        icon = 'fa ' + icon.replace('icon', 'fa');
        return jQuery("<button id=\"" + id + "\"        class=\"" + (classes.join(' ')) + "\" title=\"" + label + "\">          <span class=\"ui-button-text\">            <i class=\"" + icon + "\"></i>          </span>        </button>");
      }
    });
  })(jQuery);

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
      content: null,
      _create: function() {
        this.$dropzones = jQuery('#exo-content');
        this.bindDropzones();
        return this.bindDraggables(this.$dropzones);
      },
      bindDropzones: function() {
        var _this = this;
        this.$dropzones.attr("dropzone", "copy");
        this.$dropzones.off("dragenter").on("dragenter", function(event) {
          return event.preventDefault();
        });
        return this.$dropzones.off("drop").on("drop", function(event) {
          var $DDM, e, insertSuccess, range, sel, settings;
          if (!_this.content) {
            return false;
          }
          e = event.originalEvent;
          range = null;
          if (document.caretRangeFromPoint) {
            range = document.caretRangeFromPoint(e.clientX, e.clientY);
          } else if (e.rangeParent) {
            range = document.createRange();
            range.setStart(e.rangeParent, e.rangeOffset);
          }
          sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          _this.element.get(0).focus();
          document.execCommand("insertHTML", false, "<param name=\"dragonDropMarker\" /><br>" + _this.content + "<br>");
          sel.removeAllRanges();
          $DDM = jQuery("param[name=\"dragonDropMarker\"]");
          insertSuccess = $DDM.length > 0;
          if (insertSuccess) {
            _this.$draggables.filter("[dragged]", _this.$dropzones).not('.exo-draggable-copy').remove();
            $DDM.remove();
          }
          _this.content = null;
          settings = Drupal.settings;
          Drupal.attachBehaviors(_this.element, settings);
          e.preventDefault();
          event.stopPropagation();
          return false;
        });
      },
      bindDraggables: function(context) {
        var _this = this;
        this.$draggables = jQuery('.exo-draggable', context);
        if (!this.$draggables.length) {
          return false;
        }
        this.$draggables.attr("draggable", "true");
        this.$draggables.attr("contentEditable", "false");
        this.$noDrags = jQuery('.exo-nodrag', context);
        this.$noDrags.attr("draggable", "false");
        return this.$draggables.off("dragstart").on("dragstart", function(event) {
          var dt, e;
          if (event.target instanceof HTMLElement) {
            e = event.originalEvent;
            dt = e.dataTransfer;
            jQuery(e.target).removeAttr("dragged");
            _this.content = event.target.outerHTML;
            dt.effectAllowed = 'copy';
            jQuery.event.trigger({
              type: "exoDragonInsert",
              dragon: _this,
              time: new Date()
            });
            dt.setData('text/html', _this.content);
            return jQuery(e.target).attr("dragged", "dragged");
          } else {
            return event.preventDefault();
          }
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
