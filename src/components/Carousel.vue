<template>
  <div class="carousel-placeholder" :class="{ 'entered': entered }">
    <div ref="carouselRef" class="carousel">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="carousel-item"
        :class="{
          'in-view': inViewItems.includes(index),
          'is-active': activeIndex === index,
          'is-disabled': item.id >= 4
        }"
        :data-project-id="item.id"
        @click="enterSite(item, $event)"
      >
        <img :src="item.src" :alt="item.alt" class="carousel-img" />
      </div>
    </div>
    <div class="carousel-pagination" v-if="!entered">
      {{ activeIndex + 1 }} &mdash; {{ items.length }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'

const emit = defineEmits(['enter', 'select-project'])

const props = defineProps({
  entered: Boolean
})

const carouselRef = ref(null)
const inViewItems = ref([])
const activeIndex = ref(0)
const entered = computed(() => props.entered)

let savedScrollLeft = 0
let startScrollLeft = 0
watch(() => props.entered, (newVal) => {
  if (newVal === true) {
    if (carouselRef.value) {
      savedScrollLeft = carouselRef.value.scrollLeft
    }
    nextTick(() => {
      requestAnimationFrame(() => {
        if (carouselRef.value) {
          carouselRef.value.scrollLeft = startScrollLeft
          updateInView()
        }
      })
    })
  } else {
    nextTick(() => {
      if (carouselRef.value) {
        carouselRef.value.scrollLeft = savedScrollLeft
        updateInView()
      }
    })
  }
})

const items = [
  {
    id: 1,
    src: '/images/breastfriend.jpg',
    alt: 'Project 1',
    title: 'Digital Training Support System',
    client: 'Breastfriends',
    date: 'SEPT, 2025',
    type: 'DIGITAL TRAINING AND SUPPORT SYSTEM',
    role: 'DESIGNER, DEVELOPER',
    description: 'A DIGITAL TRAINING AND SUPPORT SYSTEM FOR BREASTFEEDING EDUCATION AND PEER COLLABORATION.',
    range: '3 — 8',
    bgImage: '/images/breastfriend.jpg',
    detailsBgImage: '/images/breastfriend-details.jpg',
    fgImage: '/images/backgroundremoved.jpg',
    titleLine1: 'DIGITAL TRAINING',
    titleLine2: 'SUPPORT SYSTEM',
    slides: [
      { src: '/images/project_1/1.png', alt: 'Project 1 slide 1' },
      { src: '/images/project_1/2.png', alt: 'Project 1 slide 2' },
      { src: '/images/project_1/3.png', alt: 'Project 1 slide 3' },
      { src: '/images/project_1/4.png', alt: 'Project 1 slide 4' },
      { src: '/images/project_1/5.png', alt: 'Project 1 slide 5' }
    ]
  },
  {
    id: 2,
    src: '/images/csmap.jpg',
    alt: 'Project 2',
    title: 'Climate Smart Maps',
    client: 'PHILIPPINE RICE RESEARCH INSTITUTE',
    date: 'FEB, 2026',
    type: 'CLIMATE SMART MAPS',
    role: 'DEVELOPER',
    description: 'A CLIMATE RISK INFORMATION, DEVELOPS ADAPTATION PLANS, AND PROMOTES SUSTAINABLE RICE PRODUCTION.',
    range: '1 — 5',
    bgImage: '/images/csmap.jpg',
    fgImage: '/images/csmap-fg.png',
    titleLine1: 'CLIMATE',
    titleLine2: 'SMART MAPS',
    backgroundGradient: 'linear-gradient(135deg, #f7f4e9 0%, #c8dec9 46%, #4f9b73 100%)',
    textColor: '#00683b',
    mutedColor: '#00683b',
    heroTitleColor: '#00683b',
    heroOutlineColor: '#00683b',
    detailMetaTitle: 'Internship Project',
    detailDescription: 'Climate-Smart Maps for Strengthening the Adaptation Plans of Farming Communities (CS Map) Project generates information on climate risks, develops adaptation plans to cope with the risks of changing climate, and builds capacity for better understanding of the climate system for sustainable rice production.',
    detailStacks: 'PHP LARAVEL 11, VUE 3, Pinia, Vuetify, Tailwind + PostCSS, LEAFLETS (MAPS), AXIOS',
    slides: [
      { src: '/images/project_2/1.png', alt: 'Project 2 slide 1' },
      { src: '/images/project_2/2.png', alt: 'Project 2 slide 2' },
      { src: '/images/project_2/3.png', alt: 'Project 2 slide 3' },
      { src: '/images/project_2/4.png', alt: 'Project 2 slide 4' },
      { src: '/images/project_2/5.png', alt: 'Project 2 slide 5' },
      { src: '/images/project_2/6.png', alt: 'Project 2 slide 6' },
      { src: '/images/project_2/7.png', alt: 'Project 2 slide 7' },
      { src: '/images/project_2/8.png', alt: 'Project 2 slide 8' }
    ]
  },
  {
    id: 3,
    src: '/images/pinasmap-bg.jpg',
    alt: 'Project 3',
    title: 'PhilRice Managed Techno-Demo Database',
    client: 'PHILIPPINE RICE RESEARCH INSTITUTE',
    date: 'APRIL, 2026',
    type: 'PHILRICE MANAGED TECHNO-DEMO DATABASE',
    role: 'DEVELOPER',
    description: 'A AGRICULTURAL TECHNOLOGY DEMONSTRATION PROJECT MANAGEMENT SYSTEM',
    range: '2 — 6',
    bgImage: '/images/pinasmap-bg.jpg',
    fgImage: '/images/pinasmap_fg.png',
    titleLine1: 'PHILRICE MANAGED',
    titleLine2: 'TECHNO-DEMO',
    titleLine3: 'DATABASE',
    backgroundGradient: 'linear-gradient(135deg, #F5F5F5 0%, #F5F5F5 100%)',
    textColor: '#164f78',
    mutedColor: '#164f78',
    heroTitleColor: '#164f78',
    heroOutlineColor: '#164f78',
    detailMetaTitle: 'Internship Project',
    detailDescription: 'Agricultural Technology Demonstration Project Management System. A centralized platform for managing rice technology demonstration projects across the Philippines, providing tools for project tracking, interactive map visualization, crop and field activity monitoring, budget and timeline management, and agricultural research data collection.',
    detailStacks: 'Laravel (PHP), Laravel Fortify, Sanctum, Vue 3 and Alpine.js, Tailwind CSS, livewire, livewire powergrid',
    slides: [
      { src: '/images/project_3/1.png', alt: 'Project 3 slide 1' },
      { src: '/images/project_3/2.png', alt: 'Project 3 slide 2' },
      { src: '/images/project_3/3.png', alt: 'Project 3 slide 3' },
      { src: '/images/project_3/4.png', alt: 'Project 3 slide 4' },
      { src: '/images/project_3/5.png', alt: 'Project 3 slide 5' },
      { src: '/images/project_3/6.png', alt: 'Project 3 slide 6' }
    ]
  },
  {
    id: 4,
    src: 'https://picsum.photos/110/64?random=4',
    alt: 'Project 4',
    title: 'Mobile Banking App',
    client: 'FinTech Company',
    date: 'JUNE, 2025',
    type: 'MOBILE APPLICATION',
    role: 'UI/UX DESIGNER',
    description: 'Secure and intuitive mobile banking application with biometric authentication.',
    range: '4 — 9',
    bgImage: 'https://picsum.photos/800/600?random=4',
    fgImage: 'https://picsum.photos/800/600?random=4b',
    titleLine1: 'MOBILE',
    titleLine2: 'BANKING APP'
  },
  {
    id: 5,
    src: 'https://picsum.photos/110/64?random=5',
    alt: 'Project 5',
    title: 'Data Analytics Dashboard',
    client: 'Enterprise Client',
    date: 'MAY, 2025',
    type: 'BUSINESS INTELLIGENCE',
    role: 'DATA VISUALIZATION SPECIALIST',
    description: 'Real-time analytics dashboard for business intelligence and reporting.',
    range: '6 — 12',
    bgImage: 'https://picsum.photos/800/600?random=5',
    fgImage: 'https://picsum.photos/800/600?random=5b',
    titleLine1: 'DATA ANALYTICS',
    titleLine2: 'DASHBOARD'
  },
  {
    id: 6,
    src: 'https://picsum.photos/110/64?random=6',
    alt: 'Project 6',
    title: 'Social Media Platform',
    client: 'Startup Inc',
    date: 'APRIL, 2025',
    type: 'SOCIAL NETWORKING',
    role: 'BACKEND DEVELOPER',
    description: 'Scalable social platform with real-time messaging and content sharing.',
    range: '8 — 15',
    bgImage: 'https://picsum.photos/800/600?random=6',
    fgImage: 'https://picsum.photos/800/600?random=6b',
    titleLine1: 'SOCIAL MEDIA',
    titleLine2: 'PLATFORM'
  }
]

let isDown = false
let startX = 0
let startScroll = 0
let v = 0
let lastPos = 0
let lastT = 0
let rafId = null
let dragStartX = 0
let isDragging = false

const friction = 0.97
const maxV = 40
const wheelScrollFactor = 0.03
const wheelVelocityFactor = 0.03
const dragScrollFactor = 0.42
const dragVelocityFactor = 0.42
const parallaxK = 0.12

function enterSite(item, event) {
  if (item && item.id >= 4) return
  if (item && item.id && !isDragging) {
    if (!props.entered) {
      const el = event.currentTarget // .carousel-item container
      const rect = el.getBoundingClientRect()
      emit('enter', rect)
    }
    emit('select-project', item)
  }
}

function updateInView() {
  const band = carouselRef.value
  if (!band) return
  const rect = band.getBoundingClientRect()
  const newInView = []
  const imgs = band.querySelectorAll('.carousel-item')
  
  let minDiff = Infinity
  let newActive = 0
  const mid = rect.left + rect.width / 2

  imgs.forEach((item, index) => {
    const r = item.getBoundingClientRect()
    // calculate in-view
    if (r.right > rect.left && r.left < rect.right) {
      newInView.push(index)
    }
    
    // calculate active centered item
    const itemMid = r.left + r.width / 2
    const diff = Math.abs(itemMid - mid)
    if (diff < minDiff) {
      minDiff = diff
      newActive = index
    }
  })
  inViewItems.value = newInView
  if (activeIndex.value !== newActive) {
    activeIndex.value = newActive
  }
}

function raf(now) {
  const band = carouselRef.value
  if (!band) return

  if (!lastT) lastT = now

  if (Math.abs(v) > 0.08) {
    band.scrollLeft += v
    v *= friction
  }

  const rect = band.getBoundingClientRect()
  const mid = rect.left + rect.width / 2
  const imgs = band.querySelectorAll('.carousel-img')

  imgs.forEach(img => {
    const item = img.closest('.carousel-item')
    const r = item.getBoundingClientRect()
    const itemMid = r.left + r.width / 2
    
    if (!props.entered) {
      const progress = (itemMid - mid) / (rect.width / 2)
      const clampedProgress = Math.max(-1.5, Math.min(1.5, progress))
      const maxOffset = r.width * parallaxK
      const px = -maxOffset - (clampedProgress * maxOffset)
      img.style.transform = `translateX(${px}px)`
    } else {
      img.style.transform = `translateX(0px)`
    }
  })

  updateInView()
  rafId = requestAnimationFrame(raf)
}

function applyWheelDelta(delta) {
  const band = carouselRef.value
  if (!band) return
  band.scrollLeft += delta * wheelScrollFactor
  v = Math.max(-maxV, Math.min(maxV, v + delta * wheelVelocityFactor))
}

function onWheel(e) {
  if (document.body.classList.contains('explored')) return
  // Prefer vertical wheel delta, fallback to horizontal trackpad delta
  let delta = e.deltaY || 0
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    delta = e.deltaX
  }
  if (!delta) return
  e.preventDefault()
  applyWheelDelta(delta)
}

