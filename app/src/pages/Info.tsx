import React from 'react'
import { Typography, Divider, Button, Row, Col } from 'antd';
import { AppFooter } from './App';

const { Title, Text } = Typography

interface IProps {
	switchPage(page: string): void;
}

export function Info(props: IProps) {
	return (
		<>
			<Header switchPage={props.switchPage} />
			<Facts />
			<AboutUs />
			<AppFooter />
		</>
	);
}

function Header(props: IProps) {
	const emojiStyle = {
		justifyContent: 'space-around',
		display: 'flex',
		fontSize: 100,
	}
	return (
		<div style={{
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
			<Title style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.75)' }}>Hi, we're Emojoy!</Title>
			<Row style={{ marginTop: '10vh' }}>
				<Col span={24}>
					<Text style={{ justifyContent: 'space-around', color: 'rgba(255, 255, 255, 0.75)' }}>We built an app that allows you to play games using your facial expressions.</Text>
				</Col>
			</Row>
			<Row style={{ marginTop: '5vh' }}>
				<Col span={24} >
					<Button style={{ justifyContent: 'space-around' }}>Try it!</Button>
				</Col>
			</Row>
			<Row style={{ marginTop: '20vh' }}>
				<Col span={24} >
					<Title level={2} style={{color: 'rgba(0, 0, 0, 0.65)'}} >⇩ Our Mission ⇩</Title>
				</Col>
			</Row>

		</div>
	);
}

function Facts() {
	const whiteText = { color: 'rgba(255, 255, 255, 0.75)', marginTop: '20px' }
	const bulletPoint = { color: 'rgba(255, 255, 255, 0.75)', marginTop: '1vh' }
	return <div
		style={{
			width: '100%',
			backgroundColor: '#333',
			backgroundAttachment: 'fixed,fixed',
			backgroundImage: 'url("landing_page/overlay1.png"), url("../../images/header.jpg")',
			backgroundSize: 'auto,cover',
		}}
	>
		<Row>
			<Col span={24} style={{ padding: '10px' }}>
				<Title style={whiteText} level={1}>55% of communication is nonverbal {<span role='img' aria-label='exploding head emoji'>🤯</span>}</Title>
				<Divider />
				<ul>
					<li style={bulletPoint}>
						<Text style={whiteText}>People with Autism Spectrum Disorders (ASD) have it especially difficult to interpret and apply facial expressions accurately.</Text>
					</li><li style={bulletPoint}>
						<Text style={whiteText}>Kids with autism have the same problems, they however find it very easy to use technical devices.</Text>
					</li>
					<li style={bulletPoint}>
						<Text style={whiteText}>This is why we came up with Emojoy. Our idea started with the fun idea of playing games with facial expressions, but as we did our research, we realized we could genuinely help kids with autism in a fun way!</Text>
					</li> <li style={bulletPoint}>
						<Text style={whiteText}>Emojoy allows users to play games using their facial expressions. The idea is to provide progressively harder challenges to allow gradual improvement in interpreting facial expressions.</Text>
					</li> <li style={bulletPoint}>
						<Text style={whiteText}>Some interesting reads:</Text>
						<ul>
							<li style={bulletPoint}>
								<a href="https://molecularautism.biomedcentral.com/articles/10.1186/s13229-018-0187-7">
									Facial expression recognition as a candidate marker for ASD
										</a>
							</li>
							<li style={bulletPoint}>
								<a href="https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1469-7610.1989.tb00274.x">
									Autistic Children's Ability to Interpret Faces: A Research
									Note
										</a>
							</li>
							<li style={bulletPoint}>
								<a href="https://www.sciencedirect.com/science/article/abs/pii/S0890856709612557">
									Neural Correlates of Facial Affect Processing in Children
									and Adolescents With ASD
										</a>
							</li>
							<li style={bulletPoint}>
								<a href="http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.703.3846&amp;rep=rep1&amp;type=pdf">
									Strategies of Perception of Emotional Facial Expressions
									in the Autism Spectrum
										</a>
							</li>
						</ul>
					</li>
				</ul>
			</Col>
		</Row>
	</div>
}

function AboutUs() {
	const darkText = { color: 'rgba(0, 0, 0, 0.75)', marginTop: '20px', justifyContent: 'space-around' }
	const bulletPoint = { color: 'rgba(0, 0, 0, 0.75)', marginTop: '1vh' }
	return <div
		style={{
			width: '100%',
			padding: '10px',
		}}
	>
		<Row>
			<Col span={24}>
				<Title style={darkText} level={1}>You want to help us?{<span role='img' aria-label='star eyes emoji'>🤩</span>}</Title>
			</Col>
		</Row>
		{/* <Divider /> */}
		<Row>
			<Col span={24}>
				<Text style={darkText}>This project is <b>non profit</b>!</Text>
			</Col>
		</Row>
		<Row>
			<Col span={24}>
				<Text style={darkText}>But any support is appreciated:</Text>
				<ul>
					<li style={bulletPoint}>Help us improve this project by sending us ideas! What features would you love to see? {<a href='mailto:emojoyapp@gmail.com'>Send us an Email!</a>}</li>
					<li style={bulletPoint}>Are you a developer? {<a href="https://github.com/RobinMnk/Emojoy">Visit our Github page!</a>}</li>
					<li style={bulletPoint}>You can also {<a href='https://www.buymeacoffee.com/emojoy'>Buy us a coffee!</a>} to support us!</li>
				</ul>
			</Col>
		</Row>
	</div>
}
