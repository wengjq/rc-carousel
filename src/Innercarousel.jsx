import React from 'react';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import debounce from "lodash.debounce";
import { Track } from "./Track";
import {
  getTrackCSS,
  initializedState,
  checkBrowser,
  getCircleIndex,
  moveSlide,
  swipeStart,
  swipeMove
} from "./utils";

export default class Innercarousel extends React.Component {
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
      dragging: false
    };

    this.debouncedResize = null;
  }

  slidePostionListChange = (slidePostionList) => {
    this.setState({slidePostionList}, this.autoPlay());
  }

  onWindowResized = () => {
    if (this.debouncedResize) this.debouncedResize.cancel();
    this.debouncedResize = debounce(() => this.resizeWindow(), 50);
    this.debouncedResize();
  };

  resizeWindow = () => {
    if (!ReactDOM.findDOMNode(this.track)) return;
    let spec = {
      listRef: this.list,
      trackRef: this.track,
      ...this.props,
      ...this.state
    };
    this.updateState(spec);
  };

  swipeStart = e => {
    let state = swipeStart(e, this.props.swipe);
    //state !== "" && this.setState(state);
  };

  swipeMove = e => {
    let state = swipeMove(e, {
      ...this.props,
      ...this.state,
      trackRef: this.track,
      listRef: this.list,
      slideIndex: this.state.currentSlide
    });

    if (!state) return;
    //if (state["swiping"]) {
    //  this.clickable = false;
    //}
    this.setState(state);
  };

  componentDidMount = () => {
    let spec = { 
      listRef: this.list, 
      trackRef: this.track, 
      ...this.props,
      ...this.state
    };

    this.updateState(spec)

    if (window.addEventListener) {
      window.addEventListener("resize", this.onWindowResized);
    } else {
      window.attachEvent("onresize", this.onWindowResized);
    }
  };

  updateState = (spec, callback) => {
    let updatedState = initializedState(spec);
    spec = { ...spec, ...updatedState, slideIndex: updatedState.currentSlide };

    let trackStyle = getTrackCSS(spec);

    updatedState["trackStyle"] = trackStyle;

    this.setState(updatedState, callback);
  };

  slideHandler = (toIndex, slideSpeed, dontAnimate = false) => {
    let currentIndex = this.state.currentSlide;
    let slideWidth = this.state.slideWidth;
    let speed = this.props.speed || 300;
    let slideCount = this.state.slideCount;

    if (currentIndex === toIndex) return;

    if (checkBrowser.transitions) {
      // 1: backward, -1: forward
      return
      var direction = Math.abs(currentIndex - toIndex) / (currentIndex - toIndex); 
      let naturalDirection = direction;
      
      if (!this.state.slidePostionList.some(item => item)) {
        return;
      }
      direction = -this.state.slidePostionList[getCircleIndex(toIndex, slideCount)] / slideWidth;
      if (isNaN(direction)) return;
      // if going forward but to < index, use to = slides.length + to
      // if going backward but to > index, use to = -slides.length + to
      if (direction !== naturalDirection) toIndex = -direction * this.state.slideCount.length + toIndex;
    }

    let diff = Math.abs(currentIndex - toIndex) - 1;

    // move all the slides between index and to in the right direction
    while (diff--) move(getCircleIndex((toIndex > currentIndex ? toIndex : currentIndex, slideCount) - diff - 1), slideWidth * direction, 0);
      
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

  transitionEnd = () => {
    if (this.autoplayTimer) {
      clearTimeout(this.autoplayTimer);
    }

    let nextIndex = this.state.currentSlide + 1;

    this.autoplayTimer = setTimeout(() => {
      this.slideHandler(nextIndex);
    }, this.props.autoplaySpeed + 50);
  }
      
  autoPlay = playType => {
    if (!this.props.autoplay) return;

    if (this.autoplayTimer) {
      clearTimeout(this.autoplayTimer);
    }

    let nextIndex = this.state.currentSlide + 1;

    this.autoplayTimer = setTimeout(() => {
      this.slideHandler(nextIndex);
    }, this.props.autoplaySpeed + 50);

    //setTimeout(this.slideHandler(nextIndex), this.props.autoplaySpeed + 50);
  
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
      className: "carousel-list",
      onTransitionEnd: this.transitionEnd,
      onTouchStart: this.swipeStart,
      onTouchMove: this.state.dragging ? this.swipeMove : null,
      onTouchEnd: this.swipeEnd
      /*,
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
          <Track ref={this.trackRefHandler} {...trackProps} slidePostionListChange = {slidePostionList => this.slidePostionListChange(slidePostionList)} >
            {this.props.children}
          </Track>
        </div>
      </div>
		)
	}
}