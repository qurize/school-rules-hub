/* ============================================================
   School Rules Hub — app logic (vanilla JS)
   Data is persisted in localStorage on this device.
   ============================================================ */

/* ---------- Categories ---------- */
const CATEGORIES = {
  uniform:    { name: "เครื่องแต่งกาย", icon: "👕", color: "#4f46e5", soft: "#eef0ff" },
  attendance: { name: "การเข้าเรียน",   icon: "⏰", color: "#0ea5e9", soft: "#e9f2ff" },
  manners:    { name: "มารยาท",        icon: "🤝", color: "#10b981", soft: "#e6f9f2" },
  safety:     { name: "ความปลอดภัย",  icon: "🦺", color: "#f59e0b", soft: "#fff5e0" },
  tech:       { name: "การใช้เทคโนโลยี", icon: "💻", color: "#8b5cf6", soft: "#f3edff" },
};
const IMPORTANCE = {
  high:   { label: "สำคัญมาก", color: "#ef4444", soft: "#feecec" },
  medium: { label: "ปานกลาง", color: "#f59e0b", soft: "#fff5e0" },
  low:    { label: "ทั่วไป",   color: "#10b981", soft: "#e6f9f2" },
};
const LETTERS = ["ก", "ข", "ค", "ง"];
const REVIEW_DAYS = 7; // ต้องทบทวนซ้ำทุก 7 วัน

