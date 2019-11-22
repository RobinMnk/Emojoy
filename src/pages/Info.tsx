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
        <div
          style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
              fontSize: 80,
              fontWeight: "bold"
          }}
        >
            Test Content
        </div>
        );
    }
}
