'use strict';

import React from 'react';
import classnames from 'classnames';

export class PrevArrow extends React.PureComponent {
  clickHandler(toIndex, e) {
    if (e) {
      e.preventDefault();
    }
    this.props.clickHandler(toIndex, e);
  }
  render() {
    const prevClasses = { 'carousel-arrow': true, 'carousel-prev': true };
    const prevHandler = this.clickHandler.bind(this, this.props.currentSlide - 1);

    const prevArrowProps = {
      key: '0',
      'data-role': 'none',
      className: classnames(prevClasses),
      style: { display: 'block' },
      onClick: prevHandler,
    };
    const customProps = {
      currentSlide: this.props.currentSlide,
      slideCount: this.props.slideCount,
    };
    let prevArrow;

    if (this.props.prevArrow) {
      prevArrow = React.cloneElement(this.props.prevArrow, {
        ...prevArrowProps,
        ...customProps,
      });
    } else {
      prevArrow = (
        <button key="0" type="button" {...prevArrowProps}>
          {" "}
          Previous
        </button>
      );
    }

    return prevArrow;
  }
}

export class NextArrow extends React.PureComponent {
  clickHandler(toIndex, e) {
    if (e) {
      e.preventDefault();
    }
    this.props.clickHandler(toIndex, e);
  }
  render() {
    const nextClasses = { 'carousel-arrow': true, 'carousel-next': true };
    const nextHandler = this.clickHandler.bind(this, this.props.currentSlide + 1);

    const nextArrowProps = {
      key: '1',
      'data-role': 'none',
      className: classnames(nextClasses),
      style: { display: 'block' },
      onClick: nextHandler,
    };
    const customProps = {
      currentSlide: this.props.currentSlide,
      slideCount: this.props.slideCount,
    };
    let nextArrow;

    if (this.props.nextArrow) {
      nextArrow = React.cloneElement(this.props.nextArrow, {
        ...nextArrowProps,
        ...customProps,
      });
    } else {
      nextArrow = (
        <button key="1" type="button" {...nextArrowProps}>
          {" "}
          Next
        </button>
      );
    }

    return nextArrow;
  }
}
