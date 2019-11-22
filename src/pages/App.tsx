import React from 'react';
import '../App.css';
import { Icon, Menu, Layout } from 'antd';
const { Sider, Content, Header } = Layout;
const { SubMenu, Item } = Menu;

interface IState {
    collapsed: boolean;
}

class App extends React.Component<{}, IState> {
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            collapsed: false,
        };
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        return (
            <Layout style={{height: '100vh'}}>
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <div className="logo" />
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['0']}>
                        <Item key="1">
                            <Icon type="info-circle" />
                            <span>Information</span>
                        </Item>
                        <Item key="2">
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
                            <Item key="p1">
                                <Icon type="smile" />
                                <span>Scenario 1</span>
                            </Item>
                            <Item key="p2">
                                <Icon type="smile" />
                                <span>Scenario 2</span>
                            </Item>
                            <Item key="p3">
                                <Icon type="smile" />
                                <span>Scenario 3</span>
                            </Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: '#fff',
                            minHeight: 280,
                        }}
                    >
                        Content
                </Content>
                </Layout>
            </Layout>
        );
    }
}

export default App;
