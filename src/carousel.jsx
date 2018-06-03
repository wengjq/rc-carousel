import React from 'react';
import PropTypes from 'prop-types';
import InnerCarousel from "./inner-carousel";

export default class Carousel extends React.Component {
  static propTypes = {
    initialSlide: PropTypes.number,
    autoplay: PropTypes.bool,
    autoplaySpeed: PropTypes.number,
    speed: PropTypes.number,
    appendDots: PropTypes.func,
    dots: PropTypes.bool,
    dotsClass: PropTypes.string,
    customPaging: PropTypes.func,
    arrows: PropTypes.bool,
    nextArrow: PropTypes.string,
    prevArrow: PropTypes.string,
    pauseOnHover: PropTypes.bool,
    unslick: PropTypes.bool,
  };
  
  static defaultProps = {
    initialSlide: 0,  // initialize the position of the carousel
    autoplay: false,  // automatic carousel
    autoplaySpeed: 3000, // automatic carousel interval
    speed: 300, // animation speed
    appendDots: dots => <ul style={{display: 'block'}}>{dots}</ul>, // customize dot node
    dots: true, // open dots switch
    dotsClass: 'carousel-dots', // customize dot class
    customPaging: i => <button>{i + 1}</button>, // customize the children of each dot
    arrows: true, // open arrows switch
    nextArrow: null, // customize the node of nextArrow  
    prevArrow: null, // customize the node of prevArrow  
    pauseOnHover: false, // hover carousel pause
    unslick: false, // remove dots and arrows
  };

  render() {
    let children = React.Children.toArray( this.props.children );

    children = children.filter(child => {
      if (typeof child === 'string') {
        return !!child.trim();
      }
      return !!child;
    });

    let settings;

    settings = { ...this.defaultProps, ...this.props };

    return (
      <InnerCarousel {...settings}>
        {children}
      </InnerCarousel>
    );
  }

}

