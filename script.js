// 蠟燭圖片路徑
const candleImages = {
    wood: 'images/wood_candle.png',    // 木系蠟燭
    fire: 'images/fire_candle.png',    // 火系蠟燭
    earth: 'images/earth_candle.png',  // 土系蠟燭
    metal: 'images/metal_candle.png',  // 金系蠟燭
    water: 'images/water_candle.png'   // 水系蠟燭
};

// 音樂檔案路徑
const musicFiles = [
    'audio/432hz.mp3',
    'audio/528hz.mp3', 
    'audio/639hz.mp3'
];

// 全局變量
let currentUser = null;
let dailyMantra = null;
let audioPlayer = null;
let currentTrack = null;

// 頁面導航
function showPage(pageId) {
    // 隱藏所有頁面
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // 顯示指定頁面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // 更新底部導航高亮
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // 根據頁面ID找到對應的底部導航項
    let navSelector;
    switch(pageId) {
        case 'main-page':
            navSelector = 0;
            break;
        case 'candle-page':
            navSelector = 1;
            break;
        case 'music-page':
            navSelector = 2;
            break;
        case 'mantra-page':
            navSelector = 3;
            break;
        case 'profile-page':
            navSelector = 4;
            break;
    }
    
    if (navSelector !== undefined && navItems[navSelector]) {
        navItems[navSelector].classList.add('active');
    }
}

// 頁面加載完成後執行
document.addEventListener('DOMContentLoaded', () => {
    // 初始化音頻播放器
    audioPlayer = document.getElementById('audio-player');
    
    // 檢查是否已經登入
    checkLoginStatus();
    
    // 綁定登入按鈕事件
    document.getElementById('google-login').addEventListener('click', handleGoogleLogin);
    document.getElementById('facebook-login').addEventListener('click', handleFacebookLogin);
    document.getElementById('guest-login').addEventListener('click', handleGuestLogin);
    
    // 綁定出生日期提交事件
    document.getElementById('birthdate-submit').addEventListener('click', handleBirthdateSubmit);
    
    // 綁定每日抽卡事件
    document.getElementById('daily-card-1').addEventListener('click', handleDailyCardFlip);
    
    // 綁定繼續按鈕事件
    document.getElementById('continue-to-main').addEventListener('click', () => {
        document.getElementById('daily-card-page').classList.remove('active');
        document.getElementById('app-interface').classList.remove('hidden');
        document.getElementById('candle-music-page').classList.add('active');
        
        // 加載蠟燭圖片
        loadCandleImage();
        
        // 加載今日咒語到咒語卡頁面
        loadTodayMantra();
        
        // 開始播放音樂
        startRandomMusic();
    });
    
    // 綁定計時器控制事件
    document.getElementById('start-timer').addEventListener('click', startTimer);
    document.getElementById('pause-timer').addEventListener('click', pauseTimer);
    document.getElementById('reset-timer').addEventListener('click', resetTimer);
    
    // 綁定登出事件
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
});

// 檢查登入狀態
function checkLoginStatus() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        currentUser = JSON.parse(userData);
        if (currentUser.birthdate) {
            showPage('daily-card-page');
        } else {
            showPage('birthdate-page');
        }
    } else {
        showPage('login-page');
    }
}

// 處理Google登入
function handleGoogleLogin() {
    // 這裡需要實現Google登入邏輯
    // 暫時模擬登入成功
    currentUser = {
        id: 'google_' + Date.now(),
        name: 'Google用戶',
        loginType: 'google'
    };
    localStorage.setItem('userData', JSON.stringify(currentUser));
    showPage('birthdate-page');
}

// 處理Facebook登入
function handleFacebookLogin() {
    // 這裡需要實現Facebook登入邏輯
    // 暫時模擬登入成功
    currentUser = {
        id: 'facebook_' + Date.now(),
        name: 'Facebook用戶',
        loginType: 'facebook'
    };
    localStorage.setItem('userData', JSON.stringify(currentUser));
    showPage('birthdate-page');
}

