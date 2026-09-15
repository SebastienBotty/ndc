// Secours pour les navigateurs sans scroll-driven animations CSS.
// La classe `js-reveal` est posée dans le <head> (voir Base.astro) avant le premier rendu.
const root = document.documentElement;

if (root.classList.contains('js-reveal')) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px' }
  );

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

  const header = document.querySelector('.header-scroll');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}
