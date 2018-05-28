import React from "react";
import ReactDOM from "react-dom";

export const getWidth = elem => (elem && elem.offsetWidth) || 0;

export const checkBrowser = {
	touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
	transitions: (function(c) {
	  var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
	  for ( var i in props ) if (c.style[ props[i] ] !== undefined) return true;
	  return false;
	})(document.createElement('carousel'))
};

export const getCircleIndex = (index, slideCount) => (slideCount + (index % slideCount)) % slideCount;

export const moveSlide = (index, dist, speed, style) => {
	style.WebkitTransitionDuration = speed + 'ms';
	style.msTransitionDuration = speed + 'ms';
	style.transitionDuration = speed + 'ms';

	style.WebkitTransform = 'translate3d(' + dist + 'px, 0, 0)';
	style.msTransform = 'translateX(' + dist + 'px)';
	style.transform = 'translate3d(' + dist + 'px, 0, 0)';

	return style;
}

export const getTotalSlides = spec =>
  spec.slideCount === 1
    ? 1
    : spec.slideCount;

export const getTrackCSS = spec => {
  let trackWidth, trackHeight;
  
  trackWidth = getTotalSlides(spec) * spec.slideWidth;
  
  let style = {
    opacity: 1,
    transition: "",
    WebkitTransition: ""
  };

  let WebkitTransform = "translate3d(" + spec.left + "px, 0px, 0px)";
  let transform = "translate3d(" + spec.left + "px, 0px, 0px)";
  let msTransform ="translateX(" + spec.left + "px)";

  style = {
    ...style,
    WebkitTransform,
    transform,
    msTransform
  };

  if (spec.fade) style = { opacity: 1 };
  if (trackWidth) style.width = trackWidth;
  if (trackHeight) style.height = trackHeight;

  return style;
};

export const initializedState = spec => {
  let slideCount = React.Children.count(spec.children);
  let listWidth = Math.ceil(getWidth(ReactDOM.findDOMNode(spec.listRef)));
  let trackWidth = Math.ceil(getWidth(ReactDOM.findDOMNode(spec.trackRef)));
  let slideWidth = listWidth;
  let currentSlide = spec.currentSlide === undefined ? spec.initialSlide : spec.currentSlide;

  let state = {
    slideCount,
    slideWidth,
    listWidth,
    trackWidth,
    currentSlide
  };

  return state;
};

export const swipeStart = (e) => {
  return {
    dragging: true,
    isScrolling: false,
    touchObject: {
      startX: e.touches ? e.touches[0].pageX : e.clientX,
      startY: e.touches ? e.touches[0].pageY : e.clientY
    }
  };
};

export const swipeMove = (e, spec) => {
  if (e.touches.length > 1 || e.scale && e.scale !== 1) return;

  let touches = e.touches[0];
  let state = {};

  const {
    slideCount,
    touchObject,
    speed
  } = spec;

  let slidePostionList = spec.slidePostionList;
  let isScrolling = spec.isScrolling;
  let currentIndex = spec.currentSlide;
  let lastIndex = getCircleIndex(currentIndex - 1, slideCount);
  let nextIndex = getCircleIndex(currentIndex + 1, slideCount);

  // measure change in x and y
  let delta = {
    x: touches.pageX - touchObject.startX,
    y: touches.pageY - touchObject.startY
  }
  // determine if scrolling test has run
  if (typeof isScrolling == 'undefined') {
    isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
  }

  if (!isScrolling) {
    //e.preventDefault();
    moveSlide(lastIndex, delta.x + slidePostionList[lastIndex], speed, spec.children[lastIndex].props.style);
    moveSlide(currentIndex, delta.x + slidePostionList[currentIndex], speed, spec.children[currentIndex].props.style);
    moveSlide(nextIndex, delta.x + slidePostionList[nextIndex], speed, spec.children[nextIndex].props.style);
  }

  slidePostionList[lastIndex] = delta.x + slidePostionList[lastIndex];
  slidePostionList[currentIndex] = delta.x + slidePostionList[currentIndex];
  slidePostionList[nextIndex] = delta.x + slidePostionList[nextIndex];
 
  state = {
    ...state,
    touchObject,
    slidePostionList
  };

  return state;
};