export interface CodeLanguage {
  value: string;
  label: string;
}

export const CODE_LANGUAGES: CodeLanguage[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash / Shell' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'java', label: 'Java' },
  { value: 'php', label: 'PHP' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'plaintext', label: 'Plain Text' },
];

export const getCodePlaceholder = (language: string): string => {
  switch (language) {
    case 'python':
    case 'bash':
      return '# Write code here...';
    case 'html':
      return '<!-- Write code here... -->';
    case 'css':
      return '/* Write code here... */';
    case 'sql':
      return '-- Write code here...';
    default:
      return '// Write code here...';
  }
};
