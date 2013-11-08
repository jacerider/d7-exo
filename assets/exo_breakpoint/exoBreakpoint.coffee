#     eXo - a rich text editor of awesomeness
#     (c) 2013 Cyle Carlson, Ashen Rayne
#     eXo may be freely distributed under the MIT license

((jQuery) ->


  ################################################################
  # Define exoAssets widget.
  ################################################################
  jQuery.widget "EXO.exoBreakpoint",
    $exo: null

    _create: ->

      @$exo = @options.$exo


    populateSidebar: () ->

      $set = jQuery "<div id=\"#{@widgetName}\" class=\"exo-button-wrapper\"></div>"

      options =
        $exo: @$exo
        $sidebar: @element
        plugin: @
        id: @widgetName
        label: 'Breakpoints'
        icon: 'mobile'

      $set.exoSidebarButton options
      $set.appendTo @element


    populateSidebarContent: ( $content, options ) ->

      $content.html 'Soon you will be able to use this panel to preview your site via <strong>breakpoints</strong>.'

)(jQuery)
