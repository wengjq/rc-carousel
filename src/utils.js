import React from 'react';
import ReactDOM from 'react-dom';

export const getWidth = elem => (elem && elem.offsetWidth) || 0;

export const getCircleIndex = (index, slideCount) => {
  return (slideCount + (index % slideCount)) % slideCount;
};

export const moveSlide = (index, dist, speed, style) => {
  style.WebkitTransitionDuration = `${speed}ms`;
  style.msTransitionDuration = `${speed}ms`;
  style.transitionDuration = `${speed}ms`;

  style.WebkitTransform = `translate3d(${dist}px, 0, 0)`;
  style.msTransform = `translate3d(${dist}px, 0, 0)`;
  style.transform = `translate3d(${dist}px, 0, 0)`;

  return style;
};

export const getTotalSlides = spec =>
  spec.slideCount === 1
    ? 1
    : spec.slideCount;

export const getTrackCSS = spec => {
  let trackWidth;
  let trackHeight;

  trackWidth = getTotalSlides(spec) * spec.slideWidth;

  let style = {
    opacity: 1,
    transition: '',
    WebkitTransition: '',
  };

  const WebkitTransform = `translate3d(${spec.left}px, 0px, 0px)`;
  const transform = `translate3d(${spec.left}px, 0px, 0px)`;
  const msTransform = `translate3d(${spec.left}px, 0px, 0px)`;

  style = {
    ...style,
    WebkitTransform,
    transform,
    msTransform,
  };

  if (trackWidth) style.width = trackWidth;
  if (trackHeight) style.height = trackHeight;

  return style;
};

export const initializedState = spec => {
  let slideCount = React.Children.count(spec.children);
  const listWidth = Math.ceil(getWidth(ReactDOM.findDOMNode(spec.listRef)));
  const trackWidth = Math.ceil(getWidth(ReactDOM.findDOMNode(spec.trackRef)));
  const slideWidth = listWidth;
  const currentSlide = spec.currentSlide === undefined ? spec.initialSlide : spec.currentSlide;
  const previousIndex = getCircleIndex(currentSlide - 1, slideCount);
  const nextIndex = getCircleIndex(currentSlide + 1, slideCount);
  const slidePostionList = [];
  let isSpecialSlideCount = spec.isSpecialSlideCount;

  if (slideCount !== 1) {
    if (slideCount === 2) {
      slideCount = 2 * slideCount;
      isSpecialSlideCount = true;
    }

    for (let i = 0; i < slideCount; i++) {
      const rightSlideWidth = currentSlide < i ? slideWidth : 0;
      const dist = currentSlide > i ? -slideWidth : rightSlideWidth;
      slidePostionList[i] = dist;
    }

    slidePostionList[previousIndex] = -slideWidth;
    slidePostionList[nextIndex] = slideWidth;
  }

  const state = {
    slideCount,
    slideWidth,
    listWidth,
    trackWidth,
    currentSlide,
    slidePostionList,
    isSpecialSlideCount,
  };

  return state;
};

export const swipeStart = (e, spec) => {
  return {
    startTime: +new Date,
    speedTmp: spec.speed,
    speed: 0,
    dragging: true,
    isScrolling: false,
    touchObject: {
      startX: e.touches ? e.touches[0].pageX : e.clientX,
      startY: e.touches ? e.touches[0].pageY : e.clientY,
    },
    slidePostionListTmp: spec.slidePostionList.slice(),
  };
};

export const swipeMove = (e, spec) => {
  const touchMove = {
    endX: e.touches ? e.touches[0].pageX : e.clientX,
    endY: e.touches ? e.touches[0].pageY : e.clientY,
  };

  let state = {};

  const {
    slideCount,
    touchObject,
  } = spec;

  const slidePostionList = spec.slidePostionList;
  const slidePostionListTmp = spec.slidePostionListTmp;

  let isScrolling = spec.isScrolling;
  const currentIndex = spec.currentSlide;
  const lastIndex = getCircleIndex(currentIndex - 1, slideCount);
  const nextIndex = getCircleIndex(currentIndex + 1, slideCount);

  // measure change in x and y
  const delta = {
    x: touchMove.endX - touchObject.startX,
    y: touchMove.endY - touchObject.startY,
  };

  // determine if scrolling test has run
  isScrolling = !!(isScrolling || Math.abs(delta.y) < Math.abs(delta.x));

  const swipeDist = delta.x;

  if (isScrolling) {
    slidePostionList[lastIndex] = swipeDist + slidePostionListTmp[lastIndex];
    slidePostionList[currentIndex] = swipeDist + slidePostionListTmp[currentIndex];
    slidePostionList[nextIndex] = swipeDist + slidePostionListTmp[nextIndex];
  }

  state = {
    ...state,
    touchObject,
    isScrolling,
    delta,
    slidePostionList,
  };

  return state;
};

export const swipeEnd = (e, spec) => {
  let state = {};
  const dragging = spec.dragging;
  const isScrolling = spec.isScrolling;
  const slidePostionList = spec.slidePostionList;

  state = {
    dragging: false,
    touchObject: {},
    speed: spec.speedTmp,
    slidePostionList,
    autoplaying: 'end',
    isScrolling: false,
  };

  if (!dragging || !isScrolling) {
    e.preventDefault();
    return state;
  }
  const delta = spec.delta;

  const duration = (+new Date) - spec.startTime;
  const slideWidth = spec.slideWidth;
  const slideCount = spec.slideCount;
  // determine if slide attempt triggers next/prev slide
  // if slide duration is less than 250ms
  // and if slide amt is greater than 20px
  // or if slide amt is greater than half the width
  const isValidSlide = Number(duration) < 250
                     && Math.abs(delta.x) > 20
                     || Math.abs(delta.x) > slideWidth / 2;

  let currentSlide = spec.currentSlide;
  // determine direction of swipe (true:right, false:left)
  const direction = delta.x < 0;
  const slidePostionListTmp = spec.slidePostionListTmp;
  const lastIndex = getCircleIndex(currentSlide - 1, slideCount);
  const nextIndex = getCircleIndex(currentSlide + 1, slideCount);

  if (isValidSlide) {
    if (direction) {
      slidePostionList[getCircleIndex(currentSlide - 1, slideCount)] = -slideWidth;
      slidePostionList[getCircleIndex(currentSlide + 2, slideCount)] = slideWidth;

      slidePostionList[currentSlide] = slidePostionListTmp[currentSlide] - slideWidth;
      slidePostionList[nextIndex] = slidePostionListTmp[nextIndex] - slideWidth;

      currentSlide = getCircleIndex(currentSlide + 1, slideCount);
    } else {
      slidePostionList[getCircleIndex(currentSlide + 1, slideCount)] = slideWidth;
      slidePostionList[getCircleIndex(currentSlide - 2, slideCount)] = -slideWidth;

      slidePostionList[currentSlide] = slidePostionListTmp[currentSlide] + slideWidth;
      slidePostionList[lastIndex] = slidePostionListTmp[lastIndex] + slideWidth;

      currentSlide = getCircleIndex(currentSlide - 1, slideCount);
    }
  } else {
    slidePostionList[getCircleIndex(currentSlide - 1, slideCount)] = -slideWidth;
    slidePostionList[getCircleIndex(currentSlide, slideCount)] = 0;
    slidePostionList[getCircleIndex(currentSlide + 1, slideCount)] = slideWidth;
  }

  state = {
    ...state,
    speed: spec.speedTmp,
    currentSlide,
    slidePostionList,
    autoplaying: 'end',
    isScrolling: false,
  };

  return state;
};
