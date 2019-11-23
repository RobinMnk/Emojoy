import React from 'react'
import Pong from 'react-pong'

interface IProps {

}

export class Game extends React.Component<IProps, {}> {
    constructor(props: Readonly<IProps>) {
        super(props);
        this.state = {};
    }

    render() {
        return (
          <Pong/>
        );
    }
}