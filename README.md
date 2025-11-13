# 🌩️ IT Storm 🌩️

Educational project website for a digital agency, developed on Angular 14.

The website is a SPA (Single Page Application) where the company offers its services in freelancing, design, SMM, targeting, and copywriting.

Users can learn about services, read the blog, submit service requests, or order a callback.

---

## Main features:

* User registration and authorization;
* Home page, including:
  - Slider with promotions and news (with the ability to submit a request);
  - Services description block (with buttons to order a service);
  - Company information;
  - Popular blog articles block (with links to detailed view);
  - Client reviews slider;
  - Interactive map with office location and contacts;
* Blog with pagination (8 articles per page) and filtering by categories (freelancing, design, SMM, targeting, copywriting);
* Detailed article page with materials, related articles, and comment system:
  - Authorized users can leave comments;
  - Add reactions (likes/dislikes) to comments;
  - Report an article;
  - Comments load in batches of 3.
* Unified Layout (header and footer) on all pages.
  
---

## Project structure:

The project consists of two parts: frontend (Angular application) and backend (server part).
The frontend uses a modular structure, reusable components, and lazy loading of modules.

```bash
app/
├── core/        # authorization services and files (guards, interceptors)
├── shared/      # shared components and services
└── views/       # page modules:
    ├── auth/        # authorization and registration
    ├── blog/        # blog and article detail page
    └── main/        # home page
```
---

## Frontend tools:

* Angular 14
* TypeScript
* Angular Material (Snack Bar is used)
* SCSS
* ngx-owl-carousel-o (for sliders on the home page)
* ngx-mask (phone number input mask)

---

## How to run the project locally:

### 1. Install required programs:
* Node.js (recommended v18.20.8) + npm;
* Angular CLI (v14.2.13);
* MongoDB (v8.0.10).

### 2. Clone the repository:
`git clone https://github.com/natastrr/IT_STORM.git`

### 3. Install dependencies and run the application:
#### Backend:
1. `cd backend` (navigate from the project root to the backend directory)
2. `npm install`
3. `npm start`
The server should start and connect to MongoDB (make sure MongoDB is running locally).

#### Frontend (in a new terminal):
1. `cd frontend` (navigate from the project root to the frontend directory)
2. `npm install`
3. `npm start` or `ng serve`
After building and starting the project, the application will be available at: `http://localhost:4200`

---

## Additional information:
* Project created for educational purposes;
* Backend and frontend run separately, interaction occurs via HTTP requests;
* All data is stored in MongoDB database.

---
---
---
# 🌩️ АйтиШторм 🌩️

Учебный проект сайта для digital-агентства, разработанный на Angular 14.

Сайт представляет собой SPA (Single Page Application), где компания предлагает свои услуги в области фриланса, дизайна, SMM, таргета и копирайтинга.

Пользователи могут знакомиться с услугами, читать блог, оставлять заявки на услуги или заказывать обратный звонок.

---

## Основной функционал:

* Регистрация и авторизация пользователей;
* Главная страница, включающая:
  - Слайдер с акциями и новостями (с возможностью оставить заявку);
  - Блок с описанием услуг (с кнопками для заказа услуги);
  - Информация о компании;
  - Блок популярных статей из блога (с ссылками на детальный просмотр);
  - Слайдер с отзывами клиентов;
  - Интерактивная карта с расположением офиса и контактами;
* Блог с пагинацией (8 статей на страницу) и фильтрацией по категориям (фриланс, дизайн, SMM, таргет, копирайтинг);
* Детальная страница статьи с материалами, связанными статьями и системой комментариев:
  - Авторизованные пользователи могут оставлять комментарии;
  - Ставить реакции (лайки/дизлайки) на комментарии;
  - Пожаловаться на статью;
  - Подгрузка комментариев по 3 штуки.
* Единый Layout (header и footer) на всех страницах.
  
---

## Структура проекта:

Проект состоит из двух частей: frontend (Angular-приложение) и backend (серверная часть).
Во фронтенде используется модульная структура, переиспользуемые компоненты и ленивая загрузка модулей (Lazy Loading).

```bash
app/
├── core/        # сервисы и файлы авторизации (guards, interceptors)
├── shared/      # общие компоненты и сервисы
└── views/       # модули страниц:
    ├── auth/        # авторизация и регистрация
    ├── blog/        # блог и страница детального просмотра статьи
    └── main/        # главная страница
```
---

## Frontend-инструменты:

* Angular 14
* TypeScript
* Angular Material (используется Snack Bar)
* SCSS
* ngx-owl-carousel-o (для слайдеров на главной странице)
* ngx-mask (маска для номера телефона)

---

## Как локально запустить проект?

### 1. Установите необходимые программы:
* Node.js (рекомендуется v18.20.8) + npm;
* Angular CLI (v14.2.13);
* MongoDB (v8.0.10).

### 2. Клонируйте репозиторий:
`git clone https://github.com/natastrr/IT_STORM.git`

### 3. Установка зависимостей и запуск приложения:
#### Backend:
1. `cd backend` (перейти из корня проекта в директорию backend)
2. `npm install`
3. `npm start`
Сервер должен запуститься и подключиться к MongoDB (убедитесь, что у вас запущен локальный MongoDB).

#### Frontend (в новом терминале):
1. `cd frontend` (перейти из корня проекта в директорию frontend)
2. `npm install`
3. `npm start` или `ng serve`
После сборки и запуска проекта приложение будет доступно по адресу: `http://localhost:4200`

---

## Дополнительно:
* Проект создан в учебных целях;
* Backend и frontend запускаются отдельно, взаимодействие происходит через HTTP-запросы;
* Все данные сохраняются в базе MongoDB.
