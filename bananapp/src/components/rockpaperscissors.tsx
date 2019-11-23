import React from 'react'
import FaceAPI, { Emotion } from "./faceapi";
import { Row, Typography, Button } from "antd";
const { Title } = Typography;

interface IProps {

}

interface IState {
    started: boolean;
    ready: boolean;
    currentChoice?: GameChoice;
    victory?: number;
    initialRun?: boolean;
}

type GameChoice = "rock" | "paper" | "scissors"

const choice2symbol = (choice: GameChoice) => {
    switch (choice) {
        case "rock":
            return "🏔"
        case "paper":
            return "🧻"
        case "scissors":
            return "✂️"
        default:
            return "🤷‍♂️"
    }
}
const emotion2choice = (emotion: Emotion): GameChoice => {
    switch (emotion) {
        case "happy":
            return "paper"
        case "angry":
            return "rock"
        case "surprised":
            return "scissors"
        default:
            return "paper"
    }
}
const playerWon = (player: GameChoice, bot: GameChoice) => {
    if (player === bot) {
        return 0;
    }
    if (player === "rock") {
        if (bot === "paper") {
            return -1;
        } else {
            return 1;
        }
    } else if (player === "scissors") {
        if (bot === "rock") {
            return -1;
        } else {
            return 1;
        }
    } else {
        if (bot === "scissors") {
            return -1;
        } else {
            return 1;
        }
    }
}

export class RockPaperScissors extends React.Component<IProps, IState> {
    constructor(props: Readonly<IProps>) {
        super(props);
        this.state = { victory: 0, started: false, ready: false };
    }
    setEmotion(emotion: Emotion) {
        this.setState({ currentChoice: emotion2choice(emotion)})
    }
    restart() {
        
    }
    render() {
        return <div>
            <Row type="flex" justify="center">
                <Title>Rock Paper Scissors</Title>
            </Row>
            {!this.state.started ? <div><Row type="flex" justify="center"><p>

            </p>
            </Row>
                <Row type="flex" justify="center" >
                    <Button
                        onClick={() => this.setState({ started: true })}
                        type="primary"
                        loading={!this.state.ready}
                    >{this.state.ready ? "Start" : "Loading"}</Button>
                </Row>
            </div> : null
            }
            <Row>
                <FaceAPI
                    setEmotion={em => this.setEmotion(em)}
                    onRunning={() => this.setState({ ready: true })}
                ></FaceAPI>
            </Row>
            {this.state.started ? <div>
                <Row type="flex" justify="space-around">
                    <Title>
                        Your current choice {choice2symbol(this.state.currentChoice)}}
                    </Title>
                </Row>
            </div> : null
            }
        </div>;
    }
}
