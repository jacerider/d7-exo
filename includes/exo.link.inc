<?php

function exo_link_view(){
  $form = drupal_get_form('exo_link_form');
  return array(
    '#type' => 'ajax',
    '#commands' =>  array(
      ajax_command_exo_pane(drupal_render($form))
    ),
  );
}

function exo_link_form($form, &$form_state){

  $form['#id'] = 'exo-link-form';

  $form['title'] = array(
    '#type' => 'textfield',
    '#title' => t('Text to display'),
    '#size' => 60,
    '#maxlength' => 128,
    '#attributes' => array('class'=>array('input-block-level')),
    '#id' => 'exo-link-title'
  );

  $form['web'] = array(
    '#type' => 'textfield',
    '#title' => t('URL for the link'),
    '#size' => 60,
    '#maxlength' => 256,
    '#attributes' => array('class'=>array('input-block-level'),'data-type'=>'raw'),
    '#id' => 'exo-link-web',
  );

  $linkClasses = array(
    'button' => t('Display as Button')
  );
  $form['class'] = array(
    '#type' => 'checkboxes',
    '#options' => $linkClasses,
    '#id' => 'exo-link-class',
  );

  if(module_exists('linkit')){

    $plugins = linkit_profile_field_load_all();
    if(!empty($plugins)){
      // Load the first profile.
      $profile = array_pop($plugins);
      // Load the insert plugin for the profile.
      $insert_plugin = linkit_insert_plugin_load($profile->data['insert_plugin']['plugin']);

      $element = &$form['web'];

      // Set the field ID.
      $field_id = $element['#id'];

      $js_settings = array(
        'helper' => 'field',
        'source' => $field_id,
        'profile' => $profile->name,
        'insertPlugin' => $profile->data['insert_plugin']['plugin'],
      );

      // Attach js files and settings Linkit needs.
      $element['#attached']['library'][] = array('linkit', 'base');
      $element['#attached']['library'][] = array('linkit', 'field');
      $element['#attached']['js'][] = $insert_plugin['javascript'];
      // $element['#attached']['js'][] = $field_js;

      $element['#attached']['js'][] = array(
        'type' => 'setting',
        'data' => array(
          'linkit' => array('fields' => array($js_settings)),
        ),
      );

      $button_text = !empty($instance['settings']['linkit']['button_text']) ? $instance['settings']['linkit']['button_text'] : t('Search Local Content');
      $element['#field_suffix'] = '<a class="button tiny expand secondary linkit-field-button linkit-field-' . $field_id . '" href="#"><i class="fa fa-search"></i> ' . $button_text . '</a>';
    }
  }

  $form['new'] = array(
    '#type' => 'checkbox',
    '#title' => t('Open in a new window'),
    '#id' => 'exo-link-new',
  );

  $form['actions'] = array('#type' => 'actions');
  $form['actions']['save'] = array(
    '#type' => 'submit',
    '#value' => t('Insert Link'),
    '#attributes' => array('class'=>array('button', 'primary', 'exo-link-save')),
    '#weight' => 100,
  );
  $form['actions']['cancel'] = array(
    '#markup' => l('Cancel', '', array('attributes'=>array('class'=>array('button', 'tiny', 'text', 'exo-pane-close')))),
    '#weight' => 101
  );

  return $form;
}