// 處理遊客登入
function handleGuestLogin() {
    currentUser = {
        id: 'guest_' + Date.now(),
        name: '訪客',
        loginType: 'guest'
    };
    localStorage.setItem('userData', JSON.stringify(currentUser));
    showPage('birthdate-page');
}

// 處理出生日期提交
function handleBirthdateSubmit() {
    const birthDateInput = document.getElementById('birth-date-input');
    const birthDate = birthDateInput.value;
    
    if (!birthDate) {
        alert('請選擇出生日期');
        return;
    }
    
    currentUser.birthdate = birthDate;
    localStorage.setItem('userData', JSON.stringify(currentUser));
    
    // 計算五行屬性
    calculateElement(birthDate);
    
    // 顯示每日抽卡頁面
    showPage('daily-card-page');
}

// 計算五行屬性
function calculateElement(birthDate) {
    // 這裡需要實現五行計算邏輯
    // 暫時使用隨機值
    const elements = ['木', '火', '土', '金', '水'];
    currentUser.element = elements[Math.floor(Math.random() * elements.length)];
    
    // 更新UI顯示
    document.getElementById('element-type').textContent = currentUser.element;
    document.getElementById('candle-color').textContent = getElementColor(currentUser.element);
    document.getElementById('oil-recommendation').textContent = getElementOil(currentUser.element);
}

// 獲取五行對應的顏色
function getElementColor(element) {
    const colors = {
        '木': '綠色',
        '火': '紅色',
        '土': '黃色',
        '金': '白色',
        '水': '藍色'
    };
    return colors[element] || '未知';
}

// 獲取五行對應的精油
function getElementOil(element) {
    const oils = {
        '木': '佛手柑',
        '火': '薰衣草',
        '土': '檀香',
        '金': '尤加利',
        '水': '茉莉'
    };
    return oils[element] || '未知';
}

// 處理每日抽卡翻轉
function handleDailyCardFlip() {
    // 獲取卡片元素
    const card = document.getElementById('daily-card-1');
    const cardContent = document.getElementById('daily-card-content');
    
    // 檢查卡片是否已翻轉
    if (!card.classList.contains('flipped')) {
        // 生成隨機咒語
        const mantra = getRandomMantra();
        
        // 僅在逗號處或文字過長時添加換行
        const formattedMantra = formatMantraWithSmartBreaks(mantra);
        cardContent.innerHTML = `<p style="font-size:2rem !important;">${formattedMantra}</p>`;
        
        // 強制重繪
        void card.offsetWidth;
        
        // 添加翻轉類
        card.classList.add('flipped');
        
        // 保存今日咒語
        dailyMantra = mantra;
        
        // 同時更新咒語卡頁面中的今日咒語
        const todayMantraContent = document.getElementById('today-mantra-content');
        if (todayMantraContent) {
            todayMantraContent.innerHTML = `<p>${formattedMantra}</p>`;
        }
        
        // 將今日咒語保存到localStorage
        localStorage.setItem('todayMantra', mantra);
    }
}

// 獲取隨機咒語
function getRandomMantra() {
    const mantras = [
        '「我信任宇宙，混亂中有禮物。」',
        '「溝通不順時，先靜心、再出聲。」',
        '「延遲只是為了讓更好發生。」',
        '「每個挑戰都是成長的機會。」',
        '「保持平靜，保持專注。」',
        '「心若向陽，無謂悲傷。」',
        '「順其自然，隨遇而安。」',
        '「靜待花開，自有芬芳。」',
        '「心之所向，素履以往。」',
        '「隨心而行，無問西東。」'
    ];
    return mantras[Math.floor(Math.random() * mantras.length)];
}

