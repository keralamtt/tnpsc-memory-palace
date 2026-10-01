/**
 * Generates an educational video Blob using HTML5 Canvas and MediaRecorder.
 * This guarantees users have rich, playable sample videos ready for analysis
 * without requiring large external CDN video downloads.
 */

export function createSampleVideoBlob(
  type: 'moneyheist' | 'botany' | 'cauvery' | 'temple' | 'windenergy',
  durationSec: number = 8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas 2D context not available'));
      return;
    }

    const stream = canvas.captureStream(25);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm')
      ? 'video/webm'
      : 'video/mp4';

    let mediaRecorder: MediaRecorder;
    try {
      mediaRecorder = new MediaRecorder(stream, { mimeType });
    } catch {
      mediaRecorder = new MediaRecorder(stream);
    }

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mediaRecorder.mimeType || 'video/webm' });
      resolve(blob);
    };

    mediaRecorder.start();

    const startTime = performance.now();
    const totalMs = durationSec * 1000;

    function render(time: number) {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / totalMs);
      const t = elapsed / 1000;

      // Draw background & scenes
      if (ctx) {
        if (type === 'goldillusion') {
          drawGoldIllusionScene(ctx, canvas.width, canvas.height, t, progress, durationSec);
        } else if (type === 'moneyheist') {
          drawMoneyHeistScene(ctx, canvas.width, canvas.height, t, progress, durationSec);
        } else if (type === 'botany') {
          drawBotanyScene(ctx, canvas.width, canvas.height, t, progress);
        } else if (type === 'cauvery') {
          drawCauveryScene(ctx, canvas.width, canvas.height, t, progress);
        } else if (type === 'temple') {
          drawTempleScene(ctx, canvas.width, canvas.height, t, progress);
        } else {
          drawWindEnergyScene(ctx, canvas.width, canvas.height, t, progress);
        }
      }

      if (progress < 1) {
        requestAnimationFrame(render);
      } else {
        setTimeout(() => {
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
          }
        }, 100);
      }
    }

    requestAnimationFrame(render);
  });
}

function drawGoldIllusionScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  progress: number,
  totalDur: number
) {
  // Vault atmosphere with vaulted arches & warm candlelight
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, '#090d0b');
  bgGrad.addColorStop(0.5, '#121816');
  bgGrad.addColorStop(1, '#050706');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Vaulted stone archway in background
  ctx.strokeStyle = '#1e2926';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.35, w * 0.42, Math.PI, 0);
  ctx.stroke();

  // Dim golden candelabra / chandelier in top background
  const chandelierX = w * 0.72;
  const chandelierY = 45;
  ctx.strokeStyle = '#78590c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(chandelierX, 0);
  ctx.lineTo(chandelierX, chandelierY);
  ctx.moveTo(chandelierX - 25, chandelierY);
  ctx.lineTo(chandelierX + 25, chandelierY);
  ctx.stroke();

  // Candle flames flickering
  ctx.fillStyle = '#fef08a';
  for (let c = -20; c <= 20; c += 10) {
    const flX = chandelierX + c;
    const flY = chandelierY - 6 + Math.sin(t * 12 + c) * 1.5;
    ctx.beginPath();
    ctx.arc(flX, flY, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Scene branching based on timeline
  // t: 0..69
  let subText = '';
  let tnpscBadge = '';

  if (t < 7) {
    // SCENE 1: Palermo & Professor calling "Martín..."
    drawPalermoFace(ctx, w * 0.5, h * 0.52);
    drawSpeakerTag(ctx, 'Palermo (Martín Berrote)', 'Bank of Spain Heist Architect');
    subText = '"[Professor] Martín."';
    tnpscBadge = 'Unit 6 Economy · Monetary Systems & Central Bank Gold Reserves';
  } else if (t >= 7 && t < 18) {
    // SCENE 2: The Professor explaining "What is a country's gold? Its wealth? No. It's an illusion."
    drawProfessorFace(ctx, w * 0.5, h * 0.54, t);
    drawSpeakerTag(ctx, 'The Professor (Sergio Marquina)', 'Sovereign Reserves & Gold Standard Critique');
    subText = '"What is a country\'s gold? Its wealth? No. It\'s... an illusion."';
    tnpscBadge = 'Unit 6 Economy: RBI Minimum Reserve System 1956 (₹115 Cr Gold)';
  } else if (t >= 18 && t < 24) {
    // SCENE 3: Torn 50 Euro currency paper banknotes on gravel floor
    drawTornBanknotes(ctx, w, h, t);
    drawSpeakerTag(ctx, 'Currency Destruction', 'Fiat Paper Currency vs Commodity Gold');
    subText = '"It\'s an illusion."';
    tnpscBadge = 'Unit 6 Economy: Fiat Money & Section 26 RBI Act (Legal Tender)';
  } else if (t >= 24 && t < 36) {
    // SCENE 4: Professor & Palermo discussing transactions
    if (t < 31) {
      drawProfessorFace(ctx, w * 0.5, h * 0.54, t);
      drawSpeakerTag(ctx, 'The Professor', 'Monetary Velocity & Non-circulating Reserves');
      subText = '"It\'s useless. Spain doesn\'t pay for anything with that gold. Not one transaction. Nothing."';
      tnpscBadge = 'Unit 6 Economy: Reserve Assets vs Currency In Circulation (M0, M1, M3)';
    } else {
      drawPalermoFace(ctx, w * 0.5, h * 0.52);
      drawSpeakerTag(ctx, 'Palermo', 'Psychological Parity in Central Banking');
      subText = '"It\'s... merely psychological."';
      tnpscBadge = 'Unit 6 Economy: Public Confidence & Sovereign Credibility in Currency';
    }
  } else if (t >= 36 && t < 51) {
    // SCENE 5: Stacks of Gleaming Gold Ingots in Vault ("Gold for brass")
    drawGoldVault(ctx, w, h, t);
    drawSpeakerTag(ctx, 'Bank of Spain Vault', 'Gold (Au 79) vs Brass Alloy (Cu + Zn)');
    subText = '"[Palermo] Gold for brass."';
    tnpscBadge = 'Unit 1 Science: Chemistry · Metallurgy of Gold & Brass (Cu + Zn)';
  } else if (t >= 51 && t < 61) {
    // SCENE 6: Flashback to Berlin in Madrid plaza
    drawBerlinFlashback(ctx, w, h, t);
    drawSpeakerTag(ctx, 'Berlin (Andrés de Fonollosa)', 'The Viking Treasure & Substitution Masterpiece');
    subText = '"The exchange was exquisite."';
    tnpscBadge = 'Unit 1 Science: Chemistry · Density & Specific Gravity of Metals';
  } else {
    // SCENE 7: The Professor holding the Red Origami Paper Bird in candlelight
    drawOrigamiBirdScene(ctx, w, h, t);
    drawSpeakerTag(ctx, 'The Professor', 'Paper Cellulose Chemistry & TNPL Bagasse');
    subText = '"[Origami Swan] Red paper folded with precision beside candlelight."';
    tnpscBadge = 'Unit 1 Science & Unit 9 TN: Cellulose Chemistry & TNPL Paper (Karur)';
  }

  // Subtitle Banner at bottom
  ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
  ctx.fillRect(16, h - 68, w - 32, 56);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1;
  ctx.strokeRect(16, h - 68, w - 32, 56);

  ctx.font = '600 13px sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.textAlign = 'center';
  ctx.fillText(subText, w * 0.5, h - 45);

  ctx.font = '500 11px sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`⚡ TNPSC Link: ${tnpscBadge}`, w * 0.5, h - 24);
  ctx.textAlign = 'left';

  // Video Time Indicator
  const sec = Math.floor(t);
  const timeFormatted = `00:${sec < 10 ? '0' : ''}${sec} / 01:09`;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(w - 114, 16, 98, 28);
  ctx.font = '600 11px monospace';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(timeFormatted, w - 104, 34);
}

function drawPalermoFace(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  // Dark leather jacket
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.moveTo(cx - 95, 360);
  ctx.lineTo(cx - 65, cy + 70);
  ctx.lineTo(cx + 65, cy + 70);
  ctx.lineTo(cx + 95, 360);
  ctx.closePath();
  ctx.fill();

  // Neck & Head
  ctx.fillStyle = '#c7926b';
  ctx.fillRect(cx - 20, cy + 35, 40, 35);

  ctx.beginPath();
  ctx.ellipse(cx, cy + 8, 48, 58, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dark combed hair
  ctx.fillStyle = '#171717';
  ctx.beginPath();
  ctx.ellipse(cx, cy - 30, 52, 38, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes with sly smile
  ctx.fillStyle = '#292524';
  ctx.beginPath();
  ctx.arc(cx - 18, cy + 4, 4, 0, Math.PI * 2);
  ctx.arc(cx + 18, cy + 4, 4, 0, Math.PI * 2);
  ctx.fill();

  // Smirking mouth
  ctx.strokeStyle = '#7f1d1d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 14, cy + 36);
  ctx.quadraticCurveTo(cx, cy + 42, cx + 18, cy + 34);
  ctx.stroke();
}

function drawProfessorFace(ctx: CanvasRenderingContext2D, cx: number, cy: number, _t: number) {
  // Suit jacket & tie
  ctx.fillStyle = '#18181b';
  ctx.beginPath();
  ctx.moveTo(cx - 100, 360);
  ctx.lineTo(cx - 70, cy + 70);
  ctx.lineTo(cx + 70, cy + 70);
  ctx.lineTo(cx + 100, 360);
  ctx.closePath();
  ctx.fill();

  // White collar
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(cx - 25, cy + 70);
  ctx.lineTo(cx, cy + 110);
  ctx.lineTo(cx + 25, cy + 70);
  ctx.closePath();
  ctx.fill();

  // Dark tie
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.moveTo(cx - 9, cy + 85);
  ctx.lineTo(cx, cy + 140);
  ctx.lineTo(cx + 9, cy + 85);
  ctx.closePath();
  ctx.fill();

  // Head
  ctx.fillStyle = '#d4a373';
  ctx.fillRect(cx - 22, cy + 40, 44, 35);
  ctx.beginPath();
  ctx.ellipse(cx, cy + 10, 52, 64, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dark wavy hair
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.ellipse(cx, cy - 32, 58, 45, 0, 0, Math.PI * 2);
  ctx.fill();

  // Beard
  ctx.fillStyle = '#292524';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 48, 38, 26, 0, 0, Math.PI);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#44403c';
  ctx.beginPath();
  ctx.arc(cx - 20, cy + 5, 4.5, 0, Math.PI * 2);
  ctx.arc(cx + 20, cy + 5, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Spectacles
  ctx.strokeStyle = '#0a0a0a';
  ctx.lineWidth = 3.5;
  ctx.strokeRect(cx - 38, cy - 10, 32, 26);
  ctx.strokeRect(cx + 6, cy - 10, 32, 26);
  ctx.beginPath();
  ctx.moveTo(cx - 6, cy + 2);
  ctx.lineTo(cx + 6, cy + 2);
  ctx.stroke();

  // Glare
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 34, cy + 10);
  ctx.lineTo(cx - 14, cy - 6);
  ctx.moveTo(cx + 10, cy + 10);
  ctx.lineTo(cx + 30, cy - 6);
  ctx.stroke();
}

function drawTornBanknotes(ctx: CanvasRenderingContext2D, w: number, h: number, _t: number) {
  // Dark textured ground
  ctx.fillStyle = '#1e2923';
  ctx.fillRect(0, 0, w, h);

  // Gravel pebbles
  ctx.fillStyle = '#334139';
  for (let i = 0; i < 40; i++) {
    const px = (i * 37) % w;
    const py = (i * 29) % (h - 80);
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Torn 50 Euro Note (Left half)
  ctx.save();
  ctx.translate(w * 0.42, h * 0.42);
  ctx.rotate(-0.15);
  ctx.fillStyle = '#ea580c'; // 50 Euro orange
  ctx.fillRect(-70, -35, 75, 70);
  ctx.fillStyle = '#fed7aa';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('50', -60, 5);
  ctx.font = '10px sans-serif';
  ctx.fillText('EURO', -60, 20);
  // Torn jagged edge
  ctx.fillStyle = '#1e2923';
  ctx.beginPath();
  ctx.moveTo(5, -35);
  ctx.lineTo(-2, -15);
  ctx.lineTo(5, 5);
  ctx.lineTo(-3, 20);
  ctx.lineTo(5, 35);
  ctx.lineTo(15, 35);
  ctx.lineTo(15, -35);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Torn 50 Euro Note (Right half)
  ctx.save();
  ctx.translate(w * 0.58, h * 0.46);
  ctx.rotate(0.12);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(-10, -35, 75, 70);
  ctx.fillStyle = '#fed7aa';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('EURO', 15, 10);
  ctx.restore();
}

function drawGoldVault(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // Vault darkness
  ctx.fillStyle = '#0f1715';
  ctx.fillRect(0, 0, w, h);

  // Stacks of Gold Bullion Ingots (Pyramidal tier)
  const rows = 6;
  const cols = 9;
  const barW = 42;
  const barH = 18;
  const startX = w * 0.5 - (cols * barW) / 2;
  const startY = h * 0.65;

  for (let r = 0; r < rows; r++) {
    const rowCols = cols - r;
    const rx = startX + (r * barW) / 2;
    const ry = startY - r * (barH + 2);

    for (let c = 0; c < rowCols; c++) {
      const bx = rx + c * (barW + 2);
      const isGleaming = (c + r + Math.floor(t * 3)) % 5 === 0;

      // Ingot face gradient
      const goldGrad = ctx.createLinearGradient(bx, ry, bx + barW, ry + barH);
      if (isGleaming) {
        goldGrad.addColorStop(0, '#fef08a');
        goldGrad.addColorStop(0.5, '#eab308');
        goldGrad.addColorStop(1, '#ca8a04');
      } else {
        goldGrad.addColorStop(0, '#fbbf24');
        goldGrad.addColorStop(0.7, '#d97706');
        goldGrad.addColorStop(1, '#92400e');
      }
      ctx.fillStyle = goldGrad;
      ctx.fillRect(bx, ry, barW, barH);

      // Ingot 3D beveled edge
      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, ry, barW, barH);
    }
  }

  // Vault label
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(w * 0.5 - 110, 50, 220, 28);
  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.textAlign = 'center';
  ctx.fillText('BANK OF SPAIN VAULT · 99.9% Au vs BRASS (Cu+Zn)', w * 0.5, 68);
  ctx.textAlign = 'left';
}

function drawBerlinFlashback(ctx: CanvasRenderingContext2D, w: number, h: number, _t: number) {
  // Bright Madrid sunny plaza
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, '#38bdf8');
  skyGrad.addColorStop(0.5, '#bae6fd');
  skyGrad.addColorStop(1, '#f8fafc');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Plaza classical architecture in background
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(w * 0.1, h * 0.35, w * 0.8, h * 0.4);
  for (let c = 0; c < 8; c++) {
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(w * 0.15 + c * 50, h * 0.4, 20, 80);
  }

  // Berlin smiling
  const cx = w * 0.5;
  const cy = h * 0.52;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(cx - 70, cy + 60, 140, 100);

  ctx.fillStyle = '#f5d0b5';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 10, 44, 54, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.ellipse(cx, cy - 25, 48, 36, 0, 0, Math.PI * 2);
  ctx.fill();

  // Charismatic smile
  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.arc(cx - 16, cy + 4, 4, 0, Math.PI * 2);
  ctx.arc(cx + 16, cy + 4, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#881337';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy + 28, 16, 0.1, Math.PI - 0.1);
  ctx.stroke();
}

function drawOrigamiBirdScene(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // Candlelit night
  ctx.fillStyle = '#0c0a09';
  ctx.fillRect(0, 0, w, h);

  // Candle glow on right
  const candleX = w * 0.75;
  const candleY = h * 0.55;
  const glow = ctx.createRadialGradient(candleX, candleY, 5, candleX, candleY, 150);
  glow.addColorStop(0, 'rgba(251, 191, 36, 0.6)');
  glow.addColorStop(0.5, 'rgba(217, 119, 6, 0.2)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(candleX, candleY, 150, 0, Math.PI * 2);
  ctx.fill();

  // Red Origami Bird held in hand
  const ox = w * 0.48 + Math.sin(t * 2) * 4;
  const oy = h * 0.5;

  ctx.fillStyle = '#dc2626'; // Vivid red paper
  ctx.beginPath();
  // Body & wing
  ctx.moveTo(ox - 35, oy);
  ctx.lineTo(ox, oy - 45); // Wing tip
  ctx.lineTo(ox + 20, oy - 10);
  ctx.lineTo(ox + 45, oy - 30); // Head beak
  ctx.lineTo(ox + 30, oy);
  ctx.lineTo(ox + 10, oy + 25); // Tail
  ctx.closePath();
  ctx.fill();

  // Origami paper fold crease highlights
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(ox - 35, oy);
  ctx.lineTo(ox + 20, oy - 10);
  ctx.lineTo(ox, oy - 45);
  ctx.stroke();

  // Hands holding base
  ctx.fillStyle = '#c28b5e';
  ctx.beginPath();
  ctx.ellipse(ox, oy + 32, 28, 14, 0, 0, Math.PI * 2);
  ctx.fill();
}

  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  progress: number,
  totalDur: number
) {
  // Dark cinematic subway / carriage interior
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, '#0c1110');
  bgGrad.addColorStop(0.5, '#161e1c');
  bgGrad.addColorStop(1, '#080a0a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Subway train carriage window & metallic overhead grab rail
  ctx.fillStyle = '#1c2624';
  ctx.fillRect(w * 0.1, 20, w * 0.8, 40);

  // Overhead LED light fixture (p-n junction illumination)
  ctx.fillStyle = '#f0fdf4';
  ctx.shadowColor = '#86efac';
  ctx.shadowBlur = 15;
  ctx.fillRect(w * 0.25, 24, w * 0.5, 6);
  ctx.shadowBlur = 0;

  // Handrail bar across top
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 50);
  ctx.lineTo(w, 50);
  ctx.stroke();

  // Vertical handrail pole
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(w * 0.18, 50);
  ctx.lineTo(w * 0.18, h);
  ctx.stroke();

  // Determine which character is speaking based on video timeline
  // t: 0..29 seconds
  const isProfessor = (t >= 3 && t < 7) || (t >= 14 && t < 18) || (t >= 21 && t < 24);

  if (isProfessor) {
    // DRAW THE PROFESSOR (Sergio Marquina)
    const cx = w * 0.5;
    const cy = h * 0.58;

    // Dark coat & collared shirt
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(cx - 100, h);
    ctx.lineTo(cx - 70, cy + 70);
    ctx.lineTo(cx + 70, cy + 70);
    ctx.lineTo(cx + 100, h);
    ctx.closePath();
    ctx.fill();

    // Shirt collar & tie
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(cx - 25, cy + 70);
    ctx.lineTo(cx, cy + 110);
    ctx.lineTo(cx + 25, cy + 70);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy + 85);
    ctx.lineTo(cx, cy + 140);
    ctx.lineTo(cx + 10, cy + 85);
    ctx.closePath();
    ctx.fill();

    // Neck & Head
    ctx.fillStyle = '#d4a373';
    ctx.fillRect(cx - 22, cy + 40, 44, 35);

    // Face oval
    ctx.beginPath();
    ctx.ellipse(cx, cy + 10, 52, 64, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair (Dark, wavy)
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 30, 58, 45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Beard & Mustache
    ctx.fillStyle = '#292524';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 48, 38, 26, 0, 0, Math.PI);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#44403c';
    ctx.beginPath();
    ctx.arc(cx - 20, cy + 5, 4.5, 0, Math.PI * 2);
    ctx.arc(cx + 20, cy + 5, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // ICONIC SPECTACLES (Eyeglasses with dark rim - Refraction & Myopia)
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = 3.5;
    // Left lens frame
    ctx.strokeRect(cx - 38, cy - 10, 32, 26);
    // Right lens frame
    ctx.strokeRect(cx + 6, cy - 10, 32, 26);
    // Bridge between lenses
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy + 2);
    ctx.lineTo(cx + 6, cy + 2);
    ctx.stroke();

    // Lens glare reflection (Optics physics)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 34, cy + 10);
    ctx.lineTo(cx - 14, cy - 6);
    ctx.moveTo(cx + 10, cy + 10);
    ctx.lineTo(cx + 30, cy - 6);
    ctx.stroke();

    // Character Tag
    drawSpeakerTag(ctx, 'The Professor (Sergio Marquina)', 'Dark Framed Spectacles · Concave Lenses');
  } else {
    // DRAW RAQUEL MURILLO (Lisbon)
    const cx = w * 0.5;
    const cy = h * 0.54;

    // Green jacket / coat
    ctx.fillStyle = '#283618';
    ctx.beginPath();
    ctx.moveTo(cx - 95, h);
    ctx.lineTo(cx - 65, cy + 80);
    ctx.lineTo(cx + 65, cy + 80);
    ctx.lineTo(cx + 95, h);
    ctx.closePath();
    ctx.fill();

    // Dark collar shirt
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy + 80);
    ctx.lineTo(cx, cy + 120);
    ctx.lineTo(cx + 30, cy + 80);
    ctx.closePath();
    ctx.fill();

    // Arm reaching up to holding rail
    ctx.strokeStyle = '#283618';
    ctx.lineWidth = 26;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx + 65, cy + 110);
    ctx.lineTo(w * 0.82, 60);
    ctx.stroke();

    // Hand gripping overhead rail
    ctx.fillStyle = '#e5c29f';
    ctx.beginPath();
    ctx.arc(w * 0.82, 52, 14, 0, Math.PI * 2);
    ctx.fill();

    // Long Blonde/light-brown Hair (Backing)
    ctx.fillStyle = '#a16207';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 20, 68, 85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Face oval
    ctx.fillStyle = '#f5d0b5';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 10, 46, 58, 0, 0, Math.PI * 2);
    ctx.fill();

    // Blonde Hair strands in front
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.moveTo(cx - 45, cy - 35);
    ctx.quadraticCurveTo(cx - 55, cy + 40, cx - 40, cy + 100);
    ctx.lineTo(cx - 30, cy + 100);
    ctx.quadraticCurveTo(cx - 35, cy + 30, cx - 35, cy - 30);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + 45, cy - 35);
    ctx.quadraticCurveTo(cx + 55, cy + 40, cx + 40, cy + 100);
    ctx.lineTo(cx + 30, cy + 100);
    ctx.quadraticCurveTo(cx + 35, cy + 30, cx + 35, cy - 30);
    ctx.closePath();
    ctx.fill();

    // Eyes with intense emotional gaze
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(cx - 18, cy + 2, 4.5, 0, Math.PI * 2);
    ctx.arc(cx + 18, cy + 2, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows showing tension
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - 28, cy - 8);
    ctx.lineTo(cx - 10, cy - 12);
    ctx.moveTo(cx + 10, cy - 12);
    ctx.lineTo(cx + 28, cy - 8);
    ctx.stroke();

    // Lips & Mouth movement
    const mouthOpen = 2 + Math.sin(t * 8) * 2;
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 36, 12, mouthOpen, 0, 0, Math.PI * 2);
    ctx.fill();

    drawSpeakerTag(ctx, 'Raquel Murillo (Inspector Lisbon)', 'Facial Nerve CN VII · Emotional Expression');
  }

  // SUBTITLES & TAMIL DIALOGUE (Exact transcription from video)
  let subText = '';
  let tnpscBadge = '';

  if (t < 3) {
    subText = '"எல்லாத்துக்கும் ஒரு முகமூடியை போட்டுக்கிறது..."';
    tnpscBadge = 'Unit 1 Science: Zoology · Facial Expressions & Psychology';
  } else if (t < 7) {
    subText = '"உனக்கு லைஃப்ஸ்டைலாவே ஆயிடுச்சுன்னு நினைக்கிறேன்..."';
    tnpscBadge = 'Unit 1 Science: Physics · Spectacles & Concave Lens Optics (00:03)';
  } else if (t < 10) {
    subText = '"இதுவும் அந்த மாதிரி ஒரு முகமூடி தான்..."';
    tnpscBadge = 'Unit 1 Science: Cranial Nerves · Facial Nerve CN VII (00:07)';
  } else if (t < 14) {
    subText = '"பாக்குறதுக்கு சாதாரண ஆள் மாதிரி இருக்க..."';
    tnpscBadge = 'Unit 1 Science: Physics · Transit LED Lighting & Semiconductors (00:10)';
  } else if (t < 17) {
    subText = '"கண்ணாடி போட்டிருக்க..."';
    tnpscBadge = 'Unit 1 Science: Physics · Refraction & Myopia Eye Defects (00:15)';
  } else if (t < 24) {
    subText = '"ஒரு ஆர்மி காவலைத் தாண்டி கவர்மெண்ட்டோட நேருக்கு நேரா மல்லுக்கட்ட தில் இருக்கிற ஒரு ஆள்..."';
    tnpscBadge = 'Unit 5 Polity: Art 53(2) Supreme Commander & Union Security (00:20)';
  } else {
    subText = '"ஆட்டத்தோட பெரிய ட்ரிக்கே நீ தான்..."';
    tnpscBadge = 'Unit 5 Polity: Habeas Corpus & Criminal Justice Rights (00:27)';
  }

  // Draw Subtitle Banner
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillRect(20, h - 68, w - 40, 56);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1;
  ctx.strokeRect(20, h - 68, w - 40, 56);

  ctx.font = '600 13px sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.textAlign = 'center';
  ctx.fillText(subText, w * 0.5, h - 45);

  ctx.font = '500 11px sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`⚡ TNPSC Link: ${tnpscBadge}`, w * 0.5, h - 24);
  ctx.textAlign = 'left';

  // Video Time Indicator
  const sec = Math.floor(t);
  const timeFormatted = `00:${sec < 10 ? '0' : ''}${sec} / 00:${totalDur}`;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.fillRect(w - 110, 16, 94, 28);
  ctx.font = '600 11px monospace';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(timeFormatted, w - 100, 34);
}

