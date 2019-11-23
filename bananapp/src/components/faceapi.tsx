import React, { Component } from 'react';
import Webcam from "react-webcam";
import { Row } from 'antd';

import * as faceapi from "face-api.js";

const centerStyle = {
    justifyContent: 'space-around',
    display: 'flex'
};

interface IFaceAPIState {
    emotion?: string;
    ready: boolean;
}

export default class FaceAPI extends Component<{}, IFaceAPIState> {
    webcamId: string = "webcam";
    _child: React.RefObject<Webcam>;
    constructor(props: {}) {
        super(props);
        this.state = { ready: false };
        this._child = React.createRef();
        this.loadModel();
    }

    async loadModel() {
        const MODEL_URL = '/models';
        await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
        await faceapi.loadFaceLandmarkModel(MODEL_URL)
        await faceapi.loadFaceRecognitionModel(MODEL_URL)
        this.setState({ ready: true });
    }

    applyModel() {
        if (!this.state.ready) {
            return;
        }
        const node = this._child.current;
        if (!node) {
            return;
        }
        const videoElement = node.getScreenshot();
        
        // let faceDescriptions = faceapi.detectSingleFace().withFaceExpressions()
    }

    async run() {
        return;
    }

    render() {
        return <div style={centerStyle}>
            <Row>
                <Webcam mirrored={true} id={this.webcamId} ref={this._child}></Webcam>
            </Row>
        </div>
    }
}
