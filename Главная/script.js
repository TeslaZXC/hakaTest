document.addEventListener('DOMContentLoaded', function () {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const activeHighlight = document.querySelector('.active-highlight');

    function activateTab(link) {
        const tabId = link.getAttribute('data-tab');

        // Убираем активность со всех вкладок
        tabPanels.forEach(panel => panel.classList.remove('active'));
        tabLinks.forEach(link => link.parentElement.classList.remove('active'));

        // Добавляем активность к текущей вкладке
        document.getElementById(tabId).classList.add('active');
        link.parentElement.classList.add('active');

        // Обновляем позицию подсветки
        const rect = link.getBoundingClientRect();
        const sideNavTop = document.querySelector('.side-nav').getBoundingClientRect().top;
        activeHighlight.style.top = `${rect.top - sideNavTop}px`;
    }

    // Инициализация: активируем первую вкладку
    activateTab(tabLinks[0]);

    tabLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Предотвращает переход по ссылке
            activateTab(link);
        });
    });
});



let icon = {
    success:
    '<span class="material-symbols-outlined">task_alt</span>',
    danger:
    '<span class="material-symbols-outlined">ДТП</span>',
    warning:
    '<span class="material-symbols-outlined">warning</span>',
    info:
    '<span class="material-symbols-outlined">info</span>',
};

const showToast = (
    message = "Sample Message",
    toastType = "info",
    duration = 5000) => {
    if (
        !Object.keys(icon).includes(toastType))
        toastType = "info";

    let box = document.createElement("div");
    box.classList.add(
        "toast", `toast-${toastType}`);
    box.innerHTML = ` <div class="toast-content-wrapper">
                      <div class="toast-icon">
                      ${icon[toastType]}
                      </div>
                      <div class="toast-message">${message}</div>
                      <div class="toast-progress"></div>
                      </div>`;
    duration = duration || 5000;
    box.querySelector(".toast-progress").style.animationDuration =
            `${duration / 1000}s`;

    let toastAlready = 
        document.body.querySelector(".toast");
    if (toastAlready) {
        toastAlready.remove();
    }

    document.body.appendChild(box)};

let submit = 
    document.querySelector(".custom-toast.success-toast");
let information = 
    document.querySelector(".custom-toast.info-toast");
let failed = 
    document.querySelector(".custom-toast.danger-toast");
let warn = 
    document.querySelector(".custom-toast.warning-toast");

submit.addEventListener("click",(e) => {
        e.preventDefault();
        showToast("Внимание!","success",7000);
    });

information.addEventListener("click",(e) => {
        e.preventDefault();
        showToast("Внимание!","info",7000);
    });

failed.addEventListener("click",(e) => {
        e.preventDefault();
        showToast("Внимание!","danger",7000);
    });

warn.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Внимание!","warning",7000);
});






// Находим кнопку
const themeToggleButton = document.getElementById('theme-toggle');

// Функция переключения темы
themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme'); // Переключаем класс "dark-theme" на <body>
    
    // Сохраняем текущую тему в localStorage
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Проверяем сохранённую тему при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});






