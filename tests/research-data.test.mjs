import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { siteData } from "../data.js";

const expectedClasses = [
  "PRIMITIVE",
  "UNCLEARED",
  "CONDITIONAL",
  "UNREADABLE",
  "OUT",
];
const add = (values) => values.reduce((total, value) => total + value, 0);
const ratio = (part, total) => ((part / total) * 100).toFixed(1);
const totals = siteData.classes.map((_, i) =>
  add(siteData.results.datasets.map((row) => row.counts[i])),
);
const exploration = siteData.classes.map((_, i) =>
  add(
    siteData.results.datasets
      .filter((row) => row.exploration)
      .map((row) => row.counts[i]),
  ),
);

test("the page places the team before contact in the requested five-part order", async () => {
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  const sections = [...html.matchAll(/<section\b([\s\S]*?)>/g)].map((match) => {
    return match[1].match(/\bid="([^"]+)"/)?.[1] ?? "hero";
  });
  assert.deepEqual(sections, [
    "hero",
    "results",
    "disclosures",
    "team",
    "contact",
  ]);
  const nav = html.match(/<nav class="main-nav"[\s\S]*?<\/nav>/)[0];
  assert.deepEqual(
    [...nav.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]),
    sections.slice(1),
  );
  assert.equal(siteData.title, "Driver exploit pipeline for BYOVD");
  assert.deepEqual(
    siteData.team.map((member) => member.name),
    ["김태우", "심준호", "안유정", "황연우"],
  );
});

test("team roles and emails match the supplied names without reordering members", () => {
  assert.deepEqual(
    siteData.team.map(({ name, role, email }) => [name, role, email]),
    [
      ["김태우", "PM | Lead", "dlaha171@gmail.com"],
      ["심준호", "STRATEGY | Threat Intel", "lucas0712@naver.com"],
      ["안유정", "TECH | Reversing", "yujeong_0720@naver.com"],
      ["황연우", "TECH | Pwnable", "yeonwoo040323@gmail.com"],
    ],
  );
});

test("team cards start with the name without a numbered prefix", async () => {
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  const teamRenderer = app.slice(
    app.indexOf("function renderTeam()"),
    app.indexOf("function renderResearch()"),
  );
  assert.doesNotMatch(teamRenderer, /member-number|padStart/);
  assert.ok(
    teamRenderer.includes(
      '<li class="team-member" data-reveal data-pointer-surface="card"><h3>',
    ),
  );
});

test("Contact Us keeps its links area without the removed invitation", async () => {
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  assert.equal(siteData.contact.description, undefined);
  assert.ok(html.includes('id="contact-links"'));
  assert.doesNotMatch(
    html,
    /data-copy="contact.description"|연구에 대한 질문이나 협업 제안을 기다립니다/,
  );
});

test("pipeline stages have distinct controls and preserve the core idea", async () => {
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  assert.deepEqual(
    siteData.tool.flow.map(({ id, title }) => [id, title]),
    [
      ["acquisition", "Acquisition"],
      ["analysis", "Analysis"],
      ["classify", "Classify"],
    ],
  );
  for (const step of siteData.tool.flow) {
    assert.ok(html.includes('id="pipeline-' + step.id + '"'));
    assert.ok(html.includes('aria-labelledby="flow-' + step.id + '"'));
  }
  assert.deepEqual(
    siteData.tool.flow[1].notes.map((note) => note.title),
    ["PE Parsing", "Disassemble"],
  );
  assert.equal(siteData.tool.flow[0].notes.length, 2);
  const classify = html.slice(
    html.indexOf('id="pipeline-classify"'),
    html.indexOf('id="metrics"'),
  );
  for (const id of [
    "idea-title",
    "classification-list",
    "implementation",
    "background-copy",
    "method-list",
    "implementation-notes",
    "source-list",
  ]) {
    assert.ok(
      classify.includes('id="' + id + '"'),
      id + " must remain inside Classify",
    );
  }
  assert.ok(!html.includes('href="#idea"'));
  assert.ok(!html.includes("02 / THE IDEA"));
});