// 開始隨機播放音樂
function startRandomMusic() {
    const frequencies = ['432Hz', '528Hz', '639Hz'];
    const randomFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
    
    document.getElementById('current-frequency').textContent = randomFreq;
    document.getElementById('track-name').textContent = getFrequencyName(randomFreq);
    document.getElementById('track-description').textContent = getFrequencyDescription(randomFreq);
    
    // 更新音頻源
    const audioPlayer = document.getElementById('audio-player');
    const audioSource = document.getElementById('audio-source');
    
    if (audioSource) {
        audioSource.src = `audio/${randomFreq.toLowerCase()}.mp3`;
        
        // 設置循環播放
        audioPlayer.loop = true;
        
        // 確保音頻已加載
        audioPlayer.load();
        
        // 播放音頻
        const playPromise = audioPlayer.play();
        
        // 處理播放承諾
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // 自動播放成功
                console.log("音樂播放成功");
                // 啟動音波動畫
                document.querySelector('.sound-wave').classList.add('playing');
            })
            .catch(error => {
                // 自動播放被阻止
                console.log("自動播放被阻止:", error);
                document.querySelector('.sound-wave').classList.remove('playing');
            });
        }
    }
}

// 獲取頻率對應的音樂名稱
function getFrequencyName(frequency) {
    const names = {
        '432Hz': '宇宙協調冥想',
        '528Hz': '愛與療癒冥想',
        '639Hz': '人際關係修復'
    };
    return names[frequency] || '未知';
}

// 獲取頻率對應的描述
function getFrequencyDescription(frequency) {
    const descriptions = {
        '432Hz': '讓你與宇宙頻率協調，安定心神',
        '528Hz': '喚醒內在的愛與療癒能量',
        '639Hz': '改善人際關係，促進和諧溝通'
    };
    return descriptions[frequency] || '未知';
}

// 計時器功能
let timerInterval;
let timeLeft = 900; // 15分鐘

function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(updateTimer, 1000);
    document.getElementById('start-timer').disabled = true;
    document.getElementById('pause-timer').disabled = false;
    
    // 確保音樂在計時器開始時循環播放
    const audioPlayer = document.getElementById('audio-player');
    if (audioPlayer && audioPlayer.paused) {
        audioPlayer.loop = true;
        audioPlayer.play().catch(error => {
            console.log("計時器開始時自動播放音樂失敗:", error);
        });
        // 啟動音波動畫
        document.querySelector('.sound-wave').classList.add('playing');
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById('start-timer').disabled = false;
    document.getElementById('pause-timer').disabled = true;
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 900;
    updateTimerDisplay();
    document.getElementById('start-timer').disabled = false;
    document.getElementById('pause-timer').disabled = true;
}

function updateTimer() {
    timeLeft--;
    updateTimerDisplay();
    
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        document.getElementById('start-timer').disabled = false;
        document.getElementById('pause-timer').disabled = true;
        
        // 計時結束時停止音樂
        const audioPlayer = document.getElementById('audio-player');
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.loop = false; // 取消循環
            // 停止音波動畫
            document.querySelector('.sound-wave').classList.remove('playing');
        }
        
        alert('靜心時間結束！');
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer-display').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 處理登出
function handleLogout() {
    localStorage.removeItem('userData');
    currentUser = null;
    showPage('login-page');
}

// 個人資料頁面 - 生日選擇與五行計算
const birthDateInput = document.getElementById('birth-date');
const elementTypeDisplay = document.getElementById('element-type');
const mainElementDisplay = document.getElementById('main-element');
const candleColorDisplay = document.getElementById('candle-color');
const oilRecommendationDisplay = document.getElementById('oil-recommendation');
const fragranceDisplay = document.getElementById('fragrance');
const elementIconDisplay = document.querySelector('.element-icon i');
const elementIconBg = document.querySelector('.element-icon');
const candleImageElement = document.getElementById('candle-image');
const saveProfileButton = document.querySelector('.save-profile');

