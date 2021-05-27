// Multiple event listener
function addListenerMulti(element, eventNames, listener) {

  var events = eventNames.split(' ');
  for (var i=0, iLen=events.length; i<iLen; i++) {
    element.addEventListener(events[i], listener, false);
  }

}

addListenerMulti(window, 'click keydown touchstart touchmove', lazyLoad);

// Run after the HTML document has finished loading
function lazyLoad(){
  // Get our lazy-loaded images
  var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

  // Do this only if IntersectionObserver is supported
  if ("IntersectionObserver" in window) {

  // Create new observer object
	  let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
	      // Loop through IntersectionObserverEntry objects
	      entries.forEach(function(entry) {

	        // Do these if the target intersects with the root
	        if (entry.isIntersecting) {

	          let lazyImage = entry.target;
	          lazyImage.src = lazyImage.dataset.src;
	          lazyImage.classList.remove("lazy");
	          lazyImageObserver.unobserve(lazyImage);
	        }

	        else{
	        	
	        	 let lazyImage = entry.target;
	          lazyImage.src = lazyImage.dataset.src;
	          lazyImage.classList.remove("lazy");
	          lazyImageObserver.unobserve(lazyImage);
	        }
	      });
	  });

      // Loop through and observe each image
	  lazyImages.forEach(function(lazyImage) {
	    lazyImageObserver.observe(lazyImage);
	  });
	}
}