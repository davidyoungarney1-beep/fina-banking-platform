document.addEventListener('DOMContentLoaded',()=>{
 const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
 const password=document.getElementById('password'),toggle=document.getElementById('togglePassword');
 if(password&&toggle)toggle.addEventListener('click',()=>{const show=password.type==='password';password.type=show?'text':'password';toggle.textContent=show?'Hide':'Show';toggle.setAttribute('aria-label',show?'Hide password':'Show password')});
 const config=window.FINA_CONFIG||{API_BASE_URL:'',DEMO_MODE:true},base=(config.API_BASE_URL||'').replace(/\/$/,''),demo=config.DEMO_MODE!==false;
 const message=document.getElementById('formMessage'),say=(text,error=false)=>{if(message){message.textContent=text;message.classList.toggle('error',error)}};
 const modal=document.getElementById('welcomeModal'),modalTitle=document.getElementById('welcomeModalTitle'),modalText=document.getElementById('welcomeModalText'),continueBtn=document.getElementById('welcomeContinue');
 continueBtn?.addEventListener('click',()=>{if(modal)modal.hidden=true;location.href='dashboard.html'});
 const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}},write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
 async function send(form,path,payload,success,redirect){
  const button=form.querySelector('[type="submit"]'),original=button.textContent;button.disabled=true;button.textContent='Please wait…';
  try{
   if(demo){await new Promise(r=>setTimeout(r,250));
    if(path==='/api/auth/register'){
     const users=read('fina_demo_users',[]);if(users.some(u=>u.email.toLowerCase()===payload.email.toLowerCase()))throw new Error('An account with this email already exists in this browser.');
     const user={id:'demo-'+Date.now(),fullName:payload.fullName,email:payload.email,phone:payload.phone||'',password:payload.password,balance:150000,bonusAmount:150000,bonusType:'preview promotional credit',accountStatus:'Preview / not verified',createdAt:new Date().toISOString()};users.push(user);write('fina_demo_users',users);write('fina_demo_user',user);write('fina_demo_transactions',[{id:'bonus-'+Date.now(),type:'Welcome bonus (PREVIEW)',description:'₦150,000 welcome bonus',amount:150000,status:'PREVIEW ONLY',createdAt:new Date().toISOString()}]);
     if(modal){modalTitle.textContent='You’ve received a ₦150,000 welcome bonus!';modalText.textContent='Your welcome bonus has been added to your account.';modal.hidden=false;}return;
    }
    if(path==='/api/auth/login'){const users=read('fina_demo_users',[]);const user=users.find(u=>u.email.toLowerCase()===payload.email.toLowerCase()&&u.password===payload.password);if(!user)throw new Error('No matching preview account in this browser. Create an account first.');if(Number(user.bonusAmount)===30000||(user.bonusAmount==null&&Number(user.balance)===30000)){user.balance=150000;user.bonusAmount=150000;user.bonusType='preview promotional credit';write('fina_demo_users',users);const tx=read('fina_demo_transactions',[]).map(t=>Number(t.amount)===30000?{...t,description:'₦150,000 welcome bonus',amount:150000}:t);write('fina_demo_transactions',tx);}write('fina_demo_user',user);say('Sign-in successful. Opening your account…');if(redirect)setTimeout(()=>location.href=redirect,350);return;}
    if(path==='/api/auth/forgot-password'){say('Password reset is not connected. No email was sent.');return;}
   }
   if(!base)throw new Error('Backend not connected. Set API_BASE_URL in config.js or keep preview mode enabled for frontend testing.');
   const res=await fetch(base+path,{method:'POST',credentials:'include',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(payload)}),data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data.message||data.error||'We could not complete your request. Please try again.');
   if(path==='/api/auth/register'&&modal){modalTitle.textContent='Welcome to FreeCash Pay';modalText.textContent=data.bonusCredited===true&&Number(data.bonusAmount)>0?'Your account was created and the backend confirms a credited bonus of ₦'+Number(data.bonusAmount).toLocaleString('en-NG')+'.':'Your account has been created successfully. Any bonus will appear only after the backend confirms it has been credited.';modal.hidden=false;}else{say(success);if(redirect)setTimeout(()=>location.href=redirect,350)}
  }catch(err){say(err.message||'Unable to connect. Please try again later.',true)}finally{button.disabled=false;button.textContent=original}
 }
 const login=document.getElementById('loginForm');login?.addEventListener('submit',e=>{e.preventDefault();say('');const f=new FormData(login);send(login,'/api/auth/login',{email:f.get('email').trim(),password:f.get('password')},'Sign-in successful. Opening your account…','dashboard.html')});
 const register=document.getElementById('registerForm');register?.addEventListener('submit',e=>{e.preventDefault();say('');const f=new FormData(register);send(register,'/api/auth/register',{fullName:f.get('fullName').trim(),email:f.get('email').trim(),phone:(f.get('phone')||'').trim(),password:f.get('password')},'Your account was created successfully.',null)});
 const reset=document.getElementById('resetForm');reset?.addEventListener('submit',e=>{e.preventDefault();say('');const f=new FormData(reset);send(reset,'/api/auth/forgot-password',{email:f.get('email').trim()},'If an account matches that email, password reset instructions will be sent.')});
});