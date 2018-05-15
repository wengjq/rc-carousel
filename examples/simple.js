import React from 'react';
import ReactDOM from 'react-dom';
import Carouseleffect from 'rc-carousel-effect';
import 'rc-carousel-effect/assets/index.less';

class SimpleDemo extends React.Component {
	render () {
		return (
			<Carouseleffect>
				<div style={{float: "left",position: "relative"}}>
          <h3>1</h3>
        </div>
        <div style={{float: "left",position: "relative"}}>
          <h3>2</h3>
        </div>
        <div style={{float: "left",position: "relative"}}>
          <h3>3</h3>
        </div>
      </Carouseleffect>
		)
	}
}

ReactDOM.render(<SimpleDemo />, document.getElementById('__react-content'));
