import React from 'react';
import './App.css';
import { Icon, Menu, Layout, notification, Button } from 'antd';
import { Info } from './Info';
import { Emotion } from "../components/faceapi";
import { PracticeEasy } from './PracticeEasy';
import { PracticeAdvanced } from './PracticeAdvanced';
import WebRtc from '../components/web_rtc';
import { RockPaperScissors } from './RockPaperScissors';
import PongCanvas from '../pages/PongPage';
import MPPong from "../components/mp_pong";
const { Sider, Content, Header, Footer } = Layout;
const { SubMenu, Item } = Menu;


interface IState {
  collapsed: boolean;
  currentPage: string;
  mobile: boolean;
  siderVisible: boolean;
}

class App extends React.Component<{}, IState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      mobile: false,
      collapsed: false,
      currentPage: 'info',
      siderVisible: true,
    };
  }
  componentDidMount() {
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile.bind(this));
  }

  checkMobile = () => {
    const mobile = window.innerWidth < 768;
    this.setState({ mobile, siderVisible: !mobile });
  }

  toggle = () => {
    this.setState({
      siderVisible: !this.state.siderVisible,
    });
  };

  switchPage = (page: string) => {
    this.setState({
      currentPage: page
    })
  }

  renderContent = (key: string) => {
    switch (key) {
      case 'info':
        return <Info switchPage={p => this.switchPage(p)} />;
      case 'pong':
        return <PongCanvas mobile={this.state.mobile} />;
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
          <PracticeAdvanced mobile={this.state.mobile} />
        );
      case 'practice3':
        return <p> Not Implemented Yet, Practice Scenario 3 </p>;
      case 'webrtc_test':
        return <WebRtc></WebRtc>
    }
  }

  menu = () => (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={[this.state.currentPage]}
      onSelect={vals => this.setState({ currentPage: vals.key })}
      openKeys={['3', 'games', 'multiplayer']}
      selectedKeys={[this.state.currentPage]}
      onClick={this.toggle}
    >
      <Item key="info">
        <Icon type="info-circle" />
        <span>Information</span>
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
      </SubMenu>
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
      {/* <SubMenu
                key="multiplayer"
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
            </SubMenu> */}
    </Menu>
  )

  renderDesktop() {
    return (
      <Layout style={{ height: '100vh' }}>
        <Sider
          collapsible={false}
          collapsed={this.state.collapsed}
          onCollapse={this.toggle}
          width={168}
        >
          {this.menu()}
        </Sider>
        <Layout>
          <Content
            style={{
              margin: 0,
              // margin: this.state.currentPage === 'pong' || this.state.currentPage === 'pong_mult' ? 0 : '16px',
              padding: ['pong', 'pong_mult', 'info'].includes(this.state.currentPage) ? 0 : 24,
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

  renderMobile() {
    return (
      <Layout style={{ height: '100vh' }}>
        <Header
          style={{
            height: 50,
            lineHeight: '50px',
            padding: '0px 35px'
          }}
        >
          <div>
            <div style={{
              position: 'absolute',
              left: 0,
              textAlign: 'center',
              color: '#bfbfbf',
              top: 0,
              width: '100%',
            }}>
              <span>Emojoy</span>
            </div>
            <div style={{
              position: 'relative'
            }}>
              <Icon
                type='menu'
                style={{
                  color: 'white',
                  fontSize: 20,
                  height: '50px',
                }}
                onClick={this.toggle}
              />
            </div>
          </div>
        </Header>
        <Layout>
          {
            this.state.siderVisible ?
              <Sider
                collapsible={false}
                collapsed={this.state.collapsed}
                onCollapse={this.toggle}
                width={168}
                style={{ zIndex: 1 }}
              >
                {this.menu()}
              </Sider>
              : null
          }
          <Content
            style={{
              // margin: this.state.currentPage === 'pong' || this.state.currentPage === 'pong_mult' ? 0 : '16px',
              padding: ['pong', 'pong_mult', 'info'].includes(this.state.currentPage) ? 0 : 10,
              margin: 0,
              background: '#fff',
              minHeight: 280,
              position: 'absolute',
              left: 0,
              zIndex: 0,
            }}
          >
            {this.renderContent(this.state.currentPage)}
          </Content>
        </Layout>
      </Layout>
    );
  }

  render() {
    return this.state.mobile ? this.renderMobile() : this.renderDesktop();
  }
}

export function AppFooter() {
  return <Footer style={{ textAlign: 'center' }}>
    Emojoy ©2019
    <Button type='link' icon='coffee' href='https://www.buymeacoffee.com/emojoy' />
    <Button type='link' icon='github' href='https://github.com/RobinMnk/Emojoy' />
    <Button type='link' icon='mail' href='mailto:emojoyapp@gmail.com' />
  </Footer>
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
