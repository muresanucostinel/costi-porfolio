function pagController() {
  let currentPage = 0;
  let totalPages = null;

  async function loadNextPage() {
    // Stop early if we already reached the end
    if (totalPages && currentPage >= totalPages) {
      const btn = document.querySelector("button");
      if (btn) {
        btn.textContent = "No More Posts";
        btn.disabled = true;
        btn.classList.add("opacity-50", "cursor-not-allowed");
      }
      console.log("No more posts to load.");
      return; // ✅ Stop here — no more fetch
    }

    currentPage++;

    const result = await fetchPosts({ perPage: 3, page: currentPage });
    if (!totalPages) totalPages = result.totalPages; // Store it after first fetch
    console.log(`Page ${currentPage} of ${totalPages}`);
  }

  return { loadNextPage };
}

const controller = pagController();

window.addEventListener("DOMContentLoaded", () => {
  controller.loadNextPage();
  loadPosts("See More Posts");
});
