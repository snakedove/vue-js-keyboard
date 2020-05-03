<template>
  <div id="keyboard" class="keyboard-body">
    <div class="keyboard-body-inner">
      <h1 class="keyboard-hl">...play <i>away</i>!</h1>
      <div @click="reverb = !reverb" class="reverb button">Reverb: {{reverb ? 'on' : 'off'}}</div>
      <div :key="k" v-for="(elem, k) in order" :class="'keyboard-container ' + elem.position">
        <div class="keyboard kb-black">
          <key :key="key" v-for="(num, key) in elem.keys" :color="'black'" :num="num" :data="getKeys[num]" @start-tone="startTone" @stop-tone="stopTone"></key>
        </div>
        <div class="keyboard kb-white">
          <div class="buttons">
            <div :class="'button noselect oct minus' + elem.position" @click="setOctave(-1, elem.position)">-</div>
            <div :class="'button noselect oct display' + elem.position">Oct: {{ currentOctave[elem.position]+1 }}</div>
            <div :class="'button noselect oct plus' + elem.position" @click="setOctave(1, elem.position)">+</div>
            <div :class="'button noselect vol minus' + elem.position" @click="setVolume(-1, elem.position)">-</div>
            <div :class="'button noselect vol display' + elem.position">Vol: {{ maxVol[elem.position] }}</div>
            <div :class="'button noselect vol plus' + elem.position" @click="setVolume(1, elem.position)">+</div>
            <div @click="setWaveForm('sine', elem.position)"
                 :class="'button noselect wave ' + (waveForm[elem.position] === 'sine' ? 'active ' : ' ') + elem.position">sine
            </div>
            <div @click="setWaveForm('square', elem.position)"
                 :class="'button noselect wave ' + (waveForm[elem.position] === 'square' ? 'active ' : ' ') + elem.position">square
            </div>
            <div @click="setWaveForm('sawtooth', elem.position)"
                 :class="'button noselect wave ' + (waveForm[elem.position] === 'sawtooth' ? 'active ' : ' ') + elem.position">sawtooth
            </div>
            <div @click="setWaveForm('triangle', elem.position)"
                 :class="'button noselect wave ' + (waveForm[elem.position] === 'triangle' ? 'active ' : ' ') + elem.position">triangle
            </div>
          </div>
          <key :key="key" v-for="(num, key) in elem.keys" :color="'white'" :num="num" :data="getKeys[num]" @start-tone="startTone" @stop-tone="stopTone"></key>
        </div>
      </div>
    </div>
      <footer class="footer">
    <span class="footer-content">
      created with vuejs by <a href="https://github.com/snakedove">github/snakedove</a> | tested with typescript
    </span>
      </footer>
  </div>
</template>

