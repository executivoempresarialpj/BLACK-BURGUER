/* ===== checkout em etapas ===== */
const val=k=>(co[k]||"").toString().trim();
function drawCo(){view="co";$("#dTitle").textContent="Finalizar pedido";const s=co.step;
 let h=`<div class="steps">${[1,2,3,4].map(n=>`<i class="${n<=s?"on":""}"></i>`).join("")}</div>`;
 if(s===1)h+=`<div class="fld"><label>Nome completo *</label><input data-k="nome" value="${esc(val("nome"))}" autocomplete="name"></div><div class="fld"><label>Telefone *</label><input data-k="tel" type="tel" inputmode="tel" value="${esc(val("tel"))}" placeholder="(79) 90000-0000" autocomplete="tel"></div><div class="fld"><label>Observações gerais</label><textarea data-k="obs" rows="3">${esc(val("obs"))}</textarea></div>`;
 if(s===2){h+=`<div class="opts"><button class="opt ${co.tipo==="Entrega"?"on":""}" data-t="Entrega">🛵 Entrega</button><button class="opt ${co.tipo==="Retirada"?"on":""}" data-t="Retirada">🏪 Retirada</button></div>`;
  if(co.tipo==="Entrega")h+=[["rua","Rua *"],["num","Número *"],["bairro","Bairro *"],["comp","Complemento"],["ref","Ponto de referência"]].map(([k,l])=>`<div class="fld"><label>${l}</label><input data-k="${k}" value="${esc(val(k))}"></div>`).join("");else h+='<div class="note">Retirada no estabelecimento. O endereço será combinado pelo WhatsApp.</div>'}
 if(s===3){h+=`<div class="opts">${["Pix","Dinheiro","Cartão de crédito","Cartão de débito"].map(x=>`<button class="opt ${co.pag===x?"on":""}" data-pg="${x}">${x}</button>`).join("")}</div>`;
  if(co.pag==="Pix"&&bbOnlinePix)h+=`<div class="note">Pague aqui no site pelo PagBank. O recebimento será confirmado automaticamente.</div><div class="fld"><label>E-mail para o pagamento *</label><input data-k="emailPix" type="email" autocomplete="email" value="${esc(val("emailPix"))}"></div><div class="fld"><label>CPF do pagador *</label><input data-k="cpfPix" inputmode="numeric" value="${esc(val("cpfPix"))}" maxlength="14"></div>`;
  if(co.pag==="Dinheiro")h+=`<div class="opts"><button class="opt ${co.troco==="n"?"on":""}" data-tr="n">Não preciso de troco</button><button class="opt ${co.troco==="s"?"on":""}" data-tr="s">Preciso de troco</button></div>`+(co.troco==="s"?`<div class="fld"><label>Troco para quanto? *</label><input data-k="trocoV" inputmode="decimal" value="${esc(val("trocoV"))}" placeholder="Ex.: 50"></div>`:"")}
 if(s===4){co.no=co.no||genNo()}if(s===4)h+=`<div class="sum">${esc(buildMsg())}</div><div class="note" style="margin-top:10px">Ao enviar, o WhatsApp abrirá com a mensagem pronta. Seu pedido só estará confirmado depois que o estabelecimento responder. ${co.pag==="Pix"&&bbOnlinePix?"Você pagará pelo Pix PagBank na próxima etapa. A confirmação é automática. A taxa de entrega, se houver, será combinada à parte.":"O pagamento é combinado diretamente com o estabelecimento."}</div>`;
 h+='<div class="err" id="err"></div>';$("#dBody").innerHTML=h;
 $("#dFoot").innerHTML=`<div class="tot"><span>Subtotal</span><span>${money(total())}</span></div><div class="note">Taxa de entrega a confirmar pelo WhatsApp</div><div class="row"><button class="btn g" id="bk" style="flex:.6">Voltar</button><button class="btn p" id="nx">${s===4?(co.pag==="Pix"&&bbOnlinePix?"Gerar Pix e pagar":"Enviar pelo WhatsApp"):"Continuar"}</button></div>`;
 $("#bk").onclick=()=>{if(s===1)drawCart();else{co.step--;drawCo()}};$("#nx").onclick=()=>{const m=check(s);if(m){$("#err").textContent=m;$("#err").scrollIntoView({block:"center",behavior:"smooth"});if(navigator.vibrate)navigator.vibrate(60);return}if(s===4)send();else{co.step++;drawCo();$("#dBody").scrollTop=0}}}
