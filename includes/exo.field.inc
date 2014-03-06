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

function exo_field_info_instance($entity_type, $field_name, $bundle){
  $instance = field_info_instance($entity_type, $field_name, $bundle);
  if(!empty($instance['settings']['exo'])){
    $instance['settings']['exo']['settings'] = empty($instance['settings']['exo']['default']) ? $instance['settings']['exo']['settings'] : variable_get('exo_defaults', array());
  }
  return $instance;
}

/**
 * Process callback.
 */
function exo_process_widget(&$element) {
  if (!isset($element['#entity_type'])) {
    return $element;
  }

  $field = field_info_field($element['#field_name']);
  $instance = exo_field_info_instance($element['#entity_type'], $element['#field_name'], $element['#bundle']);

  // eXo is not enabled on this field
  if(empty($instance['settings']['exo']['enable'])) return $element;
  $options = $instance['settings']['exo']['settings'];

  // Load the settings back into the instance incase we are using defaults.
  $instance['settings']['exo']['settings'] = $options;

  if(empty($element['#entity_type'])){
    $id = 'exo-config';
  }else{
    $id = str_replace('_','-','exo-'.$element['#entity_type'].'-'.$element['#bundle'].'-'.$element['#field_name']);
  }

  $element['#title'] = '';
  $element['#resizable'] = FALSE;

  $settings = array(
    'id' => $id,
    'label' => $instance['label'],
    'preview_class' => !empty($options['preview_class']) ? $options['preview_class'] : '',
  );

  $element['#id'] = $id;
  $element['#attributes']['class'][] = 'exo-textarea';


  $context = array(
    'field' => $field,
    'instance' => $instance
  );
  drupal_alter('exo_process_widget', $element, $settings, $context);

  exo_add_js($settings);

  return $element;
}

/**
 * Process callback.
 */
function exo_process_text_format(&$element) {
  if (!isset($element['#entity_type'])) {
    return $element;
  }

  $field = field_info_field($element['#field_name']);
  $instance = exo_field_info_instance($element['#entity_type'], $element['#field_name'], $element['#bundle']);

  // eXo is not enabled on this field
  if(empty($instance['settings']['exo'])) return $element;

  $config = $instance['settings']['exo'];

  // eXo is not enabled on this field
  if(empty($config['enable']) || empty($config['settings']['text_format'])) return $element;

  $text_format = $config['settings']['text_format'];

  $element['format']['#type'] = 'container';
  $element['format']['guidelines']['#access'] = FALSE;
  $element['format']['help']['#access'] = FALSE;
  $element['format']['#attributes']['class'][''] = 'element-hidden';
  $element['format']['format']['#default_value'] = $text_format;

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
