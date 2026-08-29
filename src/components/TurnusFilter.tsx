import React from 'react';
import { useProfiles } from '../context/ProfilesContext';
import { TURNUSY } from '../data/faculties';
import { TurnusId } from '../types';
import { Sparkles } from 'lucide-react';

export const TurnusFilter: React.FC = () => {
  const { filters, setFilters, profiles } = useProfiles();

  const getTurnusCount = (turnusId: TurnusId | 'all') => {
    if (turnusId === 'all') return profiles.length;
    return profiles.filter(p => p.turnus === turnusId).length;
  };

  return (
    <div className="turnus-tabs-wrapper">
      <div className="container">
        <div className="turnus-tabs">
          <button
            type="button"
            className={`turnus-tab ${filters.turnus === 'all' ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, turnus: 'all' }))}
          >
            <div className="tab-name">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="var(--p-primary)" />
                Všechny turnusy
              </span>
              <span className="tab-badge">{getTurnusCount('all')}</span>
            </div>
            <span className="tab-dates">Kompletní seznam MUNI</span>
          </button>

          {TURNUSY.map(turnus => {
            const count = getTurnusCount(turnus.id);
            const isActive = filters.turnus === turnus.id;

            return (
              <button
                key={turnus.id}
                type="button"
                className={`turnus-tab ${isActive ? 'active' : ''}`}
                onClick={() => setFilters(prev => ({ ...prev, turnus: turnus.id }))}
              >
                <div className="tab-name">
                  <span>{turnus.shortName}</span>
                  <span className="tab-badge">{count}</span>
                </div>
                <span className="tab-dates">{turnus.dates}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
