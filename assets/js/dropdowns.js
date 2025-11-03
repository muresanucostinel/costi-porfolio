// ============================
// Function: Create Custom Dropdown
// Reusable component for categories, tags, etc.
// ============================

function cm_createDropdown({ id, label, options, onChange }) {
  // Wrapper element for dropdown
  const wrapper = document.createElement("div");
  wrapper.className = "cm-dropdown relative inline-block text-left";
  wrapper.id = id;
  wrapper.dataset.label = label; // store original label for resets
  wrapper.selectedOptions = [];

  // ============================
  // Dropdown Button
  // ============================
  const button = document.createElement("button");
  button.type = "button";
  button.className =
    "cm-dropdown-label inline-flex justify-center w-48 rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 transition items-center gap-x-1.5";
  button.textContent = label; // default label text

  // Add caret icon (optional)
  const icon = document.createElement("span");
  icon.innerHTML = "&#9662;"; // ▼
  icon.className = "ml-2 text-gray-400 text-xs";
  button.appendChild(icon);

  // ============================
  // Dropdown Menu Container
  // ============================
  const menu = document.createElement("div");
  menu.className =
    "absolute mt-2 w-48 origin-top-right rounded-lg bg-gray-900 border border-gray-700 shadow-lg z-[9999] hidden";

  // ============================
  // Populate menu options
  // ============================
  options.forEach((opt) => {
    const optionWrapper = document.createElement("label");
    optionWrapper.className =
      "flex items-center px-3 py-1 text-gray-300 hover:bg-gray-800 cursor-pointer text-sm";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = opt.id;
    checkbox.className = "mr-2 accent-blue-500";

    const text = document.createElement("span");
    text.textContent = opt.name;

    optionWrapper.append(checkbox, text);
    menu.appendChild(optionWrapper);

    // Handle checkbox change
    checkbox.addEventListener("change", () => {
      const selected = Array.from(
        menu.querySelectorAll("input[type='checkbox']:checked")
      ).map((cb) => parseInt(cb.value));

      wrapper.selectedOptions = selected;

      // Update button label
      if (selected.length === 0) {
        button.textContent = label;
      } else if (selected.length === 1) {
        const selectedName = options.find((o) => o.id === selected[0])?.name;
        button.textContent = selectedName || "1 selected";
      } else {
        button.textContent = `${selected.length} selected`;
      }

      // Fire onChange callback
      if (typeof onChange === "function") {
        onChange(selected);
      }
    });
  });

  // ============================
  // Toggle dropdown visibility
  // ============================
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("hidden");
  });

  // Close dropdown if clicked outside
  document.addEventListener("click", () => menu.classList.add("hidden"));

  // Append elements
  wrapper.append(button, menu);

  // ============================
  // Reset Method
  // Clears selections + restores default label
  // ============================
  wrapper.reset = () => {
    const checkboxes = wrapper.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((cb) => (cb.checked = false));
    wrapper.selectedOptions = [];
    button.textContent = label; // restore default label
  };

  return wrapper;
}
