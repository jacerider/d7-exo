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
    content: null


    _create: ->
      @$dropzones = jQuery '#exo-content'
      @bindDropzones()
      @bindDraggables(@$dropzones)


    bindDropzones: ->
      @$dropzones.attr "dropzone", "copy"

      # @$dropzones.off("dragover").on "dragover", (event) =>
      #   event.preventDefault() if event.preventDefault
      #   e = event.originalEvent
      #   dt = e.dataTransfer
      #   dt.dropEffect = 'copy'
      #   return false

      # to get IE to work
      # @$dropzones.off("dragover").on "dragover", (event) =>
      #   event.preventDefault();

      @$dropzones.off("dragenter").on "dragenter", (event) =>
        event.preventDefault();

      # @$dropzones.off("drop").on "drop", (event) =>
      #   console.log 'drop'
      #   if event.stopPropagation
      #     event.stopPropagation()
      #   e = event.originalEvent
      #   dt = e.dataTransfer

      # @$dropzones.off("dragleave").on "dragleave", (event) =>
      #   console.log 'drag leave this shiz'
      #   e = event.originalEvent
      #   console.log 'event',event
      #   dt = e.dataTransfer
      #   relatedTarget_is_dropzone = @$dropzones.is(e.relatedTarget)
      #   relatedTarget_within_dropzone = @$dropzones.has(e.relatedTarget).length > 0
      #   acceptable = relatedTarget_is_dropzone or relatedTarget_within_dropzone
      #   console.log 'acceptable',acceptable
      #   console.log 'relatedTarget',e.relatedTarget
      #   unless acceptable
      #     dt.dropEffect = "none"
      #     dt.effectAllowed = "null"

      @$dropzones.off("drop").on "drop", (event) =>
        return false  unless @content
        e = event.originalEvent
        range = null
        if document.caretRangeFromPoint # Chrome
          range = document.caretRangeFromPoint(e.clientX, e.clientY)
        else if e.rangeParent # Firefox
          range = document.createRange()
          range.setStart e.rangeParent, e.rangeOffset
        sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange range
        @element.get(0).focus() # essential
        document.execCommand "insertHTML", false, "<param name=\"dragonDropMarker\" /><br>" + @content + "<br>"
        sel.removeAllRanges()

        # verification with dragonDropMarker
        $DDM = jQuery("param[name=\"dragonDropMarker\"]")
        insertSuccess = $DDM.length > 0

        if insertSuccess
          @$draggables.filter("[dragged]", @$dropzones).not('.exo-draggable-copy').remove()
          $DDM.remove()
        @content = null

        # Apply any settings from the returned JSON if available.
        settings = Drupal.settings;
        Drupal.attachBehaviors(@element, settings);

        e.preventDefault()
        event.stopPropagation();
        return false

      # @$dropzones.off("dragover").on "dragover", (event) =>
      #   console.log 'dragover'
      #   if event.preventDefault
      #     event.preventDefault()

        # e = event.originalEvent
        # dt = e.dataTransfer
        # dt.dropEffect = 'move';

      # @$dropzones.off("drop").on "drop", (event) =>

      #   console.log 'drop'

      #   setTimeout =>
      #     # Apply any settings from the returned JSON if available.
      #     settings = Drupal.settings;
      #     Drupal.attachBehaviors(@$dropzones, settings);
      #   , 10


    bindDraggables: (context) ->
      @$draggables = jQuery('.exo-draggable', context)
      return false unless @$draggables.length

      @$draggables.attr "draggable", "true"
      @$draggables.attr "contentEditable", "false"
      @$noDrags = jQuery('.exo-nodrag', context)
      @$noDrags.attr "draggable", "false"

      @$draggables.off("dragstart").on "dragstart", (event) =>

        if event.target instanceof HTMLElement
          e = event.originalEvent
          dt = e.dataTransfer

          jQuery(e.target).removeAttr("dragged")

          @content = event.target.outerHTML
          # dt.effectAllowed = (if jQuery(@content).hasClass('exo-draggable-copy') then "copy" else "move");
          dt.effectAllowed = 'copy'
          jQuery.event.trigger
            type: "exoDragonInsert"
            dragon: @
            time: new Date()

          dt.setData 'text/html', @content;
          jQuery(e.target).attr "dragged", "dragged"

        else
          event.preventDefault();



)(jQuery)