/* ---------- Default rules (can be edited by teacher) ---------- */
const DEFAULT_RULES = [
  {
    id: "r1", category: "uniform", importance: "high",
    title: "สวมเครื่องแบบให้เรียบร้อย",
    detail: "นักเรียนต้องสวมเครื่องแบบโรงเรียนให้สะอาด เรียบร้อย คอเสื้อเก็บเรียบ กระดุมติดครบ และรองเท้าสีตามที่โรงเรียนกำหนดทุกวันที่เข้าเรียน",
    question: "ข้อใดคือการแต่งกายที่ถูกต้องตามระเบียบโรงเรียน?",
    options: ["สวมเสื้อยืดสีขาวแทนเครื่องแบบ", "สวมเครื่องแบบสะอาด กระดุมครบ เรียบร้อย", "ใส่รองเท้าแตะมาเรียนได้", "ปล่อยชายเสื้อออกนอกกางเกง"],
    answer: 1, explanation: "เครื่องแบบต้องสะอาด เรียบร้อย กระดุมติดครบ และรองเท้าต้องเป็นไปตามกำหนดของโรงเรียน",
  },
  {
    id: "r2", category: "uniform", importance: "medium",
    title: "งดเครื่องประดับและของเล่น",
    detail: "ห้ามสวมเครื่องประดับ เช่น ต่างหู แหวน สร้อย หรือนำของเล่น โทรศัพท์มาในชั้นเรียน เว้นแต่ได้รับอนุญาตจากครู",
    question: "สิ่งใดที่นักเรียนไม่ควรนำมาโรงเรียน?",
    options: ["สมุดและปากกา", "กระบอกน้ำ", "ต่างหูและของเล่น", "เป้ใส่หนังสือ"],
    answer: 2, explanation: "เครื่องประดับและของเล่นเป็นสิ่งที่ห้ามนำมาในชั้นเรียนเพื่อไม่ให้รบกวนการเรียน",
  },
  {
    id: "r3", category: "attendance", importance: "high",
    title: "เข้าเรียนให้ตรงเวลา",
    detail: "นักเรียนต้องมาถึงโรงเรียนก่อนเวลาเข้าแถว 08:00 น. และเข้าร่วมกิจกรรมหน้าเสาธงทุกเช้า หากมาสายต้องแจ้งครูและบันทึกเวลา",
    question: "นักเรียนควรมาถึงโรงเรียนตอนกี่โมงเพื่อเข้าแถว?",
    options: ["08:30 น. ขึ้นอยู่กับความสะดวก", "ก่อน 08:00 น. เพื่อเข้าแถว", "09:00 น. ตอนคาบแรกก็ได้", "ไม่จำเป็นต้องตรงเวลา"],
    answer: 1, explanation: "กำหนดเข้าแถวคือ 08:00 น. นักเรียนควรมาถึงก่อนเวลาดังกล่าวและเข้าร่วมทุกเช้า",
  },
  {
    id: "r4", category: "attendance", importance: "medium",
    title: "การลาและการขาดเรียน",
    detail: "หากป่วยหรือมีเหตุจำเป็นต้องลา ให้ผู้ปกครองแจ้งครูประจำชั้นล่วงหน้าหรือภายในวันนั้น พร้อมส่งใบลาหลังกลับมาเรียน",
    question: "เมื่อนักเรียนป่วยและไม่สามารถมาเรียนได้ ควรทำอย่างไร?",
    options: ["เงียบไว้จนกว่าจะหาย", "ให้ผู้ปกครองแจ้งครูและส่งใบลา", "ให้เพื่อนเรียนแทน", "มาเรียนทั้งที่ป่วยโดยไม่แจ้งใคร"],
    answer: 1, explanation: "ต้องให้ผู้ปกครองแจ้งครูประจำชั้นและส่งใบลาเมื่อกลับมาเรียนเพื่อเป็นหลักฐาน",
  },
  {
    id: "r5", category: "manners", importance: "high",
    title: "ให้ความเคารพครูและเพื่อน",
    detail: "นักเรียนต้องไหว้และทักทายครู ใช้คำพูดสุภาพ ไม่ล้อเลียน ด่าทอ หรือใช้ความรุนแรงกับเพื่อน รวมถึงเคารพสิทธิผู้อื่น",
    question: "เมื่อพบครูในโรงเรียน นักเรียนควรปฏิบัติอย่างไร?",
    options: ["เดินผ่านไปโดยไม่ทักทาย", "ไหว้และทักทายด้วยคำพูดสุภาพ", "หันหลังหนี", "เรียกชื่อครูแบบไม่มีคำนำหน้า"],
    answer: 1, explanation: "การไหว้และทักทายด้วยคำพูดสุภาพเป็นมารยาทพื้นฐานที่นักเรียนควรปฏิบัติ",
  },
  {
    id: "r6", category: "manners", importance: "low",
    title: "รักษาความสะอาดและความเป็นระเบียบ",
    detail: "ทิ้งขยะในถังที่กำหนด ไม่เขียนหรือขีดข่วนบนโต๊ะ ผนัง และสิ่งของส่วนรวม เก็บที่นั่งให้เรียบร้อยก่อนออกจากห้อง",
    question: "หลังเลิกเรียน นักเรียนควรทำอะไรกับโต๊ะและที่นั่ง?",
    options: ["ทิ้งของไว้ให้คนอื่นเก็บ", "เขียนชื่อบนโต๊ะเพื่อจำ", "เก็บของให้เรียบร้อยและทำความสะอาด", "ขีดข่วนผนังให้มีร่องรอย"],
    answer: 2, explanation: "นักเรียนควรเก็บที่นั่งให้เรียบร้อย รักษาความสะอาด และไม่ทำลายสิ่งของส่วนรวม",
  },
  {
    id: "r7", category: "safety", importance: "high",
    title: "ปฏิบัติตามกฎความปลอดภัย",
    detail: "ห้ามวิ่งผลักกันในทางเดิน ใช้งานอุปกรณ์วิทยาศาสตร์และกีฬาภายใต้การดูแลของครู และแจ้งครูทันทีเมื่อพบอันตรายหรืออุบัติเหตุ",
    question: "หากพบอุบัติเหตุหรืออันตรายในโรงเรียน ควรทำอย่างไร?",
    options: ["แจ้งครูหรือเจ้าหน้าที่ทันที", "ปล่อยไว้ให้คนอื่นจัดการ", "ถ่ายรูปลงโซเชียลก่อน", "เข้าไปแก้ไขเองคนเดียว"],
    answer: 0, explanation: "ต้องแจ้งครูหรือเจ้าหน้าที่ทันทีเพื่อให้ได้รับความช่วยเหลืออย่างถูกต้องและปลอดภัย",
  },
  {
    id: "r8", category: "safety", importance: "medium",
    title: "ระเบียบการออกนอกบริเวณโรงเรียน",
    detail: "นักเรียนห้ามออกนอกบริเวณโรงเรียนในเวลาเรียน หากจำเป็นต้องได้รับอนุญาตจากครูและมีผู้ปกครองมารับตามระบบของโรงเรียน",
    question: "นักเรียนสามารถออกนอกโรงเรียนในเวลาเรียนได้เมื่อใด?",
    options: ["เมื่อเพื่อนชวนไปก็ได้", "เมื่อได้รับอนุญาตจากครูและมีผู้ปกครองมารับ", "เมื่อเหนื่อยอยากพัก", "ทุกครั้งที่หมดคาบเรียน"],
    answer: 1, explanation: "ต้องได้รับอนุญาตจากครูและมีผู้ปกครองมารับตามระบบทุกครั้ง",
  },
  {
    id: "r9", category: "tech", importance: "medium",
    title: "ใช้โทรศัพท์และอินเทอร์เน็ตอย่างเหมาะสม",
    detail: "ห้ามใช้โทรศัพท์ในคาบเรียนเว้นแต่ครูอนุญาต ห้ามถ่ายภาพหรือวิดีโอผู้อื่นโดยไม่ได้รับอนุญาต และไม่เผยแพร่ข้อมูลส่วนตัวลงออนไลน์",
    question: "ข้อใดเป็นการใช้เทคโนโลยีที่ถูกต้อง?",
    options: ["ถ่ายภาพเพื่อนลงโซเชียลโดยไม่บอก", "เปิดโทรศัพท์ดูในคาบเรียน", "ใช้โทรศัพท์เมื่อครูอนุญาตและไม่รบกวนผู้อื่น", "แชร์หมายเลขโทรศัพท์เพื่อนในกลุ่มแชท"],
    answer: 2, explanation: "การใช้โทรศัพท์ต้องได้รับอนุญาต ไม่รบกวนการเรียน และเคารพความเป็นส่วนตัวของผู้อื่น",
  },
  {
    id: "r10", category: "tech", importance: "low",
    title: "เคารพลิขสิทธิ์และไม่ลอกการบ้าน",
    detail: "ต้องอ้างอิงแหล่งที่มาเมื่อใช้ข้อมูลจากผู้อื่น ห้ามคัดลอกงานหรือการบ้านของเพื่อน และใช้งานซอฟต์แวร์ที่ถูกกฎหมาย",
    question: "เมื่อต้องใช้ข้อมูลจากอินเทอร์เน็ตทำรายงาน นักเรียนควร?",
    options: ["copy ทั้งหมดโดยไม่บอกที่มา", "อ้างอิงแหล่งที่มาอย่างถูกต้อง", "เปลี่ยนคำไม่กี่คำแล้วส่งเป็นผลงานตัวเอง", "ลอกการบ้านเพื่อนให้เสร็จเร็ว"],
    answer: 1, explanation: "การอ้างอิงแหล่งที่มาแสดงถึงความรับผิดชอบและเคารพลิขสิทธิ์ของผู้อื่น",
  },
];

