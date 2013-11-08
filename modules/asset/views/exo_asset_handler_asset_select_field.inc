<?php

/**
 * @file
 * Contains a Views field handler to take care of displaying links to entities
 * as fields.
 */

class exo_asset_handler_asset_select_field extends views_handler_field {
  function construct() {
    parent::construct();

    $this->additional_fields['id'] = 'id';
    $this->additional_fields['type'] = 'type';
  }

  function option_definition() {
    $options = parent::option_definition();

    $options['text'] = array('default' => '', 'translatable' => TRUE);

    return $options;
  }

  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);
  }

  function query() {
    $this->ensure_my_table();
    $this->add_additional_fields();
  }

  function render($values) {
    $bundle = entity_load('asset_type', array($values->asset_type));

    $asset = exo_asset_js_load($values->id);

    $output = 'asdf<div id="asset-select-'.$values->id.'" class="asset-select exo-draggable exo-draggable-copy" data-aid="'.$values->id.'" data-iid="0">Select</div>';
    if(asset_access('edit', $asset)){
      $output .= l('<i class="fa fa-pencil"></i>', 'exo/asset/'.$values->id.'/edit/nojs', array('html'=>true, 'attributes'=>array('class'=>array('asset-edit', 'use-ajax', 'btn','btn-xs','btn-info'))));
    }
    if(asset_access('delete', $asset)){
      $output .= l('<i class="fa fa-trash-o"></i>', 'exo/asset/'.$values->id.'/delete/nojs', array('html'=>true, 'attributes'=>array('class'=>array('asset-delete', 'use-ajax', 'btn','btn-xs','btn-danger'))));
    }
    return $output;
  }
}
