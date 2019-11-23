import React from "react";
const Options = props => {
  return (
    <div className={"options " + (props.roundIsOn ? "d-none" : "")}>
      <label htmlFor="ballSize">Ball Size</label>
      <input
        className="slider"
        onInput={props.onSizeChange}
        onClick={event => event.stopPropagation()}
        id="ballSize"
        type="range"
        name="ballSize"
        min="10"
        max="60"
        value={(props.size * 10).toFixed(0)}
      />
      <div className="size__labels">
        <div>small</div>
        <div>large</div>
      </div>
    </div>
  );
};

export default Options;
