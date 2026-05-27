const COUNTER_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw2ZkIyNz4h-YHO7x66osFaoFfP2ROuXeWUMU9M_CSnFRRl-zW7wO3lh7KxEqXcYqT7ew/exec';

// Переменные для слайдера
let currentSlide = 0;
let slides = [];
let slider;
let dotsContainer;

// ИЗОБРАЖЕНИЯ ДЛЯ СЛАЙДЕРА
const sliderImages = [
    'https://static.tildacdn.com/tild3536-3831-4534-b365-376633656361/01092023_168__-min_1.jpg',
    'https://static.tildacdn.com/tild3631-3962-4236-a164-393132396532/0fbpt38uwui-2.jpg',
    'https://konyukhov.ru/wp-content/uploads/2024/03/K1fLp51eAUY.jpg',
    'https://rostovchanka-media.ru/images/news-1/konvistrostov17.jpg',
    'https://konyukhov.ru/wp-content/uploads/2024/03/a6LfTUoAvzo.jpg',
    'https://cdnstatic.rg.ru/uploads/images/181/32/95/lodka__kopiia.jpg',
    'https://kudamoscow.ru/uploads/0bb6b83698594c793be0f04116b38261.jpg',
    'https://riavrn.ru/media/archive/image/2022/09/vN0JZ13cdr2bTVUznMaAGNAK_hm1ROxn.jpg'
];

// ==================== ФУНКЦИИ СЧЕТЧИКА И ССЫЛОК ====================

/**
 * Обработка клика по кнопке "Скоро открытие"
 * Эта функция вызывается при клике на ссылку
 */
function handleTicketClick(event, finalUrl) {
    // Отображаем уведомление немедленно (перед переходом)
    showCounterNotification('Отслеживаем ваш выбор...');
    
    // Пытаемся отправить запрос на счетчик, но не ждем ответа
    // Используем navigator.sendBeacon для надежной отправки
    try {
        if (navigator.sendBeacon) {
            // Отправляем через sendBeacon (надежно работает даже при закрытии страницы)
            navigator.sendBeacon(COUNTER_WEB_APP_URL);
        } else {
            // Fallback: обычный fetch с no-cors
            fetch(COUNTER_WEB_APP_URL, {
                method: 'GET',
                mode: 'no-cors',
                // Отправляем асинхронно, не ждем ответа
                keepalive: true
            }).catch(() => {
                // Игнорируем ошибки - переход пользователя важнее
            });
        }
    } catch (e) {
        console.log('Ошибка отправки счетчика (не критично):', e);
    }
    
    // Обновляем локальный счетчик (асинхронно)
    setTimeout(() => {
        updateTicketCounter();
    }, 1000);
    
    // НЕ предотвращаем стандартное поведение - позволим браузеру открыть ссылку
    // Ссылка уже содержит target="_blank", откроется в новой вкладке
    
    // Возвращаем true - разрешаем стандартное поведение ссылки
    return true;
}

/**
 * Обновление счетчика на странице
 */
function updateTicketCounter() {
    fetch(`${COUNTER_WEB_APP_URL}?action=getCount`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const counterElement = document.getElementById('ticketCounter');
                const counterText = document.getElementById('counterText');
                
                // Обновляем текст
                counterText.textContent = `Билетов куплено: ${data.count}`;
                
                // Показываем счетчик
                counterElement.classList.remove('hidden');
                
                // Автоскрытие через 8 секунд
                setTimeout(() => {
                    counterElement.classList.add('hidden');
                }, 8000);
            }
        })
        .catch(error => {
            console.log('Ошибка получения счетчика:', error);
        });
}

/**
 * Показ уведомления
 */
