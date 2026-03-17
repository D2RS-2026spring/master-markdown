import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

// Use locally installed monaco-editor instead of CDN
loader.config({ monaco });

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  language?: string;
}

export default function CodeEditor({
  value,
  onChange,
  height = '300px',
  language = 'markdown'
}: CodeEditorProps) {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={(newValue) => onChange(newValue || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          tabSize: 2,
        }}
        theme="vs-light"
      />
    </div>
  );
}
