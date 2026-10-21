const toast=document.getElementById('toast');
let toastTimer;
function notify(message){
  toast.textContent=message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove('show'),3800);
}
function addActivity(title,detail){
  const list=document.getElementById('activityList');
  const empty=list.querySelector('.empty-state');
  if(empty) empty.remove();
  const row=document.createElement('div');
  row.className='activity-item';
  const left=document.createElement('div');
  const name=document.createElement('strong');
  name.textContent=title;
  const sub=document.createElement('small');
  sub.textContent=detail;
  left.append(name,sub);
  const status=document.createElement('span');
  status.textContent='Demo';
  status.style.color='#1d775b';
  status.style.fontWeight='700';
  row.append(left,status);
  list.prepend(row);
}
const modal=document.getElementById('withdrawModal');
document.getElementById('withdrawBtn').addEventListener('click',()=>{
  modal.hidden=false;
  document.getElementById('withdrawAmount').focus();
});
document.getElementById('closeModal').addEventListener('click',()=>modal.hidden=true);
modal.addEventListener('click',e=>{if(e.target===modal)modal.hidden=true});
document.addEventListener('keydown',e=>{if(e.key==='Escape')modal.hidden=true});
document.getElementById('withdrawForm').addEventListener('submit',e=>{
  e.preventDefault();
  const amount=Number(document.getElementById('withdrawAmount').value);
  if(!Number.isFinite(amount)||amount<500){
    notify('For this demo, enter an amount of at least ₦500.');
    return;
  }
  addActivity('Withdrawal preview','₦'+amount.toLocaleString('en-NG')+' — not submitted to a bank');
  modal.hidden=true;
  e.target.reset();
  notify('Demo only: no withdrawal was sent or processed.');
});
document.getElementById('activateBtn').addEventListener('click',()=>{
  document.getElementById('activationCode').focus();
  document.getElementById('activationCode').scrollIntoView({behavior:'smooth',block:'center'});
});

/* Add a clear way to request an activation code without implying that this demo issues real codes. */
const codeRow=document.querySelector('.code-row');
if(codeRow && !document.getElementById('getActivationCodeBtn')){
  const getCodeBtn=document.createElement('button');
  getCodeBtn.type='button';
  getCodeBtn.id='getActivationCodeBtn';
  getCodeBtn.className='button button-outline full';
  getCodeBtn.textContent='Get activation code';
  getCodeBtn.style.marginTop='10px';
  codeRow.insertAdjacentElement('afterend',getCodeBtn);
  getCodeBtn.addEventListener('click',()=>{
    notify('Activation codes are not issued in this demo. No payment is required. A real code must come from FINA through a verified official channel.');
  });
}
document.getElementById('redeemBtn').addEventListener('click',()=>{
  const input=document.getElementById('activationCode');
  if(!input.value.trim()){
    notify('Enter a demo code to preview this step.');
    input.focus();
    return;
  }
  addActivity('Activation code entered','Demo only — code not validated');
  input.value='';
  notify('This prototype cannot validate or activate real codes.');
});
document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{
  const service=button.dataset.service;
  if(service==='Transactions'){
    document.getElementById('activityList').scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }
  notify(service+' integration is not connected yet.');
}));
document.getElementById('activityLink').addEventListener('click',()=>document.getElementById('activityList').scrollIntoView({behavior:'smooth',block:'center'}));
