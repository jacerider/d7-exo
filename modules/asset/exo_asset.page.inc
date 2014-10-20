<?php

/**
 * Asset browser.
 *
 * @author JaceRider
 *
 * @param  $type
 *   The bundled asset to load a browser for.
 */
function exo_asset_browser( $asset, $category_tid = NULL, $js = FALSE, $return_commands = FALSE ) {
  if(!is_a($asset, 'Asset')){
    $asset = asset_create(array('type' => $asset));
  }
  $type = $asset->type;
  $asset_type = asset_type_load($type);

  $output = array();
  $output['#prefix'] = '<div class="exo-asset-browser exo-draggable-resources clearfix">';
  $output['#suffix'] = '</div>';

  if(asset_access('edit', $asset)){
    $output['new'] = array(
      '#type' => 'link',
      '#title' => '<i class="fa fa-' . $asset_type->data['icon'] . '"></i> Create new ' . $asset_type->label,
      '#href' => 'exo/asset/add/' . $type . '/nojs',
      '#weight' => -10,
      '#html' => TRUE,
      '#options' => array('html' => TRUE),
      '#attributes' => array('class'=>array('btn', 'btn-primary', 'btn-block', 'exo-asset-new', 'use-ajax'))
    );
  }

  $view = views_get_view('assets_browser_' . $type);
  $view->set_arguments(array( 'exo' ));
  $view->exo = TRUE;
  $output['view']['#markup'] = $view->preview('default');
  $view->destroy();

  $output['status'] = array(
    '#markup' => theme('status_messages'),
    '#weight' => -10,
  );

  if( $js != 'ajax'){
    return $output;
  }

  $commands = array();
  $commands[] = ajax_command_html('#exo-widget-exoSidebarButton-' . $type . '-content', drupal_render($output));
  if($return_commands){
    return $commands;
  }
  $page = array('#type' => 'ajax', '#commands' => $commands);
  ajax_deliver($page);
  exit;
}


/**
 * View an asset
 */
function exo_asset_page_view($asset, $instance = 0){
  if(empty($instance)) $instance = asset_instance_load_with_type($instance, $asset->type);
  return asset_instance_render($asset, $instance);
}


/**
 * Form callback wrapper: create or edit a asset.
 *
 * @param $asset
 *   The asset object being edited by this form.
 *
 * @see asset_edit_form()
 */
function exo_asset_form_wrapper($asset, $js = FALSE) {
  if(!is_a($asset, 'Asset')){
    $asset = asset_create(array('type' => $asset));
  }
  module_load_include('inc','asset','asset.admin');
  $output = array();
  $output['form'] = drupal_get_form('exo_asset_edit_form', $asset, $js);

  $output['status'] = array(
    '#markup' => theme('status_messages'),
    '#weight' => -10,
  );

  if( $js != 'ajax'){
    return $output;
  }

  $commands = array();
  $commands[] = ajax_command_exo_pane(drupal_render($output));
  $page = array('#type' => 'ajax', '#commands' => $commands);
  ajax_deliver($page);
  exit;
}

/**
 * Form callback: create or edit a asset.
 *
 * @param $asset
 *   The asset object to edit or for a create form an empty asset object
 *     with only a asset type defined.
 */
function exo_asset_edit_form($form, &$form_state, $asset, $js) {

  $form['status'] = array(
    '#markup' => theme('status_messages'),
    '#weight' => -10,
  );

  $form += drupal_retrieve_form('asset_edit_form', $form_state, $asset);
  $form_state['build_info']['files'][] = drupal_get_path('module', 'asset').'/asset.admin.inc';
  $form_state['build_info']['files'][] = drupal_get_path('module', 'exo_asset').'/exo_asset.page.inc';

  if($js){
    $form_state['js'] = TRUE;
    $form['#id'] = 'asset-create-form';
    $form['actions']['submit']['#attributes']['class'][] = 'btn';
    $form['actions']['submit']['#ajax'] = array(
      'callback' => 'exo_asset_edit_form_submit_ajax',
      'wrapper' => 'asset-create-form',
      'method' => 'replace',
    );
    if(!empty($form['actions']['delete'])){
      $form['actions']['delete'] = array(
        '#markup' => l('Delete', 'exo/asset/'.$asset->id.'/delete/nojs', array('attributes'=>array('class'=>array('btn', 'btn-danger', 'use-ajax')))),
        '#weight' => 50
      );
    }
    $form['actions']['cancel'] = array(
      '#markup' => l('Cancel', '', array('attributes'=>array('class'=>array('btn', 'btn-link', 'exo-pane-close')))),
      '#weight' => 100
    );
  }
  return $form;
}

function exo_asset_edit_form_submit_ajax($form, $form_state) {
  if(!form_get_errors()){
    // Close pane and refresh view
    $commands = exo_asset_browser( $form_state['asset'], NULL, TRUE, TRUE );
    $commands[] = ajax_command_exo_pane_hide();
    $page = array('#type' => 'ajax', '#commands' => $commands);
    ajax_deliver($page);
    exit;
  }else{
    return $form;
  }
}

function exo_asset_edit_delete_form_submit_ajax($form, $form_state) {
  if(!form_get_errors()){
    return exo_asset_delete($form_state['asset'], TRUE);
    exit;
  }else{
    return $form;
  }
}

/**
 * Remove an asset
 *
 * @author JaceRider
 *
 * @param  $id
 *   The entity ID.
 * @param  $js
 *   Boolean if is a javascript request.
 */
