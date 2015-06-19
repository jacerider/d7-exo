<?php

/**
 * Implements hook_element_info_alter().
 */
function exo_element_info_alter(&$types) {
  foreach(exo_allowed_elements() as $element){
    if(isset($types[$element])){
      $types[$element]['#process'][] = 'exo_process_widget';
    }
  }
  if(isset($types['text_format'])){
    $types['text_format']['#process'][] = 'exo_process_text_format';
  }
}

/**
 * Get exo settings.
 */
function exo_valid($element){
  if(!isset($element['#entity_type'])) return FALSE;
  if(isset($element['#exo_prevent'])) return FALSE;
  if(exo_prevent(TRUE)) return FALSE;
  $exo = array();
  $exo['field'] = field_info_field($element['#field_name']);
  $exo['instance'] = exo_field_info_instance($element['#entity_type'], $element['#field_name'], $element['#bundle']);
  return !empty($exo['instance']['settings']['exo']['status']) ? $exo + array('config' => $exo['instance']['settings']['exo']) : FALSE;
}

/**
 * An extension of field_info_instance() that adds exo defaults if necessary.
 */
function exo_field_info_instance($entity_type, $field_name, $bundle){
  $instance = field_info_instance($entity_type, $field_name, $bundle);
  if(!empty($instance['settings']['exo']) && !empty($instance['settings']['exo']['default'])){
    $instance['settings']['exo']['settings'] = variable_get('exo', array());
  }
  return $instance;
}

/**
 * Process callback for all elements allowed in exo_allowed_elements().
 */
function exo_process_widget(&$element) {

  if($exo = exo_valid($element)){
    $field = $exo['field'];
    $instance = $exo['instance'];
    $config = $exo['config'];

    if(empty($element['#entity_type'])){
      $selector = drupal_html_id('exo-config');
    }else{
      $selector = drupal_html_id('exo-'.$element['#entity_type'].'-'.$element['#bundle'].'-'.$element['#field_name']);
    }

    $element['#id'] = $selector;
    $element['#attributes']['class'][] = 'exo-textarea';
    $element['#title'] = '';
    $element['#resizable'] = FALSE;

    $id = $vid = $bundle = NULL;
    if($element['#entity']){
      list($id, $vid, $bundle) = entity_extract_ids($element['#entity_type'], $element['#entity']);
    }

    $settings = array(
      'selector' => $selector,
      'label' => $instance['label'],
      'type' => $element['#entity_type'],
      'id' => $id,
      'bundle' => $bundle,
      'field_name' => $element['#field_name'],
      'delta' => $element['#delta']
    );

    $context = array(
      'field' => $field,
      'instance' => $instance
    );
    drupal_alter('exo_process_widget', $element, $settings, $context);

    exo_add_js($settings);
  }

  return $element;
}

/**
 * Process callback for text_format.
 */
function exo_process_text_format(&$element) {
  if($exo = exo_valid($element)){
    $config = $exo['config'];
    if(!empty($config['settings']['text_format'])){
      $element['format']['#type'] = 'container';
      $element['format']['guidelines']['#access'] = FALSE;
      $element['format']['help']['#access'] = FALSE;
      $element['format']['#attributes']['class'][''] = 'element-hidden';
      $element['format']['format']['#default_value'] = $config['settings']['text_format'];
    }
  }
  return $element;
}

/**
 * Return a list of allowed elements.
 * @TODO: Make this a hook.
 */
function exo_allowed_elements() {
  $allowed_elements = array(
    'textarea',
  );
  drupal_alter('exo_allowed_elements', $allowed_elements);
  return $allowed_elements;
}

/**
 * Return a list of allowed field types.
 * @TODO: Make this a hook.
 */
function exo_allowed_field_types() {
  $allowed_field_types = array(
    'text_long',
    'text_with_summary',
  );
  drupal_alter('exo_allowed_field_types', $allowed_field_types);
  return $allowed_field_types;
}

/**
 * Return a list of allowed widget types.
 * @TODO: Make this a hook.
 */
function exo_allowed_widget_types() {
  $allowed_widget_types = array(
    'text_textarea',
    'text_textarea_with_summary',
  );
  drupal_alter('exo_allowed_widget_types', $allowed_widget_types);
  return $allowed_widget_types;
}
