import React from 'react'
import FaceAPI, { Emotion } from "./faceapi";
import { Row, Col, Card, Typography, Button } from "antd";
const { Title } = Typography;

interface IProps {

}

interface IState {
    started: boolean;
    currentEmotion?: Emotion;
    emotionTask?: Emotion;
    correctness?: boolean;
}
const emotion2emoji = (emotion: Emotion | undefined) => {
    switch (emotion) {
        case "neutral":
            return "😐";
        case "happy":
            return "😄";
        case "sad":
            return "😞";
        case "surprised":
            return "😯";
        case "angry":
            return "😠";
        case "disgusted":
            return "🤮";
        case "feared":
            return "😬";
        default:
            return "😐";
    }
}
export class PracticeEasy extends React.Component<IProps, IState> {
    constructor(props: Readonly<IProps>) {
        super(props);
        this.state = { emotionTask: "neutral", correctness: false, started: false };
    }
    setEmotion(emotion: Emotion) {
        this.setState({
            currentEmotion: emotion,
            correctness: emotion === this.state.emotionTask
        });
    }
    componentDidUpdate() {
        let newTask: Emotion;
        if (this.state.correctness) {
            if (this.state.emotionTask === "neutral") {
                const emotions: Emotion[] = ['happy', 'sad', 'surprised', 'angry'];
                newTask = emotions[Math.floor((Math.random() * emotions.length))]
            } else {
                newTask = "neutral";
            }
            console.log(`Switching from ${this.state.emotionTask} to ${newTask}`)
            setTimeout(() => {
                this.setState({ emotionTask: newTask, correctness: false })
            }, 1)
        }
    }
    shuffle() {
        this.setState({ emotionTask: "neutral", correctness: true });
    }
    render() {
        return <div>
            {!this.state.started ? <div><p>
                <Title>Expressing Emotions</Title>
                In this step you are going to practice emotional facial expressions. Press start and have fun!
                </p>
                <Button onClick={() => this.setState({ started: true })} type="primary">Start</Button>
            </div> : null
            }
            <Row>
                <FaceAPI setEmotion={em => this.setEmotion(em)}></FaceAPI>
            </Row>
            {this.state.started ? <div>
                <Row type="flex" justify="space-around">
                    <Title>
                        Task: {this.state.emotionTask} - {emotion2emoji(this.state.emotionTask)}
                    </Title>
                </Row>
                <Row type="flex" justify="center">
                    <Button onClick={() => this.shuffle()} type="primary" size="large">Skip</Button>
                </Row></div> : null
            }
        </div>
    }
}
const introductionText = () => {
    return
}
