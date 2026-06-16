const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
const youtubeFrames = Array.from(document.querySelectorAll("[data-youtube-src]"));
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const closeButton = lightbox.querySelector(".lightbox-close");
const previousButton = lightbox.querySelector(".lightbox-previous");
const nextButton = lightbox.querySelector(".lightbox-next");

let activeIndex = 0;
let lastFocusedElement = null;

if (window.location.protocol === "file:") {
  youtubeFrames.forEach((frame) => {
    frame.removeAttribute("src");
  });
} else {
  youtubeFrames.forEach((frame) => {
    frame.src = frame.dataset.youtubeSrc;
  });
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

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
});

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
