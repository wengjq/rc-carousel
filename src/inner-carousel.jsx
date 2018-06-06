import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Track } from './track';
import {
  getTrackCSS,
  initializedState,
  getCircleIndex,
  swipeStart,
  swipeMove,
  swipeEnd,
} from './utils';
import { Dots } from './dots';
import { PrevArrow, NextArrow } from './arrows';

export default class InnerCarousel extends React.Component {
  static propTypes = {
    initialSlide: PropTypes.number,
    autoplay: PropTypes.bool,
    autoplaySpeed: PropTypes.number,
    dots: PropTypes.bool,
    arrows: PropTypes.bool,
    pauseOnHover: PropTypes.bool,
    unslick: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.list = null;
    this.track = null;

    this.state = {
      currentSlide: this.props.initialSlide,
      slideCount: React.Children.count(this.props.children),
      trackStyle: {},
      slidePostionList: [],
      slideWidth: 0,
      listWidth: 0,
      trackWidth: 0,
      dragging: false,
      autoplaying: null,
      isSpecialSlideCount: false,
    };

    this.debouncedResize = null;
  }

  componentDidMount = () => {
    const spec = {
      listRef: this.list,
      trackRef: this.track,
      ...this.props,
      ...this.state,
    };

    this.updateState(spec, () => {
      if (this.props.autoplay) {
        this.autoPlay('update');
      }
    });

    if (window.addEventListener) {
      window.addEventListener('resize', this.onWindowResized);
    } else {
      window.attachEvent('onresize', this.onWindowResized);
    }
  };

  componentWillUnmount = () => {
    if (window.addEventListener) {
      window.removeEventListener('resize', this.onWindowResized);
    } else {
      window.detachEvent('onresize', this.onWindowResized);
    }
  };

  onTrackOver = () => this.props.autoplay && this.pause('hovered');

  onTrackLeave = () => this.props.autoplay
                    && this.state.autoplaying === 'hovered'
                    && this.autoPlay('leave');

  onWindowResized = () => {
    if (this.debouncedResize) this.debouncedResize.cancel();
    this.debouncedResize = debounce(() => this.resizeWindow(), 50);
    this.debouncedResize();
  };

  autoPlay = playType => {
    if (!this.props.autoplay) return;

    if (this.autoplayTimer) {
      clearTimeout(this.autoplayTimer);
    }

    const autoplaying = this.state.autoplaying;

    if (playType === 'update') {
      if (
        autoplaying === 'hovered' ||
        autoplaying === 'paused'
      ) {
        return;
      }
    } else if (playType === 'leave') {
      if (autoplaying === 'paused') {
        return;
      }
    }

    const nextIndex = this.state.currentSlide + 1;

    this.autoplayTimer = setTimeout(() => {
      this.slideHandler(nextIndex);
    }, this.props.autoplaySpeed + 50);

    this.setState({ autoplaying: 'playing' });
  };

  clickHandler = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  pause = pauseType => {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
    const autoplaying = this.state.autoplaying;

    if (pauseType === 'paused') {
      this.setState({ autoplaying: 'paused' });
    } else {
      if (autoplaying === 'playing') {
        this.setState({ autoplaying: 'hovered' });
      }
    }
  };

  transitionEnd = () => {
    const autoplaying = this.state.autoplaying;

    if (autoplaying !== 'end') return;

    if (this.props.autoplay) {
      this.autoPlay('update');
    }
  }

  slideHandler = (toIndex) => {
    const currentIndex = this.state.currentSlide;
    const slideWidth = this.state.slideWidth;
    const slideCount = this.state.slideCount;
    const dragging = this.state.dragging;

    if (dragging) return;

    if (currentIndex === toIndex) return;

    // 1: backward, -1: forward
    let direction = Math.abs(currentIndex - toIndex) / (currentIndex - toIndex);
    const naturalDirection = direction;

    direction = -this.state.slidePostionList[getCircleIndex(toIndex, slideCount)] / slideWidth;

    if (isNaN(direction)) return;
    // if going forward but to < index, use to = slides.length + to
    // if going backward but to > index, use to = -slides.length + to
    if (direction !== naturalDirection) toIndex = -direction * slideCount + toIndex;

    let diff = Math.abs(currentIndex - toIndex) - 1;

    // move all the slides between index and to in the right direction
    while (diff--) {
      this.state.slidePostionList[getCircleIndex(
      toIndex > currentIndex ? toIndex : currentIndex, slideCount
      )] = slideWidth * direction;
    }

    toIndex = getCircleIndex(toIndex, slideCount);

    this.state.slidePostionList[currentIndex] = slideWidth * direction;
    this.state.slidePostionList[toIndex] = 0;
    // get the next in place
    const nextIndex = getCircleIndex(toIndex - direction, slideCount);

    this.state.slidePostionList[nextIndex] = -(slideWidth * direction);

    this.setState({
      currentSlide: toIndex,
      autoplaying: 'end',
    });
  };

