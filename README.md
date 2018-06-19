# rt-carousel
一个 react 轮播组件

### Usage

```js
import React from "react";
import Carousel from "rt-carousel";

class SimpleCarousel extends React.Component {
  render() {
    const settings = {
      speed: 500,
      autoplay: false,
      dots: true,
      arrows: true,
      initialSlide: 0
    };

    return (
      <Carousel {...settings}>
        <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
      </Carousel>
    );
  }
}
```

## API

### props

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th style="width: 50px;">default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>initialSlide</td>
          <td>Number</td>
          <td>0</td>
          <td>initialize the position of the carousel</td>
        </tr>
        <tr>
          <td>autoplay</td>
          <td>Boolean</td>
          <td>false</td>
          <td>automatic carousel</td>
        </tr>
         <tr>
          <td>autoplaySpeed</td>
          <td>Number</td>
          <td>3000</td>
          <td>automatic carousel interval</td>
        </tr>
        <tr>
          <td>speed</td>
          <td>Number</td>
          <td>300</td>
          <td>animation speed</td>
        </tr>
        <tr>
          <td>appendDots</td>
          <td>Function</td>
          <td>dots => <ul style={{ display: 'block' }}>{dots}</ul></td>
          <td>customize dot node</td>
        <tr>
          <td>dots</td>
          <td>Boolean</td>
          <td>true</td>
          <td>open dots switch</td>
        </tr>
        <tr>
          <td>dotsClass</td>
          <td>String</td>
          <td>'carousel-dots'</td>
          <td>customize dot class</td>
        </tr>
        <tr>
          <td>customPaging</td>
          <td>Function</td>
          <td>i => <button>{i + 1}</button></td>
          <td>customize the children of each dot</td>
        </tr>
        <tr>
          <td>arrows</td>
          <td>Boolean</td>
          <td>true</td>
          <td>open arrows switch</td>
        </tr>
        <tr>
          <td>nextArrow</td>
          <td>Node</td>
          <td>null</td>
          <td>customize the node of nextArrow</td>
        </tr>     
        <tr>
          <td>prevArrow</td>
          <td>Node</td>
          <td>null</td>
          <td>customize the node of prevArrow</td>
        </tr> 
        <tr>
          <td>pauseOnHover</td>
          <td>Boolean</td>
          <td>false</td>
          <td>hover carousel pause</td>
        </tr>    
        <tr>
          <td>unslick</td>
          <td>Boolean</td>
          <td>false</td>
          <td>remove dots and arrows</td>
        </tr>                                         
    </tbody>
</table>

## Development

```
npm install
npm start
```

## Example

http://localhost:8001/examples/

online example: http://react-component.github.io/checkbox/examples/

## Test Case

```
npm test
npm run chrome-test
```

## Coverage

```
npm run coverage
```

open coverage/ dir


## License

rt-carousel is released under the MIT license.
