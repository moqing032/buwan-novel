/* 涓嶆櫄AI灏忚鍔╂墜 鈥斺€?鍗曢〉搴旂敤锛堟棤渚濊禆锛?*/
(() => {
  'use strict'
  const $ = (id) => document.getElementById(id)
  const KEY = 'buwan.novel.v1'

  const PROVIDERS = [
    { id: 'lmstudio', name: 'LM Studio锛堟湰鍦帮級', base: 'http://127.0.0.1:1234/v1', model: '', free: true, note: '鐢佃剳涓婅窇锛屽畬鍏ㄥ厤璐广€佷笉鑱旂綉', jump: 'https://lmstudio.ai/' },
    { id: 'ollama', name: 'Ollama锛堟湰鍦帮級', base: 'http://127.0.0.1:11434/v1', model: 'qwen2.5:7b', free: true, note: '鐢佃剳涓婅窇锛屽厤璐?, jump: 'https://ollama.com/' },
    { id: 'siliconflow', name: '纭呭熀娴佸姩 SiliconFlow', base: 'https://api.siliconflow.cn/v1', model: 'Qwen/Qwen2.5-7B-Instruct', free: true, note: '娉ㄥ唽閫侀搴︼紝閮ㄥ垎妯″瀷鍏嶈垂', jump: 'https://cloud.siliconflow.cn/account/ak' },
    { id: 'openrouter', name: 'OpenRouter', base: 'https://openrouter.ai/api/v1', model: 'deepseek/deepseek-chat-v3-0324:free', free: true, note: '鏈夊甫 :free 鍚庣紑鐨勫厤璐规ā鍨?, jump: 'https://openrouter.ai/keys' },
    { id: 'groq', name: 'Groq', base: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile', free: true, note: '鏈夊厤璐归搴︼紝閫熷害鏋佸揩', jump: 'https://console.groq.com/keys' },
    { id: 'deepseek', name: 'DeepSeek 瀹樻柟', base: 'https://api.deepseek.com/v1', model: 'deepseek-chat', note: '渚垮疁锛屼腑鏂囧啓浣滃己', jump: 'https://platform.deepseek.com/api_keys' },
    { id: 'zhipu', name: '鏅鸿氨 GLM', base: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4-flash', note: 'glm-4-flash 鏈夊厤璐规。', jump: 'https://open.bigmodel.cn/usercenter/apikeys' },
    { id: 'dashscope', name: '闃块噷閫氫箟鍗冮棶', base: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus', note: '鏂扮敤鎴锋湁鍏嶈垂棰濆害', jump: 'https://dashscope.console.aliyun.com/apiKey' },
    { id: 'moonshot', name: 'Moonshot Kimi', base: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k', note: '闀夸笂涓嬫枃瑙侀暱', jump: 'https://platform.moonshot.cn/console/api-keys' },
    { id: 'ark', name: '鐏北鏂硅垷 璞嗗寘', base: 'https://ark.cn-beijing.volces.com/api/v3', model: '', note: '闇€鍏堝垱寤烘帹鐞嗘帴鍏ョ偣', jump: 'https://console.volcengine.com/ark' },
    { id: 'hunyuan', name: '鑵捐娣峰厓', base: 'https://api.hunyuan.cloud.tencent.com/v1', model: 'hunyuan-lite', note: 'hunyuan-lite 鍏嶈垂', jump: 'https://console.cloud.tencent.com/hunyuan' },
    { id: 'qianfan', name: '鐧惧害鏂囧績鍗冨竼', base: 'https://qianfan.baidubce.com/v2', model: 'ernie-3.5-8k', note: '鏂扮敤鎴锋湁鍏嶈垂棰濆害', jump: 'https://console.bce.baidu.com/qianfan' },
    { id: 'spark', name: '璁鏄熺伀', base: 'https://spark-api-open.xf-yun.com/v1', model: 'generalv3.5', note: '鏈夊厤璐瑰寘', jump: 'https://console.xfyun.cn/' },
    { id: 'openai', name: 'OpenAI', base: 'https://api.openai.com/v1', model: 'gpt-4o-mini', note: '闇€鑷 Key', jump: 'https://platform.openai.com/api-keys' },
    { id: 'gemini', name: 'Google Gemini', base: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'gemini-1.5-flash', note: '鏈夊厤璐规。锛圤penAI 鍏煎鎺ュ彛锛?, jump: 'https://aistudio.google.com/apikey' },
  ]

  const PERSONAS = [
    { id: 'cd', name: '杈颁笢锛堟椽鑽掕媿鑼級', text: '鐭彞涓庢帓姣斾氦閿欙紝鎰忚薄娴撶儓锛堣銆侀銆佺銆佸潫銆佸彜璺級锛屾偓蹇靛墠缃紝绔犳湯鐣欎竴鍙ュ帇鍦虹殑璇濄€? },
    { id: 'tcd', name: '澶╄殨鍦熻眴锛堢儹琛€鍗囩骇锛?, text: '鐩爣娓呮櫚銆佹墦鑴哥埥蹇紝鎴樺姏灞傛鍏蜂綋锛屽啿绐佸瘑闆嗭紝姣忕珷閮芥湁杩涘睍銆? },
    { id: 'mq', name: '鐚吇锛堟枃闈掑簳钑达級', text: '瀵硅瘽鏈夎厰璋冿紝鎱㈢儹锛屽彞瀛愯绌讹紝甯稿啓浜烘儏涓庨€夋嫨銆? },
    { id: 'fh', name: '鐑界伀锛堟睙婀栭噾鍙ワ級', text: '闀垮彞閾烘帓姘斿娍锛岄噾鍙ラ鍑猴紝鎯呯华娴撶儓锛屽満闈㈡劅寮恒€? },
    { id: 'ergen', name: '鑰虫牴锛堜粰渚犲鍛斤級', text: '杞洖涓庢墽蹇碉紝鍙欒堪鍋忔姃鎯咃紝娈佃惤闂寸暀鐧姐€? },
    { id: 'gulong', name: '鍙ら緳浣?, text: '鐭彞鏂锛屾皵姘涢槾鍐凤紝瀵硅瘽鏈洪攱锛岀暀鐧藉浜庤В閲娿€? },
    { id: 'fq_city', name: '鐣寗路閮藉競鑴戞礊', text: '寮€绡囨姏璁惧畾锛屼富瑙掔珛鍒诲緱濂藉锛岃妭濂忔瀬蹇紝姣忕珷涓€涓弽杞紝鍙ｈ鍖栥€? },
    { id: 'fq_zs', name: '鐣寗路鎴樼璧樺┛', text: '鍏堟姂鍚庢壃锛岃韩浠芥彮鏅撳叏鍦洪渿鎯婏紝鎯呯华鐩寸粰锛屽璇濈煭淇冦€? },
    { id: 'fq_nc', name: '鐣寗路骞翠唬鏂?, text: '鐗╄祫缁嗚妭鎵庡疄锛屽闀块噷鐭紝涓昏闈犲厛鐭ヤ笌鍕ゅ姵缈昏韩銆? },
    { id: 'xuanyi', name: '鎮枒鍐风‖', text: '淇℃伅鍏嬪埗鐨勭涓変汉绉帮紝鐜鏆楃ず鍗遍櫓锛岀珷鏈彮绀哄皬鐪熺浉銆? },
    { id: 'wcx', name: '鎴戝悆瑗跨孩鏌匡紙绠€娲佸崌绾э級', text: '灏戝舰瀹硅瘝锛屽鍔ㄤ綔涓庣粨鏋滐紝鐩爣鍗曚竴涓嶆柇鍙樺己锛岃妭濂忔槑蹇€? },
    { id: 'wangyu', name: '蹇樿锛堝嚒浜虹畻璁★級', text: '涓昏璋ㄦ厧銆佹姝ヤ负钀ワ紝璧勬簮涓庝唬浠峰啓寰楁竻妤氾紝涓嶈交鏄撹秺绾с€? },
    { id: 'wuz', name: '涔岃醇锛堢悊鎬ф帹婕旓級', text: '璁惧畾涓ュ瘑锛屾帹鐞嗛摼鏉℃竻妤氾紝姘涘洿闃村喎锛岄潬淇℃伅宸埗閫犲紶鍔涖€? },
    { id: 'zhouzi', name: '浼氳璇濈殑鑲樺瓙锛堢儹琛€灏戝勾锛?, text: '灏戝勾姘旇冻锛屽彛璇寲瀵圭櫧澶氾紝鎯呯华鐩寸粰锛屾墦鏂楀啓鎰忋€? },
    { id: 'tangjia', name: '鍞愬涓夊皯锛堣瀹氭祦锛?, text: '涓栫晫瑙傝瀹氭竻鏅帮紝绛夌骇浣撶郴鏄庣‘锛岃妭濂忕ǔ瀹氾紝鎰熸儏绾跨洿鐧姐€? },
    { id: 'laoying', name: '鑰侀拱鍚冨皬楦★紙鏋侀€熺埥鏂囷級', text: '鑺傚鏋佸揩锛屼笁绔犱竴涓ぇ浜嬩欢锛岀埥鐐瑰瘑闆嗭紝鍑犱箮涓嶅啓鏃ュ父銆? },
    { id: 'dazhi', name: '鎵撶溂锛堥兘甯傞壌瀹濓級', text: '缁嗚妭鑰冪┒锛岃璇濅笌鍣ㄧ墿鎻忓啓涓撲笟锛屼富瑙掍綆璋冩湁搴曠墝銆? },
    { id: 'fq_tc', name: '鐣寗路鐢滃疇鎬昏', text: '绯栧垎楂橈紝璇細蹇€熻В寮€锛屽璇濆甫閽╁瓙锛屾瘡绔犱竴涓績鍔ㄧ灛闂淬€? },
    { id: 'fq_wx', name: '鐣寗路鏃犻檺娴?, text: '瑙勫垯鎬皥寮€灞€锛屽壇鏈鍒欓€愭潯鎻ず锛岀揣寮犳劅闈犱俊鎭樊銆? },
    { id: 'fq_ms', name: '鐣寗路鏈笘鍥よ揣', text: '鐗╄祫娓呭崟鍏蜂綋锛屽嵄鏈轰竴娉㈡帴涓€娉紝涓昏璋ㄦ厧鐣欏簳鐗屻€? },
    { id: 'fq_zt', name: '鐣寗路绉嶇敯鏃ュ父', text: '鑺傚鑸掔紦锛屽悆椋熶笌鍔充綔鍐欏緱棣欙紝灏忎簨瑙佹俯鎯呫€? },
    { id: 'fq_yl', name: '鐣寗路濞变箰鍦?, text: '鐑悳銆佸墽鏈€侀粦绾㈢炕韬紝缃戝弸璇勮浣撶┛鎻掞紝鎵撹劯涓庡嚭鍦堝苟閲嶃€? },
    { id: 'n棰?, name: '濂抽路鍙よ█瀹呮枟', text: '鍐呭畢蹇冩満灞傚眰閫掕繘锛屽璇濆惈閿嬶紝濂充富鍐烽潤鏈夋墜娈点€? },
  ]

  const SCALES = [['short', '鐭瘒 10-60 绔?], ['mid', '涓瘒 100-500 绔?], ['long', '闀跨瘒 1000-3000 绔?]]
  const PACES = [['fast', '蹇妭濂?], ['steady', '甯歌'], ['slow', '鎱㈣妭濂?]]

  const uid = () => Math.random().toString(36).slice(2, 10)
  const words = (t) => (t || '').replace(/\s/g, '').length
  const clip = (t, n) => { const s = (t || '').trim(); return s.length <= n ? s : s.slice(0, n) }
  const tail = (t, n) => { const s = (t || '').trim(); return s.length <= n ? s : s.slice(-n) }

  const SYSTEM = '浣犳槸涓€浣嶇绾︿簬涓枃缃戠粶鏂囧骞冲彴鐨勮祫娣卞皬璇翠綔鑰呫€傚彧杈撳嚭灏忚姝ｆ枃锛屼笉杈撳嚭瑙ｉ噴銆佹爣棰樻垨澶х翰锛涚敤鍔ㄤ綔銆佸璇濅笌缁嗚妭鎺ㄨ繘锛涗弗鏍煎畧鐢ㄦ埛缁欑殑璁惧畾銆佷汉鏍间笌绂佸繉銆?

  let state = null
  let tab = 'write'
  let busy = false
  let abort = null

  function newChapter(title) { return { id: uid(), title: title || '', outline: '', content: '', summary: '', words: 0 } }
  function newProject(title) {
    return {
      id: uid(), title: title || '鏈懡鍚嶄綔鍝?, author: '涓嶆櫄', genre: '涓滄柟鐜勫够', logline: '', world: '', cast: '', style: '', taboos: '',
      scale: 'long', pace: 'steady', persona: { preset: 'cd', custom: '' }, memory: [], characters: [],
      chapters: [newChapter('绗竴绔?)],
    }
  }
  function newState() {
    const p = newProject('闀垮鐑槑')
    p.logline = '琚€愬嚭瀹楅棬鐨勫皯骞达紝闈犱竴鏌勪細璇磋瘽鐨勬柇鍒€锛屽湪闀垮閲岀儳鍑轰竴鏉¤瘉閬撲箣璺€?
    p.world = '涔濆窞浠ャ€岀伅銆嶄负淇鏈簮锛氫汉鏈夌伅鍒欑榄備笉鐏紝鐏伃鍒欏爼鍏ラ暱澶溿€傚畻闂ㄥ瀯鏂伅娌癸紝瀵掗棬鍙兘鍊熸湀鍏変慨琛屻€?
    p.characters = [
      { id: uid(), name: '娌堢儸', role: '涓昏', stage: 'early', desc: '鍢寸‖蹇冭蒋锛岀洰鏍囨煡娓呭笀鐖朵箣姝?, note: '' },
      { id: uid(), name: '鑰佸垁', role: '鏂垁娈嬮瓊', stage: 'late', desc: '鍢存瘨鎶ょ煭锛屽墠鏈熷彧琚彁鍙?, note: '绗?300 绔犳墠寮€鍙? },
    ]
    p.memory = [{ id: uid(), text: '銆岀儳鐏€嶄細鐏兼帀涓€娈佃蹇嗭紝鐢ㄤ竴娆″皯涓€娈点€? }]
    p.chapters = [Object.assign(newChapter('绗竴绔?鏂垁'), { outline: '娌堢儸琚€愬嚭瀹楅棬锛岄洦澶滀笅灞憋紝灞辩搴欓伩闆ㄦ椂鏂垁绗竴娆″紑鍙ｏ紝绔犳湯杩界伅浜捣銆? })]
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

  /* ---------- 鎻愮ず璇?---------- */
  function personaText(p) {
    const preset = PERSONAS.find((x) => x.id === p.persona.preset)
    return [preset ? preset.text : '', p.persona.custom || ''].filter(Boolean).join('\n')
  }
  function systemFor(p) {
    const persona = personaText(p)
    if (!persona) return SYSTEM
    return SYSTEM + '\n\n銆愭湰娆″啓浣滅殑浜烘牸銆慭n' + persona + '\n鎵ц瑕佹眰锛氬彞寮忋€佽妭濂忋€佺敤璇嶃€佸璇濊厰璋冮兘瑕佽创鍚堣繖涓汉鏍硷紝涓嶈鍐欐垚閫氱敤缃戞枃鑵斻€?
  }
  function brief(p) {
    const rows = []
    if (p.title) rows.push('涔﹀悕锛? + p.title)
    if (p.genre) rows.push('棰樻潗锛? + p.genre)
    rows.push('绡囧箙锛? + (SCALES.find((s) => s[0] === p.scale) || SCALES[2])[1] + '锛涜妭濂忥細' + (PACES.find((s) => s[0] === p.pace) || PACES[1])[1])
    if (p.logline) rows.push('绠€浠嬶細' + p.logline)
    if (p.world) rows.push('涓栫晫瑙傦細' + clip(p.world, 700))
    if (p.characters.length) {
      const group = ['early', 'mid', 'late'].map((stage) => {
        const list = p.characters.filter((c) => c.stage === stage)
        if (!list.length) return ''
        const name = stage === 'early' ? '鍓嶆湡' : stage === 'mid' ? '涓湡' : '鍚庢湡'
        return name + '锛? + list.slice(0, 6).map((c) => c.name + (c.role ? '锛? + c.role + '锛? : '')).join('銆?)
      }).filter(Boolean)
      if (group.length) rows.push('浜虹墿锛歕n' + group.join('\n'))
    } else if (p.cast) rows.push('浜虹墿锛? + clip(p.cast, 400))
    if (p.style) rows.push('鏂囬锛? + clip(p.style, 300))
    if (p.taboos) rows.push('绂佸繉锛? + clip(p.taboos, 200))
    if (p.memory.length) rows.push('闀挎湡璁板繂锛歕n' + p.memory.slice(-6).map((m) => '路 ' + m.text).join('\n'))
    return rows.join('\n')
  }
  function chapterWords(c) { const s = state.settings; return Number(c.words) > 0 ? Number(c.words) : Number(s.words) }
  function contextOf(p, c) {
    const i = p.chapters.findIndex((x) => x.id === c.id)
    const before = p.chapters.slice(Math.max(0, i - 3), i)
    const rows = []
    const sums = before.filter((x) => x.summary).map((x) => x.title + '锛? + x.summary)
    if (sums.length) rows.push('銆愬墠鎯呮彁瑕併€慭n' + sums.join('\n'))
    const last = before[before.length - 1]
    if (last && last.content) rows.push('銆愪笂涓€绔犵粨灏俱€慭n鈥? + tail(last.content, 700))
    return rows.join('\n\n')
  }
  function chapterPrompt(p, c) {
    return '銆愪綔鍝佽瀹氥€慭n' + brief(p) + '\n\n' + [contextOf(p, c)].filter(Boolean).join('\n\n') +
      (c.outline ? '\n\n銆愭湰绔犲ぇ绾层€慭n' + c.outline : '') +
      '\n\n銆愬啓浣滀换鍔°€慭n鍐欏嚭杩欎竴绔犵殑瀹屾暣姝ｆ枃锛岀害 ' + chapterWords(c) + ' 瀛椼€傜洿鎺ヤ粠鍦烘櫙寮€濮嬶紝澶氱敤鍔ㄤ綔涓庡璇濓紝绔犳湯鐣欓挬瀛愶紝鍙緭鍑烘鏂囥€?
  }
  function titlePrompt(p, c) {
    return '銆愪綔鍝佽瀹氥€慭n' + brief(p) + '\n\n銆愭湰绔犮€慭n澶х翰锛? + (clip(c.outline, 160) || '鏃?) + '\n姝ｆ枃寮€澶达細' + (clip(c.content, 260) || '鏃?) +
      '\n\n銆愪换鍔°€戜负杩欎竴绔犺捣涓€涓?4-10 瀛楃殑绔犺妭鍚嶏紝鏈夋偓蹇碉紝涓嶈銆岀N绔犮€嶅墠缂€锛屼笉瑕佷功鍚嶅彿锛屽彧杈撳嚭涓€涓悕瀛椼€?
  }
  function summaryPrompt(c) { return '銆愭湰绔犳鏂囥€慭n' + tail(c.content, 5000) + '\n\n銆愪换鍔°€戠敤 120-160 瀛楁鎷湰绔狅細鍙戠敓浜嗕粈涔堛€佸叧閿浆鎶樸€佷汉鐗╃姸鎬併€佺粨灏炬偓蹇点€傚彧杈撳嚭鎽樿銆? }
  function setupPrompt(p, idea) {
    return '銆愪竴鍙ヨ瘽鎯虫硶銆慭n' + idea + '\n\n銆愪换鍔°€戜负杩欓儴浣滃搧璁捐璁惧畾锛屼弗鏍兼寜鏍煎紡杈撳嚭锛屼笉瑕佽В閲婏細\n銆愪功鍚嶃€戔€n銆愪竴鍙ヨ瘽绠€浠嬨€戔€︼紙40 瀛楀唴锛塡n銆愪笘鐣岃銆戔€︼紙200-300 瀛楋級\n銆愪富瑕佷汉鐗┿€戔€︼紙3-5 浜猴紝姣忚锛氬鍚嶏綔韬唤锝滄€ф牸锝滅洰鏍囷綔缂洪櫡锛塡n銆愭枃椋庛€戔€n銆愮蹇屻€戔€?
  }
  function parseSetup(text, p) {
    const grab = (n) => { const m = new RegExp('銆? + n + '銆慭\s*([\\s\\S]*?)(?=\\n銆恷$)').exec(text); return m ? m[1].trim() : '' }
    if (grab('涔﹀悕')) p.title = grab('涔﹀悕').replace(/[銆娿€媇/g, '')
    if (grab('涓€鍙ヨ瘽绠€浠?)) p.logline = grab('涓€鍙ヨ瘽绠€浠?)
    if (grab('涓栫晫瑙?)) p.world = grab('涓栫晫瑙?)
    if (grab('鏂囬')) p.style = grab('鏂囬')
    if (grab('绂佸繉')) p.taboos = grab('绂佸繉')
    const cast = grab('涓昏浜虹墿')
    if (cast) {
      const list = []
      cast.split('\n').forEach((line) => {
        const parts = line.split(/[锝渱]/).map((s) => s.trim()).filter(Boolean)
        if (parts.length >= 2) list.push({ id: uid(), name: parts[0], role: parts[1] || '', desc: parts.slice(2).join('锝?), stage: 'early', note: '' })
      })
      if (list.length) p.characters = list
    }
  }

  /* ---------- 鎺ュ彛 ---------- */
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
      $('statusText').textContent = (list.length ? list.length + ' 涓ā鍨?路 ' : '') + provider().name
      return list
    } catch (e) {
      $('dot').className = 'dot off'
      $('statusText').textContent = '鏈繛鎺ワ細' + (e.message || e)
      return []
    }
  }

  /* ---------- 娓叉煋宸ュ叿 ---------- */
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

  /* ---------- 鍔ㄤ綔 ---------- */
  function askText(title, placeholder, onOk) {
    const mask = h('div', {
      style: 'position:fixed;inset:0;background:rgba(0,0,0,.62);display:flex;align-items:center;justify-content:center;z-index:99;padding:20px',
    },
    h('div', { style: 'background:#1a1714;border:1px solid #302a24;border-radius:14px;padding:16px;width:min(360px,88vw)' },
      h('h4', { style: 'margin:0 0 10px;font-size:14px;color:#d9a441' }, title),
      h('input', { id: 'askInput', placeholder: placeholder || '', value: '' }),
      h('div', { style: 'display:flex;gap:8px;justify-content:flex-end;margin-top:12px' },
        h('button', { class: 'btn', onclick: () => mask.remove() }, '鍙栨秷'),
        h('button', {
          class: 'btn primary',
          onclick: () => {
            const v = $('askInput').value.trim()
            mask.remove()
            if (v) onOk(v)
          },
        }, '纭畾'))))
    document.body.append(mask)
    setTimeout(() => { const i = $('askInput'); if (i) i.focus() }, 60)
  }

  function createProject() {
    askText('鏂板缓灏忚', '涔﹀悕锛屼緥濡傦細闀垮鐑槑', (name) => {
      const np = newProject(name)
      state.projects.push(np)
      state.pid = np.id
      state.cid = np.chapters[0].id
      save(); tab = 'setting'; render(); toast('宸插垱寤恒€? + name + '銆?)
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
      save(); render(); toast('鏈珷宸茬敓鎴?' + words(c.content) + ' 瀛?)
    } catch (e) { toast('鐢熸垚澶辫触锛? + (e.message || e)) } finally { busy = false }
  }
  async function generateNext() {
    if (busy) return
    const p = project()
    const idx = p.chapters.findIndex((c) => c.id === state.cid)
    let target = p.chapters.slice(idx + 1).find((c) => !c.content.trim())
    if (!target) { target = newChapter('绗? + (p.chapters.length + 1) + '绔?); p.chapters.push(target) }
    state.cid = target.id
    busy = true
    render()
    try {
      await stream([{ role: 'system', content: systemFor(p) }, { role: 'user', content: chapterPrompt(p, target) }], (d) => {
        target.content += d
        const ta = $('editor')
        if (ta) { ta.value = target.content; ta.scrollTop = ta.scrollHeight }
      })
      const name = (await ask(titlePrompt(p, target))).split('\n').map((s) => s.replace(/^\s*\d+\s*[.銆?锛?锛塢\s*/, '').replace(/[銆娿€嬨€愩€?']/g, '').trim()).filter(Boolean)[0]
      if (name) target.title = '绗? + (p.chapters.indexOf(target) + 1) + '绔?' + clip(name, 14)
      const sum = (await ask(summaryPrompt(target))).trim()
      target.summary = clip(sum, 160)
      if (target.summary) p.memory.push({ id: uid(), text: clip(sum, 80) })
      if (p.memory.length > 40) p.memory = p.memory.slice(-40)
      save(); render(); toast('涓嬩竴绔犲凡鐢熸垚锛? + target.title)
    } catch (e) { toast('澶辫触锛? + (e.message || e)) } finally { busy = false }
  }
  async function polish() {
    const ta = $('editor')
    if (!ta || ta.selectionStart === ta.selectionEnd) return toast('璇峰厛鍦ㄦ鏂囬噷閫変腑涓€娈?)
    const c = chapter()
    const text = c.content.slice(ta.selectionStart, ta.selectionEnd)
    busy = true
    try {
      const out = await ask('銆愬師鏂囥€慭n' + text + '\n\n銆愪换鍔°€戞鼎鑹诧細淇濈暀鎯呰妭涓庝俊鎭紝浼樺寲鍔ㄨ瘝涓庤妭濂忥紝鍒犵┖璇濄€傚彧杈撳嚭娑﹁壊鍚庣殑鏂囧瓧銆?)
      if (out.trim()) { c.content = c.content.slice(0, ta.selectionStart) + out + c.content.slice(ta.selectionEnd); save(); render() }
      toast('宸叉鼎鑹?)
    } catch (e) { toast('澶辫触锛? + (e.message || e)) } finally { busy = false }
  }
  async function summarize() {
    const c = chapter()
    if (!c.content.trim()) return toast('鏈珷杩樻病鏈夋鏂?)
    busy = true
    try {
      c.summary = clip((await ask(summaryPrompt(c))).trim(), 160)
      if (c.summary) project().memory.push({ id: uid(), text: clip(c.summary, 80) })
      save(); render(); toast('鎽樿宸蹭繚瀛?)
    } catch (e) { toast('澶辫触锛? + (e.message || e)) } finally { busy = false }
  }
  async function nameChapter() {
    const c = chapter()
    if (!c.content && !c.outline) return toast('鍏堝啓澶х翰鎴栨鏂?)
    busy = true
    try {
      const name = (await ask(titlePrompt(project(), c))).split('\n')[0].replace(/[銆娿€嬨€愩€?']/g, '').trim()
      if (name) { c.title = '绗? + (project().chapters.indexOf(c) + 1) + '绔?' + clip(name, 14); save(); render() }
      toast('宸插懡鍚嶏細' + c.title)
    } catch (e) { toast('澶辫触锛? + (e.message || e)) } finally { busy = false }
  }
  async function oneClickSetup() {
    askText('涓€鍙ヨ瘽鎯虫硶', '渚嬶細鏈笘鍗佸勾鍚庝富瑙掗噸鐢熷洖鐏鹃毦鍓嶄竴澶?, async (idea) => {
      busy = true; toast('鐢熸垚璁惧畾涓€?)
      try {
        parseSetup(await ask(setupPrompt(project(), idea)), project())
        save(); render(); toast('璁惧畾宸茬敓鎴?)
      } catch (e) { toast('澶辫触锛? + (e.message || e)) } finally { busy = false }
    })
  }
  const FIELD_TASKS = {
    title: '涓鸿繖鏈功璧?5 涓功鍚嶏紝姣忎釜 2-8 瀛楋紝姣忚涓€涓紝涓嶈涔﹀悕鍙凤紝涓嶈瑙ｉ噴銆?,
    logline: '鍐欎竴鍙?40 瀛椾互鍐呯殑涓€鍙ヨ瘽绠€浠嬶細鍚富瑙掋€佸澧冨拰涓€涓挬瀛愩€傚彧杈撳嚭杩欎竴鍙ャ€?,
    world: '鍐?200-300 瀛椾笘鐣岃锛氬姏閲忎綋绯荤殑瑙勫垯銆侀檺鍒朵笌浠ｄ环銆傚彧杈撳嚭姝ｆ枃銆?,
    style: '鍐欎竴鍙ユ枃椋庡缓璁細鍙ュ紡銆佽妭濂忋€佸彊浜嬭瑙掋€傚彧杈撳嚭杩欎竴鍙ャ€?,
    cast: '鍐?3-5 涓富瑕佷汉鐗╋紝姣忚锛氬鍚嶏綔韬唤锝滄€ф牸锝滅洰鏍囷綔缂洪櫡銆傚彧杈撳嚭杩欎簺琛屻€?,
  }
  async function generateField(kind) {
    const p = project()
    busy = true; toast('鐢熸垚涓€?)
    try {
      const out = (await ask('銆愪綔鍝佽瀹氥€慭n' + brief(p) + '\n\n銆愪换鍔°€慭n' + FIELD_TASKS[kind], SYSTEM)).trim()
      if (kind === 'title') {
        const first = out.split('\n').map((s) => s.replace(/[銆娿€嬨€愩€?-9.銆?锛歖/g, '').trim()).filter(Boolean)[0]
        if (first) p.title = clip(first, 12)
      } else if (kind === 'logline') p.logline = out.split('\n')[0]
      else if (kind === 'world') p.world = out
      else if (kind === 'style') p.style = out.split('\n')[0]
      else if (kind === 'cast') p.cast = out
      save(); render(); toast('宸茬敓鎴?)
    } catch (e) { toast('澶辫触锛? + (e.message || e)) } finally { busy = false }
  }

  async function genCharacters() {    const p = project()
    busy = true; toast('鐢熸垚浜虹墿涓€?)
    try {
      const text = await ask('銆愪綔鍝佽瀹氥€慭n' + brief(p) + '\n\n銆愪换鍔°€戣璁?10-14 浜虹殑浜虹墿琛紝瑕嗙洊鍓嶆湡/涓湡/鍚庢湡锛堝悗鏈熷彲鍙湪浼犻椈閲屽嚭鐜帮級銆傛瘡琛岋細鍓嶆湡锝滃鍚嶏綔韬唤锝滄€ф牸涓庣洰鏍囷綔鍑哄満璇存槑銆傚彧杈撳嚭杩欎簺琛屻€?)
      const list = []
      text.split('\n').forEach((line) => {
        const parts = line.split(/[锝渱]/).map((s) => s.trim())
        if (parts.length < 3) return
        const stage = parts[0].includes('鍓嶆湡') ? 'early' : parts[0].includes('涓湡') ? 'mid' : parts[0].includes('鍚庢湡') ? 'late' : ''
        if (!stage || !parts[1]) return
        list.push({ id: uid(), name: parts[1], role: parts[2] || '', desc: parts[3] || '', stage, note: parts[4] || '' })
      })
      if (!list.length) return toast('娌¤В鏋愬埌浜虹墿')
      p.characters = p.characters.concat(list.filter((x) => !p.characters.some((y) => y.name === x.name)))
      save(); render(); toast('宸茬敓鎴?' + list.length + ' 浜?)
    } catch (e) { toast('澶辫触锛? + (e.message || e)) } finally { busy = false }
  }

  /* ---------- 瑙嗗浘 ---------- */
  const TABS = [['write', '鍐欎綔'], ['setting', '璁惧畾'], ['chars', '浜虹墿'], ['persona', '浜烘牸'], ['api', '鎺ュ彛'], ['help', '甯姪']]

  function renderNav() {
    const nav = $('nav')
    nav.innerHTML = ''
    TABS.forEach(([id, label]) => nav.append(h('button', { class: tab === id ? 'on' : '', onclick: () => { tab = id; render() } }, label)))
  }

  async function analyzeCopy() {
    const text = (state.copyText || '').trim()
    if (text.length < 80) return toast('鍏堢矘璐磋嚦灏?80 瀛楃殑鏂囩珷')
    busy = true; toast('鍒嗘瀽鏂囬涓€?)
    try {
      state.copyProfile = (await ask('銆愭枃绔犮€慭n' + text.slice(0, 4000) +
        '\n\n銆愪换鍔°€戠敤 5 琛屾鎷叾鏂囬锛氶鏉愪笌鍩鸿皟 / 浜虹О涓庤瑙?/ 鍙ュ紡涓庤妭濂?/ 鐢ㄨ瘝涓庝慨杈?/ 瀵硅瘽涓庡満鏅€傚彧杈撳嚭杩?5 琛岋紝涓嶈璇勪环銆?, SYSTEM)).trim()
      save(); render(); toast('鏂囬鐢诲儚宸茬敓鎴?)
    } catch (e) { toast('澶辫触锛? + (e.message || e)) } finally { busy = false }
  }

  function saveCopy() {
    const text = (state.copyText || '').trim()
    if (!text) return toast('鍏堢矘璐存枃绔?)
    state.samples = (state.samples || []).concat([{ id: uid(), title: '绱犳潗 ' + ((state.samples || []).length + 1), text, profile: state.copyProfile || '' }])
    save(); render(); toast('宸插瓨鍏ョ礌鏉?)
  }

  async function imitateCopy() {
    const p = project()
    const c = chapter()
    const profile = state.copyProfile || ''
    const text = (state.copyText || '').trim()
    if (!profile && !text) return toast('鍏堢矘璐存枃绔狅紝鎴栫偣銆屽垎鏋愭枃椋庛€?)
    busy = true
    c.content = ''
    const ta0 = $('editor')
    if (ta0) ta0.value = ''
    try {
      await stream([{ role: 'system', content: systemFor(p) }, {
        role: 'user', content:
          '銆愬弬鑰冩枃椋庛€慭n' + (profile || text.slice(0, 1500)) +
          '\n\n銆愪綔鍝佽瀹氥€慭n' + brief(p) +
          (c.outline ? '\n\n銆愭湰绔犲ぇ绾层€慭n' + c.outline : '') +
          '\n\n銆愪换鍔°€戠敤鍙傝€冩枃椋庣殑鍙ュ紡銆佽妭濂忎笌鐢ㄨ瘝鍐欐湰绔犳鏂囷紝绾?' + chapterWords(c) + ' 瀛椼€傛儏鑺傚繀椤诲師鍒涳紝绂佹鐓ф妱鍙傝€冩枃鏈殑鍙ュ瓙銆佷汉鍚嶃€佷笓鏈夊悕璇嶃€傚彧杈撳嚭姝ｆ枃銆?,
      }], (d) => {
        c.content += d
        const ta = $('editor')
        if (ta) { ta.value = c.content; ta.scrollTop = ta.scrollHeight }
      })
      save(); render(); toast('浠垮啓瀹屾垚 ' + words(c.content) + ' 瀛?)
    } catch (e) { toast('澶辫触锛? + (e.message || e)) } finally { busy = false }
  }

  function deleteProject() {
    if (state.projects.length <= 1) return toast('鑷冲皯淇濈暀涓€閮ㄥ皬璇?)
    if (!confirm('鍒犻櫎銆? + (project().title || '鏈懡鍚嶄綔鍝?) + '銆嬶紵鍒犱簡灏辨壘涓嶅洖鏉ヤ簡')) return
    state.projects = state.projects.filter((x) => x.id !== state.pid)
    state.pid = state.projects[0].id
    state.cid = project().chapters[0].id
    save(); render(); toast('宸插垹闄?)
  }

  function deleteChapter() {
    const p = project()
    if (p.chapters.length <= 1) return toast('鑷冲皯淇濈暀涓€绔?)
    if (!confirm('鍒犻櫎銆? + (chapter().title || '鏈珷') + '銆嶏紵')) return
    const id = state.cid
    p.chapters = p.chapters.filter((x) => x.id !== id)
    state.cid = p.chapters[0].id
    save(); render(); toast('宸插垹闄?)
  }

  function viewWrite() {
    const p = project()
    const c = chapter()
    return h('div', null,
      h('div', { class: 'row', style: 'margin-bottom:10px' },
        select(state.pid, state.projects.map((x) => [x.id, x.title || '鏈懡鍚嶄綔鍝?]), (e) => {
          state.pid = e.target.value
          const np = project()
          state.cid = np.chapters[0].id
          save(); render()
        }),
        btn('锛?鏂板皬璇?, createProject, 'mini'),
        btn('馃棏 鍒犲皬璇?, deleteProject, 'mini')),
      h('div', { class: 'chips' }, p.chapters.map((x, i) => h('button', {
        class: 'chip' + (x.id === c.id ? ' on' : ''), onclick: () => { state.cid = x.id; render() },
      }, x.title || '绗? + (i + 1) + '绔?))),
      h('div', { class: 'card' },
        h('div', { class: 'row', style: 'margin-bottom:8px' },
          h('b', { style: 'flex:1' }, c.title || '鏈懡鍚嶇珷鑺?),
          h('span', { class: 'hint', style: 'margin:0' }, words(c.content) + ' 瀛? + (c.summary ? ' 路 鏈夋憳瑕? : ''))),
        h('div', { class: 'row' }, btn('锛?鏂扮珷鑺?, () => { const n = newChapter('绗? + (p.chapters.length + 1) + '绔?); p.chapters.push(n); state.cid = n.id; save(); render() }, 'mini'),
          btn('馃棏 鍒犳湰绔?, deleteChapter, 'mini')),
        field('鏈珷澶х翰', area(c.outline, (e) => { c.outline = e.target.value; save() }, 2, '杩欎竴绔犺鍙戠敓浠€涔堬細鍦烘櫙銆佸啿绐併€佽浆鎶樸€侀挬瀛愨€?)),
        h('textarea', { class: 'editor', id: 'editor', placeholder: '鐐广€岀敓鎴愭湰绔犮€嶅紑濮嬶紝鎴栫洿鎺ユ墜鍐欌€?, oninput: (e) => { c.content = e.target.value; save() } }, c.content),
        field('鏈珷瀛楁暟锛堢暀绌鸿窡闅忛粯璁?' + state.settings.words + ' 瀛楋級', input(c.words || '', (e) => { c.words = Number(e.target.value) || 0; save() }, String(state.settings.words))),
        h('div', { class: 'bar' },
          btn('鐢熸垚鏈珷', generateCurrent, 'primary'),
          btn('鐢熸垚涓嬩竴绔?, generateNext),
          btn('缁啓', async () => {
            if (!c.content.trim()) return toast('鍏堟湁姝ｆ枃')
            busy = true
            try {
              await stream([{ role: 'system', content: systemFor(p) }, { role: 'user', content: '銆愬凡鍐欐鏂囩粨灏俱€慭n鈥? + tail(c.content, 3000) + '\n\n銆愪换鍔°€戣嚜鐒舵帴缁紝鍐嶅啓绾?' + chapterWords(c) + ' 瀛楋紝鍙緭鍑烘柊鍐呭銆? }], (d) => { c.content += d; const ta = $('editor'); if (ta) ta.value = c.content })
              save(); render()
            } catch (e) { toast('澶辫触锛? + (e.message || e)) } finally { busy = false }
          }),
          btn('娑﹁壊閫変腑', polish),
          btn('鐢熸垚鎽樿', summarize),
          btn('鐢熸垚鏈珷鍚?, nameChapter),
          btn('杩炵画 3 绔?, async () => { for (let i = 0; i < 3; i++) await generateNext() }),
          h('button', {
            class: 'btn', type: 'button',
            style: 'border-color:#6a2c2c;color:#ffb3ae;background:#2a1717',
            onclick: () => {
              if (abort) { try { abort.abort() } catch (e) {} toast('宸叉殏鍋滐紝宸茬敓鎴愮殑鍐呭浼氫繚鐣?) }
              else toast('褰撳墠娌℃湁姝ｅ湪鐢熸垚鐨勮姹?)
            },
          }, '鈻?鏆傚仠'),
        ),
        h('div', { class: 'hint' }, '鐢熸垚鏈珷=閲嶅啓褰撳墠绔狅紱鐢熸垚涓嬩竴绔?寰€鍚庢帹涓€绔犲苟鑷姩璧峰悕+鎽樿锛涜繛缁?3 绔?鑷姩鎺ㄤ笁姝ャ€?),
      ),
      h('div', { class: 'card' },
        h('h3', null, '浠垮啓锛堢矘璐翠竴绡囨枃绔狅紝瀛﹀畠鐨勭瑪娉曪級'),
        area(state.copyText || '', (e) => { state.copyText = e.target.value; save() }, 6, '鎶婃兂妯′豢鐨勬枃绔犵矘璐村埌杩欓噷锛堜袱涓夋灏卞锛夆€?),
        h('div', { class: 'row', style: 'margin-top:8px' },
          btn('鍒嗘瀽鏂囬', analyzeCopy, 'mini'),
          btn('浠垮啓鏈珷', imitateCopy, 'mini primary'),
          btn('瀛樺叆绱犳潗', saveCopy, 'mini')),
        h('div', { class: 'hint' }, state.copyProfile ? ('鏂囬鐢诲儚锛? + state.copyProfile.replace(/\n/g, ' / ')) : '鍒嗘瀽鍚庝細鎶婃枃椋庣敾鍍忓甫杩涗豢鍐欐彁绀鸿瘝锛涗笉鍒嗘瀽鍒欑洿鎺ョ敤鍘熸枃鐗囨銆?),
        (state.samples || []).length
          ? h('ul', { class: 'list' }, (state.samples || []).map((s) => h('li', null,
            h('span', null, s.title),
            h('button', { onclick: () => { state.copyText = s.text; state.copyProfile = s.profile || ''; save(); render() } }, '杞藉叆'),
            h('button', { onclick: () => { state.samples = state.samples.filter((x) => x.id !== s.id); save(); render() } }, '鉁?))))
          : null,
      ),
      h('div', { class: 'card' },
        h('h3', null, '璁板繂锛堝啓杩涙瘡娆＄敓鎴愮殑鎻愮ず璇嶏級'),
        h('ul', { class: 'list' }, p.memory.map((m) => h('li', null, h('span', null, m.text), h('button', { onclick: () => { p.memory = p.memory.filter((x) => x.id !== m.id); save(); render() } }, '鉁?)))),
        h('div', { class: 'row', style: 'margin-top:8px' }, input('', (e) => { if (e.key === 'Enter' && e.target.value.trim()) { p.memory.push({ id: uid(), text: e.target.value.trim() }); save(); render() } }, '璁颁竴鏉¤瀹氾紝鍥炶溅淇濆瓨')),
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
    const title = p.title || '鏈懡鍚嶄綔鍝?
    const lines = []
    for (let i = 0; i < title.length && lines.length < 4; i += 5) lines.push(title.slice(i, i + 5))
    const startY = 300 - (lines.length - 1) * 36
    const body = lines.map((line, i) => '<text x="300" y="' + (startY + i * 72) + '" text-anchor="middle" font-size="58" font-family="Songti SC,SimSun,serif" font-weight="700" fill="' + t.ink + '" letter-spacing="4">' + esc(line) + '</text>').join('')
    return '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="840" viewBox="0 0 600 840">' +
      '<rect width="600" height="840" fill="' + t.bg + '"/>' +
      '<rect x="28" y="28" width="544" height="784" fill="none" stroke="' + t.frame + '" stroke-width="2" opacity=".55"/>' +
      '<rect x="44" y="44" width="512" height="752" fill="none" stroke="' + t.frame + '" stroke-width="1" opacity=".3"/>' +
      '<rect x="236" y="150" width="128" height="34" rx="6" fill="none" stroke="' + t.frame + '" stroke-width="2"/>' +
      '<text x="300" y="174" text-anchor="middle" font-size="17" fill="' + t.frame + '" letter-spacing="6">' + esc((p.genre || '灏忚').slice(0, 6)) + '</text>' +
      body +
      (c.subtitle ? '<text x="300" y="625" text-anchor="middle" font-size="21" fill="' + t.sub + '" letter-spacing="3">' + esc(c.subtitle.slice(0, 18)) + '</text>' : '') +
      (c.author ? '<text x="300" y="700" text-anchor="middle" font-size="22" fill="' + t.sub + '" letter-spacing="2">' + esc(c.author.slice(0, 12)) + ' 钁?/text>' : '') +
      '<text x="300" y="790" text-anchor="middle" font-size="14" fill="' + t.sub + '" opacity=".55" letter-spacing="4">涓?鏅?/text>' +
      '</svg>'
  }

  function viewSetting() {
    const p = project()
    const set = (key) => (e) => { p[key] = e.target.value; save() }
    return h('div', null,
      h('div', { class: 'card' },
        h('h3', null, '绡囧箙涓庤妭濂?),
        h('div', { class: 'row' },
          select(p.scale, SCALES, (e) => { p.scale = e.target.value; save() }),
          select(p.pace, PACES, (e) => { p.pace = e.target.value; save() })),
        h('p', { class: 'hint' }, '绡囧箙鍐冲畾鎺ㄨ繘閫熷害涓庤兘涓嶈兘鏀跺熬锛堥暱绡囩姝㈠崄绔犲畬鏈級锛岃妭濂忓喅瀹氭瘡绔犲嚑涓帹杩涚偣銆備袱鑰呴兘浼氬啓杩涙彁绀鸿瘝锛岄殢鏃跺彲鏀广€?)),
      h('div', { class: 'card' },
        h('h3', null, '浣滃搧璁惧畾'),
        h('div', { class: 'row', style: 'margin-bottom:10px' }, btn('鈿?涓€閿敓鎴愯瀹?, oneClickSetup, 'primary')),
        h('div', { class: 'row', style: 'margin-bottom:10px' },
          btn('涔﹀悕', () => generateField('title'), 'mini'),
          btn('绠€浠?, () => generateField('logline'), 'mini'),
          btn('涓栫晫瑙?, () => generateField('world'), 'mini'),
          btn('鏂囬', () => generateField('style'), 'mini'),
          btn('浜虹墿', () => generateField('cast'), 'mini')),
        field('涔﹀悕', input(p.title, set('title'))),
        field('棰樻潗', input(p.genre, set('genre'))),
        field('涓€鍙ヨ瘽绠€浠?, area(p.logline, set('logline'), 2)),
        field('涓栫晫瑙?, area(p.world, set('world'), 4)),
        field('浜虹墿琛ュ厖', area(p.cast, set('cast'), 2, '浜虹墿琛ㄩ噷娌″啓鍒扮殑瑙掕壊')),
        field('鏂囬', area(p.style, set('style'), 2)),
        field('绂佸繉', area(p.taboos, set('taboos'), 2)),
        h('div', { class: 'card' },
          h('h3', null, '灏侀潰'),
          h('div', { class: 'row', style: 'margin-bottom:8px' },
            select((p.cover && p.cover.template) || 'ink', [['ink', '澧ㄩ噾'], ['paper', '瀹ｇ焊'], ['neon', '闇撹櫣'], ['night', '澶滆壊']], (e) => {
              p.cover = Object.assign({}, p.cover, { template: e.target.value })
              save()
              const img = $('coverImg')
              if (img) img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(coverSvg(p))
            })),
          field('鍓爣棰?, input((p.cover && p.cover.subtitle) || '', (e) => {
            p.cover = Object.assign({}, p.cover, { subtitle: e.target.value })
            save()
            const img = $('coverImg')
            if (img) img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(coverSvg(p))
          })),
          field('浣滆€?, input((p.cover && p.cover.author) || '', (e) => {
            p.cover = Object.assign({}, p.cover, { author: e.target.value })
            save()
            const img = $('coverImg')
            if (img) img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(coverSvg(p))
          })),
          h('div', { style: 'text-align:center;margin-top:4px' },
            h('img', { id: 'coverImg', src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(coverSvg(p)), style: 'width:180px;border-radius:8px;border:1px solid #302a24' })),
          h('div', { class: 'hint' }, '涔﹀悕涓庨鏉愯嚜鍔ㄥ甫杩涙潵锛涙墜鏈轰笂闀挎寜灏侀潰鍥句繚瀛樺埌鐩稿唽锛岀數鑴戜笂鍙抽敭鍙﹀瓨涓哄浘鐗囥€?)),
        h('div', { class: 'card' },
          h('h3', null, '鏁版嵁澶囦唤锛堟崲璁惧鐢級'),
          h('div', { class: 'row', style: 'margin-bottom:8px' },
            btn('鐢熸垚澶囦唤涓?, () => {
              state.exportText = JSON.stringify(state)
              save(); render(); toast('宸茬敓鎴愶紝鍏ㄩ€夊鍒惰繖娈垫枃鏈?)
            }, 'mini'),
            btn('浠庢鍐呭鍏?, () => {
              try {
                const next = JSON.parse(state.exportText || '')
                if (!next || !next.projects || !next.projects.length) throw new Error('涓嶆槸鏈夋晥鐨勫浠?)
                state = next
                save(); tab = 'write'; render(); toast('瀵煎叆鎴愬姛')
              } catch (e) { toast('瀵煎叆澶辫触锛? + (e.message || e)) }
            }, 'mini primary')),
          area(state.exportText || '', (e) => { state.exportText = e.target.value; save() }, 5, '鎹㈣澶囨椂锛氭棫璁惧鐐广€岀敓鎴愬浠戒覆銆嶁啋 澶嶅埗 鈫?鏂拌澶囩矘鍒拌繖閲?鈫?鐐广€屼粠妗嗗唴瀵煎叆銆?)),
      ),
    )
  }

  function viewChars() {
    const p = project()
    const stageName = { early: '鍓嶆湡', mid: '涓湡', late: '鍚庢湡' }
    return h('div', null,
      h('div', { class: 'card' },
        h('h3', null, '浜虹墿琛紙' + p.characters.length + ' 浜猴級'),
        h('div', { class: 'row', style: 'margin-bottom:8px' }, btn('鈿?鎸夐樁娈电敓鎴愪汉鐗?, genCharacters, 'primary')),
        ['early', 'mid', 'late'].map((stage) => h('div', null,
          h('div', { class: 'hint', style: 'margin:8px 0 4px;color:#c9a86a' }, stageName[stage] + '锛? + p.characters.filter((c) => c.stage === stage).length + '锛?),
          h('ul', { class: 'list' }, p.characters.filter((c) => c.stage === stage).map((c) => h('li', null,
            h('span', null, h('b', null, c.name), c.role ? '锝? + c.role : '', c.desc ? '锝? + clip(c.desc, 20) : '', c.note ? '锛? + clip(c.note, 12) + '锛? : ''),
            h('button', { onclick: () => { p.characters = p.characters.filter((x) => x.id !== c.id); save(); render() } }, '鉁?)))))),
        h('div', { class: 'row', style: 'margin-top:8px' },
          input('', (e) => { e.key === 'Enter' && (window.__newChar = e.target.value) }, '濮撳悕锛屽洖杞︽坊鍔?),
          select('early', [['early', '鍓嶆湡'], ['mid', '涓湡'], ['late', '鍚庢湡']], (e) => { window.__newStage = e.target.value })),
        h('div', { class: 'row' }, btn('锛?娣诲姞', () => {
          const name = (window.__newChar || '').trim()
          if (!name) return toast('鍏堝～濮撳悕')
          p.characters.push({ id: uid(), name, role: '', desc: '', stage: window.__newStage || 'early', note: '' })
          save(); render()
        }, 'mini'))),
      h('p', { class: 'hint' }, '鍚庢湡浜虹墿鍙互鏄?鍓嶆湡鍙鎻愬強銆佸悗鏈熸墠鐧诲満"鈥斺€旂敓鎴愭椂妯″瀷浼氱湅鍒伴樁娈碉紝涓嶄細鎻愬墠鍐欏嚭鏉ャ€?),
    )
  }

  function viewPersona() {
    const p = project()
    return h('div', null,
      h('div', { class: 'card' },
        h('h3', null, '浣滆€呬汉鏍?),
        field('棰勮', select(p.persona.preset, PERSONAS.map((x) => [x.id, x.name]), (e) => { p.persona.preset = e.target.value; save(); render() })),
        field('鑷畾涔夎ˉ鍏?, area(p.persona.custom, (e) => { p.persona.custom = e.target.value; save() }, 4, '鍐嶈ˉ锛氬父鐢ㄦ剰璞°€佸彞寮忋€佺蹇屻€佽妭濂忓亸濂解€?)),
        h('p', { class: 'hint' }, '褰撳墠浜烘牸浼氫綔涓?system 娑堟伅閲岀殑銆屽啓浣滀汉鏍笺€嶄紶涓嬪幓锛屽彞寮忎笌鑵旇皟浠ュ畠涓哄噯銆?),
        h('div', { class: 'hint', style: 'color:#c9a86a' }, personaText(p) || '鏈€夋嫨浜烘牸')),
    )
  }

  function viewApi() {
    const s = state.settings
    const p = provider()
    return h('div', null,
      h('div', { class: 'card' },
        h('h3', null, '閫夋嫨 AI 鎺ュ彛'),
        field('鎺ュ彛', select(s.providerId, PROVIDERS.map((x) => [x.id, x.name + (x.free ? '锛堝厤璐癸級' : '')]), (e) => {
          const next = PROVIDERS.find((x) => x.id === e.target.value)
          s.providerId = next.id
          s.base = next.base
          s.key = (state.keys[next.id] || '')
          s.model = next.model
          save(); render(); ping()
        })),
        h('p', { class: 'hint' }, p.note || ''),
        h('div', { class: 'row', style: 'margin-bottom:10px' },
          btn('鍘荤敵璇?/ 鏌ョ湅 Key 鈫?, () => window.open(p.jump, '_blank', 'noopener'), 'jump'),
          btn('娴嬭瘯杩炴帴', async () => { const list = await ping(); toast(list.length ? '杩炴帴鎴愬姛锛? + list.length + ' 涓ā鍨? : '杩炴帴澶辫触锛岀湅鍙充笂瑙掓彁绀?) }, 'mini')),
        field('Base URL', input(s.base, (e) => { s.base = e.target.value; save() })),
        field('API Key锛堝彧瀛樻湰鏈烘祻瑙堝櫒锛?, h('input', { type: 'password', value: s.key || '', oninput: (e) => { s.key = e.target.value; state.keys[s.providerId] = e.target.value; save() } })),
        field('妯″瀷', input(s.model, (e) => { s.model = e.target.value; save() }), '鍙偣銆屾祴璇曡繛鎺ャ€嶈嚜鍔ㄥ～绗竴涓ā鍨嬶紱涔熷彲鎵嬪～')),
      h('div', { class: 'card' },
        h('h3', null, '鐢熸垚鍙傛暟'),
        field('娓╁害 ' + Number(s.temp).toFixed(2), h('input', { type: 'range', min: '0', max: '1.5', step: '0.05', value: s.temp, oninput: (e) => { s.temp = Number(e.target.value); save(); render() } })),
        field('鍗曟鏈€澶ц緭鍑?' + s.maxTokens, h('input', { type: 'range', min: '512', max: '8192', step: '128', value: s.maxTokens, oninput: (e) => { s.maxTokens = Number(e.target.value); save(); render() } })),
        field('榛樿姣忕珷瀛楁暟 ' + s.words, h('input', { type: 'range', min: '600', max: '6000', step: '100', value: s.words, oninput: (e) => { s.words = Number(e.target.value); save(); render() } })),
        field('蹇€熸ā寮忥紙鍏抽棴鎬濊€冿級', h('input', { type: 'checkbox', checked: s.fast ? 'checked' : null, onchange: (e) => { s.fast = e.target.checked; save() } }), '瀵规帹鐞嗗瀷妯″瀷鍙渷 2-3 鍊嶆椂闂达紝涓嶆敮鎸佺殑鎺ュ彛浼氳嚜鍔ㄥ拷鐣?)),
      h('p', { class: 'hint' }, '榛樿鏄厤璐圭殑鏈湴/鍏嶈垂棰濆害鎺ュ彛銆侹ey 鍙繚瀛樺湪杩欏彴璁惧鐨勬祻瑙堝櫒閲岋紝涓嶄細涓婁紶銆?),
    )
  }

  function viewHelp() {
    const items = [
      ['鐢熸垚鏈珷', '鎸夊綋鍓嶇珷鐨勫ぇ绾?+ 涓栫晫瑙?+ 浜虹墿 + 浜烘牸 + 鍓嶆儏锛岄噸鍐欏綋鍓嶇珷姝ｆ枃銆備細娓呯┖璇ョ珷鍘熸湁姝ｆ枃銆?],
      ['鐢熸垚涓嬩竴绔?, '寰€鍚庢帹涓€绔狅細鑷姩鏂板缓鎴栨壘鍒扮┖绔狅紝鍐欏畬鑷姩璧风珷鑺傚悕銆佸瓨鎽樿銆佽鍏ヨ蹇嗭紝鐒跺悗璺冲埌璇ョ珷銆?],
      ['杩炵画 3 绔?, '鑷姩鎵ц涓夋銆岀敓鎴愪笅涓€绔犮€嶏紝閫傚悎鍏堟妸鍓ф儏楠ㄦ灦璺戝嚭鏉ャ€?],
      ['缁啓', '鎺ョ潃鏈珷宸叉湁姝ｆ枃寰€涓嬪啓锛屼笉鏀瑰姩宸叉湁閮ㄥ垎銆?],
      ['娑﹁壊閫変腑', '鍦ㄦ鏂囬噷閫変腑涓€娈碉紝鎸夊綋鍓嶄汉鏍兼鼎鑹诧紝鍘熶綅鏇挎崲銆?],
      ['鐢熸垚鎽樿', '缁欐湰绔犲瓨 120-160 瀛楁憳瑕侊紝鍚屾椂鍐欏叆璁板繂搴擄紝渚涘悗缁珷鑺傚仛銆屽墠鎯呮彁瑕併€嶃€?],
      ['鐢熸垚鏈珷鍚?, '鏍规嵁鏈珷澶х翰涓庢鏂囧紑澶磋捣涓€涓?4-10 瀛楃珷鑺傚悕銆?],
      ['涓€閿敓鎴愯瀹?, '缁欎竴鍙ユ兂娉曪紝鑷姩濉功鍚嶃€佺畝浠嬨€佷笘鐣岃銆佷汉鐗┿€佹枃椋庛€佺蹇屻€?],
      ['鎸夐樁娈电敓鎴愪汉鐗?, '鐢熸垚 10-14 浜猴紝鍒嗗墠鏈?涓湡/鍚庢湡锛涘悗鏈熶汉鐗╁彲鍙湪浼犻椈閲屽嚭鐜般€?],
      ['浣滆€呬汉鏍?, '棰勮 10 绉嶇瑪娉曪紙杈颁笢銆佸ぉ铓曞湡璞嗐€佺尗鑵汇€佺兘鐏€佽€虫牴銆佸彜榫欍€佺暘鑼勭郴绛夛級锛屼篃鍙嚜瀹氫箟锛屼綔涓?system 娑堟伅浼犲叆銆?],
      ['绡囧箙 / 鑺傚', '绡囧箙鎺у埗鎺ㄨ繘閫熷害涓庤兘鍚︽敹灏撅紙闀跨瘒绂佹鍗佺珷瀹屾湰锛夛紝鑺傚鎺у埗姣忕珷鎺ㄨ繘鐐规暟閲忥紝闅忔椂鍙垏鎹€?],
      ['璁板繂', '鎵嬭鎴栬嚜鍔ㄧ疮璁＄殑璁惧畾瑕佺偣锛屾渶杩?6 鏉″啓杩涙瘡娆℃彁绀鸿瘝锛岄伩鍏嶅啓鐫€鍐欑潃蹇樿瀹氥€?],
      ['鎺ュ彛', '鍐呯疆 15 瀹?OpenAI 鍏煎鎺ュ彛锛屽厤璐规帴鍙ｉ粯璁ゅ彲鐢紱銆屽幓鐢宠 / 鏌ョ湅 Key銆嶄竴閿烦杞畼鏂归〉闈€?],
      ['鏁版嵁', '鍏ㄩ儴瀛樺湪鏈満娴忚鍣?localStorage锛屼笉涓婁紶锛涙崲璁惧/娓呯紦瀛樹細涓紝閲嶈绋夸欢璇疯嚜琛屽浠姐€?],
    ]
    return h('div', { class: 'card help' },
      h('h3', null, '鍔熻兘璇存槑'),
      items.map(([title, text]) => h('div', null, h('h4', null, title), h('p', null, text))),
      h('h4', null, '鎵嬫満浣跨敤'),
      h('p', null, '鐢佃剳杩愯 server.py 鍚庯紝鎵嬫満杩炲悓涓€ Wi-Fi锛屾祻瑙堝櫒鎵撳紑 http://鐢佃剳IP:8890 鍗冲彲锛堝湴鍧€鍦ㄧ數鑴戝惎鍔ㄦ椂鐨勭獥鍙ｉ噷锛夈€?),
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
