import React from 'react'
import FaceAPI, { Emotion } from "./faceapi";
import { Row, Typography, Button, Col } from "antd";
import { emotion2emoji } from '../pages/App';
const { Title } = Typography;

interface IProps {

}

interface IState {
    started: boolean;
    ended: boolean;
    ready: boolean;
    lastChoice?: GameChoice;
    currentChoice?: GameChoice;
    botChoice?: GameChoice;
    victory?: number;
    initialRun?: boolean;
    remainingTime?: number;
}

type GameChoice = "rock" | "paper" | "scissors" | ""

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
            return ""
    }
}
const playerWon = (player: GameChoice, bot: GameChoice) => {
    if (!player) {
        return -1
    }
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
        this.state = { victory: 0, started: false, ended: false, ready: false };
    }
    setEmotion(emotion: Emotion) {
        this.setState({ currentChoice: emotion2choice(emotion) })
    }
    restart() {
        this.setState(
            { started: true, remainingTime: 5, ended: false },
            () => this.countdownIteration()
        );
    }
    countdownIteration() {
        if (this.state.remainingTime > 0) {
            this.setState({ remainingTime: this.state.remainingTime - 1 })
            setTimeout(() => { this.countdownIteration() }, 1000)
        } else {
            const options: GameChoice[] = ["rock", "paper", "scissors"];
            const botsChoice = options[Math.floor((Math.random() * options.length))]
            this.setState({
                remainingTime: undefined,
                ended: true,
                started: false,
                botChoice: botsChoice,
                victory: playerWon(this.state.currentChoice, botsChoice),
                lastChoice: this.state.currentChoice,
            })
        }
    }
    victoryText() {
        if (this.state.victory === 1) {
            return "You won!!!"
        } else if (this.state.victory === 0) {
            return "Looks like you have to play again"
        } else {
            return "You lost!"
        }
    }
    render() {
        return <div>
            <Row type="flex" justify="center">
                <Title>Rock {emotion2emoji("angry")}Paper{emotion2emoji("happy")}Scissors{emotion2emoji("surprised")}</Title>
            </Row>
            <Row type="flex" justify="space-around">
                {
                    !this.state.ended ? <Title>
                        Your current choice {choice2symbol(this.state.currentChoice)}
                    </Title> : <Title>
                            Your choice was {choice2symbol(this.state.lastChoice)}
                        </Title>
                }
            </Row>

            {this.state.started ? <div>
                <Row type="flex" justify="space-around">
                    <Title>
                        Remaining Time {this.state.remainingTime}
                    </Title>
                </Row>
            </div> : null
            }
            {this.state.ended ? <div>
                <Row type="flex" justify="space-around">
                    <Col>
                        <Title>
                            The bot has chosen {choice2symbol(this.state.botChoice)}
                        </Title>
                    </Col>
                </Row>
                <Row type="flex" justify="space-around">
                    <Title>
                        {this.victoryText()}
                    </Title>
                </Row>
            </div> : null
            }
            {!this.state.started ? <div><Row type="flex" justify="center"><p>
            </p>
            </Row>
                <Row type="flex" justify="center" >
                    <Button
                        onClick={() => this.restart()}
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
        </div>;
    }
}
