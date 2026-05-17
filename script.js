(function () {
  "use strict";

  var STATE = {
    currentQuestion: 0,
    score: 0,
    selectedOption: -1,
    answered: false,
    wrongAnswers: [],
    userAnswers: []
  };

  var TOTAL = questionBank.length;

  var categoryNames = {
    teamHistory: "队史节点",
    tournamentMemory: "大赛记忆",
    playerLore: "选手线",
    fanLore: "圈内梗"
  };

  var resultLevels = [
    {
      min: 0,
      max: 1,
      key: "zero",
      title: "纯串子",
      description: "这个分数已经不是差一点了，比较像来串场的。",
      quote: "这杯茶你基本没喝到。",
      shareText: "我测出来是纯串子，这分数发出去都得先解释一下。"
    },
    {
      min: 2,
      max: 3,
      key: "sg",
      title: "味儿有点串",
      description: "不是完全不懂，但明显还没进到BLG那口茶里。",
      quote: "你不是没看过，只是没看进去。",
      shareText: "我测出来味儿有点串，有些题一细问还是会露馅。"
    },
    {
      min: 4,
      max: 6,
      key: "passerby",
      title: "路过但看过",
      description: "比赛应该看过一些，基础点也知道，但还没到能随手接上每个细节。",
      quote: "聊两句可以，再深就要想一想了。",
      shareText: "我测出来是路过但看过，不算纯路人，但也还没到很纯。"
    },
    {
      min: 7,
      max: 9,
      key: "half",
      title: "真爱粉预备役",
      description: "已经不是路人了，很多点你都能接住，说明平时确实在看。",
      quote: "有些地方差一点，但味儿已经出来了。",
      shareText: "我测出来算真爱粉预备役，平时该懂的我基本都懂。"
    },
    {
      min: 10,
      max: 12,
      key: "pure",
      title: "真爱粉",
      description: "这已经不是凑热闹的程度了，BLG这点队史和大赛节点你是真往心里记了。",
      quote: "这一杯已经很正了。",
      shareText: "我测出来是真爱粉，这套题做下来基本没怎么慌。"
    },
    {
      min: 13,
      max: 14,
      key: "ultimate",
      title: "我依旧是世界第一碧螺春",
      description: "纯度很高，已经开始催Bin的贾克斯了，这种题对你来说基本就是顺手一做。",
      quote: "这杯茶已经不是泡开了，是直接满出来了。",
      shareText: "我测出来是我依旧是世界第一碧螺春，纯度太高了。"
    }
  ];

  var correctFeedback = [
    "这题你还真接上了。",
    "行，这下没跑偏。",
    "这题答得还算稳。",
    "可以，这个点你记住了。",
    "这波像那么回事。",
    "这题看得出你不是乱蒙。"
  ];

  var wrongFeedback = [
    "这题一错就知道你哪块没跟上了。",
    "这个点你记得不太稳。",
    "这题有点偏了。",
    "这里你应该是记岔了。",
    "这一题露了点底。",
    "这题看得出你不是特别熟。"
  ];

  var randomBottomLines = [
    "我话先放这，你这结果发出去肯定有人要抬杠。",
    "别光自己看，发出来让我看看别人怎么说你。",
    "测都测了，不发一下有点可惜吧。",
    "你这结果吧，我不好直说，但群友应该会说。",
    "今天先测到这，剩下的你自己体会。",
    "这页我先给你留着，你最好别测第二次更低。",
    "发群里吧，看看有没有人比你还离谱。",
    "行了，结果给你了，怎么发是你的事。"
  ];

  var categoryComments = {
    teamHistory: "你不是不看，你是队史和时间线这块总记得差一口气。",
    tournamentMemory: "国际赛和大节点这块你记忆不算稳，看过但没完全留住。",
    playerLore: "阵容、旧ID、加入顺序这块你明显没记太牢。",
    fanLore: "比赛你可能真看，但空气和细节这块你混得还不够熟。",
    balanced: "倒也不是哪块特别差，就是每块都差一点。",
    almostPerfect: "这次没什么好挑的，你确实挺纯。"
  };

  var OPTION_LABELS = ["A", "B", "C", "D"];

  var dom = {};

  function cacheDom() {
    dom.intro = document.getElementById("intro");
    dom.quiz = document.getElementById("quiz");
    dom.result = document.getElementById("result");
    dom.btnStart = document.getElementById("btn-start");
    dom.btnRestart = document.getElementById("btn-restart");
    dom.btnCopy = document.getElementById("btn-copy");
    dom.currentNum = document.getElementById("current-num");
    dom.counterTotal = document.getElementById("counter-total");
    dom.progressBar = document.getElementById("progress-bar");
    dom.questionText = document.getElementById("question-text");
    dom.optionsContainer = document.getElementById("options-container");
    dom.quizCard = document.getElementById("quiz-card");
    dom.ringProgress = document.getElementById("ring-progress");
    dom.resultPercent = document.getElementById("result-percent");
    dom.resultTitle = document.getElementById("result-title");
    dom.resultScore = document.getElementById("result-score");
    dom.resultDesc = document.getElementById("result-desc");
    dom.resultQuote = document.getElementById("result-quote");
    dom.resultCategory = document.getElementById("result-category");
    dom.resultSponsor = document.getElementById("result-sponsor");
    dom.categoryBars = document.getElementById("category-bars");
    dom.wrongReview = document.getElementById("wrong-review");
    dom.allCorrect = document.getElementById("all-correct");
    dom.perfectBonus = document.getElementById("perfect-bonus");
    dom.toast = document.getElementById("toast");
    dom.canvas = document.getElementById("bg-canvas");
  }

  function showPage(pageEl, callback) {
    var pages = [dom.intro, dom.quiz, dom.result];
    pages.forEach(function (p) {
      if (p === pageEl) {
        p.classList.add("page--active");
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            p.classList.add("page--visible");
          });
        });
      } else {
        p.classList.remove("page--visible");
        p.classList.add("page--exit");
        setTimeout(function () {
          p.classList.remove("page--active", "page--exit");
        }, 450);
      }
    });
    if (callback) {
      setTimeout(callback, 500);
    }
  }

  function startQuiz() {
    STATE.currentQuestion = 0;
    STATE.score = 0;
    STATE.selectedOption = -1;
    STATE.answered = false;
    STATE.wrongAnswers = [];
    STATE.userAnswers = [];
    showPage(dom.quiz, function () {
      renderQuestion();
    });
  }

  function renderQuestion() {
    var q = questionBank[STATE.currentQuestion];
    var num = STATE.currentQuestion + 1;

    dom.currentNum.textContent = num < 10 ? "0" + num : "" + num;
    dom.counterTotal.textContent = TOTAL;
    dom.progressBar.style.width = ((num - 1) / TOTAL * 100) + "%";
    dom.questionText.textContent = q.question;
    STATE.selectedOption = -1;
    STATE.answered = false;

    dom.optionsContainer.innerHTML = "";

    q.options.forEach(function (opt, i) {
      var btn = document.createElement("button");
      btn.className = "quiz__option";
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", "false");
      btn.setAttribute("tabindex", "0");
      btn.innerHTML =
        '<span class="quiz__option-label">' + OPTION_LABELS[i] + "</span>" +
        '<span class="quiz__option-text">' + opt + "</span>";
      btn.addEventListener("click", function () {
        selectOption(i);
      });
      dom.optionsContainer.appendChild(btn);
    });

    dom.quizCard.classList.remove("quiz__card--exit", "quiz__card--enter");
  }

  function selectOption(index) {
    if (STATE.answered) return;

    STATE.selectedOption = index;
    STATE.answered = true;

    var options = dom.optionsContainer.querySelectorAll(".quiz__option");
    options.forEach(function (opt, i) {
      if (i === index) {
        opt.classList.add("quiz__option--selected");
        opt.setAttribute("aria-checked", "true");
      } else {
        opt.classList.remove("quiz__option--selected");
        opt.setAttribute("aria-checked", "false");
      }
    });

    var q = questionBank[STATE.currentQuestion];
    STATE.userAnswers.push({ id: q.id, selected: index, correct: q.answer });

    if (index === q.answer) {
      STATE.score++;
      showToast(pickRandom(correctFeedback), 1200);
    } else {
      STATE.wrongAnswers.push(q.id);
      var taunt = q.wrongTaunt || pickRandom(wrongFeedback);
      showToast(taunt, 1500);
    }

    setTimeout(function () {
      nextQuestion();
    }, 450);
  }

  function nextQuestion() {
    if (STATE.selectedOption === -1) return;

    dom.quizCard.classList.add("quiz__card--exit");

    setTimeout(function () {
      STATE.currentQuestion++;
      if (STATE.currentQuestion >= TOTAL) {
        showResult();
      } else {
        dom.quizCard.classList.add("quiz__card--enter");
        renderQuestion();
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            dom.quizCard.classList.remove("quiz__card--enter");
          });
        });
      }
    }, 350);
  }

  function buildCategoryComment(wrongIds) {
    if (!wrongIds || wrongIds.length === 0) {
      return categoryComments.almostPerfect;
    }

    var counts = {
      teamHistory: 0,
      tournamentMemory: 0,
      playerLore: 0,
      fanLore: 0
    };

    wrongIds.forEach(function (id) {
      var q = questionBank.find(function (item) { return item.id === id; });
      if (q && counts.hasOwnProperty(q.category)) {
        counts[q.category]++;
      }
    });

    var maxCount = 0;
    var maxCat = "";
    var tied = false;

    Object.keys(counts).forEach(function (cat) {
      if (counts[cat] > maxCount) {
        maxCount = counts[cat];
        maxCat = cat;
        tied = false;
      } else if (counts[cat] === maxCount && maxCount > 0) {
        tied = true;
      }
    });

    if (tied && wrongIds.length >= 2) {
      return categoryComments.balanced;
    }

    if (maxCat && maxCount > 0) {
      return categoryComments[maxCat];
    }

    return categoryComments.balanced;
  }

  function buildCategoryBars() {
    var catTotals = {
      teamHistory: 0,
      tournamentMemory: 0,
      playerLore: 0,
      fanLore: 0
    };
    var catCorrect = {
      teamHistory: 0,
      tournamentMemory: 0,
      playerLore: 0,
      fanLore: 0
    };

    questionBank.forEach(function (q) {
      if (catTotals.hasOwnProperty(q.category)) {
        catTotals[q.category]++;
      }
    });

    STATE.userAnswers.forEach(function (a) {
      var q = questionBank.find(function (item) { return item.id === a.id; });
      if (q && catCorrect.hasOwnProperty(q.category)) {
        if (a.selected === a.correct) {
          catCorrect[q.category]++;
        }
      }
    });

    var html = "";
    Object.keys(catTotals).forEach(function (cat) {
      var total = catTotals[cat];
      var correct = catCorrect[cat];
      var pct = total > 0 ? Math.round((correct / total) * 100) : 0;
      var name = categoryNames[cat] || cat;

      html += '<div class="result__cat-row">' +
        '<span class="result__cat-name">' + name + '</span>' +
        '<div class="result__cat-bar-bg">' +
          '<div class="result__cat-bar-fill" style="width:' + pct + '%"></div>' +
        '</div>' +
        '<span class="result__cat-score">' + correct + '/' + total + '</span>' +
      '</div>';
    });

    dom.categoryBars.innerHTML = html;
  }

  function buildWrongReview() {
    if (STATE.wrongAnswers.length === 0) {
      dom.wrongReview.style.display = "none";
      dom.allCorrect.style.display = "block";
      return;
    }

    dom.wrongReview.style.display = "block";
    dom.allCorrect.style.display = "none";

    var html = "";
    STATE.userAnswers.forEach(function (a) {
      if (a.selected === a.correct) return;

      var q = questionBank.find(function (item) { return item.id === a.id; });
      if (!q) return;

      html += '<div class="result__review-item">' +
        '<div class="result__review-q">Q' + q.id + '. ' + q.question + '</div>' +
        '<div class="result__review-answers">' +
          '<span class="result__review-wrong">你选了 ' + OPTION_LABELS[a.selected] + '. ' + q.options[a.selected] + '</span>' +
          '<span class="result__review-correct">正确答案 ' + OPTION_LABELS[a.correct] + '. ' + q.options[a.correct] + '</span>' +
        '</div>' +
      '</div>';
    });

    dom.wrongReview.innerHTML = html;
  }

  function getResultLevel(score) {
    var level = resultLevels.filter(function (l) {
      return score >= l.min && score <= l.max;
    })[0];
    if (!level) {
      level = resultLevels[resultLevels.length - 1];
    }
    return level;
  }

  function showResult() {
    var score = STATE.score;
    var percent = Math.round((score / TOTAL) * 100);
    var level = getResultLevel(score);

    dom.resultTitle.textContent = level.title;
    dom.resultScore.textContent = "我答对了 " + score + " / " + TOTAL;
    dom.resultQuote.textContent = level.quote;
    dom.resultDesc.textContent = level.description;
    dom.resultCategory.textContent = buildCategoryComment(STATE.wrongAnswers);
    dom.resultSponsor.textContent = pickRandom(randomBottomLines);

    if (score >= 13 && dom.perfectBonus) {
      dom.perfectBonus.style.display = "block";
      dom.perfectBonus.textContent = "你是否也在等那一个BLG贾克斯皮肤？";
    } else if (dom.perfectBonus) {
      dom.perfectBonus.style.display = "none";
    }

    buildCategoryBars();
    buildWrongReview();

    if (score >= 13) {
      dom.resultTitle.classList.add("result__title--ultimate");
    } else {
      dom.resultTitle.classList.remove("result__title--ultimate");
    }

    showPage(dom.result, function () {
      animateRing(percent);
      animateNumber(dom.resultPercent, 0, percent, 1200);
    });
  }

  function animateRing(percent) {
    var circumference = 2 * Math.PI * 85;
    var offset = circumference - (percent / 100) * circumference;
    dom.ringProgress.style.strokeDasharray = circumference;
    dom.ringProgress.style.strokeDashoffset = circumference;

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        dom.ringProgress.style.strokeDashoffset = offset;
      });
    });
  }

  function animateNumber(el, from, to, duration) {
    var start = performance.now();
    function tick(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(from + (to - from) * eased);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }
    requestAnimationFrame(tick);
  }

  function restartQuiz() {
    showPage(dom.intro);
  }

  function buildShareText(level, score) {
    if (!level) return "我刚测了个碧螺春纯度，你也来试试。";
    return level.shareText;
  }

  function copyShareText() {
    var score = STATE.score;
    var level = getResultLevel(score);
    var text = buildShareText(level, score);
    var btnText = dom.btnCopy.querySelector(".btn__text");

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast("复制好了，发吧。");
        btnText.textContent = "已复制，快发";
        setTimeout(function () {
          btnText.textContent = "发出去";
        }, 2000);
      }).catch(function () {
        fallbackCopy(text, btnText);
      });
    } else {
      fallbackCopy(text, btnText);
    }
  }

  function fallbackCopy(text, btnText) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      showToast("复制好了，发吧。");
      btnText.textContent = "已复制，快发";
      setTimeout(function () {
        btnText.textContent = "发出去";
      }, 2000);
    } catch (e) {
      showToast("没复制上，你手动来吧。");
    }
    document.body.removeChild(textarea);
  }

  var toastTimer = null;
  function showToast(msg, duration) {
    dom.toast.textContent = msg;
    dom.toast.classList.add("toast--visible");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      dom.toast.classList.remove("toast--visible");
    }, duration || 2200);
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function handleKeydown(e) {
    if (!dom.quiz.classList.contains("page--active")) return;

    var key = e.key;
    if (key >= "1" && key <= "4") {
      selectOption(parseInt(key) - 1);
    } else if (key === "a" || key === "A") {
      selectOption(0);
    } else if (key === "b" || key === "B") {
      selectOption(1);
    } else if (key === "c" || key === "C") {
      selectOption(2);
    } else if (key === "d" || key === "D") {
      selectOption(3);
    }
  }

  function initParticles() {
    var canvas = dom.canvas;
    var ctx = canvas.getContext("2d");
    var particles = [];
    var particleCount = 50;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.25 + 0.03,
        isBlue: Math.random() > 0.4
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        if (p.isBlue) {
          ctx.fillStyle = "rgba(74,108,247," + p.opacity + ")";
        } else {
          ctx.fillStyle = "rgba(232,67,147," + p.opacity + ")";
        }
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    draw();
  }

  function addRingGradient() {
    var svg = document.querySelector(".result__ring");
    var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    var gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    gradient.setAttribute("id", "ring-gradient");
    gradient.setAttribute("x1", "0%");
    gradient.setAttribute("y1", "0%");
    gradient.setAttribute("x2", "100%");
    gradient.setAttribute("y2", "0%");

    var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#4A6CF7");

    var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#E84393");

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.insertBefore(defs, svg.firstChild);
  }

  function init() {
    cacheDom();
    addRingGradient();
    initParticles();

    dom.btnStart.addEventListener("click", startQuiz);
    dom.btnRestart.addEventListener("click", restartQuiz);
    dom.btnCopy.addEventListener("click", copyShareText);
    document.addEventListener("keydown", handleKeydown);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        dom.intro.classList.add("page--visible");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
