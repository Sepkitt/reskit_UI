<template>
  <div class="reskit-logo" :style="{ width: size + 'px', height: size + 'px' }">
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      class="blueprint-svg"
    >
      <path d="M40 35V165M60 35V165M80 35V165M100 35V165M120 35V165M140 35V165M160 35V165" stroke="currentColor" stroke-width="0.5" opacity="0.1"/>
      <path d="M35 40H165M35 60H165M35 80H165M35 100H165M35 120H165M35 140H165M35 160H165" stroke="currentColor" stroke-width="0.5" opacity="0.1"/>

      <rect x="35" y="35" width="130" height="130" rx="4" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4" opacity="0.3" />
      
      <rect x="55" y="55" width="85" height="65" rx="2" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.05"/>
      <line x1="55" y1="72" x2="140" y2="72" stroke="currentColor" stroke-width="2" opacity="0.2"/>
      <circle cx="65" cy="63" r="2" fill="currentColor" opacity="0.3"/>
      <circle cx="73" cy="63" r="2" fill="currentColor" opacity="0.3"/>

      <rect x="85" y="80" width="65" height="85" rx="4" fill="var(--logo-primary)" fill-opacity="0.1" stroke="var(--logo-primary)" stroke-width="3"/>
      
      <rect x="92" y="90" width="51" height="8" rx="1" fill="var(--logo-primary)" />
      <rect x="92" y="105" width="22" height="22" rx="1" stroke="var(--logo-primary)" stroke-width="2" fill="var(--logo-primary)" fill-opacity="0.2"/>
      <rect x="120" y="105" width="23" height="4" rx="1" fill="var(--logo-primary)" opacity="0.6"/>
      <rect x="120" y="113" width="23" height="4" rx="1" fill="var(--logo-primary)" opacity="0.6"/>
      <rect x="120" y="121" width="15" height="4" rx="1" fill="var(--logo-primary)" opacity="0.6"/>
      
      <path d="M155 80V165" stroke="var(--logo-primary)" stroke-width="1" opacity="0.5"/>
      <path d="M152 80H158M152 165H158" stroke="var(--logo-primary)" stroke-width="1" opacity="0.5"/>
    </svg>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: [String, Number],
    default: 200
  }
})
</script>

<style scoped lang="scss">
.reskit-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  --logo-primary: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-text));

  .blueprint-svg {
    width: 100%;
    height: 100%;
    
    * {
      transition: fill 0.3s ease, stroke 0.3s ease, opacity 0.3s ease;
    }
  }
}
</style>