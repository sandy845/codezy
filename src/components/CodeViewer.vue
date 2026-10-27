<template>
  <div class="pv-code-viewer" :style="{ fontSize: `${fontSize}px` }">
    <!-- Header bar with language, line count, and copy button -->
    <div class="code-viewer-header">
      <div class="header-meta">
        <span class="language-badge">{{ languageLabel }}</span>
        <span class="line-counter">{{ lineCount }} lines</span>
      </div>
      <div class="header-actions">
        <CopyCodeButton :code="code" label="Copy Code" />
      </div>
    </div>

    <!-- Code display area with line numbers and highlighted code -->
    <div class="code-content-wrapper" v-if="code">
      <div class="line-numbers-col" aria-hidden="true">
        <span
          v-for="lineNum in lineCount"
          :key="lineNum"
          class="line-number"
        >{{ lineNum }}</span>
      </div>
      <div class="code-pre-container">
        <pre class="code-pre"><code
          ref="codeBlock"
          :class="`language-${prismLanguage}`"
          v-html="highlightedHtml"
        ></code></pre>
      </div>
    </div>

    <!-- Missing code fallback state -->
    <div class="code-empty-fallback" v-else>
      <p>No source code available for this practical.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup'; // HTML/XML
import CopyCodeButton from './CopyCodeButton.vue';

const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: 'javascript',
  },
  fontSize: {
    type: Number,
    default: 14,
  },
});

const codeBlock = ref(null);

const prismLanguage = computed(() => {
  const lang = (props.language || '').toLowerCase().trim();
  switch (lang) {
    case 'py':
    case 'python':
      return 'python';
    case 'sql':
      return 'sql';
    case 'html':
    case 'xml':
      return 'markup';
    case 'css':
      return 'css';
    case 'js':
    case 'javascript':
    default:
      return 'javascript';
  }
});

const languageLabel = computed(() => {
  const lang = (props.language || '').toLowerCase();
  switch (lang) {
    case 'python': return 'Python';
    case 'sql': return 'SQL';
    case 'html': return 'HTML5';
    case 'css': return 'CSS3';
    case 'javascript': return 'JavaScript';
    default: return props.language.toUpperCase();
  }
});

const lineCount = computed(() => {
  if (!props.code) return 0;
  return props.code.split('\n').length;
});

const highlightedHtml = computed(() => {
  if (!props.code) return '';
  const lang = prismLanguage.value;
  const grammar = Prism.languages[lang] || Prism.languages.javascript;
  try {
    return Prism.highlight(props.code, grammar, lang);
  } catch (err) {
    console.warn('[PracVault Prism] Highlight fallback:', err);
    // Safe HTML-escaped string
    return props.code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
});
</script>

<style scoped>
.pv-code-viewer {
  display: flex;
  flex-direction: column;
  background-color: var(--pv-code-bg);
  border: 1px solid var(--pv-code-border);
  border-radius: var(--pv-radius-md);
  overflow: hidden;
  box-shadow: var(--pv-shadow-md);
}

.code-viewer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background-color: var(--pv-code-header-bg);
  border-bottom: 1px solid var(--pv-code-border);
  user-select: none;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.language-badge {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #93C5FD;
  background-color: rgba(59, 130, 246, 0.15);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.line-counter {
  font-size: 0.75rem;
  color: var(--pv-code-line-number);
  font-family: var(--pv-font-sans);
}

.code-content-wrapper {
  display: flex;
  position: relative;
  overflow-x: auto;
  max-width: 100%;
}

.line-numbers-col {
  display: flex;
  flex-direction: column;
  padding: 1rem 0.75rem 1rem 1rem;
  text-align: right;
  user-select: none;
  border-right: 1px solid rgba(255, 255, 255, 0.07);
  background-color: rgba(0, 0, 0, 0.2);
}

.line-number {
  font-family: var(--pv-font-mono);
  font-size: 0.85em;
  line-height: 1.6;
  color: var(--pv-code-line-number);
  padding-right: 4px;
}

.code-pre-container {
  flex: 1;
  min-width: 0;
  padding: 1rem 1.25rem;
  overflow-x: auto;
}

.code-pre {
  margin: 0;
  padding: 0;
  background: transparent !important;
  font-family: var(--pv-font-mono) !important;
  font-size: 0.85em;
  line-height: 1.6;
  tab-size: 4;
  white-space: pre !important;
  word-break: normal !important;
  word-wrap: normal !important;
  color: var(--pv-code-text);
}

.code-pre code {
  background: transparent !important;
  padding: 0 !important;
  border: none !important;
  color: inherit !important;
  font-family: inherit !important;
  font-size: inherit !important;
  line-height: inherit !important;
}

.code-empty-fallback {
  padding: 2.5rem;
  text-align: center;
  color: var(--pv-text-muted);
}
</style>
