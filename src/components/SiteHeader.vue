<template>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="#home" @click.prevent="scrollTo('#home')">ALDWIN</a>
      <nav class="nav">
        <a class="about-link" href="#about" @click.prevent="$emit('open-about')">ABOUT ME</a>
      </nav>
    </div>
  </header>
</template>

<script setup>
defineEmits(['open-about'])

function scrollTo(selector) {
  const target = document.querySelector(selector)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.pushState(null, '', selector)
  }
}
</script>
