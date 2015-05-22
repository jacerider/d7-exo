( function() {

  this.Drupal.behaviors.exoLink = {
    attach: function(context, settings) {
      return jQuery('#exo-link-form', context).once(function() {
        var editor = jQuery('#exo-content').exoFrame('ckeditorGet');
        return CKEDITOR.tools.callFunction(editor._.exoLinkFormSetup, jQuery(this), editor);
      });
    }
  };

  CKEDITOR.plugins.add( 'exoLink', {
    requires: "link",
    init: function( editor ) {
      var version = parseInt(CKEDITOR.version);
      editor.addCommand("exoLink", {
        exec: function(editor) {
          if(!Drupal.ajax['exo_link']){
            Drupal.ajax['exo_link'] = new Drupal.ajax(null, jQuery('body'), {
              url: Drupal.settings.basePath + 'exo/link',
              event: 'onload',
              keypress: false,
              prevent: false
            });
          }
          return Drupal.ajax['exo_link'].run();
        }
      });
      editor.ui.addButton('ExoLink', {
        label: 'Link',
        command: 'exoLink',
        toolbar: 'insert',
        icon: this.path + "/icons/exolink.png"
      });
      if (version >= 4) {
        editor.setKeystroke(CKEDITOR.CTRL + 76, "exo_link");
      }
      editor.on("doubleclick", function(evt) {
        var element;
        delete evt.data.dialog;
        element = CKEDITOR.plugins.link.getSelectedLink(editor) || evt.data.element;
        if (!element.isReadOnly()) {
          if (element.is("a")) {
            editor.getSelection().selectElement(element);
            if (version >= 4) {
              return editor.commands.exoLink.exec();
            } else {
              if (version === 3) {
                return editor._.commands.exoLink.exec();
              }
            }
          }
        }
      });
      return editor._.exoLinkFormSetup = CKEDITOR.tools.addFunction(formSetup, editor);
    }
  });

  formSetup = function(form, editor) {
    var $selected, defaultUrl, selectedElement, selection, submit, title, web;
    submit = jQuery('.exo-link-save', form).removeClass('form-submit');
    title = jQuery('#exo-link-title', form);
    web = jQuery('#exo-link-web', form);
    newWindow = jQuery('#exo-link-new', form);
    defaultUrl = 'http://';
    selection = editor.getSelection();
    selectedElement = CKEDITOR.plugins.link.getSelectedLink(editor);
    if (selectedElement && selectedElement.hasAttribute('href')) {
      selection.selectElement(selectedElement);
    } else {
      selectedElement = null;
    }
    if (CKEDITOR.env.ie && typeof selection !== 'undefined') {
      selection.lock();
    }
    if (selectedElement) {
      $selected = jQuery(selectedElement.$);
      title.val($selected.text());
      if($selected.attr('target') == '_blank'){
        newWindow.prop('checked', true);
      }
      web.focus();
      web.val($selected.attr('href'));
      submit.val('Update Link');
    } else {
      title.val(CKEDITOR.tools.trim(selection.getSelectedText()));
      web.val(defaultUrl);
      title.focus();
      submit.val('Insert Link');
    }
    return submit.on('click', function(event) {
      var $wrapper, content, data, element, name, path, range, style, text;
      event.preventDefault();
      selection = editor.getSelection();
      path = web.val();
      title = title.val();
      data = {
        path: CKEDITOR.tools.trim(path),
        title: CKEDITOR.tools.trim(title),
        attributes: []
      };
      data.attributes["data-cke-saved-href"] = data.path;
      data.attributes.target = null;
      if (newWindow.is(":checked")){
        data.attributes.target = '_blank';
      }
      if (!selectedElement) {
        range = selection.getRanges(1)[0];
        if (range.collapsed) {
          content = (data.title ? data.title : data.path);
          text = new CKEDITOR.dom.text(content, editor.document);
          range.insertNode(text);
          range.selectNodeContents(text);
        }
        data.attributes.href = data.path;
        for (name in data.attributes) {
          if (data.attributes[name]) {
            null;
          } else {
            delete data.attributes[name];
          }
        }
        style = new CKEDITOR.style({
          element: "a",
          attributes: data.attributes
        });
        style.type = CKEDITOR.STYLE_INLINE;
        style.applyToRange(range);
        range.select();
      } else {
        element = selectedElement;
        element.setAttribute("href", data.path);
        element.setAttribute("data-cke-saved-href", data.path);
        element.setText((data.title ? data.title : data.path));
        for (name in data.attributes) {
          if (data.attributes[name]) {
            element.setAttribute(name, data.attributes[name]);
          } else {
            element.removeAttribute(name);
          }
        }
        selection.selectElement(element);
      }
      if (CKEDITOR.env.ie && typeof selection !== "undefined") {
        selection.unlock();
      }
      jQuery('#exo-content').exoFrame('paneHide');
      return false;
    });
  };

} )();
