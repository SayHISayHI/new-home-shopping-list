<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import StarRating from './components/StarRating.vue';
import { saveAs } from 'file-saver';

interface Item {
  id: string;
  name: string;
  importance: number;
  completed: boolean;
}

interface Category {
  id: string;
  name: string;
  items: Item[];
}

const defaultData: Category[] = [
  {
    id: 'bedroom-bedding',
    name: '卧室床品 · THE SLEEP CHAMBER',
    items: [
      { id: 'mattress-protector', name: '床垫保护套', importance: 4.5, completed: false },
      { id: 'fitted-sheet', name: '床单 / 床笠 ×2', importance: 5, completed: false },
      { id: 'duvet', name: '被芯', importance: 5, completed: false },
      { id: 'duvet-cover', name: '被套 ×2', importance: 5, completed: false },
      { id: 'pillow', name: '枕芯 ×2', importance: 5, completed: false },
      { id: 'pillowcase', name: '枕套 ×2', importance: 5, completed: false },
      { id: 'mattress-topper', name: '床褥 / 垫被', importance: 4, completed: false },
      { id: 'cushion', name: '抱枕 / 靠垫', importance: 3, completed: false },
      { id: 'mosquito-net', name: '蚊帐', importance: 2, completed: false }
    ]
  },
  {
    id: 'kitchen-utensils',
    name: '厨房用具 · THE CULINARY STUDIO',
    items: [
      { id: 'wok', name: '炒锅', importance: 5, completed: false },
      { id: 'frying-pan', name: '平底锅', importance: 4, completed: false },
      { id: 'rice-cooker', name: '电饭煲', importance: 5, completed: false },
      { id: 'chef-knife', name: '菜刀', importance: 5, completed: false },
      { id: 'cutting-board', name: '砧板', importance: 5, completed: false },
      { id: 'spatula', name: '锅铲', importance: 5, completed: false },
      { id: 'ladle', name: '汤勺', importance: 5, completed: false },
      { id: 'strainer', name: '漏勺', importance: 3.5, completed: false },
      { id: 'peeler', name: '削皮器', importance: 4.5, completed: false },
      { id: 'colander', name: '洗菜盆 / 沥水篮', importance: 4, completed: false },
      { id: 'spice-jars', name: '调料瓶罐套装', importance: 4, completed: false },
      { id: 'oven-glove', name: '隔热手套 / 锅垫', importance: 3.5, completed: false }
    ]
  },
  {
    id: 'dining-tableware',
    name: '餐饮餐具 · THE DINING COLLECTION',
    items: [
      { id: 'rice-bowl', name: '饭碗 ×4', importance: 5, completed: false },
      { id: 'plate', name: '盘子 ×4', importance: 5, completed: false },
      { id: 'soup-bowl', name: '汤碗 ×2', importance: 4, completed: false },
      { id: 'chopsticks', name: '筷子 ×4 双', importance: 5, completed: false },
      { id: 'spoon', name: '勺子 ×4', importance: 5, completed: false },
      { id: 'water-cup', name: '水杯 ×2', importance: 5, completed: false },
      { id: 'kettle', name: '电热水壶', importance: 5, completed: false },
      { id: 'placemat', name: '餐垫 / 桌布', importance: 3, completed: false }
    ]
  },
  {
    id: 'bathroom',
    name: '卫浴用品 · THE RITUAL ROOM',
    items: [
      { id: 'bath-towel', name: '浴巾 ×2', importance: 5, completed: false },
      { id: 'face-towel', name: '毛巾 / 面巾 ×2', importance: 5, completed: false },
      { id: 'bath-mat', name: '防滑垫', importance: 4, completed: false },
      { id: 'toilet-brush', name: '马桶刷 / 洁厕套装', importance: 5, completed: false },
      { id: 'wash-rack', name: '洗漱收纳架', importance: 4, completed: false },
      { id: 'soap-dispenser', name: '肥皂盒 / 皂液器', importance: 4, completed: false },
      { id: 'bath-slippers', name: '浴室拖鞋 ×2', importance: 4, completed: false },
      { id: 'drain-filter', name: '地漏过滤网', importance: 3, completed: false }
    ]
  },
  {
    id: 'cleaning',
    name: '清洁工具 · THE PURITY ORDER',
    items: [
      { id: 'broom', name: '扫帚 / 簸箕套装', importance: 5, completed: false },
      { id: 'mop', name: '拖把', importance: 5, completed: false },
      { id: 'cleaning-rag', name: '抹布 ×多条', importance: 5, completed: false },
      { id: 'dish-soap', name: '洗洁精', importance: 5, completed: false },
      { id: 'laundry-detergent', name: '洗衣液', importance: 5, completed: false },
      { id: 'toilet-cleaner', name: '洁厕剂', importance: 4.5, completed: false },
      { id: 'trash-bags', name: '垃圾袋', importance: 5, completed: false },
      { id: 'trash-cans', name: '垃圾桶（各房间）', importance: 5, completed: false }
    ]
  },
  {
    id: 'storage',
    name: '收纳整理 · THE ORGANIZATION',
    items: [
      { id: 'hangers', name: '衣架 ×10+', importance: 5, completed: false },
      { id: 'pants-hanger', name: '裤架 ×5', importance: 3.5, completed: false },
      { id: 'storage-box', name: '收纳箱 ×多个', importance: 4, completed: false },
      { id: 'vacuum-bag', name: '真空压缩袋', importance: 4, completed: false },
      { id: 'shoe-rack', name: '鞋架', importance: 4, completed: false },
      { id: 'adhesive-hook', name: '挂钩 / 粘钩 ×多个', importance: 4, completed: false },
      { id: 'laundry-basket', name: '脏衣篮', importance: 4, completed: false },
      { id: 'kitchen-rack', name: '厨房置物架', importance: 4, completed: false }
    ]
  },
  {
    id: 'home-daily',
    name: '家居日用 · THE DAILY ESSENTIALS',
    items: [
      { id: 'slippers', name: '拖鞋（室内）', importance: 5, completed: false },
      { id: 'scissors', name: '剪刀', importance: 4, completed: false },
      { id: 'power-strip', name: '插线板 ×2', importance: 5, completed: false },
      { id: 'toilet-paper', name: '卷纸 / 抽纸', importance: 5, completed: false },
      { id: 'umbrella', name: '雨伞', importance: 3.5, completed: false },
      { id: 'full-mirror', name: '全身镜', importance: 3.5, completed: false },
      { id: 'doormat', name: '入户地垫 / 门垫', importance: 4, completed: false },
      { id: 'charger', name: '手机充电器 / 数据线', importance: 5, completed: false }
    ]
  }
];

