const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

function loadGame() {
  class Element {
    constructor(attributes = "") {
      this.hidden = /\bhidden\b/.test(attributes);
      this.disabled = /\bdisabled\b/.test(attributes);
      this.children = [];
      this.style = {};
      this.dataset = {};
      this.attributes = {};
      this.events = {};
      this.classList = { add() {}, remove() {}, toggle() {} };
    }
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children = children; }
    querySelectorAll() { return this.children; }
    setAttribute(key, value) { this.attributes[key] = value; }
    getAttribute(key) { return this.attributes[key]; }
    addEventListener(event, handler) { this.events[event] = handler; }
    click() { if (!this.disabled) this.events.click?.(); }
    focus() {}
  }

  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const elements = {};
  for (const match of html.matchAll(/<[\w-]+\b([^>]*\bid="([^"]+)"[^>]*)>/g)) {
    elements[match[2]] = new Element(match[1]);
  }
  elements["star-board"].children = Array.from({ length: 10 }, () => new Element());
  const context = vm.createContext({
    window: {},
    document: {
      getElementById(id) {
        assert.ok(elements[id], `Missing element ${id}`);
        return elements[id];
      },
      createElement: () => new Element(),
    },
  });
  for (const file of ["question-bank.js", "math-additional-bank.js", "language-question-bank.js", "chinese-vocabulary.js", "english-vocabulary.js", "app.js"]) {
    vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context);
  }
  return { context, elements, run: (code) => vm.runInContext(code, context) };
}

test("language banks have playable unique source questions and reading context", () => {
  const { run } = loadGame();
  const banks = run("window.LANGUAGE_QUESTION_BANKS");
  assert.equal(banks.chinese.length, 17);
  assert.equal(banks.english.length, 20);
  for (const bank of Object.values(banks)) {
    const identifiers = new Set();
    for (const question of bank) {
      const key = `${question.source}|${question.page}|${question.number}`;
      assert.ok(!identifiers.has(key), `Duplicate question ${key}`);
      identifiers.add(key);
      assert.ok(question.options.includes(question.answer), key);
      assert.equal(new Set(question.options).size, question.options.length);
      assert.ok(question.prompt && question.topic);
      if (question.topic === "Reading") assert.ok(question.passage);
    }
  }
});

test("three subjects run ten levels without mixing banks; returning resets selection", () => {
  const { elements, run } = loadGame();
  assert.equal(elements["subject-screen"].hidden, false);
  for (const subject of ["chinese", "english", "math"]) {
    elements[`${subject}-subject-button`].click();
    assert.equal(elements["welcome-screen"].hidden, false);
    elements["start-button"].click();
    const seen = new Set();
    for (let level = 1; level <= 10; level += 1) {
      const questions = run("questions");
      assert.equal(questions.length, 10);
      assert.equal(new Set(questions.map((q) => `${q.source}|${q.page}|${q.number}`)).size, 10);
      assert.equal(elements["current-level"].textContent, `第 ${level} 級`);
      for (const question of questions) {
        if (subject !== "math") {
          assert.ok(run(`window.LANGUAGE_QUESTION_BANKS.${subject}`).some(
            (q) => q.source === question.source && q.page === question.page && q.number === question.number,
          ));
          const key = `${question.source}|${question.page}|${question.number}`;
          if (subject === "english" && level <= 2) {
            assert.ok(!seen.has(key), "English repeats before all 20 questions are used");
          }
          seen.add(key);
        }
        assert.equal(elements["question-passage"].hidden, !question.passage);
        assert.equal(elements["question-passage"].textContent, question.passage || "");
        const button = elements["answer-grid"].children.find((b) => b.dataset.answer === question.answer);
        assert.ok(button);
        button.click();
        elements["next-button"].click();
      }
      if (subject === "chinese" && level === 2) assert.equal(seen.size, 17);
      assert.equal(elements["result-screen"].hidden, false);
      assert.equal(elements["final-score"].textContent, "10");
      assert.equal(elements["next-level-button"].hidden, level === 10);
      if (level < 10) elements["next-level-button"].click();
    }
    elements["result-menu-button"].click();
    assert.equal(elements["subject-screen"].hidden, false);
  }
  elements["chinese-subject-button"].click();
  assert.equal(run("currentLevel"), 1);
  assert.equal(run("usedQuestionKeys.size"), 0);
});

test("workbook picture questions display their original images and clear them on text questions", () => {
  const { elements, run } = loadGame();
  const pictures = run("window.LANGUAGE_QUESTION_BANKS.chinese.filter(q => q.image)");
  assert.equal(pictures.length, 4);
  for (const question of pictures) {
    assert.ok(fs.existsSync(path.join(root, question.image)));
    run(`questions = [window.LANGUAGE_QUESTION_BANKS.chinese.find(q => q.image === ${JSON.stringify(question.image)})]; currentQuestionIndex = 0; renderQuestion();`);
    assert.equal(elements["question-illustration"].hidden, false);
    assert.equal(elements["question-illustration"].children[0].src, question.image);
  }
  run("questions = [window.LANGUAGE_QUESTION_BANKS.chinese.find(q => !q.image)]; currentQuestionIndex = 0; renderQuestion();");
  assert.equal(elements["question-illustration"].hidden, true);
  assert.equal(elements["question-illustration"].children.length, 0);
});

