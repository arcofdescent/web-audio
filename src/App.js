
import React, { Component } from 'react';
import Audio from './audio/model';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="">
				<button onClick={this.play_note.bind(this)}>Play</button>
      </div>
    );
  }

	play_note() {
		console.log('play_note');	
		this.audio.play_note();
	}

	componentDidMount() {
		this.audio = new Audio();
	}

}

export default App;
