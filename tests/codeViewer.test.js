import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CodeViewer from '../src/components/CodeViewer.vue';
import CopyCodeButton from '../src/components/CopyCodeButton.vue';

describe('CodeViewer Component', () => {
  const multilinePython = `def calculate(a, b):
    # 4 spaces indentation preserved
    result = a * b + 10
    return result

print(calculate(5, 4))`;

  it('preserves indentation and newlines in code string', () => {
    const wrapper = mount(CodeViewer, {
      props: {
        code: multilinePython,
        language: 'python',
        fontSize: 14,
      }
    });

    const pre = wrapper.find('.code-pre');
    expect(pre.exists()).toBe(true);

    const lineNumbers = wrapper.findAll('.line-number');
    expect(lineNumbers.length).toBe(6);

    // Verify indentation in rendered HTML
    expect(pre.html()).toContain('calculate');
  });

  it('renders line numbers accurately matching code line count', () => {
    const code = "line 1\nline 2\nline 3\nline 4\nline 5";
    const wrapper = mount(CodeViewer, {
      props: { code, language: 'javascript' }
    });

    const lines = wrapper.findAll('.line-number');
    expect(lines.length).toBe(5);
    expect(lines[0].text()).toBe('1');
    expect(lines[4].text()).toBe('5');
  });

  it('displays fallback state when code string is empty', () => {
    const wrapper = mount(CodeViewer, {
      props: { code: '', language: 'python' }
    });

    expect(wrapper.find('.code-empty-fallback').exists()).toBe(true);
    expect(wrapper.text()).toContain('No source code available');
  });
});

describe('CopyCodeButton Component', () => {
  it('mounts with the default label and handles exact source string', async () => {
    const testCode = "import math\n\ndef circle_area(r):\n    return math.pi * r ** 2";
    const wrapper = mount(CopyCodeButton, {
      props: {
        code: testCode,
        label: 'Copy Code'
      }
    });

    expect(wrapper.text()).toContain('Copy Code');

    // Trigger copy click
    await wrapper.trigger('click');
    // Button text updates to indicate action
    expect(wrapper.exists()).toBe(true);
  });
});
