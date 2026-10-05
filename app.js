import { siteData } from "./data.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const escapeHTML = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
const number = (value) => new Intl.NumberFormat("ko-KR").format(value);
const sum = (values) => values.reduce((total, value) => total + value, 0);
const percentage = (part, total) =>
  total ? ((part / total) * 100).toFixed(1) + "%" : "—";

function safeURL(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function externalLink(label, url, className = "") {
  const href = safeURL(url);
  if (!href) return escapeHTML(label);
  return (
    '<a class="' +
    escapeHTML(className) +
    '" href="' +
    escapeHTML(href) +
    '" target="_blank" rel="noopener noreferrer">' +
    escapeHTML(label) +
    ' <span aria-hidden="true">↗</span><span class="sr-only"> (새 창)</span></a>'
  );
}

function citations(ids = []) {
  const links = ids
    .map((id) => siteData.sources.find((source) => source.id === id))
    .filter(Boolean)
    .map((source) => externalLink(source.shortLabel, source.url))
    .join(" ");
  return links ? '<span class="source-citations">' + links + "</span>" : "";
}

function memberEmailLink(address) {
  const email = String(address ?? "").trim();
  if (!/^[^\s@<>&"']+@[^\s@<>&"']+\.[^\s@<>&"']+$/.test(email)) return "";
  return (
    '<a class="member-email" href="mailto:' +
    escapeHTML(encodeURIComponent(email).replace("%40", "@")) +
    '">' +
    escapeHTML(email).replace("@", "@<wbr>") +
    "</a>"
  );
}

function renderCopy() {
  document.title = siteData.title;
  $('meta[name="description"]').content = siteData.description;
  $$("[data-copy]").forEach((element) => {
    const value = element.dataset.copy
      .split(".")
      .reduce((object, key) => object?.[key], siteData);
    if (typeof value === "string") element.textContent = value;
  });
  $(".brand").setAttribute("aria-label", siteData.name + " 처음으로");
  const repository = safeURL(siteData.repository);
  $$("[data-repository]").forEach((element) => {
    element.hidden = !repository;
    if (repository) element.href = repository;
  });
}

function renderTeam() {
  $("#team-list").innerHTML = siteData.team
    .map(
      (member) =>
        '<li class="team-member" data-reveal data-pointer-surface="card"><h3>' +
        (member.link
          ? externalLink(member.name, member.link)
          : escapeHTML(member.name)) +
        "</h3>" +
        (member.role
          ? '<p class="member-role">' + escapeHTML(member.role) + "</p>"
          : "") +
        memberEmailLink(member.email) +
        (member.bio
          ? '<p class="member-bio">' + escapeHTML(member.bio) + "</p>"
          : "") +
        "</li>",
    )
    .join("");
  $("#team-list").setAttribute(
    "aria-label",
    "팀원 " + siteData.team.length + "명",
  );
}

function renderResearch() {
  $("#overview-branches").innerHTML = siteData.classes
    .map(
      (item, index) =>
        '<li class="overview-branch" data-class="' +
        escapeHTML(item.id) +
        '" style="--branch-index:' +
        index +
        '"><span class="overview-branch-link" aria-hidden="true"><span class="overview-signal"></span></span><button class="overview-trigger" type="button" id="overview-trigger-' +
        escapeHTML(item.id) +
        '" data-overview-class="' +
        escapeHTML(item.id) +
        '" aria-label="' +
        escapeHTML(item.id) +
        ' 분류 기준과 후속 작업" aria-expanded="false" aria-controls="overview-detail-' +
        escapeHTML(item.id) +
        '"><span class="overview-class">' +
        escapeHTML(item.id) +
        '</span><span class="overview-workflow" aria-hidden="true">' +
        item.workflow
          .map(
            (step) =>
              '<span class="overview-step">' + escapeHTML(step) + "</span>",
          )
          .join("") +
        '</span></button><div class="overview-detail" id="overview-detail-' +
        escapeHTML(item.id) +
        '" role="region" aria-labelledby="overview-trigger-' +
        escapeHTML(item.id) +
        '" aria-hidden="true" inert><div class="overview-detail-inner"><div class="overview-detail-copy"><p class="overview-detail-title">' +
        escapeHTML(item.title) +
        "</p><p>" +
        escapeHTML(item.rationale) +
        '</p><p class="overview-next"><span>후속 작업</span>' +
        escapeHTML(item.next) +
        "</p></div></div></div></li>",
    )
    .join("");
  $("#background-copy").innerHTML = siteData.overview.paragraphs
    .map(
      (paragraph) =>
        "<p>" +
        escapeHTML(paragraph.text) +
        citations(paragraph.sources) +
        "</p>",
    )
    .join("");
  $("#classification-list").innerHTML = siteData.classes
    .map(
      (item) =>
        '<li class="classification-row" data-reveal><span class="class-code">' +
        escapeHTML(item.id) +
        "</span><div><h3>" +
        escapeHTML(item.title) +
        '</h3><p class="class-description">' +
        escapeHTML(item.description) +
        '</p></div><p class="class-next"><span><span class="sr-only">다음 검토 작업: </span>' +
        escapeHTML(item.next) +
        "</span></p></li>",
    )
    .join("");
  $("#method-list").innerHTML = siteData.implementation.stages
    .map(
      (stage) =>
        "<li><h4>" +
        escapeHTML(stage.title) +
        "</h4><p>" +
        escapeHTML(stage.text) +
        "</p></li>",
    )
    .join("");
  $("#implementation-notes").innerHTML = siteData.implementation.notes
    .map(
      (note) =>
        "<div><h4>" +
        escapeHTML(note.title) +
        "</h4><p>" +
        escapeHTML(note.text) +
        citations(note.sources) +
        "</p></div>",
    )
    .join("");
  $("#limitations").innerHTML = siteData.limitations
    .map(
      (item) =>
        '<article class="limit"><h3>' +
        escapeHTML(item.title) +
        "</h3><p>" +
        escapeHTML(item.text) +
        "</p></article>",
    )
    .join("");
  $("#source-list").innerHTML = siteData.sources
    .map(
      (source) =>
        '<li id="source-' +
        escapeHTML(source.id) +
        '"><div>' +
        externalLink(source.label, source.url) +
        "<p>" +
        escapeHTML(source.note) +
        "</p></div></li>",
    )
    .join("");
  $("#tool-flow").innerHTML = siteData.tool.flow
    .map(
      (step, index) =>
        '<li style="--step-index:' +
        index +
        '"><button class="pipeline-trigger" type="button" id="flow-' +
        escapeHTML(step.id) +
        '" data-pipeline-step="' +
        escapeHTML(step.id) +
        '" aria-expanded="false" aria-controls="pipeline-' +
        escapeHTML(step.id) +
        '"><span class="flow-step-content"><span class="flow-node" aria-hidden="true">' +
        String(index + 1).padStart(2, "0") +
        '</span><span class="flow-title">' +
        escapeHTML(step.title) +
        '</span><span class="flow-label">' +
        escapeHTML(step.label) +
        "</span></span></button>" +
        (index < siteData.tool.flow.length - 1
          ? '<span class="flow-connector" aria-hidden="true"><span class="flow-signal"></span></span>'
          : "") +
        "</li>",
    )
    .join("");
  siteData.tool.flow.forEach((step) => {
    if (!step.notes) return;
    $("#" + step.id + "-notes").innerHTML = step.notes
      .map(
        (note) =>
          "<div><h3>" +
          escapeHTML(note.title) +
          '</h3><p class="body-copy">' +
          escapeHTML(note.text) +
          "</p></div>",
      )
      .join("");
  });
}

function populateTable(selector, headers, rows, footerRows = []) {
  const table = $(selector);
  const caption = table.querySelector("caption")?.outerHTML || "";
  const renderRow = (row) =>
    "<tr>" +
    row
      .map((cell, index) =>
        index === 0
          ? '<th scope="row">' + escapeHTML(cell) + "</th>"
          : "<td>" + escapeHTML(cell) + "</td>",
      )
      .join("") +
    "</tr>";
  table.innerHTML =
    caption +
    "<thead><tr>" +
    headers
      .map((label) => '<th scope="col">' + escapeHTML(label) + "</th>")
      .join("") +
    "</tr></thead><tbody>" +
    rows.map(renderRow).join("") +
    "</tbody>" +
    (footerRows.length
      ? "<tfoot>" + footerRows.map(renderRow).join("") + "</tfoot>"
      : "");
}

function renderResults() {
  const results = siteData.results;
  const classIds = siteData.classes.map((item) => item.id);
  const totals = classIds.map((_, index) =>
    sum(results.datasets.map((row) => row.counts[index])),
  );
  const total = sum(totals);
  const exploration = results.datasets.filter((row) => row.exploration);
  const explorationCounts = Object.fromEntries(
    classIds.map((id, index) => [
      id,
      sum(exploration.map((row) => row.counts[index])),
    ]),
  );
  const explorationTotal = sum(Object.values(explorationCounts));
  const review = sum(
    ["PRIMITIVE", "UNCLEARED", "CONDITIONAL"].map(
      (id) => explorationCounts[id],
    ),
  );
  const x64 = results.positiveControl[1];
  const metrics = [
    {
      value: number(total),
      unit: "",
      label: "평가 드라이버",
      detail: "세 수집원에서 확보한 전체 집합",
    },
    {
      value: number(results.analysisMinutes),
      unit: "분",
      label: "전체 분석 시간",
      detail:
        "약 " +
        ((results.analysisMinutes * 60) / total).toFixed(2) +
        "초 / 건 · 보고서 실측",
    },
    {
      value: percentage(x64.retained, x64.total).replace("%", ""),
      unit: "%",
      label: "x64 취약 표본 유지율",
      detail:
        number(x64.retained) +
        " / " +
        number(x64.total) +
        "건 · 후속 분석 대상",
    },
  ];
  $("#metrics").innerHTML = metrics
    .map(
      (metric) =>
        '<div class="metric"><span class="metric-value">' +
        escapeHTML(metric.value) +
        (metric.unit ? "<small>" + escapeHTML(metric.unit) + "</small>" : "") +
        '</span><p class="metric-label">' +
        escapeHTML(metric.label) +
        '</p><p class="metric-detail">' +
        escapeHTML(metric.detail) +
        "</p></div>",
    )
    .join("");

  const distribution = [
    { label: "후속 검토", count: review, color: "#c7ff6b" },
    {
      label: "개선 후 재분석",
      count: explorationCounts.UNREADABLE,
      color: "#78866e",
    },
    {
      label: "현재 범위에서 제외",
      count: explorationCounts.OUT,
      color: "#394333",
    },
  ];
  $("#distribution-bar").innerHTML = distribution
    .map(
      (part) =>
        '<span aria-hidden="true" style="--bar-share:' +
        (part.count / explorationTotal) * 100 +
        "%;--bar-color:" +
        part.color +
        '"></span>',
    )
    .join("");
  $("#distribution-bar").setAttribute(
    "aria-label",
    distribution
      .map(
        (part) =>
          part.label +
          " " +
          number(part.count) +
          "건, " +
          percentage(part.count, explorationTotal),
      )
      .join(". "),
  );
  $("#distribution-legend").innerHTML = distribution
    .map(
      (part) =>
        '<div class="legend-row" style="--bar-color:' +
        part.color +
        '"><dt>' +
        escapeHTML(part.label) +
        "</dt><dd>" +
        number(part.count) +
        "건<small>" +
        percentage(part.count, explorationTotal) +
        "</small></dd></div>",
    )
    .join("");

  const conditional = results.vm.find((row) => row.class === "CONDITIONAL");
  const stats = {
    review,
    exploration: explorationTotal,
    conditionalLoaded: conditional.loaded,
    conditionalDevices: conditional.devices,
    analysisMinutes: results.analysisMinutes,
    secondsPerDriver: ((results.analysisMinutes * 60) / total).toFixed(2),
    reclassificationSeconds: results.reclassificationSeconds,
  };
  $$("[data-stat]").forEach((element) => {
    const value = stats[element.dataset.stat];
    if (value !== undefined)
      element.textContent = typeof value === "number" ? number(value) : value;
  });

  populateTable(
    "#classification-table",
    ["수집원", ...classIds, "합계"],
    results.datasets.map((row) => [
      row.name,
      ...row.counts.map(number),
      number(sum(row.counts)),
    ]),
    [
      ["합계", ...totals.map(number), number(total)],
      [
        "전체 비율",
        ...totals.map((value) => percentage(value, total)),
        "100.0%",
      ],
    ],
  );
  populateTable(
    "#retention-table",
    ["표본", "전체", "후속 분석 대상", "유지율"],
    results.positiveControl.map((row) => [
      row.label,
      number(row.total),
      number(row.retained),
      percentage(row.retained, row.total),
    ]),
  );
  const vmTotal = {
    class: "합계",
    total: sum(results.vm.map((row) => row.total)),
    loaded: sum(results.vm.map((row) => row.loaded)),
    devices: sum(results.vm.map((row) => row.devices)),
  };
  const vmRow = (row) => [
    row.class,
    number(row.total),
    number(row.loaded),
    percentage(row.loaded, row.total),
    number(row.devices),
    percentage(row.devices, row.loaded),
  ];
  populateTable(
    "#vm-table",
    ["분류", "대상", "로드 성공", "로드율", "디바이스 생성", "생성률"],
    results.vm.map(vmRow),
    [vmRow(vmTotal)],
  );
}

function renderDisclosures() {
  $("#disclosure-list").innerHTML =
    [...siteData.disclosures]
      .sort((a, b) => a.reportedAt.localeCompare(b.reportedAt))
      .map(
        (record) =>
          '<li class="disclosure-record" data-reveal data-pointer-surface="card"><div class="record-identity"><h3 class="record-vendor"><span class="sr-only">벤더: </span>' +
          escapeHTML(record.vendor) +
          '</h3><span class="sr-only">제보일: </span><time class="record-date" datetime="' +
          escapeHTML(record.reportedAt) +
          '">' +
          escapeHTML(record.reportedAt.replaceAll("-", ".")) +
          '</time></div><div class="record-copy"><p><span class="sr-only">핵심 취약점: </span>' +
          escapeHTML(record.description) +
          '</p></div><div class="record-meta"><span class="sr-only">상태: </span><span class="record-status">' +
          escapeHTML(record.status || "—") +
          "</span></div></li>",
      )
      .join("") ||
    '<li class="body-copy">공개 가능한 제보 기록을 준비하고 있습니다.</li>';
}

function renderContact() {
  const contact = siteData.contact;
  const email = contact.email.trim();
  const emailLink = /^[^\s@<>&"']+@[^\s@<>&"']+\.[^\s@<>&"']+$/.test(email)
    ? '<a class="contact-link" href="mailto:' +
      escapeHTML(encodeURIComponent(email)) +
      '">' +
      escapeHTML(email) +
      ' <span aria-hidden="true">↗</span></a>'
    : "";
  const links = contact.links
    .filter((link) => safeURL(link.url))
    .map((link) => externalLink(link.label, link.url, "contact-link"))
    .join("");
  $("#contact-links").innerHTML =
    emailLink || links
      ? '<div class="contact-links">' + emailLink + links + "</div>"
      : '<p class="contact-placeholder">' +
        escapeHTML(contact.emptyMessage) +
        "</p>";
}

renderCopy();
renderTeam();
renderResearch();
renderResults();
renderDisclosures();
renderContact();

// Motion is event-driven. Ambient CSS loops pause outside the viewport.
const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const motionButtons = $$(".motion-toggle");
const hero = $(".hero");
const heroArt = $(".hero-art");
const windowStage = $(".window-stage");
const siteHeader = $(".site-header");
const toolFlow = $(".tool-flow");
const overviewFlow = $("#overview-flow");
const overviewTriggers = $$("[data-overview-class]");
const overviewDetails = $$(".overview-detail");
let activeOverviewClass = null;
let overviewActivation = null;
let overviewHoverTarget = null;
const flowSteps = $$(".tool-flow li");
const pipelineTriggers = $$("[data-pipeline-step]");
const pipelinePanels = $$(".pipeline-panel");
let activePipelineStep = null;
let pipelineActivated = false;
let pipelineHoverTarget = null;
let lastPointerPoint = null;
let pointerMoved = false;
const classRows = $$(".classification-row");
const navLinks = $$(".main-nav a");
const sections = navLinks
  .map((link) => $(link.getAttribute("href")))
  .filter(Boolean);
let motionPreference = null;
try {
  motionPreference = localStorage.getItem("trace-motion");
} catch {
  /* Optional storage. */
}
const motionEnabled = () =>
  !reducedMotion.matches && motionPreference !== "off";
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
let revealObserver;
let frame = 0;
let scrollDirty = true;
let pointerDirty = false;
let pointerSurface = null;
let pointerPosition = { x: 0, y: 0 };

// Wrap existing heading nodes, retaining text, emphasis and accessible names.
$$(".section-heading h2").forEach((heading) => {
  const lines = [];
  let nodes = [];
  const addLine = () => {
    if (!nodes.some((node) => node.textContent.trim())) {
      nodes = [];
      return;
    }
    const line = document.createElement("span");
    const inner = document.createElement("span");
    line.className = "heading-line";
    line.style.setProperty("--line-index", lines.length);
    inner.append(...nodes);
    line.append(inner);
    lines.push(line);
    nodes = [];
  };
  [...heading.childNodes].forEach((node) => {
    if (node.nodeName === "BR") addLine();
    else nodes.push(node);
  });
  addLine();
  heading.replaceChildren(...lines);
});
$$(".team-member").forEach((element, index) =>
  element.style.setProperty("--reveal-delay", index * 85 + "ms"),
);
classRows.forEach((element, index) =>
  element.style.setProperty("--reveal-delay", (index % 3) * 45 + "ms"),
);
$$(".disclosure-record").forEach((element, index) =>
  element.style.setProperty("--reveal-delay", index * 90 + "ms"),
);
$$(".metric").forEach((element, index) =>
  element.style.setProperty("--metric-index", index),
);

function updateScroll() {
  const viewport = window.innerHeight;
  const scrollRange = root.scrollHeight - viewport;
  const heroRect = hero.getBoundingClientRect();
  const artRect = windowStage.getBoundingClientRect();
  const flowRect = toolFlow.getBoundingClientRect();
  const overviewRect = overviewFlow.getBoundingClientRect();
  root.style.setProperty(
    "--reading-progress",
    String(scrollRange > 0 ? clamp(window.scrollY / scrollRange) : 0),
  );
  heroArt.style.setProperty(
    "--ambient-state",
    motionEnabled() &&
      !document.hidden &&
      artRect.bottom > siteHeader.offsetHeight &&
      artRect.top < viewport
      ? "running"
      : "paused",
  );
  for (const [element, rect] of [
    [toolFlow, flowRect],
    [overviewFlow, overviewRect],
  ]) {
    element.style.setProperty(
      "--flow-state",
      motionEnabled() &&
        !document.hidden &&
        rect.bottom > siteHeader.offsetHeight &&
        rect.top < viewport
        ? "running"
        : "paused",
    );
  }

  if (motionEnabled()) {
    overviewFlow.style.setProperty(
      "--overview-progress",
      clamp((viewport * 0.85 - overviewRect.top) / (viewport * 0.45)).toFixed(
        3,
      ),
    );
    const amount = clamp(-heroRect.top / Math.max(1, heroRect.height * 0.65));
    const smallScreen = window.innerWidth <= 560;
    heroArt.style.setProperty(
      "--art-y",
      amount * (smallScreen ? 30 : 95) + "px",
    );
    heroArt.style.setProperty(
      "--scroll-spread",
      amount * (smallScreen ? 21 : 42) + "px",
    );
    heroArt.style.setProperty("--scroll-turn", amount * 43 + "deg");
    heroArt.style.setProperty("--scroll-roll", amount * 23 + "deg");
    heroArt.style.setProperty("--art-scale", 1 - amount * 0.14);
    hero.style.setProperty(
      "--title-x",
      amount * (smallScreen ? 12 : 38) + "px",
    );
    hero.style.setProperty(
      "--title-y",
      amount * (smallScreen ? 18 : 45) + "px",
    );

    let activeRow = null;
    let nearest = Infinity;
    classRows.forEach((row) => {
      if (!row.getClientRects().length) return;
      const rect = row.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height * 0.5 - viewport * 0.52);
      row.style.setProperty(
        "--row-progress",
        clamp((viewport * 0.78 - rect.top) / (viewport * 0.43)).toFixed(3),
      );
      if (rect.bottom > 90 && rect.top < viewport && distance < nearest) {
        activeRow = row;
        nearest = distance;
      }
    });
    classRows.forEach((row) =>
      row.classList.toggle("is-current", row === activeRow),
    );
    const progress = clamp(
      (viewport * 0.76 - flowRect.top) / (flowRect.height + viewport * 0.1),
    );
    toolFlow.style.setProperty("--flow-progress", progress.toFixed(3));
    const activeStep = Math.min(
      flowSteps.length - 1,
      Math.floor(progress * flowSteps.length),
    );
    flowSteps.forEach((step, index) => {
      step.style.setProperty(
        "--segment-progress",
        clamp(progress * (flowSteps.length - 1) - index).toFixed(3),
      );
      step.classList.toggle(
        "is-current",
        !activePipelineStep &&
          progress > 0 &&
          flowRect.bottom > 80 &&
          index === activeStep,
      );
    });
  }

  // The final short section may never reach the normal activation line.
  const atPageEnd = scrollRange > 0 && window.scrollY >= scrollRange - 2;
  const current = atPageEnd
    ? sections.at(-1)
    : sections
        .filter(
          (section) =>
            section.getBoundingClientRect().top <=
            Math.max(140, viewport * 0.3),
        )
        .at(-1);
  navLinks.forEach((link) => {
    if (current && link.hash === "#" + current.id)
      link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

function updatePointer() {
  if (!pointerSurface || !motionEnabled() || !finePointer.matches) return;
  const rect = pointerSurface.getBoundingClientRect();
  const x = clamp(
    ((pointerPosition.x - rect.left) / rect.width) * 2 - 1,
    -1,
    1,
  );
  const y = clamp(
    ((pointerPosition.y - rect.top) / rect.height) * 2 - 1,
    -1,
    1,
  );
  pointerSurface.style.setProperty("--pointer-x", (x + 1) * 50 + "%");
  pointerSurface.style.setProperty("--pointer-y", (y + 1) * 50 + "%");
  if (pointerSurface === heroArt) {
    pointerSurface.style.setProperty("--aim-x", x * 18 + "deg");
    pointerSurface.style.setProperty("--aim-y", y * -15 + "deg");
  } else {
    pointerSurface.style.setProperty(
      "--tilt-axis",
      -y + " " + (x || 0.001) + " 0",
    );
    pointerSurface.style.setProperty(
      "--tilt-angle",
      Math.hypot(x, y) * 1.3 + "deg",
    );
  }
}

function scheduleFrame() {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    if (scrollDirty) {
      scrollDirty = false;
      updateScroll();
    }
    if (pointerDirty) {
      pointerDirty = false;
      updatePointer();
    }
  });
}

function requestScrollUpdate() {
  scrollDirty = true;
  scheduleFrame();
}

function clearPointer() {
  if (!pointerSurface) return;
  pointerSurface.classList.remove("is-pointer-active");
  [
    "--pointer-x",
    "--pointer-y",
    "--aim-x",
    "--aim-y",
    "--tilt-axis",
    "--tilt-angle",
  ].forEach((property) => pointerSurface.style.removeProperty(property));
  pointerSurface = null;
  pointerDirty = false;
}

$$("[data-pointer-surface]").forEach((surface) => {
  surface.addEventListener(
    "pointermove",
    (event) => {
      if (
        !motionEnabled() ||
        !finePointer.matches ||
        event.pointerType === "touch"
      )
        return;
      if (pointerSurface !== surface) {
        clearPointer();
        pointerSurface = surface;
        surface.classList.add("is-pointer-active");
      }
      pointerPosition = { x: event.clientX, y: event.clientY };
      pointerDirty = true;
      scheduleFrame();
    },
    { passive: true },
  );
  surface.addEventListener("pointerleave", () => {
    if (pointerSurface === surface) clearPointer();
  });
  surface.addEventListener("pointercancel", clearPointer);
});

function configureMotion() {
  revealObserver?.disconnect();
  clearPointer();
  const enabled = motionEnabled();
  const canReveal = enabled && "IntersectionObserver" in window;
  root.classList.toggle("motion-enabled", enabled);
  root.classList.toggle("reveal-ready", canReveal);
  root.classList.toggle("motion-disabled", !enabled);
  motionButtons.forEach((button) => {
    button.hidden = false;
    button.disabled = reducedMotion.matches;
    button.textContent = reducedMotion.matches
      ? "시스템: 모션 줄임"
      : enabled
        ? "모션 끄기"
        : "모션 켜기";
    button.setAttribute("aria-pressed", String(!enabled));
    button.setAttribute(
      "aria-label",
      reducedMotion.matches
        ? "운영체제의 모션 줄이기 설정 적용 중"
        : enabled
          ? "스크롤·호버 모션 끄기"
          : "스크롤·호버 모션 켜기",
    );
  });
  if (!enabled) {
    [
      "--art-y",
      "--scroll-spread",
      "--scroll-turn",
      "--scroll-roll",
      "--art-scale",
    ].forEach((property) => heroArt.style.removeProperty(property));
    ["--title-x", "--title-y"].forEach((property) =>
      hero.style.removeProperty(property),
    );
    classRows.forEach((row) => {
      row.style.removeProperty("--row-progress");
      row.classList.remove("is-current");
    });
    flowSteps.forEach((step) => {
      step.classList.remove("is-current");
      step.style.removeProperty("--segment-progress");
    });
    toolFlow.style.removeProperty("--flow-progress");
    overviewFlow.style.removeProperty("--overview-progress");
  }
  if (canReveal) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" },
    );
    $$("[data-reveal]").forEach((element) => {
      // Re-enabling motion never hides content the reader has already passed.
      if (
        element.getClientRects().length &&
        element.getBoundingClientRect().top < window.innerHeight - 24
      )
        element.classList.add("is-visible");
      if (!element.classList.contains("is-visible"))
        revealObserver.observe(element);
    });
  }
  requestScrollUpdate();
}