test("requested copy is concise and section numbers remain consecutive", async () => {
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  assert.ok(html.includes('<h2 id="team-title">Our Team</h2>'));
  const pipelineTitle = html.match(
    /<h2 id="results-title">([\s\S]*?)<\/h2>/,
  )[1];
  assert.ok(
    pipelineTitle.includes('Pipeline <span class="accent">Overview</span>'),
  );
  assert.ok(!pipelineTitle.includes("<br"));
  assert.ok(html.includes("for review."));
  assert.ok(html.includes('<h2 id="disclosures-title">Reports</h2>'));
  assert.ok(html.includes("01 / EVALUATION"));
  assert.ok(html.includes("02 / RESPONSIBLE DISCLOSURE"));
  assert.ok(html.includes("03 / THE TEAM"));
  assert.ok(html.includes("04 / GET IN TOUCH"));
  assert.ok(!html.includes("hero.description"));
  assert.ok(!html.includes("hero-link"));
  assert.ok(!html.includes("네 명의 팀원이 함께 분석하고"));
  assert.equal(siteData.hero.description, undefined);
});

test("section introductions use the requested shorter copy", async () => {
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  assert.equal(
    siteData.results.intro,
    "DrvTriage가 분석 근거에 따라 다섯 가지로 분류하고, 각 분류에 맞는 후속 작업을 안내합니다.",
  );
  assert.ok(
    !html.includes("제보 사례의 핵심 취약점과 설명 기반 분류를 정리했습니다."),
  );
  assert.ok(
    !html.includes("글자만 남기고, 드라이버·버전·제보처는 공개하지 않습니다."),
  );
  const disclosures = html.slice(
    html.indexOf('id="disclosures"'),
    html.indexOf('id="team"'),
  );
  assert.ok(!disclosures.includes('<p class="section-body body-copy">'));
  assert.ok(disclosures.includes('id="disclosure-list"'));
  assert.ok(!disclosures.includes('id="disclosure-class-note"'));
});

test("the new hero subtitle sits under the title, not in the footer", async () => {
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  assert.equal(siteData.hero.eyebrow, "BOB EXPLOIT DEV");
  assert.equal(
    siteData.hero.subtitle,
    "Windows kernel driver triage and automated classification by follow-up workflow.",
  );
  assert.match(
    html,
    /<\/h1>\s*<p class="hero-subtitle" data-copy="hero.subtitle">/,
  );
  const footer = html.match(/<div class="hero-footer">([\s\S]*?)<\/div>/)[1];
  assert.ok(footer.includes("hero-motion-toggle"));
  assert.ok(!footer.includes("hero.subtitle"));
  assert.ok(!html.includes("Windows 커널 드라이버 정적 분석 · 분류 연구"));
});

