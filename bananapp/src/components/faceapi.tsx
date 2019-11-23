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
    started: boolean;
}

export default class FaceAPI extends Component<{}, IFaceAPIState> {
    webcamId: string = "webcam";
    canvasId: string = "overlay";
    _child: React.RefObject<Webcam>;
    constructor(props: {}) {
        super(props);
        this.state = { ready: false, started: false };
        this._child = React.createRef();
    }

    async loadModel() {
        const MODEL_URL = '/models';
        await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
        await faceapi.loadAgeGenderModel(MODEL_URL);
        await faceapi.loadFaceExpressionModel(MODEL_URL);
        this.setState({ ready: true });
        console.log("loaded models", faceapi)
    }

    async applyModel(node: Webcam, videoElement: HTMLVideoElement, canvas: HTMLCanvasElement) {
        const detections = await faceapi.detectSingleFace(videoElement).withFaceExpressions()
        if (!detections) {
            console.log("Detections are undefined :-( Model is not ready yet?")
        } else {
            const dims = faceapi.matchDimensions(canvas, videoElement, true);
            const resizedResult = faceapi.resizeResults(detections, dims);
            if (resizedResult) {
                faceapi.draw.drawDetections(canvas, resizedResult);
                faceapi.draw.drawFaceExpressions(canvas, resizedResult, 0.05)
            }
            let maxConfidenceEmotion = "neutral";
            let confidence = 0.0;
            for (let [emotion, newConfidence] of Object.entries(detections.expressions)) {
                if (newConfidence > confidence) {
                    maxConfidenceEmotion = emotion;
                    confidence = newConfidence;
                }
            }
            console.log(maxConfidenceEmotion);
            this.setState({ emotion: maxConfidenceEmotion })
        }
        setTimeout(() => this.applyModel(node, videoElement, canvas))
    }

    async startModel() {
        this.setState({ started: true });
        if (!this.state.ready) {
            await this.loadModel();
        }
        const videoElement = document.getElementById(this.webcamId) as HTMLVideoElement
        const canvas = document.getElementById(this.canvasId) as HTMLCanvasElement
        const node = this._child.current;
        if (node) {
            console.log("starting face detection loop")
            await this.applyModel(node, videoElement, canvas);
        }
    }
    render() {
        if (!this.state.started) {
            this.startModel();
        }
        return <div style={centerStyle} className={"webcam-component"}>
            <Row>
                <Webcam id={this.webcamId} ref={this._child} hidden={false}></Webcam>
                <canvas style={{ position: "absolute", top: "0px", left: "0px" }} id={this.canvasId}></canvas>
            </Row>
        </div>
    }
}
