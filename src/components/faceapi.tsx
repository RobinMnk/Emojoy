import React, { Component } from 'react';
import { Row } from 'antd';

import * as faceapi from "face-api.js";

const centerStyle = {
    justifyContent: 'space-around',
    display: 'flex'
};

type Emotion = 'neutral' | 'happy' | 'sad' | 'suprised' | 'angry' | 'disgusted' | 'feared'

interface IProps {
    setEmotion(em: Emotion): void;
}

interface IFaceAPIState {
    ready: boolean;
    started: boolean;
    emotion?: string;
}

/** USAGE:
 *  <FaceAPI
 *      setEmotion={em => handleEmotionChange(em)}
 *  />
 */
export default class FaceAPI extends Component<IProps, IFaceAPIState> {
    webcamId: string = "webcam";
    canvasId: string = "overlay";
    constructor(props: Readonly<IProps>) {
        super(props);
        this.state = { ready: false, started: false };
    }

    async loadModel() {
        const MODEL_URL = '/models';
        await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
        await faceapi.loadAgeGenderModel(MODEL_URL);
        await faceapi.loadFaceExpressionModel(MODEL_URL);
        this.setState({ ready: true });
        console.log("loaded models")
    }

    async applyModel(videoElement: HTMLVideoElement, canvas: HTMLCanvasElement) {
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
            if (this.state.emotion !== maxConfidenceEmotion) {
                this.setState({ emotion: maxConfidenceEmotion });
                this.props.setEmotion(maxConfidenceEmotion as Emotion);
            }
        }
        setTimeout(() => this.applyModel(videoElement, canvas), 50);
    }

    async startModel() {
        this.setState({ started: true });
        if (!this.state.ready) {
            await this.loadModel();
        }
        const videoElement = document.getElementById(this.webcamId) as HTMLVideoElement
        const canvas = document.getElementById(this.canvasId) as HTMLCanvasElement
        console.log("starting face detection loop")
        await this.applyModel(videoElement, canvas);
    }
    async componentDidMount() {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById(this.webcamId) as HTMLMediaElement;
        video.srcObject = stream;
        video.play()
        if (!this.state.started) {
            this.startModel();
        }
    }
    render() {
        return <div style={centerStyle} className={"webcam-component"}>
            <Row>
                <video id={this.webcamId}></video>
                <canvas style={{ position: "absolute", top: "0px", left: "0px" }} id={this.canvasId}></canvas>
            </Row>
        </div>
    }
}