$("#dBody").addEventListener("input",e=>{const k=e.target.dataset.k;if(view!=="co"||!k)return;if(k==="tel"){let d=e.target.value.replace(/\D/g,"").slice(0,11);e.target.value=d.length>6?`(${d.slice(0,2)}) ${d.slice(2,d.length>10?7:6)}-${d.slice(d.length>10?7:6)}`:d.length>2?`(${d.slice(0,2)}) ${d.slice(2)}`:d}co[k]=e.target.value});
$("#dBody").addEventListener("click",e=>{if(view!=="co")return;const t=e.target.closest("button");if(!t)return;const d=t.dataset;
 if(d.t){co.tipo=d.t;drawCo()}if(d.pg){co.pag=d.pg;drawCo()}if(d.tr){co.troco=d.tr;drawCo()}});
function check(s){if(s===1){if(val("nome").length<3)return"Informe seu nome completo.";if(val("tel").replace(/\D/g,"").length<10)return"Informe um telefone válido com DDD."}
 if(s===2&&co.tipo==="Entrega"){if(!val("rua")||!val("num")||!val("bairro"))return"Preencha rua, número e bairro para a entrega."}
 if(s===3&&co.pag==="Pix"&&bbOnlinePix){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val("emailPix")))return"Informe um e-mail válido.";if(val("cpfPix").replace(/\D/g,"").length!==11)return"Informe o CPF do pagador."}
 if(s===3&&co.pag==="Dinheiro"){if(!co.troco)return"Informe se precisa de troco.";if(co.troco==="s"&&!(parseFloat(val("trocoV").replace(",","."))>0))return"Informe para qual valor precisa de troco."}return""}
function buildMsg(){const L=["🍔 *NOVO PEDIDO — BLACK BURGUER*","Pedido No "+(co.no||""),"","👤 *CLIENTE*","Nome: "+val("nome"),"Telefone: "+val("tel"),"","🛒 *MEU PEDIDO*",""];
 cart.forEach(i=>{const p=P(i.id);L.push(`${i.qty}x ${p.nome} — ${money(p.preco*i.qty)}`);if(i.note)L.push("   Obs.: "+i.note)});
 if(val("obs"))L.push("","Observações: "+val("obs"));
 L.push("","💰 *RESUMO*","Subtotal: "+money(total()),"Taxa de entrega: "+(CONFIG.deliveryFee==null?"A confirmar":money(CONFIG.deliveryFee)),"","🛵 *TIPO DE PEDIDO*",co.tipo);
 if(co.tipo==="Entrega")L.push("","📍 *ENDEREÇO*","Rua: "+val("rua"),"Número: "+val("num"),"Bairro: "+val("bairro"),"Complemento: "+(val("comp")||"-"),"Referência: "+(val("ref")||"-"));
 L.push("","💳 *PAGAMENTO*",co.pag+(co.paymentConfirmed?" — pagamento confirmado pelo PagBank":""));
 if(co.pag==="Dinheiro")L.push(co.troco==="s"?"Troco para: R$ "+val("trocoV"):"Sem necessidade de troco");
 L.push("","Aguardo a confirmação do meu pedido!");return L.join("\n")}
function snap(){const comp=val("comp"),ref=val("ref");return{no:co.no,date:new Date().toISOString(),nome:val("nome"),tel:val("tel"),tipo:co.tipo,
 end:co.tipo==="Entrega"?`${val("rua")}, ${val("num")} - ${val("bairro")}`+(comp?` (${comp})`:"")+(ref?` · Ref.: ${ref}`:""):"Retirada no estabelecimento",
 pag:co.pag+(co.pag==="Dinheiro"?(co.troco==="s"?" · troco para R$ "+val("trocoV"):" · sem troco"):""),obs:val("obs"),
 items:cart.map(i=>({nome:P(i.id).nome,qty:i.qty,preco:P(i.id).preco,note:i.note||""})),total:total()}}
