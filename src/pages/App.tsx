import React from 'react';
import '../App.css';
import { Icon, Menu, Layout, Typography } from 'antd';
import { Info } from './Info';
const { Sider, Content, Header } = Layout;
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
                                <Icon type="frown" />
                                <span>Scenario 1</span>
                            </Item>
                            <Item key="practice2">
                                <Icon type="meh" />
                                <span>Scenario 2</span>
                            </Item>
                            <Item key="practice3">
                                <Icon type="smile" />
                                <span>Scenario 3</span>
                            </Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <span>
                        </span><div style={{ justifyContent: 'space-around', display: 'flex' }}>
                            <Title style={{margin: 0, marginTop: 8}}>
                                Bananapp
                            </Title>
                        </div>
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: '#fff',
                            minHeight: 280,
                        }}
                    >
                        {renderContent(this.state.currentPage)}
                </Content>
                </Layout>
            </Layout>
        );
    }
}


const renderContent = (key: string) => {
    console.log(key);
    switch(key) {
        case 'info':
            return <Info />;
        case 'game':
            return <p> Not Implemented Yet </p>;
        case 'practice1':
            return <p> Not Implemented Yet, Practice Scenario 1 </p>;
        case 'practice2':
            return <p> Not Implemented Yet, Practice Scenario 2 </p>;
        case 'practice3':
            return <p> Not Implemented Yet, Practice Scenario 3 </p>;
    }
}

export default App;
