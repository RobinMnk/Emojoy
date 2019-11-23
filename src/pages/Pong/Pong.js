import React, { Component } from "react";
import Paddle from "./components/paddle";
import Ball from "./components/ball";
import Board from "./components/board";
import Waves from "./components/waves";
import "./Pong.css";

class Pong extends Component {
  constructor() {
    super();
    this.state = {
      animate: [false, false],
      waves: [],
      isStarted: false,
      score: [0, 0],
      playerY: 50,
      opponentY: 40,
      playerSpeed: 10,
      interval: null,
      keyPressed: "",
      ball: {
        animId: 0,
        ballX: 50,
        ballY: 50,
        ballSpeedX: 0.4,
        ballSpeedY: 0.2,
        radius: 4
      }
    };
  }

  handleRoundStart = () => {
    if (this.state.interval) return;
    this.setState({
      interval: setInterval(this.ballMove, 10),
      isStarted: true
    });
  };

  handlePlayerMove = () => {
    let yPercent = 0;
    if (this.state.keyPressed === "down") {
      yPercent = this.state.playerY - 1;
    } else if (this.state.keyPressed === "up") {
      yPercent = this.state.playerY + 1;
    }
    if (yPercent <= 0) {
      yPercent = 0;
    } else if (yPercent > 80) {
      yPercent = 80;
    }
    this.handleRoundStart()
    this.setState({
      playerY: yPercent,
    });
  };

  handleKeyDown = event => {
    event.preventDefault()
    let direction = "";
    if (event.keyCode === 38) {
      direction = "down";
    } else if (event.keyCode === 40) {
      direction = "up";
    }
    this.setState({
      keyPressed: direction
    }, this.handlePlayerMove);
  }

  handleSizeChange = event => {
    const ball = { ...this.state.ball, radius: event.target.value / 10 };
    this.setState({
      ball: ball
    });
  };

  ballMove = () => {
    //opponent movement is also handled here
    let { radius, ballX, ballY, ballSpeedX, ballSpeedY } = this.state.ball;
    const radiusY = (radius * window.innerWidth) / window.innerHeight;
    let { playerY, opponentY } = this.state;
    if (ballX > 98 - radius - ballSpeedX) {
      if (
        ballSpeedX > 0 &&
        ballX > radius &&
        ballY > opponentY - 2*radius &&
        ballY < opponentY + 20 + 2*radius
      ) {
        if (ballY < opponentY - radius) {
          this.cornerBounce();
        } else if (ballY > opponentY + 20 + radius) {
          this.cornerBounce("top");
        }
        return this.BounceX("right");
      } else if (ballX > 100) {
        return this.scorePoint(true);
      }
    } else if (ballX < 2 + radius - ballSpeedX) {
      if (
        ballSpeedX < 0 &&
        ballY > playerY - 2 * radius &&
        ballY < playerY + 20 + 2 * radius
      ) {
        if (ballY < playerY - radius) {
          this.cornerBounce("top");
        } else if (ballY > playerY + 20 + radius) {
          this.cornerBounce();
        }
        return this.BounceX("left");
      } else if (ballX < 0 + ballSpeedX) {
        return this.scorePoint();
      }
    }
    if (
      (ballSpeedY > 0 && ballY > 100 - radiusY - ballSpeedY) ||
      (ballSpeedY < 0 && ballY < radiusY + ballSpeedY)
    ) {
      return this.BounceY();
    }
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    const ball = { ...this.state.ball, ...{ ballX: ballX, ballY: ballY } };
    let opponentSpeed = Math.min(ballSpeedY * 0.8, 1.2);
    opponentY += opponentSpeed;
    if (opponentY < 0) opponentY = 0;
    else if (opponentY > 80) opponentY = 80;
    this.setState({
      ball: ball,
      opponentY: opponentY,
    });
  };

  BounceY = () => {
    this.animateBounce();
    const ball = {
      ...this.state.ball,
      ballSpeedY: -this.state.ball.ballSpeedY
    };
    this.setState({
      ball: ball
    });
  };

