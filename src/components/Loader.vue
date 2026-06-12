<template>
  <Transition name="loader-fade" @after-leave="onAfterLeave">
    <div v-if="show" id="loader" aria-hidden="true">
      <div class="loader-digits">{{ progress }}</div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['finish'])

const show = ref(true)
const progress = ref('0%')

const minDuration = 2000
let start = null
let loadResolved = false
let minTimeResolved = false

function step(ts) {
  if (!start) start = ts
  const elapsed = ts - start
  const pct = Math.min(100, Math.round((elapsed / minDuration) * 100))
  progress.value = pct + '%'
  if (pct < 100) requestAnimationFrame(step)
}

function tryFinish() {
  if (loadResolved && minTimeResolved) {
    show.value = false
    emit('finish')
  }
}

function onAfterLeave() {
  // Cleanup after transition
}

onMounted(() => {
  requestAnimationFrame(step)

  setTimeout(() => {
    minTimeResolved = true
    tryFinish()
  }, minDuration)

  if (document.readyState === 'complete') {
    loadResolved = true
    progress.value = '100%'
    tryFinish()
  } else {
    window.addEventListener('load', () => {
      loadResolved = true
      progress.value = '100%'
      tryFinish()
    })
  }
})
</script>

<style scoped>
#loader {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: #050610;
  color: var(--muted);
  z-index: 2000;
}
.loader-digits {
  display: inline-flex;
  gap: 6px;
  letter-spacing: .05em;
  font-weight: 600;
}
.loader-fade-leave-active {
  transition: opacity 10s ease;
}
.loader-fade-leave-to {
  opacity: 0;
}
</style>
