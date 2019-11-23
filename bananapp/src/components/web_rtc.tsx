import React, { Component } from 'react';
import { Row } from 'antd';
import { Connection } from '../services/connection';

const centerStyle = {
    justifyContent: 'space-around',
    display: 'flex'
};

interface IFaceAPIState {
    emotion?: string;
    ready: boolean;
}

export default class WebRtc extends Component<{}, IFaceAPIState> {
    connection: Connection

    constructor(props: {}) {
        super(props); 
    }
      
    async componentDidMount() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.connection = new Connection(this.onStream, stream, () => {})
      const video = document.getElementById('self') as HTMLMediaElement;
      video.srcObject = stream;
      video.play()        
    }

    onStream = (stream: MediaStream) => {
      const video = document.getElementById('playback') as HTMLMediaElement
      video.srcObject = stream
      video.play()
      setTimeout(() => {
          this.connection.sendData({test: 123})
      }, 2000);
    }
    render() {
        return <div style={centerStyle}>
            <Row>
                <video id='self'></video>
                <video id='playback'></video>
            </Row>
        </div>
    }
}
