import React from 'react'
import { Typography, Button, Row, Col, Table, Icon } from 'antd';
import FaceAPI, { Emotion } from './faceapi';
const { Title } = Typography;

const SCORING_TYPE : 'fixed_time' | 'fixed_rows' = 'fixed_rows';
const MAX_NUMBER_OF_ROWS = 3;
const TIME_IN_SECONDS = 60;

const centerStyle = {
    justifyContent: 'space-around',
    display: 'flex'
};

const emotions = ['neutral', 'happy', 'sad', 'surprised', 'angry'];
type EmState = 'open' | 'done'

interface Entry {
    round: number;
    neutral: EmState;
    happy: EmState;
    sad: EmState;
    surprised: EmState;
    angry: EmState;
}

interface IProps {

}

interface IState {
    loading: boolean;
    phase: 'info' | 'playing' | 'finished'
    emotionTable: Entry[];
    score: number;
    startTime?: number;
}

export class PracticeAdvanced extends React.Component<IProps, IState> {
    constructor(props: Readonly<IProps>) {
        super(props);
        this.state = {
            loading: true,
            phase:'info',
            emotionTable: [],
            score: 0,
        };
    }

    setupGame() {
        const emptyTable = [];
        emptyTable.push(newEntry(1));

        this.setState({
            phase: 'playing',
            emotionTable: emptyTable,
            startTime: Date.now()
        });
    }

    finishGame() {
        let score = 0;
        if(SCORING_TYPE === 'fixed_time') {
            const rows = this.state.emotionTable.length-1;
            score = rows + numCorrect(this.state.emotionTable[rows])
        }

        if(SCORING_TYPE === 'fixed_rows') {
            const millis = Date.now() - this.state.startTime;
            score = Math.floor(millis/1000);
        }

        this.setState({
            phase: 'finished',
            score: score
        });
    }

    getScore = () => (
        SCORING_TYPE === "fixed_rows" ? (
            `Your Time: ${this.state.score} seconds`
        ) : (
            `Your Score: ${this.state.score} points`
        )
    );

    emotionChange(em: Emotion) {
        if(this.state.phase === 'playing') {
            const table = this.state.emotionTable;
            const currentEntry = table[table.length-1];
            
            if(currentEntry[em as string] === 'open') {
                table.pop();
                currentEntry[em] = 'done';
                table.push(currentEntry);

                if(isDone(currentEntry)) {

                    if(table.length === MAX_NUMBER_OF_ROWS) {
                        this.finishGame();
                        return;
                    }

                    table.push(newEntry(table.length+1));
                }
                this.setState({
                    emotionTable: table,
                });
            }
        }
    }

    renderAux() {
        if(this.state.phase === 'info') {
            return (
                <div>
                    <Title>Emotion Change</Title>
                    <p> Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gube ... </p>

                    <div style={{ justifyContent: 'space-around', display: 'flex' }}>
                        <Button
                            onClick={() => this.setupGame()}
                            type='primary'
                            loading={this.state.loading}
                        > 
                            {this.state.loading ? "Loading ..." : "Start!"}
                        </Button>
                    </div>
                </div>
            );
        }
        if (this.state.phase === 'playing' || this.state.phase === 'finished') {
            return (
                <div>
                    <Title>Emotion Change</Title>
                    <TableComponent
                        data={this.state.emotionTable}
                    />
                    {this.state.phase === 'finished' ? (
                        <>
                            <div style={{ justifyContent: 'space-around', display: 'flex' }}>
                                <Title level={4}>Finished! {this.getScore()}</Title>
                            </div>
                            <div style={centerStyle}>
                                <Button
                                    onClick={() => this.setState({phase: 'info'})}
                                >Back</Button>
                                <Button
                                    type='primary'
                                    onClick={() => this.setupGame()}
                                >Play again</Button>
                            </div>
                        </>
                    ) : null }
                </div>
            );
        }
    }

    render() {
        return (
            <Row>
                <Col span={16}>
                    <FaceAPI
                        setEmotion={em => this.emotionChange(em)}
                        noCenter={true}
                        onRunning={() => this.setState({ loading: false })}
                    />
                </Col>
                <Col span={8}>{this.renderAux()}</Col>
            </Row>
        );
    }
}

const isDone = (entry: Entry) => {
    let done = true;
    emotions.forEach(em => {
        if(entry[em] === 'open'){
            done = false;
        }
    });
    return done;
}

const numCorrect = (entry: Entry) =>
    emotions.filter(em => entry[em] === 'done').length;

const newEntry = (round: number) : Entry => {
    const entry: Entry = {} as Entry;
    entry['round'] = round;
    emotions.forEach(em => {
        entry[em] = 'open';
    });
    return entry;
}

const columns = () => {
    const cols = emotions.map(em => ({
        title: em,
        dataIndex: em,
        key: em,
        render: (done: any) => renderDone(done),
    }));

    cols.unshift({
        title: '#',
        dataIndex: 'round',
        key: 'round',
        render: (x: any) => x,
    });
    return cols;
}

const renderDone = (done: EmState) => (
    <div style={centerStyle}>
        {(done === 'done') ? (
            <Icon style={{fontSize: 20}} type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
        ) : (
            <Icon type="minus-circle" theme="twoTone" twoToneColor="#eb2f96" />
        )}
    </div>
)

const TableComponent = (props: any) => {
    return(
        <Table
            columns={columns()}
            dataSource={props.data}
            pagination={false}
            size={'small'}
            bordered={true}
        />
    );
}
