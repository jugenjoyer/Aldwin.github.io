<template>
  <div id="app" :class="{ 'entered': entered, 'loaded': loaded }">
    <div class="mobile-view-gate" aria-label="Mobile view status">
      <h1>Open this project on a desktop or laptop.</h1>
      <p>Mobile view is currently in progress. The full interactive experience is designed for larger screens right now.</p>
    </div>

    <div class="desktop-experience">
    <Loader @finish="loaded = true" />
    <SiteHeader @open-about="handleAboutOpen" />
    <Carousel :entered="entered" @enter="handleEnter" @select-project="handleSelectProject" />
    <main v-show="entered">
      <HeroSection :selected-project="selectedProject" />
    </main>
    <Transition name="info-fade">
      <ProjectInfoBar v-show="entered && !transitioning" :selected-project="selectedProject" @explore="handleExplore" />
    </Transition>

    <ProjectDetails
      v-show="explored"
      :project="selectedProject"
      :explored="detailsVisible"
      @back="handleBack"
      @open-about="handleAboutOpen"
    />
    <AboutMe v-show="aboutOpen" :visible="aboutVisible" @close="handleAboutClose" />

    <!-- Open FLIP Clone -->
    <div 
      v-if="transitioning" 
      class="flip-clone"
      :style="cloneStyle"
    >
      <img :src="selectedProject?.src" class="flip-img" />
    </div>

    <!-- Collapse FLIP Clone (reverse: hero → card) -->
    <div
      v-if="collapseCloneVisible"
      class="flip-clone"
      :style="collapseCloneStyle"
    >
      <img :src="selectedProject?.src" class="flip-img" />
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import Loader from './components/Loader.vue'
import SiteHeader from './components/SiteHeader.vue'
import Carousel from './components/Carousel.vue'
import HeroSection from './components/HeroSection.vue'
import ProjectInfoBar from './components/ProjectInfoBar.vue'
import ProjectDetails from './components/ProjectDetails.vue'
import AboutMe from './components/AboutMe.vue'

const entered = ref(false)
const loaded = ref(false)
const explored = ref(false)
const detailsVisible = ref(false)
const aboutOpen = ref(false)
const aboutVisible = ref(false)
const selectedProject = ref(null)
const transitioning = ref(false)
const cloneStyle = ref({})

// Collapse (reverse FLIP) state
const collapseCloneVisible = ref(false)
const collapseCloneStyle = ref({})
const originalCardRect = ref(null)
const defaultProjectTheme = {
  backgroundGradient: 'linear-gradient(135deg, #050610 0%, #001b63 100%)',
  textColor: '#e6e9ef',
  mutedColor: '#a0a6b3',
  heroTitleColor: '#e8e8ea',
  heroOutlineColor: '#ffffff'
}
let bgThemeTimer = null
let lastThemeProjectId = null

watch(entered, (val) => {
  if (val) {
    document.body.classList.add('entered')
  } else {
    document.body.classList.remove('entered')
  }
})

watch(loaded, (val) => {
  if (val) {
    document.body.classList.add('loaded')
    document.body.classList.add('initial-load')
    // Remove initial-load after slide-in animations complete to prevent re-triggering
    setTimeout(() => {
      document.body.classList.remove('initial-load')
    }, 2500)
  } else {
    document.body.classList.remove('loaded')
    document.body.classList.remove('initial-load')
  }
})

watch(transitioning, (val) => {
  if (val) {
    document.body.classList.add('transitioning')
  } else {
    document.body.classList.remove('transitioning')
  }
})

watch(explored, (val) => {
  if (val) {
    document.body.classList.add('explored')
  } else {
    document.body.classList.remove('explored')
  }
})

watch(detailsVisible, (val) => {
  if (val) {
    document.body.classList.add('details-visible')
  } else {
    document.body.classList.remove('details-visible')
  }
})

watch(aboutVisible, (val) => {
  if (val) {
    document.body.classList.add('about-visible')
  } else {
    document.body.classList.remove('about-visible')
  }
})

watch(selectedProject, applyProjectTheme, { immediate: true })

