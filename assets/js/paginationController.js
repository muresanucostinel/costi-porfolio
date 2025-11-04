// ============================
// Pagination Controller
// ============================

function pagController() {
  // Track current pagination state
  let currentPage = 0;
  let totalPages = null;

  // Track active filters
  let activeCategories = [];
  let activeTags = [];

  let sortDirection = null; // 'asc', 'desc', or null

  // ============================
  // Function: setFilters
  // Called when user changes category/tag filters
  // ============================
  function setFilters({ categories = [], tags = [] }) {
    activeCategories = categories;
    activeTags = tags;
    currentPage = 0;
    totalPages = null;

    // 🔄 Re-enable Load More button when filters are reset or changed
    const loadBtn = document.getElementById("cm-load-more-btn");
    if (loadBtn) {
      loadBtn.textContent = "Load More";
      loadBtn.disabled = false;
      loadBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }

    console.log("Filters updated:", { activeCategories, activeTags });
  }

  // ============================
  // Function: loadNextPage
  // Loads the next page of posts (with filters applied)
  // ============================
  async function loadNextPage() {
    // 🧩 Get the Load More button so we can update its state
    const btn = document.getElementById("cm-load-more-btn");

    // Stop early if we’ve reached the last page
    if (totalPages && currentPage >= totalPages) {
      if (btn) {
        btn.textContent = "No More Posts";
        btn.disabled = true;
        btn.classList.add("opacity-50", "cursor-not-allowed");
      }
      console.log("No more posts to load.");
      return;
    }

    // Increment current page
    currentPage++;

    // Show loading state on the button
    if (btn) {
      btn.textContent = "Loading...";
      btn.disabled = true;
    }

    // Fetch posts (with active filters)
    const result = await fetchPosts({
      perPage: 3,
      page: currentPage,
      categories: activeCategories.join(","),
      tags: activeTags.join(","),
    });

    // If sorting is active, re-sort after loading new posts
    if (sortDirection) {
      sortPosts();
    }
    // Update total pages on first fetch
    if (!totalPages) totalPages = result.totalPages || 1;

    console.log(`✅ Page ${currentPage} of ${totalPages}`);

    // Re-enable Load More button if we haven’t reached the end
    if (btn && currentPage < totalPages) {
      btn.textContent = "Load More";
      btn.disabled = false;
    }

    // Disable and update text if it was the final page
    if (btn && currentPage >= totalPages) {
      btn.textContent = "No More Posts";
      btn.disabled = true;
      btn.classList.add("opacity-50", "cursor-not-allowed");
    }
  }

  // Public API
  return {
    loadNextPage,
    setFilters,
    setSort: (direction) => (sortDirection = direction),
    clearSort: () => (sortDirection = null),
    getSort: () => sortDirection,
  };
}

// ============================
// Initialize controller
// ============================
const controller = pagController();

// ============================
// Initialize on page load
// ============================
window.addEventListener("DOMContentLoaded", async () => {
  // Render category/tag filters and pass controller for interaction
  await cm_renderFilters(controller);

  // Load initial posts (page 1)
  controller.loadNextPage();

  // Create Load More button if loadPosts exists
  if (typeof loadPosts === "function") {
    loadPosts("See More Posts");
  } else {
    console.warn(
      "loadPosts() not available yet. Make sure loadMore.js loads before paginationController.js"
    );
  }
});