test("Chinese vocabulary opens all lessons and words, returns without changing the level", () => {
  const { elements, run } = loadGame();
  elements["math-subject-button"].click();
  assert.equal(elements["vocabulary-button"].hidden, true);
  elements["subject-menu-button"].click();
  elements["chinese-subject-button"].click();
  assert.equal(elements["vocabulary-button"].hidden, false);
  elements["vocabulary-button"].click();
  assert.equal(elements["vocabulary-screen"].hidden, false);
  assert.equal(elements["welcome-screen"].hidden, true);
  const sections = elements["vocabulary-list"].children;
  assert.equal(sections.length, 4);
  const expected = run("window.CHINESE_VOCABULARY.flatMap(lesson => lesson.words)");
  const actual = sections.flatMap((section) => section.children[1].children.map((item) => item.textContent));
  assert.equal(actual.length, 37);
  assert.equal(JSON.stringify(actual), JSON.stringify(expected));
  elements["vocabulary-back-button"].click();
  assert.equal(elements["vocabulary-screen"].hidden, true);
  assert.equal(elements["welcome-screen"].hidden, false);
  assert.equal(run("currentLevel"), 1);
  elements["vocabulary-button"].click();
  assert.equal(elements["vocabulary-list"].children.length, 4);
});

test("additional math questions are in the shared random pool with complete sources and images", () => {
  const { elements, run } = loadGame();
  const bank = run("window.MATH_QUESTION_BANK");
  assert.equal(bank.length, 107);
  const added = bank.filter((q) => q.source === "Math_20261016_PDF.pdf");
  assert.equal(added.length, 23);
  const keys = bank.map((q) => `${q.source}|${q.page}|${q.number}`);
  assert.equal(new Set(keys).size, bank.length);
  for (const q of added) {
    assert.ok(q.options.includes(q.answer));
    assert.ok(q.page >= 1 && q.page <= 7);
    if (q.image) {
      assert.ok(fs.existsSync(path.join(root, q.image)));
      run(`questions = [window.MATH_QUESTION_BANK.find(q => q.number === ${JSON.stringify(q.number)} && q.source === "Math_20261016_PDF.pdf")]; currentQuestionIndex = 0; renderQuestion();`);
      assert.equal(elements["question-illustration"].hidden, false);
      assert.equal(elements["question-illustration"].children[0].src, q.image);
      assert.ok(!elements["question-hint"].textContent.includes(".pdf 冊"));
    }
  }
  const seen = new Set();
  for (let i = 0; i < 11; i += 1) {
    for (const q of run("createQuestionPool()")) seen.add(`${q.source}|${q.page}|${q.number}`);
  }
  assert.equal(seen.size, 107);
});

test("English vocabulary shows all three original lists and does not mix with Chinese", () => {
  const { elements } = loadGame();
  elements["english-subject-button"].click();
  assert.equal(elements["vocabulary-button"].hidden, false);
  elements["vocabulary-button"].click();
  assert.equal(elements["vocabulary-screen"].hidden, false);
  assert.equal(elements["vocabulary-title"].textContent, "英文生字表");
  assert.equal(elements["vocabulary-back-button"].textContent, "返回英文");
  assert.equal(elements["vocabulary-list"].lang, "en");
  const sections = elements["vocabulary-list"].children;
  assert.equal(sections.length, 3);
  const expected = [
    ["this", "bear", "soft", "has", "fur", "fat", "brown", "ears", "feet", "love"],
    ["birds", "colours", "green", "yellow", "red", "blue", "purple", "pink", "orange", "grey"],
    ["can", "jump", "swing", "hop", "ride", "climb", "crawl", "play", "walk", "September"],
  ];
  for (const [index, section] of sections.entries()) {
    assert.deepEqual(section.children[1].children.map((item) => item.textContent), expected[index]);
    assert.ok(section.children[2].textContent.endsWith(".pdf"));
  }
  elements["vocabulary-back-button"].click();
  assert.equal(elements["welcome-screen"].hidden, false);
  elements["subject-menu-button"].click();
  elements["chinese-subject-button"].click();
  elements["vocabulary-button"].click();
  assert.equal(elements["vocabulary-title"].textContent, "中文生字表");
  assert.equal(elements["vocabulary-list"].children.length, 4);
  assert.equal(elements["vocabulary-list"].lang, "zh-Hant");
  elements["vocabulary-back-button"].click();
  elements["subject-menu-button"].click();
  elements["english-subject-button"].click();
  elements["vocabulary-button"].click();
  assert.equal(elements["vocabulary-list"].children.length, 3);
});
