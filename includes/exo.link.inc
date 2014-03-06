<?php

function exo_link_view($js = FALSE){
  $output = array();

  $output['form'] = drupal_get_form('exo_link_form');

  if( $js != 'ajax'){
    return $output;
  }

  $commands = array();
  $commands[] = ajax_command_exo_pane(drupal_render($output));
  $page = array('#type' => 'ajax', '#commands' => $commands);
  ajax_deliver($page);
  exit;
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


  // $form['tabs'] = array(
  //    '#type' => 'vertical_tabs',
  // );

  // $form['web'] = array(
  //   '#type' => 'fieldset',
  //   '#title' => t('Web address'),
  //   '#collapsible' => FALSE,
  //   '#collapsed' => FALSE,
  //   // '#group' => 'tabs',
  // );

  $form['web'] = array(
    '#type' => 'textfield',
    '#title' => t('URL for the link'),
    '#size' => 60,
    '#maxlength' => 128,
    '#attributes' => array('class'=>array('input-block-level'),'data-type'=>'raw'),
    '#id' => 'exo-link-web',
  );

  if(module_exists('linkit')){
    //_linkit_add_settings('field');
    // ctools_include('plugins');
    // // Try to load the insert plugin we have chosen to use.
    // $plugin = ctools_get_plugins('linkit', 'linkit_insert', 'raw_url');

    $plugins = linkit_profile_field_load_all();
    if(!empty($plugins)){
      // Load the profile.
      $profile = array_pop($plugins);
      // Load the insert plugin for the profile.
      $insert_plugin = linkit_insert_plugin_load($profile->data['insert_plugin']['plugin']);

      $element = &$form['web'];

      // Set the field ID.
      $field_id = $element['#id'];

      $field_js = array(
        'data' => array(
          'linkit' => array(
            'fields' => array(
              $field_id => array(
                'profile' => $profile->name,
                'insert_plugin' => $profile->data['insert_plugin']['plugin'],
                'url_method' => $profile->data['insert_plugin']['url_method'],
                // @TODO: Add autocomplete settings.
              ),
            ),
          ),
        ),
        'type' => 'setting',
      );

      // Link fields can have a title field.
      if ($element['#type'] == 'link_field') {
        if (isset($instance['settings']['title']) && in_array($instance['settings']['title'], array('optional', 'required'))) {
          $field_js['data']['linkit']['fields'][$field_id]['title_field'] = $element['#id'] . '-title';
        }
      }

      // Attach js files and settings Linkit needs.
      $element['#attached']['library'][] = array('linkit', 'base');
      $element['#attached']['library'][] = array('linkit', 'field');
      $element['#attached']['js'][] = $insert_plugin['javascript'];
      $element['#attached']['js'][] = $field_js;

      $button_text = !empty($instance['settings']['linkit']['button_text']) ? $instance['settings']['linkit']['button_text'] : t('Search');
      $element['#suffix'] = '<a class="btn btn-info btn-sm btn-block linkit-field-button linkit-field-' . $field_id . '" href="#">' . $button_text . '</a>';
    }
  }

  // $form['email'] = array(
  //   '#type' => 'fieldset',
  //   '#title' => t('Email'),
  //   '#collapsible' => TRUE,
  //   '#collapsed' => FALSE,
  //   '#group' => 'tabs',
  // );

  // $form['email']['url'] = array(
  //   '#type' => 'textfield',
  //   '#title' => t('Email address for the link'),
  //   '#size' => 60,
  //   '#maxlength' => 128,
  //   '#attributes' => array('class'=>array('input-block-level'),'data-type'=>'email'),
  // );

  $form['actions'] = array('#type' => 'actions');
  // $form['actions']['save'] = array(
  //   '#markup' => l('Insert Link', '', array('attributes'=>array('class'=>array('btn', 'btn-success', 'exo-link-save')))),
  //   '#weight' => 100
  // );
  $form['actions']['save'] = array(
    '#type' => 'submit',
    '#value' => t('Insert Link'),
    '#attributes' => array('class'=>array('btn', 'btn-success', 'exo-link-save')),
    '#weight' => 100,
  );
  $form['actions']['cancel'] = array(
    '#markup' => l('Cancel', '', array('attributes'=>array('class'=>array('btn', 'btn-link', 'exo-pane-close')))),
    '#weight' => 101
  );

  return $form;
}
