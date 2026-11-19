/* 不晚AI小说助手 —— 单页应用（无依赖） */
(() => {
  'use strict'
  const $ = (id) => document.getElementById(id)
  const KEY = 'buwan.novel.v1'

  const PROVIDERS = [
    { id: 'lmstudio', name: 'LM Studio（本地）', base: 'http://127.0.0.1:1234/v1', model: '', free: true, note: '电脑上跑，完全免费、不联网', jump: 'https://lmstudio.ai/' },
    { id: 'ollama', name: 'Ollama（本地）', base: 'http://127.0.0.1:11434/v1', model: 'qwen2.5:7b', free: true, note: '电脑上跑，免费', jump: 'https://ollama.com/' },
    { id: 'siliconflow', name: '硅基流动 SiliconFlow', base: 'https://api.siliconflow.cn/v1', model: 'Qwen/Qwen2.5-7B-Instruct', free: true, note: '注册送额度，部分模型免费', jump: 'https://cloud.siliconflow.cn/account/ak' },
    { id: 'openrouter', name: 'OpenRouter', base: 'https://openrouter.ai/api/v1', model: 'deepseek/deepseek-chat-v3-0324:free', free: true, note: '有带 :free 后缀的免费模型', jump: 'https://openrouter.ai/keys' },
    { id: 'groq', name: 'Groq', base: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile', free: true, note: '有免费额度，速度极快', jump: 'https://console.groq.com/keys' },
    { id: 'deepseek', name: 'DeepSeek 官方', base: 'https://api.deepseek.com/v1', model: 'deepseek-chat', note: '便宜，中文写作强', jump: 'https://platform.deepseek.com/api_keys' },
    { id: 'zhipu', name: '智谱 GLM', base: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4-flash', note: 'glm-4-flash 有免费档', jump: 'https://open.bigmodel.cn/usercenter/apikeys' },
    { id: 'dashscope', name: '阿里通义千问', base: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus', note: '新用户有免费额度', jump: 'https://dashscope.console.aliyun.com/apiKey' },
    { id: 'moonshot', name: 'Moonshot Kimi', base: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k', note: '长上下文见长', jump: 'https://platform.moonshot.cn/console/api-keys' },
    { id: 'ark', name: '火山方舟 豆包', base: 'https://ark.cn-beijing.volces.com/api/v3', model: '', note: '需先创建推理接入点', jump: 'https://console.volcengine.com/ark' },
    { id: 'hunyuan', name: '腾讯混元', base: 'https://api.hunyuan.cloud.tencent.com/v1', model: 'hunyuan-lite', note: 'hunyuan-lite 免费', jump: 'https://console.cloud.tencent.com/hunyuan' },
    { id: 'qianfan', name: '百度文心千帆', base: 'https://qianfan.baidubce.com/v2', model: 'ernie-3.5-8k', note: '新用户有免费额度', jump: 'https://console.bce.baidu.com/qianfan' },
    { id: 'spark', name: '讯飞星火', base: 'https://spark-api-open.xf-yun.com/v1', model: 'generalv3.5', note: '有免费包', jump: 'https://console.xfyun.cn/' },
    { id: 'openai', name: 'OpenAI', base: 'https://api.openai.com/v1', model: 'gpt-4o-mini', note: '需自备 Key', jump: 'https://platform.openai.com/api-keys' },
    { id: 'gemini', name: 'Google Gemini', base: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'gemini-1.5-flash', note: '有免费档（OpenAI 兼容接口）', jump: 'https://aistudio.google.com/apikey' },
  ]

  const PERSONAS = [
    { id: 'cd', name: '辰东（洪荒苍茫）', text: '短句与排比交错，意象浓烈（血、骨、碑、坟、古路），悬念前置，章末留一句压场的话。' },
    { id: 'tcd', name: '天蚕土豆（热血升级）', text: '目标清晰、打脸爽快，战力层次具体，冲突密集，每章都有进展。' },
    { id: 'mq', name: '猫腻（文青底蕴）', text: '对话有腔调，慢热，句子讲究，常写人情与选择。' },
    { id: 'fh', name: '烽火（江湖金句）', text: '长句铺排气势，金句频出，情绪浓烈，场面感强。' },
    { id: 'ergen', name: '耳根（仙侠宿命）', text: '轮回与执念，叙述偏抒情，段落间留白。' },
    { id: 'gulong', name: '古龙体', text: '短句断行，气氛阴冷，对话机锋，留白多于解释。' },
    { id: 'fq_city', name: '番茄·都市脑洞', text: '开篇抛设定，主角立刻得好处，节奏极快，每章一个反转，口语化。' },
    { id: 'fq_zs', name: '番茄·战神赘婿', text: '先抑后扬，身份揭晓全场震惊，情绪直给，对话短促。' },
    { id: 'fq_nc', name: '番茄·年代文', text: '物资细节扎实，家长里短，主角靠先知与勤劳翻身。' },
    { id: 'xuanyi', name: '悬疑冷硬', text: '信息克制的第三人称，环境暗示危险，章末揭示小真相。' },
    { id: 'wcx', name: '我吃西红柿（简洁升级）', text: '少形容词，多动作与结果，目标单一不断变强，节奏明快。' },
    { id: 'wangyu', name: '忘语（凡人算计）', text: '主角谨慎、步步为营，资源与代价写得清楚，不轻易越级。' },
    { id: 'wuz', name: '乌贼（理性推演）', text: '设定严密，推理链条清楚，氛围阴冷，靠信息差制造张力。' },
    { id: 'zhouzi', name: '会说话的肘子（热血少年）', text: '少年气足，口语化对白多，情绪直给，打斗写意。' },
    { id: 'tangjia', name: '唐家三少（设定流）', text: '世界观设定清晰，等级体系明确，节奏稳定，感情线直白。' },
    { id: 'laoying', name: '老鹰吃小鸡（极速爽文）', text: '节奏极快，三章一个大事件，爽点密集，几乎不写日常。' },
    { id: 'dazhi', name: '打眼（都市鉴宝）', text: '细节考究，行话与器物描写专业，主角低调有底牌。' },
    { id: 'fq_tc', name: '番茄·甜宠总裁', text: '糖分高，误会快速解开，对话带钩子，每章一个心动瞬间。' },
    { id: 'fq_wx', name: '番茄·无限流', text: '规则怪谈开局，副本规则逐条揭示，紧张感靠信息差。' },
    { id: 'fq_ms', name: '番茄·末世囤货', text: '物资清单具体，危机一波接一波，主角谨慎留底牌。' },
    { id: 'fq_zt', name: '番茄·种田日常', text: '节奏舒缓，吃食与劳作写得香，小事见温情。' },
    { id: 'fq_yl', name: '番茄·娱乐圈', text: '热搜、剧本、黑红翻身，网友评论体穿插，打脸与出圈并重。' },
    { id: 'n频', name: '女频·古言宅斗', text: '内宅心机层层递进，对话含锋，女主冷静有手段。' },
  ]

  const SCALES = [['short', '短篇 10-60 章'], ['mid', '中篇 100-500 章'], ['long', '长篇 1000-3000 章']]
  const PACES = [['fast', '快节奏'], ['steady', '常规'], ['slow', '慢节奏']]

  const uid = () => Math.random().toString(36).slice(2, 10)
  const words = (t) => (t || '').replace(/\s/g, '').length
  const clip = (t, n) => { const s = (t || '').trim(); return s.length <= n ? s : s.slice(0, n) }
  const tail = (t, n) => { const s = (t || '').trim(); return s.length <= n ? s : s.slice(-n) }

  const SYSTEM = '你是一位签约于中文网络文学平台的资深小说作者。只输出小说正文，不输出解释、标题或大纲；用动作、对话与细节推进；严格守用户给的设定、人格与禁忌。'

  let state = null
  let tab = 'write'
  let busy = false
  let abort = null

  function newChapter(title) { return { id: uid(), title: title || '', outline: '', content: '', summary: '', words: 0 } }
  function newProject(title) {
    return {
      id: uid(), title: title || '未命名作品', author: '不晚', genre: '东方玄幻', logline: '', world: '', cast: '', style: '', taboos: '',
      scale: 'long', pace: 'steady', persona: { preset: 'cd', custom: '' }, memory: [], characters: [],
      chapters: [newChapter('第一章')],
    }
  }
  function newState() {
    const p = newProject('长夜烬明')
    p.logline = '被逐出宗门的少年，靠一柄会说话的断刀，在长夜里烧出一条证道之路。'
    p.world = '九州以「灯」为修行本源：人有灯则神魂不灭，灯灭则堕入长夜。宗门垄断灯油，寒门只能借月光修行。'
    p.characters = [
      { id: uid(), name: '沈烬', role: '主角', stage: 'early', desc: '嘴硬心软，目标查清师父之死', note: '' },
      { id: uid(), name: '老刀', role: '断刀残魂', stage: 'late', desc: '嘴毒护短，前期只被提及', note: '第 300 章才开口' },
    ]
    p.memory = [{ id: uid(), text: '「烧灯」会灼掉一段记忆，用一次少一段。' }]
    p.chapters = [Object.assign(newChapter('第一章 断刀'), { outline: '沈烬被逐出宗门，雨夜下山，山神庙避雨时断刀第一次开口，章末追灯亮起。' })]
    return {
      projects: [p], pid: p.id, cid: p.chapters[0].id,
      settings: { providerId: 'siliconflow', base: 'https://api.siliconflow.cn/v1', key: '', model: 'Qwen/Qwen2.5-7B-Instruct', temp: 0.9, maxTokens: 4096, words: 2200, fast: true },
      keys: {},
    }
  }
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) { const s = JSON.parse(raw); if (s && s.projects && s.projects.length) return s } } catch (e) {}
    return newState()
  }
  let saveTimer = 0
  function save() { clearTimeout(saveTimer); saveTimer = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch (e) {} }, 300) }
  function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2400) }

  const project = () => state.projects.find((p) => p.id === state.pid) || state.projects[0]
  const chapter = () => { const p = project(); return p.chapters.find((c) => c.id === state.cid) || p.chapters[0] }
  const provider = () => PROVIDERS.find((p) => p.id === state.settings.providerId) || PROVIDERS[0]

  /* ---------- 提示词 ---------- */
  function personaText(p) {
    const preset = PERSONAS.find((x) => x.id === p.persona.preset)
    return [preset ? preset.text : '', p.persona.custom || ''].filter(Boolean).join('\n')
  }
  function systemFor(p) {
    const persona = personaText(p)
    if (!persona) return SYSTEM
    return SYSTEM + '\n\n【本次写作的人格】\n' + persona + '\n执行要求：句式、节奏、用词、对话腔调都要贴合这个人格，不要写成通用网文腔。'
  }
  function brief(p) {
    const rows = []
    if (p.title) rows.push('书名：' + p.title)
    if (p.genre) rows.push('题材：' + p.genre)
    rows.push('篇幅：' + (SCALES.find((s) => s[0] === p.scale) || SCALES[2])[1] + '；节奏：' + (PACES.find((s) => s[0] === p.pace) || PACES[1])[1])
    if (p.logline) rows.push('简介：' + p.logline)
    if (p.world) rows.push('世界观：' + clip(p.world, 700))
    if (p.characters.length) {
      const group = ['early', 'mid', 'late'].map((stage) => {
        const list = p.characters.filter((c) => c.stage === stage)
        if (!list.length) return ''
        const name = stage === 'early' ? '前期' : stage === 'mid' ? '中期' : '后期'
        return name + '：' + list.slice(0, 6).map((c) => c.name + (c.role ? '（' + c.role + '）' : '')).join('、')
      }).filter(Boolean)
      if (group.length) rows.push('人物：\n' + group.join('\n'))
    } else if (p.cast) rows.push('人物：' + clip(p.cast, 400))
    if (p.style) rows.push('文风：' + clip(p.style, 300))
    if (p.taboos) rows.push('禁忌：' + clip(p.taboos, 200))
    if (p.memory.length) rows.push('长期记忆：\n' + p.memory.slice(-6).map((m) => '· ' + m.text).join('\n'))
    return rows.join('\n')
  }
  function chapterWords(c) { const s = state.settings; return Number(c.words) > 0 ? Number(c.words) : Number(s.words) }
  function contextOf(p, c) {
    const i = p.chapters.findIndex((x) => x.id === c.id)
    const before = p.chapters.slice(Math.max(0, i - 3), i)
    const rows = []
    const sums = before.filter((x) => x.summary).map((x) => x.title + '：' + x.summary)
    if (sums.length) rows.push('【前情提要】\n' + sums.join('\n'))
    const last = before[before.length - 1]
    if (last && last.content) rows.push('【上一章结尾】\n…' + tail(last.content, 700))
    return rows.join('\n\n')
  }
  function chapterPrompt(p, c) {
    return '【作品设定】\n' + brief(p) + '\n\n' + [contextOf(p, c)].filter(Boolean).join('\n\n') +
      (c.outline ? '\n\n【本章大纲】\n' + c.outline : '') +
      '\n\n【写作任务】\n写出这一章的完整正文，约 ' + chapterWords(c) + ' 字。直接从场景开始，多用动作与对话，章末留钩子，只输出正文。'
  }
  function titlePrompt(p, c) {
    return '【作品设定】\n' + brief(p) + '\n\n【本章】\n大纲：' + (clip(c.outline, 160) || '无') + '\n正文开头：' + (clip(c.content, 260) || '无') +
      '\n\n【任务】为这一章起一个 4-10 字的章节名，有悬念，不要「第N章」前缀，不要书名号，只输出一个名字。'
  }
  function summaryPrompt(c) { return '【本章正文】\n' + tail(c.content, 5000) + '\n\n【任务】用 120-160 字概括本章：发生了什么、关键转折、人物状态、结尾悬念。只输出摘要。' }
  function setupPrompt(p, idea) {
    return '【一句话想法】\n' + idea + '\n\n【任务】为这部作品设计设定，严格按格式输出，不要解释：\n【书名】…\n【一句话简介】…（40 字内）\n【世界观】…（200-300 字）\n【主要人物】…（3-5 人，每行：姓名｜身份｜性格｜目标｜缺陷）\n【文风】…\n【禁忌】…'
  }
  function parseSetup(text, p) {
    const grab = (n) => { const m = new RegExp('【' + n + '】\\s*([\\s\\S]*?)(?=\\n【|$)').exec(text); return m ? m[1].trim() : '' }
    if (grab('书名')) p.title = grab('书名').replace(/[《》]/g, '')
    if (grab('一句话简介')) p.logline = grab('一句话简介')
    if (grab('世界观')) p.world = grab('世界观')
    if (grab('文风')) p.style = grab('文风')
    if (grab('禁忌')) p.taboos = grab('禁忌')
    const cast = grab('主要人物')
    if (cast) {
      const list = []
      cast.split('\n').forEach((line) => {
        const parts = line.split(/[｜|]/).map((s) => s.trim()).filter(Boolean)
        if (parts.length >= 2) list.push({ id: uid(), name: parts[0], role: parts[1] || '', desc: parts.slice(2).join('｜'), stage: 'early', note: '' })
      })
      if (list.length) p.characters = list
    }
  }

  /* ---------- 接口 ---------- */
  async function stream(messages, onDelta) {
    const s = state.settings
    const controller = new AbortController()
    abort = controller
    const body = { model: s.model || provider().model, messages, temperature: Number(s.temp), max_tokens: Number(s.maxTokens), stream: true }
    if (s.fast) body.reasoning_effort = 'none'
    try {
      if (window.BuwanBridge) {
        const hdrs = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (s.key || '') }
        const raw = window.BuwanBridge.post(s.base.replace(/\/$/, '') + '/chat/completions', JSON.stringify(hdrs), JSON.stringify(Object.assign({}, body, { stream: false })))
        const j = JSON.parse(raw)
        if (j.error) throw new Error(String(j.error))
        const msg = j.choices && j.choices[0] && j.choices[0].message
        const text = (msg && msg.content) || ''
        if (text) onDelta(text)
        return
      }
      const direct = window.BUWAN_DIRECT === true || location.protocol === 'file:'
      const res = await fetch(direct ? s.base.replace(/\/$/, '') + '/chat/completions' : '/api/chat', {
        method: 'POST',
        headers: direct
          ? { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (s.key || '') }
          : { 'Content-Type': 'application/json', 'x-base': s.base, 'x-key': s.key || '' },
        body: JSON.stringify(body), signal: controller.signal,
      })
      if (!res.ok) throw new Error((await res.text()).slice(0, 240))
      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let buf = ''
      while (true) {
        const chunk = await reader.read()
        if (chunk.done) break
        buf += dec.decode(chunk.value, { stream: true })
        let cut
        while ((cut = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, cut).trim()
          buf = buf.slice(cut + 1)
          if (line.indexOf('data:') !== 0) continue
          const payload = line.slice(5).trim()
          if (payload === '[DONE]') return
          try {
            const j = JSON.parse(payload)
            const d = j.choices && j.choices[0] && j.choices[0].delta
            if (d && d.content) onDelta(d.content)
          } catch (e) {}
        }
      }
    } finally { abort = null }
  }
  async function ask(prompt, system) {
    let out = ''
    await stream([{ role: 'system', content: system || systemFor(project()) }, { role: 'user', content: prompt }], (d) => { out += d })
    return out
  }
  async function ping() {
    const s = state.settings
    try {
      const direct = window.BUWAN_DIRECT === true || location.protocol === 'file:'
      const res = await fetch(direct ? s.base.replace(/\/$/, '') + '/models' : '/api/models', {
        headers: direct
          ? { Authorization: 'Bearer ' + (s.key || '') }
          : { 'x-base': s.base, 'x-key': s.key || '' },
      })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const json = await res.json()
      const list = (json.data || []).map((m) => m.id)
      if (!s.model && list.length) { s.model = list[0]; save() }
      $('dot').className = 'dot on'
      $('statusText').textContent = (list.length ? list.length + ' 个模型 · ' : '') + provider().name
      return list
    } catch (e) {
      $('dot').className = 'dot off'
      $('statusText').textContent = '未连接：' + (e.message || e)
      return []
    }
  }

  /* ---------- 渲染工具 ---------- */
  const h = (tag, attrs, ...kids) => {
    const el = document.createElement(tag)
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') el.className = v
      else if (k === 'html') el.innerHTML = v
      else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v)
      else if (v !== undefined && v !== null) el.setAttribute(k, v)
    }
    for (const kid of kids.flat()) if (kid !== null && kid !== undefined && kid !== false) el.append(kid.nodeType ? kid : document.createTextNode(String(kid)))
    return el
  }
  const btn = (label, fn, cls = '') => h('button', { class: 'btn ' + cls, type: 'button', onclick: fn }, label)
  const field = (label, node, hint) => h('label', { class: 'f' }, h('span', null, label), node, hint ? h('div', { class: 'hint' }, hint) : null)
  const input = (value, oninput, placeholder) => h('input', { value: value || '', placeholder: placeholder || '', oninput })
  const area = (value, oninput, rows, placeholder) => h('textarea', { rows: rows || 3, placeholder: placeholder || '', oninput }, value || '')
  const select = (value, options, onchange) => h('select', { onchange }, options.map(([v, label]) => h('option', { value: v, selected: v === value ? 'selected' : null }, label)))

  /* ---------- 动作 ---------- */
  function askText(title, placeholder, onOk) {
    const mask = h('div', {
      style: 'position:fixed;inset:0;background:rgba(0,0,0,.62);display:flex;align-items:center;justify-content:center;z-index:99;padding:20px',
    },
    h('div', { style: 'background:#1a1714;border:1px solid #302a24;border-radius:14px;padding:16px;width:min(360px,88vw)' },
      h('h4', { style: 'margin:0 0 10px;font-size:14px;color:#d9a441' }, title),
      h('input', { id: 'askInput', placeholder: placeholder || '', value: '' }),
      h('div', { style: 'display:flex;gap:8px;justify-content:flex-end;margin-top:12px' },
        h('button', { class: 'btn', onclick: () => mask.remove() }, '取消'),
        h('button', {
          class: 'btn primary',
          onclick: () => {
            const v = $('askInput').value.trim()
            mask.remove()
            if (v) onOk(v)
          },
        }, '确定'))))
    document.body.append(mask)
    setTimeout(() => { const i = $('askInput'); if (i) i.focus() }, 60)
  }

  function createProject() {
    askText('新建小说', '书名，例如：长夜烬明', (name) => {
      const np = newProject(name)
      state.projects.push(np)
      state.pid = np.id
      state.cid = np.chapters[0].id
      save(); tab = 'setting'; render(); toast('已创建《' + name + '》')
    })
  }

  async function generateCurrent() {
    if (busy) return
    const c = chapter()
    const p = project()
    busy = true
    c.content = ''
    try {
      await stream([{ role: 'system', content: systemFor(p) }, { role: 'user', content: chapterPrompt(p, c) }], (d) => {
        c.content += d
        const ta = $('editor')
        if (ta) { ta.value = c.content; ta.scrollTop = ta.scrollHeight }
      })
      save(); render(); toast('本章已生成 ' + words(c.content) + ' 字')
    } catch (e) { toast('生成失败：' + (e.message || e)) } finally { busy = false }
  }
  async function generateNext() {
    if (busy) return
    const p = project()
    const idx = p.chapters.findIndex((c) => c.id === state.cid)
    let target = p.chapters.slice(idx + 1).find((c) => !c.content.trim())
    if (!target) { target = newChapter('第' + (p.chapters.length + 1) + '章'); p.chapters.push(target) }
    state.cid = target.id
    busy = true
    render()
    try {
      await stream([{ role: 'system', content: systemFor(p) }, { role: 'user', content: chapterPrompt(p, target) }], (d) => {
        target.content += d
        const ta = $('editor')
        if (ta) { ta.value = target.content; ta.scrollTop = ta.scrollHeight }
      })
      const name = (await ask(titlePrompt(p, target))).split('\n').map((s) => s.replace(/^\s*\d+\s*[.、:：)）]\s*/, '').replace(/[《》【】"']/g, '').trim()).filter(Boolean)[0]
      if (name) target.title = '第' + (p.chapters.indexOf(target) + 1) + '章 ' + clip(name, 14)
      const sum = (await ask(summaryPrompt(target))).trim()
      target.summary = clip(sum, 160)
      if (target.summary) p.memory.push({ id: uid(), text: clip(sum, 80) })
      if (p.memory.length > 40) p.memory = p.memory.slice(-40)
      save(); render(); toast('下一章已生成：' + target.title)
    } catch (e) { toast('失败：' + (e.message || e)) } finally { busy = false }
  }
  async function polish() {
    const ta = $('editor')
    if (!ta || ta.selectionStart === ta.selectionEnd) return toast('请先在正文里选中一段')
    const c = chapter()
    const text = c.content.slice(ta.selectionStart, ta.selectionEnd)
    busy = true
    try {
      const out = await ask('【原文】\n' + text + '\n\n【任务】润色：保留情节与信息，优化动词与节奏，删空话。只输出润色后的文字。')
      if (out.trim()) { c.content = c.content.slice(0, ta.selectionStart) + out + c.content.slice(ta.selectionEnd); save(); render() }
      toast('已润色')
    } catch (e) { toast('失败：' + (e.message || e)) } finally { busy = false }
  }
  async function summarize() {
    const c = chapter()
    if (!c.content.trim()) return toast('本章还没有正文')
    busy = true
    try {
      c.summary = clip((await ask(summaryPrompt(c))).trim(), 160)
      if (c.summary) project().memory.push({ id: uid(), text: clip(c.summary, 80) })
      save(); render(); toast('摘要已保存')
    } catch (e) { toast('失败：' + (e.message || e)) } finally { busy = false }
  }
  async function nameChapter() {
    const c = chapter()
    if (!c.content && !c.outline) return toast('先写大纲或正文')
    busy = true
    try {
      const name = (await ask(titlePrompt(project(), c))).split('\n')[0].replace(/[《》【】"']/g, '').trim()
      if (name) { c.title = '第' + (project().chapters.indexOf(c) + 1) + '章 ' + clip(name, 14); save(); render() }
      toast('已命名：' + c.title)
    } catch (e) { toast('失败：' + (e.message || e)) } finally { busy = false }
  }
  async function oneClickSetup() {
    askText('一句话想法', '例：末世十年后主角重生回灾难前一天', async (idea) => {
      busy = true; toast('生成设定中…')
      try {
        parseSetup(await ask(setupPrompt(project(), idea)), project())
        save(); render(); toast('设定已生成')
      } catch (e) { toast('失败：' + (e.message || e)) } finally { busy = false }
    })
  }
  const FIELD_TASKS = {
    title: '为这本书起 5 个书名，每个 2-8 字，每行一个，不要书名号，不要解释。',
    logline: '写一句 40 字以内的一句话简介：含主角、处境和一个钩子。只输出这一句。',
    world: '写 200-300 字世界观：力量体系的规则、限制与代价。只输出正文。',
    style: '写一句文风建议：句式、节奏、叙事视角。只输出这一句。',
    cast: '写 3-5 个主要人物，每行：姓名｜身份｜性格｜目标｜缺陷。只输出这些行。',
  }
  async function generateField(kind) {
    const p = project()
    busy = true; toast('生成中…')
    try {
      const out = (await ask('【作品设定】\n' + brief(p) + '\n\n【任务】\n' + FIELD_TASKS[kind], SYSTEM)).trim()
      if (kind === 'title') {
        const first = out.split('\n').map((s) => s.replace(/[《》【】0-9.、:：]/g, '').trim()).filter(Boolean)[0]
        if (first) p.title = clip(first, 12)
      } else if (kind === 'logline') p.logline = out.split('\n')[0]
      else if (kind === 'world') p.world = out
      else if (kind === 'style') p.style = out.split('\n')[0]
      else if (kind === 'cast') p.cast = out
      save(); render(); toast('已生成')
    } catch (e) { toast('失败：' + (e.message || e)) } finally { busy = false }
  }

  async function genCharacters() {    const p = project()
    busy = true; toast('生成人物中…')
    try {
      const text = await ask('【作品设定】\n' + brief(p) + '\n\n【任务】设计 10-14 人的人物表，覆盖前期/中期/后期（后期可只在传闻里出现）。每行：前期｜姓名｜身份｜性格与目标｜出场说明。只输出这些行。')
      const list = []
      text.split('\n').forEach((line) => {
        const parts = line.split(/[｜|]/).map((s) => s.trim())
        if (parts.length < 3) return
        const stage = parts[0].includes('前期') ? 'early' : parts[0].includes('中期') ? 'mid' : parts[0].includes('后期') ? 'late' : ''
        if (!stage || !parts[1]) return
        list.push({ id: uid(), name: parts[1], role: parts[2] || '', desc: parts[3] || '', stage, note: parts[4] || '' })
      })
      if (!list.length) return toast('没解析到人物')
      p.characters = p.characters.concat(list.filter((x) => !p.characters.some((y) => y.name === x.name)))
      save(); render(); toast('已生成 ' + list.length + ' 人')
    } catch (e) { toast('失败：' + (e.message || e)) } finally { busy = false }
  }

  /* ---------- 视图 ---------- */
  const TABS = [['write', '写作'], ['setting', '设定'], ['chars', '人物'], ['persona', '人格'], ['api', '接口'], ['help', '帮助']]

  function renderNav() {
    const nav = $('nav')
    nav.innerHTML = ''
    TABS.forEach(([id, label]) => nav.append(h('button', { class: tab === id ? 'on' : '', onclick: () => { tab = id; render() } }, label)))
  }

  async function analyzeCopy() {
    const text = (state.copyText || '').trim()
    if (text.length < 80) return toast('先粘贴至少 80 字的文章')
    busy = true; toast('分析文风中…')
    try {
      state.copyProfile = (await ask('【文章】\n' + text.slice(0, 4000) +
        '\n\n【任务】用 5 行概括其文风：题材与基调 / 人称与视角 / 句式与节奏 / 用词与修辞 / 对话与场景。只输出这 5 行，不要评价。', SYSTEM)).trim()
      save(); render(); toast('文风画像已生成')
    } catch (e) { toast('失败：' + (e.message || e)) } finally { busy = false }
  }

  function saveCopy() {
    const text = (state.copyText || '').trim()
    if (!text) return toast('先粘贴文章')
    state.samples = (state.samples || []).concat([{ id: uid(), title: '素材 ' + ((state.samples || []).length + 1), text, profile: state.copyProfile || '' }])
    save(); render(); toast('已存入素材')
  }

  async function imitateCopy() {
    const p = project()
    const c = chapter()
    const profile = state.copyProfile || ''
    const text = (state.copyText || '').trim()
    if (!profile && !text) return toast('先粘贴文章，或点「分析文风」')
    busy = true
    c.content = ''
    const ta0 = $('editor')
    if (ta0) ta0.value = ''
    try {
      await stream([{ role: 'system', content: systemFor(p) }, {
        role: 'user', content:
          '【参考文风】\n' + (profile || text.slice(0, 1500)) +
          '\n\n【作品设定】\n' + brief(p) +
          (c.outline ? '\n\n【本章大纲】\n' + c.outline : '') +
          '\n\n【任务】用参考文风的句式、节奏与用词写本章正文，约 ' + chapterWords(c) + ' 字。情节必须原创，禁止照抄参考文本的句子、人名、专有名词。只输出正文。',
      }], (d) => {
        c.content += d
        const ta = $('editor')
        if (ta) { ta.value = c.content; ta.scrollTop = ta.scrollHeight }
      })
      save(); render(); toast('仿写完成 ' + words(c.content) + ' 字')
    } catch (e) { toast('失败：' + (e.message || e)) } finally { busy = false }
  }

  function deleteProject() {
    if (state.projects.length <= 1) return toast('至少保留一部小说')
    if (!confirm('删除《' + (project().title || '未命名作品') + '》？删了就找不回来了')) return
    state.projects = state.projects.filter((x) => x.id !== state.pid)
    state.pid = state.projects[0].id
    state.cid = project().chapters[0].id
    save(); render(); toast('已删除')
  }

  function deleteChapter() {
    const p = project()
    if (p.chapters.length <= 1) return toast('至少保留一章')
    if (!confirm('删除「' + (chapter().title || '本章') + '」？')) return
    const id = state.cid
    p.chapters = p.chapters.filter((x) => x.id !== id)
    state.cid = p.chapters[0].id
    save(); render(); toast('已删除')
  }

  function viewWrite() {
    const p = project()
    const c = chapter()
    return h('div', null,
      h('div', { class: 'row', style: 'margin-bottom:10px' },
        select(state.pid, state.projects.map((x) => [x.id, x.title || '未命名作品']), (e) => {
          state.pid = e.target.value
          const np = project()
          state.cid = np.chapters[0].id
          save(); render()
        }),
        btn('＋ 新小说', createProject, 'mini'),
        btn('🗑 删小说', deleteProject, 'mini')),
      h('div', { class: 'chips' }, p.chapters.map((x, i) => h('button', {
        class: 'chip' + (x.id === c.id ? ' on' : ''), onclick: () => { state.cid = x.id; render() },
      }, x.title || '第' + (i + 1) + '章'))),
      h('div', { class: 'card' },
        h('div', { class: 'row', style: 'margin-bottom:8px' },
          h('b', { style: 'flex:1' }, c.title || '未命名章节'),
          h('span', { class: 'hint', style: 'margin:0' }, words(c.content) + ' 字' + (c.summary ? ' · 有摘要' : ''))),
        h('div', { class: 'row' }, btn('＋ 新章节', () => { const n = newChapter('第' + (p.chapters.length + 1) + '章'); p.chapters.push(n); state.cid = n.id; save(); render() }, 'mini'),
          btn('🗑 删本章', deleteChapter, 'mini')),
        field('本章大纲', area(c.outline, (e) => { c.outline = e.target.value; save() }, 2, '这一章要发生什么：场景、冲突、转折、钩子…')),
        h('textarea', { class: 'editor', id: 'editor', placeholder: '点「生成本章」开始，或直接手写…', oninput: (e) => { c.content = e.target.value; save() } }, c.content),
        field('本章字数（留空跟随默认 ' + state.settings.words + ' 字）', input(c.words || '', (e) => { c.words = Number(e.target.value) || 0; save() }, String(state.settings.words))),
        h('div', { class: 'bar' },
          btn('生成本章', generateCurrent, 'primary'),
          btn('生成下一章', generateNext),
          btn('续写', async () => {
            if (!c.content.trim()) return toast('先有正文')
            busy = true
            try {
              await stream([{ role: 'system', content: systemFor(p) }, { role: 'user', content: '【已写正文结尾】\n…' + tail(c.content, 3000) + '\n\n【任务】自然接续，再写约 ' + chapterWords(c) + ' 字，只输出新内容。' }], (d) => { c.content += d; const ta = $('editor'); if (ta) ta.value = c.content })
              save(); render()
            } catch (e) { toast('失败：' + (e.message || e)) } finally { busy = false }
          }),
          btn('润色选中', polish),
          btn('生成摘要', summarize),
          btn('生成本章名', nameChapter),
          btn('连续 3 章', async () => { for (let i = 0; i < 3; i++) await generateNext() }),
          h('button', {
            class: 'btn', type: 'button',
            style: 'border-color:#6a2c2c;color:#ffb3ae;background:#2a1717',
            onclick: () => {
              if (abort) { try { abort.abort() } catch (e) {} toast('已暂停，已生成的内容会保留') }
              else toast('当前没有正在生成的请求')
            },
          }, '■ 暂停'),
        ),
        h('div', { class: 'hint' }, '生成本章=重写当前章；生成下一章=往后推一章并自动起名+摘要；连续 3 章=自动推三步。'),
      ),
      h('div', { class: 'card' },
        h('h3', null, '仿写（粘贴一篇文章，学它的笔法）'),
        area(state.copyText || '', (e) => { state.copyText = e.target.value; save() }, 6, '把想模仿的文章粘贴到这里（两三段就够）…'),
        h('div', { class: 'row', style: 'margin-top:8px' },
          btn('分析文风', analyzeCopy, 'mini'),
          btn('仿写本章', imitateCopy, 'mini primary'),
          btn('存入素材', saveCopy, 'mini')),
        h('div', { class: 'hint' }, state.copyProfile ? ('文风画像：' + state.copyProfile.replace(/\n/g, ' / ')) : '分析后会把文风画像带进仿写提示词；不分析则直接用原文片段。'),
        (state.samples || []).length
          ? h('ul', { class: 'list' }, (state.samples || []).map((s) => h('li', null,
            h('span', null, s.title),
            h('button', { onclick: () => { state.copyText = s.text; state.copyProfile = s.profile || ''; save(); render() } }, '载入'),
            h('button', { onclick: () => { state.samples = state.samples.filter((x) => x.id !== s.id); save(); render() } }, '✕'))))
          : null,
      ),
      h('div', { class: 'card' },
        h('h3', null, '记忆（写进每次生成的提示词）'),
        h('ul', { class: 'list' }, p.memory.map((m) => h('li', null, h('span', null, m.text), h('button', { onclick: () => { p.memory = p.memory.filter((x) => x.id !== m.id); save(); render() } }, '✕')))),
        h('div', { class: 'row', style: 'margin-top:8px' }, input('', (e) => { if (e.key === 'Enter' && e.target.value.trim()) { p.memory.push({ id: uid(), text: e.target.value.trim() }); save(); render() } }, '记一条设定，回车保存')),
      ),
    )
  }

  const COVER_THEMES = {
    ink: { bg: '#15110c', frame: '#d3a25a', ink: '#f3e6d0', sub: '#c9a878' },
    paper: { bg: '#efe7d6', frame: '#6b5a44', ink: '#241d15', sub: '#5b4a35' },
    neon: { bg: '#0a1024', frame: '#5cf0d0', ink: '#e8f6ff', sub: '#7fd8ff' },
    night: { bg: '#101a2b', frame: '#8fb6e8', ink: '#e6eefc', sub: '#9db6d8' },
  }

  function coverSvg(p) {
    const c = p.cover || {}
    const t = COVER_THEMES[c.template] || COVER_THEMES.ink
    const esc = (s) => String(s || '').replace(/[<>&]/g, (x) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[x]))
    const title = p.title || '未命名作品'
    const lines = []
    for (let i = 0; i < title.length && lines.length < 4; i += 5) lines.push(title.slice(i, i + 5))
    const startY = 300 - (lines.length - 1) * 36
    const body = lines.map((line, i) => '<text x="300" y="' + (startY + i * 72) + '" text-anchor="middle" font-size="58" font-family="Songti SC,SimSun,serif" font-weight="700" fill="' + t.ink + '" letter-spacing="4">' + esc(line) + '</text>').join('')
    return '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="840" viewBox="0 0 600 840">' +
      '<rect width="600" height="840" fill="' + t.bg + '"/>' +
      '<rect x="28" y="28" width="544" height="784" fill="none" stroke="' + t.frame + '" stroke-width="2" opacity=".55"/>' +
      '<rect x="44" y="44" width="512" height="752" fill="none" stroke="' + t.frame + '" stroke-width="1" opacity=".3"/>' +
      '<rect x="236" y="150" width="128" height="34" rx="6" fill="none" stroke="' + t.frame + '" stroke-width="2"/>' +
      '<text x="300" y="174" text-anchor="middle" font-size="17" fill="' + t.frame + '" letter-spacing="6">' + esc((p.genre || '小说').slice(0, 6)) + '</text>' +
      body +
      (c.subtitle ? '<text x="300" y="625" text-anchor="middle" font-size="21" fill="' + t.sub + '" letter-spacing="3">' + esc(c.subtitle.slice(0, 18)) + '</text>' : '') +
      (c.author ? '<text x="300" y="700" text-anchor="middle" font-size="22" fill="' + t.sub + '" letter-spacing="2">' + esc(c.author.slice(0, 12)) + ' 著</text>' : '') +
      '<text x="300" y="790" text-anchor="middle" font-size="14" fill="' + t.sub + '" opacity=".55" letter-spacing="4">不 晚</text>' +
      '</svg>'
  }

  function viewSetting() {
    const p = project()
    const set = (key) => (e) => { p[key] = e.target.value; save() }
    return h('div', null,
      h('div', { class: 'card' },
        h('h3', null, '篇幅与节奏'),
        h('div', { class: 'row' },
          select(p.scale, SCALES, (e) => { p.scale = e.target.value; save() }),
          select(p.pace, PACES, (e) => { p.pace = e.target.value; save() })),
        h('p', { class: 'hint' }, '篇幅决定推进速度与能不能收尾（长篇禁止十章完本），节奏决定每章几个推进点。两者都会写进提示词，随时可改。')),
      h('div', { class: 'card' },
        h('h3', null, '作品设定'),
        h('div', { class: 'row', style: 'margin-bottom:10px' }, btn('⚡ 一键生成设定', oneClickSetup, 'primary')),
        h('div', { class: 'row', style: 'margin-bottom:10px' },
          btn('书名', () => generateField('title'), 'mini'),
          btn('简介', () => generateField('logline'), 'mini'),
          btn('世界观', () => generateField('world'), 'mini'),
          btn('文风', () => generateField('style'), 'mini'),
          btn('人物', () => generateField('cast'), 'mini')),
        field('书名', input(p.title, set('title'))),
        field('题材', input(p.genre, set('genre'))),
        field('一句话简介', area(p.logline, set('logline'), 2)),
        field('世界观', area(p.world, set('world'), 4)),
        field('人物补充', area(p.cast, set('cast'), 2, '人物表里没写到的角色')),
        field('文风', area(p.style, set('style'), 2)),
        field('禁忌', area(p.taboos, set('taboos'), 2)),
        h('div', { class: 'card' },
          h('h3', null, '封面'),
          h('div', { class: 'row', style: 'margin-bottom:8px' },
            select((p.cover && p.cover.template) || 'ink', [['ink', '墨金'], ['paper', '宣纸'], ['neon', '霓虹'], ['night', '夜色']], (e) => {
              p.cover = Object.assign({}, p.cover, { template: e.target.value })
              save()
              const img = $('coverImg')
              if (img) img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(coverSvg(p))
            })),
          field('副标题', input((p.cover && p.cover.subtitle) || '', (e) => {
            p.cover = Object.assign({}, p.cover, { subtitle: e.target.value })
            save()
            const img = $('coverImg')
            if (img) img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(coverSvg(p))
          })),
          field('作者', input((p.cover && p.cover.author) || '', (e) => {
            p.cover = Object.assign({}, p.cover, { author: e.target.value })
            save()
            const img = $('coverImg')
            if (img) img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(coverSvg(p))
          })),
          h('div', { style: 'text-align:center;margin-top:4px' },
            h('img', { id: 'coverImg', src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(coverSvg(p)), style: 'width:180px;border-radius:8px;border:1px solid #302a24' })),
          h('div', { class: 'hint' }, '书名与题材自动带进来；手机上长按封面图保存到相册，电脑上右键另存为图片。')),
        h('div', { class: 'card' },
          h('h3', null, '数据备份（换设备用）'),
          h('div', { class: 'row', style: 'margin-bottom:8px' },
            btn('生成备份串', () => {
              state.exportText = JSON.stringify(state)
              save(); render(); toast('已生成，全选复制这段文本')
            }, 'mini'),
            btn('从框内导入', () => {
              try {
                const next = JSON.parse(state.exportText || '')
                if (!next || !next.projects || !next.projects.length) throw new Error('不是有效的备份')
                state = next
                save(); tab = 'write'; render(); toast('导入成功')
              } catch (e) { toast('导入失败：' + (e.message || e)) }
            }, 'mini primary')),
          area(state.exportText || '', (e) => { state.exportText = e.target.value; save() }, 5, '换设备时：旧设备点「生成备份串」→ 复制 → 新设备粘到这里 → 点「从框内导入」')),
      ),
    )
  }

  function viewChars() {
    const p = project()
    const stageName = { early: '前期', mid: '中期', late: '后期' }
    return h('div', null,
      h('div', { class: 'card' },
        h('h3', null, '人物表（' + p.characters.length + ' 人）'),
        h('div', { class: 'row', style: 'margin-bottom:8px' }, btn('⚡ 按阶段生成人物', genCharacters, 'primary')),
        ['early', 'mid', 'late'].map((stage) => h('div', null,
          h('div', { class: 'hint', style: 'margin:8px 0 4px;color:#c9a86a' }, stageName[stage] + '（' + p.characters.filter((c) => c.stage === stage).length + '）'),
          h('ul', { class: 'list' }, p.characters.filter((c) => c.stage === stage).map((c) => h('li', null,
            h('span', null, h('b', null, c.name), c.role ? '｜' + c.role : '', c.desc ? '｜' + clip(c.desc, 20) : '', c.note ? '（' + clip(c.note, 12) + '）' : ''),
            h('button', { onclick: () => { p.characters = p.characters.filter((x) => x.id !== c.id); save(); render() } }, '✕')))))),
        h('div', { class: 'row', style: 'margin-top:8px' },
          input('', (e) => { e.key === 'Enter' && (window.__newChar = e.target.value) }, '姓名，回车添加'),
          select('early', [['early', '前期'], ['mid', '中期'], ['late', '后期']], (e) => { window.__newStage = e.target.value })),
        h('div', { class: 'row' }, btn('＋ 添加', () => {
          const name = (window.__newChar || '').trim()
          if (!name) return toast('先填姓名')
          p.characters.push({ id: uid(), name, role: '', desc: '', stage: window.__newStage || 'early', note: '' })
          save(); render()
        }, 'mini'))),
      h('p', { class: 'hint' }, '后期人物可以是"前期只被提及、后期才登场"——生成时模型会看到阶段，不会提前写出来。'),
    )
  }

  function viewPersona() {
    const p = project()
    return h('div', null,
      h('div', { class: 'card' },
        h('h3', null, '作者人格'),
        field('预设', select(p.persona.preset, PERSONAS.map((x) => [x.id, x.name]), (e) => { p.persona.preset = e.target.value; save(); render() })),
        field('自定义补充', area(p.persona.custom, (e) => { p.persona.custom = e.target.value; save() }, 4, '再补：常用意象、句式、禁忌、节奏偏好…')),
        h('p', { class: 'hint' }, '当前人格会作为 system 消息里的「写作人格」传下去，句式与腔调以它为准。'),
        h('div', { class: 'hint', style: 'color:#c9a86a' }, personaText(p) || '未选择人格')),
    )
  }

  function viewApi() {
    const s = state.settings
    const p = provider()
    return h('div', null,
      h('div', { class: 'card' },
        h('h3', null, '选择 AI 接口'),
        field('接口', select(s.providerId, PROVIDERS.map((x) => [x.id, x.name + (x.free ? '（免费）' : '')]), (e) => {
          const next = PROVIDERS.find((x) => x.id === e.target.value)
          s.providerId = next.id
          s.base = next.base
          s.key = (state.keys[next.id] || '')
          s.model = next.model
          save(); render(); ping()
        })),
        h('p', { class: 'hint' }, p.note || ''),
        h('div', { class: 'row', style: 'margin-bottom:10px' },
          btn('去申请 / 查看 Key ↗', () => window.open(p.jump, '_blank', 'noopener'), 'jump'),
          btn('测试连接', async () => { const list = await ping(); toast(list.length ? '连接成功，' + list.length + ' 个模型' : '连接失败，看右上角提示') }, 'mini')),
        field('Base URL', input(s.base, (e) => { s.base = e.target.value; save() })),
        field('API Key（只存本机浏览器）', h('input', { type: 'password', value: s.key || '', oninput: (e) => { s.key = e.target.value; state.keys[s.providerId] = e.target.value; save() } })),
        field('模型', input(s.model, (e) => { s.model = e.target.value; save() }), '可点「测试连接」自动填第一个模型；也可手填')),
      h('div', { class: 'card' },
        h('h3', null, '生成参数'),
        field('温度 ' + Number(s.temp).toFixed(2), h('input', { type: 'range', min: '0', max: '1.5', step: '0.05', value: s.temp, oninput: (e) => { s.temp = Number(e.target.value); save(); render() } })),
        field('单次最大输出 ' + s.maxTokens, h('input', { type: 'range', min: '512', max: '8192', step: '128', value: s.maxTokens, oninput: (e) => { s.maxTokens = Number(e.target.value); save(); render() } })),
        field('默认每章字数 ' + s.words, h('input', { type: 'range', min: '600', max: '6000', step: '100', value: s.words, oninput: (e) => { s.words = Number(e.target.value); save(); render() } })),
        field('快速模式（关闭思考）', h('input', { type: 'checkbox', checked: s.fast ? 'checked' : null, onchange: (e) => { s.fast = e.target.checked; save() } }), '对推理型模型可省 2-3 倍时间，不支持的接口会自动忽略')),
      h('p', { class: 'hint' }, '默认是免费的本地/免费额度接口。Key 只保存在这台设备的浏览器里，不会上传。'),
    )
  }

  function viewHelp() {
    const items = [
      ['生成本章', '按当前章的大纲 + 世界观 + 人物 + 人格 + 前情，重写当前章正文。会清空该章原有正文。'],
      ['生成下一章', '往后推一章：自动新建或找到空章，写完自动起章节名、存摘要、记入记忆，然后跳到该章。'],
      ['连续 3 章', '自动执行三次「生成下一章」，适合先把剧情骨架跑出来。'],
      ['续写', '接着本章已有正文往下写，不改动已有部分。'],
      ['润色选中', '在正文里选中一段，按当前人格润色，原位替换。'],
      ['生成摘要', '给本章存 120-160 字摘要，同时写入记忆库，供后续章节做「前情提要」。'],
      ['生成本章名', '根据本章大纲与正文开头起一个 4-10 字章节名。'],
      ['一键生成设定', '给一句想法，自动填书名、简介、世界观、人物、文风、禁忌。'],
      ['按阶段生成人物', '生成 10-14 人，分前期/中期/后期；后期人物可只在传闻里出现。'],
      ['作者人格', '预设 10 种笔法（辰东、天蚕土豆、猫腻、烽火、耳根、古龙、番茄系等），也可自定义，作为 system 消息传入。'],
      ['篇幅 / 节奏', '篇幅控制推进速度与能否收尾（长篇禁止十章完本），节奏控制每章推进点数量，随时可切换。'],
      ['记忆', '手记或自动累计的设定要点，最近 6 条写进每次提示词，避免写着写着忘设定。'],
      ['接口', '内置 15 家 OpenAI 兼容接口，免费接口默认可用；「去申请 / 查看 Key」一键跳转官方页面。'],
      ['数据', '全部存在本机浏览器 localStorage，不上传；换设备/清缓存会丢，重要稿件请自行备份。'],
    ]
    return h('div', { class: 'card help' },
      h('h3', null, '功能说明'),
      items.map(([title, text]) => h('div', null, h('h4', null, title), h('p', null, text))),
      h('h4', null, '手机使用'),
      h('p', null, '电脑运行 server.py 后，手机连同一 Wi-Fi，浏览器打开 http://电脑IP:8890 即可（地址在电脑启动时的窗口里）。'),
    )
  }

  function render() {
    renderNav()
    const view = $('view')
    view.innerHTML = ''
    const map = { write: viewWrite, setting: viewSetting, chars: viewChars, persona: viewPersona, api: viewApi, help: viewHelp }
    view.append((map[tab] || viewWrite)())
    if (tab === 'write') { const ta = $('editor'); if (ta) ta.scrollTop = ta.scrollHeight }
  }

  state = load()
  if (!state.projects.length) state = newState()
  window.addEventListener('beforeunload', save)
  render()
  ping()
})()
