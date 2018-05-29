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
  var speed = spec.speed;
  var previousIndex = getCircleIndex(currentSlide - 1, slideCount);
  var nextIndex = getCircleIndex(currentSlide + 1, slideCount);

  React.Children.forEach(spec.children, (child, index) => {
    const slideClass = child.props.className || "";
    const dist = currentSlide > index ? -slideWidth : (currentSlide < index ? slideWidth : 0);

    //spec.slidePostionList[index] = dist;

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
  //moveSlide(previousIndex, -slideWidth, speed, slides[previousIndex].props.style);
  //moveSlide(nextIndex, slideWidth, speed, slides[nextIndex].props.style);
  
  //spec.slidePostionList[previousIndex] = -slideWidth;
  //spec.slidePostionList[nextIndex] = slideWidth;
  
  return slides;
}

var getSlideStyle = function(spec) {
  var style = {};
  var index = spec.index;
  var slideWidth = spec.slideWidth;
  var currentSlide = spec.currentSlide; 
  var speed = spec.speed;
  var dist = spec.slidePostionList[index];

  style.width = slideWidth;
  
  if (checkBrowser.transitions) {
    style.left = (index * -slideWidth) + 'px';
    // index, dist, speed
    moveSlide(index, dist, speed, style);
  }

  return style;
};

export class Track extends React.Component {   

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