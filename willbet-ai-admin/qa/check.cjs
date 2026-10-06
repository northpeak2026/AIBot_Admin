const vm=require('vm'),fs=require('fs'),assert=require('assert');
const elements={};const context={window:{addEventListener(){}},document:{querySelector:s=>elements[s]??={innerHTML:'',style:{}},addEventListener(){},querySelectorAll(){return[]}},localStorage:{getItem(){return JSON.stringify({...context.SEED,intents:context.SEED.intents.map((i,n)=>n===0?{...i,responseForm:undefined}:n===1?{...i,responseForm:'状态卡片'}:i),settings:{...context.SEED.settings,welcome:'你好，我是 WillBet 助手'}})},setItem(){}},location:{hash:''},history:{replaceState(){}},structuredClone,console,setTimeout(){},Date};vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/../seed.js','utf8'),context);context.SEED=context.window.SEED;vm.runInContext(fs.readFileSync(__dirname+'/../app.js','utf8'),context);
vm.runInContext(`
 const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
 assert(!JSON.stringify(db).includes('WillBet'),'saved branding migration');
 assert(RESPONSE_FORMS.length===9&&new Set(RESPONSE_FORMS).size===9,'fixed response form enum');
 assert(db.intents.every(i=>RESPONSE_FORMS.includes(i.responseForm)),'all intents have valid response form');
 assert(db.intents[0].responseForm===SEED.intents[0].responseForm,'legacy response form filled');
 assert(db.intents[1].responseForm==='状态卡片','existing configured response form preserved');
 view='intents';for(const form of RESPONSE_FORMS){filters={responseForm:form};assert(filtered().every(i=>i.responseForm===form),'response form filter '+form)}
 filters={module:'Sports',responseForm:'赛事卡片'};assert(filtered().length===8&&filtered().every(i=>i.module==='Sports'&&i.responseForm==='赛事卡片'),'combined response form filter');
 filters={};assert(listing().includes('data-filter="responseForm"')&&listing().includes('<th>回复形式</th>'),'response form list and filter');
 editIntent(db.intents[0].id);assert(document.querySelector('#overlay').innerHTML.includes('name="responseForm"'),'edit response form select');
 editIntent();assert(document.querySelector('#overlay').innerHTML.includes('name="responseForm"'),'new response form select');

 for(const t of ['intents','knowledge','sessions','problems'])assert(new Set(db[t].map(x=>x.id)).size===db[t].length,'duplicate ID '+t);
 for(const p of db.problems){const s=find('sessions',p.session);assert(s&&s.messages.some(m=>m.id===p.message),'broken problem reference');assert(find('intents',p.intent),'broken intent reference')}
 const rows=validateImport([{name:'新知识',type:'知识型',context:'多余数据',source:'后台配置',body:'规则正文'},{name:'实时知识',type:'混合型',context:'',source:'后台配置',body:'正文'},{name:'新知识',type:'知识型',context:'',source:'后台配置',body:'规则正文'}]);
 assert(rows[0].context==='无需'&&!rows[0].errors.length,'knowledge context');assert(rows[1].errors.includes('混合型但 Context 为空'),'hybrid validation');assert(rows[2].errors.includes('内容重复'),'duplicate validation');
 view='problems';filters={pending:'是'};assert(filtered().length===db.problems.filter(p=>['待处理','处理中'].includes(p.status)).length,'pending count');
 filters={module:'Wallet',tag:'用户点踩'};assert(filtered().every(p=>p.module==='Wallet'&&p.tags.includes('用户点踩')),'combined filters');
 view='overview';filters={module:'VIP'};assert(overview().includes('咨询趋势'),'overview render');range='自定义时间';customStart='2026-09-15';customEnd='2026-10-06';assert(overview().includes('09/15'),'custom chart dates');
 const unmatched={...db.sessions[0].messages[0],intent:null,intentRecognized:false};assert(!messageHTML(db.sessions[0],unmatched).includes('message-intent'),'unmatched intent hidden');const matched=db.sessions[1].messages[0];assert(messageHTML(db.sessions[1],matched).includes('message-intent'),'matched intent shown');assert(!messageHTML(db.sessions[0],unmatched).includes('class=\"tag'),'conversation anomaly tags hidden');assert(messageHTML(db.sessions[0],{...unmatched,feedback:'up'}).includes('👍🏻'),'positive feedback icon');assert(messageHTML(db.sessions[0],{...unmatched,feedback:'down'}).includes('👎🏻'),'negative feedback icon');view='settings';assert(!settings().includes('AI 名称')&&!settings().includes('客服入口')&&!settings().includes('avatar-file'),'removed configuration');view='intents';render();assert(!document.querySelector('#app').innerHTML.includes('管理业务目录'),'intent directory entry removed');view='knowledge';render();assert(!document.querySelector('#app').innerHTML.includes('管理业务目录'),'knowledge directory entry removed');intentKnowledgeDraft=[db.knowledge[0].id];assert(intentKnowledgeRows().includes(db.knowledge[0].id)&&!intentKnowledgeRows().includes(db.knowledge[1].id),'only bound knowledge shown');
 const guestSession={...db.sessions[1],user:'游客'},turn=messageHTML(guestSession,{...matched,knowledge:[db.knowledge[0].id]});
 assert(!turn.includes('游客'),'message sender label removed');
 assert(turn.includes('<time class="message-meta message-time">'+esc(matched.time)+'</time></div><div class="ai-message">'),'timestamp inside user bubble');
 assert(turn.indexOf('message-intent')>turn.indexOf(esc(matched.answer))&&turn.indexOf('message-intent')<turn.indexOf('message-knowledge'),'intent below AI answer');
 assert(!messageHTML(guestSession,{...matched,intentRecognized:false}).includes('message-intent'),'unrecognized flag hides existing intent');
 for(const v of Object.keys(titles)){view=v;filters={};render();assert(document.querySelector('#app').innerHTML.includes(titles[v]),'navigation render '+v)}
 console.log('Passed: entity uniqueness, cross-module references, import validation, pending deduplication, combined filters, custom dates, six module rendering, updated conversation display, bound-only knowledge, configuration removal, legacy branding migration');
`,context);
