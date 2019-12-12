import React from 'react'
import FaceAPI, { Emotion } from "../components/faceapi";
import { Row, Typography, Button, Col, Table } from "antd";
const { Title } = Typography;

const centerStyle = {
    justifyContent: 'space-around', 
    display: 'flex',
    fontSize: 30,
};

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
        case "fearful":
            return "😬";
        default:
            return "😐";
    }
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

const legenddata = [
    {
        rock: emotion2emoji('angry'),
        paper: emotion2emoji('happy'),
        scissors: emotion2emoji('surprised'),
    }
];

const columnData = [
    {
        title: <Title level={3}>Rock</Title>,
        key: 'rock',
        dataIndex: 'rock',
        render: (x: any) => renderCenter(x),
    },
    {
        title: <Title level={3}>Paper</Title>,
        key: 'paper',
        dataIndex: 'paper',
        render: (x: any) => renderCenter(x),
    },
    {
        title: <Title level={3}>Scissors</Title>,
        key: 'scissors',
        dataIndex: 'scissors',
        render: (x: any) => renderCenter(x),
    }
];

const renderCenter = (x: any) => (
    <div style={centerStyle}>{x}</div>
);

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
            // return "Looks like you have to play again"
            return 'Tie!'
        } else {
            return "You lost!"
        }
    }
    render() {
        return <div>
            <Row type="flex" justify="center">
                {/* <Title>Rock {emotion2emoji("angry")}Paper{emotion2emoji("happy")}Scissors{emotion2emoji("surprised")}</Title> */}
                
                <Col span={10}>
                    <div style={{ display: "flex", justifyContent:"space-around" }}>
                        <Table
                            dataSource={legenddata}
                            columns={columnData}
                            pagination={false}
                            size={'small'}
                            bordered={true}
                        />
                    </div>
                </Col>
                <Col span={14}>
                    <div style={{ display: "flex", justifyContent:"space-around" }}>
                        {
                        !this.state.ended ?  (
                            <Title>
                                Your current choice {choice2symbol(this.state.currentChoice)}
                            </Title>) : (<Title>
                                    Your choice was {choice2symbol(this.state.lastChoice)}
                                </Title>)
                        }
                    </div>
                    <div>
                        {this.state.started ?
                            <div style={{ display: "flex", justifyContent:"space-around" }}>
                                <Title level={4}>
                                    Remaining Time {this.state.remainingTime}
                                </Title>
                            </div> : null }
                    </div>
                    {!this.state.started ? <div><Row type="flex" justify="center"><p>
                    </p>
                    </Row>
                        <Row type="flex" justify="center" >
                            <Button
                                onClick={() => this.restart()}
                                type="primary"
                                loading={!this.state.ready}
                            >{this.state.ready ? `Start ${this.state.ended ? 'again' : ''}` : "Loading"}</Button>
                        </Row>
                    </div> : null
                    }
                </Col>
            </Row>
            {this.state.ended ? <div>
                <Row type="flex" justify="space-around">
                    <Col>
                        <Title level={3}>
                        {this.victoryText()} - The bot {this.victoryText() === 'Tie!' ? 'also' : ''} chose {choice2symbol(this.state.botChoice)}
                        </Title>
                    </Col>
                </Row>
                {/* <Row type="flex" justify="space-around">
                    <Title>
                        {this.victoryText()}
                    </Title>
                </Row> */}
            </div> : null
            }
            <Row style={{marginTop: 20}}>
                <FaceAPI
                    setEmotion={em => this.setEmotion(em)}
                    onRunning={() => this.setState({ ready: true })}
                ></FaceAPI>
            </Row>
        </div>;
    }
}
