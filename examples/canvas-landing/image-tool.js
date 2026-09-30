/* Vanilla JavaScript: no upload, dependency, cookie or network request. */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const form = $('image-form');
  let source = null, original = null, outputURL = null, revision = 0;
  const bytes = (n) => `${(n / 1024).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} Ko`;
  const clearResult = () => {
    revision++;
    if (outputURL) URL.revokeObjectURL(outputURL);
    outputURL = null;
    $('result').hidden = true;
    $('preview').removeAttribute('src');
    $('download').removeAttribute('href');
  };
  const error = (message) => { $('status').textContent = message; };
  const syncRatio = (changed) => {
    if (!source || !$('lock').checked) return;
    const ratio = source.naturalWidth / source.naturalHeight;
    if (changed === 'height') $('width').value = Math.max(1, Math.round(Number($('height').value) * ratio));
    else $('height').value = Math.max(1, Math.round(Number($('width').value) / ratio));
  };
  async function load(file) {
    clearResult();
    const current = revision;
    source = null;
    original = null;
    $('settings').disabled = true;
    $('original').textContent = '';
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return error('Choisissez une image JPG, PNG ou WebP. HEIC nécessite un décodeur supplémentaire.');
    if (file.size > 25 * 1024 * 1024) return error('Limite : 25 Mo par image.');
    error('Lecture de l’image…');
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      if (current !== revision) return;
      if (image.naturalWidth * image.naturalHeight > 40_000_000) throw new Error('Limite : 40 mégapixels par image.');
      source = image;
      original = file;
      $('width').value = image.naturalWidth;
      $('height').value = image.naturalHeight;
      $('preset').value = '';
      $('percent').value = '100';
      $('original').textContent = `${file.name} · ${image.naturalWidth} × ${image.naturalHeight} px · ${bytes(file.size)}`;
      $('settings').disabled = false;
      error('Image prête. Choisissez vos réglages puis générez le fichier.');
    } catch (e) {
      if (current === revision) error(e.message === 'Limite : 40 mégapixels par image.' ? e.message : 'Image illisible ou format non pris en charge par ce navigateur.');
    } finally { URL.revokeObjectURL(url); }
  }
  $('file').addEventListener('change', (event) => load(event.target.files[0]));
  const zone = $('drop-zone');
  for (const type of ['dragenter', 'dragover']) zone.addEventListener(type, (event) => {
    event.preventDefault(); zone.classList.add('dragging');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragging'));
  zone.addEventListener('drop', (event) => {
    event.preventDefault(); zone.classList.remove('dragging');
    if (event.dataTransfer.files.length !== 1) return error('Déposez une seule image à la fois.');
    load(event.dataTransfer.files[0]);
  });
  for (const id of ['width', 'height']) $(id).addEventListener('input', () => {
    syncRatio(id); $('preset').value = ''; $('percent').value = 'custom';
  });
  $('lock').addEventListener('change', () => { syncRatio('width'); $('preset').value = ''; });
  $('percent').addEventListener('change', () => {
    if (!source || $('percent').value === 'custom') return;
    const factor = Number($('percent').value) / 100;
    $('width').value = Math.max(1, Math.round(source.naturalWidth * factor));
    $('height').value = Math.max(1, Math.round(source.naturalHeight * factor));
    $('preset').value = '';
  });
  $('preset').addEventListener('change', () => {
    if (!$('preset').value) return;
    const [width, height] = $('preset').value.split('x');
    $('width').value = width; $('height').value = height;
    $('lock').checked = false; $('percent').value = 'custom';
  });
  const qualityUI = () => {
    $('quality-value').textContent = `${$('quality').value} %`;
    $('quality').disabled = $('format').value === 'image/png';
    $('quality-note').textContent = $('format').value === 'image/png'
      ? 'PNG : compression sans perte ; le curseur qualité ne s’applique pas.'
      : 'Une qualité plus basse peut réduire le poids, avec une perte de détail.';
  };
  form.addEventListener('input', (event) => { if (event.target.id !== 'file') clearResult(); qualityUI(); });
  form.addEventListener('change', (event) => { if (event.target.id !== 'file') clearResult(); qualityUI(); });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!source || !original) return error('Choisissez d’abord une image.');
    clearResult();
    const current = revision;
    const width = Number($('width').value), height = Number($('height').value);
    if (![width, height].every((v) => Number.isInteger(v) && v > 0 && v <= 8192) || width * height > 24_000_000)
      return error('Dimensions autorisées : 1 à 8192 px, avec un maximum de 24 mégapixels.');
    const file = original, image = source, mime = $('format').value;
    const quality = Number($('quality').value) / 100;
    $('submit').disabled = true;
    error('Génération en cours…');
    const canvas = document.createElement('canvas');
    try {
      canvas.width = width; canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas indisponible.');
      if (mime === 'image/jpeg') { context.fillStyle = '#fff'; context.fillRect(0, 0, width, height); }
      context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
      context.drawImage(image, 0, 0, width, height);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, mime, quality));
      if (current !== revision) return;
      if (!blob || blob.type !== mime) throw new Error('Ce navigateur ne peut pas exporter dans ce format. Essayez PNG ou JPG.');
      outputURL = URL.createObjectURL(blob);
      $('preview').src = outputURL;
      const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[mime];
      $('download').href = outputURL;
      $('download').download = `${file.name.replace(/\.[^.]+$/, '')}-${width}x${height}.${extension}`;
      const delta = 100 * (1 - blob.size / file.size);
      $('sizes').textContent = `Avant : ${bytes(file.size)} · Après : ${bytes(blob.size)} · ${Math.abs(delta).toFixed(1)} % ${delta >= 0 ? 'plus léger' : 'plus volumineux'}`;
      $('result').hidden = false;
      error('Fichier prêt à télécharger. L’original reste intact.');
    } catch (e) { if (current === revision) error(e.message || 'Impossible de générer cette image. Réduisez ses dimensions.'); }
    finally { canvas.width = 0; canvas.height = 0; $('submit').disabled = false; }
  });
  qualityUI();
})();
