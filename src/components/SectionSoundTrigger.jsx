import { useEffect, useRef } from 'react';
import { useSound } from './SoundEngine';

/**
 * SectionSoundTrigger
 * A renderless component. Watches all .reveal-on-scroll elements via MutationObserver.
 * When the "is-revealed" class is added, fires playSectionReveal() exactly once per element.
 */
const SectionSoundTrigger = () => {
  const { playSectionReveal } = useSound();
  const firedSet = useRef(new Set());

  useEffect(() => {
    if (!playSectionReveal) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          const el = mutation.target;
          if (
            el.classList.contains('is-revealed') &&
            !firedSet.current.has(el)
          ) {
            firedSet.current.add(el);
            setTimeout(() => playSectionReveal(), 50);
          }
        }
      });
    });

    const observe = () => {
      document
        .querySelectorAll('.reveal-on-scroll')
        .forEach((el) =>
          observer.observe(el, { attributes: true, attributeFilter: ['class'] })
        );
    };

    observe();
    const t = setTimeout(observe, 500);

    return () => {
      observer.disconnect();
      clearTimeout(t);
    };
  }, [playSectionReveal]);

  return null;
};

export default SectionSoundTrigger;