test("the whole workflow precedes DrvTriage's internal pipeline", async () => {
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  assert.equal(siteData.tool.name, "DrvTriage");
  assert.ok(!html.includes("drv-collection"));
  assert.ok(
    html.indexOf('id="overview-flow"') < html.indexOf('id="research-pipeline"'),
  );
  const diagram = html.match(/<figure[\s\S]*?<\/figure>/)[0];
  assert.match(diagram, /overview-file-name">SYS<\/span>/);
  assert.match(diagram, /data-copy="tool.name">DrvTriage<\/strong>/);
  assert.ok(diagram.includes('id="overview-branches"'));
  assert.ok(diagram.includes("분류 이후는 별도의 후속 검토"));
  assert.match(diagram, /취약점 확정을\s+뜻하지는 않습니다/);
  for (const item of siteData.classes) {
    assert.equal(item.workflow.length, 2);
    assert.ok(
      item.workflow.every((step) => typeof step === "string" && step.trim()),
    );
  }
  assert.equal(
    new Set(siteData.classes.map((item) => item.workflow.join(" → "))).size,
    5,
  );
  assert.deepEqual(
    siteData.classes.find((item) => item.id === "OUT").workflow,
    ["제외 근거 보존", "현재 검토 종료"],
  );
});

test("BMUK branding uses a Windows-style header mark without renaming the research", async () => {
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  const header = html.match(/<header\b[\s\S]*?<\/header>/)[0];
  const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)[0];
  assert.equal(siteData.name, "BMUK");
  assert.equal(siteData.title, "Driver exploit pipeline for BYOVD");
  assert.equal(siteData.hero.accent, "BYOVD");
  assert.ok(header.includes('aria-label="BMUK 처음으로"'));
  assert.match(header, /data-copy="name">\s*BMUK\s*<\/span\s*>/);
  assert.match(footer, /data-copy="name">\s*BMUK\s*<\/span\s*>/);
  assert.ok(header.includes('class="brand-window"'));
  assert.equal([...header.matchAll(/class="brand-window-pane"/g)].length, 4);
  assert.ok(!header.includes("M3 12V3h9M20 3h9v9"));
});

test("the hero uses four Windows panes with an accessible motion switch", async () => {
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  assert.equal([...html.matchAll(/class="window-pane"/g)].length, 4);
  assert.ok(html.includes('data-pointer-surface="windows"'));
  assert.ok(html.includes("hero-motion-toggle"));
  assert.ok(!html.includes("research-knot.png"));
});

test("class explanations distinguish reachability, capability, and follow-up work", () => {
  for (const item of siteData.classes) {
    assert.ok(item.rationale.length > 60);
    assert.ok(item.next.length > 0);
  }
  assert.match(siteData.classes[1].rationale, /안전하다는 뜻은 아닙니다/);
  assert.match(siteData.classes[1].rationale, /Fuzzing/);
  assert.match(siteData.classes[2].rationale, /접근 전제/);
  assert.match(siteData.classes[3].rationale, /재분석/);
  assert.match(siteData.classes[4].rationale, /모든 환경에서 안전/);
});

test("Classify uses the requested plain heading and paragraph", async () => {
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  assert.equal(siteData.idea.title, "후속 작업에 따른 분류 기준");
  assert.equal(
    siteData.idea.description,
    "드라이버 분석 결과가 산출하는 것은 구조적 사실의 집합이며, 이를 분석가 혹은 후속 작업이 처리할 수 있는 형태로 정리하는 것이 분류의 목적이다. 따라서 무엇을 기준으로 나눌 것인가가 먼저 결정되어야 한다.",
  );
  assert.equal(siteData.idea.lead, undefined);
  assert.ok(!html.includes("분류를 먼저."));
  assert.ok(!html.includes('data-copy="idea.lead"'));
});

test("twelve reports preserve masked vendor lengths without identifiers", () => {
  const expectedMasks = [
    ["D", 4],
    ["B", 15],
    ["H", 7],
    ["O", 23],
    ["S", 13],
    ["N", 25],
    ["I", 27],
    ["A", 6],
    ["n", 8],
    ["C", 8],
    ["C", 27],
    ["K", 6],
  ];
  assert.equal(siteData.disclosures.length, expectedMasks.length);
  siteData.disclosures.forEach((record, index) => {
    const [initial, length] = expectedMasks[index];
    assert.equal(record.vendor, initial + "*".repeat(length - 1));
    assert.deepEqual(Object.keys(record).sort(), [
      "classification",
      "description",
      "reportedAt",
      "vendor",
    ]);
    assert.ok(record.description.length > 10);
    assert.ok(
      record.classification === "" ||
        expectedClasses.includes(record.classification),
    );
    assert.doesNotMatch(
      JSON.stringify(record),
      /[a-z0-9_-]+\.sys\b|\b\d+(?:\.\d+){2,}\b/i,
    );
  });
  assert.match(
    siteData.disclosures.find((record) => record.vendor === "D***").description,
    /의심/,
  );
});

