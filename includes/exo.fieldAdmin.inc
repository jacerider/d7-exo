<?php

/**
 * Implements hook_form_FIELD_UI_FIELD_EDIT_FORM_alter().
 */
function exo_form_field_ui_field_edit_form_alter(&$form, &$form_state) {
  if(isset($form['instance'])){
    // Get allowed field and widget types.
    $allowed_field_types = exo_allowed_field_types();
    $allowed_field = in_array($form['#field']['type'], $allowed_field_types);
    $allowed_widget_types = exo_allowed_widget_types();
    $allowed_widget = in_array($form['instance']['widget']['type']['#value'], $allowed_widget_types);

    // Add the exo settings to the field instance form.
    if ($allowed_field  && $allowed_widget) {
      exo_form_field_form($form, $form_state);
    }
  }
}

/**
 * eXo configuration form.
 */
function exo_form_field_form(&$form, &$form_state){
  $instance = empty($form['#instance']) ? array() : $form['#instance'];

  // Get defaults
  $default_values = !empty($instance['settings']['exo']['settings']) ? $instance['settings']['exo']['settings'] : array();

  // Fieldset for exo settings on this field instance.
  $form['instance']['settings']['exo'] = array(
    '#type' => 'fieldset',
    '#title' => t('eXo'),
    '#collapsible' => FALSE,
    '#collapsed' => FALSE,
    '#id' => 'edit-instance-settings-exo',
  );

  // Enable exo on this field instance.
  $form['instance']['settings']['exo']['status'] = array(
    '#type' => 'checkbox',
    '#title' => t('Enable eXo'),
    '#description' => t('eXo enhances the content creation experience.'),
    '#default_value' => isset($instance['settings']['exo']['status']) ? $instance['settings']['exo']['status'] : 0,
  );

  $form['instance']['settings']['exo']['default'] = array(
    '#type' => 'checkbox',
    '#title' => t('Use default settings'),
    '#default_value' => isset($instance['settings']['exo']['default']) ? $instance['settings']['exo']['default'] : 1,
    '#description' => t('Defaults are set via !url.', array('!url' => l('admin/config/content/exo','admin/config/content/exo'))),
    '#states' => array(
      'visible' => array(
        'input[name="instance[settings][exo][status]"]' => array('checked' => TRUE),
      ),
    ),
  );

  $form['instance']['settings']['exo']['settings'] = exo_configuration_form($default_values);

  $form['instance']['settings']['exo']['settings']['#states'] = array(
      'visible' => array(
        'input[name="instance[settings][exo][status]"]' => array('checked' => TRUE),
        'input[name="instance[settings][exo][default]"]' => array('checked' => FALSE),
      ),
  );

  array_unshift($form['#submit'], 'exo_form_field_form_submit');
}

/**
 * Cleanup eXo settings when necessary.
 */
function exo_form_field_form_submit($form, &$form_state){
  if(isset($form_state['values']['instance']['settings']['exo'])){
    if(!empty($form_state['values']['instance']['settings']['exo']['status'])){
      if(!empty($form_state['values']['instance']['settings']['exo']['default'])){
        unset($form_state['values']['instance']['settings']['exo']['settings']);
      }
    }else{
      unset($form_state['values']['instance']['settings']['exo']);
    }
  }
}

/**
 * Settings form for eXo.
 */
function exo_configuration_form($default_values = array()){
  $default_values += exo_defaults();
  $form = array(
    '#type' => 'fieldset',
    '#title' => t('Settings'),
    '#collapsible' => FALSE,
    '#collapsed' => FALSE,
  );

  $options = array(0 => '-- Allow All --');
  foreach(filter_formats() as $format){
    if($format->status) $options[$format->format] = $format->name;
  }
  $form['text_format'] = array(
    '#type' => 'select',
    '#title' => t('Text format'),
    '#options' => $options,
    '#default_value' => $default_values['text_format'],
  );

  $toolbar_items = exo_toolbar_options();
  $toolbar_elements = array();
  foreach($toolbar_items as $key => $items){
    $toolbar_elements[$key] = array(
      '#tree' => true,
      '#type' => 'container',
      '#attributes' => array('class' => array('toolbar-items')),
      '#attached' => array(
        'css' => array(
          drupal_get_path('module', 'exo') . '/css/exo.settings.scss',
        ),
      ),
    );

    foreach($items as $item => $label){
      if($label == '-'){
        $toolbar_elements[$key][] = array(
          '#type' => 'value',
          '#value' => $label,
        );
      }
      else{
        $toolbar_elements[$key][$item] = array(
          '#type' => 'checkbox',
          '#title' => $label,
          '#default_value' => isset($default_values['toolbar'][$key][$item]),
          '#return_value' => $item,
        );
      }
    }
  }

  $form['toolbar'] = $toolbar_elements;
  $form['toolbar']['#title'] = t('Toolbar');
  $form['toolbar']['#tree'] = true;
  $form['toolbar']['#prefix'] = '<div class="form-item"><label class="">Toolbar</label>';
  $form['toolbar']['#suffix'] = '</div>';
  $form['toolbar']['#type'] = 'container';
  $form['toolbar']['#attributes'] = array('class' => array('toolbar-items-wrapper'));
  $form['toolbar']['#element_validate'][] = 'exo_configuration_form_toolbar_items_validate';

  drupal_alter('exo_settings_form', $form, $default_values);

  return $form;
}

/**
 * Validate the toolbar item values and clean them before being saved.
 */
function exo_configuration_form_toolbar_items_validate($element, &$form_state){
  $values = drupal_array_get_nested_value($form_state['values'], $element['#parents']);
  foreach($values as $key => &$value){
    $value = array_filter($value);
    if(!empty($value) && $value[key($value)] == '-'){
      unset($value[key($value)]);
    }
    end($value);
    if(!empty($value) && $value[key($value)] == '-'){
      unset($value[key($value)]);
    }
    // $value = array_values($value);
    if(empty($value)){
      unset($values[$key]);
    }
  }
  drupal_array_set_nested_value($form_state['values'], $element['#parents'], $values);
}
