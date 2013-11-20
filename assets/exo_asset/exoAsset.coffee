#     eXo - a rich text editor of awesomeness
#     (c) 2013 Cyle Carlson, Ashen Rayne
#     eXo may be freely distributed under the MIT license

((jQuery) ->



  ################################################################
  # Drupal AJAX command setting the current asset.
  ################################################################
  Drupal.ajax::commands.exoAssetSet = (ajax, response, status) ->
    $wrapper = jQuery('#exo-body')
    asset = jQuery(ajax.element).closest('.exo-asset')
    $wrapper.exoPane 'assetSet', asset


  ################################################################
  # Drupal AJAX command for updating the current asset.
  ################################################################
  Drupal.ajax::commands.exoAssetUpdate = (ajax, response, status) ->
    $wrapper = jQuery('#exo-body')
    $wrapper.exoPane 'assetUpdate', response.aid, response.iid


  ################################################################
  # Extend the exoPane.
  ################################################################
  jQuery.widget "EXO.exoPane", jQuery.EXO.exoPane,
    asset: null

    assetSet: ($asset) ->
      @asset = $asset

    assetUpdate: (aid, iid) ->
      # Swap old asset with new one
      content = Drupal.settings.exoAssets[aid + '-' + iid]
      @asset.replaceWith content

      settings = Drupal.settings;
      Drupal.attachBehaviors(@asset, settings);


  ################################################################
  # Drupal behaviors.
  ################################################################
  @Drupal.behaviors.exoAsset =

    attach: (context, settings) ->

      # Attach remove handlers
      jQuery('.exo-asset-remove').once('exo').click (event) ->
        event.preventDefault()
        $asset = jQuery(this).closest('.exo-asset')
        $asset.remove()


  ################################################################
  # Define exoAssets widget.
  ################################################################
  jQuery.widget "EXO.exoAssets",
    $exo: null

    _create: ->
      @$exo = @options.$exo

      @element.on "exoEnable", @_tokenToAsset
      @element.on "exoDisable", @_assetToToken
      @element.on "exoDragonInsert", @_assetSwap

      # Retrieve loaded assets from parent.
      if parent.Drupal.settings and parent.Drupal.settings.exoAssets
        Drupal.settings.exoAssets = parent.Drupal.settings.exoAssets


    ##############################################################
    # Swap draggable select into asset markup.
    ##############################################################
    _assetSwap: (event) ->
      $content = jQuery event.dragon.content
      if $content.hasClass 'asset-select'
        aid = $content.attr 'data-aid'
        iid = $content.attr 'data-iid'
        base = aid + '-' + iid
        if Drupal.settings and Drupal.settings.exoAssets and Drupal.settings.exoAssets[base]
          asset = Drupal.settings.exoAssets[base]
          event.dragon.content = asset


    ##############################################################
    # Convert tokens to asset markup.
    ##############################################################
    _tokenToAsset: (event) ->
      content = event.exo.content

      exoAssetsMatch = ( text ) ->
        regex = new RegExp("(\\[asset-[0-9]+(-[0-9]+)?\\])", "g")
        match = undefined
        text = text.replace(regex, (match, text) ->
          regex = new RegExp("\\[asset-([0-9]+)-?([0-9]+)?\\]", ["i"])
          parts = match.match(regex)
          aid = parts[1]
          iid = (if parts[2] then parts[2] else 0)
          base = aid + "-" + iid
          if Drupal.settings and Drupal.settings.exoAssets and Drupal.settings.exoAssets[base]
            asset = Drupal.settings.exoAssets[base]
            text.replace regex, asset
        )
        text

      event.exo.content = exoAssetsMatch content


    ##############################################################
    # Replace asset markup with tokens.
    ##############################################################
    _assetToToken: (event) ->
      $content = event.exo.content.clone()

      jQuery('.exo-asset', $content).each ->
        $asset = jQuery(this)
        aid = $asset.attr 'data-aid'
        iid = $asset.attr 'data-iid'
        $asset.replaceWith '[asset-' + aid + '-' + iid + ']'

      event.exo.content = $content


    populateSidebar: () ->

      for asset, options of @options.assets

        $set = jQuery "<div id=\"#{@widgetName}-#{asset}\" class=\"exo-button-wrapper\"></div>"

        jQuery.extend options,
          $exo: @$exo
          $sidebar: @element
          plugin: @
          id: asset
          asset: asset

        $set.exoSidebarButton options
        $set.appendTo @element
        # $set.exoSidebarButtonContent options


    populateSidebarContent: ( $content, options ) ->

      # Load asset browser
      # Setup AJAX request
      base = $content.attr('id')
      element_settings =
        url: "/exo/assets/" + options.asset + "/all/ajax"
        event: "onload"
        keypress: false
        prevent: false
        wrapper: base
        progress:
          type: "none"

      Drupal.ajax[base] = new Drupal.ajax(base, $content, element_settings)

      # Trigger AJAX request
      $content.trigger('onload')

)(jQuery)
