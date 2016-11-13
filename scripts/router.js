'use strict';

(function() {
  var siteNav = document.querySelector('.site-navigation');
  var sitelinks = document.querySelectorAll('.site-navigation a');
  var currentView = document.querySelector('main');
  var loadingBar = document.querySelector('.loading-bar');
  var activeLink = siteNav.querySelector('.active');
  var pageLoadingTimeout;

  var setActivePageLink = function() {
    var path = window.location.pathname;
    var link = document.querySelector('a.page-link[href="'+path+'"]');
    link.classList.add('active');
    activeLink.classList.remove('active');
    activeLink = link;
  };

  var onPopstateChange = function() {
    var path = window.location.pathname;
    renderNewPage(path);
  }

  var setUrl = function(url) {
    history.pushState(null, null , url);
  };

  var showLoading = function() {
    loadingBar.classList.remove('hide');
    loadingBar.classList.add('animate');
  };

  var hideLoading = function() {
    var onTransitionEnd = function() {
      loadingBar.classList.remove('animate', 'hide');
      loadingBar.removeEventListener('transitionend', onTransitionEnd);
    };

    loadingBar.addEventListener('transitionend', onTransitionEnd)
    loadingBar.classList.add('hide');
  };

  var slugify = function(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  var setPageClass = function() {
    currentView.className = '';
    currentView.classList.add(slugify(activeLink.innerHTML));
  };

  var renderNewPage = function(url) {
    var view = new DocumentFragment();
    var xhr = new XMLHttpRequest();
    var loadingShow = false;

    // show a loading animation if it takes too long
    pageLoadingTimeout = setTimeout(function() {
      showLoading();
      loadingShow = true;
    }, 500);

    xhr.onload = function(evt) {
      var newDocument = evt.target.response;

      var newView = newDocument.querySelector('main');

      currentView.innerHTML = '';

      // We need to not add in the main element
      // so loop through all childs and add them
      // to view.
      while (newView.firstChild) {
         view.appendChild(newView.firstChild);
      }

      // Add the view to the page.
      setActivePageLink(url);
      setPageClass();
      document.title = activeLink.innerHTML;
      currentView.appendChild(view);

      // Clear loading timer
      clearTimeout(pageLoadingTimeout);

      if (loadingShow) {
        hideLoading();
        loadingShow = false;
      }
    };

    xhr.onerror = function(evt) {
      clearTimeout(pageLoadingTimeout);
      if (loadingShow) {
        hideLoading();
        loadingShow = false;
      }
    };

    xhr.responseType = 'document';
    xhr.open('GET', url);
    xhr.send();
  };

  var handleNavLink = function(event) {
    if (event.target.classList.contains('page-link')) {
      event.preventDefault();

      if (event.target === activeLink) {
        return;
      }

      var link = event.target;
      var route = link.href;

      setUrl(route);
      renderNewPage(route);

    }
  };

  siteNav.addEventListener('click', handleNavLink);
  window.addEventListener('popstate', onPopstateChange);
})();