// Keep hover content open for reading, scrolling and moving into its links.
// Touch/keyboard activation toggles it; Escape and the close button dismiss it.
function setPipelineStep(id, activated = false) {
  activePipelineStep = id;
  pipelineActivated = activated;
  pipelineTriggers.forEach((trigger) => {
    const selected = trigger.dataset.pipelineStep === id;
    trigger.setAttribute("aria-expanded", String(selected));
    trigger.closest("li").classList.toggle("is-selected", selected);
  });
  pipelinePanels.forEach((panel) => {
    panel.hidden = panel.id !== "pipeline-" + id;
  });
  requestScrollUpdate();
}

function closePipeline() {
  const trigger = pipelineTriggers.find(
    (button) => button.dataset.pipelineStep === activePipelineStep,
  );
  const restoreFocus = pipelinePanels.some((panel) =>
    panel.contains(document.activeElement),
  );
  setPipelineStep(null);
  if (restoreFocus) trigger?.focus();
}

// The first pointer move into a browser can report movementX/Y as zero.
// Compare viewport coordinates so that it still opens a hover explanation,
// without treating scroll/layout changes beneath a stationary mouse as input.
document.addEventListener(
  "pointermove",
  (event) => {
    pointerMoved =
      !lastPointerPoint ||
      event.clientX !== lastPointerPoint.x ||
      event.clientY !== lastPointerPoint.y;
    lastPointerPoint = { x: event.clientX, y: event.clientY };
  },
  { capture: true, passive: true },
);