const categories = ref<Category[]>([]);
const activeCategoryId = ref('');

onMounted(() => {
  const saved = localStorage.getItem('shopping-list-data-couture');
  if (saved) {
    try {
      categories.value = JSON.parse(saved);
    } catch (e) {
      categories.value = defaultData;
    }
  } else {
    categories.value = defaultData;
  }
  if (categories.value.length > 0) {
    activeCategoryId.value = categories.value[0].id;
  }
});

watch(categories, (newVal) => {
  localStorage.setItem('shopping-list-data-couture', JSON.stringify(newVal));
}, { deep: true });

const activeCategory = () => categories.value.find(c => c.id === activeCategoryId.value);

const addItem = () => {
  const cat = activeCategory();
  if (cat) cat.items.push({ id: Date.now().toString(), name: '', importance: 3, completed: false });
};

const removeItem = (id: string) => {
  const cat = activeCategory();
  if (cat) cat.items = cat.items.filter(item => item.id !== id);
};

const exportJSON = () => {
  const blob = new Blob([JSON.stringify(categories.value, null, 2)], { type: 'application/json' });
  saveAs(blob, `Couture_Archive_${new Date().toISOString().slice(0, 10)}.json`);
};

const importJSON = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        categories.value = JSON.parse(ev.target?.result as string);
        if (categories.value.length > 0) activeCategoryId.value = categories.value[0].id;
      } catch (err) { alert('Invalid File Format'); }
    };
    reader.readAsText(file);
  }
};