function drawSpeakerTag(ctx: CanvasRenderingContext2D, speaker: string, concept: string) {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(16, 16, 260, 42);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.strokeRect(16, 16, 260, 42);

  ctx.font = '700 11px sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(speaker, 26, 32);

  ctx.font = '500 10px sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText(concept, 26, 48);
}


function drawBotanyScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  progress: number
) {
  // Sky with sunlight gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.7);
  skyGrad.addColorStop(0, '#fef08a');
  skyGrad.addColorStop(0.4, '#bae6fd');
  skyGrad.addColorStop(1, '#ecfccb');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Brilliant Sun rays
  const sunX = 120 + Math.sin(t * 0.5) * 20;
  const sunY = 70;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 180);
  sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
  sunGlow.addColorStop(0.3, 'rgba(253, 224, 71, 0.6)');
  sunGlow.addColorStop(1, 'rgba(253, 224, 71, 0)');
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 180, 0, Math.PI * 2);
  ctx.fill();

  // Draw shimmering sun rays
  ctx.strokeStyle = 'rgba(255, 245, 157, 0.35)';
  ctx.lineWidth = 3;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
    ctx.beginPath();
    ctx.moveTo(sunX, sunY);
    ctx.lineTo(sunX + Math.cos(a + t * 0.2) * 250, sunY + Math.sin(a + t * 0.2) * 250);
    ctx.stroke();
  }

  // Fertile soil ground
  const soilGrad = ctx.createLinearGradient(0, h * 0.65, 0, h);
  soilGrad.addColorStop(0, '#65a30d');
  soilGrad.addColorStop(0.3, '#4d7c0f');
  soilGrad.addColorStop(1, '#365314');
  ctx.fillStyle = soilGrad;
  ctx.fillRect(0, h * 0.65, w, h * 0.35);

  // Irrigation canal in foreground
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.moveTo(w * 0.6, h);
  ctx.bezierCurveTo(w * 0.55, h * 0.8, w * 0.45, h * 0.75, w * 0.48, h * 0.65);
  ctx.lineTo(w * 0.54, h * 0.65);
  ctx.bezierCurveTo(w * 0.52, h * 0.75, w * 0.65, h * 0.82, w * 0.75, h);
  ctx.closePath();
  ctx.fill();

  // Green plant stem & leaves
  const plantBaseX = w * 0.28;
  const plantBaseY = h * 0.75;

  ctx.strokeStyle = '#15803d';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(plantBaseX, plantBaseY);
  ctx.quadraticCurveTo(
    plantBaseX + Math.sin(t * 1.5) * 8,
    plantBaseY - 80,
    plantBaseX - 10,
    plantBaseY - 140
  );
  ctx.stroke();

  // Leaves
  drawLeaf(ctx, plantBaseX - 8, plantBaseY - 50, -0.6 + Math.sin(t) * 0.05, 55, 26, '#22c55e');
  drawLeaf(ctx, plantBaseX + 2, plantBaseY - 85, 0.5 + Math.cos(t) * 0.05, 60, 28, '#16a34a');
  drawLeaf(ctx, plantBaseX - 12, plantBaseY - 115, -0.5 + Math.sin(t * 1.2) * 0.05, 48, 22, '#4ade80');

  // Stomata / Transpiration vapor particles floating upwards
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  for (let i = 0; i < 6; i++) {
    const py = (plantBaseY - 70 - ((t * 40 + i * 25) % 110));
    const px = plantBaseX - 10 + Math.sin(t * 3 + i) * 15;
    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Scene overlay title
  drawSceneWatermark(ctx, 'Agri-Botany: Sunlight & Photosynthesis in Leaves', progress);
}

function drawCauveryScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  progress: number
) {
  // Eastern Ghats backdrop & River Cauvery Delta
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.55);
  skyGrad.addColorStop(0, '#f97316');
  skyGrad.addColorStop(0.5, '#fed7aa');
  skyGrad.addColorStop(1, '#bae6fd');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Hills (Western / Eastern Ghats)
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.5);
  ctx.lineTo(w * 0.25, h * 0.32);
  ctx.lineTo(w * 0.5, h * 0.48);
  ctx.lineTo(w * 0.75, h * 0.35);
  ctx.lineTo(w, h * 0.45);
  ctx.lineTo(w, h * 0.6);
  ctx.lineTo(0, h * 0.6);
  ctx.closePath();
  ctx.fill();

  // Lush alluvial riverbanks
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.52);
  ctx.lineTo(w * 0.35, h * 0.55);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(w, h * 0.52);
  ctx.lineTo(w * 0.65, h * 0.58);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  // Flowing Cauvery River
  const riverGrad = ctx.createLinearGradient(0, h * 0.5, 0, h);
  riverGrad.addColorStop(0, '#38bdf8');
  riverGrad.addColorStop(0.5, '#0284c7');
  riverGrad.addColorStop(1, '#0369a1');
  ctx.fillStyle = riverGrad;

  ctx.beginPath();
  ctx.moveTo(w * 0.38, h * 0.52);
  ctx.bezierCurveTo(w * 0.45, h * 0.65, w * 0.2, h * 0.8, 0, h);
  ctx.lineTo(w, h);
  ctx.bezierCurveTo(w * 0.75, h * 0.8, w * 0.58, h * 0.65, w * 0.52, h * 0.52);
  ctx.closePath();
  ctx.fill();

  // Water ripples
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 8; i++) {
    const ry = h * (0.6 + i * 0.05);
    const rx = w * 0.48 + Math.sin(t * 2 + i) * 60;
    ctx.beginPath();
    ctx.ellipse(rx, ry, 25 + i * 12, 3, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Alluvial Soil delta silt note
  drawSceneWatermark(ctx, 'Geography: Cauvery River Basin & Delta Irrigation', progress);
}

function drawTempleScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  _t: number,
  progress: number
) {
  // Sunset sky over Thanjavur / Dravidian temple
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, '#c2410c');
  skyGrad.addColorStop(0.4, '#ea580c');
  skyGrad.addColorStop(0.7, '#fbbf24');
  skyGrad.addColorStop(1, '#fef3c7');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Stone courtyard floor
  ctx.fillStyle = '#78716c';
  ctx.fillRect(0, h * 0.72, w, h * 0.28);

  // Dravidian Temple Vimana (Pyramidal Chola structure)
  const cx = w * 0.5;
  const baseY = h * 0.72;
  const tiers = 7;
  const baseW = 160;

  for (let i = 0; i < tiers; i++) {
    const tierW = baseW * (1 - (i / tiers) * 0.75);
    const tierH = 22;
    const tierY = baseY - (i + 1) * tierH;

    // Granite shadow & light
    ctx.fillStyle = i % 2 === 0 ? '#b45309' : '#92400e';
    ctx.fillRect(cx - tierW / 2, tierY, tierW, tierH);

    // Sculptural niches / Kudus
    ctx.fillStyle = '#78350f';
    const niches = Math.max(2, 6 - i);
    for (let n = 0; n < niches; n++) {
      const nx = cx - tierW / 2 + (tierW / (niches + 1)) * (n + 1);
      ctx.beginPath();
      ctx.arc(nx, tierY + tierH / 2, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Kalasam / Stupi on top
  const topY = baseY - tiers * 22;
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(cx, topY - 8, 10, 0, Math.PI * 2);
  ctx.fill();

  // Granite pillars on courtyard
  for (let px of [cx - 180, cx - 120, cx + 120, cx + 180]) {
    ctx.fillStyle = '#57534e';
    ctx.fillRect(px, baseY - 65, 14, 65);
    ctx.fillRect(px - 4, baseY - 70, 22, 6);
  }

  drawSceneWatermark(ctx, 'Unit 8: Chola Dravidian Architecture & Granite Vimana', progress);
}

function drawWindEnergyScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  progress: number
) {
  // Clear breezy sky in Muppandal pass, Kanyakumari
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, '#0284c7');
  skyGrad.addColorStop(0.6, '#7dd3fc');
  skyGrad.addColorStop(1, '#e0f2fe');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Western Ghats foothills
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.65);
  ctx.lineTo(w * 0.3, h * 0.52);
  ctx.lineTo(w * 0.6, h * 0.6);
  ctx.lineTo(w, h * 0.48);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Red laterite / dry shrub plateau ground
  ctx.fillStyle = '#b45309';
  ctx.fillRect(0, h * 0.72, w, h * 0.28);

  // Wind turbines (Muppandal Wind Farm)
  drawTurbine(ctx, w * 0.3, h * 0.75, 110, t * 3.5);
  drawTurbine(ctx, w * 0.55, h * 0.72, 140, t * 4.2);
  drawTurbine(ctx, w * 0.8, h * 0.76, 95, t * 3.8);

  // Electrical transmission lines
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w * 0.1, h * 0.78);
  ctx.lineTo(w * 0.45, h * 0.76);
  ctx.lineTo(w * 0.7, h * 0.79);
  ctx.lineTo(w * 0.95, h * 0.77);
  ctx.stroke();

  drawSceneWatermark(ctx, 'Science & Economy: Muppandal Wind Turbine Energy', progress);
}

