<template></template>

<script setup lang="ts" name="SealAction">
import {
  ContextSchema,
  LifeCycleAction,
  createSealContext,
} from '@sealjs/core-runtime'
import { inject, onMounted, onUnmounted } from 'vue'
import { sealActionProvider } from '../hooks'

const action = inject<ContextSchema<LifeCycleAction>>(
  sealActionProvider,
  createSealContext(),
)

onMounted(async () => {
  await action.exec('mounted')
})

onUnmounted(() => {})
</script>
