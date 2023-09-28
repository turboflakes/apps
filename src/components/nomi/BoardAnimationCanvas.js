import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'
import isEqual from 'lodash/isEqual'
import Box from '@mui/material/Box';
import {
  pageChanged,
  selectPage,
} from '../../features/layout/layoutSlice';
import {
  addressChanged,
  selectChain,
  selectAddress
} from '../../features/chain/chainSlice';

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
 function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomVel() {
  return Math.random() * 2 - 1;
}

// function rgb(i) {
//   return 'rgb(' + getRandomInt(0, 255) + ', ' + Math.floor(255 - i) + ', ' +
//   getRandomInt(127, 255) + ')';
// }

function contrast(hue) {
  let h = hue + getRandomInt(90, 180)
  if (h > 360) {
    return h - 360
  }
  return h
}

function gradient() {
  const hue = getRandomInt(0, 360);
  return {
    start: hsla(hue),
    end: hsla(contrast(hue))
  }
}

function hsla(hue) {
  return 'hsla(' + hue + ', ' + getRandomInt(50, 100) + '%, ' +
  getRandomInt(50, 80) + '%, 1)'; 
}

let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

let cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;


function useInitCanvas(ref, width, height) {

  const handleCanvasOnClick = (e) => {
    console.log("__handleCanvasOnClick", e);
    // const {topY} = this.props
    // const {balls} = this.state
    // const x = e.pageX - this.canvas.getBoundingClientRect().left
    // // Note: y should be the position Y of the mouse in the screen but related to the animated board
    // // XxY at top left corner should be 0x0
    // // To get Y value we first find the position Y of the mouse and remove all the aggregated height 
    // // from previous components/pages
    // // 
    // const y = e.pageY - topY
    // // Identify which ball was clicked
    // let ball = balls.find(ball => Math.sqrt((x-ball.x)*(x-ball.x) + (y-ball.y)*(y-ball.y)) < ball.radius)
    // if (!!ball) {
    //   // Reset previous ball selected
    //   this.clearSelected()
      
    //   ball.clicked = true
    //   this.props.onBallClick(ball.address)
    // }
  }
  
  React.useEffect(() => {
    ref.current.scrollTop = 0;

    // const canvas = document.getElementById('board')
    if (ref.current.getContext('2d')) {
        // Add event listener for `click` events.
        ref.current.addEventListener('click', handleCanvasOnClick, false);

        // set the canvas size
        ref.current.width = width
        ref.current.height = height

    }

    return function cleanup() {
      if (ref.current.getContext('2d')) {
        ref.current.removeEventListener('click', handleCanvasOnClick, false);
      }
    }

  }, [width, height]);

  return [];
}

function useUpdateCanvas(ref, filteredAddresses, currentSelected) {

  // const update = () => {
  //   const {width, height} = this.props
  //   const {
  //     friction,
  //     ctx,
  //     balls
  //   } = this.state

  //   this.req = requestAnimationFrame(this.update)

  //   if (!!ctx) {
  //     // clear the canvas and redraw everything
  //     ctx.clearRect(0, 0, width, height)

  //     balls.forEach((ball) => {
  //       if (ball.clicked) {
  //         ball.radius = width / 4.4
  //         ball.x = (width / 4.4) + 20
  //         ball.y = (width / 4.4) + 20
  //       } else {
  //         if (ball.y + ball.radius >= height) {
  //           ball.velY *= -ball.bounce
  //           ball.y = height - ball.radius
  //           ball.velX *= friction
  //         }
  //         if (ball.y - ball.radius <= 0) {
  //           ball.velY *= -ball.bounce
  //           ball.y = ball.radius
  //           ball.velX *= friction
  //         }
  //         if (ball.x - ball.radius <= 0) {
  //           ball.velX *= -ball.bounce
  //           ball.x = ball.radius
  //         }
  //         if (ball.x + ball.radius >= width) {
  //           ball.velX *= -ball.bounce
  //           ball.x = width - ball.radius
  //         }

  //         if (ball.velX < 0.01 && ball.velX > -0.01) {
  //           ball.velX = 0
  //         }
  //         if (ball.velY < 0.01 && ball.velY > -0.01) {
  //           ball.velY = 0
  //         }

  //         ball.x += ball.velX
  //         ball.y += ball.velY
  //       }
  //       this.draw(ball)
  //     })
  //   }
  // }

  React.useEffect(() => {

    // Specify how to clean up after this effect:
    return function cleanup() {
      if (this.req) {
        cancelAnimationFrame(this.req);
      }
    }

  }, [filteredAddresses, currentSelected]);

  return [];
}

export default function BoardAnimationCanvas({width, height}) {
  const ref = React.useRef();
  const [friction, setFriction] = React.useState(0.98);
  const [balls, setBalls] = React.useState([]);
  const [ctx, setCtx] = React.useState();

  
  const selectedChain = useSelector(selectChain);
  const currentSelected = useSelector(selectAddress);
  const selectedPage = useSelector(selectPage);
  const filteredAddresses = ['a', 'b', 'c'];

  useInitCanvas(ref, width, height);
  useUpdateCanvas(ref, selectedChain, filteredAddresses, currentSelected);
  

  const handleOnBallClick = (address) => {
    console.log("__handleOnBallClick", address);
    // if (!!address) {
    //   const {location} = this.props
    //   let query = new URLSearchParams(location.search)
    //   this.changeParams(query, address)
    //   this.props.selectAddress(address)
    // }
  }

  const handleOnBallClear = () => {
    // this.removeAddress()
  }

  return (
    <Box sx={{ 
      position: "relative",
      backgroundColor: "rgba(241, 241, 240, 0.95)",
      borderBottom: `solid 2px #FFF`,
      }}>
        <canvas ref={ref}
          style={{
            padding: 0,
            margin: "0 auto",
            display: "block"
          }}></canvas>
    </Box>
  );
}