# #     Hallo - a rich text editing jQuery UI widget
# #     (c) 2011 Henri Bergius, IKS Consortium
# #     Hallo may be freely distributed under the MIT license
# ((jQuery) ->

#   jQuery.widget "IKS.hallobutton", jQuery.IKS.hallobutton,


#     ##############################################################
#     # We want to extend hallobutton in order to add compatability with Font
#     # Awesome 3.
#     ##############################################################
#     _createButton: (id, command, label, icon) ->
#       classes = [
#         'ui-button'
#         'ui-widget'
#         'ui-state-default'
#         'ui-corner-all'
#         'ui-button-text-only'
#         "#{command}_button"
#       ]
#       icon = 'fa ' + icon.replace('icon','fa')
#       jQuery "<button id=\"#{id}\"
#         class=\"#{classes.join(' ')}\" title=\"#{label}\">
#           <span class=\"ui-button-text\">
#             <i class=\"#{icon}\"></i>
#           </span>
#         </button>"

# )(jQuery)
