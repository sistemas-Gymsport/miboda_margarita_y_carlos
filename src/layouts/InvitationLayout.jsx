import { useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ScrollProgress from '../components/ScrollProgress';
import IntroOverlay from '../sections/IntroOverlay';
import HeroSection from '../sections/HeroSection';
import StorySection from '../sections/StorySection';
import CountdownSection from '../sections/CountdownSection';
import ScheduleSection from '../sections/ScheduleSection';
import LocationSection from '../sections/LocationSection';
import GallerySection from '../sections/GallerySection';
import DressCodeSection from '../sections/DressCodeSection';
import GiftSection from '../sections/GiftSection';
import RSVPSection from '../sections/RSVPSection';
import BankInfoSection from '../sections/BankInfoSection';
import FooterSection from '../sections/FooterSection';
import { getDateParts } from '../utils/date';

const INTRO_KEY = 'wedding-intro-seen';

function introAlreadySeen() {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1';
  } catch {
    return false;
  }
}

/** Composicion vertical de la invitacion segun la visibilidad configurada en el panel. */
export default function InvitationLayout({ invitation }) {
  const { wedding, content, locations, schedule, gallery, giftRegistry, whatsapp, bankInfo } = invitation;
  const sections = wedding.sections || {};
  const [showIntro, setShowIntro] = useState(() => wedding.introEnabled && !introAlreadySeen());
  const [heroReady, setHeroReady] = useState(!showIntro);

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* sin almacenamiento */
    }
    setShowIntro(false);
  }, []);

  const parts = getDateParts(wedding.weddingDate, wedding.timezone);
  const dateLabel = content.heroDateText || (parts ? `${parts.day} · ${parts.month} · ${parts.year}` : '');
  const ceremony = locations.find((l) => l.type === 'CEREMONY') || locations[0];

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <ScrollProgress />

      <AnimatePresence onExitComplete={() => setHeroReady(true)}>
        {showIntro ? <IntroOverlay key="intro" wedding={wedding} content={content} dateLabel={dateLabel} onFinish={finishIntro} /> : null}
      </AnimatePresence>

      <main id="top">
        <HeroSection wedding={wedding} content={content} ready={heroReady || !showIntro} ceremony={ceremony} whatsapp={whatsapp} />
        {sections.story !== false ? <StorySection content={content} image={wedding.mainImage} names={`${wedding.partnerOne} y ${wedding.partnerTwo}`} /> : <div id="contenido" />}
        {sections.countdown !== false ? <CountdownSection wedding={wedding} content={content} ceremony={ceremony} /> : null}
        {sections.schedule !== false ? <ScheduleSection items={schedule} content={content} /> : null}
        {sections.locations !== false ? <LocationSection locations={locations} content={content} /> : null}
        {sections.gallery !== false ? <GallerySection images={gallery} content={content} /> : null}
        {sections.dressCode !== false ? <DressCodeSection content={content} /> : null}
        {sections.gifts !== false ? <GiftSection gift={giftRegistry} /> : null}
        {sections.rsvp !== false ? <RSVPSection whatsapp={whatsapp} /> : null}
        {sections.bank !== false ? <BankInfoSection bank={bankInfo} /> : null}
      </main>

      <FooterSection wedding={wedding} content={content} showClosing={sections.closing !== false} />
    </>
  );
}
