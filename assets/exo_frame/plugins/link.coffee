# #     Hallo - a rich text editing jQuery UI widget
# #     (c) 2011 Henri Bergius, IKS Consortium
# #     Hallo may be freely distributed under the MIT license
# ((jQuery) ->

#   @Drupal.behaviors.exoLink =

#     attach: (context, settings) ->

#       jQuery('#exo-link-form', context).once ->
#         $content = jQuery '#exo-content'
#         $content.exolink 'linkForm', jQuery(this)




#   jQuery.widget "IKS.exolink",
#     processed: false
#     options:
#       editable: null
#       toolbar: null
#       uuid: ''
#       document: document
#       buttonCssClass: null
#       defaultUrl: 'http://'

#     linkForm: ($form) ->

#       @form = $form
#       @submit = jQuery('.exo-link-save',  @form)
#       @web = jQuery('#exo-link-web', @form)
#       @title = jQuery('#exo-link-title', @form)

#       selection = @lastSelection.toString()
#       if selection
#         @title.val(selection)
#         @web.focus()
#       else
#         @title.focus()

#       selectionParent = @lastSelection.startContainer.parentNode
#       unless selectionParent.href
#         @web.val(@options.defaultUrl)
#         @submit.text 'Insert Link'
#       else
#         @title.parent().hide()
#         @web.val(jQuery(selectionParent).attr('href'))
#         @submit.text 'Update Link'

#       @submit.on 'click', @_linkSave.bind(this)


#     _linkSave: (event) ->
#       event.preventDefault()

#       link = @web.val()
#       title = @title.val()
#       @options.editable.restoreSelection(@lastSelection)

#       $wrapper = jQuery('#exo-body')
#       $wrapper.exoPane 'destroy' unless !jQuery('#exo-pane').length

#       isEmptyLink = (link) =>
#         return true if (new RegExp(/^\s*$/)).test link
#         return true if link is @options.defaultUrl
#         return true if !link
#         false

#       if isEmptyLink link
#         # link is empty, remove it. Make sure the link is selected
#         document.execCommand "unlink", false, false

#       else
#         # link does not have ://, add http:// as default protocol
#         # if !(/:\/\//.test link) && !(/^mailto:/.test link)
#         #   link = 'http://' + link
#         if @lastSelection.startContainer.parentNode.href is undefined
#           # we need a new link
#           # following check will work around ie and ff bugs when using
#           # "createLink" on an empty selection
#           if @lastSelection.collapsed
#             linkNode = jQuery("<a href='#{link}'>#{title}</a>")[0]
#             @lastSelection.insertNode linkNode
#           else
#             document.execCommand "createLink", null, link
#         else
#           @lastSelection.startContainer.parentNode.href = link

#       @options.editable.element.trigger('change')
#       @options.editable.keepActivated false
#       return false


#     populateToolbar: (toolbar) ->

#       buttonset = jQuery "<span class=\"#{@widgetName}\"></span>"
#       buttonize = (type) =>
#         id = "#{@options.uuid}-#{type}"
#         buttonHolder = jQuery '<span></span>'
#         buttonHolder.hallobutton
#           label: 'Link'
#           icon: 'icon-link'
#           editable: @options.editable
#           command: null
#           queryState: false
#           uuid: @options.uuid
#           cssClass: @options.buttonCssClass
#         buttonset.append buttonHolder
#         button = buttonHolder

#         button.on "click", @_click.bind(this)

#         @element.on "keyup paste change mouseup", (event) =>
#           start = jQuery(@options.editable.getSelection().startContainer)
#           if start.prop('nodeName')
#             nodeName = start.prop('nodeName')
#           else
#             nodeName = start.parent().prop('nodeName')
#           if nodeName and nodeName.toUpperCase() is "A"
#             jQuery('button', button).addClass 'ui-state-active'
#             return
#           jQuery('button', button).removeClass 'ui-state-active'

#       buttonize "A"
#       toolbar.append buttonset
#       buttonset.hallobuttonset()

#     _click: (event) ->

#       @lastSelection = @options.editable.getSelection()
#       @options.editable.keepActivated true

#       start = jQuery(@lastSelection.startContainer)
#       if start.prop('nodeName')
#         nodeName = start.prop('nodeName')
#       else
#         nodeName = start.parent().prop('nodeName')

#       if nodeName and nodeName.toUpperCase() is "A"
#         sel = window.getSelection()
#         range = sel.getRangeAt(0)
#         range.selectNode @lastSelection.startContainer

#       # Load asset browser
#       # Setup AJAX request
#       if !@processed
#         @processed = true
#         base = @element.attr('id');
#         element_settings =
#           url: "/exo/link/ajax"
#           event: "onload"
#           keypress: false
#           prevent: false
#           wrapper: base
#           # progress:
#           #   type: "none"

#         Drupal.ajax[base] = new Drupal.ajax(base, @element, element_settings);

#       # Trigger AJAX request
#       @element.trigger('onload');

#       return false


# )(jQuery)
