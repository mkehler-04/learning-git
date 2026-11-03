(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const GREEN = "#2f8a4a";
  const GOLD = "#b8862b";

  function type(tl, el, text, pos) {
    const state = { n: 0 };
    tl.to(state, {
      n: text.length,
      duration: Math.min(1.4, text.length * 0.035),
      ease: "none",
      onStart: () => { el.textContent = ""; },
      onUpdate: () => { el.textContent = text.slice(0, Math.round(state.n)); },
    }, pos);
  }

  function draw(tl, els, pos, vars = {}) {
    gsap.set(els, { strokeDasharray: (i, el) => el.getTotalLength() });
    tl.fromTo(els,
      { strokeDashoffset: (i, el) => el.getTotalLength() },
      { strokeDashoffset: 0, duration: 0.8, ease: "power1.inOut", ...vars },
      pos);
  }

  function pop(tl, els, pos, vars = {}) {
    tl.from(els, {
      scale: 0, transformOrigin: "50% 50%", duration: 0.45, ease: "back.out(2)", stagger: 0.12, ...vars,
    }, pos);
  }

  function fadeIn(tl, els, pos, vars = {}) {
    tl.from(els, { opacity: 0, y: 10, duration: 0.45, stagger: 0.1, ...vars }, pos);
  }

  function pulse(tl, el, pos) {
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.01 }, pos);
    tl.fromTo(el, { scale: 1, transformOrigin: "50% 50%" }, { scale: 1.9, duration: 0.7 }, "<");
    tl.to(el, { opacity: 0, duration: 0.7 }, "<");
  }

  const builders = {
    repo({ one, all, tl }) {
      const cmd = one("cmd");
      fadeIn(tl, one("folder"));
      type(tl, cmd, "$ git init", "<");
      pop(tl, one("gitbadge"));
      fadeIn(tl, all("file"), "-=0.1", { x: -16, y: 0 });
      type(tl, cmd, '$ git add . && git commit -m "first"', "+=0.2");
      pop(tl, all("tick"));
      type(tl, cmd, "$ git remote add origin … && git push", "+=0.3");
      tl.from(one("link"), { opacity: 0, duration: 0.3 });
      tl.from(one("remote"), { opacity: 0, scale: 0.85, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(1.6)" }, "<");
      tl.fromTo(one("packet"), { x: 0, opacity: 0 }, { x: 86, opacity: 1, duration: 0.6, ease: "power1.in", repeat: 2 });
      tl.to(one("packet"), { opacity: 0, duration: 0.2 });
      tl.to(one("remote-box"), { stroke: GOLD, duration: 0.3, yoyo: true, repeat: 1 }, "<");
    },

    clone({ one, tl }) {
      fadeIn(tl, one("remote"));
      fadeIn(tl, one("laptop"), "<0.15");
      type(tl, one("cmd"), "$ git clone https://github.com/you/project.git");
      tl.fromTo(one("path"), { opacity: 0 }, { opacity: 1, duration: 0.3 });
      tl.fromTo(one("copy"), { opacity: 0 }, { opacity: 1, duration: 0.2 }, "<");
      tl.to(one("copy"), { x: -240, y: 60, duration: 1.3, ease: "power2.inOut" }, "<");
      tl.to(one("path"), { strokeDashoffset: -56, duration: 1.3, ease: "none" }, "<");
      fadeIn(tl, one("done"));
    },

    branch({ one, all, tl }) {
      const cmd = one("cmd");
      const head = one("head");
      draw(tl, one("main"));
      pop(tl, all("mc"), "-=0.4");
      fadeIn(tl, one("mlabel"), "<");
      type(tl, cmd, "$ git switch -c feature/login");
      draw(tl, one("fpath"), undefined, { duration: 1 });
      pop(tl, one("flabel"), "-=0.4");
      type(tl, cmd, '$ git commit -m "…"');
      all("fc").forEach((c, i) => {
        pop(tl, c, i ? "+=0.2" : "<");
        if (i === 0) tl.from(head, { opacity: 0, duration: 0.3 }, "<");
        else tl.to(head, { x: 70 * i, duration: 0.4, ease: "power2.inOut" }, "<");
      });
      pop(tl, one("mc2"), "+=0.3");
      fadeIn(tl, one("note"), "<");
    },

    commit({ one, all, tl }) {
      const cmd = one("cmd");
      const files = all("file");
      fadeIn(tl, all("zonelabel"), 0, { y: 0 });
      fadeIn(tl, files, "<", { x: -16, y: 0 });
      type(tl, cmd, "$ git add .");
      tl.to(files, { x: 160, duration: 0.7, stagger: 0.12, ease: "power2.inOut" });
      type(tl, cmd, '$ git commit -m "feat: add login"', "+=0.3");
      tl.to(files, {
        x: 310, y: (i) => [46, 2, -42][i], scale: 0.2, opacity: 0,
        transformOrigin: "50% 50%", duration: 0.6, stagger: 0.08, ease: "power2.in",
      });
      pop(tl, one("commit"), "-=0.15");
      pulse(tl, one("ring"), "<");
      fadeIn(tl, [one("hash"), one("msg"), one("meta")]);
    },

    pushpull({ one, tl }) {
      const cmd = one("cmd");
      fadeIn(tl, [one("local"), one("remote")], 0);
      pop(tl, one("lnew"));
      type(tl, cmd, "$ git push");
      tl.fromTo(one("up"), { opacity: 0 }, { opacity: 1, duration: 0.1 });
      tl.to(one("up"), { x: 260, y: -90, duration: 1, ease: "power2.inOut" });
      fadeIn(tl, one("pushlbl"), "<");
      draw(tl, one("rext1"), "-=0.2", { duration: 0.3 });
      pop(tl, one("rnew"), "<");
      tl.to(one("up"), { opacity: 0, duration: 0.1 }, "<");
      draw(tl, one("rext2"), "+=0.6", { duration: 0.3 });
      pop(tl, one("rteam"));
      fadeIn(tl, one("teamlbl"), "<");
      type(tl, cmd, "$ git pull", "+=0.4");
      tl.fromTo(one("down"), { opacity: 0 }, { opacity: 1, duration: 0.1 });
      tl.to(one("down"), { x: -260, y: 90, duration: 1, ease: "power2.inOut" });
      fadeIn(tl, one("pulllbl"), "<");
      draw(tl, one("lext"), "-=0.2", { duration: 0.3 });
      pop(tl, one("lpulled"), "<");
      tl.to(one("down"), { opacity: 0, duration: 0.1 }, "<");
    },

    diff({ one, all, tl }) {
      const scan = one("scan");
      fadeIn(tl, all("panel"), 0, { stagger: 0.15 });
      type(tl, one("cmd"), "$ git diff main..feature");
      tl.fromTo(scan, { y: 0, opacity: 0 }, { opacity: 0.7, duration: 0.15 });
      tl.to(scan, { y: 120, duration: 1.6, ease: "none" });
      tl.from(all("hl"), { scaleX: 0, transformOrigin: "0% 50%", duration: 0.4, stagger: 0.25 }, "<0.3");
      pop(tl, all("mark"), "<", { stagger: 0.25 });
      tl.to(scan, { opacity: 0, duration: 0.2 });
      fadeIn(tl, one("sum"));
    },

    merge({ one, all, tl }) {
      draw(tl, one("main"), 0);
      draw(tl, one("fpath"), "-=0.3");
      pop(tl, all("c"), "-=0.6", { stagger: 0.08 });
      fadeIn(tl, [one("mlabel"), one("flabel")], "<");
      type(tl, one("cmd"), "$ git switch main && git merge feature/login");
      draw(tl, one("mpath"));
      pop(tl, one("mc"));
      pulse(tl, one("ring"), "<");
      fadeIn(tl, one("note"));
    },

    rebase({ one, all, tl }) {
      const feature = all("f");
      draw(tl, one("main"), 0);
      pop(tl, all("m0"), "-=0.4");
      draw(tl, one("old"));
      pop(tl, feature, "-=0.3");
      fadeIn(tl, one("flab"), "<");
      pop(tl, one("m1"), "+=0.2");
      fadeIn(tl, one("clab"), "<");
      type(tl, one("cmd"), "$ git rebase main", "+=0.3");
      tl.fromTo(all("ghost"), { opacity: 0 }, { opacity: 1, duration: 0.3 });
      tl.to(one("old"), { opacity: 0.15, duration: 0.4 }, "<");
      tl.to(feature, { x: 170, duration: 1, stagger: 0.25, ease: "power2.inOut" });
      tl.to(one("flab"), { x: 170, duration: 1, ease: "power2.inOut" }, "<");
      tl.to(all("orig"), { opacity: 0, duration: 0.3 }, "-=0.4");
      tl.fromTo(all("prime"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, "<");
      draw(tl, one("new"), "<");
      fadeIn(tl, one("note"));
    },

    conflict({ one, all, tl }) {
      const lines = all("cl");
      const panel = one("panel");
      fadeIn(tl, all("card"), 0, { stagger: 0.15 });
      type(tl, one("cmd"), "$ git merge feature/greeting");
      tl.to(all("card"), { y: 60, x: (i) => (i ? -70 : 70), opacity: 0, duration: 0.7, ease: "power2.in" });
      tl.from(panel, { opacity: 0, scale: 0.92, transformOrigin: "50% 50%", duration: 0.4 }, "-=0.2");
      fadeIn(tl, lines, "<", { stagger: 0.08, y: 0 });
      pop(tl, one("warn"));
      tl.to(panel, { x: 6, duration: 0.05, repeat: 7, yoyo: true, ease: "none" }, "<");
      tl.from(one("pick"), { opacity: 0, duration: 0.3 }, "+=0.6");
      tl.to([lines[0], lines[1], lines[2], lines[4]], { opacity: 0, duration: 0.4 }, "+=0.4");
      tl.to(one("pick"), { opacity: 0, duration: 0.3 }, "<");
      tl.to(lines[3], { y: -60, duration: 0.5, ease: "power2.inOut" });
      tl.to(one("prect"), { stroke: GREEN, duration: 0.4 }, "<");
      tl.to(one("warn"), { opacity: 0, duration: 0.3 }, "<");
      pop(tl, one("ok"));
    },

    pr({ one, all, tl }) {
      fadeIn(tl, one("branch"), 0);
      draw(tl, one("a1"), undefined, { duration: 0.4 });
      fadeIn(tl, one("card"));
      pop(tl, one("open"));
      pop(tl, one("av"), "+=0.2");
      fadeIn(tl, one("bubble"));
      fadeIn(tl, all("check"), "+=0.2", { stagger: 0.35 });
      pop(tl, one("btn"));
      tl.to(one("btn"), { scale: 0.94, transformOrigin: "50% 50%", duration: 0.1, yoyo: true, repeat: 1 }, "+=0.3");
      tl.to(one("open"), { opacity: 0, duration: 0.2 });
      tl.from(one("merged"), { opacity: 0, scale: 0.6, transformOrigin: "50% 50%", duration: 0.35, ease: "back.out(2)" }, "<");
      draw(tl, one("a2"), undefined, { duration: 0.4 });
      pop(tl, one("mnode"));
      pulse(tl, one("ring"), "<");
    },

    issue({ one, all, tl }) {
      fadeIn(tl, one("card"), 0);
      pop(tl, one("open"));
      pop(tl, all("tag"), "<0.1");
      pop(tl, one("assignee"));
      fadeIn(tl, all("row"), undefined, { stagger: 0.12, x: -10, y: 0 });
      all("tick").forEach((t, i) => draw(tl, t, i ? "+=0.25" : "+=0.3", { duration: 0.3 }));
      draw(tl, one("link"), "+=0.2", { duration: 0.4 });
      fadeIn(tl, one("pr"), "-=0.1", { x: 12, y: 0 });
      tl.to(one("open"), { opacity: 0, duration: 0.2 }, "+=0.5");
      tl.from(one("closed"), { opacity: 0, scale: 0.6, transformOrigin: "50% 50%", duration: 0.35, ease: "back.out(2)" }, "<");
      fadeIn(tl, one("note"));
    },
  };

  function init() {
    // Without GSAP the SVGs simply show their final, static state.
    if (!window.gsap) return;

    const timelines = new Map();
    const observer = reduceMotion ? null : new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const tl = timelines.get(entry.target);
        if (entry.isIntersecting) tl.play();
        else tl.pause();
      });
    }, { threshold: 0.3 });

    document.querySelectorAll("svg[data-viz]").forEach((svg) => {
      const build = builders[svg.dataset.viz];
      if (!build) return;

      const one = (name) => svg.querySelector(`[data-el="${name}"]`);
      const all = (name) => svg.querySelectorAll(`[data-el="${name}"]`);
      const tl = gsap.timeline({ paused: true, repeat: reduceMotion ? 0 : -1, repeatDelay: 2.2 });

      build({ one, all, tl });
      timelines.set(svg, tl);

      if (reduceMotion) tl.progress(1);
      else observer.observe(svg);

      svg.closest("figure")?.querySelector(".replay")?.addEventListener("click", () => tl.restart());
    });
  }

  init();
})();
