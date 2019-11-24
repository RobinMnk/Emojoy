import React from 'react';
import '../App.css';
import { Icon, Menu, Layout, notification } from 'antd';
import { Info } from './Info';
import Pong from './Pong/Pong';
import { Emotion } from "../components/faceapi";
import { PracticeEasy } from '../components/PracticeEasy';
import { PracticeAdvanced } from '../components/PracticeAdvanced';
import WebRtc from '../components/web_rtc';
import { RockPaperScissors } from '../components/rockpaperscissors';
import PongCanvas from '../components/pong';
import MPPong from "../components/mp_pong";
const { Sider, Content } = Layout;
const { SubMenu, Item } = Menu;


interface IState {
    collapsed: boolean;
    currentPage: string;
}

class App extends React.Component<{}, IState> {
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            collapsed: false,
            currentPage: 'info',
        };
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    switchPage = (page: string) => {
        this.setState({
            currentPage: page
        })
    }

    renderContent = (key: string) => {
        console.log(key);
        switch(key) {
            case 'info':
                return <Info switchPage={p => this.switchPage(p)}/>;
            case 'pong':
                return <PongCanvas />;
            case 'game':
                return <Pong />;
            case 'rps':
                return <RockPaperScissors />;
            case 'practice1':
                return (
                    <PracticeEasy />
                );
            case 'pong_mult':
                return <MPPong />; // Pong Multiplayer component
            case 'practice2':
                return (
                    <PracticeAdvanced />
                );
            case 'practice3':
                return <p> Not Implemented Yet, Practice Scenario 3 </p>;
            case 'webrtc_test':
                return <WebRtc></WebRtc>
        }
    }

    render() {
        return (
            <Layout style={{ height: '100vh' }}>
                <Sider
                    collapsible={false}
                    collapsed={this.state.collapsed}
                    onCollapse={this.toggle}
                    width={168}
                >
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={[this.state.currentPage]}
                        onSelect={vals => this.setState({ currentPage: vals.key })}
                        openKeys={['3', 'games', 'multiplayer']}
                        selectedKeys={[this.state.currentPage]}
                    >
                        <Item key="info">
                            <Icon type="info-circle" />
                            <span>Information</span>
                        </Item>
                        
                        <SubMenu key="games"
                            title={
                                <span>
                                    <Icon type="user" />
                                    <span>Games</span>
                                </span>
                            }
                        >
                            <Item key="pong">
                                <Icon type="bulb" />
                                <span>Pong</span>
                            </Item>
                            <Item key="rps">
                                <Icon type="scissor" />
                                <span>R-P-S</span>
                            </Item>
                        </SubMenu>
                        <SubMenu key="3"
                            title={
                                <span>
                                    <Icon type="video-camera" />
                                    <span>Practice</span>
                                </span>
                            }
                        >
                            <Item key="practice1">
                                <Icon type="meh" />
                                <span>Forming</span>
                            </Item>
                            <Item key="practice2">
                                <Icon type="smile" />
                                <span>Transitions</span>
                            </Item>
                            {/* <Item key="practice3">
                                <Icon type="smile" />
                                <span>Scenario 3</span>
                            </Item> */}
                            {/* <Item key="webrtc_test">
                                <Icon type="meh" />
                                <span>Webrtc test</span>
                            </Item> */}
                        </SubMenu>
                        
                        <SubMenu key="multiplayer"
                            title={
                                <span>
                                    <Icon type="team" />
                                    <span>Multiplayer</span>
                                </span>
                            }
                        >
                            <Item key="pong_mult">
                                <Icon type="play-circle" />
                                <span>Pong 2P</span>
                            </Item>
                            {/* <Item key="rps_mult">
                                <Icon type="scissor" />
                                <span>R-P-S</span>
                            </Item> */}
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout>
                    <Content
                        style={{
                            margin: this.state.currentPage === 'pong' ? 0 : '16px',
                            padding: this.state.currentPage === 'pong' ? 0 : 24,
                            background: '#fff',
                            minHeight: 280,
                        }}
                    >
                        {this.renderContent(this.state.currentPage)}
                </Content>
                </Layout>
            </Layout>
        );
    }
}

export const emotion2emoji = (emotion: Emotion | undefined) => {
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

type Placement = 'topRight' | 'topLeft'

export const feedbackNotification = (place?: Placement) => {
    notification.open({
        message: "NICE! 🙌",
        duration: 1.5,
        placement: place ? place : 'topRight',
        style: {
            backgroundColor: "lightgreen"
        }
    })
}

export default App;