function applyProjectTheme(project) {
  const root = document.body.style
  const nextBg = project?.backgroundGradient || defaultProjectTheme.backgroundGradient
  const currentBg = root.getPropertyValue('--project-bg-base') || defaultProjectTheme.backgroundGradient
  const nextProjectId = project?.id ?? null
  const isForward = lastThemeProjectId == null || nextProjectId == null
    ? true
    : nextProjectId > lastThemeProjectId
  const baseShiftX = isForward ? '-2.5%' : '2.5%'
  const baseShiftY = isForward ? '1.25%' : '-1.25%'
  const nextShiftX = isForward ? '7%' : '-7%'
  const nextShiftY = isForward ? '3%' : '-3%'

  clearTimeout(bgThemeTimer)

  root.setProperty('--project-bg-base-shift-x', baseShiftX)
  root.setProperty('--project-bg-base-shift-y', baseShiftY)
  root.setProperty('--project-bg-next-shift-x', nextShiftX)
  root.setProperty('--project-bg-next-shift-y', nextShiftY)

  if (currentBg.trim() === nextBg.trim()) {
    root.setProperty('--project-bg-base', nextBg)
    root.setProperty('--project-bg-next', nextBg)
    document.body.classList.remove('bg-changing')
  } else {
    root.setProperty('--project-bg-base', currentBg)
    root.setProperty('--project-bg-next', nextBg)
    document.body.classList.remove('bg-changing')

    requestAnimationFrame(() => {
      document.body.classList.add('bg-changing')
    })

    bgThemeTimer = setTimeout(() => {
      root.setProperty('--project-bg-base', nextBg)
      document.body.classList.remove('bg-changing')
    }, 1800)
  }

  root.setProperty('--text', project?.textColor || defaultProjectTheme.textColor)
  root.setProperty('--muted', project?.mutedColor || defaultProjectTheme.mutedColor)
  root.setProperty('--hero-title-color', project?.heroTitleColor || defaultProjectTheme.heroTitleColor)
  root.setProperty('--hero-outline-color', project?.heroOutlineColor || defaultProjectTheme.heroOutlineColor)
  lastThemeProjectId = nextProjectId
}

function handleEnter(rect) {
  if (rect) {
    originalCardRect.value = rect
    transitioning.value = true
    cloneStyle.value = {
      position: 'fixed',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      zIndex: 9999,
      transition: 'none',
      borderRadius: '0px'
    }
    
    entered.value = true
      nextTick(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const infoBar = document.querySelector('.project-info-bar')
            if (infoBar) {
              infoBar.style.display = 'block'
              infoBar.style.visibility = 'hidden'
            }

            const targetHeroImage = document.querySelector('.hero-img-bg--current') || document.querySelector('.hero-stage')
            if (targetHeroImage) {
              const targetRect = targetHeroImage.getBoundingClientRect()
            cloneStyle.value = {
              position: 'fixed',
              top: `${targetRect.top}px`,
              left: `${targetRect.left}px`,
              width: `${targetRect.width}px`,
              height: `${targetRect.height}px`,
              zIndex: 9999,
              transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
              borderRadius: '0px'
              }
              setTimeout(() => {
                if (infoBar) {
                  infoBar.style.display = ''
                  infoBar.style.visibility = ''
                }
                transitioning.value = false
              }, 800)
            } else {
              if (infoBar) {
                infoBar.style.display = ''
                infoBar.style.visibility = ''
              }
              transitioning.value = false
            }
          })
        })
    })
  } else {
    entered.value = true
  }
}

function handleSelectProject(project) {
  selectedProject.value = project
  explored.value = false
  detailsVisible.value = false
}

function handleExplore() {
  explored.value = true
  window.scrollTo({ top: 0 })
  nextTick(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        detailsVisible.value = true
      })
    })
  })
}

function handleBack() {
  detailsVisible.value = false
  setTimeout(() => {
    explored.value = false
  }, 950)
}

function handleAboutOpen() {
  aboutOpen.value = true
  nextTick(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        aboutVisible.value = true
      })
    })
  })
}

function handleAboutClose() {
  aboutVisible.value = false
  setTimeout(() => {
    aboutOpen.value = false
  }, 950)
}

// --- Scroll-to-collapse (Aristide style reverse FLIP) ---
let wheelAccum = 0
let wheelCooldown = false
let touchStartY = 0
const collapseContentExitMs = 520
const collapseCloneMs = 800

