// ============================
// Function: Load More button
// ============================
function loadPosts(buttonText = "Load More") {
  const loadMoreBtn = document.createElement("button");

  loadMoreBtn.id = "cm-load-more-btn";
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

  loadMoreBtn.addEventListener("click", async () => {
    loadMoreBtn.textContent = "Loading...";
    loadMoreBtn.disabled = true;
    await controller.loadNextPage();
    loadMoreBtn.textContent = "Load More";
    loadMoreBtn.disabled = false;
  });

  const postsContainer = document.getElementById("posts");
  postsContainer.after(loadMoreBtn);
}

console.log("✅ Load more button initialized!");

// ============================
// View: Render Category + Tag Filters
// ============================
async function cm_renderFilters(controller) {
  const postsContainer = document.getElementById("posts");

  const [categories, tags] = await Promise.all([
    cm_fetchCategories(),
    cm_fetchTags(),
  ]);

  const filterBar = document.createElement("div");
  filterBar.className =
    "relative flex flex-wrap justify-center gap-4 my-6 p-4 bg-black/30 backdrop-blur-sm rounded-lg z-50";

  let selectedCategories = [];
  let selectedTags = [];
  let filtersInitialized = false;

  // ============================
  // Sort Toggle Button
  // ============================
  const sortBtn = document.createElement("button");
  sortBtn.textContent = "Sort Latest";
  sortBtn.classList.add(
    "px-5",
    "py-2.5",
    "bg-blue-600",
    "text-white",
    "rounded-full",
    "font-semibold",
    "shadow-md",
    "transition-all",
    "duration-200",
    "hover:scale-105"
  );

  let isDesc = true;

  sortBtn.addEventListener("click", () => {
    if (isDesc) {
      controller.setSort("desc");
      sortBtn.textContent = "Sort Oldest";
    } else {
      controller.setSort("asc");
      sortBtn.textContent = "Sort Latest";
    }

    isDesc = !isDesc;
    sortPosts();
  });

  // ============================
  // Category Dropdown
  // ============================
  const categoryDropdown = cm_createDropdown({
    id: "cm-category-dropdown",
    label: "Categories",
    options: categories,
    onChange: (selectedIDs) => {
      if (!filtersInitialized) return;
      selectedCategories = selectedIDs;

      controller.setFilters({
        categories: selectedCategories,
        tags: selectedTags,
      });

      postsContainer.innerHTML = "";
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

      postsContainer.innerHTML = "";
      controller.loadNextPage();
    },
  });

  // ============================
  // Reset Filters
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

  resetBtn.addEventListener("click", async () => {
    resetBtn.classList.add("opacity-70");
    resetBtn.textContent = "Resetting...";

    controller.clearSort();
    sortBtn.textContent = "Sort Latest";
    isDesc = true;

    selectedCategories = [];
    selectedTags = [];
    controller.setFilters({ categories: [], tags: [] });

    if (categoryDropdown.reset) categoryDropdown.reset();
    if (tagDropdown.reset) tagDropdown.reset();

    postsContainer.innerHTML = "";
    await controller.loadNextPage();

    resetBtn.textContent = "Reset Filters";
    resetBtn.classList.remove("opacity-70");
  });

  filtersInitialized = true;

  filterBar.append(categoryDropdown, tagDropdown, sortBtn, resetBtn);
  postsContainer.before(filterBar);
}

// ============================
// Optional helper
// ============================
async function cm_reloadFilteredPosts(categoryIDs = [], tagIDs = []) {
  const postsContainer = document.getElementById("posts");
  postsContainer.innerHTML = "";

  await fetchPosts({
    page: 1,
    perPage: 3,
    categories: categoryIDs.join(","),
    tags: tagIDs.join(","),
  });
}