  updateState = (spec, callback) => {
    const updatedState = initializedState(spec);
    spec = { ...spec, ...updatedState, slideIndex: updatedState.currentSlide };

    const trackStyle = getTrackCSS(spec);

    updatedState.trackStyle = trackStyle;

    this.setState(updatedState, callback);
  };

  swipeStart = e => {
    const state = swipeStart(e, {
      ...this.props,
      ...this.state,
    });

    this.setState(state);
  };

  swipeMove = e => {
    const state = swipeMove(e, {
      ...this.props,
      ...this.state,
      trackRef: this.track,
      listRef: this.list,
      slideIndex: this.state.currentSlide,
    });

    if (!state) return;

    this.setState(state);
  };

  swipeEnd = e => {
    const state = swipeEnd(e, {
      ...this.props,
      ...this.state,
      trackRef: this.track,
      listRef: this.list,
      slideIndex: this.state.currentSlide,
    });

    if (!state) return;

    this.setState(state);
  };

  resizeWindow = () => {
    if (!ReactDOM.findDOMNode(this.track)) return;
    const spec = {
      listRef: this.list,
      trackRef: this.track,
      ...this.props,
      ...this.state,
    };
    this.updateState(spec);
  };

  listRefHandler = ref => (this.list = ref);

  trackRefHandler = ref => (this.track = ref);

  render() {
    const className = classNames('carousel-initialized', this.props.className, {
      'carousel-container': true,
    });
    const { pauseOnHover } = this.props;

    const spec = { ...this.props, ...this.state };

    const trackProps = {
      ...this.props,
      ...this.state,
      trackStyle: spec.trackStyle,
      onMouseEnter: pauseOnHover ? this.onTrackOver : null,
      onMouseLeave: pauseOnHover ? this.onTrackLeave : null,
      onMouseOver: pauseOnHover ? this.onTrackOver : null,
    };

    let dots;

    if (this.props.dots) {
      const dotProps = {
        ...this.props,
        ...this.state,
        clickHandler: this.slideHandler,
      };

      dots = <Dots {...dotProps} />;
    }

    let prevArrow;
    let nextArrow;

    const arrowProps = {
      ...this.props,
      ...this.state,
      clickHandler: this.slideHandler,
    };

    if (this.props.arrows) {
      prevArrow = <PrevArrow {...arrowProps} />;
      nextArrow = <NextArrow {...arrowProps} />;
    }

    const listProps = {
      className: 'carousel-list',
      onClick: this.clickHandler,
      onTransitionEnd: this.transitionEnd,
      onTouchStart: this.swipeStart,
      onTouchMove: this.state.dragging ? this.swipeMove : null,
      onTouchEnd: this.swipeEnd,
      onTouchCancel: this.state.dragging ? this.swipeEnd : null,
      onMouseDown: this.swipeStart,
      onMouseMove: this.state.dragging ? this.swipeMove : null,
      onMouseUp: this.swipeEnd,
      onMouseLeave: this.state.dragging ? this.swipeEnd : null,
    };

    return (
      <div className={className}>
        {!this.props.unslick ? prevArrow : ''}
        <div ref={this.listRefHandler} {...listProps}>
          <Track ref={this.trackRefHandler} {...trackProps} >
            {this.props.children}
          </Track>
        </div>
        {!this.props.unslick ? nextArrow : ''}
        {!this.props.unslick ? dots : ''}
      </div>
    );
  }
}
