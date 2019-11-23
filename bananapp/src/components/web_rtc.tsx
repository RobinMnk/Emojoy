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
    constructor(props: {}) {
        super(props);
    }
    async componentDidMount() {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        new Connection(this.onStream, stream)
        const video = document.getElementById('self') as HTMLMediaElement;
        video.srcObject = stream;
        video.play()
        // this.setupWebRtc(stream);

    }

    onStream = (stream: MediaStream) => {
        const video = document.getElementById('playback') as HTMLMediaElement
        video.srcObject = stream
        video.play()
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
