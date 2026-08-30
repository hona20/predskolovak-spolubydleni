import { useState } from 'react';
import { ProfilesProvider, useProfiles } from './context/ProfilesContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { TurnusFilter } from './components/TurnusFilter';
import { FilterBar } from './components/FilterBar';
import { ProfileList } from './components/ProfileList';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { CreateProfileModal } from './components/CreateProfileModal';
import { AdSuccessModal } from './components/AdSuccessModal';
import { ManageAdByCodeModal } from './components/ManageAdByCodeModal';
import { VranovMeetupTips } from './components/VranovMeetupTips';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { LegalModal, LegalTab } from './components/LegalModal';
import { Profile } from './types';
import { CheckCircle2, Plus } from 'lucide-react';
import './styles/base.css';
import './styles/components.css';
import './styles/animations.css';

const MainContent = () => {
  const { userCreatedProfile, toastMessage } = useProfiles();
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createdAdCode, setCreatedAdCode] = useState<string | null>(null);
  const [manageCodeToOpen, setManageCodeToOpen] = useState<string | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab | null>(null);

  const handleOpenManageModal = (code: string = '') => {
    setManageCodeToOpen(code);
    setIsManageModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', width: '100%', maxWidth: '100vw', overflowX: 'clip', minWidth: 0 }}>
      <Header
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenManageByCodeModal={() => handleOpenManageModal()}
        onOpenMyProfile={() => {
          if (userCreatedProfile) {
            handleOpenManageModal(userCreatedProfile.manageCode);
          }
        }}
      />

      <main style={{ flex: 1, minWidth: 0, width: '100%', maxWidth: '100%' }}>
        <HeroBanner onOpenCreateModal={() => setIsCreateModalOpen(true)} />
        <TurnusFilter />

        <div className="container">
          <FilterBar />
          <ProfileList
            onSelectProfile={profile => setSelectedProfile(profile)}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        </div>

        <VranovMeetupTips />
      </main>

      <Footer
        onOpenLegalModal={tab => setLegalModalTab(tab)}
      />

      {/* Mobile Floating Action Button (FAB) */}
      <button
        type="button"
        className="mobile-fab"
        onClick={() => setIsCreateModalOpen(true)}
        aria-label="Vytvořit inzerát"
      >
        <Plus size={20} />
        <span>Přidat inzerát</span>
      </button>

      {/* Modals */}
      {selectedProfile && (
        <ProfileDetailModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onOpenManageByCode={code => handleOpenManageModal(code)}
        />
      )}

      {isCreateModalOpen && (
        <CreateProfileModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={code => setCreatedAdCode(code)}
        />
      )}

      {createdAdCode && (
        <AdSuccessModal
          code={createdAdCode}
          onClose={() => setCreatedAdCode(null)}
        />
      )}

      {isManageModalOpen && (
        <ManageAdByCodeModal
          initialCode={manageCodeToOpen || ''}
          onClose={() => {
            setIsManageModalOpen(false);
            setManageCodeToOpen(null);
          }}
        />
      )}

      {legalModalTab && (
        <LegalModal
          initialTab={legalModalTab}
          onClose={() => setLegalModalTab(null)}
        />
      )}

      {/* Cookie Banner */}
      <CookieBanner
        onOpenPrivacyPolicy={() => setLegalModalTab('gdpr')}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast animate-fade-in">
            <CheckCircle2 size={18} color="#5AC8AF" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <ProfilesProvider>
      <MainContent />
    </ProfilesProvider>
  );
}

export default App;
