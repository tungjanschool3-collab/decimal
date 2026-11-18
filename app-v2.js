const state={denominator:4,numerator:3,whole:1,remainder:1,mode:'fraction',shape:'circle',color:'#ff6b5f'};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const thaiNums=['ศูนย์','หนึ่ง','สอง','สาม','สี่','ห้า','หก','เจ็ด','แปด','เก้า','สิบ','สิบเอ็ด','สิบสอง'];
const fractionNames={2:'ส่วนสอง',3:'ส่วนสาม',4:'ส่วนสี่',5:'ส่วนห้า',6:'ส่วนหก',7:'ส่วนเจ็ด',8:'ส่วนแปด',9:'ส่วนเก้า',10:'ส่วนสิบ',11:'ส่วนสิบเอ็ด',12:'ส่วนสิบสอง'};
function classify(n,d){if(n===0)return 'ยังไม่ระบายสี';if(n<d)return 'เศษส่วนแท้';if(n===d)return 'หนึ่งจำนวนเต็ม';return 'เศษเกิน'}
function render(){
  if(state.mode==='improper')state.numerator=Math.max(state.denominator+1,Math.min(state.numerator,state.denominator*4));
  else if(state.mode==='fraction')state.numerator=Math.max(0,Math.min(state.numerator,state.denominator));
  state.whole=Math.max(1,Math.min(state.whole,3));state.remainder=Math.max(1,Math.min(state.remainder,state.denominator-1));
  const total=state.mode==='mixed'?state.whole*state.denominator+state.remainder:state.numerator;
  const whole=Math.floor(total/state.denominator),rem=total%state.denominator;
  $('#denominatorOut').textContent=state.denominator;$('#numeratorOut').textContent=state.numerator;$('#wholeOut').textContent=state.whole;$('#remainderOut').textContent=state.remainder;
  $('#wholeControl').hidden=state.mode!=='mixed';const numStepper=$('[data-step="numerator"]').closest('.stepper');numStepper.hidden=state.mode==='mixed';numStepper.previousElementSibling.hidden=state.mode==='mixed';
  $('#numText').textContent=total;$('#denText').textContent=state.denominator;$('#wholePart').textContent=total>state.denominator?`${whole} จำนวนเต็ม${rem?' กับ':''}`:'';
  $('#equalsText').textContent=state.mode==='mixed'?` = ${state.whole} ${state.remainder}/${state.denominator}`:` = ระบายสี ${total} ส่วน (รูปละ ${state.denominator} ส่วน)`;
  $('#typeBadge').textContent=state.mode==='mixed'?'จำนวนคละ':classify(total,state.denominator);
  $('#reading').textContent=total>state.denominator?`${whole} จำนวนเต็ม${rem?' '+rem+'/'+state.denominator:''}`:`${thaiNums[total]||total}${fractionNames[state.denominator]||('ส่วน'+state.denominator)}`;
  const c=$('#conversion');c.hidden=state.mode==='fraction';c.innerHTML=state.mode==='mixed'?`<strong>${state.whole} ${state.remainder}/${state.denominator}</strong> = (${state.whole} × ${state.denominator}) + ${state.remainder} = <strong>${total}/${state.denominator}</strong>`:`<strong>${total}/${state.denominator}</strong> ÷ ${state.denominator} = <strong>${whole}${rem?' '+rem+'/'+state.denominator:''}</strong> — ได้ ${whole} รูปเต็ม${rem?' และเหลือ '+rem+' ส่วน':''}`;
  drawVisual(total);
}
function drawVisual(total){
  const v=$('#visual');v.innerHTML='';const groups=Math.max(1,Math.ceil(total/state.denominator)),wrap=document.createElement('div');wrap.className='group-wrap';v.appendChild(wrap);
  for(let g=0;g<groups;g++){
    const item=document.createElement('div');item.className='group-item';const el=document.createElement('div');el.className=state.shape==='circle'?'fraction-circle':'fraction-bar';if(state.shape==='bar')el.style.gridTemplateColumns=`repeat(${state.denominator},1fr)`;
    for(let i=0;i<state.denominator;i++){const idx=g*state.denominator+i,on=idx<total,part=document.createElement('i');if(state.shape==='circle'){part.className='slice';const angle=360/state.denominator;part.style.transform=`rotate(${i*angle}deg) skewY(${90-angle}deg)`;part.style.background=on?state.color:'#f0edf4'}else{part.className='bar-cell';part.style.background=on?state.color:'#f0edf4'}part.title=`ส่วนที่ ${idx+1}`;part.onclick=()=>{if(state.mode!=='mixed'){state.numerator=on?Math.max(0,idx):idx+1;render()}};el.appendChild(part)}
    item.appendChild(el);const label=document.createElement('small');const filled=Math.max(0,Math.min(state.denominator,total-g*state.denominator));label.textContent=filled===state.denominator?`รูปที่ ${g+1}: เต็ม 1 รูป`:`รูปที่ ${g+1}: ${filled}/${state.denominator}`;item.appendChild(label);wrap.appendChild(item);
  }
}
$$('[data-step]').forEach(b=>b.onclick=()=>{const k=b.dataset.step;state[k]+=Number(b.dataset.delta);if(k==='denominator'){state.denominator=Math.max(2,Math.min(12,state.denominator));state.remainder=Math.min(state.remainder,state.denominator-1);if(state.mode==='improper')state.numerator=Math.max(state.numerator,state.denominator+1)}render()});
$$('[data-mode]').forEach(b=>b.onclick=()=>{$$('[data-mode]').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.mode=b.dataset.mode;if(state.mode==='fraction')state.numerator=Math.min(state.numerator,state.denominator-1);if(state.mode==='improper')state.numerator=Math.max(state.numerator,state.denominator+1);render()});
$$('[data-shape]').forEach(b=>b.onclick=()=>{$$('[data-shape]').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.shape=b.dataset.shape;render()});
$$('[data-color]').forEach(b=>b.onclick=()=>{$$('[data-color]').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.color=b.dataset.color;render()});
$('#randomize').onclick=()=>{state.denominator=2+Math.floor(Math.random()*7);if(state.mode==='mixed'){state.whole=1+Math.floor(Math.random()*3);state.remainder=1+Math.floor(Math.random()*(state.denominator-1))}else if(state.mode==='improper')state.numerator=state.denominator+1+Math.floor(Math.random()*(state.denominator*2));else state.numerator=1+Math.floor(Math.random()*(state.denominator-1));render()};
$('#reset').onclick=()=>{Object.assign(state,{denominator:4,numerator:3,whole:1,remainder:1,mode:'fraction',shape:'circle',color:'#ff6b5f'});$$('[data-shape]').forEach(x=>x.classList.toggle('active',x.dataset.shape==='circle'));$$('[data-mode]').forEach(x=>x.classList.toggle('active',x.dataset.mode==='fraction'));render()};
$('#teacherMode').onclick=()=>{document.body.classList.toggle('teacher');$('#teacherMode').textContent=document.body.classList.contains('teacher')?'✓ โหมดคุณครู':'โหมดคุณครู'};
const vulgar={'1/2':'½','1/3':'⅓','2/3':'⅔','1/4':'¼','3/4':'¾','1/5':'⅕','2/5':'⅖','3/5':'⅗','4/5':'⅘','1/6':'⅙','5/6':'⅚','1/8':'⅛','3/8':'⅜','5/8':'⅝','7/8':'⅞'};
function previewFormula(){let s=$('#formulaInput').value;Object.entries(vulgar).forEach(([a,b])=>s=s.replaceAll(a,b));$('#formulaPreview').textContent=s||'เริ่มเขียนสูตรได้เลย'}
$('#formulaInput').oninput=previewFormula;$$('[data-insert]').forEach(b=>b.onclick=()=>{const i=$('#formulaInput'),p=i.selectionStart;i.value=i.value.slice(0,p)+b.dataset.insert+i.value.slice(i.selectionEnd);i.focus();i.selectionStart=i.selectionEnd=p+b.dataset.insert.length;previewFormula()});
const cv=$('#challengeVisual');for(let i=0;i<5;i++){const x=document.createElement('i');if(i<3)x.className='on';cv.appendChild(x)}
$$('#answers button').forEach(b=>b.onclick=()=>{$$('#answers button').forEach(x=>x.classList.remove('correct','wrong'));const ok=b.textContent==='3/5';b.classList.add(ok?'correct':'wrong');$('#feedback').textContent=ok?'เก่งมาก! 3 ส่วนจากทั้งหมด 5 ส่วน 🎉':'ลองนับส่วนที่มีสีอีกครั้งนะ'});
render();previewFormula();

