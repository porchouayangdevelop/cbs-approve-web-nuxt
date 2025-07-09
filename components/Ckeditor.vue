<script setup lang="ts">
let ClassicEditor;
let CKEditor;

if (process.client) {
  ClassicEditor = import('@ckeditor/ckeditor5-editor-classic');
  CKEditor = import('@ckeditor/ckeditor5-vue');
} else {
  CKEditor = {component: {template: '<div></div>'}};
}

</script>

<template>
  <div>
    Component: Ckeditor
  </div>
</template>

<style scoped></style>
