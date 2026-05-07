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
    id: 'c1',
    name: '卧室 / THE SLEEP CHAMBER',
    items: [
      { id: '1', name: '舒适床垫 (保护脊椎)', importance: 5, completed: false },
      { id: '2', name: '全棉四件套 (两套轮换)', importance: 5, completed: false },
      { id: '3', name: '护颈枕头 (一对)', importance: 5, completed: false },
      { id: '4', name: '防滑衣架 (30-50个)', importance: 4.5, completed: false },
    ]
  },
  {
    id: 'c2',
    name: '卫浴 / THE RITUAL ROOM',
    items: [
      { id: '5', name: '吸水毛巾/浴巾', importance: 5, completed: false },
      { id: '6', name: '洗漱杯/牙刷挂架', importance: 4, completed: false },
      { id: '7', name: '沐浴露/洗发水/护发素', importance: 4.5, completed: false },
    ]
  },
  {
    id: 'c3',
    name: '餐厨 / THE CULINARY STUDIO',
    items: [
      { id: '8', name: '多功能炒锅 (含盖)', importance: 5, completed: false },
      { id: '9', name: '碗筷/勺子/叉子套装', importance: 5, completed: false },
      { id: '10', name: '硅胶保鲜盒 (分装食物)', importance: 3.5, completed: false },
    ]
  },
  {
    id: 'c4',
    name: '清洁 / THE PURITY ORDER',
    items: [
      { id: '11', name: '扫把/簸箕/拖把组合', importance: 5, completed: false },
      { id: '12', name: '大容量垃圾桶 (客厅)', importance: 4, completed: false },
    ]
  }
];

const categories = ref<Category[]>([]);
const activeCategoryId = ref('');

