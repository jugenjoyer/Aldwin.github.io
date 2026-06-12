<template>
  <section
    class="about-page"
    :class="{ 'is-visible': visible }"
    @wheel.prevent="handleWheel"
    @touchstart="handleTouchStart"
    @touchmove.prevent="handleTouchMove"
  >
    <div class="about-content" :style="{ transform: `translate3d(0, ${contentY}px, 0)`, opacity: contentOpacity }">
      <h2>I can help you with<span class="blink-cursor">_</span></h2>

      <div class="about-services">
        <article>
          <span>01</span>
          <h3>Design</h3>
          <p>Drawing on extensive experience in web design, I create impactful digital solutions that combine intuitive user experiences with modern, effective design.</p>
        </article>
        <article>
          <span>02</span>
          <h3>Development</h3>
          <p>
            <span class="dev-intro">I build scalable websites and web applications from scratch, focusing on performance, usability, and seamless user interaction.</span>
            <span class="dev-stackline"> My tech stack includes PHP, Laravel, JavaScript, Vue.js, React, Tailwind CSS, and Livewire.</span>
          </p>
        </article>
        <article>
          <span>03</span>
          <h3>The package</h3>
          <p>From concept to deployment, I build complete web experiences with careful attention to design, functionality, and performance.</p>
        </article>
      </div>

    </div>

    <span class="about-scroll about-scroll--content">Scroll down</span>

    <section class="about-contact" :style="contactStyle" aria-label="Get in touch">
      <button class="contact-work-link" @click="$emit('close')">WORK</button>

      <div class="contact-center">
        <h2>GET IN TOUCH</h2>
        <p>
          YOU CAN REACH ME AT
          <a href="mailto:aldwinmendoza.neust@gmail.com">ALDWINMENDOZA.NEUST@GMAIL.COM</a>
        </p>
      </div>

      <div class="contact-socials">
        <span>SOCIALS</span>
        <nav aria-label="Social links">
          <a href="#" aria-label="Facebook">FACEBOOK</a>
          <a href="#" aria-label="Instagram">INSTAGRAM</a>
          <a href="#" aria-label="LinkedIn">LINKEDIN</a>
        </nav>
      </div>
    </section>

    <div class="about-frame" :style="frameStyle">
      <div class="about-hero">
        <header class="about-header">
          <button class="work-link" @click="$emit('close')">WORK</button>
        </header>

        <div class="about-visual" :style="{ transform: `translate3d(0, ${titleLift}px, 0)`, opacity: titleOpacity }">
          <h1 class="about-title about-title--solid" aria-label="ALDWIN">
            <span>A</span>
            <span>L</span>
            <span>D</span>
            <span>W</span>
            <span>I</span>
            <span>N</span>
          </h1>
        </div>

        <div class="about-image-wrap">
          <img src="/images/aldwin.png" alt="Aldwin" />
        </div>

        <h1
          class="about-title about-title--outline about-title--floating"
          aria-hidden="true"
          :style="{ transform: `translate3d(0, ${titleLift}px, 0)`, opacity: titleOpacity }"
        >
          <span>A</span>
          <span>L</span>
          <span>D</span>
          <span>W</span>
          <span>I</span>
          <span>N</span>
        </h1>

        <div class="about-copy about-copy--left" :style="{ transform: `translate3d(0, ${copyLift}px, 0)`, opacity: copyOpacity }">
          <p>Web developer with over three years of non-professional experience in creating modern, responsive websites and web applications.</p>
        </div>

        <div class="about-copy about-copy--right" :style="{ transform: `translate3d(0, ${copyLift}px, 0)`, opacity: copyOpacity }">
          <p>Dedicated to building user-centered digital experiences and continuously expanding knowledge in emerging web technologies.</p>
        </div>

        <span class="about-scroll about-scroll--hero">Scroll down</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false }
})

defineEmits(['close'])

const titleLift = ref(0)
const titleOpacity = ref(1)
const copyLift = ref(240)
const copyOpacity = ref(0)
const stage = ref(0)
const contentReady = ref(false)
let touchStartY = 0
let scrollLocked = false
let contentTimer
let resetTimer

