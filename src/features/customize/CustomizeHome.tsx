import React from 'react';

const areas = [
  'State Studio',
  'Comfort Wall',
  'Ibal preferences',
  'Vault and export',
];

export const CustomizeHome: React.FC = () => {
  return (
    <div className="fg-content-card fg-glass">
      <div className="fg-header">
        <div className="fg-kicker">Customize</div>
        <h1 className="fg-section-title">User-owned labels, tools, and preferences.</h1>
        <p className="fg-section-body">
          The old settings surface carried useful identity and export ideas. This shell reframes them as a
          cleaner customization area where users can shape states, comfort tools, and how ibal helps.
        </p>
      </div>

      <div className="fg-grid" style={{ marginTop: 20 }}>
        {areas.map((area) => (
          <article key={area} className="fg-card fg-glass">
            <div className="fg-kicker">Customization</div>
            <h2 className="fg-card-title">{area}</h2>
            <p className="fg-card-copy">
              This will stay focused on user-owned controls and should not expand into a cluttered admin panel.
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CustomizeHome;