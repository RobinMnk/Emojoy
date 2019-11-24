import React, { Component } from 'react';
import Pong, { DIRECTION } from './pong_canvas'
import FaceAPI, { Emotion } from './faceapi';
import { Connection, RTCData, RTCGameState } from '../services/connection';
import { Button } from 'antd';

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
    this.state = {
      waitingForFaceAPI: true,
      bv: true,
      state: 'loadingFace',
    }
  }

  onStream = stream => {
    const video = document.getElementById('enemy') as HTMLMediaElement
    video.srcObject = stream
    video.play()
    Pong.initialize('pong')
    this.setState({
      state: 'start',
    })
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
    } if (Pong.running === false && this.state.state === 'start') {
      Pong.running = true;
      window.requestAnimationFrame(() => Pong.loop(this.connection.player, this.gameStateCB, true));
    }
    if (this.state.state === 'start') {
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
      Pong.player.score = data.player.score
      Pong.paddle.score = data.paddle.score
    }
  }

  onVideoStream = stream => {
    this.stream = stream
  }

  startRound() {
    if (Pong.running === false) {
      Pong.running = true;
      window.requestAnimationFrame(Pong.loop);
    }
    this.setState({
      bv: false
    })
  }

  onFindPlayer = () => {
    this.setState({
      state: 'lookingForPlayers',
    })
    this.connection = new Connection(this.onStream, this.stream, this.onData)
  }

  render() {
    const video1 = {
      // left: 'calc(50vw - 125px - 84px)',
      // top: 'calc(100vh - 160px)',
      width: '250px',
      height: '150px',
      // flexDirection: 'column'
    }

    const video2 = {
      // left: 'calc(50vw + 125px - 84px)',
      // top: 'calc(100vh - 160px)',
      width: '250px',
      height: '150px',
      // flexDirection: 'column'
    }
    
    const pongStyle = {
      // position: 'absolute',
      width: '100vh',
      height: '100vh',
      left: 0,
      top: 0,
    }
    const isReverse = this.connection ? this.connection.player === 'B' : false
    const centerStyle = {
      justifyContent: 'space-around',
      // flexDirection: isReverse ? 'row-reverse' : 'row', FlexDirectionProper
      display: 'flex',
    };
    const videoContainer = {
      top: 'calc(100vh - 160px)',
    }

    let status;
    switch(this.state.state) {
      case 'loadingFace':
        status = 'Loading ...'
        break
      case 'lookingForPlayers':
        status = 'Finding player ...'
        break
    }
    
    return (
      <div>
        <div style={{position: 'relative', margin: 0}}>
        <div id={'pongDiv'} style={Object.assign(pongStyle, {position: 'absolute'})}>
          <div style={videoContainer}>
            <div style={Object.assign({flexDirection: isReverse ? 'row-reverse' : 'row', position: 'absolute', width: '-webkit-fill-available'}, centerStyle)}>
              <div style={Object.assign(video1, {position: 'relative'})}>
                <FaceAPI
                    setEmotion={em => this.handleEmotion(em)}
                    onRunning={this.onFindPlayer}
                    onVideoStream={this.onVideoStream}
                    noCenter={true}
                    width={250}
                    height={150}
                />
              </div>
              <div style={Object.assign(video2, {position: 'relative'})}>
                <video id='enemy' width="250" height="150"></video>
              </div>
                {/* <div>
                  <video></video>
                </div>
                <div>
                  <video></video>
                </div> */}
            </div>
          </div>
          <canvas id='pong'></canvas>
        </div>
        {Pong.running ? null : (
          <div style={centerStyle}>
            <div style={{ top: 'calc(50vh - 16px)', position: 'absolute' }}>
              <Button
                hidden={this.state.state === 'start'}
                icon = 'play-circle'
                type='primary'
                // onClick={ _ => this.onFindPlayer()}
                loading={this.state.waitingForFaceAPI}
              >
                {status}
              </Button>
            </div>
          </div>
        )}
        </div>
      </div>
    )
  }
}