function rcRows(o){const fee=CONFIG.deliveryFee==null?"A confirmar":money(CONFIG.deliveryFee),r=[{t:"title",a:"BLACK BURGUER"},{t:"sub",a:"COMPROVANTE DE PEDIDO"},{t:"sep"},
 {t:"kv",a:"Pedido nº",b:o.no},{t:"kv",a:"Data",b:new Date(o.date).toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"})},{t:"kv",a:"Cliente",b:o.nome},{t:"kv",a:"Telefone",b:o.tel},{t:"kv",a:"Tipo",b:o.tipo},{t:"kv",a:o.tipo==="Entrega"?"Endereço":"Local",b:o.end},{t:"sep"}];
 o.items.forEach(i=>r.push({t:"item",a:i.qty+"x "+i.nome,b:money(i.qty*i.preco),n:i.note}));
 if(o.obs)r.push({t:"kv",a:"Observações",b:o.obs});
 r.push({t:"sep"},{t:"kv",a:"Subtotal",b:money(o.total)},{t:"kv",a:"Taxa de entrega",b:o.tipo==="Entrega"?fee:"—"},{t:"tot",a:"Total parcial",b:money(o.total+(CONFIG.deliveryFee&&o.tipo==="Entrega"?CONFIG.deliveryFee:0))},{t:"kv",a:"Pagamento",b:o.pag},{t:"sep"},
 {t:"txt",a:"Situação: aguardando confirmação do estabelecimento pelo WhatsApp."},{t:"txt",a:"Este comprovante registra o pedido enviado e não representa pagamento."});return r}
async function rcImg(o){const rows=rcRows(o),W=720,P=44,c=document.createElement("canvas"),x=c.getContext("2d"),lg=new Image();lg.src=IMG["01"];try{await lg.decode()}catch(e){}
 const F=(s,w)=>x.font=`${w||400} ${s}px Poppins,Arial,sans-serif`;
 const wrap=(t,mw)=>{const out=[];String(t).split("\n").forEach(p=>{let l="";p.split(" ").forEach(w=>{const n=l?l+" "+w:w;if(x.measureText(n).width>mw&&l){out.push(l);l=w}else l=n});out.push(l)});return out};
 const pass=d=>{let y=P;if(d){x.fillStyle="#000";x.fillRect(0,0,W,c.height);WM.forEach(([px,py,s,r,a])=>{x.save();x.globalAlpha=a;x.translate(px*W,py*c.height);x.rotate(r*Math.PI/180);x.beginPath();x.arc(0,0,s/2,0,7);x.clip();x.drawImage(lg,-s/2,-s/2,s,s);x.restore()});x.save();x.beginPath();x.arc(W/2,y+45,45,0,7);x.clip();x.drawImage(lg,W/2-45,y,90,90);x.restore()}y+=106;
  for(const r of rows){x.fillStyle="#fff";x.textAlign="left";
   if(r.t==="title"){F(42,800);if(d){x.textAlign="center";x.fillText(r.a,W/2,y+30)}y+=50}
   else if(r.t==="sub"){F(17,600);x.fillStyle="#b5b5b5";if(d){x.textAlign="center";x.fillText(r.a,W/2,y+8)}y+=26}
   else if(r.t==="sep"){if(d){x.strokeStyle="#4a4a4a";x.lineWidth=2;x.setLineDash([8,6]);x.beginPath();x.moveTo(P,y+12);x.lineTo(W-P,y+12);x.stroke()}y+=28}
   else if(r.t==="kv"){F(19,700);const ls=wrap(r.b,W-P*2-190);if(d){F(19,400);x.fillStyle="#b5b5b5";x.fillText(r.a,P,y+20);F(19,700);x.fillStyle="#fff";x.textAlign="right";ls.forEach((l,k)=>x.fillText(l,W-P,y+20+k*26))}y+=ls.length*26+8}
   else if(r.t==="item"){F(20,600);const ls=wrap(r.a,W-P*2-150);F(16,400);const ns=r.n?wrap("Obs.: "+r.n,W-P*2-150):[];if(d){F(20,600);ls.forEach((l,k)=>x.fillText(l,P,y+20+k*27));x.textAlign="right";x.fillText(r.b,W-P,y+20);x.textAlign="left";F(16,400);x.fillStyle="#9a9a9a";ns.forEach((l,k)=>x.fillText(l,P,y+20+ls.length*27+k*22))}y+=ls.length*27+ns.length*22+12}
   else if(r.t==="tot"){F(26,800);if(d){x.fillText(r.a,P,y+36);x.textAlign="right";x.fillText(r.b,W-P,y+36)}y+=52}
   else if(r.t==="txt"){F(15,400);const ls=wrap(r.a,W-P*2);if(d){x.fillStyle="#9a9a9a";x.textAlign="center";ls.forEach((l,k)=>x.fillText(l,W/2,y+16+k*22))}y+=ls.length*22+8}}
  return y};
 const h=pass(false);c.width=W;c.height=h+P;pass(true);return c.toDataURL("image/png")}
function drawReceipt(o){view="rc";$("#dTitle").textContent="Comprovante";
 const e=s=>esc(s||"");
 const h=rcRows(o).map(r=>({title:`<img class="lg" src="${IMG["01"]}" alt=""><h3>${e(r.a)}</h3>`,sub:`<small>${e(r.a)}</small>`,sep:"<hr>",kv:`<div class="rk"><span>${e(r.a)}</span><b>${e(r.b)}</b></div>`,item:`<div class="rk"><span>${e(r.a)}${r.n?`<em>Obs.: ${e(r.n)}</em>`:""}</span><b>${e(r.b)}</b></div>`,tot:`<div class="rk tt"><b>${e(r.a)}</b><b>${e(r.b)}</b></div>`,txt:`<div class="tx">${e(r.a)}</div>`}[r.t])).join("");
 $("#dBody").innerHTML=`<div id="rc">${wmHTML(.55)}<div class="rcc">${h}</div></div>`;
 $("#dFoot").innerHTML=`<div class="ra"><button class="btn p" id="rs">Salvar imagem</button><button class="btn g" id="rsh">Compartilhar</button><button class="btn g" id="rp">Imprimir / PDF</button>${co.no===o.no?'<button class="btn g" id="rw">Reenviar no WhatsApp</button>':'<button class="btn g" id="rr">Repetir este pedido</button>'}<button class="btn g w" id="rn">Novo pedido</button></div>`;
 $("#rs").onclick=async()=>{const u=await rcImg(o),a=document.createElement("a");a.href=u;a.download="comprovante-"+o.no+".png";document.body.appendChild(a);a.click();a.remove();toast("Comprovante salvo")};
 $("#rsh").onclick=async()=>{try{const b=await (await fetch(await rcImg(o))).blob(),f=new File([b],"comprovante-"+o.no+".png",{type:"image/png"});if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],title:"Pedido "+o.no});else $("#rs").click()}catch(err){}};
 $("#rp").onclick=()=>window.print();
 const rr=$("#rr");if(rr)rr.onclick=()=>{o.items.forEach(i=>{const p=CONFIG.produtos.find(x=>x.nome===i.nome);if(p)add(p.id,i.qty,i.note)});drawCart()};const rw=$("#rw");if(rw)rw.onclick=()=>window.open(waURL(buildMsg()),"_blank");
 $("#rn").onclick=()=>{try{localStorage.removeItem("bb_order_attempt")}catch(e){}cart=[];co={};save();upd();closeAll()}}
