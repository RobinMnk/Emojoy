import React from 'react'

interface IProps {

}

export class Info extends React.Component<IProps, {}> {
    constructor(props: Readonly<IProps>) {
        super(props);
        this.state = {};
    }

    render() {
        return (
        <div>
          <p 
            style={{
                margin: '2px 16px',
                padding: 2,
                background: '#fff',
                fontSize: 40,
                fontWeight: "bold"
            }}
           >
            Bananapp
          </p>

          <p 
            style={{
                margin: '2px 16px',
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
        </div>
        );
    }
}
