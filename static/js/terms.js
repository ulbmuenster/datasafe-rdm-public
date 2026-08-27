document.addEventListener("DOMContentLoaded", () => {
  const siteHeaderElement = document.querySelector("header.theme.header");

  function getOffset() {
    return siteHeaderElement?.offsetHeight || 0;
  }

  function smoothScrollToHash(hash) {
    if (!hash) return;
    const element = document.querySelector(hash);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - getOffset();
      window.scrollTo({ top: y, behavior: "smooth" });

      // Optional: highlight element
      element.classList.add("highlighted");
      setTimeout(() => element.classList.remove("highlighted"), 1500);
    }
  }

  // Handle TOC clicks
  document.querySelectorAll(".terms-toc-link").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      smoothScrollToHash(link.getAttribute("href"));
    });
  });

  // Handle hash change (when navigating directly)
  function adjustScroll() {
    setTimeout(() => smoothScrollToHash(window.location.hash), 50);
  }

  window.addEventListener("hashchange", adjustScroll);
  window.addEventListener("load", adjustScroll);
  window.addEventListener("resize", adjustScroll);
});
