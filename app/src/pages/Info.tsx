import React from 'react'
import { emotion2emoji } from '../Utils';
import './Info.css';

interface IProps {
  switchPage(page: string): void;
}

export class Info extends React.Component<IProps, {}> {
  constructor(props: Readonly<IProps>) {
    super(props);
    this.state = {};
  }

  render() {

    const emojiStyle = {
      justifyContent: 'space-around',
      display: 'flex',
      fontSize: 100,
    }

    return (
      <>
        <div>
          <p
            style={{
              margin: '2px 18px 10px',
              padding: 2,
              background: '#fff',
              fontSize: 40,
              fontWeight: "bold"
            }}
          >
            Emojoy
          </p>

          <p
            style={{
              margin: '2px 16px 50px 16pw',
              padding: 2,
              background: '#fff',
              fontSize: 20
            }}
          >
            This app allows you to play video games through your facial
            expressions alone. This enables physically disabled people to enjoy
            games they otherwise couldn't and helps people that suffer from
            disorders like autism to improve their detection of facial expressions.
          </p>
          <p
            style={{
              margin: '2px 16px 50px 16pw',
              padding: 2,
              background: '#fff',
              fontSize: 20
            }}
          >
            To practice forming facial expressions click on the happy face. To practice switching bewteen
            facial expressions click on the surprised face.
          </p>
        </div>
        <div style={emojiStyle}>
          <div className='emoji' style={{cursor: 'pointer'}} onClick={() => this.props.switchPage('practice1')}>{emotion2emoji('happy')}</div>
          <div className='emoji' style={{cursor: 'pointer'}} onClick={() => this.props.switchPage('practice2')}>{emotion2emoji('surprised')}</div>
        </div>
      </>
    );
  }
}
