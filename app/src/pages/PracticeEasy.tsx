import React, { useState, useEffect } from 'react'
import FaceAPI, { Emotion } from "../components/faceapi";
import { emotion2emoji, feedbackNotification } from '../Utils';
import { Row, Typography, Button } from "antd";
const { Title } = Typography;

export const PracticeEasy = () => {

    const [task, setTask] = useState('neutral' as Emotion);
    const [correct, setCorrect] = useState(false);
    const [started, setStarted] = useState(false);
    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        let newTask: Emotion;
        if (correct && started) {
            if (task === "neutral") {
                const emotions: Emotion[] = ['happy', 'sad', 'surprised', 'angry'];
                newTask = emotions[Math.floor((Math.random() * emotions.length))];
            } else {
                newTask = "neutral";
                feedbackNotification();
            }
            console.log(`Switching from ${task} to ${newTask}`);
            setTask(newTask);
            setCorrect(false);
        }
    }, [correct, started, task]);
    
    const shuffle = () => {
        setTask('neutral');
        setCorrect(true);
    }

    return (
        <div style={{marginBottom: "30"}}>
            <Row type="flex" justify="center">
                <Title>Forming Emotions</Title>
            </Row>
            {!started ? <div><Row type="flex" justify="center"><p>                
                In this step you are going to practice emotional facial expressions. Press start and have fun!
                </p>
            </Row>
                <Row type="flex" justify="center" >
                    <Button
                    onClick={() => setStarted(true)}
                    type="primary"
                    loading={!ready}
                    >{ready ? "Start" : "Loading"}</Button>
                </Row>
            </div> : null
            }
            <Row>
                <FaceAPI
                setEmotion={em => setCorrect(task === em)}
                onRunning={() => setReady(true)}
                ></FaceAPI>
            </Row>
            {started ? <div>
                <Row type="flex" justify="space-around">
                    <Title>
                        Try to look {task} - {emotion2emoji(task)}
                    </Title>
                </Row>
                <Row type="flex" justify="center">
                    <Button onClick={shuffle} type="primary" size="large">Skip</Button>
                </Row></div> : null
            }
        </div>
    );
}
