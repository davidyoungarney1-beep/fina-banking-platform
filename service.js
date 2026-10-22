document.addEventListener('DOMContentLoaded',()=>{
 const config=window.FINA_CONFIG||{API_BASE_URL:''},base=(config.API_BASE_URL||'').replace(/\/$/,'');
 const token=localStorage.getItem('fina_token')||'',form=document.querySelector('[data-service-form]'),message=document.getElementById('serviceMessage');
 form?.addEventListener('submit',async e=>{
  e.preventDefault();message.textContent='';
  if(!base){message.textContent='The FINA backend is not connected yet. No transaction has been submitted.';return}
  if(!token){message.textContent='Please sign in before using this service.';return}
  const button=form.querySelector('[type="submit"]'),original=button.textContent,fd=new FormData(form),payload=Object.fromEntries(fd.entries());
  if(payload.amount!==undefined)payload.amount=Number(payload.amount);
  button.disabled=true;button.textContent='Processing…';
  try{const res=await fetch(base+form.dataset.endpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json',Authorization:'Bearer '+token},body:JSON.stringify(payload)});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data.message||data.error||'The service request could not be completed.');message.textContent=data.message||'Your request was accepted by FINA.';form.reset()}
  catch(err){message.textContent=err.message||'Unable to connect. Please try again.'}
  finally{button.disabled=false;button.textContent=original}
 });
});