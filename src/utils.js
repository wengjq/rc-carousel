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
  //if (spec.useTransform) {
    let WebkitTransform = !spec.vertical
      ? "translate3d(" + spec.left + "px, 0px, 0px)"
      : "translate3d(0px, " + spec.left + "px, 0px)";
    let transform = !spec.vertical
      ? "translate3d(" + spec.left + "px, 0px, 0px)"
      : "translate3d(0px, " + spec.left + "px, 0px)";
    let msTransform = !spec.vertical
      ? "translateX(" + spec.left + "px)"
      : "translateY(" + spec.left + "px)";
    style = {
      ...style,
      WebkitTransform,
      transform,
      msTransform
    };
 // } else {
    
 // }
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
