import React, { Component } from 'react';
import Pong, { DIRECTION } from './pong_canvas'
import FaceAPI, { Emotion } from './faceapi';

export default class PongCanvas extends Component {
  pong: any
  constructor(props: {}) {
    super(props); 
  }
    
  async componentDidMount() {
    Pong.initialize('pong')
  }

  handleEmotion(em: Emotion) {
    const pong = Pong
    if (!pong) {
      console.log('no pong canvas')
    } else {
      if (Pong.running === false) {
        Pong.running = true;
        window.requestAnimationFrame(Pong.loop);
      }
      console.log(Pong.running)
      if (em === 'happy') {
        Pong.player.move = DIRECTION.UP;
      } else if (em === 'surprised') {
        Pong.player.move = DIRECTION.DOWN;
      } else if (em === 'neutral') {
        Pong.player.move = DIRECTION.IDLE;
      }
    }
  }

  render() {
      return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <FaceAPI
              setEmotion={em => this.handleEmotion(em)}
              noCenter={true}
          />
          <canvas style={{top: 500}} id='pong'></canvas>
        </div>
      )
  }
}


const styles = {

}