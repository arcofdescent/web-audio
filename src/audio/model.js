
class Audio {

	constructor() {

    var contextClass = (window.AudioContext || 
        window.webkitAudioContext ||
        window.mozAudioContext ||
        window.oAudioContext ||
        window.msAudioContext);

    if (contextClass) {
      // Web Audio API available
      this.ctx = new contextClass();
    }
    else {
     console.log('no Web Audio API');
    }

		this.oscillatorTypes = [
			'sine', 'square', 'sawtooth', 'triangle', 'custom',
		];
	}


  play_note() {

    // duration is in seconds
  
    var ctx = this.ctx;
    var time = this.ctx.currentTime + 0.1;
		var duration = 1;

    // oscillator
    var osc = ctx.createOscillator();

    osc.type = 'sine';
    osc.frequency.value = 440;

    // gain
    var gainNode = ctx.createGain();
    gainNode.gain.value = 0.65;

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

	/*
  defaults: {
    ctx: null,
    gain: 0.85,

    isPlaying: false,      // Are we currently playing?
    startTime: 0,            // The start time of the entire sequence.
    lookahead: 25.0,       // How frequently to call scheduling function 
                                //(in milliseconds)
    scheduleAheadTime: 0.1,    // How far ahead to schedule audio (sec)
                                // This is calculated from lookahead, and overlaps 
                                // with next interval (in case the timer is late)
    nextNoteTime: 0.0,     // when the next note is due.
    noteResolution: 0,     // 0 == 16th, 1 == 8th, 2 == quarter note
    noteLength: 0.05,      // length of "beep" (in seconds)
    last16thNoteDrawn: -1, // the last "box" we drew on the screen
    notesInQueue: [],      // the notes that have been put into the web audio,
                                // and may or may not have played yet. {note, time}
    timerWorker: null,     // The Web Worker used to fire timer messages


    beat_idx: 0,

    note_frequencies: {
      'C0': 16.35,
      'C#0': 17.32,
      'D0': 18.35,
      'D#0': 19.45,
      'E0': 20.60,
      'F0': 21.83,
      'F#0': 23.12,
      'G0': 24.50,
      'G#0': 25.96,
      'A0': 27.50,
      'A#0': 29.14,
      'B0': 30.87,
      'C1': 32.70,
      'C#1': 34.65,
      'D1': 36.71,
      'D#1': 38.89,
      'E1': 41.20,
      'F1': 43.65,
      'F#1': 46.25,
      'G1': 49.00,
      'G#1': 51.91,
      'A1': 55.00,
      'A#1': 58.27,
      'B1': 61.74,
      'C2': 65.41,
      'C#2': 69.30,
      'D2': 73.42,
      'D#2': 77.78,
      'E2': 82.41,
      'F2': 87.31,
      'F#2': 92.50,
      'G2': 98.00,
      'G#2': 103.83,
      'A2': 110.00,
      'A#2': 116.54,
      'B2': 123.47,
      'C3': 130.81,
      'C#3': 138.59,
      'D3': 146.83,
      'D#3': 155.56,
      'E3': 164.81,
      'F3': 174.61,
      'F#3': 185.00,
      'G3': 196.00,
      'G#3': 207.65,
      'A3': 220.00,
      'A#3': 233.08,
      'B3': 246.94,
      'C4': 261.63,
      'C#4': 277.18,
      'D4': 293.66,
      'D#4': 311.13,
      'E4': 329.63,
      'F4': 349.23,
      'F#4': 369.99,
      'G4': 392.00,
      'G#4': 415.30,
      'A4': 440.00,
      'A#4': 466.16,
      'B4': 493.88,
      'C5': 523.25,
      'C#5': 554.37,
      'D5': 587.33,
      'D#5': 622.25,
      'E5': 659.25,
      'F5': 698.46,
      'F#5': 739.99,
      'G5': 783.99,
      'G#5': 830.61,
      'A5': 880.00,
      'A#5': 932.33,
      'B5': 987.77,
      'C6': 1046.50,
      'C#6': 1108.73,
      'D6': 1174.66,
      'D#6': 1244.51,
      'E6': 1318.51,
      'F6': 1396.91,
      'F#6': 1479.98,
      'G6': 1567.98,
      'G#6': 1661.22,
      'A6': 1760.00,
      'A#6': 1864.66,
      'B6': 1975.53,
      'C7': 2093.00,
      'C#7': 2217.46,
      'D7': 2349.32,
      'D#7': 2489.02,
      'E7': 2637.02,
      'F7': 2793.83,
      'F#7': 2959.96,
      'G7': 3135.96,
      'G#7': 3322.44,
      'A7': 3520.00,
      'A#7': 3729.31,
      'B7': 3951.07,
      'C8': 4186.01,
      'C#8': 4434.92,
      'D8': 4698.63,
      'D#8': 4878.03,
      'E8': 5274.04,
      'F8': 5587.65,
      'F#8': 5919.91,
      'G8': 6271.93,
      'G#8': 6644.88,
      'A8': 7040.00,
      'A#8': 7458.62,
      'B8': 7902.13,
    },

    // track how many buffers have been loaded so we are ready to play the
    // app
    num_buffers_loaded: 0,

    // TODO use buffer_keys array and then fill up the buffer

    buffer: {
      A1: null,
      A3: null,
      B2: null,
      D2: null,
      D4: null,
      E1: null,
      E3: null,
      G2: null,
      G4: null,
    },

    // callback to indicate that audio was loaded 
    audio_loaded_cb: null,
    curr_measure_cid: null,
  },

  initialize: function() {
    var contextClass = (window.AudioContext || 
        window.webkitAudioContext ||
        window.mozAudioContext ||
        window.oAudioContext ||
        window.msAudioContext);

    if (contextClass) {
      // Web Audio API available
      this.set('ctx', new contextClass());
    }
    else {
     //console.log('no Web Audio API');
    }

    this.load_buffers();
    //this.init();
  },

  nextNote: function() {
    var secondsPerBeat = 60.0 / 60;

    var duration = {
      sixteenth_note: secondsPerBeat * 0.25,
      eighth_note: secondsPerBeat * 0.5,
      quarter_note: secondsPerBeat * 1,
      half_note: secondsPerBeat * 2,
      whole_note: secondsPerBeat * 4,
    };

    var duration_triplet = {
      half_note: duration.whole_note/3, 
      quarter_note: duration.half_note/3, 
      eighth_note: duration.quarter_note/3,
      sixteenth_note: duration.eighth_note/3,
    };

    var curr_beat = this.get('beats')[this.get('beat_idx')];

    this.set('beat_idx', this.get('beat_idx') + 1); // Advance the beat number, wrap to zero
    if (this.get('beat_idx') == this.get('beats').length) {
        this.set('beat_idx', 0);
    }

    this.set('nextNoteTime', 
          this.get('nextNoteTime') 
            + (curr_beat.get('is_triplet') ? duration_triplet[curr_beat.get('duration')]
                : duration[curr_beat.get('duration')]));

  },

  scheduleNote: function(beat, time) {
    this.get('notesInQueue').push( { note: beat, time: time, idx: beat.get('idx') } );

    var qnd = 60 / 60;

    var duration = {
      sixteenth_note: qnd * 0.25,
      eighth_note: qnd * 0.5,
      quarter_note: qnd,
      half_note: qnd * 2,
      whole_note: qnd * 4,
    };

    var duration_triplet = {
      half_note: duration.whole_note/3, 
      quarter_note: duration.half_note/3, 
      eighth_note: duration.quarter_note/3,
      sixteenth_note: duration.eighth_note/3,
    };

    var note = beat.get('notes').at(0);

    if (!note.get('is_rest')) {
      LC.audio.play_note_from_buffer(
        note.get('pitch'),
        note.get('pitch_number'),
        time,
        (beat.get('is_triplet') ? duration_triplet[beat.get('duration')]
          : duration[beat.get('duration')]) - 0.02 // in seconds
      );

      // play other notes in the beat
      for (var i=1; i < beat.get('notes').length; i++) {
        var note = beat.get('notes').at(i);

        LC.audio.play_note_from_buffer(
          note.get('pitch'),
          note.get('pitch_number'),
          time,
          (beat.get('is_triplet') ? duration_triplet[beat.get('duration')]
            : duration[beat.get('duration')]) - 0.02 // in seconds
        );
      }
    }
  },

  scheduler: function() {
    // while there are notes that will need to play before the next interval, 
    // schedule them and advance the pointer.
    while (this.get('nextNoteTime') < this.get('ctx').currentTime + this.get('scheduleAheadTime')) {
      var curr_beat = this.get('beats')[this.get('beat_idx')];
      this.scheduleNote( curr_beat, this.get('nextNoteTime') );
      this.nextNote();
    }
  },

  play: function(beats) {
    this.set('beats', beats);
    this.set('isPlaying', true);
    this.set('beat_idx', 0);
    this.set('nextNoteTime', this.get('ctx').currentTime);
    this.get('timerWorker').postMessage("start");
  },

  stop: function() {
    this.get('timerWorker').postMessage("stop");
    this.set('isPlaying', false);
  },
	*/

  /*
  draw: function() {
    var currentNote = this.get('beat_idx');
    var currentTime = this.get('ctx').currentTime;

    while (this.get('notesInQueue').length && this.get('notesInQueue')[0].time < currentTime) {
      currentNote = this.get('notesInQueue')[0].idx;
      this.get('notesInQueue').splice(0,1);   // remove note from queue
    }

    // We only need to draw if the note has moved.
    if (this.get('beat_idx') != currentNote) {

      // wtf? 
      var curr_beat_idx = this.get('beat_idx');
      var new_beat_idx;

      if (curr_beat_idx == 0) {
        new_beat_idx = this.get('beats').length - 1;
      }
      if (curr_beat_idx > 0 && curr_beat_idx != new_beat_idx) {
        new_beat_idx = --curr_beat_idx;
      }

      var curr_beat = this.get('beats')[new_beat_idx];
      var measure = curr_beat.get('measure');

      if (measure.cid != this.get('curr_measure_cid')) {
        LC.selected_measure = measure.set_selected(true);
        this.set('curr_measure_cid', measure.cid);
      }

      var note = curr_beat.get('notes').first();
      measure.set('selected_note', note);
      LC.sheet.render_note_rect();

    }

    // set up to draw again
    var a = this;
    window.requestAnimationFrame(function() {
      a.draw(); 
    });
  },
  */

	/*
  init: function() {
    var a = this;
    window.requestAnimationFrame(function() {
      a.draw(); 
    });    // start the drawing loop.

    this.set('timerWorker', new Worker("js/lib/worker.js"));

    this.get('timerWorker').onmessage = function(e) {
        if (e.data == "tick") {
            a.scheduler();
        }
    };

    this.get('timerWorker').postMessage({"interval":this.get('lookahead')});
  },

  get_buffer_for_pitch: function(pitch, pitch_number) {

    var a = this;
    var nominated_keys = [];
    var pitch_names = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G' ];
    var buffer_keys = _.keys(this.get('buffer'));

    _.each(buffer_keys, function(k) {
      var matches = k.match(/^(..?)\d$/);

      // accomodate accidentals
      if (pitch.substr(0, 1) == matches[1]) {
        nominated_keys.push(k);
      }

    });

    if (nominated_keys.length == 0) {
      // more trobule, get the closest pitch name
      _.each(pitch_names, function(p) {
        if (pitch.substr(0, 1) == p) {
          var idx = _.indexOf(pitch_names, p);
          if (idx == 0) {
            // get last element
            nominated_keys.push(_.last(buffer_keys));
          }
          else {
            var p = pitch_names[idx-1];
            var re = new RegExp(p);
            var bf = _.filter(buffer_keys, function(k) {
              return k.match(re);
            });

            nominated_keys = bf;
          }
        }
          
      });
    }

    if (nominated_keys.length == 1) {
      return nominated_keys[0];
    }
    else {
      // return last element, needs further refinement
      if (pitch_number >= 3) {
        return _.last(nominated_keys);
      }
      else {
        return _.first(nominated_keys);
      }
    }
  },
	*/

	/*
  play_notes: function() {

    var a = this;
    var notes = [ 
      'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3',
      'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 
      'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 
      'C6', 'D6', 'E6', 'F6', 'G6', 'A6', 'B6', 
      'C7' 
    ];
    var time = this.get('ctx').currentTime + 0.1;
    var dur = 0.4;

    _.each(notes, function(n) {
      var matches = n.match(/^(..?)(\d)$/);
      a.play_note(matches[1], matches[2], time, dur);

      time += dur;
    });

  },

  load_buffers: function() {

    var a = this;
    a.set('num_buffers_loaded', 0);
    var num_buffers = _.keys(a.get('buffer')).length;

    _.each(_.keys(a.get('buffer')), function(k) {
      var url = 'samples/steel_guitar/' + k + '.ogg';
      a.load_buffer(url, k, num_buffers);
    });

  },

  load_buffer: function(url, buffer_key, num_buffers) {

    var ctx = this.get('ctx');
    var a = this;

    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
      ctx.decodeAudioData(request.response, function(b) {
        a.get('buffer')[buffer_key] = b;
        a.set('num_buffers_loaded', a.get('num_buffers_loaded') + 1);

        if (a.get('num_buffers_loaded') == num_buffers) {
          a.get('audio_loaded_cb')();
        }
      });
    };

    request.send();
  },

  get_detune_val: function(pitch, pitch_number, buffer) {

    var matches = buffer.match(/^(..?)(\d)$/);
    var semitone_diff = this.get_diff_in_semitones(
      pitch, pitch_number, matches[1], matches[2]
    );
  
    return -semitone_diff * 100;
  },

  get_diff_in_semitones: function(p1_p, p1_pn, p2_p, p2_pn) {

    // XXX assumes p2_p does not contain an accidental

    var scale = [ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A',
      'A#', 'B', ];

    var idx_diff = _.indexOf(scale, p2_p) - _.indexOf(scale, p1_p.substr(0, 1));
    if (p1_p.match(/#/)) {
      idx_diff--;
    }

    var octave_diff = p2_pn - p1_pn;

    var num_semitones = idx_diff + (octave_diff * 12);

    return num_semitones;
  },

  play_note_from_buffer: function(pitch, pitch_number, time, duration) {

    var buffer = this.get_buffer_for_pitch(pitch, pitch_number);
    var detune_val = this.get_detune_val(pitch, pitch_number, buffer);

    var ctx = this.get('ctx');
    var source = ctx.createBufferSource();
    source.buffer = this.get('buffer')[buffer];
    source.detune.value = detune_val;
    source.connect(ctx.destination);

    source.start(time);
    source.stop(time + duration);
  },
	*/

}

export default Audio;

