<template>
  <div class="project-details" :class="{ 'is-visible': explored }">

    <!-- Fixed Background Image -->
    <div class="details-bg">
      <img :src="project?.detailsBgImage || project?.bgImage || '/images/breastfriend-details.jpg'" alt="bg" />
      <div class="bg-overlay"></div>
    </div>

    <!-- Top Bar -->
    <header class="details-header">
      <button class="back-btn" @click="$emit('back')">BACK</button>
      <button class="about-btn about-link" @click="$emit('open-about')">ABOUT ME</button>
    </header>

    <!-- Main Grid: Left carousel | Right info -->
    <div class="details-main">

      <!-- LEFT: Vertical scrolling image carousel -->
      <div class="slide-col" ref="slideColRef">
        <div
          class="slide-track"
          :style="{ transform: `translateY(${-lerpOffset}px)` }"
        >
          <div
            v-for="(slide, i) in slides"
            :key="i"
            class="slide-item"
            :class="{ active: activeSlide === i }"
          >
            <img :src="slide.src" :alt="slide.alt || `Slide ${i + 1}`" />
          </div>
        </div>
      </div>

      <!-- RIGHT: Fixed project info -->
      <div class="details-info">
        <h1 class="details-title">
          {{ project?.titleLine1 || 'DIGITAL TRAINING' }}<br/>
          {{ project?.titleLine2 || 'SUPPORT SYSTEM' }}
        </h1>

        <div class="details-meta">
          <div class="meta-block">
            <h3>{{ project?.detailMetaTitle || 'Part of a 4 member Team' }}</h3>
            <p>{{ project?.detailDescription || 'A web-based platform designed to support digital training and learning activities through course management, participant tracking, and progress monitoring.' }}</p>
          </div>
          <div class="meta-block">
            <h3>Stacks</h3>
            <p>{{ project?.detailStacks || 'PHP, MySQL, HTML, CSS+JAVASCRIPT, FFMPEG' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- FAR RIGHT: Image-based scrollbar with square outline highlight -->
    <div class="scroll-rail">
      <div class="rail-thumbs">
        <!-- Smoothly sliding active outline indicator -->
        <div
          class="rail-active-indicator"
          :style="{ transform: `translateY(${activeSlide * RAIL_STEP}px)` }"
        ></div>
        
        <div
          v-for="(slide, i) in slides"
          :key="i"
          class="rail-thumb-wrapper"
          :class="{ active: activeSlide === i }"
          @click="goToSlide(i)"
        >
          <div class="thumb-img-container">
            <img :src="slide.src" :alt="slide.alt || `Thumbnail ${i + 1}`" />
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom -->
    <footer class="details-footer">
      <div
        class="scroll-hint"
        @click="goToSlide(Math.min(activeSlide + 1, slides.length - 1))"
      >
        <span>Scroll down</span>
        <div class="scroll-icon">↓</div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  project: { type: Object, default: null },
  explored: { type: Boolean, default: false }
})

defineEmits(['back', 'open-about'])

// ─── Slides ────────────────────────────────────────────────────────────────
const slides = computed(() =>
  props.project?.slides || [
    { src: '/images/breastfriend-details.jpg', alt: 'Login Screen' },
    { src: '/images/breastfriend.jpg',         alt: 'Home Screen' },
    { src: '/images/breastfriend-details.jpg', alt: 'Features' },
    { src: '/images/breastfriend.jpg',         alt: 'Categories' },
  ]
)

// ─── Scroll State ──────────────────────────────────────────────────────────
const slideColRef  = ref(null)
const activeSlide  = ref(0)
const targetOffset = ref(0)
const lerpOffset   = ref(0)
const SLIDE_H      = ref(440)      // updated on mount/resize
const RAIL_STEP    = 74

let rafId      = null
let wheelAccum = 0
let wheelTimer = null

// Lerp animation loop — runs every frame while explored
function lerp(a, b, t) { return a + (b - a) * t }

function animLoop() {
  const diff = targetOffset.value - lerpOffset.value
  lerpOffset.value = Math.abs(diff) < 0.3
    ? targetOffset.value
    : lerp(lerpOffset.value, targetOffset.value, 0.095)
  rafId = requestAnimationFrame(animLoop)
}

function measureSlideHeight() {
  const col  = slideColRef.value
  const item = col?.querySelector('.slide-item')
  if (item) SLIDE_H.value = item.offsetHeight + 24   // height + gap
}

function goToSlide(index) {
  const clamped = Math.max(0, Math.min(slides.value.length - 1, index))
  activeSlide.value  = clamped
  targetOffset.value = clamped * SLIDE_H.value
}

function onWheel(e) {
  if (!props.explored) return
  e.preventDefault()
  
  wheelAccum += e.deltaY
  clearTimeout(wheelTimer)
  wheelTimer = setTimeout(() => {
    if      (wheelAccum >  30) goToSlide(activeSlide.value + 1)
    else if (wheelAccum < -30) goToSlide(activeSlide.value - 1)
    wheelAccum = 0
  }, 50)
}



// ─── Lifecycle ─────────────────────────────────────────────────────────────
watch(() => props.explored, (val) => {
  if (val) {
    setTimeout(() => {
      measureSlideHeight()
      goToSlide(0)
      lerpOffset.value   = 0
      if (!rafId) rafId  = requestAnimationFrame(animLoop)
    }, 60)
  } else {
    cancelAnimationFrame(rafId)
    rafId = null
  }
})

onMounted(() => {
  window.addEventListener('resize', measureSlideHeight)
  window.addEventListener('wheel', onWheel, { passive: false })
})
onUnmounted(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', measureSlideHeight)
  window.removeEventListener('wheel', onWheel)
})
</script>

