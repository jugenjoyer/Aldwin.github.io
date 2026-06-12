<template>
  <section id="home" class="section hero-layered">
    <div ref="stageRef" class="hero-stage" :class="[`project-change-${changeDirection}`, { 'is-project-changing': imageChanging }]">
      <img
        ref="bgRef"
        class="hero-img-bg hero-img-bg--previous"
        :src="previousImages.bg"
        alt=""
        aria-hidden="true"
      />
      <img
        ref="bgRef"
        :key="`bg-${imageVersion}`"
        class="hero-img-bg hero-img-bg--current"
        :src="selectedProject?.bgImage || '/images/breastfriend.jpg'"
        alt="Project background"
        @load="alignOverlay"
      />
      <h1 ref="solidRef" class="hero-title hero-title--solid">
        <span class="line line1">
          <span class="title-line-shell">
            <span class="title-line-flow">{{ currentTitle.line1 }}</span>
            <span
              v-if="titleChanging"
              class="title-letter-row title-letter-row--out"
              aria-hidden="true"
            >
              <span
                v-for="(char, index) in splitChars(previousTitle.line1)"
                :key="`solid-prev-1-${index}-${char}`"
                class="title-letter"
              >{{ char }}</span>
            </span>
            <span class="title-letter-row title-letter-row--in">
              <span
                v-for="(char, index) in splitChars(currentTitle.line1)"
                :key="`solid-current-1-${titleVersion}-${index}-${char}`"
                class="title-letter"
              >{{ char }}</span>
            </span>
          </span>
        </span>
        <span class="line line2">
          <span class="title-line-shell">
            <span class="title-line-flow">{{ currentTitle.line2 }}</span>
            <span
              v-if="titleChanging"
              class="title-letter-row title-letter-row--out"
              aria-hidden="true"
            >
              <span
                v-for="(char, index) in splitChars(previousTitle.line2)"
                :key="`solid-prev-2-${index}-${char}`"
                class="title-letter"
              >{{ char }}</span>
            </span>
            <span class="title-letter-row title-letter-row--in">
              <span
                v-for="(char, index) in splitChars(currentTitle.line2)"
                :key="`solid-current-2-${titleVersion}-${index}-${char}`"
                class="title-letter"
              >{{ char }}</span>
            </span>
          </span>
        </span>
        <span v-if="currentTitle.line3" class="line line3">
          <span class="title-line-shell">
            <span class="title-line-flow">{{ currentTitle.line3 }}</span>
            <span
              v-if="titleChanging"
              class="title-letter-row title-letter-row--out"
              aria-hidden="true"
            >
              <span
                v-for="(char, index) in splitChars(previousTitle.line3)"
                :key="`solid-prev-3-${index}-${char}`"
                class="title-letter"
              >{{ char }}</span>
            </span>
            <span class="title-letter-row title-letter-row--in">
              <span
                v-for="(char, index) in splitChars(currentTitle.line3)"
                :key="`solid-current-3-${titleVersion}-${index}-${char}`"
                class="title-letter"
              >{{ char }}</span>
            </span>
          </span>
        </span>
      </h1>
      <img
        class="hero-img-fg hero-img-fg--previous"
        :src="previousImages.fg"
        alt=""
        aria-hidden="true"
      />
      <img
        :key="`fg-${imageVersion}`"
        class="hero-img-fg hero-img-fg--current"
        :src="selectedProject?.fgImage || '/images/backgroundremoved.jpg'"
        alt="Project foreground"
        @load="alignOverlay"
      />
      <div ref="overlayRef" class="hero-clip-over-image">
        <h1 ref="outlineRef" class="hero-title hero-title--outline">
          <span class="line line1">
            <span class="title-line-shell">
              <span class="title-line-flow">{{ currentTitle.line1 }}</span>
              <span
                v-if="titleChanging"
                class="title-letter-row title-letter-row--out"
                aria-hidden="true"
              >
                <span
                  v-for="(char, index) in splitChars(previousTitle.line1)"
                  :key="`outline-prev-1-${index}-${char}`"
                  class="title-letter"
                >{{ char }}</span>
              </span>
              <span class="title-letter-row title-letter-row--in">
                <span
                  v-for="(char, index) in splitChars(currentTitle.line1)"
                  :key="`outline-current-1-${titleVersion}-${index}-${char}`"
                  class="title-letter"
                >{{ char }}</span>
              </span>
            </span>
          </span>
          <span class="line line2">
            <span class="title-line-shell">
              <span class="title-line-flow">{{ currentTitle.line2 }}</span>
              <span
                v-if="titleChanging"
                class="title-letter-row title-letter-row--out"
                aria-hidden="true"
              >
                <span
                  v-for="(char, index) in splitChars(previousTitle.line2)"
                  :key="`outline-prev-2-${index}-${char}`"
                  class="title-letter"
                >{{ char }}</span>
              </span>
              <span class="title-letter-row title-letter-row--in">
                <span
                  v-for="(char, index) in splitChars(currentTitle.line2)"
                  :key="`outline-current-2-${titleVersion}-${index}-${char}`"
                  class="title-letter"
                >{{ char }}</span>
              </span>
            </span>
          </span>
          <span v-if="currentTitle.line3" class="line line3">
            <span class="title-line-shell">
              <span class="title-line-flow">{{ currentTitle.line3 }}</span>
              <span
                v-if="titleChanging"
                class="title-letter-row title-letter-row--out"
                aria-hidden="true"
              >
                <span
                  v-for="(char, index) in splitChars(previousTitle.line3)"
                  :key="`outline-prev-3-${index}-${char}`"
                  class="title-letter"
                >{{ char }}</span>
              </span>
              <span class="title-letter-row title-letter-row--in">
                <span
                  v-for="(char, index) in splitChars(currentTitle.line3)"
                  :key="`outline-current-3-${titleVersion}-${index}-${char}`"
                  class="title-letter"
                >{{ char }}</span>
              </span>
            </span>
          </span>
        </h1>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  selectedProject: {
    type: Object,
    default: null
  }
})

