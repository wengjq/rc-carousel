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
  var isSpecialSlideCount = spec.isSpecialSlideCount;
  var slideWidth = spec.slideWidth;
  var slideCount = spec.slideCount;
  var speed = spec.speed;
  var nextIndex = getCircleIndex(currentSlide + 1, slideCount);

  React.Children.forEach(spec.children, (child, index) => {
    const slideClass = child.props.className || "";

    var childStyle = getSlideStyle({ ...spec, index, nextIndex });

    slides.push(
      React.cloneElement(child, {
        "data-index": index,
        className: slideClass,
        style: { outline: "none", userSelect: "none", ...(child.props.style || {}), ...childStyle },
        onClick: e => {
          child.props && child.props.onClick && child.props.onClick(e);
        }
      })
    );
  });
  
  if (isSpecialSlideCount) {
    React.Children.forEach(spec.children, (child, index) => {
      const slideClass = child.props.className || "";

      index = index + 2;

      var childStyle = getSlideStyle({ ...spec, index });

      slides.push(
        React.cloneElement(child, {
          key: index,
          "data-index": index,
          className: slideClass,
          style: { outline: "none", userSelect: "none", ...(child.props.style || {}), ...childStyle },
          onClick: e => {
            child.props && child.props.onClick && child.props.onClick(e);
          }
        })
      );
    });
  }

  return slides;
}

var getSlideStyle = function(spec) {
  var style = {};
  var index = spec.index;
  var slideWidth = spec.slideWidth;
  var currentSlide = spec.currentSlide; 
  var speed = spec.speed;
  var dist = spec.slidePostionList[index];
  var slideCount = spec.slideCount;

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