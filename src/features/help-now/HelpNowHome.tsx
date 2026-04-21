import React from 'react';

const helpCards = [
  {
    title: 'Pain spike',
    body: 'Pain-aware support will live here first, with low-demand actions and outcome logging.',
  },
  {
    title: 'Overloaded',
    body: 'Support for too much input, too many demands, or too much happening at once.',
  },
  {
    title: 'Activated',
    body: 'A calmer route for hot, reactive, panicky, or emotionally up states.',
  },
  {
    title: 'Shut down / stuck',
    body: 'Low-demand paths for freeze, shutdown, and task-lock states.',
  },
];

export const HelpNowHome: React.FC = () => {
  return (
    <div className="fg-content-card fg-glass">
      <div className="fg-header">
        <div className="fg-kicker">Help Now</div>
        <h1 className="fg-section-title">A calmer first action, not a dashboard.</h1>
        <p className="fg-section-body">
          This shell is the foundation for Slice 01. The final version will route users to immediate,
          low-demand supports based on current state, then record whether those supports helped.
        </p>
      </div>

      <div className="fg-grid" style={{ marginTop: 20 }}>
        {helpCards.map((card) => (
          <article key={card.title} className="fg-card fg-glass">
            <div className="fg-kicker">Starter path</div>
            <h2 className="fg-card-title">{card.title}</h2>
            <p className="fg-card-copy">{card.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default HelpNowHome;