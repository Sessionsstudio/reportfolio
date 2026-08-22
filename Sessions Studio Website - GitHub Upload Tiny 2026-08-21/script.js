const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
const portfolioTabs = document.querySelector(".portfolio-tabs");
const tabButtons = Array.from(document.querySelectorAll(".portfolio-tab"));
const portfolioContent = document.querySelector("#portfolio-content");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const closeButton = lightbox.querySelector(".lightbox-close");
const previousButton = lightbox.querySelector(".lightbox-previous");
const nextButton = lightbox.querySelector(".lightbox-next");

const portfolioData = {
  "real-estate": [
    {
      title: "Interiors",
      description: "Real estate interior photography",
      images: Array.from({ length: 20 }, (_, index) => {
        const number = String(index + 1).padStart(2, "0");
        return {
          src: `images/interiors/image-${number}.jpg`,
          alt: `Interior real estate photography sample ${index + 1}`,
        };
      }),
    },
    {
      title: "Exteriors",
      description: "Exterior and aerial real estate photography",
      images: Array.from({ length: 30 }, (_, index) => {
        const number = String(index + 1).padStart(2, "0");
        return {
          src: `images/exteriors/image-${number}.jpg`,
          alt: `Exterior and aerial real estate photography sample ${index + 1}`,
        };
      }),
    },
  ],
  portraits: [
    {
      title: "Graduation",
      description: "Graduation portrait photography",
      images: ["MTM04137.jpg", "MTM04161.jpg", "MTM04264.jpg"].map((file, index) => ({
        src: `images/Portraits/Graduation/${file}`,
        alt: `Graduation portrait photography sample ${index + 1}`,
      })),
    },
    {
      title: "LinkedIn Profiles",
      description: "Professional profile photography",
      images: ["DSC08528.jpg", "DSC08554.jpg", "MTM04562.jpg"].map((file, index) => ({
        src: `images/Portraits/Linkedin Profiles/${file}`,
        alt: `Professional profile photography sample ${index + 1}`,
      })),
    },
    {
      title: "Family Portraits",
      description: "Family portrait photography",
      images: [
        "DSC08954.jpg",
        "DSC09032.jpg",
        "DSC09100.jpg",
        "DSC09161.jpg",
        "DSC09165.jpg",
        "DSC09222.jpg",
        "DSC09224.jpg",
        "DSC09335.jpg",
        "DSC09336.jpg",
        "MTM01052.jpg",
        "MTM01157.jpg",
      ].map((file, index) => ({
        src: `images/Portraits/Family Portraits/${file}`,
        alt: `Family portrait photography sample ${index + 1}`,
      })),
    },
  ],
  "product-photography": [
    {
      title: "Product Photography",
      description: "Product photography",
      images: [
        "MTM00298.jpg",
        "MTM00304.jpg",
        "MTM00549.jpg",
        "MTM00618.jpg",
        "MTM00626.jpg",
        "MTM08216.jpg",
        "MTM08533.jpg",
        "MTM08814.jpg",
      ].map((file, index) => ({
        src: `images/Product Photography/${file}`,
        alt: `Product photography sample ${index + 1}`,
      })),
    },
  ],
  sports: [
    {
      title: "Sports",
      description: "Sports photography",
      images: [
        "MTM01289.jpg",
        "MTM01733.jpg",
        "MTM01813.jpg",
        "MTM01842.jpg",
        "MTM01867.jpg",
        "MTM01981.jpg",
        "MTM01991-Enhanced-NR.jpg",
        "MTM02024.jpg",
        "MTM02071.jpg",
      ].map((file, index) => ({
        src: `images/Sports/${file}`,
        alt: `Sports photography sample ${index + 1}`,
      })),
    },
  ],
};

let galleryItems = [];
let activeIndex = 0;
let activeCategory = "real-estate";
let lastFocusedElement = null;
let activeHeroSlide = 0;
let isDraggingTabs = false;
let tabDragStartX = 0;
let tabDragStartScroll = 0;
let tabDragDistance = 0;
let didDragTabs = false;

