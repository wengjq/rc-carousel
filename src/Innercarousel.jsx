import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Track } from "./Track";
import {
  getTrackCSS,
  initializedState,
  checkBrowser,
  getCircleIndex,
  moveSlide
} from "./utils";

export default class Innercarousel extends React.Component {
  constructor(props) {
    super(props);
    this.list = null;
    this.track = null;
    
    this.state = {
      currentSlide: this.props.initialSlide,
      slideCount: React.Children.count(this.props.children),
      slidePostionList: [],
      slideWidth: 0,
      listWidth: 0,
      trackWidth: 0
    };
  }

  componentDidMount = () => {
    let spec = { listRef: this.list, trackRef: this.track, ...this.props };
    let updatedState = initializedState(spec);

    spec = { ...spec, ...updatedState, slideIndex: updatedState.currentSlide };
    
    let trackStyle = getTrackCSS(spec);
    
    updatedState["trackStyle"] = trackStyle;

    this.setState(updatedState, this.autoPlay());
  };

  slideHandler = (toIndex, slideSpeed, dontAnimate = false) => {
    let currentIndex = this.state.currentSlide;
    let slideWidth = this.state.slideWidth;
    let speed = this.props.speed || 300;
    let slideCount = this.state.slideCount;

    if (currentIndex === toIndex) return;

    if (checkBrowser.transitions) {
      // 1: backward, -1: forward
      var direction = Math.abs(currentIndex - toIndex) / (currentIndex - toIndex); 
      let naturalDirection = direction;
      console.log(getCircleIndex(toIndex, slideCount));
      direction = -this.state.slidePostionList[getCircleIndex(toIndex, slideCount)] / slideWidth;
      // if going forward but to < index, use to = slides.length + to
      // if going backward but to > index, use to = -slides.length + to
      if (direction !== naturalDirection) toIndex = -direction * this.state.slideCount.length + toIndex;
    }

    let diff = Math.abs(currentIndex - toIndex) - 1;

    // move all the slides between index and to in the right direction
    while (diff--) move( getCircleIndex((toIndex > currentIndex ? toIndex : currentIndex, slideCount) - diff - 1), slideWidth * direction, 0);
      
    toIndex = getCircleIndex(toIndex, slideCount);
    
    moveSlide(currentIndex, slideWidth * direction, slideSpeed || speed, this.props.children[currentIndex].props.style);
    moveSlide(toIndex, 0, slideSpeed || speed, this.props.children[toIndex].props.style);

    // get the next in place
    let nextIndex = getCircleIndex(toIndex - direction, slideCount);
    moveSlide(nextIndex, -(slideWidth * direction), 0, this.props.children[nextIndex].props.style); 

    this.setState({
      currentSlide: toIndex
    });
  };
      
  autoPlay = playType => {
    if (!this.props.autoplay) return;

    if (this.autoplayTimer) {
      clearTimeout(this.autoplayTimer);
    }

    let nextIndex = this.state.currentSlide + 1;

    this.autoplayTimer = setTimeout(this.slideHandler(nextIndex), this.props.autoplaySpeed + 50);
  
/*    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
    }
    const autoplaying = this.state.autoplaying;
    if (playType === "update") {
      if (
        autoplaying === "hovered" ||
        autoplaying === "focused" ||
        autoplaying === "paused"
      ) {
        return;
      }
    } else if (playType === "leave") {
      if (autoplaying === "paused" || autoplaying === "focused") {
        return;
      }
    } else if (playType === "blur") {
      if (autoplaying === "paused" || autoplaying === "hovered") {
        return;
      }
    }
    this.autoplayTimer = setInterval(this.play, this.props.autoplaySpeed + 50);
    this.setState({ autoplaying: "playing" });*/
  };

  pause = pauseType => {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
    /*const autoplaying = this.state.autoplaying;
    if (pauseType === "paused") {
      this.setState({ autoplaying: "paused" });
    } else if (pauseType === "focused") {
      if (autoplaying === "hovered" || autoplaying === "playing") {
        this.setState({ autoplaying: "focused" });
      }
    } else {
      // pauseType  is 'hovered'
      if (autoplaying === "playing") {
        this.setState({ autoplaying: "hovered" });
      }
    }*/
  };

  listRefHandler = ref => (this.list = ref);

  trackRefHandler = ref => (this.track = ref);

	render() {
    let className = classNames("carousel-initialized", this.props.className, {
      "carousel-container": true
    });
    let spec = { ...this.props, ...this.state };

    let trackProps = {
      ...this.props, 
      ...this.state,
      trackStyle: spec["trackStyle"],
      onMouseEnter: null,
      onMouseLeave: null,
      onMouseOver: null
    };

    let listProps = { 
      className: "carousel-list"/*,
      onClick: this.clickHandler,
      onMouseDown: touchMove ? this.swipeStart : null,
      onMouseMove: this.state.dragging && touchMove ? this.swipeMove : null,
      onMouseUp: touchMove ? this.swipeEnd : null,
      onMouseLeave: this.state.dragging && touchMove ? this.swipeEnd : null,
      onTouchStart: touchMove ? this.swipeStart : null,
      onTouchMove: this.state.dragging && touchMove ? this.swipeMove : null,
      onTouchEnd: touchMove ? this.swipeEnd : null,
      onTouchCancel: this.state.dragging && touchMove ? this.swipeEnd : null*/
    };

		return (
			<div className={className}>
        <div ref={this.listRefHandler} {...listProps}>
          <Track ref={this.trackRefHandler} {...trackProps}>
            {this.props.children}
          </Track>
        </div>
      </div>
		)
	}
}