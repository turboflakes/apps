import * as React from 'react';
import { useSelector } from 'react-redux';
import { isUndefined } from 'lodash';
import Box from '@mui/material/Box';
import {
  selectChain,
  selectAddress
} from '../../features/chain/chainSlice';
import { getRandomInt } from '../../util/gradients';
import nomiSVG from '../../assets/nomi.svg';

export function getRandomVel() {
  return Math.random() * 2 - 1;
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
        // clearBallsClicked()
        
        // ball.clicked = true
        onBallClick(ball.stash)
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
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('click', handleCanvasOnClick, false);
      }      
    }

  }, [width, height]);

  return [];
}

function initializeBalls (profiles = [], startPoint= {}) {
 return profiles
  .filter(p => !p.isCandidate)
  .map((p, i) => {
    const radius = 30 * (1+3*(profiles.length-i)/profiles.length);
    return {
      ...p,
      bounce: 1,
      radius: radius,
      originalRadius: radius,
      x: startPoint.x,
      y: startPoint.y,
      velX: getRandomVel(),
      velY: getRandomVel(),
    }
  })
}

function useUpdateCanvas(canvasRef, ballsRef, width, height, profiles, selected) {
  const [friction, setFriction] = React.useState(0.98);
  const [context, setContext] = React.useState();
  // Note: use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = React.useRef();

  const drawBall = (ball) => {
    // If is candidate just hide it
    if (ball.isCandidate) {
      return
    }

    context.beginPath()
    // Draw the dot
    context.arc(
      ball.x, ball.y,
      ball.radius,
      0, Math.PI * 2, true
    )

    // Define gradient
    let g = context.createLinearGradient(ball.x-ball.radius, ball.y-ball.radius, ball.x+ball.radius, ball.y+ball.radius);
    g.addColorStop(0, ball.colorStart);
    g.addColorStop(1, ball.colorEnd);
    context.fillStyle = g

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
        // if (ball.clicked) {
        //   // console.log("__ball", ball);
        //   ball.radius = 0
        //   ball.x = 0
        //   ball.y = 0
        //   // ball.radius = width / 4.4
        //   // ball.x = (width / 4.4) + 20
        //   // ball.y = (width / 4.4) + 20
        // } else {
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
        // }
        drawBall(ball)
      })
    }
    requestRef.current = requestAnimationFrame(update)
  }
  
  React.useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    
    if (ctx) {

      let startPoint = {
        x: canvasRef.current.width / 2,
        y: canvasRef.current.height / 2,
      };
      
      let balls = []
      if (isUndefined(ballsRef.current)) {
        balls = initializeBalls(profiles, startPoint)
      } else if (ballsRef.current.length === 0) {
        balls = initializeBalls(profiles, startPoint)
      } else if (ballsRef.current.map(a => a.stash).join() !== profiles.map(a => a.stash).join()){
        balls = initializeBalls(profiles, startPoint)
      } else {
        // identify balls that are on the candidates list
        const candidates = profiles.filter(p => p.isCandidate).map(p => p.stash)
        balls = ballsRef.current.map(b => {
          return {
            ...b,
            isCandidate: candidates.includes(b.stash)
          }
        })          
      }

      // if (!!selected) {
      //   // Initialize any selected address
      //   const ball = balls.find(ball => ball.stash === selected)
      //   if (!!ball) {
      //     ball.clicked = true
      //   }
      // }

      setContext(ctx)
      ballsRef.current = balls
      requestRef.current = requestAnimationFrame(update)

    }

    return function cleanup() {
      if (requestRef) {
        cancelAnimationFrame(requestRef.current);
      }
    }

  }, [width, height, profiles, selected]);

  return [];
}

export default function BoardAnimationCanvas({width, height, topY, onBallClick, profiles}) {
  const canvasRef = React.useRef();
  const ballsRef = React.useRef();
  const selected = useSelector(selectAddress);
  
  useInitCanvas(canvasRef, ballsRef, width, height, topY, onBallClick);
  useUpdateCanvas(canvasRef, ballsRef, width, height, profiles, selected);
  
  return (
    <Box sx={{
      overflow: 'hidden',
      position: 'relative'
    }}>
      <img
        src={nomiSVG} style={{
          opacity: 0.04,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: width / 6,
          height: 'auto',
        }}
        alt="nomi"
      ></img>
      <canvas ref={canvasRef}
        style={{
          position: 'relative',
          padding: 0,
          margin: "0 auto",
          display: "block",
        }}></canvas>      
    </Box>
  );
}