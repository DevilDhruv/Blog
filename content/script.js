/**
 * BLOG DATA
 * Stored in an array for easy manipulation and sorting.
 */
const blogs = [
  {
    id: 1,
    title: "Implement Array from Scratch in JavaScript",
    description:
      "Understand how arrays work internally by building your own array with push, pop, insert, and delete operations.",
    date: "2025-12-29",
    tags: ["javascript", "arrays", "dsa", "beginner"],
    url: "../Learn/implement-array/index.html",
  },
  {
    id: 2,
    title: "Reverse a String in JavaScript",
    description:
      "An interview-focused walkthrough of reversing a string using loops, built-in methods, and edge-case handling.",
    date: "2025-12-30",
    tags: ["javascript", "strings", "beginner", "interview"],
    url: "../Learn/reverse-string/index.html",
  },
  {
    id: 3,
    title: "Merge Two Sorted Arrays",
    description:
      "Learn the two-pointer technique to merge sorted arrays efficiently with interview-level reasoning.",
    date: "2025-12-31",
    tags: ["javascript", "arrays", "two-pointers", "dsa"],
    url: "../Learn/merge-sorted-array/index.html",
  },
  {
    id: 4,
    title: "Find Longest Word In The String",
    description: 
      "Learn how to find the longest word in a sentence using JavaScript. Step-by-step interview-style explanation with edge cases and clean implementation.",
    date: "2026-01-01",
    tags: ["javascript", "strings", "beginner", "interview"],
    url: "../Learn/longest-word/index.html",
  },
  {
    id: 5,
    title: "Rotate Array in C++ | Interview Question",
    description:
      "Learn how to rotate an array in C++ using an efficient algorithm. Step-by-step interview-style explanation with edge cases and clean implementation.",
    date: "2026-01-02",
    tags: ["c++", "arrays", "dsa", "interview", "star"],
    url: "../Learn/rotate-array/index.html",
  },
  {
    id: 6,
    title: "Contains Duplicate in C++",
    description:
      "Learn how to check for duplicates in an array using C++. Step-by-step interview-style explanation with edge cases and clean implementation.",
    date: "2026-01-04",
    tags: ["c++", "arrays", "hashing", "dsa"],
    url: "../Learn/contains-duplicate/index.html",
  },
  {
    id: 7,
    title: "Move Zeroes in C++",
    description:
      "Learn how to move zeroes to the end of an array using C++. Step-by-step interview-style explanation with edge cases and clean implementation.",
    date: "2026-01-04",
    tags: ["c++", "arrays", "two-pointers", "dsa"],
    url: "../Learn/move-zeros/index.html",
  },
  {
    id: 8,
    title: "Maximum Subarray in C++ (Kadane’s Algorithm)",
    description: 
      "Learn how to solve the Maximum Subarray problem in C++ using Kadane’s Algorithm. Step-by-step interview-style explanation with edge cases and clean implementation.",
    date: "2026-01-05",
    tags: ["c++", "arrays", "dsa", "kadane"],
    url: "../Learn/maximum-subarray/index.html",
  },
  
  {
    id: 9,
    title: "Two Sum Problem in C++",
    description:
      "Learn how to solve the Two Sum problem in C++. Step-by-step interview-style explanation with edge cases and clean implementation.",
    date: "2026-01-06",
    tags: ["c++", "arrays", "hashing", "dsa"],
    url: "../Learn/two-sum/index.html",
  }
];


/**
 * STATE MANAGEMENT
 */
let currentSearch = ""
const activeTags = new Set()

/**
 * DOM ELEMENTS
 */
const blogGrid = document.getElementById("blogGrid")
const searchInput = document.getElementById("searchInput")
const noResults = document.getElementById("noResults")
const clearFiltersBtn = document.getElementById("clearFiltersBtn")
const activeFiltersContainer = document.getElementById("activeFilters")

/**
 * INITIALIZATION
 */
