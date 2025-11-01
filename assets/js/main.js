/**
 * =========================
 * fetchPosts.js - Learning Version
 * =========================
 * This function fetches posts from a WordPress REST API
 * and displays them in a grid layout with a fallback image.
 *
 * It’s written for learning purposes with full comments.
 */

/**
 * Fetch and display WordPress posts.
 *
 * @param {Object} arg - Configuration object.
 * @param {number} [arg.perPage=6] - Number of posts to fetch.
 * @param {string} [arg.fallbackImage="https://placehold.co/600x400?text=No+Image"] - URL for fallback image if a post has none.
 * @param {string} [arg.apiUrl="http://headless-wp.local/wp-json/wp/v2/posts?_embed"] - REST API endpoint for posts.
 *
 * Usage examples:
 * fetchPosts(); // Uses all defaults
 * fetchPosts({ perPage: 9 }); // Override number of posts
 * fetchPosts({ perPage: 3, fallbackImage: "myimage.jpg" }); // Override multiple options
 */

async function fetchPosts({
  perPage = 6,
  fallbackImage = "https://placehold.co/600x400?text=No+Image",
  apiUrl = "http://headless-wp.local/wp-json/wp/v2/posts?_embed",
  page = 1,
  onTotalPages = null,
} = {}) {
  try {
    // -----------------------------
    // Step 1: Construct the URL
    // -----------------------------

    const fullUrl = `${apiUrl}&per_page=${perPage}&page=${page}`;
    console.log("Fetching posts from:", fullUrl);

    // -----------------------------
    // Step 2: Fetch the posts
    // -----------------------------
    const response = await fetch(fullUrl);

    // Check if fetch was successful
    if (!response.ok) throw new Error("Failed to fetch posts");

    const totalPosts = response.headers.get("X-WP-Total");
    const totalPages = response.headers.get("X-WP-TotalPages");

    console.log(`Total posts: ${totalPosts}, Total pages: ${totalPages}`);

    // Parse JSON from response
    const posts = await response.json();
    console.log("Posts received:", posts);

    // -----------------------------
    // Step 3: Get the container in DOM
    // -----------------------------
    const postsContainer = document.getElementById("posts");

    // -----------------------------
    // Step 4: Loop through each post
    // -----------------------------
    posts.forEach((post) => {
      /**
       * Featured image logic:
       * - If post has a featured image, use it
       * - Otherwise, use fallback image
       */
      const featured =
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || fallbackImage;

      // -----------------------------
      // Step 5: Create a card for each post
      // -----------------------------
      const postCard = document.createElement("div");
      postCard.className =
        "bg-white/90 text-black rounded-xl shadow-lg p-4 transition hover:-translate-y-1 hover:scale-105 hover:shadow-2xl";

      postCard.classList.add(
        "post-card",
        "bg-white",
        "rounded-lg",
        "shadow-md",
        "p-4",
        "transition",
        "duration-300",
        "transform",
        "hover:-translate-y-1",
        "hover:shadow-xl",
        "cursor-pointer"
      );

      postCard.innerHTML = `
          <img src="${featured}" alt="${post.title.rendered}" class="w-full h-48 object-cover rounded-lg mb-3">
          <h2 class="text-xl font-semibold mb-2">${post.title.rendered}</h2>
          <div class="text-gray-600 text-sm">${post.excerpt.rendered}</div>
          <div class="flex text-sm pt-2"><a href="${post._embedded?.author?.[0]?.link}">${post._embedded?.author?.[0]?.name}</a><span class="flex text-sm text-right item-end"><img src="${post._embedded?.author?.[0]?.avatar_urls?.[24]}"</span></div>
        `;

      // -----------------------------
      // Step 6: Append the card to the container
      // -----------------------------
      postsContainer.appendChild(postCard);
    });
    return { totalPages };
  } catch (error) {
    // -----------------------------
    // Step 7: Catch errors
    // -----------------------------
    console.error("Error fetching posts:", error);
    return { totalPages: null };
  }
}