// Pointer-opened boxes collapse on exit, including exit from the expanded copy.
// Touch/keyboard activation stays open until toggled or dismissed with Escape.
// Layout-induced pointer events do not open a different box.
function setOverviewClass(id, activation = null) {
  activeOverviewClass = id;
  overviewActivation = id ? activation : null;
  overviewTriggers.forEach((trigger) => {
    const expanded = trigger.dataset.overviewClass === id;
    const detail = document.getElementById(
      trigger.getAttribute("aria-controls"),
    );
    trigger.setAttribute("aria-expanded", String(expanded));
    trigger
      .closest(".overview-branch")
      .classList.toggle("is-expanded", expanded);
    detail.setAttribute("aria-hidden", String(!expanded));
    detail.inert = !expanded;
  });
  requestScrollUpdate();
}

overviewTriggers.forEach((trigger) => {
  const branch = trigger.closest(".overview-branch");
  branch.addEventListener("pointermove", (event) => {
    const id = trigger.dataset.overviewClass;
    if (
      !finePointer.matches ||
      event.pointerType === "touch" ||
      !pointerMoved ||
      overviewHoverTarget === id ||
      activeOverviewClass === id
    )
      return;
    if (
      overviewDetails.some((detail) => detail.contains(document.activeElement))
    )
      return;
    overviewHoverTarget = id;
    setOverviewClass(id);
  });
  branch.addEventListener("pointerleave", (event) => {
    const id = trigger.dataset.overviewClass;
    if (overviewHoverTarget === id) overviewHoverTarget = null;
    if (
      activeOverviewClass === id &&
      event.pointerType !== "touch" &&
      finePointer.matches &&
      overviewActivation !== "keyboard" &&
      overviewActivation !== "touch"
    ) {
      setOverviewClass(null);
    }
  });
  trigger.addEventListener("click", (event) => {
    const id = trigger.dataset.overviewClass;
    const activation =
      event.detail === 0
        ? "keyboard"
        : event.pointerType === "touch" || !finePointer.matches
          ? "touch"
          : "pointer";
    setOverviewClass(
      activeOverviewClass === id && overviewActivation ? null : id,
      activation,
    );
  });
});

