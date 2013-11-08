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
    Drupal.ajax.prototype.commands.exoAssetSet = function(ajax, response, status) {
      var $wrapper, asset;
      $wrapper = jQuery('#exo-body');
      asset = jQuery(ajax.element).closest('.asset-select');
      return $wrapper.exoPane('assetSet', asset);
    };
    Drupal.ajax.prototype.commands.exoAssetUpdate = function(ajax, response, status) {
      var $wrapper;
      $wrapper = jQuery('#exo-body');
      return $wrapper.exoPane('assetUpdate', response.aid, response.iid);
    };
    jQuery.widget("EXO.exoPane", jQuery.EXO.exoPane, {
      asset: null,
      assetSet: function($asset) {
        return this.asset = $asset;
      },
      assetUpdate: function(aid, iid) {
        var content, settings;
        content = Drupal.settings.exoAssets[aid + '-' + iid];
        this.asset.replaceWith(content);
        settings = Drupal.settings;
        return Drupal.attachBehaviors(this.asset, settings);
      }
    });
    this.Drupal.behaviors.exoAsset = {
      attach: function(context, settings) {
        return jQuery('.exo-asset-remove').once('exo').click(function(event) {
          var $asset;
          event.preventDefault();
          $asset = jQuery(this).closest('.exo-asset');
          return $asset.remove();
        });
      }
    };
    return jQuery.widget("EXO.exoAssets", {
      $exo: null,
      _create: function() {
        this.$exo = this.options.$exo;
        this.element.on("exoEnable", this._tokenToAsset);
        this.element.on("exoDisable", this._assetToToken);
        this.element.on("exoDragonInsert", this._assetSwap);
        if (parent.Drupal.settings && parent.Drupal.settings.exoAssets) {
          return Drupal.settings.exoAssets = parent.Drupal.settings.exoAssets;
        }
      },
      _assetSwap: function(event) {
        var $content, aid, asset, base, iid;
        $content = jQuery(event.dragon.content);
        if ($content.hasClass('asset-select')) {
          aid = $content.attr('data-aid');
          iid = $content.attr('data-iid');
          base = aid + '-' + iid;
          if (Drupal.settings && Drupal.settings.exoAssets && Drupal.settings.exoAssets[base]) {
            asset = Drupal.settings.exoAssets[base];
            return event.dragon.content = asset;
          }
        }
      },
      _tokenToAsset: function(event) {
        var content, exoAssetsMatch;
        content = event.exo.content;
        exoAssetsMatch = function(text) {
          var match, regex;
          regex = new RegExp("(\\[asset-[0-9]+(-[0-9]+)?\\])", "g");
          match = void 0;
          text = text.replace(regex, function(match, text) {
            var aid, asset, base, iid, parts;
            regex = new RegExp("\\[asset-([0-9]+)-?([0-9]+)?\\]", ["i"]);
            parts = match.match(regex);
            aid = parts[1];
            iid = (parts[2] ? parts[2] : 0);
            base = aid + "-" + iid;
            if (Drupal.settings && Drupal.settings.exoAssets && Drupal.settings.exoAssets[base]) {
              asset = Drupal.settings.exoAssets[base];
              return text.replace(regex, asset);
            }
          });
          return text;
        };
        return event.exo.content = exoAssetsMatch(content);
      },
      _assetToToken: function(event) {
        var $content;
        $content = event.exo.content.clone();
        jQuery('.asset-select', $content).each(function() {
          var $asset, aid, iid;
          $asset = jQuery(this);
          aid = $asset.attr('data-aid');
          iid = $asset.attr('data-iid');
          return $asset.replaceWith('[asset-' + aid + '-' + iid + ']');
        });
        return event.exo.content = $content;
      },
      populateSidebar: function() {
        var $set, asset, options, _ref, _results;
        _ref = this.options.assets;
        _results = [];
        for (asset in _ref) {
          options = _ref[asset];
          $set = jQuery("<div id=\"" + this.widgetName + "-" + asset + "\" class=\"exo-button-wrapper\"></div>");
          jQuery.extend(options, {
            $exo: this.$exo,
            $sidebar: this.element,
            plugin: this,
            id: asset,
            asset: asset
          });
          $set.exoSidebarButton(options);
          _results.push($set.appendTo(this.element));
        }
        return _results;
      },
      populateSidebarContent: function($content, options) {
        var base, element_settings;
        base = $content.attr('id');
        element_settings = {
          url: "/exo/assets/" + options.asset + "/all/ajax",
          event: "onload",
          keypress: false,
          prevent: false,
          wrapper: base,
          progress: {
            type: "none"
          }
        };
        Drupal.ajax[base] = new Drupal.ajax(base, $content, element_settings);
        return $content.trigger('onload');
      }
    });
  })(jQuery);

}).call(this);
