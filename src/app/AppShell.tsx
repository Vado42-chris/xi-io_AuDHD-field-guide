import React, { useMemo } from 'react';
import '../theme/app.css';
import { CurrentStateBar } from '../components/state/CurrentStateBar';
import { CurrentStateSelector } from '../components/state/CurrentStateSelector';
import { CustomizeHome } from '../features/customize/CustomizeHome';
import { HelpNowHome } from '../features/help-now/HelpNowHome';
import { JournalHome } from '../features/journal/JournalHome';
import { LearnMeHome } from '../features/learn-me/LearnMeHome';
import { AppSection } from '../types/core';
import { APP_SECTIONS, SECTION_LABELS } from './appShellConfig';
import { useAppShellController } from './useAppShellController';
import { useFeatureViewProps } from './useFeatureViewProps';

const NavButton: React.FC<{
  section: AppSection;
  active: boolean;
  onClick: (section: AppSection) => void;
}> = ({ section, active, onClick }) => {
  const item = SECTION_LABELS[section];
  return (
    <button type="button" className="fg-nav-button fg-glass" data-active={active} onClick={() => onClick(section)}>
      <div style={{ display: 'grid', gap: 2 }}>
        <div className="fg-kicker" style={{ color: active ? 'var(--fg-accent-strong)' : 'var(--fg-text-muted)' }}>
          {item.kicker}
        </div>
        <div style={{ fontWeight: 700 }}>{item.label}</div>
      </div>
    </button>
  );
};

export const AppShell: React.FC = () => {
  const controller = useAppShellController();
  const viewProps = useFeatureViewProps(controller, controller.setSelectorOpen);

  const activeView = useMemo(() => {
    switch (controller.activeSection) {
      case 'journal':
        return <JournalHome {...viewProps.journalProps} />;
      case 'learn_me':
        return <LearnMeHome {...viewProps.learnMeProps} />;
      case 'customize':
        return <CustomizeHome {...viewProps.customizeProps} />;
      case 'help_now':
      default:
        return <HelpNowHome {...viewProps.helpNowProps} />;
    }
  }, [controller.activeSection, viewProps]);

  return (
    <div className="fg-app-shell">
      <div className="fg-tablet-frame">
        <div className="fg-shell-grid">
          <aside className="fg-sidebar fg-substrate">
            <div className="fg-brand-lockup">
              <div className="fg-brand-mark">XI</div>
              <div className="fg-brand-copy">
                <div className="fg-brand-title">AuDHD Field Guide</div>
                <div className="fg-brand-subtitle">State-aware journal and reflection shell</div>
              </div>
            </div>

            <div className="fg-nav-list">
              {APP_SECTIONS.map((section) => (
                <NavButton key={section} section={section} active={controller.activeSection === section} onClick={controller.setActiveSection} />
              ))}
            </div>

            <div className="fg-glass" style={{ borderRadius: 18, padding: '16px 14px', marginTop: 'auto' }}>
              <div className="fg-kicker">Identity</div>
              <div style={{ fontWeight: 700, marginTop: 4 }}>{controller.identity.username}</div>
              <div className="fg-state-meta">Local-first shell foundation</div>
            </div>
          </aside>

          <main className="fg-main fg-substrate">
            <CurrentStateBar
              currentState={controller.currentState}
              onUpdate={() => controller.setSelectorOpen(true)}
              onHelpNow={() => controller.setActiveSection('help_now')}
            />
            {activeView}
          </main>
        </div>
      </div>

      <CurrentStateSelector
        currentState={controller.currentState}
        states={controller.customStates}
        open={controller.selectorOpen}
        onClose={() => controller.setSelectorOpen(false)}
        onSelectState={controller.handleSelectState}
        onSelectIntensity={controller.handleSelectIntensity}
      />
    </div>
  );
};

export default AppShell;