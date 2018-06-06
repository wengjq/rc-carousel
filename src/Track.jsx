'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import {
  moveSlide,
  getCircleIndex,
} from './utils';

const getSlideStyle = function getSlideStyle(spec) {
  const style = {};
  const index = spec.index;
  const slideWidth = spec.slideWidth;
  const speed = spec.speed;
  const dist = spec.slidePostionList[index];
  const left = index * -slideWidth;

  style.width = slideWidth;
  style.left = `${left}px`;

  // index, dist, speed
  moveSlide(index, dist, speed, style);

  return style;
};

const renderSlides = function renderSlides(spec) {
  const slides = [];
  const currentSlide = spec.currentSlide;
  const isSpecialSlideCount = spec.isSpecialSlideCount;
  const slideCount = spec.slideCount;
  const nextIndex = getCircleIndex(currentSlide + 1, slideCount);

  React.Children.forEach(spec.children, (child, index) => {
    const slideClass = child.props.className || '';

    const childStyle = getSlideStyle({ ...spec, index, nextIndex });

    slides.push(
      React.cloneElement(child, {
        'data-index': index,
        className: slideClass,
        style: {
          outline: 'none',
          userSelect: 'none',
          ...(child.props.style || {}),
          ...childStyle,
        },
        onClick: e => {
          if (child.props && child.props.onClick) {
            child.props.onClick(e);
          }
        },
      })
    );
  });

  if (isSpecialSlideCount) {
    React.Children.forEach(spec.children, (child, index) => {
      const slideClass = child.props.className || '';

      index = index + 2;

      const childStyle = getSlideStyle({ ...spec, index });

      slides.push(
        React.cloneElement(child, {
          key: index,
          'data-index': index,
          className: slideClass,
          style: {
            outline: 'none',
            userSelect: 'none',
            ...(child.props.style || {}),
            ...childStyle,
          },
          onClick: e => {
            if (child.props && child.props.onClick) {
              child.props.onClick(e);
            }
          },
        })
      );
    });
  }

  return slides;
};

export class Track extends React.Component {
  static propTypes = {
    onMouseEnter: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseLeave: PropTypes.func,
    trackStyle: PropTypes.object,
  };

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