function showCounterNotification(message) {
    // Создаем временное уведомление
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Удаляем через 2 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ==================== СУЩЕСТВУЮЩИЕ ФУНКЦИИ ====================

// Функция для открытия/закрытия всплывающих окон "Что вас ждет"
function toggleExpectation(index) {
    const titles = [
        "Подлинные полотна художника",
        "Интерактивные комнаты",
        "Фотозоны",
        "5 тематических залов"
    ];
    
    const descriptions = [
        "Уникальная коллекция из 17 оригинальных картин Фёдора Конюхова, созданных во время его экспедиций. Каждое полотно рассказывает историю встречи с океаном, штормами и бескрайними просторами. Особое внимание привлекают картины, написанные в открытом море.",
        "Специально оборудованные пространства, где вы сможете почувствовать себя участником экспедиции. Воссозданная каюта яхты, симулятор шторма, компасная комната и другие интерактивные элементы позволят полностью погрузиться в атмосферу морских приключений.",
        "Несколько тематических фотозон, где каждый посетитель может сделать памятные снимки: у штурвала яхты, с экспедиционным снаряжением, на фоне картин-гигантов. Все фотозоны оформлены в морской тематике с использованием настоящих элементов снаряжения.",
        "Каждый из пяти залов посвящен отдельному этапу жизни и экспедициям Фёдора Конюхова: Зал Океана, Зал Полярных экспедиций, Зал Воздухоплавания, Зал Живописи и Зал Философии. Переходя из зала в зал, вы пройдете весь путь великого путешественника."
    ];
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        opacity: 0;
        animation: fadeInModal 0.3s ease forwards;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, rgba(13, 27, 42, 0.95), rgba(8, 18, 30, 0.98));
            border: 2px solid var(--gold);
            border-radius: 20px;
            padding: 50px 40px;
            max-width: 700px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        ">
            <button onclick="this.parentElement.parentElement.remove()" style="
                position: absolute;
                top: 20px;
                right: 20px;
                background: none;
                border: none;
                color: var(--gold);
                font-size: 2.5rem;
                cursor: pointer;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.3s;
            ">×</button>
            <h3 style="
                color: var(--light-gold);
                font-family: 'Playfair Display', serif;
                font-size: clamp(1.8rem, 3vw, 2.3rem);
                margin-bottom: 30px;
                text-align: center;
            ">${titles[index-1]}</h3>
            <p style="
                color: rgba(248, 245, 240, 0.95);
                line-height: 1.8;
                font-size: clamp(1.1rem, 1.8vw, 1.3rem);
                margin-bottom: 40px;
            ">${descriptions[index-1]}</p>
            <div style="text-align: center;">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                    background: linear-gradient(135deg, var(--gold), var(--light-gold));
                    color: #0b1828;
                    border: none;
                    padding: 15px 50px;
                    border-radius: 50px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.3s;
                    font-size: 1.1rem;
                ">Закрыть</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Добавляем стиль для анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInModal {
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Функция для анимации полосочек под заголовками
function animateTitleLines() {
    const sectionTitles = document.querySelectorAll('.section-title');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    sectionTitles.forEach(title => {
        observer.observe(title);
    });
}

// Обработчик скролла для размытия фона
let lastScrollTop = 0;
const heroHeader = document.querySelector('.hero-header');
const background = document.querySelector('.hero-background');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        heroHeader.classList.add('scrolled');
        const blurAmount = Math.min(12, 8 + (scrollTop - lastScrollTop) * 0.5);
        background.style.filter = `blur(${blurAmount}px) brightness(0.7)`;
    } else {
        heroHeader.classList.remove('scrolled');
        background.style.filter = 'none';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, { passive: true });

// Инициализация слайдера
function initSlider() {
    slider = document.getElementById('imageSlider');
    dotsContainer = document.getElementById('sliderDots');
    
    // Создаем слайды
    sliderImages.forEach((imgUrl, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.innerHTML = `
            <div class="img-placeholder" style="height:100%;" data-src="${imgUrl}"></div>
        `;
        slider.appendChild(slide);
        slides.push(slide);
        
        // Создаем точки
        const dot = document.createElement('button');
        dot.className = 'dot' + (index === 0 ? ' active' : '');
        dot.setAttribute('onclick', `goToSlide(${index})`);
        dotsContainer.appendChild(dot);
    });
    
    // Автоматическое перелистывание
    setInterval(() => {
        nextSlide();
    }, 5000);
    
    // Ленивая загрузка изображений
    lazyLoadImages();
}