/* ---------- State & storage ---------- */
const KEYS = {
  rules: "sr_rules_v1",
  history: "sr_history_v1",
  review: "sr_review_v1",
  settings: "sr_settings_v1",
};
function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); }
  catch (e) { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
}
let rules = load(KEYS.rules, null);
if (!Array.isArray(rules)) rules = structuredClone(DEFAULT_RULES);
let history = load(KEYS.history, []);
let review = load(KEYS.review, {}); // { ruleId: "YYYY-MM-DD" } วันที่ทบทวนล่าสุด
let role = load(KEYS.settings, { role: "student" }).role || "student";

/* ---------- DOM helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const todayStr = () => new Date().toISOString().slice(0, 10);
function addDays(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function fmtDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
}
let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

/* ---------- Navigation ---------- */
const VIEW_TITLES = {
  home: ["หน้าแรก", "ภาพรวมกฎระเบียบและความก้าวหน้าของคุณ"],
  rules: ["กฎระเบียบ", "ค้นหาและทบทวนกฎระเบียบของโรงเรียน"],
  quiz: ["แบบทดสอบ", "วัดความรู้ของคุณด้วยคำถามสนุก ๆ"],
  teacher: ["หน้าครู", "จัดการกฎระเบียบและดูสถิติการเรียนรู้"],
};
function switchView(view) {
  $$(".view").forEach(v => v.classList.remove("active"));
  $("#view-" + view).classList.add("active");
  $$(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.view === view));
  $("#pageTitle").textContent = VIEW_TITLES[view][0];
  $("#pageSubtitle").textContent = VIEW_TITLES[view][1];
  $("#sidebar").classList.remove("open");
  if (view === "home") renderHome();
  if (view === "rules") renderRules();
  if (view === "teacher") renderTeacher();
  if (view === "quiz" && currentPhase === "result") showSetup();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
