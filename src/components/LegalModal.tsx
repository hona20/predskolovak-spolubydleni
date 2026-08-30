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
                Tato webová aplikace <strong>Spolubydlení Vranov</strong> slouží výhradně pro vzájemné dobrovolné propojení a bezpečné seznámení budoucích studentů a spolubydlících na Vranovské přehradě. Jde o nezávislý soukromý projekt, provozovaný Janem Zubíkem, bez jakéhokoliv spojení s pořadateli seznamovacích kurzů či univerzitami.
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

              <h4>3. Kde jsou údaje uložené</h4>
              <p>
                Váš inzerát je uložen v zabezpečené databázi (poskytovatel Supabase, EU), aby ho mohli vidět i ostatní uživatelé aplikace – k tomu appka slouží. Bez tohoto sdílení by inzeráty nikdo jiný neviděl.
              </p>

              <h4>4. Právo na okamžité smazání údajů (Právo být zapomenut)</h4>
              <p>
                Svůj vytvořený inzerát můžete <strong>kdykoliv okamžitě a bezplatně smazat</strong> přímo v aplikaci přes tlačítko <em>„Správa inzerátu“</em> v horní liště – stačí zadat váš tajný PIN kód a potvrdit smazání. Smazáním dojde k okamžitému a trvalému odstranění údajů z databáze.
              </p>

              <h4>5. Předávání třetím stranám</h4>
              <p>
                Vaše osobní údaje <strong>nejsou a nikdy nebudou prodávány, poskytovány ani sdíleny</strong> s žádnými třetími stranami pro marketingové či komerční účely. Údaje zpracovává pouze technický poskytovatel databázového úložiště (Supabase) v roli zpracovatele, nikoliv jako samostatná třetí strana s vlastními marketingovými zájmy.
              </p>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="legal-text-content">
              <h3>🍪 Používání souborů cookies a lokálního úložiště</h3>
              <p>
                Samotný obsah inzerátů appka ukládá do sdílené databáze (viz záložka GDPR), aby je viděli i ostatní účastníci. Vedle toho appka využívá lokální úložiště prohlížeče (<em>HTML5 LocalStorage</em>) pro pár věcí, které se týkají jen tebe a tvého zařízení – bez nutnosti vytvářet účet a heslo.
              </p>

              <h4>K čemu lokální úložiště slouží:</h4>
              <ul>
                <li><strong>Tvůj tajný PIN kód:</strong> Aby appka poznala, který inzerát je „tvůj" a nabídla ti k němu rychlou správu i po zavření prohlížeče.</li>
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
                Všichni uživatelé se zavazují dodržovat pravidla slušnosti a přátelské atmosféry.
              </p>

              <h4>Základní bezpečnostní doporučení pro studenty:</h4>
              <ol>
                <li><strong>Osobní seznámení na Vranově:</strong> Domluvte si osobní setkání na pláži nebo u táboráku dříve, než se zavážete ke společnému nájmu.</li>
                <li><strong>Nikdy neposílejte peníze předem bez smlouvy:</strong> Neplaťte zálohy na nájem ani kauce neověřeným osobám bez platné nájemní smlouvy a osobní prohlídky bytu.</li>
                <li><strong>Respekt k soukromí:</strong> Zveřejňujte pouze takové kontakty, na kterých si přejete být osloveni ostatními uživateli aplikace.</li>
              </ol>

              <h4>Zákaz nevhodného obsahu:</h4>
              <p>
                Je přísně zakázáno vkládat inzeráty s urážlivým, vulgárním, diskriminačním či komerčním obsahem. Takové inzeráty budou neprodleně odstraněny.
              </p>

              <h4>⚖️ Vyloučení odpovědnosti</h4>
              <p>
                Spolubydlení Vranov je nezávislý neoficiální projekt provozovaný soukromou osobou (Jan Zubík), nikoliv oficiální aplikací žádné univerzity, cestovní kanceláře ani pořadatele seznamovacích akcí. Aplikace pouze zprostředkovává vzájemné propojení uživatelů a je poskytována „tak, jak je", bez záruky nepřetržité dostupnosti či bezchybného provozu.
              </p>
              <p>
                Provozovatel neověřuje pravdivost údajů zadaných uživateli a nenese odpovědnost za obsah inzerátů, jednání uživatelů, uzavřené dohody o bydlení ani za jakoukoliv škodu vzniklou v souvislosti s používáním aplikace nebo se seznámením a spolubydlením mezi uživateli. Používání aplikace je zcela dobrovolné a na vlastní riziko uživatele.
              </p>
              <p>
                Provozovatel si vyhrazuje právo kdykoliv upravit obsah aplikace, odstranit libovolný inzerát nebo provoz aplikace ukončit.
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
