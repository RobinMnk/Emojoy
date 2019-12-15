import Sider from "antd/lib/layout/Sider";

enum DIRECTION {
  IDLE,
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

enum STATE {
  READY,
  PLAYING,
  ENDED,
}

interface Ball {
  width: number;
  height: number;
  x: number;
  y: number;
  dx: number; // between 0 and 1, .5 == 45°
  dy: number;
  speed: number;
}

interface Paddle {
  side: 'left' | 'right';
  width: number;
  height: number;
  yPosition: number; // value between 0 and 1 indicating the position in y direction
  move: DIRECTION;
  speed: number;
}

interface Player {
  paddle: Paddle,
  score: number,
}

export class PongGame {
  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  ball: Ball;
  leftPlayer: Player;
  rightPlayer: Player;
  state: STATE;
  clock: number;
  clockInterval: NodeJS.Timeout;
  backgroundColor = '#000000';
  parentRef: React.RefObject<HTMLDivElement>;

  constructor(canvasID: string, parentRef) {
    this.canvas = document.querySelector('canvas#' + canvasID) as HTMLCanvasElement;
    this.canvasContext = this.canvas.getContext('2d')
    this.parentRef = parentRef
    this.setCanvasSize()
    this.setupGame()
    this.paint()
    this.run()
    this.keyboardSetup()
  }

  setupGame() {
    this.state = STATE.READY
    this.leftPlayer = {
      score: 0,
      paddle: this.createPaddle('left'),
    }
    this.rightPlayer = {
      score: 0,
      paddle: this.createPaddle('right'),
    }

    this.ball = {
      height: .03,
      width: .03,
      x: .5,
      y: .5,
      dx: .5,
      dy: 1,
			speed: .005,
    }
  }

  createPaddle(side: 'left' | 'right'): Paddle {
    return {
      side: side,
      height: .2,
      width: 5,
      yPosition: .5,
      speed: .01,
      move: side === 'left' ? DIRECTION.UP : DIRECTION.DOWN,
    }
  }

  _updatePlayer(player: Player) {
    const paddle = player.paddle
    if (player.paddle.move === DIRECTION.UP) {
      paddle.yPosition = Math.max(0, paddle.yPosition - paddle.speed)
    } else if (player.paddle.move === DIRECTION.DOWN) {
      paddle.yPosition = Math.min(1, paddle.yPosition + paddle.speed)
    }
  }

  _updateBall(ball: Ball) {
    // if (ball.dx < 0 && ball.dy < 0) { // top left
    //   direction = BALL_DIRECTION.TOP_LEFT
    //   ball.x -= .5 * ball.speed
    //   ball.y -= ball.speed
    // } else if (ball.dx < 0 && 0 < ball.dy) { // top right
    //   direction = BALL_DIRECTION.TOP_RIGHT
    //   ball.x += .5 * ball.speed
    //   ball.y -= ball.speed
    // } else if (0 < ball.dx && ball.dy < 0) { // bottom left
    //   direction = BALL_DIRECTION.BOTTOM_LEFT
    //   ball.x -= .5 * ball.speed
    //   ball.y += ball.speed
    // } else if (0 < ball.dx && 0 < ball.dy) { // bottom right
    //   direction = BALL_DIRECTION.BOTTOM_RIGHT
    //   ball.x += .5 * ball.speed
    //   ball.y += ball.speed
    // }
    ball.x += ball.dx * ball.speed
    ball.y += ball.dy * ball.speed

    if (ball.y <= 0) {
      ball.dy *= -1
      ball.y = 0
    } else if (ball.y >= 1) {
      ball.dy *= -1
      ball.y = 1
    }
  }

  update() {
    if (!this.canvasContext && this.state !== STATE.PLAYING) {
      return
    }
    this._updatePlayer(this.leftPlayer)
    this._updatePlayer(this.rightPlayer)
    this._updateBall(this.ball)

    // check for collision

    const onLeftBorder = this.ball.x <= 0 + (this.leftPlayer.paddle.width / this.canvas.width)
    const onRightBorder = this.canvas.width - (this.rightPlayer.paddle.width / this.canvas.width) < this.ball.x
    if (onLeftBorder) {
      const paddle = this.leftPlayer.paddle
      const hitPoint = paddle.yPosition + paddle.height - this.ball.y
      const hitPaddle = -this.ball.height < hitPoint && hitPoint < paddle.height
      if (hitPaddle) {
        this.ball.x = 0
        this.ball.dx *= -1
      }
    } else if (onRightBorder) {

    }

  }

  run() {
    this.update()
    this.paint()
    // if (this.state === STATE.PLAYING) {
      requestAnimationFrame(() => this.run());
    // }
  }

  setCanvasSize() {
    this.canvas.style.width = this.parentRef.current.style.width
    this.canvas.style.height = this.parentRef.current.style.height
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  updateCanvasSize() {
    this.setCanvasSize()
    this.paint()
  }

  startTimer() {
    this.clockInterval = setInterval(() => {
      this.clock += 1;
    }, 1000)
  }

  stopTime() {
    clearInterval(this.clockInterval)
  }

  paint() {
    // clear the canvasContext
    this.canvasContext.clearRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height,
    );
    // Set the fill style to black
    this.canvasContext.fillStyle = this.backgroundColor;
    this.canvasContext.fillRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height,
    );
    
    this.canvasContext.fillStyle = '#ffffff'; // ''#ffffff';
    // Draw the leftrightPaddle
		this.paintPaddle(this.leftPlayer.paddle, 'left')
		this.paintPaddle(this.rightPlayer.paddle, 'right')

		// Draw the Ball
		// if (this.state = STATE.READY) {
      const bw = this.ball.width * this.canvas.height
      const bh = this.ball.height * this.canvas.height
			this.canvasContext.fillRect(
				this.ball.x * (this.canvas.width - bw),
				this.ball.y * (this.canvas.height - bh),
        bw,
        bh,
			);
    // }
  }

  paintPaddle(paddle: Paddle, side: 'left' | 'right') {
    const ph = paddle.height * this.canvas.height
    this.canvasContext.fillRect(
      side === 'left' ? 0 : this.canvas.width - paddle.width,
			paddle.yPosition * (this.canvas.height - ph),
			paddle.width,
			ph,
		);
  }

  keyboardSetup() {
    window.addEventListener('keydown', event => {
      switch(event.keyCode) {
        case 87: // w
          this.leftPlayer.paddle.move = DIRECTION.UP
          break
        case 83: // s
          this.leftPlayer.paddle.move = DIRECTION.DOWN
          break
        case 38: // up arrow
          this.rightPlayer.paddle.move = DIRECTION.UP
          break
        case 40: // up arrow
          this.rightPlayer.paddle.move = DIRECTION.DOWN
          break
      }
    })
    window.addEventListener('keyup', event => {
      switch(event.keyCode) {
        case 87: // w
        case 83: // s
          this.leftPlayer.paddle.move = DIRECTION.IDLE
          break
        case 38: // up arrow
        case 40: // up arrow
          this.rightPlayer.paddle.move = DIRECTION.IDLE
          break
      }
    })
  }
}
