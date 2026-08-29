export type TurnusId = 'turnus1' | 'turnus2' | 'turnus_fsps' | 'other';

export type ListingType = 'looking_for_room' | 'have_room' | 'looking_for_flatmates';

export interface TurnusInfo {
  id: TurnusId;
  name: string;
  shortName: string;
  dates: string;
  badgeColor: string;
  description: string;
}

export interface Profile {
  id: string;
  name?: string;               // Volitelné
  avatar?: string;             // Volitelné: emoji, preset nebo foto dataURL
  turnus: TurnusId;            // Turnus na Vranově (výchozí turnus1)
  type?: ListingType;          // Hledám pokoj / Nabízím pokoj / Hledám parťáky
  faculty?: string;            // Volitelné: např. 'FI', 'LF', 'FF'
  fieldOfStudy?: string;       // Volitelné: např. "Aplikovaná informatika"
  bio?: string;                // Volitelné: text o sobě
  budget?: number;             // Volitelné: rozpočet v Kč/měsíc
  locationPreference?: string; // Volitelné: čtvrti v Brně
  tags?: string[];             // Vlastní uživatelské štítky/badge (vytvořené uživatelem)
  campSpot?: string;           // Volitelné: kde se na Vranově potkat
  contacts?: {
    instagram?: string;
    whatsapp?: string;
    messenger?: string;
    onlyfans?: string;
    phone?: string;
    email?: string;
  };
  email?: string;              // Volitelný kontakt
  manageCode: string;          // Tajný kód pro správu/úpravu/smazání inzerátu (např. VRN-8429)
  createdAt: string;
  isUserCreated?: boolean;
}

export interface FilterState {
  searchQuery: string;
  turnus: 'all' | TurnusId;
  onlySaved: boolean;
}
