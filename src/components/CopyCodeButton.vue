<template>
  <button
    type="button"
    class="pv-copy-btn pv-btn-interactive"
    :class="{ 'is-copied': isCopied, 'is-error': hasError }"
    @click="copyCode"
    :title="buttonTitle"
    :aria-label="buttonTitle"
  >
    <component :is="currentIcon" class="btn-icon" />
    <span class="btn-text">{{ buttonText }}</span>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Copy, Check, AlertCircle } from 'lucide-vue-next';

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: 'Copy Code',
  },
});

const isCopied = ref(false);
const hasError = ref(false);
let resetTimer = null;

const buttonText = computed(() => {
  if (isCopied.value) return 'Copied!';
  if (hasError.value) return 'Copy Failed';
  return props.label;
});

const buttonTitle = computed(() => {
  if (isCopied.value) return 'Code copied to clipboard!';
  if (hasError.value) return 'Failed to copy to clipboard';
  return 'Copy exact source code to clipboard';
});

const currentIcon = computed(() => {
  if (isCopied.value) return Check;
  if (hasError.value) return AlertCircle;
  return Copy;
});

/**
 * Fallback copy method using temporary textarea for environments
 * where navigator.clipboard is unavailable or restricted.
 */
const fallbackCopy = (text) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  // Ensure off-screen and invisible
  textArea.style.position = 'fixed';
  textArea.style.top = '-9999px';
  textArea.style.left = '-9999px';
  textArea.setAttribute('readonly', '');
  document.body.appendChild(textArea);
  textArea.select();

  let successful = false;
  try {
    successful = document.execCommand('copy');
  } catch (err) {
    console.error('[PracVault Copy] execCommand fallback failed:', err);
  } finally {
    document.body.removeChild(textArea);
  }
  return successful;
};

const copyCode = async () => {
  if (resetTimer) clearTimeout(resetTimer);
  hasError.value = false;

  const codeToCopy = props.code;
  let copied = false;

  // Attempt modern Clipboard API first
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(codeToCopy);
      copied = true;
    } catch (err) {
      console.warn('[PracVault Copy] Clipboard API failed, attempting fallback:', err);
      copied = fallbackCopy(codeToCopy);
    }
  } else {
    copied = fallbackCopy(codeToCopy);
  }

  if (copied) {
    isCopied.value = true;
    hasError.value = false;
  } else {
    isCopied.value = false;
    hasError.value = true;
  }

  resetTimer = setTimeout(() => {
    isCopied.value = false;
    hasError.value = false;
  }, 2200);
};
</script>

<style scoped>
.pv-copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: var(--pv-radius-sm);
  background-color: rgba(255, 255, 255, 0.1);
  color: #F3F4F6;
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.pv-copy-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: #FFFFFF;
}

.pv-copy-btn:active {
  transform: scale(0.96);
}

.is-copied {
  background-color: var(--pv-success) !important;
  color: #FFFFFF !important;
  border-color: var(--pv-success) !important;
}

.is-error {
  background-color: var(--pv-error) !important;
  color: #FFFFFF !important;
  border-color: var(--pv-error) !important;
}

.btn-icon {
  width: 14px;
  height: 14px;
}

.btn-text {
  line-height: 1;
}
</style>