const frameStyle = computed(() => {
  if (stage.value < 2) return { transform: 'translate3d(0, 0, 0) scale(1)' }
  return { transform: 'translate3d(-4vw, 4vh, 0) scale(0.52)' }
})

const contentY = computed(() => contentReady.value ? 0 : 180)
const contentOpacity = computed(() => contentReady.value ? 1 : 0)
const contactStyle = computed(() => ({
  transform: stage.value === 3 ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100%, 0)'
}))

function applyStage(nextStage) {
  stage.value = Math.max(0, Math.min(3, nextStage))
  window.clearTimeout(contentTimer)
  contentReady.value = false

  const textVisible = stage.value >= 1
  titleLift.value = textVisible ? -(window.innerHeight * 0.5) : 0
  titleOpacity.value = textVisible ? 0 : 1
  copyLift.value = textVisible ? 0 : 260
  copyOpacity.value = textVisible ? 1 : 0

  if (stage.value === 2) {
    contentTimer = window.setTimeout(() => {
      contentReady.value = true
    }, 760)
  }
}

function moveStage(direction) {
  const nextStage = stage.value + direction
  if (scrollLocked || nextStage < 0 || nextStage > 3) return

  scrollLocked = true
  applyStage(nextStage)
  window.setTimeout(() => {
    scrollLocked = false
  }, 900)
}

function handleWheel(event) {
  const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
  if (delta > 0) {
    moveStage(1)
  } else if (delta < 0) {
    moveStage(-1)
  }
}

function handleTouchStart(event) {
  touchStartY = event.touches?.[0]?.clientY || 0
}

function handleTouchMove(event) {
  const currentY = event.touches?.[0]?.clientY || touchStartY
  const delta = touchStartY - currentY
  touchStartY = currentY
  if (delta > 0) {
    moveStage(1)
  } else if (delta < 0) {
    moveStage(-1)
  }
}

watch(() => props.visible, (val) => {
  window.clearTimeout(resetTimer)

  if (!val) {
    window.clearTimeout(contentTimer)
    contentReady.value = false
    scrollLocked = false
    resetTimer = window.setTimeout(() => {
      applyStage(0)
    }, 980)
    return
  }

  scrollLocked = false
  applyStage(0)
})
</script>

<style scoped>
.about-page {
  position: fixed;
  inset: 0;
  z-index: 120;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  pointer-events: none;
  color: #1f2024;
  background: #f5f3f3;
  clip-path: inset(100% 0 0 0);
  transition: clip-path 0.9s cubic-bezier(0.76, 0, 0.24, 1);
  will-change: clip-path;
}

.about-page.is-visible {
  pointer-events: auto;
  clip-path: inset(0% 0 0 0);
}

.about-hero {
  position: absolute;
  inset: 0;
  z-index: 2;
  min-height: 100vh;
  overflow: hidden;
}

.about-frame {
  position: fixed;
  inset: 0;
  z-index: 2;
  overflow: hidden;
  color: #fff;
  background:
    linear-gradient(90deg, rgba(166, 100, 0, 0.94) 0%, rgba(105, 60, 7, 0.95) 45%, rgba(28, 13, 1, 0.98) 100%),
    #6d3f00;
  transform-origin: top right;
  transition: transform 1.15s cubic-bezier(0.76, 0, 0.24, 1);
  will-change: transform;
}

