const fs = require('fs');
const path = require('path');
const { chromium } = require('./node_modules/playwright');

async function recordThriveLoopDemo() {
  const videosDir = path.join(__dirname, 'videos');
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }

  // Remove previous temporary test webm files in videos folder if any
  const oldFiles = fs.readdirSync(videosDir).filter(f => f.startsWith('page@'));
  oldFiles.forEach(f => {
    try { fs.unlinkSync(path.join(videosDir, f)); } catch (e) {}
  });

  console.log('================================================================');
  console.log('🎥 Recording Real Browser Video Demo of ThriveLoop (Playwright)');
  console.log('   Target URL:  http://localhost:5173');
  console.log('   Output Dir:  e2e_tests/videos/');
  console.log('================================================================\n');

  const startTime = Date.now();
  let browser;
  let context;
  let page;
  let rawVideoPath = null;
  const finalVideoName = 'thriveloop_full_demo.webm';
  const finalVideoPath = path.join(videosDir, finalVideoName);

  try {
    // Launch Chrome using the system channel
    browser = await chromium.launch({
      channel: 'chrome',
      headless: true
    });

    context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      recordVideo: {
        dir: videosDir,
        size: { width: 1280, height: 800 }
      }
    });

    page = await context.newPage();

    // Catch any console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const txt = msg.text();
        if (!txt.includes('favicon') && !txt.includes('404')) {
          consoleErrors.push(txt);
        }
      }
    });

    // -------------------------------------------------------------
    // STEP 1 — Open ThriveLoop Homepage / Login
    // -------------------------------------------------------------
    console.log('▶ STEP 1: Opening ThriveLoop at http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(3000); // Hold for viewer comprehension

    // -------------------------------------------------------------
    // STEP 2 — Login with Employee Demo Account
    // -------------------------------------------------------------
    console.log('▶ STEP 2: Authenticating as Alex Morgan (Demo Employee)...');
    const quickAlexBtn = page.locator('button:has-text("Alex (Employee)")');
    if (await quickAlexBtn.isVisible().catch(() => false)) {
      await quickAlexBtn.hover();
      await page.waitForTimeout(500);
      await quickAlexBtn.click();
    } else {
      await page.fill('input[type="email"]', 'alex@acme.com');
      await page.waitForTimeout(300);
      await page.fill('input[type="password"]', 'password123');
      await page.waitForTimeout(300);
      await page.click('button[type="submit"]');
    }
    await page.waitForTimeout(3000); // Allow dashboard animation to settle

    // -------------------------------------------------------------
    // STEP 3 — Employee Dashboard & Concentric Vitality Rings
    // -------------------------------------------------------------
    console.log('▶ STEP 3: Displaying Vitality Rings and rolling telemetry...');
    // Scroll slightly to feature the rings
    await page.mouse.wheel(0, 150);
    await page.waitForTimeout(3500); // Keep screen visible for 3.5 seconds

    // -------------------------------------------------------------
    // STEP 4 — Smartwatch Sync (Simulated BLE Handshake)
    // -------------------------------------------------------------
    console.log('▶ STEP 4: Opening Smartwatch Sync Modal (Simulated)...');
    const syncBtn = page.locator('button:has-text("Sync Smartwatch")');
    await syncBtn.hover();
    await page.waitForTimeout(600);
    await syncBtn.click();
    await page.waitForTimeout(2000); // Show modal with Apple Watch, Oura, Whoop

    // Trigger telemetry sync
    console.log('▶ STEP 4b: Ingesting biometric stream via BLE handshake...');
    const syncActionBtn = page.locator('button:has-text("Synchronize Telemetry Now")');
    await syncActionBtn.click();
    await page.waitForTimeout(3000); // Wait for the animated 4-stage BLE handshake

    // Close modal
    const doneBtn = page.locator('button:has-text("Done")');
    if (await doneBtn.isVisible().catch(() => false)) {
      await doneBtn.hover();
      await page.waitForTimeout(500);
      await doneBtn.click();
    }
    await page.waitForTimeout(2000);

    // -------------------------------------------------------------
    // STEP 5 — Autonomous Rescue Page
    // -------------------------------------------------------------
    console.log('▶ STEP 5: Navigating to Rescue & Workplace Nudge...');
    const rescueNav = page.locator('aside button:has-text("Rescue")');
    await rescueNav.hover();
    await page.waitForTimeout(400);
    await rescueNav.click();
    await page.waitForTimeout(2500);

    // Scroll to feature the Slack card
    await page.mouse.wheel(0, 250);
    await page.waitForTimeout(2500);

    // -------------------------------------------------------------
    // STEP 6 — Accept Micro-Walk Autonomous Intervention
    // -------------------------------------------------------------
    console.log('▶ STEP 6: Accepting 3-Min Micro-Walk in Slack bot card...');
    const acceptWalkBtn = page.locator('button:has-text("Accept 3-Min Micro-Walk")');
    if (await acceptWalkBtn.isVisible().catch(() => false)) {
      await acceptWalkBtn.hover();
      await page.waitForTimeout(600);
      await acceptWalkBtn.click();
    }
    await page.waitForTimeout(3500); // Show accepted state and updated squad momentum

    // -------------------------------------------------------------
    // STEP 7 — HR Analytics Overview
    // -------------------------------------------------------------
    console.log('▶ STEP 7: Navigating to HR Analytics Overview...');
    const hrOverviewNav = page.locator('aside button:has-text("Overview")');
    await hrOverviewNav.hover();
    await page.waitForTimeout(400);
    await hrOverviewNav.click();
    await page.waitForTimeout(3500); // View 5 KPI cards and trend line charts

    // -------------------------------------------------------------
    // STEP 8 — Program Impact / Cohort Energy Heatmap
    // -------------------------------------------------------------
    console.log('▶ STEP 8: Navigating to Program Impact & Cohort Heatmap...');
    const impactNav = page.locator('aside button:has-text("Impact")');
    if (await impactNav.isVisible().catch(() => false)) {
      await impactNav.click();
    } else {
      await page.goto('http://localhost:5173/#impact');
    }
    await page.waitForTimeout(2000);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(3500); // View 5-Day x 5-Hour energy heatmap matrix

    // -------------------------------------------------------------
    // STEP 9 — Enterprise ROI Modeler & Presets
    // -------------------------------------------------------------
    console.log('▶ STEP 9: Navigating to Boardroom ROI Modeler & Presets...');
    const roiNav = page.locator('aside button:has-text("ROI")');
    if (await roiNav.isVisible().catch(() => false)) {
      await roiNav.click();
    } else {
      await page.goto('http://localhost:5173/#roi');
    }
    await page.waitForTimeout(2000);

    const enterpriseBtn = page.locator('button:has-text("Enterprise (500 staff)")');
    if (await enterpriseBtn.isVisible().catch(() => false)) {
      await enterpriseBtn.hover();
      await page.waitForTimeout(600);
      await enterpriseBtn.click();
    }
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(3500); // Show calculated $1.4M savings and waterfall

    // -------------------------------------------------------------
    // STEP 10 — Trigger Boardroom PDF / Print Export
    // -------------------------------------------------------------
    console.log('▶ STEP 10: Triggering Boardroom PDF / Print Export...');
    // Intercept print dialog in headless browser
    await page.evaluate(() => {
      window._mockPrintCalled = false;
      window.print = () => { window._mockPrintCalled = true; };
    });
    const exportPdfBtn = page.locator('button:has-text("Export Boardroom PDF")');
    if (await exportPdfBtn.isVisible().catch(() => false)) {
      await exportPdfBtn.hover();
      await page.waitForTimeout(600);
      await exportPdfBtn.click();
      await page.waitForTimeout(2000);
    }

    // -------------------------------------------------------------
    // STEP 11 — Responsive Mobile Layout
    // -------------------------------------------------------------
    console.log('▶ STEP 11: Showcasing Responsive Mobile Layout...');
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14 dimensions
    await page.waitForTimeout(1500);
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(2500);

    console.log('\n✅ All steps completed. Finalizing video stream encoding...');

  } catch (err) {
    console.error('Fatal recording error:', err);
  } finally {
    if (page && page.video()) {
      try {
        rawVideoPath = await page.video().path();
      } catch (e) {}
    }
    if (context) await context.close();
    if (browser) await browser.close();

    // Verify and rename video to standardized final name
    if (rawVideoPath && fs.existsSync(rawVideoPath)) {
      try {
        if (fs.existsSync(finalVideoPath)) {
          fs.unlinkSync(finalVideoPath);
        }
        fs.copyFileSync(rawVideoPath, finalVideoPath);
        try { fs.unlinkSync(rawVideoPath); } catch (e) {}
      } catch (e) {
        console.warn('Rename error:', e);
      }
    }

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
    const videoExists = fs.existsSync(finalVideoPath);
    let fileSizeKb = 0;
    if (videoExists) {
      fileSizeKb = Math.round(fs.statSync(finalVideoPath).size / 1024);
    }

    console.log('\n================================================================');
    console.log(`🎬 VIDEO RECORDING RESULT:`);
    console.log(`   Video Created: ${videoExists ? 'YES' : 'NO'}`);
    console.log(`   Exact Path:    ${finalVideoPath}`);
    console.log(`   Format:        WebM Video (VP8/VP9)`);
    console.log(`   File Size:     ${fileSizeKb} KB`);
    console.log(`   Wall Duration: ${durationSec}s`);
    console.log('================================================================\n');
  }
}

recordThriveLoopDemo().catch(err => {
  console.error('Recording script failure:', err);
  process.exit(1);
});