// 五行對應關係
const elements = {
    wood: {
        key: 'wood',
        name: '木',
        color: '綠色',
        oil: '佛手柑',
        fragrance: '佛手柑（提升正能量）',
        icon: 'fa-tree',
        bgColor: 'var(--wood-color)'
    },
    fire: {
        key: 'fire',
        name: '火',
        color: '紅色',
        oil: '薰衣草',
        fragrance: '薰衣草（安神）',
        icon: 'fa-fire',
        bgColor: 'var(--fire-color)'
    },
    earth: {
        key: 'earth',
        name: '土',
        color: '黃色',
        oil: '檀香',
        fragrance: '檀香（穩定氣場）',
        icon: 'fa-mountain',
        bgColor: 'var(--earth-color)'
    },
    metal: {
        key: 'metal',
        name: '金',
        color: '銀色',
        oil: '薄荷',
        fragrance: '薄荷（清新思緒）',
        icon: 'fa-coins',
        bgColor: 'var(--metal-color)'
    },
    water: {
        key: 'water',
        name: '水',
        color: '藍色',
        oil: '茉莉',
        fragrance: '茉莉（平衡心靈）',
        icon: 'fa-water',
        bgColor: 'var(--water-color)'
    }
};

function updateElementDisplay(element) {
    mainElementDisplay.textContent = element.name;
    elementTypeDisplay.textContent = element.name;
    candleColorDisplay.textContent = element.color;
    oilRecommendationDisplay.textContent = element.oil;
    fragranceDisplay.textContent = element.fragrance;
    
    // 更新圖標
    elementIconDisplay.className = '';
    elementIconDisplay.classList.add('fas');
    elementIconDisplay.classList.add(element.icon);
    elementIconBg.style.backgroundColor = element.bgColor;
    
    // 更新蠟燭圖片
    candleImageElement.src = candleImages[element.key];
}

birthDateInput.addEventListener('change', () => {
    const element = calculateElement(birthDateInput.value);
    updateElementDisplay(element);
});

saveProfileButton.addEventListener('click', () => {
    if (birthDateInput.value) {
        // 保存到localStorage
        localStorage.setItem('birthDate', birthDateInput.value);
        if (document.getElementById('birth-time').value) {
            localStorage.setItem('birthTime', document.getElementById('birth-time').value);
        }
        
        const element = calculateElement(birthDateInput.value);
        localStorage.setItem('element', element.key);
        
        // 更新今日推薦
        setTodayRecommendation(element);
        
        alert('個人設定已儲存！五行計算已更新。');
    } else {
        alert('請輸入您的出生日期！');
    }
});

// 翻卡式咒語卡
const flipCards = document.querySelectorAll('.flip-card');
const savedMantrasContainer = document.getElementById('saved-mantras-container');

flipCards.forEach(card => {
    card.addEventListener('click', () => {
        // 如果卡片尚未翻轉，才翻轉它
        if (!card.classList.contains('flipped')) {
            card.classList.add('flipped');
        }
    });
});

// 保存咒語卡
document.querySelectorAll('.save-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件冒泡
        
        const card = button.closest('.flip-card');
        const mantraText = card.querySelector('.card-content p').textContent;
        
        // 檢查是否已經保存過
        const savedMantras = JSON.parse(localStorage.getItem('savedMantras') || '[]');
        if (!savedMantras.includes(mantraText)) {
            savedMantras.push(mantraText);
            localStorage.setItem('savedMantras', JSON.stringify(savedMantras));
            
            // 添加到收藏列表
            addToSavedMantras(mantraText);
            
            alert('咒語已儲存到收藏！');
        } else {
            alert('此咒語已在您的收藏中！');
        }
    });
});

// 分享咒語卡
document.querySelectorAll('.share-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件冒泡
        
        const card = button.closest('.flip-card');
        const mantraText = card.querySelector('.card-content p').textContent;
        
        // 如果有Web Share API支持，使用它分享
        if (navigator.share) {
            navigator.share({
                title: '水逆生存包 - 防水逆咒語',
                text: mantraText
            })
            .catch(() => {
                // 如果無法分享，提示複製
                alert(`已複製咒語: ${mantraText}`);
            });
        } else {
            // 不支持分享API，直接提示
            alert(`已複製咒語: ${mantraText}`);
        }
    });
});

