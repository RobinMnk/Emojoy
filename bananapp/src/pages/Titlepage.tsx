import React from 'react'

interface IProps {

}

export class Titlepage extends React.Component<IProps, {}> {
    constructor(props: Readonly<IProps>) {
        super(props);
        this.state = {};
    }

    render() {
        return ( <p> Title </p> );
    }
}
