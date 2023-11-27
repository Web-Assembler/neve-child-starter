<?php
/**
 * Main theme setup files.
 *
 * @package nevechild
 */

// Add custom image size.
add_action( 'init', 'nevechild_add_image_sizes' );
add_filter( 'image_size_names_choose', 'nevechild_add_image_size_to_media' );

/**
 * Add the image sizes specific to childtheme.
 */
function nevechild_add_image_sizes() {
	add_image_size( 'nevechild-fullwidth', 1280, 600, true );
}

/**
 * Add desired custom image sizes to the image sizes dropdown in the editor.
 *
 * @param array $sizes Array of existing sizes.
 */
function nevechild_add_image_size_to_media( $sizes ) {

	$custom_sizes = array(
		'nevechild-fullwidth' => 'nevechild 1280 fullwidth',
	);

	return array_merge( $sizes, $custom_sizes );
}
