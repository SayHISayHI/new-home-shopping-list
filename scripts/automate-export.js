import { chromium } from 'playwright';
import path from 'path';

(async () => {
  console.log('正在启动“Gallery Edition”画廊版自动化导出流程...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const url = 'http://localhost:5173/'; // Standard Vite port, or check yours
  console.log(`正在访问 ${url}...`);
  
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    
    console.log('页面已加载，正在捕获画廊版清单...');
    
    // Trigger the export function: button text is "Capture"
    const exportButton = page.locator('button:has-text("Capture")');
    
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    
    const download = await downloadPromise;
    const downloadPath = path.join(process.cwd(), '画廊版_新居采购清单.png');
    await download.saveAs(downloadPath);
    
    console.log(`成功！画廊版清单已保存至: ${downloadPath}`);
    
    // Debug screenshot for the new gallery layout
    await page.setViewportSize({ width: 1200, height: 1800 });
    await page.screenshot({ path: 'gallery_ui_view.png', fullPage: true });
    console.log('已生成画廊版 UI 调试截图: gallery_ui_view.png');

  } catch (error) {
    console.error('自动化流程出错:', error);
  } finally {
    await browser.close();
    process.exit(0);
  }
})();
