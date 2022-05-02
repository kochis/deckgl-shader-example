import React, { useState } from 'react';
import DeckGL from 'deck.gl';
import _ from 'lodash';
import CustomLayer from '../layers/CustomLayer';

const data = require('../data/trips.json');

const style = {
  position: "relative",
  width: "100%",
  height: "550px",
  border: "1px solid black",
};

// Viewport settings
const initialViewState = {
  latitude: 40.71460213064598,
  longitude: -73.97744746237277,
  zoom: 11.5,
  minZoom: 2,
  maxZoom: 15,
  pitch: 0,
  bearing: 0,
};

const RED = [255, 0, 0];
const GREEN = [0,255,0];

const ShaderLayer = () => {
  const [viewState, setViewState] = useState(initialViewState);
  const [time, setTime] = useState(0);

  const layers = [
    new CustomLayer({
      id: 'custom-layer',
      data,
      getPath: d => d.path,
      getTimestamps: d => d.timestamps,
      getStartColor: RED,
      getEndColor: GREEN,
      opacity: 0.75,
      widthMinPixels: 5,
      rounded: true,
      trailLength: 250,
      currentTime: time,
    }),
  ];

  return (
    <>
      <DeckGL
        controller
        viewState={viewState}
        layers={layers}
        style={style}
        onViewStateChange={
          (nextViewState) => {
            setViewState(nextViewState.viewState);
          }
        }
      />
      <div style={{ width: '100%', marginTop: "1.5rem" }}>
        <input
          style={{ width: '100%' }}
          type="range"
          min="0"
          max="2486"
          step="0.1"
          value={time}
          onChange={(e) => { setTime(Number(e.target.value)); }}
        />
      </div>
    </>
  );
}

export default ShaderLayer;
