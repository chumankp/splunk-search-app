// components/HighlightComponent.js
import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; 

const HighlightComponent = ({ data, language }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [data, language]);

  const formattedData = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;

  return (
    <div style={{ maxHeight: '80vh', overflowY: 'auto', padding: '1em', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#282C34' }}>
      <pre>
        <code ref={codeRef} className={language}>
          {formattedData}
        </code>
      </pre>
    </div>
  );
};

export default HighlightComponent;
