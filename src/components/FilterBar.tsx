import React from 'react';
import { useProfiles } from '../context/ProfilesContext';
import { Search, X } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const { filters, setFilters } = useProfiles();

  return (
    <div id="inzeraty" style={{ marginBottom: '24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'white',
          border: '1.5px solid var(--border-light)',
          borderRadius: 'var(--radius-xl)',
          padding: '8px 16px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <Search size={20} color="var(--text-subtle)" />
        <input
          type="text"
          placeholder="Hledat jméno, fakultu, obor, lokalitu nebo záliby..."
          value={filters.searchQuery}
          onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.9375rem',
            fontFamily: 'inherit',
            background: 'transparent',
            padding: '8px 0',
          }}
        />

        {filters.searchQuery && (
          <button
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              padding: '4px',
            }}
            title="Vymazat hledání"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