const stageRef = ref(null)
const bgRef = ref(null)
const overlayRef = ref(null)
const solidRef = ref(null)
const outlineRef = ref(null)
const currentTitle = ref(getProjectTitle(props.selectedProject))
const previousTitle = ref(currentTitle.value)
const titleChanging = ref(false)
const titleVersion = ref(0)
const changeDirection = ref('next')
const imageChanging = ref(false)
const imageVersion = ref(0)
const previousImages = ref(getProjectImages(props.selectedProject))

let titleTimer = null
let imageTimer = null

// Watch for project changes to re-align overlay
watch(() => props.selectedProject, (project, previousProject) => {
  const nextTitle = getProjectTitle(project)
  const oldTitle = currentTitle.value
  const oldImages = getProjectImages(previousProject || project)
  const newImages = getProjectImages(project)

  if (previousProject?.id && project?.id) {
    changeDirection.value = project.id > previousProject.id ? 'next' : 'prev'
  }

  if (nextTitle.line1 !== oldTitle.line1 || nextTitle.line2 !== oldTitle.line2) {
    previousTitle.value = oldTitle
    currentTitle.value = nextTitle
    titleChanging.value = true
    titleVersion.value += 1

    clearTimeout(titleTimer)
    titleTimer = setTimeout(() => {
      titleChanging.value = false
      previousTitle.value = currentTitle.value
    }, 780)
  }

  if (newImages.bg !== oldImages.bg || newImages.fg !== oldImages.fg) {
    previousImages.value = oldImages
    imageChanging.value = true
    imageVersion.value += 1

    clearTimeout(imageTimer)
    imageTimer = setTimeout(() => {
      imageChanging.value = false
      previousImages.value = getProjectImages(project)
    }, 820)
  }

  setTimeout(() => {
    alignOverlay()
  }, 100)
})

function getProjectTitle(project) {
  return {
    line1: project?.titleLine1 || 'DIGITAL TRAINING',
    line2: project?.titleLine2 || 'SUPPORT SYSTEM',
    line3: project?.titleLine3 || ''
  }
}

function getProjectImages(project) {
  return {
    bg: project?.bgImage || '/images/breastfriend.jpg',
    fg: project?.fgImage || '/images/backgroundremoved.jpg'
  }
}

function splitChars(text) {
  return Array.from(text || '').map(char => char === ' ' ? '\u00a0' : char)
}

function alignOverlay() {
  const stage = stageRef.value
  const bg = bgRef.value
  const overlay = overlayRef.value
  const solid = solidRef.value
  const outline = outlineRef.value

  if (!stage || !bg || !overlay) return

  const stageRect = stage.getBoundingClientRect()
  const bgRect = bg.getBoundingClientRect()
  const bgLeft = bgRect.left - stageRect.left
  const bgTop = bgRect.top - stageRect.top

  const viewportWidth = window.innerWidth

  // Calculate scaling factor based on the actual rendered width of the background image.
  // The design baseline was 800px width.
  const scaleFactor = bg.clientWidth / 800

  // Scale down the base size multiplier dynamically on smaller screens
  const baseMultiplier = Math.max(70, Math.min(120, viewportWidth * 0.083))

  // Calculate max font size to dynamically fit "DIGITAL TRAINING" on any screen
  const maxFontSize = (viewportWidth - 48) / 8.5
  const titleFontSize = Math.min(baseMultiplier * scaleFactor, maxFontSize)
  const actualScale = titleFontSize / 120

  // Keep offsets closer to the image on narrower screens so they never overflow
  const line1X = Math.max(0, Math.min(240 * actualScale, bgRect.left - 24))
  const line2TextWidth = 7 * titleFontSize
  const maxLine2X = viewportWidth - bgRect.left - line2TextWidth - 24
  const line2X = Math.max(0, Math.min(500 * actualScale, maxLine2X))
  const line3TextWidth = 7 * titleFontSize
  const maxLine3X = viewportWidth - bgRect.left - line3TextWidth - 24
  const line3X = Math.max(0, Math.min(520 * actualScale, maxLine3X))

  // Dynamically set CSS variables on the stage so CSS styles scale proportionally
  stage.style.setProperty('--title-font-size', titleFontSize + 'px')
  stage.style.setProperty('--line1-x', line1X + 'px')
  stage.style.setProperty('--line2-x', line2X + 'px')
  stage.style.setProperty('--line2-y', (-12 * actualScale) + 'px')
  stage.style.setProperty('--line3-x', line3X + 'px')
  stage.style.setProperty('--line3-y', (36 * actualScale) + 'px')

  const offX = 0
  const offY = 120 * actualScale

  overlay.style.left = bgLeft + 'px'
  overlay.style.top = bgTop + 'px'
  overlay.style.width = bg.clientWidth + 'px'
  overlay.style.height = bg.clientHeight + 'px'

  if (solid) {
    solid.style.left = (bgLeft - offX) + 'px'
    solid.style.top = (bgTop + offY) + 'px'
  }

  if (outline) {
    outline.style.left = (-offX) + 'px'
    outline.style.top = offY + 'px'
  }
}

onMounted(() => {
  alignOverlay()
  window.addEventListener('resize', alignOverlay)
  window.addEventListener('load', alignOverlay)
})

onUnmounted(() => {
  clearTimeout(titleTimer)
  clearTimeout(imageTimer)
  window.removeEventListener('resize', alignOverlay)
  window.removeEventListener('load', alignOverlay)
})
</script>