const BB_PAY="https://painel-de-gestao-alak.vercel.app/api/pagbank";
let bbOnlinePix=false,bbPixTimer;
fetch(BB_PAY).then(r=>r.json()).then(d=>{bbOnlinePix=d.enabled===true}).catch(()=>{});
function showPixPayment(payment){
 clearTimeout(bbPixTimer);view="pix";$("#dTitle").textContent="Pagamento Pix";
 const paid=payment.status==="paid",expired=["expired","failed","refunded","review"].includes(payment.status)||Date.parse(payment.expires)<Date.now();
 $("#dBody").innerHTML=`<div class="note">Pedido ${esc(co.no)} · ${money(payment.total)}</div>`+(paid?'<h3>Pagamento confirmado!</h3><p>Seu pagamento foi recebido. O pedido já está no painel da Black Burguer.</p>':expired?'<h3>Pagamento encerrado</h3><p>Consulte a Black Burguer antes de tentar novamente. Se você já pagou, aguarde a confirmação.</p>':`<p>Escaneie o QR Code ou copie o código para pagar no aplicativo do seu banco.</p><img src="${esc(payment.image)}" alt="QR Code Pix PagBank" style="display:block;width:240px;max-width:100%;margin:12px auto;background:white"><div class="fld"><label>Pix Copia e Cola</label><textarea readonly id="pixCode" rows="4">${esc(payment.qr)}</textarea></div><button class="btn p" id="copyPix">Copiar código Pix</button><p>Válido até ${new Date(payment.expires).toLocaleTimeString("pt-BR")}.</p><p>Aguardando a confirmação do PagBank…</p>`)+"<div class=err id=err></div>";
 $("#dFoot").innerHTML=`<button class="btn ${paid?"p":"g"} w" id="pixWpp">${paid?"Enviar pedido pago no WhatsApp":"Falar com a Black Burguer"}</button>`;
 $("#pixWpp").onclick=()=>{if(paid)co.paymentConfirmed=true;window.open(waURL(buildMsg()),"_blank","noopener")};
 const copy=$("#copyPix");if(copy)copy.onclick=async()=>{try{await navigator.clipboard.writeText(payment.qr);toast("Código Pix copiado")}catch{const input=$("#pixCode");input.focus();input.select();toast("Selecione e copie o código acima")}};
 if(!paid&&!expired)bbPixTimer=setTimeout(checkPixPayment,12000);
}
async function checkPixPayment(){
 if(view!=="pix")return;
 try{const response=await fetch(BB_PAY,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"status",request_key:co.integrationKey}),signal:AbortSignal.timeout(15000)});const data=await response.json();if(!response.ok)throw Error(data.error);showPixPayment(data)}
 catch{if(view==="pix"){$("#err").textContent="Estamos aguardando a confirmação. Se você já pagou, não pague novamente.";bbPixTimer=setTimeout(checkPixPayment,15000)}}
}
let bbSending=false;
async function send(){
 if(bbSending)return;
 bbSending=true;
 const button=$("#nx");if(button){button.disabled=true;button.textContent="Registrando pedido…"}
 const w=window.open("about:blank","_blank");if(w)w.opener=null;
 try{
  const payload={items:cart.map(i=>({id:i.id,quantity:i.qty})),customer:{name:val("nome"),phone:val("tel"),address:snap().end,notes:val("obs")+cart.filter(i=>i.note).map(i=>"\n"+P(i.id).nome+": "+i.note).join("")},payment_method:({"Pix":"pix","Dinheiro":"cash","Cartão de crédito":"credit","Cartão de débito":"debit"})[co.pag],fulfillment:co.tipo,expected_total:Number(total().toFixed(2))};
  const fingerprint=JSON.stringify(payload);
  let attempt;try{attempt=JSON.parse(localStorage.getItem("bb_order_attempt")||"null")}catch(e){}
  if(!attempt||attempt.fingerprint!==fingerprint)attempt={fingerprint,key:crypto.randomUUID()};
  try{localStorage.setItem("bb_order_attempt",JSON.stringify(attempt))}catch(e){}
  co.integrationKey=attempt.key;
  const response=await fetch(BB_API+"/rest/v1/rpc/submit_black_burguer_order",{method:"POST",headers:{apikey:BB_KEY,"Content-Type":"application/json"},body:JSON.stringify({request_key:co.integrationKey,...payload}),signal:AbortSignal.timeout(15000)});
  const result=await response.json();
  if(!response.ok)throw Error(result.message||"Não foi possível registrar o pedido. Tente novamente.");
  co.no="BB-"+result.id.slice(0,8).toUpperCase();
  if(co.pag==="Pix"&&bbOnlinePix){
   if(w)w.close();
   const payResponse=await fetch(BB_PAY,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"create",request_key:co.integrationKey,email:val("emailPix"),tax_id:val("cpfPix")}),signal:AbortSignal.timeout(20000)});
   const payment=await payResponse.json();if(!payResponse.ok)throw Error(payment.error||"Não foi possível gerar o Pix.");
   showPixPayment(payment);return;
  }
  const url=waURL(buildMsg());if(w)w.location.replace(url);else location.href=url;
  const o=snap();o.integrationId=result.id;
  try{localStorage.setItem("bb_last",JSON.stringify(o));localStorage.setItem("bb_cust",JSON.stringify({nome:val("nome"),tel:val("tel"),rua:val("rua"),num:val("num"),bairro:val("bairro"),comp:val("comp"),ref:val("ref")}))}catch(e){}
  drawReceipt(o);toast("Pedido registrado. Confirme o envio no WhatsApp");
 }catch(e){
  if(w)w.close();
  const error=$("#err");if(error)error.textContent=e.name==="TimeoutError"?"A conexão demorou. Tente novamente; seu pedido não será duplicado.":e.message||"Falha de conexão. Tente novamente.";
  if(button){button.disabled=false;button.textContent="Enviar pelo WhatsApp"}
 }finally{bbSending=false}
}