<style scoped>
/* ── Outer: fixed, clips upward ───────────────────────────────────────────── */
.project-details {
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none;
  clip-path: inset(100% 0 0 0);
  transition: clip-path 0.9s cubic-bezier(0.76, 0, 0.24, 1);
  will-change: clip-path;
}
.project-details.is-visible {
  pointer-events: auto;
  clip-path: inset(0% 0 0 0);
}

/* ── Background ───────────────────────────────────────────────────────────── */
.details-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  transform: scale(1.06);
  transition: transform 1.1s cubic-bezier(0.76, 0, 0.24, 1);
}
.project-details.is-visible .details-bg {
  transform: scale(1);
}
.details-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.bg-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right, rgba(0, 0, 0, 0.39) 1%, rgba(0,0,0,0.62) 100%),
    linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 60%);
}

/* ── Top bar ──────────────────────────────────────────────────────────────── */
.details-header {
  position: absolute;
  top: 0; left: 0; right: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  padding: 36px 48px;
  color: white;
  opacity: 0;
  transform: translateY(-14px);
  transition: opacity 0.55s ease 0.45s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.45s;
}
.project-details.is-visible .details-header { opacity: 1; transform: translateY(0); }

.back-btn, .about-btn {
  background: none;
  border: none;
  color: white;
  font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.14em;
  line-height: 1.2;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;
}
.back-btn:hover, .about-btn:hover { opacity: 0.55; }
.about-btn {
  color: #ffffff !important;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.16em;
  line-height: 1.1;
  border-bottom: 1px solid currentColor;
  padding-bottom: 5px;
}

/* ── Main two-column layout ───────────────────────────────────────────────── */
.details-main {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: grid;
  /* Carousel takes ~48% of space, info takes the rest */
  grid-template-columns: 45% 1fr;
  padding: 96px 120px 80px 100px;
  gap: 0 32px;
  align-items: center;
}

/* ── LEFT: Image carousel column ─────────────────────────────────────────── */
.slide-col {
  height: calc(100vh - 176px);
  overflow: hidden;
  cursor: ns-resize;
  opacity: 0;
  transform: translateY(60px);
  transition: opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1), 
              transform 0.7s cubic-bezier(0.25, 1, 0.5, 1);
}
.project-details.is-visible .slide-col {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) 0.2s, 
              transform 1.0s cubic-bezier(0.215, 0.61, 0.355, 1) 0.2s;
}
.slide-track {
  display: flex;
  flex-direction: column;
  gap: 24px;
  will-change: transform;
}
.slide-item {
  width: 100%;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 6px 28px rgba(0,0,0,0.4);
  transition: box-shadow 0.35s, transform 0.35s;
}
.slide-item img {
  width: 100%;
  display: block;
  object-fit: cover;
}
.slide-item.active {
  box-shadow: 0 12px 48px rgba(0,0,0,0.6);
}

/* ── RIGHT: Info panel ────────────────────────────────────────────────────── */
.details-info {
  padding: 100px 100px 500px 200px;
  display: flex;
  flex-direction: column;
  gap: 52px;
  color: white;
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.7s ease 0.55s, transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.55s;
}
.project-details.is-visible .details-info { opacity: 1; transform: translateY(0); }

.details-title {
  font-family: inherit;
  font-size: clamp(40px, 5vw, 74px);
  font-weight: 400;
  line-height: 1.0;
  margin: 0;
  letter-spacing: 0.01em;
}
.details-meta {
  display: flex;
  flex-direction: column;
  gap: 36px;
}
.meta-block h3 {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgb(255, 255, 255);
  margin: 0 0 8px 0;
}
.meta-block p {
  font-size: 14px;
  line-height: 1.7;
  color: rgba(255,255,255,0.88);
  max-width: 380px;
  margin: 0;
}

/* ── RIGHT EDGE: Image-based scrollbar with square outline highlight ─────── */
.scroll-rail {
  position: absolute;
  right: 48px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  opacity: 0;
  transition: opacity 0.5s ease 0.65s;
}
.project-details.is-visible .scroll-rail { opacity: 1; }

.rail-thumbs {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rail-active-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 92px;
  height: 62px;
  border: 1.5px solid #ffffff;
  
  pointer-events: none;
  z-index: 2;
  transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
  box-sizing: border-box;
}

.rail-thumb-wrapper {
  position: relative;
  width: 92px;
  height: 62px;
  cursor: pointer;
  padding: 4px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.thumb-img-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.35);
  background: #111;
}

.thumb-img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0.55;
  transition: opacity 0.3s ease;
}

.rail-thumb-wrapper:hover .thumb-img-container img {
  opacity: 0.85;
}

.rail-thumb-wrapper.active .thumb-img-container img {
  opacity: 1;
}

/* ── Bottom ───────────────────────────────────────────────────────────────── */
.details-footer {
  position: absolute;
  bottom: 32px;
  right: 72px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.5s ease 0.7s;
}
.project-details.is-visible .details-footer { opacity: 1; }

.scroll-hint {
  display: flex;
  align-items: center;
  gap: 14px;
  color: white;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.07em;
  cursor: pointer;
  user-select: none;
}
.scroll-icon {
  width: 40px;
  height: 40px;
  border: 1.5px solid rgba(255,255,255,0.45);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: border-color 0.2s, background 0.2s;
}
.scroll-hint:hover .scroll-icon {
  border-color: white;
  background: rgba(255,255,255,0.1);
}
</style>