function onGlobalWheel(e) {
  if (!entered.value || explored.value || aboutOpen.value || aboutVisible.value || transitioning.value || collapseCloneVisible.value) return

  const path = typeof e.composedPath === 'function' ? e.composedPath() : []
  const fromCarouselPath = path.some((node) => {
    return node instanceof Element && (
      node.classList.contains('carousel') ||
      node.classList.contains('carousel-placeholder') ||
      node.closest?.('.carousel')
    )
  })
  if (fromCarouselPath) return

  const carouselBand = document.querySelector('.carousel-placeholder')
  if (carouselBand) {
    const rect = carouselBand.getBoundingClientRect()
    const withinCarousel =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    if (withinCarousel) return
  }

  const delta = e.deltaY || 0
  if (delta <= 0) {
    wheelAccum = 0
    return
  }

  wheelAccum += delta

  if (wheelAccum > 150 && !wheelCooldown) {
    wheelCooldown = true
    wheelAccum = 0
    collapseToCarousel()
  }
}

function onGlobalTouchStart(e) {
  touchStartY = e.touches?.[0]?.clientY || 0
}

function onGlobalTouchMove(e) {
  if (!entered.value || explored.value || aboutOpen.value || aboutVisible.value || transitioning.value || collapseCloneVisible.value || wheelCooldown) return

  const currentY = e.touches?.[0]?.clientY || 0
  const delta = touchStartY - currentY

  if (delta > 90) {
    wheelCooldown = true
    collapseToCarousel()
  }
}

function collapseToCarousel() {
  const heroImg = document.querySelector('.hero-img-bg')
  if (!heroImg) {
    entered.value = false
    setTimeout(() => { wheelCooldown = false }, 1500)
    return
  }

  const fromRect = heroImg.getBoundingClientRect()

  // Spawn clone at hero position, then restore the carousel behind it.
  collapseCloneStyle.value = {
    position: 'fixed',
    top: `${fromRect.top}px`,
    left: `${fromRect.left}px`,
    width: `${fromRect.width}px`,
    height: `${fromRect.height}px`,
    zIndex: 9999,
    transition: 'none',
    borderRadius: '0px'
  }
  collapseCloneVisible.value = true

  document.body.classList.add('collapsing')

  setTimeout(() => {
    entered.value = false

    nextTick(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const targetCard = document.querySelector(`.carousel-item[data-project-id="${selectedProject.value?.id}"]`)
          const targetRect = targetCard?.getBoundingClientRect() || originalCardRect.value

          if (!targetRect) {
            collapseCloneVisible.value = false
            document.body.classList.remove('collapsing')
            wheelCooldown = false
            return
          }

          if (targetCard) {
            targetCard.style.visibility = 'hidden'
          }

          collapseCloneStyle.value = {
            position: 'fixed',
            top: `${targetRect.top}px`,
            left: `${targetRect.left}px`,
            width: `${targetRect.width}px`,
            height: `${targetRect.height}px`,
            zIndex: 9999,
            transition: `all ${collapseCloneMs}ms cubic-bezier(0.22, 1, 0.36, 1)`,
            borderRadius: '0px'
          }

          setTimeout(() => {
            document.body.classList.remove('collapsing')
            collapseCloneVisible.value = false
            if (targetCard) {
              targetCard.style.visibility = ''
            }
            wheelCooldown = false
          }, collapseCloneMs)
        })
      })
    })
  }, collapseContentExitMs)
}

onMounted(() => {
  window.addEventListener('wheel', onGlobalWheel, { passive: true })
  window.addEventListener('touchstart', onGlobalTouchStart, { passive: true })
  window.addEventListener('touchmove', onGlobalTouchMove, { passive: true })
})

onUnmounted(() => {
  clearTimeout(bgThemeTimer)
  window.removeEventListener('wheel', onGlobalWheel)
  window.removeEventListener('touchstart', onGlobalTouchStart)
  window.removeEventListener('touchmove', onGlobalTouchMove)
})
</script>

<style scoped>
.content-fade-enter-active,
.content-fade-leave-active {
  transition: opacity 0.5s ease;
}
.content-fade-enter-from,
.content-fade-leave-to {
  opacity: 0;
}

.info-fade-enter-active,
.info-fade-leave-active {
  transition: opacity 0.5s ease;
}
.info-fade-enter-from,
.info-fade-leave-to {
  opacity: 0;
}
</style>