.about-contact {
  position: fixed;
  inset: 0;
  z-index: 8;
  display: grid;
  place-items: center;
  overflow: hidden;
  color: var(--text, #fff);
  background: var(--project-bg-base, linear-gradient(90deg, #a66400 0%, #693c07 45%, #1c0d01 100%));
  transition: transform 0.95s cubic-bezier(0.76, 0, 0.24, 1);
  will-change: transform;
}

.contact-work-link {
  position: absolute;
  top: 48px;
  left: 50%;
  transform: translateX(-50%);
  appearance: none;
  border: 0;
  border-bottom: 1px solid currentColor;
  padding: 0 0 5px;
  background: transparent;
  color: currentColor;
  font-family: 'Koulen', Impact, sans-serif;
  font-size: 18px;
  line-height: 1;
  letter-spacing: 0;
  cursor: pointer;
}

.contact-center {
  text-align: center;
  color: currentColor;
}

.contact-center h2 {
  margin: 0 0 26px;
  font-family: 'Koulen', Impact, sans-serif;
  font-size: clamp(56px, 5vw, 112px);
  font-weight: 400;
  line-height: 0.9;
  letter-spacing: 0;
}

.contact-center p {
  margin: 0;
  font-family: 'Koulen', Impact, sans-serif;
  font-size: clamp(16px, 1.1vw, 26px);
  line-height: 1.1;
  color: currentColor;
}

.contact-center a,
.contact-socials a {
  color: currentColor;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.contact-socials {
  position: absolute;
  left: 50%;
  bottom: 46px;
  transform: translateX(-50%);
  display: grid;
  gap: 18px;
  justify-items: center;
  font-family: 'Koulen', Impact, sans-serif;
  font-size: clamp(16px, 1.05vw, 24px);
  line-height: 1;
  color: currentColor;
}

.contact-socials span {
  opacity: 0.68;
}

.contact-socials nav {
  display: flex;
  gap: 22px;
}

.about-content {
  position: fixed;
  left: 13vw;
  right: 6vw;
  top: 47vh;
  z-index: 1;
  color: #1f2024;
  transition: transform 1.05s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.75s ease;
  will-change: transform, opacity;
}

.about-content h2 {
  margin: 50px 0 70px;
  font-family: 'Koulen', Impact, sans-serif;
  font-size: clamp(34px, 3vw, 74px);
  font-weight: 400;
  line-height: 0.9;
  letter-spacing: 0;
  text-transform: uppercase;
  color: #1f2024;
}

.blink-cursor {
  display: inline-block;
  animation: blink-cursor 1s steps(1, end) infinite;
}

.about-services {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(28px, 3vw, 72px);
}

.about-services article {
  position: relative;
  border-top: 1px solid #d5d5d6;
  padding-top: 18px;
  transition: transform 0.45s ease, opacity 0.45s ease;
}

.about-services article:nth-child(2) {
  overflow: visible;
}

.about-services article > span {
  display: block;
  margin-bottom: clamp(18px, 2vw, 36px);
  font: 500 clamp(10px, 0.65vw, 12px)/1 'Inter', system-ui, sans-serif;
  color: #a0a3ad;
}

.about-services h3 {
  margin: 0 0 clamp(12px, 1vw, 20px);
  font: 500 clamp(16px, 1.2vw, 30px)/1.05 'Inter', system-ui, sans-serif;
  color: #1f2024;
  transition: filter 0.45s ease, opacity 0.45s ease, transform 0.45s ease;
}

.about-services p {
  margin: 0;
  max-width: 340px;
  font: 400 clamp(17px, 0.7vw, 15px)/1.35 'Inter', system-ui, sans-serif;
  color: #4d5058;
  transition: filter 0.45s ease, opacity 0.45s ease, transform 0.45s ease;
}

.about-services article:nth-child(2) p {
  max-width: 430px;
  font-size: clamp(17px, 0.7vw, 15px);
  line-height: 1.35;
}

.dev-intro,
.dev-stackline {
  display: inline;
  margin: 0;
  font: inherit;
}

.dev-stackline {
  font: inherit;
  color: inherit;
}

.about-services article:nth-child(2):hover h3,
.about-services article:nth-child(2):hover .dev-intro {
  filter: blur(10px);
  opacity: 1.14;
  transform: translateY(-4px);
}

.about-services article:nth-child(2):hover .dev-stackline {
  filter: none;
  opacity: 1;
}

.about-visual {
  position: absolute;
  inset: 0;
  z-index: 2;
  will-change: transform;
  transition: transform 1.05s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.7s ease;
}

.about-header {
  position: absolute;
  top: 32px;
  left: 0;
  right: 0;
  z-index: 8;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.work-link {
  pointer-events: auto;
  appearance: none;
  border: 0;
  border-bottom: 1px solid currentColor;
  padding: 20px 0 5px;
  background: transparent;
  color: #fff;
  font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.16em;
  line-height: 1.1;
  cursor: pointer;
}

.about-image-wrap {
  position: absolute;
  left: 50%;
  bottom: -10vh;
  z-index: 3;
  width: min(36vw, 66vh, 750px);
  transform: translateX(-50%);
  pointer-events: none;
}

.about-image-wrap img {
  width: 100%;
  max-height: 116vh;
  height: auto;
  object-fit: contain;
  display: block;
}

.about-title {
  position: absolute;
  left: 5vw;
  right: 5vw;
  top: 70%;
  bottom: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin: 0;
  color: #fff;
  font-family: 'Koulen', Impact, sans-serif;
  font-size: clamp(120px, 19vw, 360px);
  font-weight: 400;
  line-height: 0.76;
  letter-spacing: 0;
  pointer-events: none;
}

.about-title--solid {
  z-index: 1;
  color: #fff;
}

.about-title--outline {
  z-index: 4;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.9);
  text-stroke: 1.5px rgba(255, 255, 255, 0.9);
}

.about-title--floating {
  position: absolute;
  left: 5vw;
  right: 5vw;
  top: 70%;
  bottom: auto;
  transition: transform 1.05s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.7s ease;
  will-change: transform;
}

.about-copy {
  position: absolute;
  top: 70%;
  z-index: 5;
  width: min(24vw, 360px);
  font-family: 'Koulen', Impact, sans-serif;
  font-size: clamp(18px, 1.05vw, 34px);
  line-height: 1.15;
  text-transform: uppercase;
  letter-spacing: 0;
  pointer-events: none;
  transition: transform 1.05s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.7s ease;
  will-change: transform, opacity;
}

.about-copy p {
  margin: 0;
}

.about-copy--left {
  left: 9vw;
}

.about-copy--right {
  right: 6vw;
  text-align: right;
}

.about-scroll {
  font: 600 12px/1.1 'Inter', system-ui, sans-serif;
  letter-spacing: 0;
}

.about-scroll--hero {
  position: absolute;
  right: 34px;
  bottom: 26px;
  z-index: 7;
  color: rgba(255, 255, 255, 0.8);
}

.about-scroll--content {
  position: fixed;
  right: 34px;
  bottom: 26px;
  z-index: 7;
  display: block;
  color: rgba(31, 32, 36, 0.72);
}

.about-scroll--hero,
.about-scroll--content {
  pointer-events: none;
  font: 600 12px/1.1 'Inter', system-ui, sans-serif;
}

@keyframes blink-cursor {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

@media (max-width: 760px) {
  .about-image-wrap {
    width: min(86vw, 72vh, 750px);
    min-width: 0;
    bottom: -2vh;
  }

  .about-title {
    left: 4vw;
    right: 4vw;
    top: 70%;
    bottom: auto;
    font-size: clamp(72px, 18vw, 140px);
  }

  .about-scroll {
    right: 18px;
  }

  .about-scroll--hero {
    bottom: 18px;
  }

  .about-scroll--content {
    right: 18px;
    bottom: 18px;
  }

  .about-copy {
    width: 40vw;
    top: 48%;
    font-size: clamp(12px, 3vw, 18px);
  }

  .about-copy--left {
    left: 5vw;
  }

  .about-copy--right {
    right: 5vw;
  }

  .about-content {
    left: 6vw;
    right: 6vw;
    top: 40vh;
  }

  .about-content h2 {
    margin: 30px 0 40px;
    font-size: clamp(24px, 6vw, 40px);
  }

  .about-services {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .about-services article > span {
    margin-bottom: 20px;
  }

  .about-services h3 {
    margin: 0 0 14px;
    font-size: clamp(20px, 5vw, 30px);
  }

  .about-services p {
    max-width: none;
    font-size: clamp(13px, 3.2vw, 16px);
  }

  .about-services article:nth-child(2) p {
    max-width: none;
    font-size: clamp(13px, 3.2vw, 16px);
  }
}
</style>
