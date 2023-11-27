<?php
/**
 * Functions for enqueuing child theme scripts.
 *
 * @package nevechild
 */

add_action( 'wp_enqueue_scripts', 'neve_child_load_css', 20 );

if ( ! function_exists( 'neve_child_load_css' ) ) :
	/**
	 * Load CSS file.
	 */
	function neve_child_load_css() {

		wp_enqueue_style( 'nevechild-style', trailingslashit( get_stylesheet_directory_uri() ) . 'assets/dist/css/theme.min.css', array( 'neve-style' ), filemtime( get_stylesheet_directory() . '/assets/dist/css/theme.min.css' ) );

	}
endif;

/**
 * Enqueue admin only assets.
 *
 * @package nevechild
 */
function nevechild_admin_scripts() {
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/dist/css/admin.min.css' );
}
