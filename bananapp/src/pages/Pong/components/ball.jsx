import React from "react";
const Ball = (props) => {
  const { radius, ballX, ballY, animId } = props.ball;
  const animation = `bounce-animation${animId} 500ms ease-out 1 forwards`;
  const style = {
    top: ballY + "%",
    left: ballX + "%",
    width: 2 * radius + "vw",
    height: 2 * radius + "vw",
    animation: animation
  };
  const className = "ball";
  return <div className={className} style={style} />;
};

export default Ball;
