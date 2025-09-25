window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");

  // header, footer 먼저 불러오기
  let headerLoaded = false;

  if ($(".main").length > 0) {
    fetch("partials/header.html")
      .then((res) => res.text())
      .then((data) => {
        document.getElementById("header").innerHTML = data;
        headerLoaded = true;
      });
  } else {
    $("header").remove();
    headerLoaded = true; // header 없는 경우도 완료 처리
  }

  fetch("partials/footer.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("footer").innerHTML = data;
    });

  //preload 완전히 사라진 후에 함수 실행
  setTimeout(() => {
    preloader.classList.add("hidden");

    // preloader 사라진 뒤 실행
    navActive();
    sectionActive();
  }, 2200);

  // header (네비게이션 전용)
  function navActive() {
    const $navLinks = $("header nav a");
    const $sections = $("section");
    const headerHeight = $("header").outerHeight();

    // 1. 네비게이션 클릭 시 active 클래스 변경
    $navLinks.on("click", function () {
      $navLinks.removeClass("active");
      $(this).addClass("active");
    });

    // 2. 스크롤 시 현재 섹션 기준으로 nav active 반영
    $(window).on("scroll", function () {
      const scrollPos = $(window).scrollTop() + headerHeight + 10;

      $sections.each(function () {
        const $section = $(this);
        const sectionTop = $section.offset().top;
        const sectionBottom = sectionTop + $section.outerHeight();

        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
          const id = $section.attr("id");
          $navLinks.removeClass("active");
          $('header nav a[href="#' + id + '"]').addClass("active");
        }
      });

      // header 배경 처리
      if ($(window).scrollTop() > 50) {
        $("header").addClass("scrolled");
      } else {
        $("header").removeClass("scrolled");
      }
    });

    // 초기 실행
    $(window).trigger("scroll");
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
  $(document).on("click", ".nav_mo .hamburger_btn", function (e) {
    if ($(this).parent().hasClass("active")) {
      $(this).parent().removeClass("active");
    } else {
      $(this).parent().addClass("active");
    }
  });

  //home
  const text = "디자인과 기획의 의도를 구현하는 퍼블리싱";
  const subtitle = document.querySelector(".subtitle");
  let i = 0;

  function typing() {
    if (i < text.length) {
      subtitle.textContent += text.charAt(i);
      i++;
      setTimeout(typing, 120); // 속도 조절 (ms)
    } else {
      cursorBlink(); // 다 치고 나면 커서 깜빡임
    }
  }

  function cursorBlink() {
    subtitle.classList.add("blink");
  }

  // section (애니메이션 + typing 전용)
  function sectionActive() {
    const sections = document.querySelectorAll(".main section");
    let typingStarted = false;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 공통 섹션 active (애니메이션)
            entry.target.classList.add("active");

            // 첫 번째 섹션일 때 typing 실행 (한 번만)
            if (entry.target.id === "home" && !typingStarted) {
              setTimeout(() => {
                typing();
              }, 400); // 0.4초 후 실행
              typingStarted = true;
            }

            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  //project
  const swiper = new Swiper(".projectSwiper", {
    slidesPerView: 2,
    spaceBetween: 30,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      0: {
        slidesPerView: 1,
      },
    },
  });

  //career
  const $items = $(".career .item");

  $(window).on("scroll", function () {
    const windowHeight = $(window).height();
    const scrollTop = $(window).scrollTop();

    let $lastActive = null;

    $items.each(function () {
      const $el = $(this);
      const offsetTop = $el.offset().top;
      const elHeight = $el.outerHeight();

      // 화면에 보이는 비율 계산
      const visibleTop = Math.max(scrollTop, offsetTop);
      const visibleBottom = Math.min(
        scrollTop + windowHeight,
        offsetTop + elHeight
      );
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const ratio = visibleHeight / elHeight;

      if (ratio >= 0.4) {
        // 40% 이상 보이면 seen 부여 (유지)
        $el.addClass("seen");
        // active 후보
        $lastActive = $el;
      }
    });

    // 모든 active 제거 후 마지막 보이는 item에만 active 추가
    $items.removeClass("active");
    if ($lastActive) {
      $lastActive.addClass("active");
    }
  });
});
