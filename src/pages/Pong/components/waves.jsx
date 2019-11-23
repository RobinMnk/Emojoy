import React from 'react';

const Waves = (props) => {
    const waves = props.waves.map((wave, idx) => {
        const radius = wave.intensity * 10;
        const radiusY = (radius * window.innerWidth) / window.innerHeight;
        const style = {
          top: wave.waveY + "%",
          left: wave.waveX + "%",
          width: radius + "%",
          height: radiusY + "%",
          backgroundColor: wave.waveX === 2 ? "purple" : "yellow"
        };
        return <div key={"wave" + idx} className="wave wave__animate" style={style} />;
      });
    return (waves);
}
 
export default Waves;