import {Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {MatDialog} from "@angular/material/dialog";
import {PopupComponent} from "../../shared/components/popup/popup.component";
import {PopupType} from "../../../types/popup-type";
import {ArticleType} from "../../../types/article.type";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";

@Component({
  selector: 'main-component',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  mainSliderOptions: OwlOptions = {
    items: 1,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    nav: true,
    navSpeed: 700,
    navText: ['', ''],
    autoplay: true,
    autoplayTimeout: 10000,
  };
  mainSliderInfo: {
    image: string,
    preTitle: string,
    titleStart: string,
    titleSpan: string,
    titleEnd: string,
    insertBr?: boolean,
    titleEndExtra?: string,
    text?: string
  }[] = [
    {
      image: 'main-slider-image-1.png',
      preTitle: 'Предложение месяца',
      titleStart: 'Продвижение в Instagram для вашего бизнеса ',
      titleSpan: '-15%',
      titleEnd: '!',
    },
    {
      image: 'main-slider-image-2.png',
      preTitle: 'Акция',
      titleStart: 'Нужен грамотный ',
      titleSpan: 'копирайтер',
      titleEnd: '?',
      text: 'Весь декабрь у нас действует акция на работу копирайтера.',
    },
    {
      image: 'main-slider-image-3.png',
      preTitle: 'Новость дня',
      titleStart: '',
      titleSpan: '6 место',
      titleEnd: ' в ТОП-10',
      insertBr: true,
      titleEndExtra: 'SMM-агенств Москвы!',
      text: 'Мы благодарим каждого, кто голосовал за нас!',
    }
  ];
  offers: { image: string, title: string, description: string, price: string }[] = [
    {
      image: 'offers-image-1.png',
      title: 'Создание сайтов',
      description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: '7 500',
    },
    {
      image: 'offers-image-2.png',
      title: 'Продвижение',
      description: ' Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: '3 500',
    },
    {
      image: 'offers-image-3.png',
      title: 'Реклама',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: '1 000',
    },
    {
      image: 'offers-image-4.png',
      title: 'Копирайтинг',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: '750',
    },
  ];
  advantages: { title: string, text: string }[] = [
    {
      title: 'Мастерски вовлекаем аудиториюв процесс.',
      text: 'Мы увеличиваем процент вовлечённости за короткий промежуток времени.',
    },
    {
      title: 'Разрабатываем бомбическую визуальную концепцию.',
      text: 'Наши специалисты знают как создать уникальный образ вашего проекта.',
    },
    {
      title: 'Создаём мощные воронки с помощью текстов.',
      text: 'Наши копирайтеры создают не только вкусные текста, но и классные воронки.',
    },
    {
      title: 'Помогаем продавать больше.',
      text: 'Мы не только помогаем разработать стратегию по продажам, но также корректируем её под нужды заказчика.',
    },
  ];
  popularArticles: ArticleType[] = [];
  reviewsSliderOptions = {
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    navSpeed: 700,
    loop: true,
    margin: 25,
    nav: true,
    navText: ['', ''],
    dots: false,
    items: 3,
    responsive: {
      0: {items: 1},
      768: {items: 2},
      1024: {items: 3},
    }
  };
  reviewsSliderInfo: { image: string, name: string, reviewText: string }[] = [
    {
      image: 'reviewer-1.png',
      name: 'Станислав',
      reviewText: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.',
    },
    {
      image: 'reviewer-2.png',
      name: 'Алёна',
      reviewText: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.',
    },
    {
      image: 'reviewer-3.png',
      name: 'Мария',
      reviewText: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!',
    },
    {
      image: 'reviewer-4.png',
      name: 'Роберт',
      reviewText: 'Долго искал агентство, которое действительно понимает, как работает digital-маркетинг. АйтиШторм превзошёл ожидания — всё чётко, оперативно и с душой!',
    },
    {
      image: 'reviewer-5.png',
      name: 'Скарлетт',
      reviewText: 'Очень довольна работой с командой. Особенно понравилось, как они подошли к созданию контент-плана — креативно, структурировано и с учётом нашей специфики.',
    },
    {
      image: 'reviewer-6.png',
      name: 'Бенедикт',
      reviewText: 'Сотрудничаем с АйтиШтормом уже второй месяц. Видим стабильный рост охвата и вовлечённости. Команда всегда на связи и быстро реагирует на наши пожелания.',
    },
    {
      image: 'reviewer-7.png',
      name: 'Элизабет',
      reviewText: 'Никогда не думала, что продвижение в соцсетях может быть настолько результативным. Благодарю за профессионализм и вовлечённость!',
    },
    {
      image: 'reviewer-8.png',
      name: 'Генри',
      reviewText: 'Рекомендую АйтиШторм всем, кто хочет реальных результатов, а не просто красивых отчётов. Ребята реально копают вглубь задачи и предлагают крутые идеи.',
    },
    {
      image: 'reviewer-9.png',
      name: 'Дейзи',
      reviewText: 'Заказывали аудит Instagram. Получили не только подробный анализ, но и много практических советов, которые сразу же начали применять. Спасибо вам!',
    }
  ];
  popupType: typeof PopupType = PopupType;

  constructor(public matDialog: MatDialog, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<DefaultResponseType | ArticleType[]>(environment.api + 'articles/top').subscribe({
      next: (articlesData: DefaultResponseType | ArticleType[]): void => {
        if ((articlesData as DefaultResponseType).error) {
          throw new Error;
        }
        this.popularArticles = articlesData as ArticleType[];
      },
      error: (errorResponse: HttpErrorResponse): void => {
        console.log(errorResponse.error.message);
      }
    });
  }

  openPopup(popupType: PopupType, name?: string): void {
    this.matDialog.open(PopupComponent, {
      autoFocus: false,
      data: {popupType, name},
    });
  }

}
