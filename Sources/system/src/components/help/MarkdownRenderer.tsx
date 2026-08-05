'use client';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent = '';
    let codeLanguage = '';
    let inList = false;
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
      if (inList && listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="markdown-ul">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code block
      if (line.startsWith('```')) {
        flushList();
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${i}`} className="markdown-code">
              <code className={`language-${codeLanguage}`}>
                {codeContent.trim()}
              </code>
            </pre>
          );
          inCodeBlock = false;
          codeContent = '';
        } else {
          codeLanguage = line.slice(3).trim() || 'javascript';
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        continue;
      }

      // Headings
      if (line.match(/^##\s+/)) {
        flushList();
        const id = line
          .replace(/^##\s+/, '')
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        elements.push(
          <h2 key={`h2-${i}`} id={id} className="markdown-h2">
            {line.replace(/^##\s+/, '')}
          </h2>
        );
        continue;
      }

      if (line.match(/^###\s+/)) {
        flushList();
        const id = line
          .replace(/^###\s+/, '')
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        elements.push(
          <h3 key={`h3-${i}`} id={id} className="markdown-h3">
            {line.replace(/^###\s+/, '')}
          </h3>
        );
        continue;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        flushList();
        elements.push(
          <blockquote key={`bq-${i}`} className="markdown-blockquote">
            {line.replace(/^> /, '')}
          </blockquote>
        );
        continue;
      }

      // List items
      if (line.match(/^[-*]\s+/)) {
        inList = true;
        listItems.push(
          <li key={`li-${i}`} className="markdown-li">
            {renderInline(line.replace(/^[-*]\s+/, ''))}
          </li>
        );
        continue;
      }

      // Paragraphs
      if (line.trim()) {
        flushList();
        elements.push(
          <p key={`p-${i}`} className="markdown-p">
            {renderInline(line)}
          </p>
        );
      } else {
        // Empty line ends list
        flushList();
      }
    }

    flushList();
    return elements;
  };

  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="markdown-content">
      {parseMarkdown(content)}
    </div>
  );
}