function init() {
  // 1. Sort blogs reverse chronological (latest first)
  blogs.sort((a, b) => new Date(b.date) - new Date(a.date))

  // 2. Handle URL Query Parameters
  const urlParams = new URLSearchParams(window.location.search)
  const tagParam = urlParams.get("tag")
  if (tagParam) {
    activeTags.add(tagParam.toLowerCase())
  }

  // 3. Event Listeners
  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value.toLowerCase()
    render()
  })

  clearFiltersBtn.addEventListener("click", clearAllFilters)

  // 4. Initial Render
  render()
}

/**
 * CORE RENDERING LOGIC
 */
function render() {
  // Filter blogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(currentSearch) ||
      blog.description.toLowerCase().includes(currentSearch) ||
      blog.tags.some((t) => t.toLowerCase().includes(currentSearch))

    const matchesTags = activeTags.size === 0 || [...activeTags].every((tag) => blog.tags.includes(tag))

    return matchesSearch && matchesTags
  })

  // Clear grid
  blogGrid.innerHTML = ""

  // Toggle no results message
  if (filteredBlogs.length === 0) {
    noResults.classList.remove("hidden")
  } else {
    noResults.classList.add("hidden")

    // Build cards
    filteredBlogs.forEach((blog) => {
      const card = createBlogCard(blog)
      blogGrid.appendChild(card)
    })
  }

  renderActiveFilters()
}

/**
 * COMPONENT GENERATORS
 */
function createBlogCard(blog) {
  const card = document.createElement("article")
  card.className = "blog-card"

  // Format date nicely
  const dateOptions = { year: "numeric", month: "long", day: "numeric" }
  const formattedDate = new Date(blog.date).toLocaleDateString(undefined, dateOptions)

  card.innerHTML = `
        <time class="blog-date" datetime="${blog.date}">${formattedDate}</time>
        <h2 class="blog-title">${blog.title}</h2>
        <p class="blog-description">${blog.description}</p>
        <div class="blog-tags">
            ${blog.tags.map((tag) => `<span class="tag ${activeTags.has(tag) ? "active" : ""}" data-tag="${tag}">${tag}</span>`).join("")}
        </div>
        <a href="${blog.url}" class="read-link">Read →</a>
    `

  // Add click events to tags within the card
  card.querySelectorAll(".tag").forEach((tagEl) => {
    tagEl.addEventListener("click", (e) => {
      e.preventDefault()
      const tag = e.target.getAttribute("data-tag")
      toggleTag(tag)
    })
  })

  return card
}

function renderActiveFilters() {
  activeFiltersContainer.innerHTML = ""

  if (activeTags.size > 0) {
    activeTags.forEach((tag) => {
      const filterTag = document.createElement("span")
      filterTag.className = "tag active"
      filterTag.innerHTML = `${tag} &times;`
      filterTag.addEventListener("click", () => toggleTag(tag))
      activeFiltersContainer.appendChild(filterTag)
    })

    // Add "Clear all" text link if multiple tags or search
    const clearLink = document.createElement("span")
    clearLink.style.cssText =
      "font-size: 0.8rem; color: var(--primary); cursor: pointer; text-decoration: underline; margin-left: 0.5rem; display: flex; align-items: center;"
    clearLink.textContent = "Clear all filters"
    clearLink.onclick = clearAllFilters
    activeFiltersContainer.appendChild(clearLink)
  }
}

/**
 * ACTIONS
 */
function toggleTag(tag) {
  if (activeTags.has(tag)) {
    activeTags.delete(tag)
  } else {
    activeTags.add(tag)
  }

  // Update URL without reloading to reflect state
  updateUrl()
  render()
}

function clearAllFilters() {
  activeTags.clear()
  currentSearch = ""
  searchInput.value = ""
  updateUrl()
  render()
}

function updateUrl() {
  const url = new URL(window.location)
  url.searchParams.delete("tag")

  // Currently only supporting one tag in URL as per requirement but multiple in state
  if (activeTags.size > 0) {
    url.searchParams.set("tag", [...activeTags][0])
  }

  window.history.pushState({}, "", url)
}

// Start the app
init()

const themeButtons = document.querySelectorAll("[data-theme-btn]");

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  themeButtons.forEach(btn =>
    btn.classList.toggle("active", btn.dataset.themeBtn === theme)
  );
}

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);

// Button events
themeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    setTheme(btn.dataset.themeBtn);
  });
});
