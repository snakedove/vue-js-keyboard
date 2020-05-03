<template>
  <div v-if="color === allData.color"
       @touchstart="startTone(num, getAllData.position)"
       @touchend="stopTone(num)"
       @touchmove="stopTone(num)"
       @mousedown="startTone(num, getAllData.position)"
       @mouseup="stopTone(num)"
       @mouseleave="stopTone(num)"
       :class="'key noselect' + (getPressed ? ' highlight': '')"
       :id="getAllData.tone + getAllData.position" :data-color="getAllData.color" :data-keycode="num">
    <span class="noselect">{{ getAllData.name }}<br>{{ getAllData.key }}</span>
  </div>
</template>

<script>
  export default {
    props: {
      'num': Number,
      'data': {},
      'color': String
    },
    data: function () {
      return {
        pressed: false,
        allData: {
          'tone': '',
          'freq': 0,
          'color': '',
          'key': '',
          'name': '',
          'step': 0,
          'position': '',
          'pressed': false
        }
      };
    },
    name: 'key',
    created () {
      this.allData = this.$props.data;
    },
    methods: {
      startTone (num, pos) {
        this.$emit('start-tone', num, pos);
      },
      stopTone (num) {
        this.$emit('stop-tone', num);
      }
    },
    computed: {
      getAllData () {
        return this.allData;
      },
      getPressed () {
        return this.getAllData.pressed;
      }
    }
  }
</script>

<style lang="scss">
  //nothing here yet
</style>
