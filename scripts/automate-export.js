import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

(async () => {
  console.log('正在启动“Atelier Haute-Couture”高定版自动化导出流程...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const url = 'http://localhost:5174/';
  console.log(`正在访问 ${url}...`);
  
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    
    console.log('页面已加载，正在捕获高定手稿清单...');
    
    // Trigger the export function: button text is "Capture"
    const exportButton = page.locator('button:has-text("Capture")');
    
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    
    const download = await downloadPromise;
    const downloadPath = path.join(process.cwd(), '高定手稿_新居采购清单.png');
    await download.saveAs(downloadPath);
    
    console.log(`成功！高定手稿已保存至: ${downloadPath}`);
    
    // Debug screenshot for the new layout
    await page.setViewportSize({ width: 1200, height: 1800 });
    await page.screenshot({ path: 'couture_ui_view.png', fullPage: true });
    console.log('已生成高定版 UI 调试截图: couture_ui_view.png');

  } catch (error) {
    console.error('自动化流程出错:', error);
  } finally {
    await browser.close();
    process.exit(0);
  }
})();
