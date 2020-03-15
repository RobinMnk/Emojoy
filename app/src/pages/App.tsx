import React, { useState } from 'react';
import '../App.css';
import { Icon, Menu, Layout, Button } from 'antd';
import { Info } from './Info';
import { PracticeEasy } from './PracticeEasy';
import { PracticeAdvanced } from './PracticeAdvanced';
import WebRtc from '../components/web_rtc';
import { RockPaperScissors } from './RockPaperScissors';
import PongCanvas from '../pages/PongPage';
import MPPong from "../components/mp_pong";
import { useWindowSize } from '../Utils';
const { Sider, Content, Header, Footer } = Layout;
const { SubMenu, Item } = Menu;

interface IProps {

}

const MainComponent = (props: IProps) => {
    
    const [mobile, setMobile] = useState(window.innerWidth < 768);
    const [currentPage, switchPage] = useState('info');
    const [siderVisible, showSider] = useState(false);
    useWindowSize(newSize => setMobile(newSize.width < 768));

    const renderContent = () => {
        switch (currentPage) {
            case 'info':
                return <Info switchPage={p => switchPage(p)} />;
            case 'pong':
                return <PongCanvas mobile={mobile} />;
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
                    <PracticeAdvanced mobile={mobile} />
                );
            case 'practice3':
                return <p> Not Implemented Yet, Practice Scenario 3 </p>;
            case 'webrtc_test':
                return <WebRtc></WebRtc>
        }
    }

    const menu = (
        <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[currentPage]}
            onSelect={vals => switchPage(vals.key)}
            openKeys={['3', 'games', 'multiplayer']}
            selectedKeys={[currentPage]}
            // onClick={this.toggle}
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
        </Menu>
    );

    const renderDesktop = (
        <Layout style={{ height: '100vh' }}>
            <Sider
                collapsible={false}
                collapsed={false}
                width={168}
            >
                {menu}
            </Sider>
            <Layout>
                <Content
                    style={{
                        margin: 0,
                        // margin: this.state.currentPage === 'pong' || this.state.currentPage === 'pong_mult' ? 0 : '16px',
                        padding: currentPage === 'pong' || currentPage === 'pong_mult' ? 0 : 24,
                        background: '#fff',
                        minHeight: 280,
                    }}
                >
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );

    const renderMobile = (
        <>
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
                            onClick={_ => showSider(!siderVisible)}
                        />
                    </div>
                </div>
            </Header>
            <Layout>
                {
                    siderVisible ? 
                    <Sider
                        collapsible={false}
                        collapsed={false}
                        onClick={_ => showSider(!siderVisible)}
                        width={168}
                        style={{zIndex: 1}}
                    >
                        {menu}
                    </Sider>
                    : null
                }
                <Content
                    style={{
                        padding: currentPage === 'pong' || currentPage === 'pong_mult' ? 0 : 10,
                        margin: 0,
                        background: '#fff',
                        minHeight: 280,
                        position: 'absolute',
                        left: 0,
                        zIndex: 0,
                        // top: 0,
                    }}
                >
                    {renderContent()}
                </Content>
            </Layout>
        </>
    );

    return (
        <Layout style={{ height: '100vh' }}>
            {mobile ? renderMobile : renderDesktop}
        </Layout>
    );
}

export function AppFooter() {
    return <Footer style={{ textAlign: 'center' }}>
      Emojoy ©2020
      <Button type='link' icon='coffee' href='https://www.buymeacoffee.com/emojoy' />
      <Button type='link' icon='github' href='https://github.com/RobinMnk/Emojoy' />
      <Button type='link' icon='mail' href='mailto:emojoyapp@gmail.com' />
    </Footer>
  }

export default MainComponent;
