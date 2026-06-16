import React from 'react';

export const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const segments = text.split('\n');
  return React.createElement(
    'div',
    { className: 'space-y-4' },
    segments.map((line, i) => {
      if (line.startsWith('### ')) {
        return React.createElement(
          'h3',
          { key: i, className: 'text-[10px] font-black uppercase text-[#4DB6AC] mt-6' },
          line.replace('### ', '')
        );
      }

      if (line.startsWith('## ')) {
        return React.createElement(
          'h2',
          { key: i, className: 'text-xl font-thin text-white mt-8' },
          line.replace('## ', '')
        );
      }

      return React.createElement(
        'p',
        { key: i, className: 'text-sm font-light leading-relaxed opacity-80' },
        line
      );
    })
  );
};
