import React, { Component } from "react";

class Paddle extends Component {
  render() {
    const player = this.props.player ? "player" : "opponent";
    const style = {
      top: this.props.pos + "%",
    };
    return <div 
    className={`paddle paddle_type-${player}`}
    style={style} >
        <div className={ `paddle__inner ${this.props.animate? `paddle__animation-${player}` : ""}`}></div>
    </div>;
  }
}

export default Paddle;
