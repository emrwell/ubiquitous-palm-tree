// Скрипт сайта школы танцев "Ритм"

document.addEventListener('DOMContentLoaded', function () {

    // ----- Бургер-меню (мобильное) -----
    var burger = document.getElementById('burger');
    var nav = document.getElementById('nav');

    if (burger && nav) {
        burger.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });

        // Закрытие меню при клике по ссылке
        var navLinks = nav.querySelectorAll('.nav__link');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('is-open');
            });
        });
    }

    // ----- Плавная прокрутка по якорям -----
    var anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(function (a) {
        a.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href.length <= 1) return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var offset = 70; // высота шапки
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // ----- Фильтр расписания по дням -----
    var dayFilter = document.getElementById('dayFilter');
    var scheduleBody = document.getElementById('scheduleBody');
    var scheduleEmpty = document.getElementById('scheduleEmpty');

    if (dayFilter && scheduleBody) {
        var chips = dayFilter.querySelectorAll('.chip');

        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                // снимаем активность со всех чипов
                chips.forEach(function (c) { c.classList.remove('is-active'); });
                this.classList.add('is-active');

                var day = this.dataset.day;
                var rows = scheduleBody.querySelectorAll('tr');
                var visibleCount = 0;

                rows.forEach(function (row) {
                    if (day === 'all' || row.dataset.day === day) {
                        row.style.display = '';
                        visibleCount++;
                    } else {
                        row.style.display = 'none';
                    }
                });

                // Сообщение если в день нет занятий
                if (scheduleEmpty) {
                    scheduleEmpty.style.display = visibleCount === 0 ? 'block' : 'none';
                }
            });
        });
    }

    // ----- Валидация и обработка формы записи -----
    var form = document.getElementById('signupForm');
    var formMsg = document.getElementById('formMsg');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = form.querySelector('#name');
            var phone = form.querySelector('#phone');
            var direction = form.querySelector('#direction');
            var agree = form.querySelector('#agree');

            // Сбрасываем состояния полей
            [name, phone, direction].forEach(function (f) {
                f.classList.remove('is-invalid');
            });

            var isValid = true;
            var errors = [];

            if (name.value.trim().length < 2) {
                name.classList.add('is-invalid');
                errors.push('имя');
                isValid = false;
            }

            // Простая проверка телефона: должно быть минимум 10 цифр
            var phoneDigits = phone.value.replace(/\D/g, '');
            if (phoneDigits.length < 10) {
                phone.classList.add('is-invalid');
                errors.push('телефон');
                isValid = false;
            }

            if (!direction.value) {
                direction.classList.add('is-invalid');
                errors.push('направление');
                isValid = false;
            }

            if (!agree.checked) {
                errors.push('согласие на обработку данных');
                isValid = false;
            }

            // Вывод результата
            formMsg.classList.remove('is-success', 'is-error');

            if (!isValid) {
                formMsg.classList.add('is-error');
                formMsg.textContent = 'Заполните корректно: ' + errors.join(', ') + '.';
                return;
            }

            // Имитация отправки заявки
            var application = {
                name: name.value.trim(),
                phone: phone.value.trim(),
                direction: direction.value,
                comment: form.querySelector('#comment').value.trim(),
                createdAt: new Date().toISOString()
            };
            console.log('Новая заявка:', application);

            formMsg.classList.add('is-success');
            formMsg.textContent = 'Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.';
            form.reset();
        });
    }

    // ----- Маска ввода телефона -----
    var phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            var digits = e.target.value.replace(/\D/g, '').slice(0, 11);
            var formatted = '';

            if (digits.length > 0) {
                formatted = '+7';
                if (digits.length > 1) formatted += ' (' + digits.substring(1, 4);
                if (digits.length >= 4) formatted += ') ';
                if (digits.length >= 4) formatted += digits.substring(4, 7);
                if (digits.length >= 7) formatted += '-' + digits.substring(7, 9);
                if (digits.length >= 9) formatted += '-' + digits.substring(9, 11);
            }

            e.target.value = formatted;
        });
    }

});
