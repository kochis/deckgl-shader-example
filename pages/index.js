import ExpectedBehavior from '../components/ExpectedBehavior';
import ShaderLayer from '../components/ShaderLayer';

const styles = {
  red: {
    background: 'red',
    color: 'white',
    padding: '0 4px',
  },
  green: {
    background: 'green',
    color: 'white',
    padding: '0 4px',
  },
};

export default function Home() {
  return (
    <div className="container-xl p-5">
      <div className="row mb-5">
        <h2>Expected behavior</h2>
        <p>
          The intended visualization is something like below, in that as a trip progresses, the color changes from <span style={styles.red}>RED</span> to <span style={styles.green}>GREEN</span> as
          the trip progresses. The color is being being interpolated between the colors based on the percentage that the trip is completed.
        </p>
        <p>
          The solution here is calling the <code>getColor</code> callback on each update using a trigger, but ideally this could be done at the shader level. Drag the slider below to control the animation.
        </p>
        <ExpectedBehavior />
      </div>

      <div className="row mb-5">
        <h2>Custom shader layer</h2>
        <p>
          The issue I&apos;m having trouble tracking down in the shader code, is that the color seems to be getting applied across <i>all</i> trips simultaneously. My hunch is that something
          in the vertex shader is not being setup correctly, or the <code>progress</code> variable is not being computed correctly, but unsure how to go about debugging
          it from here.
        </p>
        <ShaderLayer />
      </div>
    </div>
  )
}
