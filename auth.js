document.addEventListener('DOMContentLoaded',()=>{
 const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
 const password=document.getElementById('password'),toggle=document.getElementById('togglePassword');
 if(password&&toggle)toggle.addEventListener('click',()=>{const show=password.type==='password';password.type=show?'text':'password';toggle.textContent=show?'Hide':'Show';toggle.setAttribute('aria-label',show?'Hide password':'Show password')});
 const config=window.FINA_CONFIG||{API_BASE_URL:''},base=(config.API_BASE_URL||'').replace(/\/$/,'');
 const message=document.getElementById('formMessage'),say=(text,error=false)=>{if(message){message.textContent=text;message.classList.toggle('error',error)}};
 const modal=document.getElementById('welcomeModal'),modalTitle=document.getElementById('welcomeModalTitle'),modalText=document.getElementById('welcomeModalText'),continueBtn=document.getElementById('welcomeContinue');
 continueBtn?.addEventListener('click',()=>{if(modal)modal.hidden=true;location.href='dashboard.html'});
 async function send(form,path,payload,success,redirect){
  if(!base){say('The FINA backend is not connected yet. Your details have not been sent or saved.',true);return}
  const button=form.querySelector('[type="submit"]'),original=button.textContent;button.disabled=true;button.textContent='Please wait…';
  try{
   const res=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(payload)}),data=await res.json().catch(()=>({}));
   if(!res.ok)throw new Error(data.message||data.error||'We could not complete your request. Please try again.');
   if(data.token)localStorage.setItem('fina_token',data.token);if(data.user)localStorage.setItem('fina_user',JSON.stringify(data.user));
   if(path==='/api/auth/register'&&modal){
    modalTitle.textContent='Welcome to FINA';
    modalText.textContent='Your account has been created successfully.';
    if(data.bonusCredited===true&&Number.isFinite(Number(data.bonusAmount))&&Number(data.bonusAmount)>0)modalText.textContent='Your account has been created successfully. Your account service confirms a credited bonus of ₦'+Number(data.bonusAmount).toLocaleString('en-NG')+'.';
    modal.hidden=false;
   }else{say(success);if(redirect)setTimeout(()=>location.href=redirect,650)}
  }catch(err){say(err.message||'Unable to connect. Please try again later.',true)}
  finally{button.disabled=false;button.textContent=original}
 }
 const login=document.getElementById('loginForm');
 login?.addEventListener('submit',e=>{e.preventDefault();say('');const f=new FormData(login);send(login,'/api/auth/login',{email:f.get('email').trim(),password:f.get('password')},'Sign-in successful. Opening your account…','dashboard.html')});
 const register=document.getElementById('registerForm');
 register?.addEventListener('submit',e=>{e.preventDefault();say('');const f=new FormData(register);send(register,'/api/auth/register',{fullName:f.get('fullName').trim(),email:f.get('email').trim(),phone:(f.get('phone')||'').trim(),password:f.get('password')},'Your account was created successfully.',null)});
 const reset=document.getElementById('resetForm');
 reset?.addEventListener('submit',e=>{e.preventDefault();say('');const f=new FormData(reset);send(reset,'/api/auth/forgot-password',{email:f.get('email').trim()},'If an account matches that email, password reset instructions will be sent.')});
});