<script setup lang="ts"></script>

<template>
  <div>Nuxt module playground!</div>
  <p>
    {{ $mq.PC  }}
  </p>
  <p>
    {{ $mq.SP  }}
  </p>
  <p>
    {{ $mq.HOVER  }}
  </p>
  <p>
    {{ $mq.NOHOVER  }}
  </p>
</template>

<style lang="css" scoped>
@media (--pc) {
  div {
    background-color: red;
  }
}
</style>
