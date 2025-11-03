// ============================
// Function: Load More button
// ============================
function loadPosts(buttonText = "Load More") {
  // Create the Load More button
  const loadMoreBtn = document.createElement("button");

  loadMoreBtn.id = "cm-load-more-btn"; // ✅ important for controller targeting
  loadMoreBtn.textContent = buttonText;

  loadMoreBtn.classList.add(
    "bg-blue-600",
    "hover:bg-blue-700",
    "text-white",
    "font-semibold",
    "px-6",
    "py-3",
    "rounded-lg",
    "mt-6",
    "mx-auto",
    "block",
    "transition",
    "duration-200"
  );

  // Add click event to fetch the next page
  loadMoreBtn.addEventListener("click", async () => {
    loadMoreBtn.textContent = "Loading...";
    loadMoreBtn.disabled = true;
    await controller.loadNextPage();
    loadMoreBtn.textContent = "Load More";
    loadMoreBtn.disabled = false;
  });

  // Insert the button after the posts container
  const postsContainer = document.getElementById("posts");
  postsContainer.after(loadMoreBtn);
}

console.log("✅ Load more button initialized!");

// ============================
// View: Render Category + Tag Filters
// ============================
async function cm_renderFilters(controller) {
  const postsContainer = document.getElementById("posts");

  // Fetch categories and tags in parallel
  const [categories, tags] = await Promise.all([
    cm_fetchCategories(),
    cm_fetchTags(),
  ]);

  // Create wrapper for filters
  const filterBar = document.createElement("div");
  filterBar.className =
    "relative flex flex-wrap justify-center gap-4 my-6 p-4 bg-black/30 backdrop-blur-sm rounded-lg z-50";

  // Track selected filters
  let selectedCategories = [];
  let selectedTags = [];

  // Flag to prevent double fetch on first render
  let filtersInitialized = false;

  // ============================
  // Category Dropdown
  // ============================
  const categoryDropdown = cm_createDropdown({
    id: "cm-category-dropdown",
    label: "Categories",
    options: categories,
    onChange: (selectedIDs) => {
      if (!filtersInitialized) return; // ⛔ skip first auto-trigger

      selectedCategories = selectedIDs;
      controller.setFilters({
        categories: selectedCategories,
        tags: selectedTags,
      });

      const postsContainer = document.getElementById("posts");
      postsContainer.innerHTML = ""; // clear old posts
      controller.loadNextPage();
    },
  });

  // ============================
  // Tag Dropdown
  // ============================
  const tagDropdown = cm_createDropdown({
    id: "cm-tag-dropdown",
    label: "Tags",
    options: tags,
    onChange: (selectedIDs) => {
      if (!filtersInitialized) return;

      selectedTags = selectedIDs;
      controller.setFilters({
        categories: selectedCategories,
        tags: selectedTags,
      });

      const postsContainer = document.getElementById("posts");
      postsContainer.innerHTML = "";
      controller.loadNextPage();
    },
  });

  // ============================
  // Reset Filters Button (outside dropdowns)
  // ============================
  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Reset Filters";
  resetBtn.classList.add(
    "px-5",
    "py-2.5",
    "bg-gradient-to-r",
    "from-red-500",
    "to-rose-600",
    "hover:from-red-600",
    "hover:to-rose-700",
    "text-white",
    "rounded-full",
    "font-semibold",
    "shadow-md",
    "transition-all",
    "duration-200",
    "hover:scale-105"
  );

  // ✅ Reset filters, clear dropdowns, and reload posts
  resetBtn.addEventListener("click", async () => {
    resetBtn.classList.add("opacity-70");
    resetBtn.textContent = "Resetting...";

    // Reset local state
    selectedCategories = [];
    selectedTags = [];

    // Reset filters in controller
    controller.setFilters({ categories: [], tags: [] });

    // ✅ Reset dropdowns visually via helper methods
    if (categoryDropdown.reset) categoryDropdown.reset();
    if (tagDropdown.reset) tagDropdown.reset();

    // Clear and reload posts
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";
    await controller.loadNextPage();

    // Restore button state
    resetBtn.textContent = "Reset Filters";
    resetBtn.classList.remove("opacity-70");
  });

  // ✅ Enable dropdown handlers after setup
  filtersInitialized = true;

  // Add dropdowns + reset button to the filter bar
  filterBar.append(categoryDropdown, tagDropdown, resetBtn);

  // Place filters above posts
  postsContainer.before(filterBar);
}

// ============================
// Optional helper for reloading posts directly
// ============================
async function cm_reloadFilteredPosts(categoryIDs = [], tagIDs = []) {
  const postsContainer = document.getElementById("posts");
  postsContainer.innerHTML = ""; // Clear current posts

  const args = {
    perPage: 3,
    page: 1,
    categories: categoryIDs.join(","),
    tags: tagIDs.join(","),
  };

  console.log("Reloading posts with filters:", args);
  await fetchPosts(args);
}
