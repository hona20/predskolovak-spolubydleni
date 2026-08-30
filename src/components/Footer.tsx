import React from 'react';
import { LegalTab } from './LegalModal';
import { ShieldCheck, Cookie, FileText } from 'lucide-react';

interface FooterProps {
  onOpenLegalModal: (tab: LegalTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegalModal }) => {
  return (
    <footer className="app-footer">
      <div className="container footer-inner">
        {/* Legal and Privacy Links */}
        <div className="footer-links" style={{ fontSize: '0.8125rem', opacity: 0.9, gap: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
          <button
            type="button"
            onClick={() => onOpenLegalModal('gdpr')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ShieldCheck size={15} color="#5AC8AF" />
            <span>Ochrana osobních údajů (GDPR)</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenLegalModal('cookies')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Cookie size={15} color="#F2542D" />
            <span>Cookies a úložiště</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenLegalModal('terms')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <FileText size={15} color="#cbd5e1" />
            <span>Podmínky a bezpečnost</span>
          </button>
        </div>

        <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '6px' }}>
          Spolubydlení Vranov – Nezávislý soukromý projekt pro bezpečné seznámení budoucích spolubydlících na Vranovské přehradě. Bez spojení s pořadateli seznamovacích kurzů či univerzitami. 🏖️
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '4px' }}>
          Provozovatel: Jan Zubík · Podpora a nahlášení problémů:{' '}
          <a href="mailto:zubik.jan@post.cz" style={{ color: '#F2542D', textDecoration: 'underline' }}>
            zubik.jan@post.cz
          </a>
        </p>
      </div>
    </footer>
  );
};
