'use strict';

import React from 'react';
import { mount } from 'enzyme';
import Carousel from '../';

describe('Carousel', () => {
  it('should render', () => {
    const wrapper = mount(
      <Carousel>
        <div className="carousel-slide">slide1</div>
      </Carousel>
    );

    expect(
      wrapper.containsMatchingElement(
        <div className="carousel-slide carousel-active"
          data-index={0} style={{ outline: 'none', userSelect: 'none', width: '100%' }}
        >
          slide1
        </div>
      )
    ).toBe(true);
  });
});
