<?php

/**
 * Implements hook_views_default_views().
 */
function exo_asset_views_default_views() {
  $views = array();

  $exo_asset_types = asset_get_types();
  foreach($exo_asset_types as $bundle => $asset){
    $views['exo_asset_'.$asset->type] = exo_asset_views_default_views_browser( $asset );
  }

  return $views;
}

/**
 * Asset browser
 */
function exo_asset_views_default_views_browser( $bundle ){

  $info = field_info_instances('asset', $bundle->type);
  $has_image = $has_file = FALSE;
  foreach($info as $field){
    switch($field['widget']['type']){
      case 'image_image':
        $has_image = TRUE;
        break;
      case 'file_generic':
        $has_file = TRUE;
        break;
    }
  }

  $view = new view;
  $view->name = 'exo_assets_browser_' . $bundle->type;
  $view->description = 'A view used to list all asset types of "'.$bundle->label.'".';
  $view->tag = 'asset';
  $view->base_table = 'asset';
  $view->human_name = 'eXo | Assets | ' . $bundle->label;
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['use_ajax'] = TRUE;
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'none';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'full';
  $handler->display->display_options['pager']['options']['items_per_page'] = '8';
  $handler->display->display_options['pager']['options']['offset'] = '0';
  $handler->display->display_options['pager']['options']['id'] = '0';
  $handler->display->display_options['pager']['options']['quantity'] = '9';
  $handler->display->display_options['style_plugin'] = 'grid';
  $handler->display->display_options['style_options']['columns'] = '2';
  $handler->display->display_options['row_plugin'] = 'fields';
  /* No results behavior: Global: Unfiltered text */
  $handler->display->display_options['empty']['area_text_custom']['id'] = 'area_text_custom';
  $handler->display->display_options['empty']['area_text_custom']['table'] = 'views';
  $handler->display->display_options['empty']['area_text_custom']['field'] = 'area_text_custom';
  $handler->display->display_options['empty']['area_text_custom']['label'] = 'No Results Found';
  $handler->display->display_options['empty']['area_text_custom']['empty'] = TRUE;
  $handler->display->display_options['empty']['area_text_custom']['content'] = '<div class="alert">No ' . strtolower($bundle->data['plural']) . ' found.</div>';
  /* Field: Asset: Name */
  $handler->display->display_options['fields']['name']['id'] = 'name';
  $handler->display->display_options['fields']['name']['table'] = 'asset';
  $handler->display->display_options['fields']['name']['field'] = 'name';
  $handler->display->display_options['fields']['name']['label'] = '';
  $handler->display->display_options['fields']['name']['element_label_colon'] = FALSE;
  /* Field: Asset: Image */
  if($has_image){
    $handler->display->display_options['fields']['field_asset_image']['id'] = 'field_asset_image';
    $handler->display->display_options['fields']['field_asset_image']['table'] = 'field_data_field_asset_image';
    $handler->display->display_options['fields']['field_asset_image']['field'] = 'field_asset_image';
    $handler->display->display_options['fields']['field_asset_image']['label'] = '';
    $handler->display->display_options['fields']['field_asset_image']['element_label_colon'] = FALSE;
    $handler->display->display_options['fields']['field_asset_image']['click_sort_column'] = 'fid';
    $handler->display->display_options['fields']['field_asset_image']['settings'] = array(
      'image_style' => 'asset-thumb',
      'image_link' => '',
    );
  }
  /* Field: Asset: File */
  if($has_file){
    $handler->display->display_options['fields']['field_asset_file']['id'] = 'field_asset_file';
    $handler->display->display_options['fields']['field_asset_file']['table'] = 'field_data_field_asset_file';
    $handler->display->display_options['fields']['field_asset_file']['field'] = 'field_asset_file';
    $handler->display->display_options['fields']['field_asset_file']['label'] = '';
    $handler->display->display_options['fields']['field_asset_file']['element_label_colon'] = FALSE;
    $handler->display->display_options['fields']['field_asset_file']['click_sort_column'] = 'fid';
    $handler->display->display_options['fields']['field_asset_file']['type'] = 'file_mime_type_icon';
  }
  /* Field: Asset: Asset Select */
  $handler->display->display_options['fields']['asset_select']['id'] = 'asset_select';
  $handler->display->display_options['fields']['asset_select']['table'] = 'asset';
  $handler->display->display_options['fields']['asset_select']['field'] = 'asset_select';
  $handler->display->display_options['fields']['asset_select']['label'] = '';
  $handler->display->display_options['fields']['asset_select']['element_type'] = '0';
  $handler->display->display_options['fields']['asset_select']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['asset_select']['element_wrapper_type'] = '0';
  $handler->display->display_options['fields']['asset_select']['element_default_classes'] = FALSE;
  /* Sort criterion: Asset: Created */
  $handler->display->display_options['sorts']['created']['id'] = 'created';
  $handler->display->display_options['sorts']['created']['table'] = 'asset';
  $handler->display->display_options['sorts']['created']['field'] = 'created';
  $handler->display->display_options['sorts']['created']['order'] = 'DESC';
  /* Contextual filter: Asset: Category (field_asset_category) */
  $handler->display->display_options['arguments']['field_asset_category_tid']['id'] = 'field_asset_category_tid';
  $handler->display->display_options['arguments']['field_asset_category_tid']['table'] = 'field_data_field_asset_category';
  $handler->display->display_options['arguments']['field_asset_category_tid']['field'] = 'field_asset_category_tid';
  $handler->display->display_options['arguments']['field_asset_category_tid']['default_argument_type'] = 'fixed';
  $handler->display->display_options['arguments']['field_asset_category_tid']['summary']['number_of_records'] = '0';
  $handler->display->display_options['arguments']['field_asset_category_tid']['summary']['format'] = 'default_summary';
  $handler->display->display_options['arguments']['field_asset_category_tid']['summary_options']['items_per_page'] = '25';
  /* Filter criterion: Asset: Type */
  $handler->display->display_options['filters']['type']['id'] = 'type';
  $handler->display->display_options['filters']['type']['table'] = 'asset';
  $handler->display->display_options['filters']['type']['field'] = 'type';
  $handler->display->display_options['filters']['type']['value'] = array(
    $bundle->type => $bundle->type,
  );
  $handler->display->display_options['filters']['type']['group'] = 1;

  return $view;

}
