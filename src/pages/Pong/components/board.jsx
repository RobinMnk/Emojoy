import React, { Component } from 'react';

const Board = props => {
  return (
    <div className="board">
      <div className="circle circle_side circle_left"></div>
      <div className="circle circle_mid"></div>
      <div className="midline"></div>
      <div className="circle circle_side circle_right"></div>
    </div>
  );
};

export default Board;