function onGlobalWheel(e) {
  const aboutPage = document.querySelector('.about-page')
  const aboutIsOpen = aboutPage && window.getComputedStyle(aboutPage).display !== 'none'
  if (
    props.entered ||
    document.body.classList.contains('entered') ||
    aboutIsOpen ||
    document.body.classList.contains('about-visible') ||
    document.body.classList.contains('details-visible') ||
    document.body.classList.contains('explored')
  ) return

  const path = typeof e.composedPath === 'function' ? e.composedPath() : []
  const fromCarousel = path.some((node) => {
    return node instanceof Element && (
      node.classList.contains('carousel') ||
      node.classList.contains('carousel-placeholder') ||
      node.closest?.('.carousel')
    )
  })
  if (fromCarousel) return

  let delta = e.deltaY || 0
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    delta = e.deltaX
  }
  if (!delta) return

  e.preventDefault()
  applyWheelDelta(delta)
}

function onDown(clientX) {
  isDown = true
  isDragging = false
  dragStartX = clientX
  startX = clientX
  startScroll = carouselRef.value.scrollLeft
  lastPos = clientX
  document.body.style.userSelect = 'none'
}

function onMove(clientX) {
  if (!isDown) return
  const band = carouselRef.value
  const dx = clientX - startX
  
  // Detect if it's a drag (moved more than 5px)
  if (Math.abs(clientX - dragStartX) > 5) {
    isDragging = true
  }
  
  band.scrollLeft = startScroll - (dx * dragScrollFactor)
  // velocity from delta
  const dv = lastPos - clientX; // reversed so drag direction matches inertia
  v = Math.max(-maxV, Math.min(maxV, v * 0.78 + dv * dragVelocityFactor))
  lastPos = clientX
}

