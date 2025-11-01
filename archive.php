<?php
/**
 * Template Name: Headless JS Page
 * Description: A custom page that renders posts via JavaScript (headless style)
 */
get_header();
?>

<main id="post-template"
    class="bg-gradient-to-tr from-black via-neutral-900 to-yellow-700/30 min-h-screen text-white headless-wrapper">
  <div
      id="posts"
      class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
    ></div>
</main>

<?php get_footer(); ?>
