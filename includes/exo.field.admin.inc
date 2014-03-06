<?php

/**
 * Implements hook_form_FIELD_UI_FIELD_EDIT_FORM_alter().
 */
function exo_form_field_ui_field_edit_form_alter(&$form, &$form_state) {

  // Get allowed field and widget types.
  $allowed_field_types = exo_allowed_field_types();
  $allowed_field = in_array($form['#field']['type'], $allowed_field_types);
  $allowed_widget_types = exo_allowed_widget_types();
  $allowed_widget = in_array($form['instance']['widget']['type']['#value'], $allowed_widget_types);

  // Add the eXo settings to the field instance form.
  if ($allowed_field  && $allowed_widget) {
    exo_form_field_form($form, $form_state);
  }
}

/**
 * Mee configuration form.
 */
function exo_form_field_form(&$form, &$form_state){
  $instance = empty($form['#instance']) ? array() : $form['#instance'];

  // Get defaults
  $default_values = !empty($instance['settings']['exo']['settings']) ? $instance['settings']['exo']['settings'] : array();

  // Fieldset for eXo settings on this field instance.
  $form['instance']['settings']['exo'] = array(
    '#type' => 'fieldset',
    '#title' => t('eXo Editor'),
    '#collapsible' => FALSE,
    '#collapsed' => FALSE,
    '#id' => 'edit-instance-settings-exo',
  );

  // Enable eXo on this field instance.
  $form['instance']['settings']['exo']['enable'] = array(
    '#type' => 'checkbox',
    '#title' => t('Enable eXo support'),
    '#default_value' => isset($instance['settings']['exo']['enable']) ? $instance['settings']['exo']['enable'] : 0,
  );

  $form['instance']['settings']['exo']['default'] = array(
    '#type' => 'checkbox',
    '#title' => t('Use default settings'),
    '#default_value' => isset($instance['settings']['exo']['default']) ? $instance['settings']['exo']['default'] : 0,
    '#states' => array(
      'visible' => array(
        'input[name="instance[settings][exo][enable]"]' => array('checked' => TRUE),
      ),
    ),
  );

  $form['instance']['settings']['exo']['settings'] = exo_configuration_form($default_values);

  $form['instance']['settings']['exo']['settings']['#states'] = array(
      'visible' => array(
        'input[name="instance[settings][exo][enable]"]' => array('checked' => TRUE),
        'input[name="instance[settings][exo][default]"]' => array('checked' => FALSE),
      ),
  );

  array_unshift($form['#submit'], 'exo_form_field_form_submit');

}

function exo_form_field_form_submit($form, &$form_state){
  if(isset($form_state['values']['instance']['settings']['exo'])){
    if(!empty($form_state['values']['instance']['settings']['exo']['enable'])){
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

  $exo = array(
    '#type' => 'fieldset',
    '#title' => t('Settings'),
    '#collapsible' => FALSE,
    '#collapsed' => FALSE,
  );

  $options = array(0 => '-- Allow All --');
  foreach(filter_formats() as $format){
    if($format->status) $options[$format->format] = $format->name;
  }
  $exo['text_format'] = array(
    '#type' => 'select',
    '#title' => t('Text format'),
    '#options' => $options,
    '#default_value' => isset($default_values['text_format']) ? $default_values['text_format'] : 0,
  );

  $exo['preview_class'] = array(
    '#type' => 'textfield',
    '#title' => t('Preview class'),
    '#default_value' => isset($default_values['preview_class']) ? $default_values['preview_class'] : 'exo-content-preview',
    '#description' => t('Class to add to eXo preview pane. This assists in styling the preview area using frontend styles.'),
  );

  // $options = array(
  //   // 'halloblock' => t('Block'),
  //   'halloheadings' => t('Headings'),
  //   'halloformat' => '<i class="fa fa-bold"></i> <i class="fa fa-italic"></i> ' . t('Format'),
  //   'hallolists' => '<i class="fa fa-list-ol"></i> <i class="fa fa-list-ul"></i> ' . t('Lists'),
  //   'hallojustify' => '<i class="fa fa-align-left"></i> <i class="fa fa-align-center"></i> <i class="fa fa-align-right"></i> ' . t('Justify'),
  //   'exolink' => '<i class="fa fa-link"></i> ' . t('Link'),
  //   'exoindent' => '<i class="fa fa-indent"></i> <i class="fa fa-dedent"></i> ' . t('Indent'),
  //   'halloreundo' => '<i class="fa fa-undo"></i> <i class="fa fa-repeat"></i> ' . t('Redo/Undo'),
  // );
  // $exo['settings']['pluginsHallo'] = array(
  //   '#type' => 'checkboxes',
  //   '#title' => t('Editor Plugins'),
  //   '#options' => $options,
  //   '#default_value' => isset($default_values['pluginsHallo']) ? $default_values['pluginsHallo'] : array(),
  // );

  drupal_alter('exo_settings_form', $exo, $default_values);

  return $exo;
}
