import React, { Component } from 'react';
import Pong, { DIRECTION } from './pong_canvas'
import FaceAPI, { Emotion } from './faceapi';
import { Connection, RTCData, RTCGameState } from '../services/connection';

type FlowState = 'loadingFace' | 'lookingForPlayers' | 'start'

interface State {
  waitingForFaceAPI: boolean,
  bv: boolean,
  state: FlowState,
}

export default class MPPong extends Component<any, State> {
  pong: any
  connection: Connection | any
  stream: MediaStream
  constructor(props: {}) {
    super(props); 
  }

  onStream = stream => {
    const video = document.getElementById('enemy') as HTMLMediaElement
    video.srcObject = stream
    video.play()
    Pong.initialize('pong')
  }

  handleEmotion(em: Emotion) {
    const pong = Pong
    const connection = this.connection
    if (!pong) {
      console.log('no pong canvas')
      return
    } else if (!connection) {
      console.log('no webrtc connection')
      return
    } if (Pong.running === false && this.connection) {
      Pong.running = true;
      window.requestAnimationFrame(() => Pong.loop(this.connection.player, this.gameStateCB, true));
    }
    if (connection.player === 'B') {
      this.connection.sendData({
        type: 'emotion',
        data: em,
      } as RTCData)
    } else {
      if (Pong.running) {
        if (em === 'happy') {
          Pong.player.move = DIRECTION.UP;
        } else if (em === 'surprised') {
          Pong.player.move = DIRECTION.DOWN;
        } else if (em === 'neutral') {
          Pong.player.move = DIRECTION.IDLE;
        }
      }
    }
  }

  gameStateCB = (gameState: RTCGameState) => {
    console.log(gameState)
    const connection = this.connection
    if (gameState && connection)
      connection.sendData(gameState)
  }

  onData = (data: RTCData) => {
    console.log('ondata', data)
    if (data.type === 'emotion') {
      const em = data.data
      if (em === 'happy') {
        Pong.paddle.move = DIRECTION.UP;
      } else if (em === 'surprised') {
        Pong.paddle.move = DIRECTION.DOWN;
      } else if (em === 'neutral') {
        Pong.paddle.move = DIRECTION.IDLE;
      }
    } else if(data.type === 'state') {
      Pong.ball.x = data.ball.x
      Pong.ball.y = data.ball.y
      Pong.player.y = data.player.y
      Pong.paddle.y = data.paddle.y
    }
  }

  onVideoStream = stream => {
    this.connection = new Connection(this.onStream, stream, this.onData)
  }

  render() {
      return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <FaceAPI
              setEmotion={em => this.handleEmotion(em)}
              noCenter={true}
              onVideoStream={this.onVideoStream}
          />
          <video id='enemy'></video>
          <canvas style={{top: 500}} id='pong'></canvas>
        </div>
      )
  }
}


const styles = {

}