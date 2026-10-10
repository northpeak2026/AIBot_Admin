const vm=require('vm'),fs=require('fs'),assert=require('assert');
const elements={},listeners={},checked=[];let stored=null;
const context={window:{addEventListener(){}},document:{querySelector:s=>elements[s]??={innerHTML:'',textContent:'',style:{}},addEventListener:(t,f)=>listeners[t]=f,querySelectorAll:s=>s.includes('responseForms')?checked:[]},localStorage:{getItem(){return stored},setItem(k,v){stored=v}},location:{hash:''},history:{replaceState(){}},structuredClone,console,setTimeout(){},Date};
vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/../seed.js','utf8'),context);context.SEED=context.window.SEED;vm.runInContext(fs.readFileSync(__dirname+'/../rich-text.js','utf8'),context);vm.runInContext(fs.readFileSync(__dirname+'/../app.js','utf8'),context);
context.check=assert;context.checked=checked;context.listeners=listeners;
vm.runInContext(`
 const importTest=structuredClone(SEED);window.KNOWLEDGE_V1=[{module:'Sports',name:'导入测试',body:'WillBet 原始正文'}];const historyBefore=JSON.stringify(importTest.sessions);importKnowledgeV1(importTest);check.equal(importTest.knowledge.length,SEED.knowledge.length+1);check.equal(importTest.knowledge.at(-1).body,'WillBet 原始正文');const importedOnce=JSON.stringify(importTest);importKnowledgeV1(importTest);check.equal(JSON.stringify(importTest),importedOnce);check.equal(JSON.stringify(importTest.sessions),historyBefore);window.KNOWLEDGE_V1=[];
 const snapshot=structuredClone(SEED),ids=table=>db[table].map(x=>x.id);
 check.equal(Object.keys(titles).length,5);check(!shell().includes('问题中心'));check.equal(db.problems.length,SEED.problems.length);
 for(const t of ['intents','knowledge','sessions','problems'])check.deepEqual(ids(t),SEED[t].map(x=>x.id));
 check(db.knowledge.some(k=>k.type==='混合型'));view='knowledge';filters={};check(filtered().every(usableKnowledge));
 check(!listing().includes('Context'));check(!listing().includes('知识来源'));check(listing().includes('关联 Intent 数量'));
 filters={q:db.knowledge.find(usableKnowledge).body.slice(0,12)};check(filtered().length>0);
 const mixed=SEED.knowledge.find(k=>k.type==='混合型'),pure=SEED.knowledge.filter(k=>k.type==='知识型');
 const legacy=structuredClone(SEED);legacy.intents[0].handlingMethod='知识回复';legacy.intents[0].knowledge=[pure[0].id,pure[1].id];delete legacy.intents[0].associationSchema;legacy.intents[0].primaryKnowledge=pure[1].id;
 legacy.intents[1].handlingMethod='知识回复';legacy.intents[1].knowledge=[pure[0].id,pure[1].id];delete legacy.intents[1].associationSchema;
 legacy.intents[2].handlingMethod='知识回复';legacy.intents[2].knowledge=[mixed.id];delete legacy.intents[2].associationSchema;
 const beforeProblems=JSON.stringify(legacy.problems),beforeMessages=legacy.sessions.map(s=>s.messages.map(m=>m.answer));migrateData(legacy);
 check.deepEqual(legacy.intents[0].knowledge,[pure[1].id]);check.deepEqual(legacy.intents[1].knowledge,[]);check.equal(legacy.intents[1].enabled,false);check.equal(legacy.intents[1].legacyKnowledge.length,2);check.deepEqual(legacy.intents[2].knowledge,[]);
 check.equal(JSON.stringify(legacy.problems),beforeProblems);check.deepEqual(legacy.sessions.map(s=>s.messages.map(m=>m.answer)),beforeMessages);check.equal(legacy.knowledge.length,SEED.knowledge.length);
 const once=JSON.stringify(legacy);migrateData(legacy);check.equal(JSON.stringify(legacy),once,'idempotent migration');
 const knowledgeIntent={...db.intents[0],handlingMethod:'知识回复',enabled:true,knowledge:[pure[0].id]};check.equal(intentResult(knowledgeIntent).answer,pure[0].body,'exact knowledge answer');
 check(!serviceReady({...knowledgeIntent,knowledge:[]}));check(!serviceReady({...knowledgeIntent,knowledge:[mixed.id]}));
 const cap={...knowledgeIntent,handlingMethod:'业务能力',capabilityStatus:'已发布',capabilityIntegrated:false};check(!serviceReady(cap));check(serviceReady({...cap,capabilityIntegrated:true}));check(!serviceReady({...cap,capabilityIntegrated:true,enabled:false}));
 const benign={id:'test',question:'如何联系客服？',answer:db.settings.guide,time:'2026-10-06 10:00',tags:['转人工客服'],knowledge:[],intent:null,intentRecognized:false};check.equal(messageSignals(benign).length,0);check.equal(messageSignals({...benign,answer:db.settings.login,tags:[]}).length,0);check.equal(messageSignals({...benign,answer:db.settings.nonbusiness,tags:[]}).length,0);
 check(cannotAnswer({...benign,answer:db.settings.miss}));check(messageSignals({...benign,feedback:'down'}).includes('用户反馈未解决'));check(messageSignals({...benign,followUp:true}).includes('运营待关注'));
 const ss={...db.sessions[0],messages:[benign]};check(sessionQuick(ss,'转人工客服'));check(!sessionQuick(ss,'疑似未解决'));check(!sessionQuick(ss,'重复提问'));
 for(const quick of ['疑似未解决','无法回答','用户点踩','重复提问','转人工客服']){view='sessions';filters={quick};check(filtered().every(s=>sessionQuick(s,quick)))}
 const rows=validateImport([{name:'新知识',body:'直接回复正文'},{name:'',body:'正文'},{name:'无正文',body:''},{name:'新知识',body:'直接回复正文'}]);check.equal(rows[0].errors.length,0);check(rows[1].errors.length);check(rows[2].errors.includes('回复正文为空'));check(rows[3].errors.includes('内容重复'));
 for(const v of Object.keys(titles)){view=v;filters={};render();check(document.querySelector('#app').innerHTML.includes(titles[v]))}
 view='intents';filters={handlingMethod:'业务能力',capabilityStatus:'已发布',responseForm:'状态卡片'};check(filtered().every(i=>i.handlingMethod==='业务能力'&&i.capabilityStatus==='已发布'&&i.responseForms.includes('状态卡片')));
 filters={};editIntent();check(document.querySelector('#overlay').innerHTML.includes('name="responseForms"'));check(!document.querySelector('#overlay').innerHTML.includes('主回复知识'));
 filters={module:'Sports'};editKnowledge();check(!document.querySelector('#overlay').innerHTML.includes('<select name="module"'));check(!document.querySelector('#overlay').innerHTML.includes('Context'));check(document.querySelector('#overlay').innerHTML.includes('回复正文'));
 const form={name:'测试知识 Intent',module:'Sports',category:db.categories.find(c=>c.module==='Sports').id,description:'说明',phrases:'问法',handlingMethod:'知识回复',capabilityName:'',capabilityDescription:'',capabilityStatus:'未开发',enabled:'启用'};
 const originalRead=readForm;readForm=()=>form;checked.push({value:'纯文案'},{value:'文案 + 跳转链接'});intentKnowledgeDraft=[];const oldCount=db.intents.length;saveIntent('');check.equal(db.intents.length,oldCount,'reject missing knowledge');intentKnowledgeDraft=[pure[0].id,pure[1].id];saveIntent('');check.equal(db.intents.length,oldCount,'reject multiple knowledge');intentKnowledgeDraft=[pure[0].id];saveIntent('');check.equal(db.intents.length,oldCount+1);const created=db.intents.at(-1);check.equal(created.responseForms.length,2);check.deepEqual(created.knowledge,[pure[0].id]);intentKnowledgeDraft=[pure[1].id];saveIntent(created.id);check.deepEqual(created.knowledge,[pure[1].id]);check(created.legacyKnowledge.includes(pure[0].id));
 check.equal(db.sessions[0].messages[0].answer,SEED.sessions[0].messages[0].answer,'save must not rewrite historical answer');
 readForm=()=>({name:'独立知识',body:'完整回复正文',module:'Sports'});const kc=db.knowledge.length;saveKnowledge('');check.equal(db.knowledge.length,kc+1);check.equal(db.knowledge.at(-1).body,'完整回复正文');readForm=originalRead;
 const click=(a,id)=>listeners.click({target:{classList:{contains:()=>false},closest:()=>({dataset:{action:a,arg:id}})},preventDefault(){}});
 const ses=db.sessions[0],msg=ses.messages[0],pc=db.problems.length;const follow=msg.followUp;click('followup',ses.id+'|'+msg.id);check.equal(msg.followUp,!follow);check.equal(db.problems.length,pc,'followup creates no issue ID');click('followup',ses.id+'|'+msg.id);check.equal(msg.followUp,follow);
 readForm=()=>({operatorNote:'检查业务能力接入情况'});click('save-note',ses.id+'|'+msg.id);check.equal(msg.operatorNote,'检查业务能力接入情况');readForm=originalRead;
 const unbound=db.knowledge.at(-1);click('delete-knowledge',unbound.id);click('delete-knowledge-confirm',unbound.id);check(!db.knowledge.some(k=>k.id===unbound.id));check(db.archivedKnowledge.some(k=>k.id===unbound.id));
 filters={};view='overview';range='近 7 日';for(const n of [0,1,2,3,4,5,6]){view='overview';click('stat',String(n));check.equal(view,'sessions');check(filters.start&&filters.end)}
 view='overview';filters={};check(!overview().includes('问题中心'));check(overview().includes('待关注会话'));range='自定义时间';customStart='2026-09-15';check(overview().includes('09/15'));
 console.log('Passed: 5 modules, preserved IDs/history, single association migration, exact standard answer, capability readiness, multi response forms, knowledge CRUD/import, inspection signals/notes, overview navigation.');
`,context);
