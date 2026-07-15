(function () {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/assets/vendor/glightbox/glightbox.min.css';
  document.head.appendChild(link);

  var s = document.createElement('script');
  s.src = '/assets/vendor/glightbox/glightbox.min.js';
  s.onload = function () {
    GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
      zoomable: false,
      openEffect: 'fade',
      closeEffect: 'fade'
    });
  };
  document.head.appendChild(s);
})();