// 添加保存的咒語到列表
function addToSavedMantras(mantraText) {
    const mantraItem = document.createElement('div');
    mantraItem.className = 'saved-mantra-item';
    mantraItem.innerHTML = `<p>${mantraText}</p>`;
    savedMantrasContainer.appendChild(mantraItem);
}

// 載入已保存的咒語
function loadSavedMantras() {
    const savedMantras = JSON.parse(localStorage.getItem('savedMantras') || '[]');
    savedMantrasContainer.innerHTML = '';
    
    if (savedMantras.length === 0) {
        savedMantrasContainer.innerHTML = '<p class="no-mantras">您尚未收藏任何咒語</p>';
    } else {
        savedMantras.forEach(mantra => {
            addToSavedMantras(mantra);
        });
    }
}

// 初始化載入已保存的咒語
loadSavedMantras();

// 設置今日推薦
function setTodayRecommendation(element) {
    const todayCandleElement = document.getElementById('today-candle');
    const todayMusicElement = document.getElementById('today-music');
    
    // 根據用戶五行隨機推薦內容
    todayCandleElement.textContent = `${element.name}系果凍蠟燭`;
    
    // 隨機選擇一種頻率的音樂
    const frequencies = ['432Hz', '528Hz', '639Hz'];
    const randomIndex = Math.floor(Math.random() * frequencies.length);
    todayMusicElement.textContent = `${frequencies[randomIndex]}冥想音樂`;
}

// 加載蠟燭圖片
function loadCandleImage() {
    // 確定用戶的元素
    const elementText = currentUser && currentUser.element ? currentUser.element : '火';
    
    // 根據元素選擇圖片
    let imgPath = 'images/fire_candle.png'; // 默認使用fire蠟燭
    
    // 我們僅有 fire_candle.png 和 earth_candle.png 兩張圖
    if (elementText === '土') {
        imgPath = 'images/earth_candle.png';
    }
    
    console.log("用戶元素：", elementText);
    console.log("設置蠟燭圖片：", imgPath);
    
    // 設置圖片
    const candleImage = document.getElementById('candle-image');
    if (candleImage) {
        candleImage.src = imgPath;
        candleImage.style.display = 'block';
        candleImage.style.maxWidth = '100%';
        candleImage.style.height = 'auto';
    }
    
    // 確保顯示的文字描述與圖片相符
    updateCandleInfoToMatchImage(elementText, imgPath.includes('earth'));
}

// 更新蠟燭描述以匹配圖片
function updateCandleInfoToMatchImage(userElement, isEarthImage) {
    const elementTypeSpan = document.getElementById('element-type');
    const fragranceElement = document.getElementById('fragrance');
    const meaningElement = document.getElementById('candle-meaning');
    
    // 顯示的元素文字
    const displayElement = isEarthImage ? '土' : '火';
    
    // 設置顯示的元素
    if (elementTypeSpan) {
        elementTypeSpan.textContent = displayElement;
    }
    
    // 設置香味描述
    if (fragranceElement) {
        const fragranceText = isEarthImage ? 
            '檀香（穩定氣場）' : 
            '薰衣草（安神）';
        fragranceElement.textContent = fragranceText;
    }
    
    // 設置顏色寓意
    if (meaningElement) {
        const meaningText = isEarthImage ? 
            '黃色代表穩定與滋養，有助於平衡情緒與思考。' : 
            '紅色代表熱情與活力，有助於提升能量與勇氣。';
        meaningElement.textContent = meaningText;
    }
    
    // 如果用戶實際元素與顯示元素不同，顯示適合的提示
    if (userElement !== displayElement) {
        console.log(`用戶實際元素(${userElement})與顯示元素(${displayElement})不同，使用可用的圖片`);
    }
}

