import React, { Component } from 'react'; // let's also import Component
import { Card } from 'antd';
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
    constructor(props: {}) {
        super(props);
        this.state = {ready: false};
        this.loadModel();
    }

    async loadModel() {
        const MODEL_URL = '../../models/';
        debugger;
        await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
        await faceapi.loadFaceLandmarkModel(MODEL_URL)
        await faceapi.loadFaceRecognitionModel(MODEL_URL)
        this.setState({ready: true});
    }

    // applyModel() {
    //     if (!this.state.ready) {
    //         return;
    //     }
    //     let faceDescriptions = faceapi.detectSingleFace()
    // }

    render() {
        return <div style={centerStyle}>
            <Row>
                <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src="../../images/glasses-for-round-faces.jpg" />}
                >
                </Card>
            </Row>
        </div>
    }
}
