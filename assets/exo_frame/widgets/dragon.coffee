#     eXo - a rich text editor of awesomeness
#     (c) 2013 Cyle Carlson, Ashen Rayne
#     eXo may be freely distributed under the MIT license

((jQuery) ->

  @Drupal.behaviors.exoDragon =

    attach: (context, settings) ->
      wrapper = jQuery('#exo-content')
      if Modernizr.draganddrop and wrapper.data("EXO-exoDragon")
        wrapper.exoDragon 'bindDraggables', context



  jQuery.widget "EXO.exoDragon",
    $dropzones: null
    ckeditor: null
    content: null


    _create: ->
      @ckeditor = @options.ckeditor
      @$sidebar = @options.sidebar


    bindDraggables: (context) ->
      @$draggables = jQuery('.exo-draggable', context)
      return false unless @$draggables.length

      @$draggables.attr "draggable", "true"
      @$draggables.attr "contentEditable", "false"
      # @$noDrags = jQuery('.exo-nodrag', context)
      # @$noDrags.attr "draggable", "false"

      @$draggables.off("dragstart").on "dragstart", (event) =>

        # Make sure we focus on the editor so drop even fires correctly
        @ckeditor.focus()

        e = event.originalEvent
        dt = e.dataTransfer

        @content = event.target.outerHTML
        @$sidebar.trigger
          type: "exoDragonInsert"
          dragon: @
          time: new Date()

        dt.dropEffect = 'copy'

        try
          dt.setData "text/html", @content
        catch e
          dt.setData "Text", @content

        return true

      @$draggables.off('dragend').on 'dragend', (event) =>
        return true



)(jQuery)