function drawTurbine(
  ctx: CanvasRenderingContext2D,
  x: number,
  baseY: number,
  towerH: number,
  angle: number
) {
  // Tower
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(x - 4, baseY);
  ctx.lineTo(x - 2, baseY - towerH);
  ctx.lineTo(x + 2, baseY - towerH);
  ctx.lineTo(x + 4, baseY);
  ctx.closePath();
  ctx.fill();

  // Hub
  const hubY = baseY - towerH;
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.arc(x, hubY, 4, 0, Math.PI * 2);
  ctx.fill();

  // 3 Rotor Blades
  const bladeLen = towerH * 0.48;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  for (let b = 0; b < 3; b++) {
    const bladeAngle = angle + (b * (Math.PI * 2)) / 3;
    const bx = x + Math.cos(bladeAngle) * bladeLen;
    const by = hubY + Math.sin(bladeAngle) * bladeLen;
    ctx.beginPath();
    ctx.moveTo(x, hubY);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }
}

function drawLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  len: number,
  w: number,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(len * 0.5, -w, len, 0);
  ctx.quadraticCurveTo(len * 0.5, w, 0, 0);
  ctx.closePath();
  ctx.fill();

  // Leaf central vein
  ctx.strokeStyle = '#14532d';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(len * 0.9, 0);
  ctx.stroke();

  ctx.restore();
}

function drawSceneWatermark(ctx: CanvasRenderingContext2D, title: string, progress: number) {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.fillRect(16, 16, ctx.measureText(title).width + 36, 32);

  ctx.font = '600 13px sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(title, 26, 37);

  // Time indicator in top right
  const timeStr = `00:0${Math.floor(progress * 8)} / 00:08`;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.fillRect(ctx.canvas.width - 110, 16, 94, 32);
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(timeStr, ctx.canvas.width - 100, 37);
}
