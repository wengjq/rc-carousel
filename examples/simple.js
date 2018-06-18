import React from 'react';
import ReactDOM from 'react-dom';
import Carousel from 'rc-carousel';
import 'rc-carousel/assets/index.less';

class SimpleDemo extends React.Component {
  render() {
    const settings = {
      speed: 500,
      autoplay: false,
      dots: true,
      arrows: true,
      initialSlide: 0,
    };

    return (
      <Carousel {...settings}>
        <div className="carousel-slide" >
          <h3>1</h3>
        </div>
        <div className="carousel-slide" >
          <h3>2</h3>
        </div>
        <div className="carousel-slide" >
          <h3>3</h3>
        </div>
      </Carousel>
    );
  }
}

ReactDOM.render(<SimpleDemo />, document.getElementById('__react-content'));