// 載入今日咒語
function loadTodayMantra() {
    const todayMantraContent = document.getElementById('today-mantra-content');
    
    // 先從全局變量取，若沒有則從localStorage取，若還沒有則生成新的
    if (dailyMantra) {
        // 僅在逗號處或文字過長時添加換行
        const formattedMantra = formatMantraWithSmartBreaks(dailyMantra);
        todayMantraContent.innerHTML = `<p>${formattedMantra}</p>`;
    } else {
        const savedMantra = localStorage.getItem('todayMantra');
        if (savedMantra) {
            dailyMantra = savedMantra;
            // 僅在逗號處或文字過長時添加換行
            const formattedMantra = formatMantraWithSmartBreaks(dailyMantra);
            todayMantraContent.innerHTML = `<p>${formattedMantra}</p>`;
        } else {
            // 還沒有今日咒語，生成一個
            const mantra = getRandomMantra();
            dailyMantra = mantra;
            localStorage.setItem('todayMantra', mantra);
            // 僅在逗號處或文字過長時添加換行
            const formattedMantra = formatMantraWithSmartBreaks(mantra);
            todayMantraContent.innerHTML = `<p>${formattedMantra}</p>`;
        }
    }
    
    // 綁定今日咒語的保存按鈕
    const saveTodayMantraBtn = document.getElementById('save-today-mantra');
    if (saveTodayMantraBtn) {
        saveTodayMantraBtn.addEventListener('click', () => {
            if (dailyMantra) {
                // 檢查是否已經保存過
                const savedMantras = JSON.parse(localStorage.getItem('savedMantras') || '[]');
                if (!savedMantras.includes(dailyMantra)) {
                    savedMantras.push(dailyMantra);
                    localStorage.setItem('savedMantras', JSON.stringify(savedMantras));
                    
                    // 添加到收藏列表
                    addToSavedMantras(dailyMantra);
                    
                    alert('今日咒語已儲存到收藏！');
                } else {
                    alert('此咒語已在您的收藏中！');
                }
            }
        });
    }
    
    // 綁定今日咒語的分享按鈕
    const shareTodayMantraBtn = document.getElementById('share-today-mantra');
    if (shareTodayMantraBtn) {
        shareTodayMantraBtn.addEventListener('click', () => {
            if (dailyMantra) {
                // 如果有Web Share API支持，使用它分享
                if (navigator.share) {
                    navigator.share({
                        title: '水逆生存包 - 今日防水逆咒語',
                        text: dailyMantra
                    })
                    .catch(() => {
                        // 如果無法分享，提示複製
                        alert(`已複製今日咒語: ${dailyMantra}`);
                    });
                } else {
                    // 不支持分享API，直接提示
                    alert(`已複製今日咒語: ${dailyMantra}`);
                }
            }
        });
    }
}

// 智能處理換行，僅在有逗號或超過字數限制時才換行
function formatMantraWithSmartBreaks(mantra) {
    // 如果有逗號，在逗號處換行
    if (mantra.includes('，')) {
        return mantra.replace(/，/g, '，<br>');
    }
    
    // 如果沒有逗號但文字過長（超過12個字符），嘗試在中間位置換行
    if (mantra.length > 12) {
        const midPoint = Math.floor(mantra.length / 2);
        // 找最接近中點的合適位置（避免切分單詞）
        for (let i = midPoint; i < mantra.length - 1; i++) {
            if (mantra[i] === '」' || mantra[i] === '。' || mantra[i] === ' ') {
                return mantra.substring(0, i+1) + '<br>' + mantra.substring(i+1);
            }
        }
        for (let i = midPoint; i > 0; i--) {
            if (mantra[i] === '「' || mantra[i] === '。' || mantra[i] === ' ') {
                return mantra.substring(0, i+1) + '<br>' + mantra.substring(i+1);
            }
        }
        // 如果找不到合適的切分點，就在中間切分
        return mantra.substring(0, midPoint) + '<br>' + mantra.substring(midPoint);
    }
    
    // 短句不換行
    return mantra;
}

// 在逗號處添加換行
function formatMantraWithBreaks(mantra) {
    return mantra.replace(/，/g, '，<br>');
} 