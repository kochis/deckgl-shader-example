import React, { useState } from 'react';
import DeckGL from 'deck.gl';
import { TripsLayer } from '@deck.gl/geo-layers';
import _ from 'lodash';

const data = require('../data/trips.json');

const style = {
  position: "relative",
  width: "100%",
  height: "550px",
  border: "1px solid black",
};

// nyc
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

const ExpectedBehavior = () => {
  const [viewState, setViewState] = useState(initialViewState);
  const [time, setTime] = useState(0);

  const layers = [
    new TripsLayer({
      id: 'expected-behavior',
      data,
      getPath: d => d.path,
      getTimestamps: d => d.timestamps,
      getColor: (d) => {
        // forumla used to compuete the color based on the trips completion percentage
        const progress = (time - _.first(d.timestamps)) / (_.last(d.timestamps) - _.first(d.timestamps));

        // iterpolate color between red -> green based on how far along the trip is
        const r = ((GREEN[0] - RED[0]) * progress + RED[0]) ;
        const g = ((GREEN[1] - RED[1]) * progress + RED[1]) ;
        const b = ((GREEN[2] - RED[2]) * progress + RED[2]) ;

        return [r, g, b];
      },
      opacity: 0.75,
      widthMinPixels: 5,
      rounded: true,
      trailLength: 250,
      currentTime: time,
      updateTriggers: {
        getColor: time,
      },
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

export default ExpectedBehavior;
