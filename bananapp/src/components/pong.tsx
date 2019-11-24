import React, { Component } from 'react';
import Pong, { DIRECTION } from './pong_canvas'
import FaceAPI, { Emotion } from './faceapi';
import { Button } from 'antd';

const centerStyle = {
  justifyContent: 'space-around',
  display: 'flex',
};

export default class PongCanvas extends Component<{}, { waitingForFaceAPI: boolean, bv: boolean }> {
  pong: any
  constructor(props: {}) {
    super(props); 
    this.state = {
      waitingForFaceAPI: true,
      bv: true,
    }
  }
    
  async componentDidMount() {
    Pong.initialize('pong');
  }

  handleEmotion(em: Emotion) {
    const pong = Pong
    if (!pong) {
      console.log('no pong canvas')
    } else if (Pong.running) {
      if (em === 'happy') {
        Pong.player.move = DIRECTION.UP;
      } else if (em === 'surprised') {
        Pong.player.move = DIRECTION.DOWN;
      } else if (em === 'neutral') {
        Pong.player.move = DIRECTION.IDLE;
      }
    }
  }

  startRound() {
    if (Pong.running === false) {
      Pong.running = true;
      window.requestAnimationFrame(() => Pong.loop('A', undefined, false));
    }
    this.setState({
      bv: false
    })
  }

  render() {
    const faceAPIstyle = {
      // position: 'absolute',
      left: 'calc(50vw - 125px - 84px)',
      top: 'calc(100vh - 160px)',
      width: '250px',
      height: '150px',
      display: 'flex',
      // flexDirection: 'column'
    }

    const pongStyle = {
      width: '100vh',
      height: '100vh',
      left: 0,
      top: 0,
    }

      return (
        <div style={{position: 'relative', margin: 0}}>
          <div id={'pongDiv'} style={Object.assign(pongStyle, {position: 'absolute'})}>
          <div style={Object.assign(faceAPIstyle, {position: 'absolute'})}>
            <FaceAPI
                setEmotion={em => this.handleEmotion(em)}
                onRunning={() => this.setState({ waitingForFaceAPI: false })}
                noCenter={true}
                width={250}
                height={150}
            />
          </div>
            <canvas id='pong'></canvas>
          </div>
          {Pong.running ? null : (
            <div style={centerStyle}>
              <div style={{ top: 'calc(50vh - 16px)', position: 'absolute' }}>
                <Button
                  hidden={!this.state.bv}
                  icon = 'play-circle'
                  type='primary'
                  onClick={ _ => this.startRound()}
                  loading={this.state.waitingForFaceAPI}
                >
                  {this.state.waitingForFaceAPI ? 'Loading ...' : 'Play!'}
                </Button>
              </div>
            </div>
          )}
          </div>
      )
  }
}
