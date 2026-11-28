import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import vm from 'node:vm'
import {randomUUID} from 'node:crypto'

test('checkout persists request keys across network retries and opens WhatsApp only after registration',async()=>{
 const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8')
 const code=html.slice(html.indexOf('let bbSending=false;'),html.indexOf('/* ===== cabeçalho',html.indexOf('let bbSending=false;')))
 const storage=new Map(),requests=[],windows=[],receipts=[],payments=[]
 let fail=true
 const button={},error={}
 const context=vm.createContext({crypto:{randomUUID},AbortSignal,JSON,Error,
  $:s=>s==='#nx'?button:error,co:{pag:'Pix',tipo:'Retirada'},cart:[{id:'burger',qty:2,note:'Sem cebola'}],
  P:()=>({nome:'Burger'}),val:k=>({nome:'Teste Cliente',tel:'79999990000',obs:''})[k]||'',snap:()=>({end:'Retirada'}),total:()=>50,
  BB_PAY:'https://payments.invalid',showPixPayment:p=>payments.push(p),bbOnlinePix:false,BB_API:'https://example.invalid',BB_KEY:'publishable',
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  window:{open:()=>{const w={closed:false,location:{replace:url=>w.url=url},close:()=>w.closed=true};windows.push(w);return w}},
  location:{},buildMsg:()=>context.co.no,waURL:msg=>'https://wa.me/?text='+msg,
  fetch:async(url,options)=>{requests.push(JSON.parse(options.body));if(fail)throw Error('Rede indisponível');return{ok:true,json:async()=>({id:'a1111111-1111-4111-8111-111111111111',total:50})}},
  drawReceipt:o=>receipts.push(o),toast:()=>{}
 })
 vm.runInContext(code,context)
 await vm.runInContext('send()',context)
 assert.equal(windows[0].closed,true)
 assert.equal(windows[0].url,undefined)
 assert.equal(receipts.length,0)
 assert.equal(button.disabled,false)
 fail=false
 await vm.runInContext('send()',context)
 assert.equal(requests[0].request_key,requests[1].request_key)
 assert.equal(requests[1].items[0].quantity,2)
 assert.equal(requests[1].expected_total,50)
 assert.equal(windows[1].url,'https://wa.me/?text=BB-A1111111')
 assert.equal(receipts.length,1)
 assert.equal(receipts[0].integrationId,'a1111111-1111-4111-8111-111111111111')
 context.bbOnlinePix=true
 context.fetch=async(url,options)=>({ok:true,json:async()=>url===context.BB_PAY?{status:'pending',qr:'pix-code',total:50}:{id:'a1111111-1111-4111-8111-111111111111',total:50}})
 await vm.runInContext('send()',context)
 assert.equal(windows[2].closed,true)
 assert.equal(windows[2].url,undefined,'online Pix must not redirect to WhatsApp before payment')
 assert.equal(payments[0].status,'pending')
 assert.equal(receipts.length,1,'unpaid Pix never generates a paid receipt')
})


test('cart sums cents for decimal prices and quantities in both published pages',async()=>{
 for(const file of ['index.html','blackburguer.html']){
  const html=await readFile(new URL('../dist/'+file,import.meta.url),'utf8')
  const expression=html.match(/total=\(\)=>cart\.reduce\([^;\n]+/)[0]
  const catalog={combo:{preco:39.99},burger:{preco:16.99},drink:{preco:0.10}}
  const ctx=vm.createContext({P:id=>catalog[id],cart:[{id:'combo',qty:1},{id:'burger',qty:1}],Math,Number})
  vm.runInContext('const '+expression,ctx)
  assert.equal(vm.runInContext('total()',ctx),56.98)
  ctx.cart=[{id:'burger',qty:3},{id:'drink',qty:3}]
  assert.equal(vm.runInContext('total()',ctx),51.27)
 }
})
