// Utility functions
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };
  
  const throttle = (func, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };
  
  // DOM manipulation functions
  const createImageItem = (src, index) => {
    const item = document.createElement('div');
    item.className = 'image-item';
    
    const content = document.createElement('div');
    content.className = 'image-content';
  
    const img = document.createElement('img');
    img.dataset.src = src;
    img.alt = `Gallery Image ${index + 1}`;
    img.className = 'gallery-image';
    
    content.appendChild(img);
    item.appendChild(content);
  
    return item;
  };
  
  const createEnlargedImageContainer = () => {
    const container = document.createElement('div');
    container.className = 'enlarged-image-container';
    container.innerHTML = '<img class="enlarged-image" src="" alt="Enlarged image">';
    return container;
  };
  
  // Image loading and display functions
  const loadImage = (img, errorPlaceholder, onLoad) => {
    const actualImage = new Image();
    actualImage.onload = () => {
      img.src = actualImage.src;
      img.classList.add('loaded');
      onLoad(img.closest('.image-item'));
    };
    actualImage.onerror = () => {
      img.src = errorPlaceholder;
      img.classList.add('error');
      onLoad(img.closest('.image-item'));
    };
    actualImage.src = img.dataset.src;
  };
  
  const resizeGridItem = (item, rowHeight, rowGap) => {
    const content = item.querySelector('.image-content');
    const contentHeight = content.getBoundingClientRect().height;
    const rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = `span ${rowSpan}`;
  };
  
  // API functions
  const fetchImages = async (apiUrl) => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching images:', error);
      return [];
    }
  };
  
  // Main gallery function
  const createImageGallery = (containerId, options = {}) => {
    const container = document.getElementById(containerId);
    const enlargedImageContainer = createEnlargedImageContainer();
    document.body.appendChild(enlargedImageContainer);
  
    const defaultOptions = {
      apiUrl: 'http://localhost:8080/img',
      errorPlaceholder: 'error-placeholder.png',
      lazyLoadOffset: '200px',
      gridRowHeight: 10,
      gridRowGap: 10
    };
  
    const config = { ...defaultOptions, ...options };
  
    let observer;
  
    const closeEnlargedImage = () => {
      enlargedImageContainer.classList.remove('active');
      document.body.style.overflow = '';
    };
  
    enlargedImageContainer.addEventListener('click', closeEnlargedImage);
  
    const initIntersectionObserver = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              loadImage(entry.target, config.errorPlaceholder, (item) => resizeGridItem(item, config.gridRowHeight, config.gridRowGap));
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: config.lazyLoadOffset, threshold: 0.1 }
      );
    };
  
    const showEnlargedImage = (src) => {
      const enlargedImg = enlargedImageContainer.querySelector('.enlarged-image');
      enlargedImg.src = src;
      enlargedImageContainer.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
  
    const handleImageClick = (event) => {
      const img = event.target.closest('img');
      if (img && img.classList.contains('gallery-image')) {
        showEnlargedImage(img.src);
      }
    };
  
    const resizeAllGridItems = () => {
      const allItems = container.getElementsByClassName('image-item');
      for (let i = 0; i < allItems.length; i++) {
        resizeGridItem(allItems[i], config.gridRowHeight, config.gridRowGap);
      }
    };
  
    const displayImages = async () => {
      container.innerHTML = '<p class="loading-message">Loading images...</p>';
      const images = await fetchImages(config.apiUrl);
      
      if (images.length === 0) {
        container.innerHTML = '<p class="error-message">No images found.</p>';
        return;
      }
  
      container.innerHTML = '';
  
      const fragment = document.createDocumentFragment();
      images.forEach((src, index) => {
        const item = createImageItem(src, index);
        fragment.appendChild(item);
        observer.observe(item.querySelector('img'));
      });
  
      container.appendChild(fragment);
      resizeAllGridItems();
    };
  
    const init = () => {
      initIntersectionObserver();
      container.addEventListener('click', handleImageClick);
      window.addEventListener('resize', debounce(resizeAllGridItems, 200));
      displayImages();
    };
  
    return { init };
  };
  
  // Initialize gallery
  document.addEventListener('DOMContentLoaded', () => {
    const gallery = createImageGallery('gallery', {
      apiUrl: 'http://localhost:8080/img',
      errorPlaceholder: 'error-placeholder.png',
      lazyLoadOffset: '200px',
      gridRowHeight: 10,
      gridRowGap: 10
    });
    gallery.init();
  });