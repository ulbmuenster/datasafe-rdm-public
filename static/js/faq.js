document.addEventListener("DOMContentLoaded", () => {

  function getYOffset() {
    const siteHeader = document.querySelector("header.theme.header");
    const headerHeight = siteHeader?.offsetHeight || 163;
    const distanceToHeader = 26;
    return headerHeight + distanceToHeader;
  }

  function setFaqTocPosition() {
    const faqTocWrapper = document.getElementById("faq-toc-wrapper");
    if (faqTocWrapper) {
      faqTocWrapper.style.top = `${getYOffset()}px`;
    }
  }

  function scrollToTarget(targetElement) {
    if (!targetElement) return;
    const yOffset = getYOffset();
    const y = targetElement.getBoundingClientRect().top + window.scrollY - yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  function highlightElement(element) {
    element.classList.add("faq-highlight");
    setTimeout(() => {
      element.classList.add("fade-bg-color");
    }, 3000);
  }

  function adjustScroll() {
    if (!window.location.hash) return;
    const element = document.querySelector(window.location.hash);
    if (element) {
      scrollToTarget(element);
      highlightElement(element);
    }
  }

  // Klick-Handler für TOC-Links
  document.querySelectorAll(".toc-link").forEach(link => {
    link.addEventListener("click", function(event) {
      event.preventDefault();
      document.querySelectorAll(".toc-entry").forEach(entry => {
        entry.classList.remove("active");
      });
      this.firstElementChild.classList.add("active");
      const target = document.querySelector(this.getAttribute("href"));
      scrollToTarget(target);
    });
  });

  // Hash-Änderung beobachten
  window.addEventListener("hashchange", adjustScroll);

  // Bei Fenster-Resize Position neu berechnen
  window.addEventListener("resize", setFaqTocPosition);

  // Fonts- und Layout-Ladezeit abwarten
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      setFaqTocPosition();
      adjustScroll();
    });
  } else {
    // Fallback für ältere Browser
    window.addEventListener("load", () => {
      setFaqTocPosition();
      adjustScroll();
    });
  }

  // Copy-Link-Funktion global verfügbar machen
  window.copyLink = function(id) {
    const url = window.location.href.split("#")[0] + "#" + id;
    navigator.clipboard.writeText(url).then(() => {
      alert("Link kopiert: " + url);
    });
  };

});
