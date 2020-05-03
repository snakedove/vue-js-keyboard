interface Key {
  'tone': string,
  'freq': number,
  'color': string,
  'key': string,
  'name': string,
  'step': number,
  'position': string,
  'pressed': boolean
}

interface Keys {
  [key: number]: Key;
}

interface NumberConfig {
  top: number;
  bottom: number;
  [key: string]: number;
}

interface StringConfig {
  top: string;
  bottom: string;
  [key: string]: string;
}

interface Order {
  position: string;
  keys: number[];
}

export const factor = 2 ** (1 / 12);

export class Keyboard {

  public keys: Keys;
  public synth: any;
  public synthSet: boolean;
  public osc: any;
  public currentOctave: NumberConfig;
  public reverbNode: any;
  public maxVol: NumberConfig;
  public waveForm: StringConfig;
  public octaves: number[];
  public order: Order[];
  public reverb: boolean;

  constructor() {
    this.synth = {};
    this.synthSet = false;
        this.reverbNode = {};
    this.osc  =  {};
    this.currentOctave =  {
      top: 3,
          bottom: 2
    };
    this.maxVol =  {
      top: 5,
          bottom: 5
    };
    this.waveForm =  {
      top: 'sine',
          bottom: 'sine'
    };
    this.octaves =  [55, 110, 220, 440, 880, 1760, 3520];
        this.order =  [
      {
        position: 'top', keys: [81, 50, 87, 51, 69, 82, 53, 84, 54, 90, 55, 85, 73, 57, 79, 48, 80, 219]
      },
      {
        position: 'bottom', keys: [89, 83, 88, 68, 67, 86, 71, 66, 72, 78, 74, 77, 188, 76, 190, 186, 189, 16]
      }
    ];
        this.reverb =  false;

    this.keys = {
      89: {
        'tone': 'c4',
        'freq': Keyboard.getFreq(-9, 'bottom', this.currentOctave, this.octaves),
        'color': 'white',
        'key': 'y',
        'name': 'c4',
        'step': -9,
        'position': 'bottom',
        'pressed': false
      },
      83: {
        'tone': 'cis4',
        'freq': Keyboard.getFreq(-8, 'bottom', this.currentOctave, this.octaves),
        'color': 'black',
        'key': 's',
        'name': 'c4#',
        'step': -8,
        'position': 'bottom',
        'pressed': false
      },
      88: {
        'tone': 'd4',
        'freq': Keyboard.getFreq(-7, 'bottom', this.currentOctave, this.octaves),
        'color': 'white',
        'key': 'x',
        'name': 'd4',
        'step': -7,
        'position': 'bottom',
        'pressed': false
      },
      68: {
        'tone': 'dis4',
        'freq': Keyboard.getFreq(-6, 'bottom', this.currentOctave, this.octaves),
        'color': 'black',
        'key': 'd',
        'name': 'd4#',
        'step': -6,
        'position': 'bottom',
        'pressed': false
      },
      67: {
        'tone': 'e4',
        'freq': Keyboard.getFreq(-5, 'bottom', this.currentOctave, this.octaves),
        'color': 'white',
        'key': 'c',
        'name': 'e4',
        'step': -5,
        'position': 'bottom',
        'pressed': false
      },
      86: {
        'tone': 'f4',
        'freq': Keyboard.getFreq(-4, 'bottom', this.currentOctave, this.octaves),
        'color': 'white',
        'key': 'v',
        'name': 'f4',
        'step': -4,
        'position': 'bottom',
        'pressed': false
      },
      71: {
        'tone': 'fis4',
        'freq': Keyboard.getFreq(-3, 'bottom', this.currentOctave, this.octaves),
        'color': 'black',
        'key': 'g',
        'name': 'f4#',
        'step': -3,
        'position': 'bottom',
        'pressed': false
      },
      66: {
        'tone': 'g4',
        'freq': Keyboard.getFreq(-2, 'bottom', this.currentOctave, this.octaves),
        'color': 'white',
        'key': 'b',
        'name': 'g4',
        'step': -2,
        'position': 'bottom',
        'pressed': false
      },
      72: {
        'tone': 'gis4',
        'freq': Keyboard.getFreq(-1, 'bottom', this.currentOctave, this.octaves),
        'color': 'black',
        'key': 'h',
        'name': 'g4#',
        'step': -1,
        'position': 'bottom',
        'pressed': false
      },
      78: {
        'tone': 'a4',
        'freq': Keyboard.getFreq(0, 'bottom', this.currentOctave, this.octaves),
        'color': 'white',
        'key': 'n',
        'name': 'a4',
        'step': 0,
        'position': 'bottom',
        'pressed': false
      },
      74: {
        'tone': 'ais4',
        'freq': Keyboard.getFreq(1, 'bottom', this.currentOctave, this.octaves),
        'color': 'black',
        'key': 'j',
        'name': 'a4#',
        'step': 1,
        'position': 'bottom',
        'pressed': false
      },
      77: {
        'tone': 'h4',
        'freq': Keyboard.getFreq(2, 'bottom', this.currentOctave, this.octaves),
        'color': 'white',
        'key': 'm',
        'name': 'b4',
        'step': 2,
        'position': 'bottom',
        'pressed': false
      },
      188: {
        'tone': 'c5',
        'freq': Keyboard.getFreq(3, 'bottom', this.currentOctave, this.octaves),
        'color': 'white',
        'key': ',',
        'name': 'c5',
        'step': 3,
        'position': 'bottom',
        'pressed': false
      },
      76: {
        'tone': 'cis5',
        'freq': Keyboard.getFreq(4, 'bottom', this.currentOctave, this.octaves),
        'color': 'black',
        'key': 'l',
        'name': 'c5#',
        'step': 4,
        'position': 'bottom',
        'pressed': false
      },
      190: {
        'tone': 'd5',
        'freq': Keyboard.getFreq(5, 'bottom', this.currentOctave, this.octaves),
        'color': 'white',
        'key': '.',
        'name': 'd5',
        'step': 5,
        'position': 'bottom',
        'pressed': false
      },
      186: {
        'tone': 'dis5',
        'freq': Keyboard.getFreq(6, 'bottom', this.currentOctave, this.octaves),
        'color': 'black',
        'key': 'ö',
        'name': 'd5#',
        'step': 6,
        'position': 'bottom',
        'pressed': false
      },
      189: {
        'tone': 'e5',
        'freq': Keyboard.getFreq(7, 'bottom', this.currentOctave, this.octaves),
        'color': 'white',
        'key': '-',
        'name': 'e5',
        'step': 7,
        'position': 'bottom',
        'pressed': false
      },
      16: {
        'tone': 'f5',
        'freq': Keyboard.getFreq(8, 'bottom', this.currentOctave, this.octaves),
        'color': 'white',
        'key': 'shift',
        'name': 'f5',
        'step': 8,
        'position': 'bottom',
        'pressed': false
      },
      81: {
        'tone': 'c4',
        'freq': Keyboard.getFreq(-9, 'top', this.currentOctave, this.octaves),
        'color': 'white',
        'key': 'q',
        'name': 'c4',
        'step': -9,
        'position': 'top',
        'pressed': false
      },
      50: {
        'tone': 'cis4',
        'freq': Keyboard.getFreq(-8, 'top', this.currentOctave, this.octaves),
        'color': 'black',
        'key': '2',
        'name': 'c4#',
        'step': -8,
        'position': 'top',
        'pressed': false
      },
      87: {
        'tone': 'd4',
        'freq': Keyboard.getFreq(-7, 'top', this.currentOctave, this.octaves),
        'color': 'white',
        'key': 'w',
        'name': 'd4',
        'step': -7,
        'position': 'top',
        'pressed': false
      },
      51: {
        'tone': 'dis4',
        'freq': Keyboard.getFreq(-6, 'top', this.currentOctave, this.octaves),
        'color': 'black',
        'key': '3',
        'name': 'd4#',
        'step': -6,
        'position': 'top',
        'pressed': false
      },
      69: {
        'tone': 'e4',
        'freq': Keyboard.getFreq(-5, 'top', this.currentOctave, this.octaves),
        'color': 'white',
        'key': 'e',
        'name': 'e4',
        'step': -5,
        'position': 'top',
        'pressed': false
      },
      82: {
        'tone': 'f4',
        'freq': Keyboard.getFreq(-4, 'top', this.currentOctave, this.octaves),
        'color': 'white',
        'key': 'r',
        'name': 'f4',
        'step': -4,
        'position': 'top',
        'pressed': false
      },
      53: {
        'tone': 'fis4',
        'freq': Keyboard.getFreq(-3, 'top', this.currentOctave, this.octaves),
        'color': 'black',
        'key': '5',
        'name': 'f4#',
        'step': -3,
        'position': 'top',
        'pressed': false
      },
      84: {
        'tone': 'g4',
        'freq': Keyboard.getFreq(-2, 'top', this.currentOctave, this.octaves),
        'color': 'white',
        'key': 't',
        'name': 'g4',
        'step': -2,
        'position': 'top',
        'pressed': false
      },
      54: {
        'tone': 'gis4',
        'freq': Keyboard.getFreq(-1, 'top', this.currentOctave, this.octaves),
        'color': 'black',
        'key': '6',
        'name': 'g4#',
        'step': -1,
        'position': 'top',
        'pressed': false
      },
      90: {
        'tone': 'a4',
        'freq': Keyboard.getFreq(0, 'top', this.currentOctave, this.octaves),
        'color': 'white',
        'key': 'z',
        'name': 'a4',
        'step': 0,
        'position': 'top',
        'pressed': false
      },
      55: {
        'tone': 'ais4',
        'freq': Keyboard.getFreq(1, 'top', this.currentOctave, this.octaves),
        'color': 'black',
        'key': '7',
        'name': 'a4#',
        'step': 1,
        'position': 'top',
        'pressed': false
      },
      85: {
        'tone': 'h4',
        'freq': Keyboard.getFreq(2, 'top', this.currentOctave, this.octaves),
        'color': 'white',
        'key': 'u',
        'name': 'b4',
        'step': 2,
        'position': 'top',
        'pressed': false
      },
      73: {
        'tone': 'c5',
        'freq': Keyboard.getFreq(3, 'top', this.currentOctave, this.octaves),
        'color': 'white',
        'key': 'i',
        'name': 'c5',
        'step': 3,
        'position': 'top',
        'pressed': false
      },
      57: {
        'tone': 'cis5',
        'freq': Keyboard.getFreq(4, 'top', this.currentOctave, this.octaves),
        'color': 'black',
        'key': '9',
        'name': 'c5#',
        'step': 4,
        'position': 'top',
        'pressed': false
      },
      79: {
        'tone': 'd5',
        'freq': Keyboard.getFreq(5, 'top', this.currentOctave, this.octaves),
        'color': 'white',
        'key': 'o',
        'name': 'd5',
        'step': 5,
        'position': 'top',
        'pressed': false
      },
      48: {
        'tone': 'dis5',
        'freq': Keyboard.getFreq(6, 'top', this.currentOctave, this.octaves),
        'color': 'black',
        'key': '0',
        'name': 'd5#',
        'step': 6,
        'position': 'top',
        'pressed': false
      },
      80: {
        'tone': 'e5',
        'freq': Keyboard.getFreq(7, 'top', this.currentOctave, this.octaves),
        'color': 'white',
        'key': 'p',
        'name': 'e5',
        'step': 7,
        'position': 'top',
        'pressed': false
      },
      219: {
        'tone': 'f5',
        'freq': Keyboard.getFreq(8, 'top', this.currentOctave, this.octaves),
        'color': 'white',
        'key': 'ü',
        'name': 'f5',
        'step': 8,
        'position': 'top',
        'pressed': false
      }
    };
  }

  static getFreq(step: number, pos: string, currentOctave: NumberConfig, octaves: number[]) {
    let positionOfCurrentOctave = currentOctave[pos];
    return octaves[positionOfCurrentOctave] * (factor ** step);
  }
}
