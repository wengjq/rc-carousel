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
  let previousIndex = getCircleIndex(currentSlide - 1, slideCount);
  let nextIndex = getCircleIndex(currentSlide + 1, slideCount);
  let slidePostionList = [];

  for (let i = 0; i < slideCount; i++) {
    let dist = currentSlide > i ? -slideWidth : (currentSlide < i ? slideWidth : 0);
    slidePostionList[i] = dist;
  }

  slidePostionList[previousIndex] = -slideWidth;
  slidePostionList[nextIndex] = slideWidth;

  let state = {
    slideCount,
    slideWidth,
    listWidth,
    trackWidth,
    currentSlide,
    slidePostionList
  };

  return state;
};

export const swipeStart = (e, spec) => {

  return {
    startTime: +new Date,
    dragging: true,
    isScrolling: false,
    touchObject: {
      startX: e.touches ? e.touches[0].pageX : e.clientX,
      startY: e.touches ? e.touches[0].pageY : e.clientY
    },
    slidePostionListTmp: spec.slidePostionList.slice()
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
    /*moveSlide(lastIndex, delta.x + slidePostionList[lastIndex], speed, spec.children[lastIndex].props.style);
    moveSlide(currentIndex, delta.x + slidePostionList[currentIndex], speed, spec.children[currentIndex].props.style);
    moveSlide(nextIndex, delta.x + slidePostionList[nextIndex], speed, spec.children[nextIndex].props.style);*/
    slidePostionList[lastIndex] = delta.x + slidePostionList[lastIndex];
    slidePostionList[currentIndex] = delta.x + slidePostionList[currentIndex];
    slidePostionList[nextIndex] = delta.x + slidePostionList[nextIndex];
  }

  state = {
    ...state,
    touchObject,
    isScrolling,
    delta,
    slidePostionList
  };

  return state;
};

export const swipeEnd = (e, spec) => {
  let state = {};
  let delta = spec.delta;
  let duration = +new Date - spec.startTime;
  let slideWidth = spec.slideWidth;
  let slideCount = spec.slideCount;
  // determine if slide attempt triggers next/prev slide
  let isValidSlide = Number(duration) < 250   // if slide duration is less than 250ms
                  && Math.abs(delta.x) > 20                 // and if slide amt is greater than 20px
                  || Math.abs(delta.x) > slideWidth / 2;         // or if slide amt is greater than half the width

  // determine direction of swipe (true:right, false:left)
  let direction = delta.x < 0;
  let isScrolling = spec.isScrolling;

  let currentSlide = spec.currentSlide;
  let slidePostionList = spec.slidePostionList;
  let slidePostionListTmp = spec.slidePostionListTmp;
  
  if (isValidSlide) {
    if (direction) {
        slidePostionList[getCircleIndex(currentSlide - 1, slideCount)] = -slideWidth;
        slidePostionList[getCircleIndex(currentSlide + 2, slideCount)] = slideWidth;

        slidePostionList[currentSlide] = slidePostionListTmp[currentSlide] - slideWidth;
        slidePostionList[getCircleIndex(currentSlide + 1, slideCount)] = slidePostionListTmp[getCircleIndex(currentSlide + 1, slideCount)] - slideWidth;
          
        currentSlide = getCircleIndex(currentSlide + 1, slideCount);
    } else {
      slidePostionList[getCircleIndex(currentSlide + 1, slideCount)] = slideWidth;
      slidePostionList[getCircleIndex(currentSlide - 2, slideCount)] = -slideWidth;

      slidePostionList[currentSlide] = slidePostionListTmp[currentSlide] + slideWidth;
      slidePostionList[getCircleIndex(currentSlide - 1, slideCount)] = slidePostionListTmp[getCircleIndex(currentSlide - 1, slideCount)] + slideWidth;

      currentSlide = getCircleIndex(currentSlide - 1, slideCount);
    }
  } else {
    slidePostionList[getCircleIndex(currentSlide - 1, slideCount)] = -slideWidth;
    slidePostionList[getCircleIndex(currentSlide, slideCount)] = 0;
    slidePostionList[getCircleIndex(currentSlide + 1, slideCount)] = slideWidth;
  }
  state = {
    ...state,
    currentSlide,
    slidePostionList
  };

  return state;
};