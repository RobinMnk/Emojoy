import React from 'react'
import { Typography, Button, Table, Icon } from 'antd';
import FaceAPI, { Emotion } from '../components/faceapi';
import { emotion2emoji, feedbackNotification } from './App';
const { Title } = Typography;

const SCORING_TYPE : 'fixed_time' | 'fixed_rows' = 'fixed_rows';
const MAX_NUMBER_OF_ROWS = 3;

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
    mobile: boolean;
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

                if(!this.props.mobile) {
                    feedbackNotification('topLeft');
                }

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
        const mobile = this.props.mobile;
        if(this.state.phase === 'info') {

            const description = (
                <div style={{padding: 10}}>
                    <p> Here you can practice the transitions between expressions. </p>
                    <p> Try to form every expression from the table on the right. Once you completed every
                        face, you advance to the next round and go again. You will play three rounds. </p>
                    <p>Have Fun!</p>

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

            return (
                <div>
                    <Title>Transition Game</Title>
                    { mobile ? (
                            <div>
                                <FaceAPI
                                    setEmotion={em => this.emotionChange(em)}
                                    noCenter={true}
                                    onRunning={() => this.setState({ loading: false })}
                                />
                            </div> ) : null }
                    { description }
                </div>
            );
        }
        if (this.state.phase === 'playing' || this.state.phase === 'finished') {
            return (
                <div>
                    <Title>Transition Game</Title>
                    { mobile ? (
                            <div>
                                <FaceAPI
                                    setEmotion={em => this.emotionChange(em)}
                                    noCenter={true}
                                    onRunning={() => this.setState({ loading: false })}
                                />
                            </div> ) : null }
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

    renderDesktop() {
        return (
            <div style={{width: '100%', display: 'flex'}}>
                <div style={{flex: '0 0 65%'}}>
                    <FaceAPI
                        setEmotion={em => this.emotionChange(em)}
                        noCenter={true}
                        onRunning={() => this.setState({ loading: false })}
                    />
                </div>
                <div style={{flex: '1', padding: '0 12px'}}>
                    { this.renderAux() }
                </div>
            </div>
        );
    }

    renderMobile() {
        return this.renderAux();
    }

    render() {
        return this.props.mobile ? this.renderMobile() : this.renderDesktop();
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
    entry['key'] = `${round}`
    emotions.forEach(em => {
        entry[em] = 'open';
    });
    return entry;
}

const columns = () => {
    const cols = emotions.map(em => ({
        title: `${em} ${emotion2emoji(em as Emotion)}`,
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
            style={{
                minWidth: 330
            }}
        />
    );
}
