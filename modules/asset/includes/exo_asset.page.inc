<?php

function exo_asset_browser($type){
  $asset_type = asset_type_load($type);

  $output = array();

  $output['browser'] = asset_type_browser($asset_type, 'asset', TRUE);
  unset($output['browser']['#attached']['js']);

  $output['create']['#markup'] = l('<i class="fa fa-'.$asset_type->data['icon'].'"></i> Create New <strong>' . $asset_type->name . '</strong>', 'exo/asset/' . $asset_type->type, array('html' => TRUE, 'attributes' => array('class' => array('exo-asset-create', 'use-ajax', 'button', 'expand', 'small'))));

  $commands = array();
  $commands[] = ajax_command_exo_pane(drupal_render($output));

  ajax_deliver(array('#type' => 'ajax', '#commands' => $commands));
}

/**
 * Asset creation and editing.
 */
function exo_asset_edit($asset, $instance = 0){
  if(!is_a($asset, 'Asset')){
    $asset = asset_create(array('type' => $asset));
  }
  $title = 'Create';
  if($asset->id){
    $title = 'Edit';
  }
  $asset_type = asset_type_load($asset->type);
  drupal_set_title(t($title).' ' . $asset_type->name);
  $output = array();

  $output['form'] = drupal_get_form('exo_asset_asset_form', $asset);

  // return $output;

  $commands = array();
  $commands[] = ajax_command_exo_pane(drupal_render($output));
  ajax_deliver(array('#type' => 'ajax', '#commands' => $commands));
}

function exo_asset_asset_form($form, &$form_state, $asset){
  form_load_include($form_state, 'inc', 'asset', 'includes/asset.admin');
  $form += asset_edit_form($form, $form_state, $asset);

  $form['actions']['cancel']['#markup'] = l('Cancel', 'exo/assets/image', array('html' => TRUE, 'attributes' => array('class' => array('exo-asset-cancel', 'button', 'tiny', 'text', 'use-ajax'))));

  $asset_type = $form_state['asset_type'];
  if($asset->id && empty($asset_type->data['require_instance'])){
    unset($form['instance_form']);
  }
  $form['actions']['submit']['#ajax'] = array(
    'callback' => 'exo_asset_asset_form_ajax_submit',
  );
  return $form;
}

function exo_asset_asset_form_ajax_submit($form, &$form_state){
  if (form_get_errors()){
    $commands = array();
    $commands[] = ajax_command_exo_pane(drupal_render($form));
    return array(
      '#type' => 'ajax',
      '#commands' => $commands,
    );
  }

  $asset = $form_state['asset'];

  // Clear the asset cache so assets get loaded with updated information.
  entity_get_controller('asset')->resetCache();
  $asset = asset_load_js($asset->id, NULL, 'asset', TRUE);
  $output = asset_render($asset, 'asset', TRUE);

  $commands = array();
  $commands[] = ajax_command_exo_html(drupal_render($output));
  return array(
    '#type' => 'ajax',
    '#commands' => $commands,
  );
}

/**
 * Instance creation and editing.
 */
function exo_asset_instance(Asset $asset, $instance){
  // Make sure this asset type has public instance settings.
  $asset_type = asset_type_load($asset->type);
  if(empty($asset_type->public)){
    return exo_asset_edit($asset);
  }

  if(!is_a($instance, 'AssetInstance')){
    $instance = asset_instance_create($asset);
  }

  // When instance matches default instance of an asset, we want to open it up
  // for the creation of a new instance.
  if($instance->id == $asset->instance_id){
    $instance->id = NULL;
    $instance->is_new = TRUE;
  }

  $output = array();
  $output['form'] = drupal_get_form('exo_asset_instance_form', $asset, $instance);

  $commands = array();
  $commands[] = ajax_command_exo_pane(drupal_render($output));
  ajax_deliver(array('#type' => 'ajax', '#commands' => $commands));
}

function exo_asset_instance_form($form, &$form_state, $asset, $instance){
  form_load_include($form_state, 'inc', 'asset', 'includes/assetInstance.admin');
  $form += asset_instance_edit_form($form, $form_state, $asset, $instance);
  $form['actions']['submit']['#ajax'] = array(
    'callback' => 'exo_asset_instance_form_ajax_submit',
  );

  $form['#attributes']['class'][] = 'form-wrapper';

  $options = array();
  $options['attributes']['class'] = array('button','text','tiny');
  $options['attributes']['class'][] = 'use-ajax';
  $title = t('Edit');
  fett_icon_link($title, $options);
  $form['actions']['edit']['#markup'] = l($title . ' Asset', 'exo/asset/' . $asset->id, $options);
  return $form;
}

function exo_asset_instance_form_submit($form, &$form_state){
}

function exo_asset_instance_form_ajax_submit($form, &$form_state){
  $asset = $form_state['asset'];
  $instance = $form_state['asset_instance'];

  // Clear the asset cache so assets get loaded with updated information.
  entity_get_controller('asset')->resetCache();
  $asset = asset_load_js($asset->id, $instance->id, 'asset', TRUE);
  $output = asset_render($asset, 'asset', TRUE);

  $commands = array();
  $commands[] = ajax_command_exo_html(drupal_render($output));
  return array(
    '#type' => 'ajax',
    '#commands' => $commands,
  );
}
