( function() {

  CKEDITOR.plugins.add( 'exoAsset', {
    requires: "widget",
    init: function( editor ) {
      editor.filter.allow( 'div[data-*,typeof,about](*); img[!src,alt]; iframe[!src,width,height,frameborder]; ul(*); li; style;', 'exoAsset' );
      return editor.widgets.add("exoAsset", {
        upcast: function(element) {
          return element.name === "div" && element.hasClass("entity-asset");
        },
        edit: function(event) {

          $wrapper = jQuery(event.sender.wrapper.$);
          $element = jQuery('.entity-asset', $wrapper).first();
          aid = $element.attr('data-aid');
          iid = $element.attr('data-iid');

          Drupal.ajax['asset_browser'] = new Drupal.ajax(null, jQuery('body'), {
            url: Drupal.settings.basePath + 'exo/asset/' + aid + '/' + iid,
            event: 'onload',
            keypress: false,
            prevent: false
          });

          return Drupal.ajax['asset_browser'].run();
        }
      });

    }
  });

} )();
