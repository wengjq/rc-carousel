import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Innercarousel from "./Innercarousel";

export default class Carouseleffect extends React.Component {
  static defaultProps = {
    autoplay: true,
    autoplaySpeed: 3000,
    initialSlide: 0, 
    speed: 300
  };

	render() {
		let children = React.Children.toArray(this.props.children);

    children = children.filter(child => {
      if (typeof child === "string") {
        return !!child.trim();
      }
      return !!child;
    });

    var settings;

    settings = { ...this.defaultProps, ...this.props };

		return (
			<Innercarousel {...settings}>
        {children}
      </Innercarousel>
		);
	}
}