// Функции слайдера
function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

function updateSlider() {
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Обновляем активную точку
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Загрузка главного изображения
function loadHeroImage() {
    const heroImage = document.getElementById('heroImage');
    if (heroImage) {
        const img = new Image();
        img.src = 'https://storage.yandexcloud.net/storage.yasno.media/nat-geo/images/2024/10/31/6e48becd01e94e5bab00737ac4676ebb.max-2500x1500.jpg';
        
        img.onload = function() {
            heroImage.style.backgroundImage = `url(${img.src})`;
            heroImage.style.backgroundSize = 'cover';
            heroImage.style.backgroundPosition = 'center 30%';
            heroImage.style.animation = 'none';
        };
        
        img.onerror = function() {
            heroImage.style.backgroundImage = 'linear-gradient(135deg, var(--gold), var(--light-gold))';
            heroImage.style.animation = 'none';
        };
    }
}

// Ленивая загрузка изображений
function lazyLoadImages() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                if (src) {
                    const image = new Image();
                    image.src = src;
                    image.onload = function() {
                        img.style.backgroundImage = `url(${src})`;
                        img.style.backgroundSize = 'cover';
                        img.style.backgroundPosition = 'center';
                        img.style.animation = 'none';
                    };
                    image.onerror = function() {
                        console.log('Не удалось загрузить изображение:', src);
                    };
                }
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });
    
    document.querySelectorAll('.img-placeholder[data-src]').forEach(img => {
        observer.observe(img);
    });
}

// Инициализация Яндекс.Карты
function initMap() {
    if (typeof ymaps === 'undefined') {
        console.log('Yandex Maps API не загружена');
        return;
    }
    
    ymaps.ready(function() {
        const map = new ymaps.Map('map', {
            center: [59.956755, 30.334903],
            zoom: 16,
            controls: ['zoomControl', 'fullscreenControl']
        });
        
        // Добавляем метку
        const placemark = new ymaps.Placemark([59.956755, 30.334903], {
            balloonContent: '<strong>"Галерея Сергиенко"</strong><br>Санкт-Петербург'
        }, {
            preset: 'islands#darkGoldIcon'
        });
        
        map.geoObjects.add(placemark);
        placemark.balloon.open();
    });
}

// Главная функция инициализации
window.onload = function() {
    // Анимация заголовка с новой структурой строк
    const spans = document.querySelectorAll('.handwriting span');
    spans.forEach((span, index) => {
        span.style.animation = `write 0.8s cubic-bezier(0.23,1,0.32,1) ${0.2 + index * 0.12}s forwards`;
        span.style.opacity = '0';
        span.style.transform = 'translateY(40px) rotate(-5deg) scale(0.9)';
    });
    
    // Анимация линии
    const line = document.querySelector('.title-line');
    line.style.animation = 'line 1s 1.2s forwards';
    
    // Загрузка главного изображения
    loadHeroImage();
    
    // Инициализация слайдера
    initSlider();
    
    // Инициализация карты
    initMap();
    
    // Инициализация анимации полосочек под заголовками
    animateTitleLines();
    
    // Загружаем текущее значение счетчика при загрузке страницы
    updateTicketCounter();
    
    // Простая реализация AOS
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
    
    // Также вешаем обработчики на ссылки для дополнительной надежности
    document.getElementById('buyTicketBtnTop')?.addEventListener('click', function(e) {
        handleTicketClick(e, this.href);
    });
    
    document.getElementById('buyTicketBtnBottom')?.addEventListener('click', function(e) {
        handleTicketClick(e, this.href);
    });
};

// Ключевые стили анимации
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes line {
        to { width: min(80%, 600px); }
    }
`;
document.head.appendChild(styleSheet);