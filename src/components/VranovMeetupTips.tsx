import React from 'react';
import { ShieldCheck, Coffee, Users2 } from 'lucide-react';

export const VranovMeetupTips: React.FC = () => {
  return (
    <section className="container">
      <div className="meetup-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--p-mint)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase' }}>
          <span>Spolubydlení Vranov</span>
        </div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: 'white' }}>
          Osobní seznámení na Vranově bez rizika a stresu
        </h2>

        <div className="meetup-grid">
          <div className="meetup-item">
            <ShieldCheck size={32} color="#5AC8AF" />
            <h3 className="meetup-title">Jen lidé z Vranovu</h3>
            <p className="meetup-desc">
              Žádné anonymní FB skupiny plné podvodníků. Inzeráty píšou reální studenti, kteří jedou na Vranov – a potkáte se osobně ještě před podpisem smlouvy.
            </p>
          </div>

          <div className="meetup-item">
            <Coffee size={32} color="#0D9488" />
            <h3 className="meetup-title">Pokec na pláži u drinku</h3>
            <p className="meetup-desc">
              Nemusíš hned podepisovat smlouvu na slepo. Dejte si sraz u stánku nebo na večerním programu a zjistěte, zda máte stejný vibe.
            </p>
          </div>

          <div className="meetup-item">
            <Users2 size={32} color="#f472b6" />
            <h3 className="meetup-title">Sestavte partu na nový byt</h3>
            <p className="meetup-desc">
              Když se spojíte 2-3 lidi dohromady, můžete si pronajmout velký byt v Brně a vyjde vás to výrazně levněji než předražené pokoje.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
