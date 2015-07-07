(function ($, Drupal) {

Drupal.behaviors.exo_asset = {
  attach: function (context, settings) {
    // context is not used in this selector as it breaks paging
    $('#exo-pane .asset-select').once().click( this.assetSelect );
  },

  assetSelect: function ( event ) {
    event.preventDefault();
    var $this = $(this), aid, key, settings;
    aid = parseInt($this.attr('data-id'));
    key = aid + '-0';
    settings = Drupal.settings;
    if(settings.asset && settings.asset.render && settings.asset.render[key]){
      $('#exo-content').exoFrame('insertHtml', settings.asset.render[key]).exoFrame('paneHide');
    }
    else{
      alert('Asset could not be rendered.');
    }
  }
};


/**
 * EVENT: Run before frame is initialized.
 */

function ckeditorBefore(exoFrame){
  CKEDITOR.plugins.addExternal('exoAsset', Drupal.settings.exoFrame.path + '/modules/asset/ckeditor/asset/');
  CKEDITOR.config.extraPlugins += ',exoAsset';

  // Convert asset tokens into full assets.
  exoFrame.content = $.asset.toAsset(exoFrame.content);
};

$.exoFrame.ckeditorBefore.push(ckeditorBefore);


/**
 * EVENT: Run before frame is initialized.
 */

function sidebarBefore(exoFrame){
  var assetClick, asset;

  assetClick = function(event) {
    event.preventDefault();

    Drupal.ajax['asset_browser'] = new Drupal.ajax(null, exoFrame.$body, {
      url: Drupal.settings.basePath + 'exo/assets/' + this.type,
      event: 'onload',
      keypress: false,
      prevent: false
    });

    return Drupal.ajax['asset_browser'].run();
  };

  if(exoFrame.options.assets){
    for (key in exoFrame.options.assets) {
      asset = exoFrame.options.assets[key];
      exoFrame.sidebarAdd(asset.plural, asset.data.icon, assetClick.bind(asset));
    }
  }
};

$.exoFrame.sidebarBefore.push(sidebarBefore);


/**
 * EVENT: Run after ckeditor has been initialized.
 */

function ckeditorAfter(exoFrame){
  var editor = exoFrame.ckeditor;
  editor.on( 'mode', function(){
    var data = editor.getData();
    if(editor.mode == 'source'){
      editor.setData($.asset.toToken(data));
    }
    else{
      editor.setData($.asset.toAsset(data));
    }
  });
};

$.exoFrame.ckeditorAfter.push(ckeditorAfter);


/**
 * EVENT: Run before html is sent to textarea.
 */
function updateBefore(exoFrame, data){
  // Convert asset tokens into full assets.
  data.html = $.asset.toToken(data.html);
};

$.exoFrame.updateBefore.push(updateBefore);

})(jQuery, Drupal);