<script>
  import Key from './keyboard/Key.vue';
  let { Keyboard } = require('../keyboard');

  // styles
  import '../styles/styles.scss';

  const reverbjs = {
    networkError: {},
    extend: function (audioContext) {
      function decodeBase64ToArrayBuffer(input) {
        function encodedValue(input, index) {
          let encodedCharacter, x = input.charCodeAt(index);
          if (index < input.length) {
            if (x >= 65 && x <= 90) {
              encodedCharacter = x - 65;
            } else if (x >= 97 && x <= 122) {
              encodedCharacter = x - 71;
            } else if (x >= 48 && x <= 57) {
              encodedCharacter = x + 4;
            } else if (x === 43) {
              encodedCharacter = 62;
            } else if (x === 47) {
              encodedCharacter = 63;
            } else if (x !== 61) {
              console.log('base64 encountered unexpected character code: ' + x);
            }
          }
          return encodedCharacter;
        }

        if (input.length === 0 || (input.length % 4) > 0) {
          console.log('base64 encountered unexpected length: ' + input.length);
          return;
        }

        let padding = input.match(/[=]*$/)[0].length,
          decodedLength = input.length * 3 / 4 - padding,
          buffer = new ArrayBuffer(decodedLength),
          bufferView = new Uint8Array(buffer),
          encoded = [],
          d = 0,
          e = 0,
          i;

        while (d < decodedLength) {
          for (i = 0; i < 4; i += 1) {
            encoded[i] = encodedValue(input, e);
            e += 1;
          }
          bufferView[d] = (encoded[0] * 4) + Math.floor(encoded[1] / 16);
          d += 1;
          if (d < decodedLength) {
            bufferView[d] = ((encoded[1] % 16) * 16) + Math.floor(encoded[2] / 4);
            d += 1;
          }
          if (d < decodedLength) {
            bufferView[d] = ((encoded[2] % 4) * 64) + encoded[3];
            d += 1;
          }
        }
        return buffer;
      }

      function decodeAndSetupBuffer(node, arrayBuffer, callback) {
        audioContext.decodeAudioData(arrayBuffer, function (audioBuffer) {
          console.log('Finished decoding audio data.');
          node.buffer = audioBuffer;
          if (typeof callback === "function" && audioBuffer !== null) {
            callback(node);
          }
        }, function (e) {
          console.log('Could not decode audio data: ' + e);
        });
      }

      audioContext.createReverbFromBase64 = function (audioBase64, callback) {
        let reverbNode = audioContext.createConvolver();
        decodeAndSetupBuffer(reverbNode, decodeBase64ToArrayBuffer(audioBase64),
          callback);
        return reverbNode;
      };

      audioContext.createSourceFromBase64 = function (audioBase64, callback) {
        let sourceNode = audioContext.createBufferSource();
        decodeAndSetupBuffer(sourceNode, decodeBase64ToArrayBuffer(audioBase64),
          callback);
        return sourceNode;
      };

      audioContext.createReverbFromUrl = function (audioUrl, callback) {
        console.log('Downloading impulse response from ' + audioUrl);
        let reverbNode = audioContext.createConvolver(),
          request = new XMLHttpRequest();
        request.open('GET', audioUrl, true);
        request.onreadystatechange = function () {
          if (request.readyState === 4 && request.status === 200) {
            console.log('Downloaded impulse response');
            decodeAndSetupBuffer(reverbNode, request.response, callback);
          }
        };
        request.onerror = function (e) {
          console.log('There was an error receiving the response: ' + e);
          reverbjs.networkError = e;
        };
        request.responseType = 'arraybuffer';
        request.send();
        return reverbNode;
      };

      audioContext.createSourceFromUrl = function (audioUrl, callback) {
        console.log('Downloading sound from ' + audioUrl);
        let sourceNode = audioContext.createBufferSource(),
          request = new XMLHttpRequest();
        request.open('GET', audioUrl, true);
        request.onreadystatechange = function () {
          if (request.readyState === 4 && request.status === 200) {
            console.log('Downloaded sound');
            decodeAndSetupBuffer(sourceNode, request.response, callback);
          }
        };
        request.onerror = function (e) {
          console.log('There was an error receiving the response: ' + e);
          reverbjs.networkError = e;
        };
        request.responseType = 'arraybuffer';
        request.send();
        return sourceNode;
      };

      audioContext.createReverbFromBase64Url = function (audioUrl, callback) {
        console.log('Downloading base64 impulse response from ' + audioUrl);
        let reverbNode = audioContext.createConvolver(),
          request = new XMLHttpRequest();
        request.open('GET', audioUrl, true);
        request.onreadystatechange = function () {
          if (request.readyState === 4 && request.status === 200) {
            console.log('Downloaded impulse response');
            decodeAndSetupBuffer(reverbNode,
              decodeBase64ToArrayBuffer(request.response),
              callback);
          }
        };
        request.onerror = function (e) {
          console.log('There was an error receiving the response: ' + e);
          reverbjs.networkError = e;
        };
        request.send();
        return reverbNode;
      };

      audioContext.createSourceFromBase64Url = function (audioUrl, callback) {
        console.log('Downloading base64 sound from ' + audioUrl);
        let sourceNode = audioContext.createBufferSource(),
          request = new XMLHttpRequest();
        request.open('GET', audioUrl, true);
        request.onreadystatechange = function () {
          if (request.readyState === 4 && request.status === 200) {
            console.log('Downloaded sound');
            decodeAndSetupBuffer(sourceNode,
              decodeBase64ToArrayBuffer(request.response),
              callback);
          }
        };
        request.onerror = function (e) {
          console.log('There was an error receiving the response: ' + e);
          reverbjs.networkError = e;
        };
        request.send();
        return sourceNode;
      };
    }
  };
  const reverbUrl = "http://reverbjs.org/Library/HamiltonMausoleum.m4a";

  export default {
    name: 'keyboard',
    components: {
      Key,
    },
    data: function () {
      return new Keyboard();
    },
    created() {
      document.addEventListener('keydown', (e) => {
        let keyNum = e.keyCode || e.which;
        if (typeof this.keys[keyNum] !== 'undefined') {
          this.startTone(keyNum, this.keys[keyNum].position);
        }
      });
      document.addEventListener('keyup', (e) => {
        let keyNum = e.keyCode || e.which;
        if (typeof this.keys[keyNum] !== 'undefined') {
          this.stopTone(keyNum);
        }
      });
    },
    methods: {
      setOctave(step, pos) {
        if (this.currentOctave[pos] + step < 0) {
          this.currentOctave[pos] = 0;
        }

        if (this.currentOctave[pos] + step > 6) {
          this.currentOctave[pos] = 6;
        }

        this.currentOctave[pos] = this.currentOctave[pos] + step;

        for (let key in this.keys) {
          if (this.keys.hasOwnProperty(key)) {
            let item = this.keys[key];
            if (item.position === pos) {
              this.keys[key]['freq'] = Keyboard.getFreq(item.step, pos, this.currentOctave, this.octaves);
            }
          }
        }
      },

      setVolume(step, pos) {
        if (this.maxVol[pos] + step < 1) {
          return 1;
        }

        if (this.maxVol[pos] + step > 10) {
          return 10;
        }

        this.maxVol[pos] = this.maxVol[pos] + step;
      },
      setWaveForm(form, pos) {
        this.waveForm[pos] = form;
      },
      stopTone(key) {
        if (typeof key === 'undefined') {
          return;
        }

        let oscObj = this.osc[key];
        if (typeof oscObj === 'object') {
          let time = this.synth.currentTime,
            osc = oscObj['osc'],
            gainNode = oscObj['gain'];
          gainNode.gain.linearRampToValueAtTime(0, time + 0.01);
          osc.stop(time + 0.02);
          this.osc[key] = undefined;
        }
        if (typeof this.keys[key] !== 'undefined') {
          this.keys[key].pressed = false;
        }
      },

      startTone(key, pos) {
        if (this.synthSet === false) {
          this.synth = new (AudioContext || window['webkitAudioContext'])();
          reverbjs.extend(this.synth);

          this.reverbNode = this.synth.createReverbFromUrl(reverbUrl, () => {
            this.reverbNode.connect(this.synth.destination);
          });

          this.synthSet = true;
        }

        if (typeof this.osc[key] === 'object') {
          return;
        }

        let oscObj = { osc: this.synth.createOscillator(), gain: this.synth.createGain() };

        oscObj.gain.gain.setValueAtTime(0, this.synth.currentTime);
        oscObj.osc.type = this.waveForm[pos];
        oscObj.osc.frequency.setValueAtTime(this.keys[key].freq, this.synth.currentTime);

        //connect to gain
        oscObj.osc.connect(oscObj.gain);

        //connect reverb or not
        if (this.reverb) {
          oscObj.gain.connect(this.reverbNode);
        } else {
          oscObj.gain.connect(this.synth.destination);
        }

        oscObj.osc.start();
        oscObj.gain.gain.linearRampToValueAtTime((this.maxVol[pos] * 0.1), this.synth.currentTime + 0.01);
        this.osc[key] = oscObj;
        if (typeof this.keys[key] !== 'undefined') {
          this.keys[key].pressed = true;
        }
      },

    },
    computed: {
      getKeys () {
        return this.keys;
      }
    }
  }
</script>

<style lang="scss">

</style>