/**
 * Atelier Haute-Couture Artisan Renderer
 * Focusing on micro-proportions and tactile harmony.
 */
const exportImage = async () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  const width = 1400; // Ultra high res
  const margin = 180;
  let y = 240;

  // Pre-calculate height
  let totalHeight = y + 100;
  categories.value.forEach(cat => {
    if (cat.items.length === 0) return;
    totalHeight += 140 + cat.items.length * 80;
  });
  totalHeight += 300;

  canvas.width = width;
  canvas.height = totalHeight;

  // 1. Aged Silk Base Texture
  ctx.fillStyle = '#f2ede4';
  ctx.fillRect(0, 0, width, totalHeight);
  
  // High-fidelity noise & grain
  for(let i=0; i<600000; i++) {
    const px = Math.random()*width, py = Math.random()*totalHeight;
    ctx.fillStyle = `rgba(0,0,0,${Math.random()*0.06})`;
    ctx.fillRect(px, py, 1, 1);
  }

  // 2. Proportional Typography
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1c1c1c';
  
  // Title: Balanced tracking
  ctx.font = '300 68px "Noto Serif SC", serif';
  ctx.fillText('新 居 采 购 清 单', width/2, y);
  
  y += 60;
  ctx.font = 'italic 200 20px "Noto Serif SC", serif';
  ctx.fillStyle = '#a67c52';
  ctx.fillText('A curated collection for the modern sanctuary', width/2, y);

  y += 140;

  // 3. Artisanal List Rendering
  categories.value.forEach(cat => {
    if (cat.items.length === 0) return;

    ctx.textAlign = 'center';
    ctx.fillStyle = '#1c1c1c';
    ctx.font = '700 32px "Noto Serif SC", serif';
    ctx.fillText(`—  ${cat.name.split(' · ')[0]}  —`, width/2, y);
    
    y += 100;

    cat.items.forEach(item => {
      const isComp = item.completed;
      ctx.globalAlpha = isComp ? 0.3 : 1;

      // Item Name - Left Aligned in the central column
      ctx.textAlign = 'left';
      ctx.font = '300 28px "Noto Serif SC", serif';
      ctx.fillStyle = '#1c1c1c';
      const name = item.name || 'Untitled Entry';
      const nameX = margin + 100;
      ctx.fillText(name, nameX, y);

      const tw = ctx.measureText(name).width;
      
      // Artisanal Strike
      if (isComp) {
        ctx.strokeStyle = 'rgba(166, 124, 82, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(nameX, y - 8);
        ctx.lineTo(nameX + tw, y - 10);
        ctx.stroke();
      }

      // Stars - Right Aligned
      ctx.textAlign = 'right';
      ctx.font = '24px serif';
      ctx.fillStyle = '#a67c52';
      const stars = '✦'.repeat(Math.floor(item.importance)) + (item.importance % 1 !== 0 ? '✧' : '');
      ctx.fillText(stars, width - margin - 100, y);

      // Fine Leader Line
      ctx.strokeStyle = 'rgba(28, 28, 28, 0.05)';
      ctx.setLineDash([1, 4]);
      ctx.beginPath();
      ctx.moveTo(nameX + tw + 30, y - 8);
      ctx.lineTo(width - margin - 100 - ctx.measureText(stars).width - 30, y - 8);
      ctx.stroke();
      ctx.setLineDash([]);

      y += 80;
      ctx.globalAlpha = 1;
    });
    y += 60;
  });

  // Footer
  ctx.textAlign = 'center';
  ctx.font = '200 18px "Noto Serif SC", serif';
  ctx.fillStyle = '#a67c52';
  ctx.fillText('“ 所有的美好，都从这个温暖的小窝开始 ”', width/2, totalHeight - 120);

  canvas.toBlob((b) => b && saveAs(b, `Atelier_Couture_List_${new Date().toISOString().slice(0,10)}.png`));
};
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-16 md:py-24 min-h-screen">
    
    <!-- Proportional Editorial Header -->
    <header class="flex flex-col items-center mb-24 text-center">
      <h1 class="text-4xl md:text-5xl font-light tracking-[0.25em] text-ink-deep mb-6">
        新居采购
      </h1>
      <p class="text-xs tracking-[0.15em] uppercase text-copper italic mb-12">
        A curated collection for the modern sanctuary
      </p>
      
      <div class="flex items-center space-x-12 text-[10px] tracking-[0.3em] uppercase text-gray-400">
        <button @click="exportImage" class="hover:text-ink-deep transition-all duration-700 hover:tracking-[0.4em]">Capture</button>
        <button @click="exportJSON" class="hover:text-ink-deep transition-all duration-700 hover:tracking-[0.4em]">Archival</button>
        <label class="cursor-pointer hover:text-ink-deep transition-all duration-700 hover:tracking-[0.4em]">
          Restore
          <input type="file" class="hidden" @change="importJSON" />
        </label>
      </div>
    </header>

    <!-- Balanced Spacing Navigation -->
    <nav class="flex flex-wrap justify-center gap-x-10 gap-y-6 mb-20 pb-6 border-b border-gray-200/30">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        @click="activeCategoryId = cat.id"
        class="text-sm tracking-[0.2em] transition-all duration-700 relative py-2"
        :class="activeCategoryId === cat.id ? 'text-ink-deep font-bold scale-105' : 'text-gray-300 hover:text-gray-500'"
      >
        {{ cat.name.split(' · ')[0] }}
        <div v-if="activeCategoryId === cat.id" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px bg-copper"></div>
      </button>
    </nav>

    <!-- Couture Canvas: Harmonious Column -->
    <main class="couture-paper p-10 md:p-20 rounded-sm">
      <div v-if="activeCategory()" class="space-y-20">
        
        <div class="text-center">
          <h2 class="text-xl font-bold tracking-[0.4em] text-ink-deep">
            — {{ activeCategory()?.name.split(' · ')[0] }} —
          </h2>
        </div>

        <div class="space-y-4">
          <div v-for="item in activeCategory()?.items" :key="item.id" 
               class="group flex items-center justify-between py-6 border-b border-ink-deep/5 transition-all duration-700 hover:bg-white/40 px-4 -mx-4 rounded-sm">
            
            <div class="flex items-center flex-1 min-w-0 pr-8">
              <button @click="item.completed = !item.completed" class="mr-10 transition-all duration-700 hover:scale-125">
                <span class="text-xl" :class="item.completed ? 'text-copper' : 'text-gray-200'">
                  {{ item.completed ? '✦' : '✧' }}
                </span>
              </button>

              <input 
                v-model="item.name"
                type="text"
                placeholder="RECORD AN ITEM"
                class="flex-1 min-w-0 bg-transparent border-none outline-none text-xl font-light tracking-tight transition-all duration-1000"
                :class="item.completed ? 'ink-bleed completed' : 'text-ink-deep'"
              />
            </div>

            <div class="flex items-center gap-10">
              <div class="opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                <StarRating v-model="item.importance" />
              </div>

              <button @click="removeItem(item.id)" 
                      class="opacity-0 group-hover:opacity-100 text-[9px] tracking-[0.2em] text-gray-300 hover:text-red-400 transition-all duration-700">
                DISCARD
              </button>
            </div>
          </div>

          <button 
            @click="addItem"
            class="w-full text-center py-16 text-[11px] tracking-[0.5em] text-gray-300 hover:text-copper transition-all duration-1000 uppercase italic font-light"
          >
            + Add to the sanctuary
          </button>
        </div>
      </div>
    </main>

    <footer class="mt-40 text-center space-y-10">
      <p class="text-gray-300 italic text-lg font-light">
        “ 所有的美好，都从这个温暖的小窝开始 ”
      </p>
      <div class="flex flex-col items-center space-y-4">
        <div class="w-10 h-px bg-copper/20"></div>
        <p class="text-[8px] tracking-[0.6em] text-gray-300 uppercase">
          Atelier Domestic Archive — Release 2025
        </p>
      </div>
    </footer>
  </div>
</template>

<style>
input::placeholder {
  color: rgba(28, 28, 28, 0.05);
  font-weight: 200;
}
</style>
