function loadPosts(buttonText = "Load More") {
  const loadMoreBtn = document.createElement("button");

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
    controller.loadNextPage();
    loadMoreBtn.textContent = "Load More";
  });

  const postsContainer = document.getElementById("posts");

  postsContainer.after(loadMoreBtn);
}
