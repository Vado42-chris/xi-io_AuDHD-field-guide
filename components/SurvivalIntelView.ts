import React from 'react';
import { NEWS_CATEGORIES } from '../constants.ts';
import { Panel } from './Panel.ts';
import { MetaLabel } from './primitives.ts';

export const SurvivalIntelView: React.FC<{ subscribedCategories: string[] }> = ({ subscribedCategories }) => {
  const subscribed = NEWS_CATEGORIES.filter((category) => subscribedCategories.includes(category.id));

  return React.createElement(
    'div',
    { className: 'max-w-5xl mx-auto p-12 space-y-8' },
    React.createElement(
      'header',
      { className: 'space-y-4' },
      React.createElement(MetaLabel, null, 'Survival Intel'),
      React.createElement('h2', { className: 'text-5xl font-thin tracking-tighter text-white' }, 'Resource Signal Board'),
      React.createElement(
        'p',
        { className: 'text-sm opacity-65 leading-relaxed max-w-2xl' },
        'A static resource surface for the categories already attached to this local identity. This pass makes the navigation route visible without changing data behavior.'
      )
    ),
    React.createElement(
      'div',
      { className: 'grid md:grid-cols-2 gap-6' },
      React.createElement(
        Panel,
        { className: 'border-[#4DB6AC]/20' },
        React.createElement(MetaLabel, null, 'Subscribed Categories'),
        subscribed.length === 0
          ? React.createElement('p', { className: 'text-sm opacity-55 leading-relaxed' }, 'No categories are currently selected.')
          : React.createElement(
              'div',
              { className: 'space-y-3' },
              subscribed.map((category) => React.createElement(
                'div',
                { key: category.id, className: 'p-4 rounded-xl bg-white/5 border border-white/5' },
                React.createElement('div', { className: 'text-sm font-bold text-white' }, category.name),
                React.createElement('div', { className: 'text-[10px] uppercase tracking-[0.2em] opacity-35 mt-2' }, category.query)
              ))
            )
      ),
      React.createElement(
        Panel,
        null,
        React.createElement(MetaLabel, null, 'Route Status'),
        React.createElement(
          'div',
          { className: 'space-y-3 text-xs leading-relaxed opacity-70' },
          React.createElement('p', null, 'Visible route body: active'),
          React.createElement('p', null, 'External retrieval: not added'),
          React.createElement('p', null, 'Automatic analysis: not added'),
          React.createElement('p', null, 'Sync behavior: not added')
        )
      )
    )
  );
};
