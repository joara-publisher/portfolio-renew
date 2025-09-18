window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    preloader.classList.add("hidden");
  }, 2200); 
});

$(document).ready(function () {
    // header 불러오기
    if($('.main').length > 0) {
      fetch("partials/header.html")
        .then(res => res.text())
        .then(data => document.getElementById("header").innerHTML = data)
        .then(data => {navActive();});
    } else {
      $('header').remove();
    }
    
    // footer 불러오기
    fetch("partials/footer.html")
      .then(res => res.text())
      .then(data => document.getElementById("footer").innerHTML = data);
  
    //header
    function navActive() {
      const $navLinks = $('header nav a');
      const $sections = $('section'); 
      const headerHeight = $('header').outerHeight(); 
      
      // 1. 네비게이션 클릭 시 부드러운 스크롤 + active 클래스 변경
      $navLinks.on('click', function (e) {
        // e.preventDefault();
    
        // const targetId = $(this).attr('href'); 
        // const targetOffset = $(targetId).offset().top - headerHeight + 1;
    
        // $('html, body').animate({ scrollTop: targetOffset }, 600);
    
        $navLinks.removeClass('active');
        $(this).addClass('active');
      });
      
      // 2. 스크롤 시 현재 섹션 감지해서 active 변경
      $(window).on('scroll', function () {
        // 스크롤 시에 header 배경 불투명
        if ($(window).scrollTop() > 50) { 
          $('header').addClass('scrolled');
        } else {
          $('header').removeClass('scrolled');
        }
      
        const scrollPos = $(window).scrollTop() + headerHeight + 10;
    
        $sections.each(function () {
          const $section = $(this);
          const sectionTop = $section.offset().top;
          const sectionBottom = sectionTop + $section.outerHeight();
    
          if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
            const id = $section.attr('id');
            $navLinks.removeClass('active');
            $('header nav a[href="#' + id + '"]').addClass('active');
          }
        });
    });
    
    // 초기 실행 (페이지 새로고침 시에도 active 반영)
    $(window).trigger('scroll');  
    }
    
    // 클릭 이벤트 - document에 위임
    $(document).on("click", ".scroll_to_top_btn", function () {
      $("html, body").animate({ scrollTop: 0 });
    });
    
    // 스크롤 이벤트는 상시 감지
    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        $(".scroll_to_top_btn").fadeIn();
      } else {
        $(".scroll_to_top_btn").fadeOut();
      }
    });
    
    //모바일 메뉴
    $(document).on('click', '.nav_mo .hamburger_btn', function(e) {
      if($(this).parent().hasClass('active')) {
        $(this).parent().removeClass('active');
      } else {
        $(this).parent().addClass('active');
      }
    });
    
    //section animation
    const reveals = document.querySelectorAll(".main section");

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          obs.unobserve(entry.target); 
        }
      });
    }, { threshold: 0.2 });
  
    reveals.forEach(reveal => {
      observer.observe(reveal);
    });
    
    //project
    const swiper = new Swiper(".projectSwiper", {
        slidesPerView: 2,
        spaceBetween: 30,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });

    //career
    const $items = $('.career .item');
    
    $(window).on('scroll', function () {
      const windowHeight = $(window).height();
      const scrollTop = $(window).scrollTop();
      
      let $lastActive = null;
      
      $items.each(function () {
        const $el = $(this);
        const offsetTop = $el.offset().top;
        const elHeight = $el.outerHeight();
      
        // 화면에 보이는 비율 계산
        const visibleTop = Math.max(scrollTop, offsetTop);
        const visibleBottom = Math.min(scrollTop + windowHeight, offsetTop + elHeight);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const ratio = visibleHeight / elHeight;
      
        if (ratio >= 0.4) {
          // 40% 이상 보이면 seen 부여 (유지)
          $el.addClass('seen');
          // active 후보
          $lastActive = $el;
        }
      });
      
      // 모든 active 제거 후 마지막 보이는 item에만 active 추가
      $items.removeClass('active');
      if ($lastActive) {
        $lastActive.addClass('active');
      }
    });
});
