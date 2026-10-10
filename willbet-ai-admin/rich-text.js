// Only operator-facing text formatting is persisted. Never retain pasted scripts or styles.
function cleanRich(html){
 const doc=new DOMParser().parseFromString(String(html),'text/html');
 const allowed=new Set(['P','DIV','BR','STRONG','B','EM','I','U','H2','H3','UL','OL','LI','BLOCKQUOTE','A']);
 const clean=node=>{
  if(node.nodeType===3)return esc(node.textContent);
  if(node.nodeType!==1)return '';
  if(['SCRIPT','STYLE','IFRAME','OBJECT','SVG','MATH','TEMPLATE'].includes(node.tagName))return '';
  const children=[...node.childNodes].map(clean).join('');
  if(!allowed.has(node.tagName))return children;
  const tag=node.tagName.toLowerCase();if(tag==='br')return '<br>';
  let attr='';if(tag==='a'){const href=node.getAttribute('href')||'';if(/^(https?:\/\/|mailto:)/i.test(href))attr=` href="${esc(href)}" target="_blank" rel="noopener noreferrer"`;}
  return `<${tag}${attr}>${children}</${tag}>`;
 };
 return [...doc.body.childNodes].map(clean).join('');
}
function richPlain(html){const doc=new DOMParser().parseFromString(html,'text/html');doc.querySelectorAll('br').forEach(el=>el.replaceWith('\n'));doc.querySelectorAll('p,div,h2,h3,li,blockquote').forEach(el=>el.append('\n'));return doc.body.textContent.replace(/\n{3,}/g,'\n\n').trim();}
function richEditor(k){return `<div class="field"><span id="body-label">回复正文 *</span><div class="rich-toolbar" role="toolbar" aria-label="正文格式">${[['bold','加粗'],['italic','斜体'],['underline','下划线'],['heading','标题'],['paragraph','正文'],['insertUnorderedList','无序列表'],['insertOrderedList','有序列表'],['link','插入链接'],['removeFormat','清除格式']].map(([command,label])=>btn(label,'rich-command',command)).join('')}</div><div id="knowledge-body" class="rich-body" role="textbox" aria-labelledby="body-label" aria-multiline="true" contenteditable="true">${k.bodyHtml?cleanRich(k.bodyHtml):esc(k.body).replace(/\n/g,'<br>')}</div><div class="subtext">支持格式编辑；粘贴内容仅保留文字、列表和安全链接。</div></div>`;}
let richSelection=null;
document.addEventListener('selectionchange',()=>{const editor=document.querySelector('#knowledge-body'),selection=window.getSelection();if(editor&&selection?.rangeCount&&editor.contains(selection.anchorNode)&&editor.contains(selection.focusNode))richSelection=selection.getRangeAt(0).cloneRange();});
function richCommand(command){const editor=document.querySelector('#knowledge-body');if(!editor)return;editor.focus();if(richSelection&&editor.contains(richSelection.commonAncestorContainer)){const selection=window.getSelection();selection.removeAllRanges();selection.addRange(richSelection);}if(command==='link'){const url=window.prompt('输入链接（https:// 或 http://）');if(!url)return;if(!/^https?:\/\//i.test(url))return toast('请输入 http:// 或 https:// 链接');document.execCommand('createLink',false,url);}else if(command==='heading'||command==='paragraph')document.execCommand('formatBlock',false,command==='heading'?'h3':'p');else document.execCommand(command,false,null);}
document.addEventListener('paste',e=>{if(!e.target.closest?.('#knowledge-body'))return;e.preventDefault();const html=e.clipboardData.getData('text/html'),text=e.clipboardData.getData('text/plain');document.execCommand('insertHTML',false,html?cleanRich(html):esc(text).replace(/\n/g,'<br>'));});
