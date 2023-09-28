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


function useInitCanvas(canvasRef, ballsRef, width, height, topY, onBallClick) {

  const clearBallsClicked = () => {
    // Identify which ball is open to be reset
    let ball = ballsRef.current.find(ball => ball.clicked)
    if (ball) {
      ball.clicked = false
      ball.x = getRandomInt(width / 2, width)
      ball.y = getRandomInt(0, height)
      ball.velX = getRandomVel()
      ball.velY = getRandomVel()
      ball.radius = ball.originalRadius
    }
  }

  const handleCanvasOnClick = (e) => {
    const x = e.pageX - canvasRef.current.getBoundingClientRect().left
    // Note: y should be the position Y of the mouse in the screen but related to the animated board
    // XxY at top left corner should be 0x0
    // To get Y value we first find the position Y of the mouse and remove all the aggregated height 
    // from previous components/pages
    // 
    const y = e.pageY - topY 
    // Identify which ball was clicked
    if (ballsRef.current) {
      let ball = ballsRef.current.find(ball => Math.sqrt((x-ball.x)*(x-ball.x) + (y-ball.y)*(y-ball.y)) < ball.radius)
      if (ball) {
        // Reset previous ball selected
        clearBallsClicked()
        
        ball.clicked = true
        onBallClick(ball.address)
      }
    }
  }
  
  React.useEffect(() => {
    const context = canvasRef.current.getContext('2d')
    
    if (context) {
      canvasRef.current.scrollTop = 0;

      // Add event listener for `click` events.
      canvasRef.current.addEventListener('click', handleCanvasOnClick, false);

      // set the canvas size
      canvasRef.current.width = width
      canvasRef.current.height = height

    }

    return function cleanup() {
      canvasRef.current.removeEventListener('click', handleCanvasOnClick, false);
    }

  }, [width, height]);

  return [];
}


function useUpdateCanvas(canvasRef, ballsRef, width, height, filteredAddresses, currentSelected) {
  const [friction, setFriction] = React.useState(0.98);
  const [context, setContext] = React.useState();
  // Note: use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = React.useRef();

  const drawBall = (ball) => {
    context.beginPath()
    // Define gradient
    let g = context.createLinearGradient(ball.x-ball.radius, ball.y-ball.radius, ball.x+ball.radius, ball.y+ball.radius);
    g.addColorStop(0, ball.colorStart);
    g.addColorStop(1, ball.colorEnd);
    context.fillStyle = g
    
    // Draw the dot
    context.arc(
      ball.x, ball.y,
      ball.radius,
      0, Math.PI * 2, true
    )

    // Sets the type of compositing operation to apply when drawing new shapes
    if (!ball.clicked) {
      // ctx.globalCompositeOperation='color-burn';
      // ctx.globalCompositeOperation='luminosity';
    }
    context.globalCompositeOperation='destination-over';
    // ctx.globalAlpha = 0.8;

    context.fill()
  }

  const update = () => {
    
    if (context) {
      // clear the canvas and redraw everything
      context.clearRect(0, 0, width, height)

      ballsRef.current.forEach((ball) => {
        if (ball.clicked) {
          ball.radius = width / 4.4
          ball.x = (width / 4.4) + 20
          ball.y = (width / 4.4) + 20
        } else {
          if (ball.y + ball.radius >= height) {
            ball.velY *= -ball.bounce
            ball.y = height - ball.radius
            ball.velX *= friction
          }
          if (ball.y - ball.radius <= 0) {
            ball.velY *= -ball.bounce
            ball.y = ball.radius
            ball.velX *= friction
          }
          if (ball.x - ball.radius <= 0) {
            ball.velX *= -ball.bounce
            ball.x = ball.radius
          }
          if (ball.x + ball.radius >= width) {
            ball.velX *= -ball.bounce
            ball.x = width - ball.radius
          }
  
          if (ball.velX < 0.01 && ball.velX > -0.01) {
            ball.velX = 0
          }
          if (ball.velY < 0.01 && ball.velY > -0.01) {
            ball.velY = 0
          }
  
          ball.x += ball.velX
          ball.y += ball.velY
        }
        drawBall(ball)
      })
    }
    requestRef.current = requestAnimationFrame(update)
  }
  
  React.useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    
    if (ctx) {
      let balls = []
      
      for (let i = 0; i < filteredAddresses.length; i++) {
        const g = gradient(),
        radius = 30 * (1+3*(filteredAddresses.length-i)/filteredAddresses.length);
        const ball = {
          address: filteredAddresses[i],
          bounce: 1,
          radius: radius,
          originalRadius: radius,
          x: canvasRef.current.width / 2,
          y: canvasRef.current.height / 2,
          velX: getRandomVel(),
          velY: getRandomVel(),
          colorStart: g.start,
          colorEnd: g.end
        }
        balls.push(ball);
      }

      if (!!currentSelected) {
        // Initialize any selected address
        const ball = balls.find(ball => ball.address === currentSelected)
        if (!!ball) {
          ball.clicked = true
        }
      }

      setContext(ctx)
      ballsRef.current = balls
      requestRef.current = requestAnimationFrame(update)

    }

    return function cleanup() {
      if (requestRef) {
        cancelAnimationFrame(requestRef.current);
      }
    }

  }, [width, height, filteredAddresses, currentSelected]);

  return [];
}

export default function BoardAnimationCanvas({width, height, topY, onBallClick}) {
  const canvasRef = React.useRef();
  const ballsRef = React.useRef();
  const selectedChain = useSelector(selectChain);
  const currentSelected = useSelector(selectAddress);
  const selectedPage = useSelector(selectPage);
  const filteredAddresses = ['a'];

  useInitCanvas(canvasRef, ballsRef, width, height, topY, onBallClick);
  useUpdateCanvas(canvasRef, ballsRef, width, height, filteredAddresses, currentSelected);
  

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
      // backgroundColor: "rgba(241, 241, 240, 0.95)",
      borderBottom: `solid 2px #FFF`,
      }}>
        <canvas ref={canvasRef}
          style={{
            padding: 0,
            margin: "0 auto",
            display: "block"
          }}></canvas>
    </Box>
  );
}