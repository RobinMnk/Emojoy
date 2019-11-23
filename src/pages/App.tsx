import React from 'react';
import '../App.css';
import { Icon, Menu, Layout, Typography, notification } from 'antd';
import { Info } from './Info';
import Pong from './Pong/Pong';
import FaceAPI, { Emotion } from "../components/faceapi";
import { PracticeEasy } from '../components/PracticeEasy';
import { PracticeAdvanced } from '../components/PracticeAdvanced';
const { Sider, Content } = Layout;
const { SubMenu, Item } = Menu;
const { Title } = Typography;


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
            case 'game':
                return <Pong />;
            case 'practice1':
                return (
                    <PracticeEasy
    
                    />
                );
            case 'practice2':
                return (
                    <PracticeAdvanced />
                );
            case 'practice3':
                return <p> Not Implemented Yet, Practice Scenario 3 </p>;
        }
    }

    render() {
        return (
            <Layout style={{ height: '100vh' }}>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.toggle}>
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={[this.state.currentPage]}
                        onSelect={vals => this.setState({ currentPage: vals.key })}
                        openKeys={['3']}
                        selectedKeys={[this.state.currentPage]}
                    >
                        <Item key="info">
                            <Icon type="info-circle" />
                            <span>Information</span>
                        </Item>
                        <Item key="game">
                            <Icon type="user" />
                            <span>Play</span>
                        </Item>
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
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout>
                    <Content
                        style={{
                            margin: '16px',
                            padding: 24,
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
