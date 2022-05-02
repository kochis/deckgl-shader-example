import _ from 'lodash';
import { TripsLayer } from '@deck.gl/geo-layers';

class CustomLayer extends TripsLayer {
  initializeState(params) {
    super.initializeState(params);

    const attributeManager = this.getAttributeManager();
    attributeManager.add({
      range: {
        size: 2,
        update: (attribute) => {
          const vertices = _.sum(this.props.data.map((d) => d.timestamps.length));
          const ranges = new Float32Array(vertices * 2);

          // for every vertex, add the "start" and "end" time for the trip that each
          // vertex is associated with.
          //
          // it will be passed in as a vec2 (x = start, y = end) since the attribute limit
          // will be met with an additional attribute
          let r = 0;
          for (let i = 0; i < this.props.data.length; i++) {
            const tripStart = _.first(this.props.data[i].timestamps);
            const tripEnd = _.last(this.props.data[i].timestamps);

            this.props.data[i].timestamps.forEach(() => {
              ranges[r++] = tripStart;
              ranges[r++] = tripEnd;
            });
          }

          attribute.value = ranges;
        },
      },
    });
  }

  getShaders() {
    const shaders = super.getShaders();
    shaders.inject = {
      // add new (and existing ) attributes
      'vs:#decl': `\
attribute vec2 range;
varying float progress;

uniform float currentTime;
uniform float trailLength;
attribute float instanceTimestamps;
attribute float instanceNextTimestamps;
varying float vTime;
`,

      // compute progress for each vertex
      // progress is the % completed for each trip based on the current time
      'vs:#main-end': `\
vTime = instanceTimestamps + (instanceNextTimestamps - instanceTimestamps) * vPathPosition.y / vPathLength;
progress = (currentTime - range.x) / (range.y - range.x);
`,

      'fs:#decl': `\
uniform vec3 startColor;
uniform vec3 endColor;
varying float progress;

uniform bool fadeTrail;
uniform float trailLength;
uniform float currentTime;
varying float vTime;
`,

      'fs:#main-start': `\
if(vTime > currentTime || (fadeTrail && (vTime < currentTime - trailLength))) {
  discard;
}
// this is causing some weird behavior im still unsure about
// if (progress <= 0.0 || progress > 1.0) {
//   discard;
// }
`,

      // color trip based on progress
      'fs:DECKGL_FILTER_COLOR': `\
color.r = ((endColor.r - startColor.r) * progress + startColor.r) / 255.0;
color.g = ((endColor.g - startColor.g) * progress + startColor.g) / 255.0;
color.b = ((endColor.b - startColor.b) * progress + startColor.b) / 255.0;

if (fadeTrail) {
  color.a *= 1.0 - (currentTime - vTime) / trailLength;
}
`,
    };
    return shaders;
  }

  draw(params) {
    // add the start & end color as uniforms

    if (this.props.getStartColor) {
      params.uniforms.startColor = this.props.getStartColor;
    }
    if (this.props.getEndColor) {
      params.uniforms.endColor = this.props.getEndColor;
    }
    super.draw(params);
  }
}

export default CustomLayer;
