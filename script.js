const navigationButton = document.querySelector('.navigation-toggle');
const navigationLabel = document.querySelector('.navigation-label');
const navigationPanel = document.querySelector('.navigation-panel');
const desktopMedia = window.matchMedia('(min-width: 1000px)');
const supportsNavigation = 'popover' in HTMLElement.prototype &&
  CSS.supports('top', 'anchor(bottom)') &&
  CSS.supports('width', 'anchor-size(width)');

// Scegliamo la modalità di navigazione al caricamento (il popover funziona già in HTML)
function updateNavigationLabel() {
  const text = navigationPanel.matches(':popover-open') ? 'Chiudi menu' : 'Apri menu';
  navigationButton.setAttribute('aria-label', text);
  navigationLabel.textContent = text;
}
function updateNavigationLayout() {
  if (desktopMedia.matches) { // Siamo su desktop, disattiva il popover!
    navigationButton.removeAttribute('popovertarget');
    navigationPanel.removeAttribute('popover');
    navigationButton.hidden = true;
  } else { // Non siamo su desktop, riattiva il popover!
    navigationPanel.setAttribute('popover', 'auto');
    navigationButton.setAttribute('popovertarget', navigationPanel.id);
    navigationButton.hidden = false;
  }
  updateNavigationLabel();
}
if (supportsNavigation) {
  navigationPanel.addEventListener('toggle', updateNavigationLabel);
  updateNavigationLayout();
} else {
  // Qui si può eventualmente inserire un ripiego per i browser privi delle funzionalità richieste.
  navigationButton.removeAttribute('popovertarget');
  navigationPanel.removeAttribute('popover');
  navigationButton.hidden = true;
}

// Chiudiamo il popover se clicchiamo fuori (ad eccezione di alcuni casi) e lasciamo al link HTML la navigazione al capitolo
navigationPanel.addEventListener('click', function (event) {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const target = document.getElementById(link.hash.slice(1));
  if (!target) return;
  if (supportsNavigation && navigationPanel.matches(':popover-open')) navigationPanel.hidePopover();
  // Il link continua ad aggiornare il frammento e a scorrere con il comportamento HTML.
});
document.querySelector('.skip-link').addEventListener('click', function () {
  document.querySelector('#top').focus();
});

// Bonus accessibilità: se cambia il breakpoint, manteniamo il focus dove serve
desktopMedia.addEventListener('change', function () {
  if (!supportsNavigation) return;
  const focused = document.activeElement;
  const focusInNavigation = navigationPanel.contains(focused);
  const focusOnButton = focused === navigationButton;
  updateNavigationLayout();
  if (desktopMedia.matches && focusInNavigation) focused.focus();
  else if (desktopMedia.matches && focusOnButton) navigationPanel.querySelector('a').focus();
  else if (!desktopMedia.matches && focusInNavigation) navigationButton.focus();
});

// ---------- SCHEDE (breakdownTabs) ----------

// 1. Cerco il contenitore e le tre voci
const tabs = document.querySelector('.breakdownTabs');
const items = tabs.querySelectorAll('.breakdownTabs-item');

// 2. Dico al CSS che il JavaScript è partito
tabs.classList.add('breakdownTabs-ready');

// 3. Funzione: seleziona la voce con quel numero e deseleziona le altre
function selectItem(index) {
  items.forEach(function (item, i) {
    item.classList.toggle('is-selected', i === index);
  });
}

// 4. Ogni bottone, al clic, seleziona la sua voce
items.forEach(function (item, i) {
  item.querySelector('.breakdownTabs-button').addEventListener('click', function () {
    selectItem(i);
  });
});