function exo_asset_delete( $asset, $js = FALSE ){

  $output = array();

  $output['view'] = array(
    '#markup' => '<h3>' . t('Delete') . ' <strong>' . $asset->name . '</strong></h3>',
    '#weight' => -9,
  );
  $output['message'] = array(
    '#markup' => '<div class="lead">' . t('Are you sure you want to delete this asset?') . '</div>',
    '#weight' => -8,
  );
  // if($usage = exo_asset_usage_list( $asset->id )){
  //   $output['usage'] = array(
  //     '#markup' => '<div class="alert alert-error"><h4>Warning!</h4>' . $usage . '</div>',
  //     '#weight' => -7,
  //   );
  // }else{
  //   $output['usage'] = array(
  //     '#markup' => '<div class="alert alert-info"><h4>No Worries</h4>' . t('This asset is not used anywhere on your site.') . ' <strong> ' . t('Feel at peace as you delete it.') . '</strong> ' . t('This action cannot be undone.') . '</div>',
  //     '#weight' => -7,
  //   );
  // }
  $output['form'] = drupal_get_form('exo_asset_delete_form', $asset);

  $output['status'] = array(
    '#markup' => theme('status_messages'),
    '#weight' => -10,
  );

  if( $js != 'ajax'){
    return $output;
  }

  $commands = array();
  $commands[] = ajax_command_exo_pane(drupal_render($output));
  $page = array('#type' => 'ajax', '#commands' => $commands);
  ajax_deliver($page);
  exit;
}

function exo_asset_delete_form($form, &$form_state, $asset){

  $form_state['asset'] = $asset;
  $form['#id'] = 'asset-remove-form';

  $form['actions'] = array('#type' => 'actions');
  $form['actions']['delete'] = array(
    '#type' => 'button',
    '#value' => t('Delete'),
    '#attributes' => array('class'=>array('btn', 'btn-danger')),
  );
  $form['actions']['delete']['#ajax'] = array(
    'callback' => 'exo_asset_delete_form_submit_ajax',
    'wrapper' => 'asset-remove-form',
    'method' => 'replace',
  );
  $form['actions']['cancel'] = array(
    '#markup' => l('Cancel', '', array('attributes'=>array('class'=>array('btn', 'btn-link', 'exo-pane-close')))),
    '#weight' => 100
  );

  return $form;
}

function exo_asset_delete_form_submit_ajax($form, &$form_state){
  if(!form_get_errors()){
    asset_delete( $form_state['asset'] );
    // Close pane and refresh view
    $commands = exo_asset_browser( $form_state['asset']->type, NULL, TRUE, TRUE );
    $commands[] = ajax_command_exo_pane_hide();
    $page = array('#type' => 'ajax', '#commands' => $commands);
    ajax_deliver($page);
    exit;
  }else{
    return $form;
  }
}


function exo_asset_instance_form_wrapper($asset, $instance, $js = FALSE){
  if(empty($instance)) $instance = asset_instance_load_with_type($instance, $asset->type);
  $instance->lock = TRUE;
  $instance->asset = $asset;
  $output = array();

  module_load_include('inc', 'asset_instance', 'asset_instance.admin');
  $output['form'] = drupal_get_form('exo_asset_instance_form', $instance);

  if( $js != 'ajax'){
    return $output;
  }

  $commands = array();
  $commands[] = ajax_command_exo_pane(drupal_render($output));
  // Asset set must be called after pane has been triggered
  $commands[] = ajax_command_exo_asset_set();
  $page = array('#type' => 'ajax', '#commands' => $commands);
  ajax_deliver($page);
  exit;
}

function exo_asset_instance_form($form, &$form_state, $instance, $op = 'edit'){
  $form = asset_instance_form($form, $form_state, $instance, $op);
  $form_state['build_info']['files'][] = drupal_get_path('module', 'asset_instance').'/asset_instance.admin.inc';
  $form_state['build_info']['files'][] = drupal_get_path('module', 'exo_asset').'/exo_asset.page.inc';
  $form_state['entity_type'] = 'asset_instance';

  if(isset($form['actions'])){
    $form['actions']['submit']['#value'] = t('Update Instance');
    $form['actions']['submit']['#ajax'] = array(
      'callback' => 'exo_asset_instance_form_submit_ajax',
      'wrapper' => 'asset-instance-form',
      'method' => 'replace',
      'effect' => 'fade',
    );
  }

  // Asset ID
  if($asset_id = arg(2)){
    $form['actions']['edit'] = array(
      '#markup' => '<strong>' . l('Edit Asset', 'exo/asset/' . $asset_id . '/edit/nojs', array('attributes'=>array('class'=>array('btn', 'use-ajax')))) . '</strong>',
      '#weight' => 99
    );
  }

  $form['actions']['cancel'] = array(
    '#markup' => l('Cancel', '', array('attributes'=>array('class'=>array('btn', 'btn-link', 'exo-pane-close')))),
    '#weight' => 100
  );

  return $form;
}


function exo_asset_instance_form_submit_ajax($form, &$form_state){
  if(!form_get_errors()){
    // Load in new asset display
    $asset = $form_state['asset_instance']->asset;
    $iid = empty($form_state['asset_instance']->id) ? FALSE : $form_state['asset_instance']->id;
    exo_asset_js_load($asset->id, $iid);

    $commands[] = ajax_command_exo_pane_hide();
    $commands[] = ajax_command_exo_asset_update($asset->id, $iid);
    $page = array('#type' => 'ajax', '#commands' => $commands);
    ajax_deliver($page);
    exit;
  }else{
    return $form;
  }
}
