import React from 'react'
import './Info.css';
import { Typography, Divider, Button, Row, Col } from 'antd';

const { Title, Text } = Typography

interface IProps {
  switchPage(page: string): void;
}

export function Info(props: IProps) {
  return (
      <>
        <Header/>
        <Facts/>
      </>
    );
}

function Header() {
  const emojiStyle = {
      justifyContent: 'space-around',
      display: 'flex',
      fontSize: 100,
    }
  return <div style={{
    height: '100vh',
    width: '100%',
    padding: '9em 0 9em 0',
    backgroundColor: '#4686a0',
    color: 'rgba(255, 255, 255, 0.75)',
    backgroundAttachment: 'fixed,fixed,fixed',
    backgroundImage: 'url("landing_page/overlay2.png"), url("landing_page/overlay3.svg"), linear-gradient(45deg, #9dc66b 5%, #4fa49a 30%, #4361c2)',
    backgroundPosition: 'top left, center center, center center',
    backgroundSize: 'auto,cover,cover',
    overflow: 'hidden',
    position: 'relative',
    textAlign: 'center',
  }}>
    <div style={emojiStyle}>
      <div className='emoji'>{'😍'}</div>
    </div>
    <Title style={{ textAlign: 'center',color: 'rgba(255, 255, 255, 0.75)' }}>Hi, we're Emojoy!</Title>
    <Row style={{marginTop: '10vh' }}>
      <Col span={24}>
        <Text style={{ justifyContent: 'space-around', color: 'rgba(255, 255, 255, 0.75)'}}>We built an app that allows you to play games using your facial expressions.</Text>
      </Col>
    </Row>
    <Row style={{marginTop: '10vh' }}>
      <Col span={24} >
        <Button style={{ justifyContent: 'space-around'}}>Try it!</Button>
      </Col>
    </Row>
  </div>
}

function Facts() {
  const whiteText = {color: 'rgba(255, 255, 255, 0.75)', marginTop: '20px'}
  return <div
    style={{
      width: '100%',
      height: '100vh',
			backgroundColor: '#333',
			backgroundAttachment: 'fixed,fixed',
			backgroundImage: 'url("landing_page/overlay1.png"), url("../../images/header.jpg")',
			backgroundSize: 'auto,cover',
    }}
  >
    <Row>
      <Col span={12}></Col>
      <Col span={12} style={{padding: '10px'}}>
        <Title style={whiteText} level={1}>55% of communication is nonverbal</Title>
        <Divider />
        <ul>
        <li style={{color: 'rgba(255, 255, 255, 0.75)',marginTop: '1vh'}}>
        <Text style={whiteText}>People with Autism Spectrum Disorders (ASD) have it especially difficult to interpret and apply facial expressions accurately.</Text>
        </li><li style={{color: 'rgba(255, 255, 255, 0.75)',marginTop: '1vh'}}>
        <Text style={whiteText}>Kids with autism have the same problems, they however find it very easy to use technical devices.</Text>
        </li>
        <li style={{color: 'rgba(255, 255, 255, 0.75)',marginTop: '1vh'}}>
        <Text style={whiteText}>This is why we came up with Emojoy. Our idea started with the fun idea of playing games with facial expressions, but as we did our research, we realized we could genuinely help kids with autism in a fun way!</Text>
        </li> <li style={{color: 'rgba(255, 255, 255, 0.75)',marginTop: '1vh'}}>
        <Text style={whiteText}>Emojoy allows users to play games using their facial expressions. The idea is to provide progressively harder challenges to allow gradual improvement in interpreting facial expressions.</Text>
        </li> <li style={{color: 'rgba(255, 255, 255, 0.75)',marginTop: '1vh'}}>
        <Text style={whiteText}>Some interesting reads:</Text>
        </li>
        </ul>
      </Col>
    </Row>
  </div>
}