  createWaves = side => {
    const waves = this.state.waves.slice();
    const paddleY = side === "left" ? this.state.playerY : this.state.opponentY;
    const waveY = Math.min(
      paddleY + 20,
      Math.max(paddleY, this.state.ball.ballY)
    );
    const currentWave = {
      waveY: waveY,
      waveX: side === "left" ? 2 : 98,
      intensity: Math.abs(this.state.ball.ballSpeedX) / 3
    };
    waves.push(currentWave);
    this.setState({
      waves: waves
    });

    setTimeout(() => {
      waves.splice(waves.indexOf(currentWave), 1);
      this.setState({ waves: waves });
    }, 300);
  };

  animateBounce = side => {
    const { ballSpeedX, ballSpeedY } = this.state.ball;
    const absSpeedX = Math.abs(ballSpeedX);
    const absSpeedY = Math.abs(ballSpeedY);
    const x = document.head.querySelector("#anim");
    if (x) x.remove(); //delete previous stylesheet with animation
    let angle = (absSpeedY * 3.14 * 57) / absSpeedX / 4; //arctan approximation to get the angle
    angle = Math.min(angle, 60);
    if (ballSpeedY > 0) {
      if (ballSpeedX > 0) angle *= -1;
    } else {
      if (ballSpeedX < 0) angle *= -1;
    }
    let scale = Math.min(1 + absSpeedX / 4, 2); //stretch coefficient
    const color =
      side === "left" ? "purple" : side === "right" ? "#666600" : "#595959";
    const animId = ((ballSpeedX + ballSpeedY) * 100).toFixed(0); //generate unique animation name
    const animSheet = document.createElement("style");
    animSheet.setAttribute("id", "anim");
    document.head.appendChild(animSheet);
    animSheet.innerHTML = `
      @keyframes bounce-animation${animId} {
        0% {
          transform: translate(-50%, -50%) rotate(0deg) scale(1, 1);
          background-color: black;
        }
        20% {
          transform: translate(-50%, -50%) rotate(${angle}deg) scale(${scale}, ${1 /
      scale});
          background-color: ${color};

        }
        100% {
          transform: translate(-50%, -50%) rotate(${angle}deg) scale(1, 1);
          background-color: black;
        }
      }`;
    this.setState({
      ball: { ...this.state.ball, animId: animId }
    });
  };
  BounceX = side => {
    this.animateBounce(side);
    this.createWaves(side);
    const { ballSpeedX, ballSpeedY } = this.state.ball;
    const newSpeedX = ballSpeedX * -1.05;
    const newSpeedY =
      ballSpeedY + (side === "left" ? this.state.playerSpeed : ballSpeedY) / 20;
    const ball = {
      ...this.state.ball,
      ...{ ballSpeedX: newSpeedX, ballSpeedY: newSpeedY }
    };
    this.setState({
      ball: ball,
      animate: side === "left" ? [true, false] : [false, true]
    });
    setTimeout(() => {
      this.setState({ animate: [false, false] });
    }, 300);
  };

  // TODO: If we want to remove speed change on corner remove it here
  cornerBounce = up => {
    const { ballSpeedX, ballSpeedY } = this.state.ball;
    const speedChange = up ? ballSpeedX : -ballSpeedX;
    this.setState({
      ball: {
        ...this.state.ball,
        ...{
          ballSpeedX: ballSpeedX * 0.9,
          ballSpeedY: ballSpeedY + speedChange
        }
      }
    });
  };
  scorePoint = player => {
    const score = this.state.score;
    if (player) score[0]++;
    else score[1]++;
    clearInterval(this.state.interval);
    const ball = {
      ...this.state.ball,
      ...{ ballX: 50, ballY: 50, ballSpeedX: 0.4 * Math.sign(Math.random() -0.5), ballSpeedY: Math.random() -0.5, animId: 0 }
    };
    this.setState({
      //everything to initial, score updated
      score: score,
      interval: null,
      ball: ball,
      opponentY: 40
    });
  };

  render() {
    return (
      <main
        className="main"
        onKeyDown={this.handleKeyDown}
        tabIndex="0"
        ref="main"
      >
        <Board />
        <div className="score">
          <span>{this.state.score[0]}</span>
          <span>{this.state.score[1]}</span>
        </div>
        <Paddle
          animate={this.state.animate[0]}
          player={true}
          pos={this.state.playerY}
        />
        <Ball ball={this.state.ball} />
        <Paddle animate={this.state.animate[1]} pos={this.state.opponentY} />
        <Waves waves={this.state.waves} />
      </main>
    );
  }
}
export default Pong;
