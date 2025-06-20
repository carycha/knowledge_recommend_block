const mockData = {
    products: {
        'current-product': { name: '當前商品 (Product)', relatedTags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'] },
    },
    tags: {
        'tag1': { name: '戶外機能', description: '專為戶外活動設計，注重耐用性與功能性。', storyboards: ['storyboardA', 'storyboardB'] },
        'tag2': { name: '高CP值', description: '性價比高，兼顧品質與價格。', storyboards: ['storyboardC'] },
        'tag3': { name: '人氣熱銷', description: '廣受好評，市場熱銷款式。', storyboards: ['storyboardA', 'storyboardC'] },
        'tag4': { name: '專業評測', description: '經過專業人士推薦與測試。', storyboards: ['storyboardB'] },
        'tag5': { name: '新手入門', description: '適合初學者，操作簡易。', storyboards: ['storyboardD'] },
        // Tags previously in HTML trail, now just part of mock data if needed elsewhere or for testing
        'tagX': { name: '戶外攝影', description: '捕捉戶外美景的攝影器材。', storyboards: ['storyboardA'] },
        'tagY': { name: '防水相機包', description: '保護您的相機不受潮濕影響。', storyboards: ['storyboardB'] },
        'tagZ': { name: '星空攝影', description: '拍攝美麗夜空的專用設備。', storyboards: ['storyboardC'] }
    },
    storyboards: {
        'storyboardA': {
            image: 'https://via.placeholder.com/600x300?text=Storyboard+A+(戶外)',
            caption: '情境A：帶著裝備去山野，享受自然風光。',
            hotspots: [{ text: '相機', top: '30%', left: '20%' }, { text: '登山杖', top: '50%', left: '60%' }]
        },
        'storyboardB': {
            image: 'https://via.placeholder.com/600x300?text=Storyboard+B+(防水)',
            caption: '情境B：雨天出行無憂，裝備全面防水。',
            hotspots: [{ text: '防水背包', top: '40%', left: '30%' }, { text: '雨衣', top: '60%', left: '70%' }]
        },
        'storyboardC': {
            image: 'https://via.placeholder.com/600x300?text=Storyboard+C+(CP值)',
            caption: '情境C：經濟實惠，功能不打折。',
            hotspots: [{ text: '耳機', top: '35%', left: '25%' }, { text: '行動電源', top: '55%', left: '65%' }]
        },
         'storyboardD': {
            image: 'https://via.placeholder.com/600x300?text=Storyboard+D+(新手)',
            caption: '情境D：新手友好，快速上手體驗。',
            hotspots: [{ text: '智能手錶', top: '40%', left: '20%' }, { text: '教學書籍', top: '60%', left: '50%' }]
        }
    }
};

let currentTrail = [];
const MAX_TRAIL_ITEMS = 5;
let currentStoryboardSlideIndex = 0;
let activeStoryboards = []; // This will hold IDs of storyboards for the current tag

document.addEventListener('DOMContentLoaded', () => {
    // Element Selectors
    const centralProductNode = document.querySelector('.central-product-node');
    const exploreTags = document.querySelectorAll('.explore-tag');
    const contextualStoryboardSection = document.getElementById('contextual-storyboard');
    const storyboardSlidesContainer = document.querySelector('.storyboard-slides-container');
    const prevSlideButton = document.querySelector('.prev-slide');
    const nextSlideButton = document.querySelector('.next-slide');
    const exploreTrailList = document.querySelector('.explore-trail-list');

    // Initial State
    contextualStoryboardSection.style.display = 'none';
    if (centralProductNode && mockData.products['current-product']) {
      centralProductNode.textContent = mockData.products['current-product'].name;
    }

    // --- Explore View Navigator ---
    exploreTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const tagId = tag.dataset.tagId;
            if (!mockData.tags[tagId]) {
                console.error('Tag data not found for:', tagId);
                return;
            }
            centralProductNode.textContent = mockData.tags[tagId].name;
            updateContextualStoryboard(tagId);
            addToExploreTrail(tagId);
        });
    });

    // --- Contextual Storyboard ---
    function updateContextualStoryboard(tagId) {
        if (!mockData.tags[tagId] || !mockData.tags[tagId].storyboards || mockData.tags[tagId].storyboards.length === 0) {
            contextualStoryboardSection.style.display = 'none';
            activeStoryboards = []; // Clear active storyboards
            return;
        }
        activeStoryboards = mockData.tags[tagId].storyboards;
        contextualStoryboardSection.style.display = 'block';
        renderStoryboards(activeStoryboards);
    }

    function renderStoryboards(storyboardIds) {
        storyboardSlidesContainer.innerHTML = ''; // Clear existing slides
        currentStoryboardSlideIndex = 0;

        if (!storyboardIds || storyboardIds.length === 0) {
            contextualStoryboardSection.style.display = 'none'; // Hide if no storyboards
            return;
        }
        contextualStoryboardSection.style.display = 'block';


        storyboardIds.forEach(sbId => {
            const sbData = mockData.storyboards[sbId];
            if (!sbData) {
                console.error('Storyboard data not found for ID:', sbId);
                return;
            }

            const slideDiv = document.createElement('div');
            slideDiv.classList.add('storyboard-slide');
            slideDiv.innerHTML = `
                <div class="slide-image-container">
                    <img src="${sbData.image}" alt="${sbData.caption.substring(0, 30)}...">
                    <div class="storyboard-hotspots">
                        ${sbData.hotspots.map(h => `<button class="hotspot" style="top: ${h.top}; left: ${h.left};" data-hotspot-text="${h.text}">${h.text}</button>`).join('')}
                    </div>
                </div>
                <div class="storyboard-caption">${sbData.caption}</div>
            `;
            storyboardSlidesContainer.appendChild(slideDiv);
        });

        storyboardSlidesContainer.querySelectorAll('.hotspot').forEach(hotspot => {
            hotspot.addEventListener('click', (e) => {
                e.stopPropagation();
                alert(`熱點 "${hotspot.dataset.hotspotText}" 被點擊!`);
            });
        });

        if (storyboardIds.length > 0) {
            showStoryboardSlide(0);
        }
    }

    function showStoryboardSlide(index) {
        const slides = storyboardSlidesContainer.querySelectorAll('.storyboard-slide');
        if (!slides || slides.length === 0) {
             // No slides to show, perhaps hide controls or container
            prevSlideButton.style.display = 'none';
            nextSlideButton.style.display = 'none';
            return;
        }

        prevSlideButton.style.display = slides.length > 1 ? 'block' : 'none';
        nextSlideButton.style.display = slides.length > 1 ? 'block' : 'none';

        storyboardSlidesContainer.style.transform = `translateX(-${index * 100}%)`;
        currentStoryboardSlideIndex = index;
    }

    prevSlideButton.addEventListener('click', () => {
        if (activeStoryboards.length === 0) return;
        let newIndex = currentStoryboardSlideIndex - 1;
        if (newIndex < 0) {
            newIndex = activeStoryboards.length - 1; // Loop to last
        }
        showStoryboardSlide(newIndex);
    });

    nextSlideButton.addEventListener('click', () => {
        if (activeStoryboards.length === 0) return;
        let newIndex = currentStoryboardSlideIndex + 1;
        if (newIndex >= activeStoryboards.length) {
            newIndex = 0; // Loop to first
        }
        showStoryboardSlide(newIndex);
    });


    // --- User Explore Trail ---
    function addToExploreTrail(tagId) {
        if (currentTrail.length > 0 && currentTrail[currentTrail.length - 1] === tagId) {
            return; // Avoid adding consecutive duplicates
        }

        // If tagId is already in trail, remove it and all items after it, then add it to the end.
        // This makes clicking an old trail item restart the trail from that point.
        const existingIndex = currentTrail.indexOf(tagId);
        if (existingIndex !== -1) {
            currentTrail = currentTrail.slice(0, existingIndex);
        }

        currentTrail.push(tagId);
        if (currentTrail.length > MAX_TRAIL_ITEMS) {
            currentTrail.shift();
        }
        renderExploreTrail();
    }

    function renderExploreTrail() {
        exploreTrailList.innerHTML = '';
        currentTrail.forEach(tagId => {
            if (!mockData.tags[tagId]) {
                console.error('Tag data for trail item not found:', tagId);
                return;
            }

            const trailItem = document.createElement('li');
            trailItem.classList.add('trail-item');
            trailItem.textContent = mockData.tags[tagId].name;
            trailItem.dataset.trailId = tagId;

            trailItem.addEventListener('click', () => {
                const clickedTagId = trailItem.dataset.trailId; // Use trailItem.dataset.trailId
                if (!mockData.tags[clickedTagId]) {
                     console.error('Clicked trail tag data not found for:', clickedTagId);
                     return;
                }
                centralProductNode.textContent = mockData.tags[clickedTagId].name;
                updateContextualStoryboard(clickedTagId);

                // When a trail item is clicked, truncate the trail up to that item and re-render.
                const itemIndexInTrail = currentTrail.indexOf(clickedTagId);
                if (itemIndexInTrail !== -1) {
                    currentTrail = currentTrail.slice(0, itemIndexInTrail + 1);
                    renderExploreTrail(); // Re-render to reflect the (potentially) truncated trail
                }
            });
            exploreTrailList.appendChild(trailItem);
        });
    }

    renderExploreTrail(); // Initial render (will be empty if currentTrail is empty)
});