function setHeroSlide(index) {
  if (!heroSlides.length) {
    return;
  }

  heroSlides[activeHeroSlide].classList.remove("is-active");
  activeHeroSlide = (index + heroSlides.length) % heroSlides.length;
  heroSlides[activeHeroSlide].classList.add("is-active");
}

if (heroSlides.length > 1) {
  window.setInterval(() => setHeroSlide(activeHeroSlide + 1), 5000);
}

function createGalleryItem(image, index) {
  const button = document.createElement("button");
  button.className = "gallery-item";
  button.type = "button";
  button.dataset.full = image.src;
  button.addEventListener("click", () => openLightbox(index));

  const img = document.createElement("img");
  img.src = image.src;
  img.alt = image.alt;
  img.loading = "lazy";

  button.append(img);
  return button;
}

function renderCategory(category) {
  activeCategory = category;
  portfolioContent.replaceChildren();
  galleryItems = [];

  portfolioData[category].forEach((section) => {
    const sectionElement = document.createElement("section");
    sectionElement.className = "portfolio-group";
    sectionElement.setAttribute("aria-label", section.description);

    const heading = document.createElement("div");
    heading.className = "portfolio-group-heading";

    const title = document.createElement("h3");
    title.textContent = section.title;

    const count = document.createElement("span");
    count.textContent = `${section.images.length} ${section.images.length === 1 ? "photo" : "photos"}`;

    const gallery = document.createElement("div");
    gallery.className = "gallery";
    gallery.setAttribute("aria-label", `${section.description} gallery`);

    section.images.forEach((image) => {
      const item = createGalleryItem(image, galleryItems.length);
      galleryItems.push(item);
      gallery.append(item);
    });

    heading.append(title, count);
    sectionElement.append(heading, gallery);
    portfolioContent.append(sectionElement);
  });
}

function updateActiveTab(category) {
  tabButtons.forEach((button) => {
    const isActive = button.dataset.category === category;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    if (didDragTabs) {
      event.preventDefault();
      return;
    }

    const category = button.dataset.category;

    if (category === activeCategory) {
      return;
    }

    updateActiveTab(category);
    renderCategory(category);
  });
});

if (portfolioTabs) {
  portfolioTabs.addEventListener("pointerdown", (event) => {
    isDraggingTabs = true;
    tabDragStartX = event.clientX;
    tabDragStartScroll = portfolioTabs.scrollLeft;
    tabDragDistance = 0;
    didDragTabs = false;
  });

  portfolioTabs.addEventListener("pointermove", (event) => {
    if (!isDraggingTabs) {
      return;
    }

    const distance = event.clientX - tabDragStartX;
    tabDragDistance = Math.max(tabDragDistance, Math.abs(distance));

    if (tabDragDistance <= 6) {
      return;
    }

    didDragTabs = true;
    portfolioTabs.classList.add("is-dragging");
    portfolioTabs.scrollLeft = tabDragStartScroll - distance;
  });

  function stopDraggingTabs(event) {
    if (!isDraggingTabs) {
      return;
    }

    isDraggingTabs = false;
    portfolioTabs.classList.remove("is-dragging");

    window.setTimeout(() => {
      tabDragDistance = 0;
      didDragTabs = false;
    }, 80);
  }

  portfolioTabs.addEventListener("pointerup", stopDraggingTabs);
  portfolioTabs.addEventListener("pointercancel", stopDraggingTabs);
  portfolioTabs.addEventListener("pointerleave", stopDraggingTabs);
}

function showImage(index) {
  activeIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[activeIndex];
  const image = item.querySelector("img");

  lightboxImage.src = item.dataset.full;
  lightboxImage.alt = image.alt;
}

function openLightbox(index) {
  lastFocusedElement = document.activeElement;
  showImage(index);
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  closeButton.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.style.overflow = "";

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

closeButton.addEventListener("click", closeLightbox);
previousButton.addEventListener("click", () => showImage(activeIndex - 1));
nextButton.addEventListener("click", () => showImage(activeIndex + 1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    showImage(activeIndex - 1);
  }

  if (event.key === "ArrowRight") {
    showImage(activeIndex + 1);
  }
});

renderCategory(activeCategory);
