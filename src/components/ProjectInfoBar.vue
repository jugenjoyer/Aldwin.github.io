<template>
  <div class="project-info-bar">
    <div class="container project-info-flex">
      <div class="project-info-col">
        <div>DEVELOPER/DESIGNER</div>
        <div>AVAILABLE TODAY</div>
      </div>
      <div class="project-info-col">
        <div><b>A</b> COMPLETED</div>
        <div><b>B</b> TYPE</div>
        <div><b>C</b> ROLE</div>
        <div><b>D</b> CLIENT</div>
      </div>
      <div class="project-info-col">
        <div>{{ selectedProject?.date || 'SEPT, 2025' }}</div>
        <div>{{ selectedProject?.type || 'DIGITAL TRAINING AND SUPPORT SYSTEM' }}</div>
        <div>{{ selectedProject?.role || 'DESIGNER, DEVELOPER' }}</div>
        <div>{{ selectedProject?.client || 'BREASTFRIENDS' }}</div>
      </div>
      <div class="project-info-center">
        <div class="project-info-range">{{ selectedProject ? selectedProject.id : 1 }} — 6</div>
        <a href="#" class="explore-btn-text" @click.prevent="$emit('explore')">EXPLORE</a>
      </div>
      <div class="project-info-desc">
        {{ selectedProject?.description || 'A DIGITAL TRAINING AND SUPPORT SYSTEM FOR BREASTFEEDING EDUCATION AND PEER COLLABORATION.' }}
      </div>
      <div class="project-info-links">
        <div>LINKEDIN</div>
        <div>FACEBOOK</div>
        <div>INSTAGRAM</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedProject: {
    type: Object,
    default: null
  }
})

defineEmits(['explore'])
</script>

<style scoped>
.explore-btn-text {
  color: var(--text);
  text-decoration: none;
}
</style>
