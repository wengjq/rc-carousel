import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import { mount } from 'enzyme';
import InnerCarousel from '../src/inner-carousel';

describe('InnerCarousel', () => {
  const settings = {
    initialSlide: 0,
    speed: 0,
    dots: true,
    arrows: true,
    autoplay: false,
    appendDots: dots => <ul style={{ display: 'block' }}>{dots}</ul>,
    dotsClass: 'carousel-dots',
    customPaging: i => <button>{i + 1}</button>,
    nextArrow: null,
    prevArrow: null,
    pauseOnHover: false,
    unslick: false,
  };

  it('should render', () => {
    const { initialSlide } = settings;

    const wrapper = mount(
      <InnerCarousel {...settings}>
        <div className="carousel-slide">
          <h3>1</h3>
        </div>
        <div className="carousel-slide">
          <h3>2</h3>
        </div>
        <div className="carousel-slide">
          <h3>3</h3>
        </div>
      </InnerCarousel>
    );

    const expectedSlideIndex = initialSlide || 0;
    let activeSlide = wrapper.find('.carousel-slide.carousel-active');
    const prevBtn = wrapper.find('.carousel-arrow.carousel-prev');
    const nextBtn = wrapper.find('.carousel-arrow.carousel-next');
    const slidesDom = wrapper.find('.carousel-slide');

    expect(slidesDom.length).toEqual(3);
    expect(+activeSlide.prop('data-index')).toEqual(expectedSlideIndex);
    expect(wrapper.state('currentSlide')).toEqual(expectedSlideIndex);

    nextBtn.simulate('click');
    wrapper.setState({ currentSlide: expectedSlideIndex + 1 });

    activeSlide = wrapper.find('.carousel-slide.carousel-active');
    expect(+activeSlide.prop('data-index')).toEqual(expectedSlideIndex + 1);
    expect(wrapper.state('currentSlide')).toEqual(expectedSlideIndex + 1);

    prevBtn.simulate('click');
    wrapper.setState({ currentSlide: expectedSlideIndex });

    activeSlide = wrapper.find('.carousel-slide.carousel-active');
    expect(+activeSlide.prop('data-index')).toEqual(expectedSlideIndex);
    expect(wrapper.state('currentSlide')).toEqual(expectedSlideIndex);
  });
});
