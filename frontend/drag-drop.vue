<!-- https://sfc.vuejs.org/ -->
<!-- https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX
https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY
https://www.youtube.com/watch?v=VeNfHj6MhgA -->

<script>
export default {
  data() {
    return {
      items: []
    };
  },
  methods: {
    dragStart(type) {
      event.dataTransfer.setData("text/plain", type);
    },
    drop(event) {
      const type = event.dataTransfer.getData("text/plain");

      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.items.push({
        type,
        style: {
          position: 'absolute',
          left: x + 'px',
          top: y + 'px'
        }
      });
    }
  }
};
</script>

<template>
  <div>
    <h3>Drag & Drop Components</h3>
    <div class="library">
      <button draggable="true" @dragstart="dragStart('Text')">Text</button>
      <button draggable="true" @dragstart="dragStart('Button')">Button</button>
    </div>
    <div class="preview" @drop="drop" @dragover.prevent>
      <div v-for="(item, index) in items" :key="index" :style="item.style">
        <button v-if="item.type === 'Button'">Button</button>
        <p v-else-if="item.type === 'Text'">Text Component</p>
      </div>
    </div>
  </div>
</template>

<style>
.library {
  margin-bottom: 10px;
}
.preview {
  min-height: 300px;
  border: 1px dashed black;
  padding: 10px;
  position: relative;
}
</style>