test("disclosure classes match the supplied verdicts without provisional labels", async () => {
  assert.deepEqual(
    siteData.disclosures.map((record) => record.classification),
    [
      "CONDITIONAL",
      "PRIMITIVE",
      "PRIMITIVE",
      "CONDITIONAL",
      "PRIMITIVE",
      "UNREADABLE",
      "CONDITIONAL",
      "PRIMITIVE",
      "UNCLEARED",
      "UNCLEARED",
      "PRIMITIVE",
      "CONDITIONAL",
    ],
  );
  const [html, app] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
  ]);
  assert.ok(html.includes("<span>DrvTriage class</span>"));
  assert.ok(app.includes('class="record-class"'));
  assert.doesNotMatch(html, /disclosure-class-note|잠정 값/);
  assert.doesNotMatch(
    app,
    /classificationBasis|record-basis|disclosure-class-note|설명 기반/,
  );
});

test("report dates match the supplied timeline, including same-date and shared-initial entries", () => {
  const timeline = siteData.disclosures.map(({ vendor, reportedAt }) => [
    vendor,
    reportedAt,
  ]);
  assert.deepEqual(timeline, [
    ["D***", "2026-09-05"],
    ["B**************", "2026-09-08"],
    ["H******", "2026-09-15"],
    ["O**********************", "2026-09-19"],
    ["S************", "2026-09-20"],
    ["N************************", "2026-09-21"],
    ["I**************************", "2026-09-22"],
    ["A*****", "2026-10-02"],
    ["n*******", "2026-10-02"],
    ["C*******", "2026-10-03"],
    ["C**************************", "2026-10-04"],
    ["K*****", "2026-10-05"],
  ]);
  for (const record of siteData.disclosures) {
    assert.match(record.reportedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(
      new Date(record.reportedAt + "T00:00:00Z").toISOString().slice(0, 10),
      record.reportedAt,
    );
  }
  const dates = siteData.disclosures.map((record) => record.reportedAt);
  assert.deepEqual(dates, [...dates].sort());
});

test("adding report dates preserves all nine existing detailed descriptions", () => {
  const existingDescriptions = {
    "H******":
      "물리 주소 검증 없는 읽기·쓰기 IOCTL로 임의 물리 메모리 접근 및 SYSTEM 권한 상승",
    "N************************":
      "operation 인덱스 미검증과 사용자 객체 포인터 신뢰로 커널 주소 노출·임의 커널 호출 및 SYSTEM 권한 상승",
    "B**************":
      "필터 통신 포트 요청의 권한·대상 검증 미흡으로 임의 프로세스 및 PPL 종료",
    "O**********************":
      "FILE_ANY_ACCESS IOCTL로 임의 물리 메모리를 쓰기 가능하게 매핑하여 SYSTEM 권한 상승",
    "S************":
      "프로세스 종료 IOCTL의 인가 누락으로 일반 사용자가 PPL·Defender 프로세스 종료 가능",
    "I**************************":
      "사용자 callback/context를 신뢰해 커널 주소 노출·임의 커널 읽기/쓰기 및 SYSTEM 권한 상승",
    "A*****": "임의 드라이버의 IOCTL dispatch callback 비활성화",
    "D***": "객체 타입 혼동(Object Type Confusion) 의심으로 인한 Kernel DoS",
    "C**************************":
      "파일 시스템 콜백 인가 누락으로 비특권 사용자의 SYSTEM 프로세스 I/O 무력화",
  };
  for (const [vendor, description] of Object.entries(existingDescriptions)) {
    const matches = siteData.disclosures.filter(
      (record) => record.vendor === vendor,
    );
    assert.equal(matches.length, 1);
    assert.equal(matches[0].description, description);
  }
  assert.deepEqual(
    siteData.disclosures
      .filter((record) => !(record.vendor in existingDescriptions))
      .map(({ vendor, description }) => [vendor, description]),
    [
      ["n*******", "포인터 역참조로 인한 Kernel DoS"],
      ["C*******", "PCI 설정 오용으로 인한 Kernel DoS"],
      ["K*****", "임의 커널 읽기/쓰기 및 권한 상승"],
    ],
  );
});

test("classification order and reported corpus totals stay consistent", () => {
  assert.deepEqual(
    siteData.classes.map((item) => item.id),
    expectedClasses,
  );
  for (const dataset of siteData.results.datasets) {
    assert.equal(dataset.counts.length, expectedClasses.length);
    for (const count of dataset.counts) {
      assert.ok(Number.isInteger(count) && count >= 0);
    }
  }
  assert.deepEqual(totals, [1040, 84, 181, 757, 1327]);
  assert.equal(add(totals), 3389);
  assert.deepEqual(
    totals.map((value) => ratio(value, add(totals))),
    ["30.7", "2.5", "5.3", "22.3", "39.2"],
  );
});

test("exploration remains separate from the LOLDrivers comparison set", () => {
  assert.deepEqual(exploration, [71, 42, 149, 546, 590]);
  assert.equal(add(exploration), 1398);
  assert.equal(add(exploration.slice(0, 3)), 262);
  assert.equal(ratio(262, 1398), "18.7");
  assert.equal(ratio(546, 1398), "39.1");
  assert.equal(ratio(590, 1398), "42.2");
});

test("positive-control retention has the stated denominators", () => {
  const [all, x64] = siteData.results.positiveControl;
  assert.equal(all.total, 1684);
  assert.equal(all.retained, 1037);
  assert.equal(ratio(all.retained, all.total), "61.6");
  assert.equal(x64.total, 1256);
  assert.equal(x64.retained, 1031);
  assert.equal(ratio(x64.retained, x64.total), "82.1");
});

test("VM counts match exploration, with device rates conditional on successful loads", () => {
  siteData.results.vm.forEach((row) => {
    assert.equal(row.total, exploration[expectedClasses.indexOf(row.class)]);
    assert.ok(row.total >= row.loaded && row.loaded >= row.devices);
  });
  assert.equal(add(siteData.results.vm.map((row) => row.loaded)), 704);
  assert.equal(add(siteData.results.vm.map((row) => row.devices)), 247);
  const primitive = siteData.results.vm.find(
    (row) => row.class === "PRIMITIVE",
  );
  assert.equal(ratio(primitive.devices, primitive.loaded), "92.1");
  const conditional = siteData.results.vm.find(
    (row) => row.class === "CONDITIONAL",
  );
  assert.equal(conditional.loaded, 145);
  assert.equal(conditional.devices, 0);
});

test("analysis duration and cached reclassification are separate measurements", () => {
  assert.equal(siteData.results.analysisMinutes, 48);
  assert.equal(
    ((siteData.results.analysisMinutes * 60) / add(totals)).toFixed(2),
    "0.85",
  );
  assert.equal(siteData.results.reclassificationSeconds, 0.2);
});

test("references have distinct IDs, supported links and valid citations", () => {
  const ids = siteData.sources.map((source) => source.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const source of siteData.sources) {
    assert.ok(["https:", "http:"].includes(new URL(source.url).protocol));
  }
  for (const item of [
    ...siteData.overview.paragraphs,
    ...siteData.implementation.notes,
  ]) {
    for (const id of item.sources || []) assert.ok(ids.includes(id));
  }
});

test("the legacy invented portfolio samples are not included", () => {
  assert.equal(siteData.projects, undefined);
  assert.equal(siteData.notes, undefined);
  assert.ok(
    siteData.disclosures.every(
      (item) => !(item.identifier || "").startsWith("SAMPLE-"),
    ),
  );
});
