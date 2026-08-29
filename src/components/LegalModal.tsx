import React, { useState } from 'react';
import { X, ShieldCheck, Cookie, FileText } from 'lucide-react';

export type LegalTab = 'gdpr' | 'cookies' | 'terms';

interface LegalModalProps {
  initialTab?: LegalTab;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ initialTab = 'gdpr', onClose }) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card animate-scale-up" style={{ maxWidth: '720px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={26} color="var(--p-primary)" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Právní informace & Ochrana údajů</h2>
          </div>

          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Zavřít">
            <X size={20} />
          </button>
        </div>

        {/* Tabs Bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', padding: '0 28px', background: 'var(--bg-main)', gap: '8px' }}>
          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'gdpr' ? 'active' : ''}`}
            onClick={() => setActiveTab('gdpr')}
          >
            <ShieldCheck size={16} />
            <span>Ochrana osobních údajů (GDPR)</span>
          </button>

          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'cookies' ? 'active' : ''}`}
            onClick={() => setActiveTab('cookies')}
          >
            <Cookie size={16} />
            <span>Cookies a úložiště</span>
          </button>

          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            <FileText size={16} />
            <span>Podmínky a bezpečnost</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
          {activeTab === 'gdpr' && (
            <div className="legal-text-content">
              <h3>🛡️ Zásady zpracování a ochrany osobních údajů</h3>
              <p>
                Tato webová aplikace <strong>Spolubydlení Předškolovák</strong> slouží výhradně pro vzájemné dobrovolné propojení a bezpečné seznámení budoucích studentů a účastníků seznamovacího kurzu Předškolovák na Vranovské přehradě.
              </p>

              <h4>1. Jaké údaje zpracováváme a proč?</h4>
              <ul>
                <li><strong>Zadané identifikační údaje (dobrovolné):</strong> Jméno/přezdívka, zvolený avatar či volitelná profilová fotografie, fakulta a obor studia.</li>
                <li><strong>Detaily o spolubydlení:</strong> Turnus akce, preference životního stylu, cenový rozpočet, popis spolubydlícího.</li>
                <li><strong>Kontaktní údaje (dobrovolné):</strong> Uživatelské jméno na Instagramu, telefonní číslo / WhatsApp pro přímé kontaktování budoucími spolubydlícími.</li>
              </ul>

              <h4>2. 100% Dobrovolnost poskytnutí údajů</h4>
              <p>
                Veškeré zadávání údajů v aplikaci je zcela dobrovolné. Nemusíte nahrávat vlastní fotografii (můžete využít předpřipravené emoji avatary), nemusíte uvádět své plné jméno ani telefonní číslo.
              </p>

              <h4>3. Právo na okamžité smazání údajů (Právo být zapomenut)</h4>
              <p>
                Svůj vytvořený inzerát můžete <strong>kdykoliv okamžitě a bezplatně smazat</strong> přímo v aplikaci kliknutím na tlačítko <em>„Smazat můj inzerát“</em> v detailu vašeho inzerátu. Smazáním dojde k okamžitému odstranění údajů z vašeho zařízení.
              </p>

              <h4>4. Předávání třetím stranám</h4>
              <p>
                Vaše osobní údaje <strong>nejsou a nikdy nebudou prodávány, poskytovány ani sdíleny</strong> s žádnými třetími stranami pro marketingové či komerční účely.
              </p>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="legal-text-content">
              <h3>🍪 Používání souborů cookies a lokálního úložiště</h3>
              <p>
                Webová aplikace využívá moderní webové technologie lokálního úložiště (<em>HTML5 LocalStorage</em>) pro zajištění správného fungování funkcí bez nutnosti vytvářet uživatelské účty a hesla.
              </p>

              <h4>K čemu lokální úložiště slouží:</h4>
              <ul>
                <li><strong>Uložení tvého inzerátu:</strong> Aby tvůj inzerát zůstal aktivní v prohlížeči i po obnovení stránky.</li>
                <li><strong>Oblíbené inzeráty:</strong> Zapamatování profilů, které sis označil/a hvězdičkou / srdíčkem.</li>
                <li><strong>Nastavení a filtry:</strong> Uchování tvého nastavení filtrů a volby souhlasu s cookies.</li>
              </ul>

              <h4>Správa a vymazání cookies:</h4>
              <p>
                Uložená data v prohlížeči můžete kdykoliv vymazat v nastavení vašeho webového prohlížeče (Historie a vymazání dat prohlížení).
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="legal-text-content">
              <h3>📜 Pravidla komunity & Bezpečné spolubydlení</h3>
              <p>
                Všichni uživatelé se zavazují dodržovat pravidla slušnosti a přátelské atmosféry odpovídající duchu Předškolováku.
              </p>

              <h4>Základní bezpečnostní doporučení pro studenty:</h4>
              <ol>
                <li><strong>Osobní seznámení na Vranově:</strong> Využijte Předškolovák k osobnímu setkání na pláži nebo u táboráku dříve, než se zavážete ke společnému nájmu.</li>
                <li><strong>Nikdy neposílejte peníze předem bez smlouvy:</strong> Neplaťte zálohy na nájem ani kauce neověřeným osobám bez platné nájemní smlouvy a osobní prohlídky bytu.</li>
                <li><strong>Respekt k soukromí:</strong> Zveřejňujte pouze takové kontakty, na kterých si přejete být osloveni ostatními účastníky akce.</li>
              </ol>

              <h4>Zákaz nevhodného obsahu:</h4>
              <p>
                Je přísně zakázáno vkládat inzeráty s urážlivým, vulgárním, diskriminačním či komerčním obsahem. Takové inzeráty budou neprodleně odstraněny.
              </p>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'flex-end', background: 'var(--bg-main)' }}>
          <button type="button" className="btn btn-sm btn-primary" onClick={onClose}>
            Rozumím a zavřít
          </button>
        </div>
      </div>
    </div>
  );
};
