"use strict";

import React from "react";
import classNames from "classnames";
import {
  checkBrowser,
  moveSlide,
  getCircleIndex
} from "./utils";

var renderSlides = function(spec) {
  var slides = [];
  var childrenCount = React.Children.count(spec.children);
  var currentSlide = spec.currentSlide; 
  var slideWidth = spec.slideWidth;
  var slideCount = spec.slideCount;
  var previousIndex = getCircleIndex(currentSlide - 1, slideCount);
  var nextIndex = getCircleIndex(currentSlide + 1, slideCount);

  React.Children.forEach(spec.children, (child, index) => {
    const slideClass = child.props.className || "";
    var childStyle = getSlideStyle({ ...spec, index });
    slides.push(
      React.cloneElement(child, {
        "data-index": index,
        className: slideClass,
        style: { outline: "none", ...(child.props.style || {}), ...childStyle },
        onClick: e => {
          child.props && child.props.onClick && child.props.onClick(e);
        }
      })
    );
  });
  
  // reposition elements before and after current index
  moveSlide(previousIndex, -slideWidth, 0, slides[previousIndex].props.style);
  moveSlide(nextIndex, slideWidth, 0, slides[nextIndex].props.style);
  spec.slidePostionList[previousIndex] = -slideWidth;
  spec.slidePostionList[nextIndex] = slideWidth;

  return slides;
}

var getSlideStyle = function(spec) {
  var style = {};
  var index = spec.index;
  var slideWidth = spec.slideWidth;
  var currentSlide = spec.currentSlide; 
  var dist = currentSlide > index ? -slideWidth : (currentSlide < index ? slideWidth : 0);
  style.width = slideWidth;
  
  if (checkBrowser.transitions) {
    style.left = (index * -slideWidth) + 'px';
    // index, dist, speed
    moveSlide(index, dist, 0, style);
    spec.slidePostionList[index] = dist;
  }

  return style;
};

export class Track extends React.PureComponent {
  render() {
    const slides = renderSlides(this.props);
    const { onMouseEnter, onMouseOver, onMouseLeave } = this.props;
    const mouseEvents = { onMouseEnter, onMouseOver, onMouseLeave };

    return (
      <div
        className="carousel-track"
        style={this.props.trackStyle}
        {...mouseEvents}
      >
        {slides}
      </div>
    );
  }
}