$$(".nav-item").forEach(btn => btn.addEventListener("click", () => switchView(btn.dataset.view)));
$$("[data-goto]").forEach(btn => btn.addEventListener("click", () => switchView(btn.dataset.goto)));
$("#menuBtn").addEventListener("click", () => $("#sidebar").classList.toggle("open"));

/* ---------- Role switch ---------- */
function applyRole() {
  $$("#roleSwitch .seg").forEach(s => s.classList.toggle("active", s.dataset.role === role));
  $("#avatar").textContent = role === "teacher" ? "ครู" : "นร.";
}
$$("#roleSwitch .seg").forEach(s => s.addEventListener("click", () => {
  role = s.dataset.role;
  save(KEYS.settings, { role });
  applyRole();
  toast(role === "teacher" ? "เปลี่ยนไปโหมดครูแล้ว" : "เปลี่ยนไปโหมดนักเรียนแล้ว");
}));
applyRole();

/* ---------- Reminder helpers ---------- */
function dueRules() {
  const today = todayStr();
  return rules.filter(r => {
    const last = review[r.id];
    const due = last ? addDays(last, REVIEW_DAYS) : today; // ยังไม่เคยอ่าน = ต้องทบทวนเลย
    return due <= today;
  });
}
function updateBell() {
  const n = dueRules().length;
  $("#bellBadge").textContent = n;
  $("#bellBadge").classList.toggle("zero", n === 0);
}
$("#bellBtn").addEventListener("click", () => {
  switchView("home");
  toast(dueRules().length ? `มี ${dueRules().length} กฎที่ควรทบทวนวันนี้` : "ไม่มีกฎที่ต้องทบทวน ตอนนี้ครบแล้ว 🎉");
});

