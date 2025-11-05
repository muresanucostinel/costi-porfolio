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
  apiUrl = "http://headless-wp.local/wp-json/costi/v1/load-posts",
  page = 1,
  categories = "",
  tags = "",
} = {}) {
  try {
    // Build URL
    let fullUrl = `${apiUrl}?perPage=${perPage}&page=${page}`;
    if (categories) fullUrl += `&categories=${categories}`;
    if (tags) fullUrl += `&tags=${tags}`;
    console.log("Fetching posts from:", fullUrl);

    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error("Failed to fetch posts");

    const data = await response.json();
    console.log("REST response:", data);

    // Insert new HTML into container
    const postsContainer = document.getElementById("posts");
    postsContainer.insertAdjacentHTML("beforeend", data.html);

    // Return total pages if available
    return { totalPages: data.totalPages ?? null };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { totalPages: null };
  }
}

// Fetching the categories for filtering

async function cm_fetchCategories({
  catApiUrl = "http://headless-wp.local/wp-json/wp/v2/categories",
} = {}) {
  try {
    const catFullUrl = `${catApiUrl}`;
    console.log("Fetching categories from:", catFullUrl);

    const catResponse = await fetch(catFullUrl);

    if (!catResponse.ok) throw new Error("Failed to fetch categories");

    const categories = await catResponse.json();
    console.log("Fetched categories:", categories);

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

// Fetching the categories for filtering

async function cm_fetchTags({
  tagsApiUrl = "http://headless-wp.local/wp-json/wp/v2/tags",
} = {}) {
  try {
    const tagsFullUrl = `${tagsApiUrl}`;
    console.log("Fetching tags from:", tagsFullUrl);

    const tagsResponse = await fetch(tagsFullUrl);

    if (!tagsResponse.ok) throw new Error("Failed to fetch tags");

    const tags = await tagsResponse.json();
    console.log("Fetched tags:", tags);

    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
  }
}

function sortPosts() {
  const postsContainer = document.getElementById("posts");
  const cards = Array.from(postsContainer.children);

  const direction = controller.getSort(); // 'asc' or 'desc'
  if (!direction) return; // no sorting active

  cards.sort((a, b) => {
    const d1 = new Date(a.dataset.date);
    const d2 = new Date(b.dataset.date);
    return direction === "desc" ? d2 - d1 : d1 - d2;
  });

  postsContainer.innerHTML = "";
  cards.forEach((c) => postsContainer.appendChild(c));
}
