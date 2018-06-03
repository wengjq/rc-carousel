"use strict";

import React from "react";
import classnames from "classnames";
import {
  getCircleIndex
} from "./utils";

var getDotCount = function(spec) {
  var slideCount = spec.slideCount;
  var isSpecialSlideCount = spec.isSpecialSlideCount;

  if (isSpecialSlideCount) {
    slideCount = 2;
  }

  return slideCount;
};

var getShowCondition = function(spec, index) {
  var currentSlide = spec.currentSlide;
  var isSpecialSlideCount = spec.isSpecialSlideCount;
  
  if (isSpecialSlideCount && currentSlide > 1) {
    return currentSlide === index + 2;
  }

  return currentSlide === index;
};

export class Dots extends React.PureComponent {
  clickHandler(toIndex, e) {
    // In Autoplay the focus stays on clicked button even after transition
    // to next slide. That only goes away by click somewhere outside
    e.preventDefault();

    this.props.clickHandler(toIndex);
  }
  render() {
    var dotCount = getDotCount(this.props);
    var slideCount = this.props.slideCount;

    var dots = Array.apply(
      null,
      Array(dotCount + 1)
        .join("0")
        .split("")
    ).map((x, i) => {
      var className = classnames({
        "carousel-active": getShowCondition(this.props, i)
      });
      
      var onClick = this.clickHandler.bind(this, i);
      return (
        <li key={i} className={className}>
          {React.cloneElement(this.props.customPaging(i), { onClick })}
        </li>
      );
    });

    return React.cloneElement(this.props.appendDots(dots), {
      className: this.props.dotsClass
    });
  }
}
