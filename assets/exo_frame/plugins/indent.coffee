# #     Hallo - a rich text editing jQuery UI widget
# #     (c) 2011 Henri Bergius, IKS Consortium
# #     Hallo may be freely distributed under the MIT license
# ((jQuery) ->
#   jQuery.widget "IKS.exoindent",
#     options:
#       editable: null
#       toolbar: null
#       uuid: ''
#       document: document
#       buttonCssClass: null

#     populateToolbar: (toolbar) ->
#       buttonset = jQuery "<div class=\"#{@widgetName}\"></div>"
#       buttonize = (cmd, label) =>
#         buttonElement = jQuery '<span></span>'
#         buttonElement.hallobutton
#           uuid: @options.uuid
#           document: @options.document
#           editable: @options.editable
#           label: label
#           command: cmd
#           icon: if cmd is 'outdent' then 'fa-dedent' else 'icon-indent'
#           queryState: false
#           cssClass: @options.buttonCssClass
#         buttonset.append jQuery "button", buttonElement
#       buttonize "indent", "Indent"
#       buttonize "outdent", "Outdent"

#       buttonset.hallobuttonset()
#       toolbar.append buttonset
# )(jQuery)
