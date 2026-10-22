document.addEventListener('DOMContentLoaded', () => {
 const year=document.getElementById('year'); if(year) year.textContent=new Date().getFullYear();
 const password=document.getElementById('password'), toggle=document.getElementById('togglePassword');
 if(password&&toggle) toggle.addEventListener('click',()=>{const show=password.type==='password';password.type=show?'text':'password';toggle.textContent=show?'Hide':'Show';toggle.setAttribute('aria-label',show?'Hide password':'Show password')});
 const config=window.FINA_CONFIG||{API_BASE_URL:''}, base=(config.API_BASE_URL||'').replace(/\/$/,'');
 const message=document.getElementById('formMessage'), say=(text,error=false)=>{if(message){message.textContent=text;message.classList.toggle('error',error)}};
 async function send(form,path,payload,success,redirect){
  if(!base){say('The FINA backend is not connected yet. Your details have not been sent or saved.',true);return}
  const button=form.querySelector('[type="submit"]'), original=button.textContent;button.disabled=true;button.textContent='Please wait…';
  try{const res=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(payload)});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data.message||data.error||'We could not complete your request. Please try again.');if(data.token)localStorage.setItem('fina_token',data.token);if(data.user)localStorage.setItem('fina_user',JSON.stringify(data.user));say(success);if(redirect)setTimeout(()=>location.href=redirect,650)}
  catch(err){say(err.message||'Unable to connect. Please try again later.',true)}finally{button.disabled=false;button.textContent=original}
 }
 const login=document.getElementById('loginForm');
 login?.addEventListener('submit',e=>{e.preventDefault();say('');const f=new FormData(login);send(login,'/api/auth/login',{email:f.get('email').trim(),password:f.get('password')},'Sign-in successful. Opening your account…','dashboard.html')});
 const register=document.getElementById('registerForm');
 register?.addEventListener('submit',e=>{e.preventDefault();say('');const f=new FormData(register);send(register,'/api/auth/register',{fullName:f.get('fullName').trim(),email:f.get('email').trim(),phone:(f.get('phone')||'').trim(),password:f.get('password')},'Your account was created successfully. Opening your account…','dashboard.html')});
 const reset=document.getElementById('resetForm');
 reset?.addEventListener('submit',e=>{e.preventDefault();say('');const f=new FormData(reset);send(reset,'/api/auth/forgot-password',{email:f.get('email').trim()},'If an account matches that email, password reset instructions will be sent.')});
});