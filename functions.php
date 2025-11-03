<?php

function cm_theme_setup() {

  // 1️⃣ Add support for dynamic <title> tag
  add_theme_support( 'title-tag' );

  // 2️⃣ Enable Featured Images (Post Thumbnails)
  add_theme_support( 'post-thumbnails' );

  // 3️⃣ Enable custom logo support
  add_theme_support( 'custom-logo', array(
    'height'      => 80,
    'width'       => 200,
    'flex-height' => true,
    'flex-width'  => true,
  ) );

  // 4️⃣ Register a primary navigation menu
  register_nav_menus( array(
    'cm_primary_menu' => __( 'Primary Menu', 'costimuresanu' ),
  ) );

  // 5️⃣ Register sidebar / widget area
  register_sidebar( array(
    'name'          => __( 'Main Sidebar', 'costimuresanu' ),
    'id'            => 'cm_main_sidebar',
    'description'   => __( 'Widgets displayed in the main sidebar area', 'costimuresanu' ),
    'before_widget' => '<div id="%1$s" class="widget %2$s mb-6">',
    'after_widget'  => '</div>',
    'before_title'  => '<h3 class="widget-title text-lg font-semibold mb-3">',
    'after_title'   => '</h3>',
  ) );

  // 6️⃣ Enable HTML5 markup support for forms, galleries, etc.
  add_theme_support( 'html5', array( 'search-form', 'comment-form', 'gallery', 'caption' ) );
}
add_action( 'after_setup_theme', 'cm_theme_setup' );


/**
 * Enqueue scripts and styles
 */

// -----------------------------
// 1️⃣ Global STYLES (CSS)
// -----------------------------
function cm_enqueue_styles() {
  // Main compiled CSS
  wp_enqueue_style(
    'cm-main',
    get_stylesheet_directory_uri() . '/assets/css/main.css',
    array(),
    filemtime( get_stylesheet_directory() . '/assets/css/main.css' ),
    'all'
  );

  // Default WordPress style.css (required)
  wp_enqueue_style(
    'cm-style',
    get_stylesheet_uri(),
    array('cm-main'),
    filemtime( get_stylesheet_directory() . '/style.css' ),
    'all'
  );
}
add_action( 'wp_enqueue_scripts', 'cm_enqueue_styles' );


// -----------------------------
// 2️⃣ Global SCRIPTS (JS)
// -----------------------------
function cm_enqueue_global_scripts() {
  // Main JS (for general site usage)
  wp_enqueue_script(
    'cm-main',
    get_template_directory_uri() . '/assets/js/main.js',
    array(),
    wp_get_theme()->get( 'Version' ),
    true
  );

  // Dropdown logic (global, used anywhere)
  wp_enqueue_script(
    'cm-dropdowns',
    get_template_directory_uri() . '/assets/js/dropdowns.js',
    array( 'cm-main' ),
    wp_get_theme()->get( 'Version' ),
    true
  );

  // Tailwind Elements (global UI library)
  wp_enqueue_script(
    'cm-tailwind-elements',
    'https://cdn.jsdelivr.net/npm/@tailwindplus/elements@1',
    array(),
    null,
    true
  );
}
add_action( 'wp_enqueue_scripts', 'cm_enqueue_global_scripts' );


// -----------------------------
// 3️⃣ Template-specific SCRIPTS (Headless)
// -----------------------------
function cm_enqueue_headless_scripts() {
  // Only load for headless template
  if ( is_page_template( 'template-headless.php' ) ) {
    wp_enqueue_script(
      'headless-main',
      get_stylesheet_directory_uri() . '/assets/js/main.js',
      array(),
      null,
      true
    );

    wp_enqueue_script(
      'headless-controller',
      get_stylesheet_directory_uri() . '/assets/js/paginationController.js',
      array( 'headless-main' ),
      null,
      true
    );

    wp_enqueue_script(
      'headless-loadmore',
      get_stylesheet_directory_uri() . '/assets/js/loadMore.js',
      array( 'headless-controller' ),
      null,
      true
    );
  }
}
add_action( 'wp_enqueue_scripts', 'cm_enqueue_headless_scripts' );