function onUp() {
  if (!isDown) return
  isDown = false
  setTimeout(() => {
    isDragging = false
  }, 50)
  document.body.style.userSelect = ''
}

onMounted(() => {
  const band = carouselRef.value
  if (!band) return

  nextTick(() => {
    const itemsEls = band.querySelectorAll('.carousel-item')
    const target = itemsEls[0]
    if (target) {
      const bandRect = band.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      const centeredScrollLeft =
        band.scrollLeft +
        (targetRect.left - bandRect.left) -
        (bandRect.width / 2) +
        (targetRect.width / 2)
      band.scrollLeft = centeredScrollLeft
      startScrollLeft = centeredScrollLeft
      savedScrollLeft = centeredScrollLeft
    }
  })

  rafId = requestAnimationFrame(raf)
  band.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('wheel', onGlobalWheel, { passive: false })
  band.addEventListener('mousedown', (e) => onDown(e.clientX))
  window.addEventListener('mousemove', (e) => onMove(e.clientX))
  window.addEventListener('mouseup', onUp)
  window.addEventListener('mouseleave', onUp)

  // Touch support
  band.addEventListener('touchstart', (e) => {
    const t = e.touches[0]
    isDown = true
    isDragging = false
    dragStartX = t.clientX
    startX = t.clientX
    startScroll = band.scrollLeft
    lastPos = t.clientX
  }, { passive: true })
  band.addEventListener('touchmove', (e) => {
    if (!isDown) return
    const t = e.touches[0]
    const dx = t.clientX - startX
    
    // Detect if it's a drag (moved more than 5px)
    if (Math.abs(t.clientX - dragStartX) > 5) {
      isDragging = true
    }
    
    band.scrollLeft = startScroll - (dx * dragScrollFactor)
    const dv = lastPos - t.clientX; v = Math.max(-maxV, Math.min(maxV, v * 0.78 + dv * dragVelocityFactor))
    lastPos = t.clientX
  }, { passive: true })
  band.addEventListener('touchend', () => {
    isDown = false
    setTimeout(() => {
      isDragging = false
    }, 50)
  })
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  const band = carouselRef.value
  if (band) {
    band.removeEventListener('wheel', onWheel)
  }
  window.removeEventListener('wheel', onGlobalWheel)
})
</script>

<style scoped>
.carousel-item {
  cursor: pointer;
}
.carousel-item.is-disabled {
  cursor: default;
}
.carousel:active {
  cursor: grabbing;
}
</style>