onMounted(() => {
  const saved = localStorage.getItem('shopping-list-data-gallery');
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
  localStorage.setItem('shopping-list-data-gallery', JSON.stringify(newVal));
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
  saveAs(blob, `Gallery_Backup_${new Date().toISOString().slice(0, 10)}.json`);
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
 * Gallery Edition Renderer
 */
const exportImage = async () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  const width = 1000;
  const margin = 120;
  let y = 180;

  // Height calc
  let totalHeight = y + 100;
  categories.value.forEach(cat => {
    if (cat.items.length === 0) return;
    totalHeight += 100 + cat.items.length * 60;
  });
  totalHeight += 150;

  canvas.width = width;
  canvas.height = totalHeight;

  // Palette: Broken Linen Base
  ctx.fillStyle = '#faf9f6';
  ctx.fillRect(0, 0, width, totalHeight);
  
  // Paper texture / grain
  for(let i=0; i<400000; i++) {
    const px = Math.random()*width, py = Math.random()*totalHeight;
    ctx.fillStyle = `rgba(0,0,0,${Math.random()*0.03})`;
    ctx.fillRect(px, py, 1, 1);
  }

  // Header - Asymmetrical
  ctx.textAlign = 'left';
  ctx.fillStyle = '#1a1a1a';
  
  ctx.font = '200 64px "Noto Serif SC", serif';
  ctx.fillText('新 居 采 购', margin, y);
  
  y += 45;
  ctx.font = '100 14px "Inter", sans-serif';
  ctx.fillStyle = '#888';
  ctx.letterSpacing = '10px';
  ctx.fillText('MUSEUM CATALOG / GALLERY EDITION', margin, y);

  y += 120;

  // Content
  categories.value.forEach((cat, idx) => {
    if (cat.items.length === 0) return;

    // Asymmetrical staggering
    const offset = idx % 2 === 0 ? 0 : 40;
    
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1a1a1a';
    ctx.font = '400 24px "Noto Serif SC", serif';
    ctx.fillText(cat.name, margin + offset, y);
    
    y += 20;
    ctx.strokeStyle = 'rgba(26, 26, 26, 0.1)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(margin + offset, y);
    ctx.lineTo(margin + offset + 60, y);
    ctx.stroke();

    y += 60;

    cat.items.forEach(item => {
      // Soft Focus effect in canvas via alpha and blur
      const isComp = item.completed;
      ctx.globalAlpha = isComp ? 0.3 : 1;
      
      ctx.textAlign = 'left';
      ctx.font = '200 18px "Inter", sans-serif';
      ctx.fillStyle = '#1a1a1a';
      const itemName = item.name || 'Untitled Entry';
      ctx.fillText(itemName, margin + offset + 20, y);

      // Minimalist Ink Marks
      ctx.textAlign = 'right';
      const markSize = 4;
      const spacing = 12;
      for(let i=0; i<5; i++) {
        ctx.beginPath();
        if (item.importance >= i + 1) {
          ctx.arc(width - margin - (4-i)*spacing, y - 6, markSize/2, 0, Math.PI*2);
          ctx.fill();
        } else {
          ctx.arc(width - margin - (4-i)*spacing, y - 6, markSize/2, 0, Math.PI*2);
          ctx.stroke();
        }
      }

      y += 60;
      ctx.globalAlpha = 1;
    });
    y += 40;
  });

  // Footer
  ctx.textAlign = 'center';
  ctx.font = '100 12px "Inter", sans-serif';
  ctx.fillStyle = '#aaa';
  ctx.letterSpacing = '4px';
  ctx.fillText('© GALLERIA DOMESTICA — ALL RIGHTS RESERVED', width/2, totalHeight - 60);

  canvas.toBlob((b) => b && saveAs(b, `Gallery_Edition_${new Date().toISOString().slice(0,10)}.png`));
};
</script>

<template>
  <div class="min-h-screen selection:bg-ink selection:text-linen-light overflow-x-hidden">
    
    <!-- Gallery Sidebar Navigation (Asymmetrical) -->
    <aside class="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col space-y-12 museum-label">
      <button 
        v-for="(cat, idx) in categories" 
        :key="cat.id"
        @click="activeCategoryId = cat.id"
        class="text-left transition-all duration-700 hover:pl-4 group"
        :class="activeCategoryId === cat.id ? 'text-ink scale-110 opacity-100' : 'opacity-40 hover:opacity-100'"
      >
        <span class="block text-[10px] mb-1">0{{ idx + 1 }}</span>
        <span class="gallery-title text-[11px] whitespace-nowrap">{{ cat.name.split('/')[0] }}</span>
      </button>
    </aside>

    <div class="max-w-5xl mx-auto px-8 lg:px-24 py-20 lg:py-32">
      
      <!-- High-End Asymmetrical Header -->
      <header class="mb-32 flex flex-col items-start relative">
        <div class="absolute -left-12 top-0 w-px h-32 bg-ink/5"></div>
        <h1 class="gallery-title text-5xl lg:text-7xl font-light text-ink mb-6 tracking-[0.4em] leading-tight">
          新居<br/>采购
        </h1>
        <div class="flex flex-col lg:flex-row lg:items-center gap-8 mt-4">
          <p class="museum-label max-w-xs">
            COLLECTION GUIDE FOR THE MODERN SANCTUARY. 
            Curation of essential objects for domestic harmony.
          </p>
          
          <nav class="flex items-center space-x-10 text-[10px] tracking-[0.3em] uppercase text-gray-400">
            <button @click="exportImage" class="hover:text-ink transition-all duration-500 hover:tracking-[0.5em]">Capture</button>
            <button @click="exportJSON" class="hover:text-ink transition-all duration-500 hover:tracking-[0.5em]">Archive</button>
            <label class="cursor-pointer hover:text-ink transition-all duration-500 hover:tracking-[0.5em]">
              Import
              <input type="file" class="hidden" @change="importJSON" />
            </label>
          </nav>
        </div>
      </header>

      <!-- Main Content: Staggered Layout -->
      <main class="relative">
        <div v-if="activeCategory()" class="asymmetric-block">
          
          <div class="mb-20">
            <h2 class="gallery-title text-sm mb-2 opacity-60 tracking-[0.6em]">{{ activeCategory()?.name }}</h2>
            <div class="w-12 h-px bg-ink/20"></div>
          </div>

          <div class="space-y-12">
            <div v-for="item in activeCategory()?.items" :key="item.id" 
                 class="group relative flex items-center justify-between transition-all duration-1000"
                 :class="{ 'item-completed': item.completed }">
              
              <!-- Completion Trigger (Soft Focus) -->
              <div class="flex items-center flex-1 min-w-0 pr-12">
                <button 
                  @click="item.completed = !item.completed" 
                  class="w-6 h-6 mr-8 flex-shrink-0 flex items-center justify-center border border-ink/10 rounded-full transition-all group-hover:border-ink/30"
                >
                  <div v-if="item.completed" class="ink-mark"></div>
                </button>

                <input 
                  v-model="item.name"
                  type="text"
                  placeholder="NEW ENTRY"
                  class="flex-1 min-w-0 bg-transparent border-none outline-none text-lg lg:text-xl font-extralight tracking-widest font-sans text-ink placeholder:text-ink/10"
                />
              </div>

              <!-- Functional Data -->
              <div class="flex items-center gap-10">
                <div class="transition-opacity duration-700 opacity-20 group-hover:opacity-100">
                  <StarRating v-model="item.importance" />
                </div>

                <button @click="removeItem(item.id)" 
                        class="opacity-0 group-hover:opacity-100 text-[10px] tracking-tighter text-gray-300 hover:text-ink transition-all">
                  REMOVE
                </button>
              </div>
            </div>

            <!-- Asymmetrical Add Button -->
            <button 
              @click="addItem"
              class="group mt-20 flex items-center space-x-4 text-[11px] tracking-[0.4em] text-gray-400 hover:text-ink transition-all"
            >
              <span class="text-xl font-thin group-hover:rotate-90 transition-transform duration-700">+</span>
              <span class="italic uppercase">Append to Collection</span>
            </button>
          </div>
        </div>
      </main>

      <footer class="mt-48 flex flex-col items-end">
        <div class="w-24 h-px bg-ink/5 mb-8"></div>
        <p class="museum-label text-right border-l-0 border-r pr-4 pl-0">
          GALLERY EDITION VOL. 01<br/>
          DOMESTIC CURATION ENGINE<br/>
          STABLE_RELEASE_2025
        </p>
      </footer>
    </div>
  </div>
</template>

<style>
/* Custom cursor or other high-end effects */
body {
  cursor: crosshair;
}

input::placeholder {
  font-weight: 100;
  letter-spacing: 0.5em;
}

/* Transitions for soft focus */
.item-completed input {
  pointer-events: none;
}
</style>
