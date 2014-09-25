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
 * Process callback for all elements allowed in exo_allowed_elements().
 */
function exo_process_widget(&$element) {
  if(isset($element['#entity'])){
    $field = field_info_field($element['#field_name']);
    $instance = field_info_instance($element['#entity_type'], $element['#field_name'], $element['#bundle']);
    // dsm($field);
    // dsm($instance);
  }
  return $element;
}

/**
 * Process callback for text_format.
 */
function exo_process_text_format(&$element) {
  // dsm('process text format');
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