pipelineTriggers.forEach((trigger) => {
  const step = trigger.closest("li");
  // Scrolling/revealing a different row beneath a stationary pointer is not a selection.
  step.addEventListener("pointermove", (event) => {
    if (
      !finePointer.matches ||
      event.pointerType === "touch" ||
      !pointerMoved ||
      pipelineHoverTarget === trigger.dataset.pipelineStep ||
      activePipelineStep === trigger.dataset.pipelineStep
    )
      return;
    // Do not hide a panel while a keyboard user is interacting with it.
    if (pipelinePanels.some((panel) => panel.contains(document.activeElement)))
      return;
    pipelineHoverTarget = trigger.dataset.pipelineStep;
    setPipelineStep(trigger.dataset.pipelineStep);
  });
  step.addEventListener("pointerleave", () => {
    if (pipelineHoverTarget === trigger.dataset.pipelineStep)
      pipelineHoverTarget = null;
  });
  trigger.addEventListener("click", () => {
    const id = trigger.dataset.pipelineStep;
    setPipelineStep(
      activePipelineStep === id && pipelineActivated ? null : id,
      true,
    );
  });
});
$$("[data-pipeline-close]").forEach((button) =>
  button.addEventListener("click", closePipeline),
);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && (activePipelineStep || activeOverviewClass)) {
    event.preventDefault();
    if (activeOverviewClass) setOverviewClass(null);
    if (activePipelineStep) closePipeline();
  }
});

motionButtons.forEach((button) =>
  button.addEventListener("click", () => {
    motionPreference = motionEnabled() ? "off" : "on";
    try {
      localStorage.setItem("trace-motion", motionPreference);
    } catch {
      /* Optional storage. */
    }
    configureMotion();
  }),
);
reducedMotion.addEventListener("change", configureMotion);
finePointer.addEventListener("change", clearPointer);
window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate, { passive: true });
window.addEventListener("load", requestScrollUpdate, { once: true });
document.addEventListener("visibilitychange", () => {
  if (document.hidden) clearPointer();
  requestScrollUpdate();
});
$$("details").forEach((detail) =>
  detail.addEventListener("toggle", requestScrollUpdate),
);
if ("ResizeObserver" in window)
  new ResizeObserver(requestScrollUpdate).observe(document.body);
document.fonts?.ready.then(requestScrollUpdate);
document.addEventListener("focusin", (event) => {
  event.target.closest?.("[data-reveal]")?.classList.add("is-visible");
});
configureMotion();
