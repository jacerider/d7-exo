/*

==== Dragon Drop: a demo of precise DnD
          in, around, and between
       multiple contenteditable's.

=================================
== MIT Licensed for all to use ==
=================================
Copyright (C) 2013 Chase Moskal

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
============

*/


function DRAGON_DROP (o) {
  var DD=this;

  // "o" params:
  DD.$draggables=null;
  DD.$dropzones=null;
  DD.$noDrags=null; // optional

  DD.dropLoad=null;
  DD.engage=function(o){
    DD.$draggables = jQuery(o.draggables);
    DD.$dropzones = jQuery(o.dropzones);
    DD.$draggables.attr('draggable','true');
    DD.$noDrags = (o.noDrags) ? jQuery(o.noDrags) : jQuery();
    DD.$dropzones.attr('dropzone','copy');
    DD.bindDraggables();
    DD.bindDropzones();
  };
  DD.bindDraggables=function(){
    DD.$draggables = jQuery(DD.$draggables.selector); // reselecting
    DD.$noDrags = jQuery(DD.$noDrags.selector);
    DD.$noDrags.attr('draggable','false');
        DD.$draggables.off('dragstart').on('dragstart',function(event){
      var e=event.originalEvent;
      jQuery(e.target).removeAttr('dragged');
      var dt=e.dataTransfer,
        content=e.target.outerHTML;
      var is_draggable = DD.$draggables.is(e.target);
      if (is_draggable) {
        dt.effectAllowed = 'copy';
        dt.setData('text/plain',' ');
        DD.dropLoad=content;
        jQuery(e.target).attr('dragged','dragged');
      }
    });
  };
  DD.bindDropzones=function(){
    DD.$dropzones = jQuery(DD.$dropzones.selector); // reselecting
    DD.$dropzones.off('dragleave').on('dragleave',function(event){
      var e=event.originalEvent;

      var dt=e.dataTransfer;
      var relatedTarget_is_dropzone = DD.$dropzones.is(e.relatedTarget);
      var relatedTarget_within_dropzone = DD.$dropzones.has(e.relatedTarget).length>0;
      var acceptable = relatedTarget_is_dropzone||relatedTarget_within_dropzone;
      if (!acceptable) {
        dt.dropEffect='none';
        dt.effectAllowed='null';
      }
    });
    DD.$dropzones.off('drop').on('drop',function(event){
      var e=event.originalEvent;

      if (!DD.dropLoad) return false;
      var range=null;
      if (document.caretRangeFromPoint) { // Chrome
        range=document.caretRangeFromPoint(e.clientX,e.clientY);
      }
      else if (e.rangeParent) { // Firefox
        range=document.createRange(); range.setStart(e.rangeParent,e.rangeOffset);
      }
      var sel = window.getSelection();
      sel.removeAllRanges(); sel.addRange(range);

      jQuery(sel.anchorNode).closest(DD.$dropzones.selector).get(0).focus(); // essential
      document.execCommand('insertHTML',false,'<param name="dragonDropMarker" />'+DD.dropLoad);
      sel.removeAllRanges();

      // verification with dragonDropMarker
      var $DDM=jQuery('param[name="dragonDropMarker"]');
      var insertSuccess = $DDM.length>0;
      if (insertSuccess) {
        // jQuery(DD.$draggables.selector).filter('[dragged]').remove();
        $DDM.remove();
      }

      DD.dropLoad=null;
      DD.bindDraggables();
      e.preventDefault();
    });
  };
  DD.disengage=function(){
    DD.$draggables=jQuery( DD.$draggables.selector ); // reselections
    DD.$dropzones=jQuery( DD.$dropzones.selector );
    DD.$noDrags=jQuery( DD.$noDrags.selector );
    DD.$draggables.removeAttr('draggable').removeAttr('dragged').off('dragstart');
    DD.$noDrags.removeAttr('draggable');
    DD.$dropzones.removeAttr('droppable').off('dragenter');
    DD.$dropzones.off('drop');
  };
  if (o) DD.engage(o);
}

