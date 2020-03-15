import React, { useState } from 'react'
import { Typography, Button, Table, Icon } from 'antd';
import FaceAPI, { Emotion } from '../components/faceapi';
import { emotion2emoji, feedbackNotification } from '../Utils';
const { Title } = Typography;

const SCORING_TYPE : 'fixed_time' | 'fixed_rows' = 'fixed_rows' as 'fixed_time' | 'fixed_rows';
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

export const PracticeAdvanced = (props: IProps) => {

    const [loading, setLoading] = useState(true);
    const [phase, setPhase] = useState('info');
    const [emotionTable, setTable] = useState([]);
    const [score, setScore] = useState(0);
    const [startTime, setStartTime] = useState(0);

    const setupGame = () => {
        const emptyTable = [];
        emptyTable.push(newEntry(1));

        setPhase('playing');
        setTable(emptyTable);
        setStartTime(Date.now());
    }

    const finishGame = () => {
        let totalScore = 0;
        if(SCORING_TYPE === 'fixed_time') {
            const rows = emotionTable.length-1;
            totalScore = rows + numCorrect(emotionTable[rows])
        }

        if(SCORING_TYPE === 'fixed_rows') {
            const millis = Date.now() - startTime;
            totalScore = Math.floor(millis/1000);
        }

        setPhase('finished');
        setScore(totalScore);
    }

    const emotionChange = (em: Emotion) => {
        debugger;
        if(phase === 'playing') {
            const table = emotionTable;
            const currentEntry = table[table.length-1];
            
            if(currentEntry[em as string] === 'open') {
                table.pop();
                currentEntry[em] = 'done';
                table.push(currentEntry);

                if(!props.mobile) {
                    feedbackNotification('topLeft');
                }

                if(isDone(currentEntry)) {
                    if(table.length === MAX_NUMBER_OF_ROWS) {
                        finishGame();
                        return;
                    }

                    table.push(newEntry(table.length+1));
                }
                setTable([...table]);
            }
        }
    }
    
    const renderFinished = () => (
        <>
            <div style={{ justifyContent: 'space-around', display: 'flex' }}>
                <Title level={4}>Finished! {formatScore(score)}</Title>
            </div>
            <div style={centerStyle}>
                <Button
                    onClick={() => setPhase('info')}
                >Back</Button>
                <Button
                    type='primary'
                    onClick={() => setupGame()}
                >Play again</Button>
            </div>
        </>
    );

    const renderAux = () => {
        const videoComponent = (
            props.mobile ? (
                <div>
                    <FaceAPI
                        setEmotion={em => emotionChange(em)}
                        noCenter={true}
                        onRunning={() => setLoading(false)}
                    />
                </div> ) : null
        );

        if(phase === 'info') {
            return (
                <div>
                    <Title>Transition Game</Title>
                    { videoComponent }
                    { description(loading, setupGame) }
                </div>
            );
        }
        if (phase === 'playing' || phase === 'finished') {
            return (
                <div>
                    <Title>Transition Game</Title>
                    { videoComponent}
                    <TableComponent data={emotionTable} />
                    {phase === 'finished' ? (
                        renderFinished()
                    ) : null }
                </div>
            );
        }
    }

    const renderDesktop = () => (
        <div style={{width: '100%', display: 'flex'}}>
            <div style={{flex: '0 0 65%'}}>
                <FaceAPI
                    setEmotion={em => emotionChange(em)}
                    noCenter={true}
                    onRunning={() => setLoading(false)}
                />
            </div>
            <div style={{flex: '1', padding: '0 12px'}}>
                { renderAux() }
            </div>
        </div>
    );

    console.log("rerender!");
    return props.mobile ? renderAux() : renderDesktop();
}

const formatScore = (score: number) => (
    SCORING_TYPE === "fixed_rows" ? (
        `Your Time: ${score} seconds`
    ) : (
        `Your Score: ${score} points`
    )
);

const description = (loading: boolean, setup:()=>void) => (
    <div style={{padding: 10}}>
        <p> Here you can practice the transitions between expressions. </p>
        <p> Try to form every expression from the table, the order does not matter. Once you completed every
            face, you advance to the next round and go again. You will play three rounds. </p>
        <p>Have Fun!</p>

        <div style={{ justifyContent: 'space-around', display: 'flex' }}>
            <Button
                onClick={() => setup()}
                type='primary'
                loading={loading}
            > 
                {loading ? "Loading ..." : "Start!"}
            </Button>
        </div>
    </div>
);

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

const TableComponent = (props: {data: any[]}) => 
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