/* ---------- HOME ---------- */
function renderHome() {
  $("#todayText").textContent = new Date().toLocaleDateString("th-TH", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  $("#statRules").textContent = rules.length;
  $("#statQuizzes").textContent = history.length;
  const avg = history.length ? Math.round(history.reduce((s, h) => s + h.pct, 0) / history.length) : 0;
  $("#statAvg").textContent = avg + "%";
  $("#statDue").textContent = dueRules().length;
  $("#dueDateLabel").textContent = "อัปเดต " + fmtDate(todayStr());

  // reminder list (max 4)
  const due = dueRules().slice(0, 4);
  const rl = $("#reminderList");
  if (!due.length) {
    rl.innerHTML = `<div class="empty"><span class="big">🎉</span>ทบทวนครบแล้ววันนี้<br />เก่งมาก! กลับมาอีกครั้งในอีก ${REVIEW_DAYS} วัน</div>`;
  } else {
    rl.innerHTML = due.map(r => {
      const cat = CATEGORIES[r.category] || CATEGORIES.uniform;
      const last = review[r.id];
      const meta = last ? `อ่านล่าสุด ${fmtDate(last)} · ควรทบทวนซ้ำ` : "ยังไม่เคยอ่าน · อ่านวันนี้เลย";
      return `<div class="reminder-item">
        <span class="r-ico">${cat.icon}</span>
        <div class="r-body"><div class="r-title">${escapeHtml(r.title)}</div><div class="r-meta">${meta}</div></div>
        <button class="r-btn" data-reviewed="${r.id}">อ่านแล้ว ✓</button>
      </div>`;
    }).join("");
    $$("[data-reviewed]", rl).forEach(b => b.addEventListener("click", () => {
      review[b.dataset.reviewed] = todayStr();
      save(KEYS.review, review);
      toast("บันทึกการอ่านแล้ว ✅");
      renderHome(); updateBell();
    }));
  }

  // recent progress
  const pp = $("#progressPanel");
  if (!history.length) {
    pp.innerHTML = `<div class="empty"><span class="big">📊</span>ยังไม่มีประวัติการทำแบบทดสอบ<br />เริ่มทำข้อแรกได้เลย!</div>`;
  } else {
    pp.innerHTML = history.slice(0, 4).map(h => {
      const color = h.pct >= 80 ? "#10b981" : h.pct >= 50 ? "#f59e0b" : "#ef4444";
      return `<div class="prog-row">
        <div class="prog-score" style="background:${color}1a;color:${color}">${h.pct}%</div>
        <div class="prog-info">
          <div class="p-title">${h.correct}/${h.total} ข้อถูก · ${escapeHtml(h.categoryName)}</div>
          <div class="p-date">${fmtDate(h.date)} · ${h.time} นาที</div>
          <div class="prog-bar"><div style="width:${h.pct}%;background:${color}"></div></div>
        </div>
      </div>`;
    }).join("");
  }
}

/* ---------- RULES VIEW ---------- */
let ruleFilter = "all";
let ruleQuery = "";
function renderChips() {
  const wrap = $("#categoryChips");
  const cats = [["all", "ทั้งหมด"], ...Object.entries(CATEGORIES).map(([k, v]) => [k, `${v.icon} ${v.name}`])];
  wrap.innerHTML = cats.map(([k, label]) => `<button class="chip ${k === ruleFilter ? "active" : ""}" data-cat="${k}">${label}</button>`).join("");
  $$(".chip", wrap).forEach(c => c.addEventListener("click", () => { ruleFilter = c.dataset.cat; renderChips(); renderRules(); }));
}
function renderRules() {
  const q = ruleQuery.trim().toLowerCase();
  const list = rules.filter(r => (ruleFilter === "all" || r.category === ruleFilter) &&
    (!q || (r.title + " " + r.detail).toLowerCase().includes(q)));
  const grid = $("#rulesGrid");
  if (!list.length) { grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><span class="big">🔍</span>ไม่พบกฎที่ค้นหา</div>`; return; }
  grid.innerHTML = list.map(r => {
    const cat = CATEGORIES[r.category] || CATEGORIES.uniform;
    const imp = IMPORTANCE[r.importance] || IMPORTANCE.low;
    const last = review[r.id];
    const due = last ? addDays(last, REVIEW_DAYS) <= todayStr() : true;
    return `<article class="rule-card" style="--c:${cat.color}">
      <div style="position:absolute;top:0;left:0;width:4px;height:100%;background:${cat.color}"></div>
      <div class="rc-top">
        <span class="rule-tag" style="background:${cat.soft};color:${cat.color}">${cat.icon} ${cat.name}</span>
        <span class="importance" style="color:${imp.color}">● ${imp.label}</span>
      </div>
      <h4>${escapeHtml(r.title)}</h4>
      <p>${escapeHtml(r.detail)}</p>
      <div class="rc-foot">
        <span class="${due ? "" : "reviewed-check"}">${due ? "🔔 ควรทบทวน" : "✓ ทบทวนแล้ว " + fmtDate(last)}</span>
        <button class="mark-btn" data-mark="${r.id}">${due ? "ทำเครื่องหมายอ่านแล้ว" : "อ่านซ้ำ"}</button>
      </div>
    </article>`;
  }).join("");
  $$("[data-mark]", grid).forEach(b => b.addEventListener("click", () => {
    review[b.dataset.mark] = todayStr();
    save(KEYS.review, review);
    toast("บันทึกการอ่านแล้ว ✅");
    renderRules(); updateBell();
  }));
}
$("#ruleSearch").addEventListener("input", e => { ruleQuery = e.target.value; renderRules(); });

/* ---------- QUIZ ---------- */
let currentPhase = "setup"; // setup | play | result
let quiz = null; // {questions, index, correct, perQuestionTime, timeLeft, timer, answered}
function buildCategoryOptions() {
  $("#quizCategory").innerHTML = `<option value="all">📚 ทุกหมวดหมู่</option>` +
    Object.entries(CATEGORIES).map(([k, v]) => `<option value="${k}">${v.icon} ${v.name}</option>`).join("");
}
function segmentedBind(sel, attr, cb) {
  $$(sel + " .seg").forEach(b => b.addEventListener("click", () => {
    $$(sel + " .seg").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    cb(Number(b.dataset[attr]));
  }));
}
let quizCount = 10, quizTime = 20;
segmentedBind("#quizCount", "count", v => quizCount = v);
segmentedBind("#quizTime", "time", v => quizTime = v);

function showSetup() {
  currentPhase = "setup";
  clearInterval(quiz && quiz.timer);
  $("#quizSetup").classList.remove("hidden");
  $("#quizPlay").classList.add("hidden");
  $("#quizResult").classList.add("hidden");
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function startQuiz() {
  const cat = $("#quizCategory").value;
  // ensure every rule has question data
  const pool = rules.filter(r => r.question && Array.isArray(r.options) && r.options.length === 4);
  let candidates = cat === "all" ? pool : pool.filter(r => r.category === cat);
  if (!candidates.length) { toast("หมวดหมู่นี้ยังไม่มีคำถาม กรุณาเพิ่มกฎในหน้าครู"); return; }
  const chosen = shuffle(candidates).slice(0, Math.min(quizCount, candidates.length));
  const questions = shuffle(chosen).map(r => ({ rule: r, options: shuffle(r.options.map((text, i) => ({ text, correct: i === r.answer }))) }));
  quiz = { questions, index: 0, correct: 0, perQuestionTime: quizTime, timeLeft: quizTime, timer: null, answered: false, category: cat, startedAt: Date.now() };
  currentPhase = "play";
  $("#quizSetup").classList.add("hidden");
  $("#quizResult").classList.add("hidden");
  $("#quizPlay").classList.remove("hidden");
  showQuestion();
}
function showQuestion() {
  const q = quiz.questions[quiz.index];
  quiz.answered = false;
  $("#qIndex").textContent = quiz.index + 1;
  $("#qTotal").textContent = quiz.questions.length;
  $("#qProgressFill").style.width = (quiz.index / quiz.questions.length * 100) + "%";
  const cat = CATEGORIES[q.rule.category] || CATEGORIES.uniform;
  $("#qCategory").textContent = `${cat.icon} ${cat.name}`;
  $("#qText").textContent = q.rule.question;
  $("#qOptions").innerHTML = q.options.map((o, i) =>
    `<button class="option" data-opt="${i}"><span class="o-key">${LETTERS[i]}</span><span>${escapeHtml(o.text)}</span></button>`).join("");
  $("#qFeedback").className = "feedback hidden";
  $("#nextQBtn").classList.add("hidden");
  $$(".option", $("#qOptions")).forEach(b => b.addEventListener("click", () => answer(Number(b.dataset.opt))));

  // timer
  clearInterval(quiz.timer);
  const box = $("#timerBox");
  if (quiz.perQuestionTime > 0) {
    quiz.timeLeft = quiz.perQuestionTime;
    box.classList.remove("hidden");
    updateTimerDisplay();
    quiz.timer = setInterval(() => {
      quiz.timeLeft--;
      updateTimerDisplay();
      if (quiz.timeLeft <= 0) { clearInterval(quiz.timer); answer(-1); }
    }, 1000);
  } else {
    box.classList.add("hidden");
  }
}
function updateTimerDisplay() {
  $("#timerValue").textContent = quiz.timeLeft + " วิ";
  $("#timerBox").classList.toggle("danger", quiz.timeLeft <= 5);
}
function answer(idx) {
  if (quiz.answered) return;
  quiz.answered = true;
  clearInterval(quiz.timer);
  const q = quiz.questions[quiz.index];
  const correctIdx = q.options.findIndex(o => o.correct);
  const isCorrect = idx === correctIdx;
  if (isCorrect) quiz.correct++;
  else {
    if (!quiz.missed) quiz.missed = [];
    const title = q.rule.title;
    if (!quiz.missed.includes(title)) quiz.missed.push(title);
  }

  $$(".option", $("#qOptions")).forEach((b, i) => {
    b.disabled = true;
    if (i === correctIdx) b.classList.add("correct");
    else if (i === idx) b.classList.add("wrong");
  });
  const fb = $("#qFeedback");
  fb.className = "feedback " + (isCorrect ? "good" : "bad");
  fb.innerHTML = `<strong>${isCorrect ? "✅ ถูกต้อง!" : idx === -1 ? "⏰ หมดเวลา!" : "❌ ไม่ถูกต้อง"}</strong>
    ${isCorrect ? "ยอดเยี่ยม ทำต่อได้เลย!" : `เฉลย: ${LETTERS[correctIdx]}`}
    <div style="margin-top:6px;font-weight:400">${escapeHtml(q.rule.explanation || q.rule.detail)}</div>`;
  $("#nextQBtn").classList.remove("hidden");
  $("#nextQBtn").textContent = quiz.index === quiz.questions.length - 1 ? "ดูผลลัพธ์ →" : "ข้อถัดไป →";
}
$("#nextQBtn").addEventListener("click", () => {
  if (quiz.index < quiz.questions.length - 1) { quiz.index++; showQuestion(); }
  else finishQuiz();
});
$("#startQuizBtn").addEventListener("click", startQuiz);
$("#quitQuizBtn").addEventListener("click", () => { if (confirm("ออกจากแบบทดสอบตอนนี้หรือไม่?Progress จะไม่ถูกบันทึก")) showSetup(); });
$("#retryQuizBtn").addEventListener("click", () => { showSetup(); startQuiz(); });

function finishQuiz() {
  clearInterval(quiz.timer);
  const total = quiz.questions.length;
  const pct = Math.round(quiz.correct / total * 100);
  const elapsed = Math.max(1, Math.round((Date.now() - quiz.startedAt) / 60000));
  const catName = quiz.category === "all" ? "ทุกหมวดหมู่" : (CATEGORIES[quiz.category] || {}).name || "ทั่วไป";
  history.unshift({ date: todayStr(), correct: quiz.correct, total, pct, time: elapsed, categoryName: catName });
  save(KEYS.history, history);

  // mark reviewed rules that were answered
  quiz.questions.forEach(q => { review[q.rule.id] = todayStr(); });
  save(KEYS.review, review);
  updateBell();

  const emoji = pct >= 80 ? "🏆" : pct >= 50 ? "🎉" : "💪";
  const title = pct >= 80 ? "ยอดเยี่ยมมาก!" : pct >= 50 ? "ทำได้ดีมาก!" : "พยายามอีกนิด!";
  const sub = pct >= 80 ? "คุณเข้าใจกฎระเบียบได้เป็นอย่างดี" : pct >= 50 ? "ใกล้เป้าหมายแล้ว ลองทบทวนกฎที่ผิดดูนะ" : "ลองอ่านกฎระเบียบแล้วมาทดสอบใหม่นะ";
  $("#resultEmoji").textContent = emoji;
  $("#resultTitle").textContent = title;
  $("#resultSub").textContent = sub;
  $("#scoreRing").style.setProperty("--pct", pct + "%");
  $("#scoreValue").textContent = pct + "%";
  $("#resultSummary").innerHTML = `
    <div class="rs-item"><b class="ok">${quiz.correct}</b><span>ข้อถูก</span></div>
    <div class="rs-item"><b class="no">${total - quiz.correct}</b><span>ข้อผิด</span></div>
    <div class="rs-item"><b>${total}</b><span>ข้อทั้งหมด</span></div>`;
  const missed = (quiz.missed || []);
  $("#reviewBox").innerHTML = missed.length
    ? `<h4>📌 ควรทบทวนกฎเหล่านี้</h4><ul>${missed.map(t => `<li>• ${escapeHtml(t)}</li>`).join("")}</ul>`
    : `<h4>🎉 ไม่มีกฎที่ต้องทบทวน</h4><ul><li>คุณตอบถูกทุกข้อ ยอดเยี่ยม!</li></ul>`;

  currentPhase = "result";
  $("#quizPlay").classList.add("hidden");
  $("#quizResult").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- TEACHER ---------- */
function renderTeacher() {
  const avg = history.length ? Math.round(history.reduce((s, h) => s + h.pct, 0) / history.length) : 0;
  $("#teacherStats").innerHTML = `
    <div class="stat-card"><div class="stat-ico blue">📚</div><div><div class="stat-num">${rules.length}</div><div class="stat-label">กฎระเบียบทั้งหมด</div></div></div>
    <div class="stat-card"><div class="stat-ico green">🎯</div><div><div class="stat-num">${history.length}</div><div class="stat-label">ครั้งที่นักเรียนทดสอบ</div></div></div>
    <div class="stat-card"><div class="stat-ico purple">⭐</div><div><div class="stat-num">${avg}%</div><div class="stat-label">คะแนนเฉลี่ยรวม</div></div></div>`;
  $("#ruleCountLabel").textContent = `ทั้งหมด ${rules.length} กฎ`;
  $("#teacherTable").innerHTML = rules.map(r => {
    const cat = CATEGORIES[r.category] || CATEGORIES.uniform;
    const imp = IMPORTANCE[r.importance] || IMPORTANCE.low;
    return `<tr>
      <td><div class="rt-title">${escapeHtml(r.title)}</div><div class="muted">${escapeHtml((r.detail || "").slice(0, 60))}${(r.detail || "").length > 60 ? "..." : ""}</div></td>
      <td><span class="rt-tag" style="background:${cat.soft};color:${cat.color}">${cat.icon} ${cat.name}</span></td>
      <td><span class="badge-importance" style="color:${imp.color}">● ${imp.label}</span></td>
      <td>
        <button class="icon-btn" data-edit="${r.id}" title="แก้ไข">✏️</button>
        <button class="icon-btn del" data-del="${r.id}" title="ลบ">🗑️</button>
      </td>
    </tr>`;
  }).join("");
  $$("[data-del]", $("#teacherTable")).forEach(b => b.addEventListener("click", () => {
    const r = rules.find(x => x.id === b.dataset.del);
    if (!confirm(`ลบกฎ "${r ? r.title : ""}" หรือไม่?`)) return;
    rules = rules.filter(x => x.id !== b.dataset.del);
    save(KEYS.rules, rules);
    toast("ลบกฎแล้ว"); renderTeacher(); updateBell();
  }));
  $$("[data-edit]", $("#teacherTable")).forEach(b => b.addEventListener("click", () => openModal(b.dataset.edit)));
}

/* ---------- MODAL / FORM ---------- */
let editingId = null;
function fillCategorySelect() {
  $("#formCategory").innerHTML = Object.entries(CATEGORIES).map(([k, v]) => `<option value="${k}">${v.icon} ${v.name}</option>`).join("");
}
function openModal(id = null) {
  editingId = id;
  const form = $("#ruleForm");
  form.reset();
  $("#modalTitle").textContent = id ? "แก้ไขกฎระเบียบ" : "เพิ่มกฎระเบียบใหม่";
  $("#saveRuleBtn").textContent = id ? "บันทึกการแก้ไข" : "บันทึกกฎ";
  if (id) {
    const r = rules.find(x => x.id === id);
    if (r) {
      form.category.value = r.category;
      form.importance.value = r.importance;
      form.title.value = r.title;
      form.detail.value = r.detail;
      form.question.value = r.question || "";
      r.options.forEach((o, i) => { if (form["opt" + i]) form["opt" + i].value = o; });
      form.answer.value = String(r.answer);
      form.explanation.value = r.explanation || "";
    }
  }
  $("#modalOverlay").classList.remove("hidden");
}
function closeModal() { $("#modalOverlay").classList.add("hidden"); editingId = null; }
$("#openAddBtn").addEventListener("click", () => openModal());
$("#closeModalBtn").addEventListener("click", closeModal);
$("#cancelModalBtn").addEventListener("click", closeModal);
$("#modalOverlay").addEventListener("click", e => { if (e.target === $("#modalOverlay")) closeModal(); });
$("#ruleForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target;
  const data = {
    category: f.category.value,
    importance: f.importance.value,
    title: f.title.value.trim(),
    detail: f.detail.value.trim(),
    question: f.question.value.trim(),
    options: [0,1,2,3].map(i => f["opt" + i].value.trim()),
    answer: Number(f.answer.value),
    explanation: f.explanation.value.trim(),
  };
  if (data.options.some(o => !o)) { toast("กรุณากรอกตัวเลือกให้ครบ 4 ข้อ"); return; }
  if (editingId) {
    const i = rules.findIndex(x => x.id === editingId);
    rules[i] = { ...rules[i], ...data };
    toast("แก้ไขกฎเรียบร้อยแล้ว ✏️");
  } else {
    rules.push({ id: "r" + Date.now(), ...data });
    toast("เพิ่มกฎใหม่เรียบร้อยแล้ว ✅");
  }
  save(KEYS.rules, rules);
  closeModal(); renderTeacher(); updateBell();
});

/* ---------- Utility ---------- */
function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
}

/* ---------- Init ---------- */
buildCategoryOptions();
fillCategorySelect();
renderChips();
renderHome();
updateBell();
