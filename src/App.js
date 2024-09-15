import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [scale, setScale] = useState(1); // initial scale
  const minScale = 0.5; // minimum scale value
  const maxScale = 1.7; // maximum scale value
  let radius = 200;
  const [dots, setDots] = useState([]);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const numDots = 2000;
    const numLines = 50; // number of lines from pole to pole
    const dotsArray = [];
  
    for (let i = 0; i < numLines; i++) {
      const u = i / numLines * 2 * Math.PI; // angle from north pole to south pole
      for (let j = 0; j < numDots / numLines; j++) {
        const v = j / (numDots / numLines) * 2 * Math.PI; // angle around the ball
        const x = radius * Math.cos(u) * Math.cos(v);
        const y = radius * Math.cos(u) * Math.sin(v);
        const z = radius * Math.sin(u);
        dotsArray.push({ x, y, z });
      }
    }
  
    setDots(dotsArray);
  }, []);

  const handleMouseDown = (e) => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const delta = -event.deltaY;
    let newScale = scale + delta * 0.001;
  
    // clamp the new scale value to the min and max values
    newScale = Math.min(Math.max(newScale, minScale), maxScale);
    console.log("Scale: " + newScale);
    setScale(newScale);
  };
  const handleMouseMove = (e) => {
    const dx = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
    const dy = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
    setRotation((prevRotation) => ({
      x: prevRotation.x + dy * 0.01,
      y: prevRotation.y + dx * 0.01,
    }));
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  return (
    <div className="App">
       <div
        style={{
          position: 'relative',
          width: '500px',
          height: '500px',
          border: '3px solid white',
          borderRadius: '50%',
          transform: `scale(${scale})`, 
          boxShadow: '0 0 10px 5px rgba(0, 0, 0, 0.4)',
          cursor: 'grab',
        }}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
      {dots.sort((a, b) => a.lineNumber - b.lineNumber).map((dot, index) => {
        const rotatedX =
          dot.x * Math.cos(rotation.y) - dot.z * Math.sin(rotation.y);
        const rotatedZ =
          dot.x * Math.sin(rotation.y) + dot.z * Math.cos(rotation.y);
        const rotatedY =
          dot.y * Math.cos(rotation.x) - rotatedZ * Math.sin(rotation.x);
        const color = `hsl(0, 0%, ${Math.max(50, Math.min(100, 100 - (rotatedZ / radius) * 80))}%)`;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: rotatedX + 250,
              top: rotatedY + 250,
              width: 2,
              height: 2,
              backgroundColor: color,
              borderRadius: '50%',
            }}
          />
        );
      })}
    </div>
    </div>
  );
}

export default App;
