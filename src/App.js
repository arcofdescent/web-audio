
import React, { Component } from 'react';
import Audio from './audio/model';
import './App.css';
import LC from './lc';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const sliderMarks = {
	0: '0',
	'0.25': '0.25',
	'0.5': '0.5',
	'0.75': '0.75',
	'1': '1',
};

class App extends Component {
  render() {
    return (
      <div className="">
				<button onClick={this.play_note.bind(this)}>Play</button>
				<button onClick={this.stop.bind(this)}>Stop</button>
				<br/>
				<div style={{width: 400, margin: 10}}>
					<Slider min={0} max={1} marks={sliderMarks} step={null} 
						defaultValue={1} onChange={this.onSliderChange} />
				</div>
      </div>
    );
  }

	play_note() {
		console.log('play_note');	
		LC.audio.play_note();
	}

	stop() {
		console.log('stop');	
		LC.audio.stop();
	}

	onSliderChange(val) {
		LC.audio.setGain(val);
	}

	componentDidMount() {
		LC.audio = new Audio();
	}

}

export default App;
