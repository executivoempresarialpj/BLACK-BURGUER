import {readFile,writeFile,mkdir,cp,rm} from 'node:fs/promises'
const target=new URL('./dist/',import.meta.url)
await rm(target,{recursive:true,force:true});await mkdir(target,{recursive:true})
await cp(new URL('./assets/',import.meta.url),new URL('./assets/',target),{recursive:true})
await cp(new URL('./admin.html',import.meta.url),new URL('./admin.html',target))
const checkout=await readFile(new URL('./checkout-template.js',import.meta.url),'utf8')
for(const name of ['index.html','blackburguer.html']){
 const original=await readFile(new URL('./'+name,import.meta.url),'utf8')
 const start=original.indexOf('/* ===== checkout em etapas ===== */')
 const end=original.indexOf('/* ===== cabeçalho',start)
 if(start<0||end<start)throw Error('Checkout source markers missing: '+name)
 const oldTotal='total=()=>cart.reduce((a,i)=>a+i.qty*P(i.id).preco,0)'
 const centsTotal='total=()=>cart.reduce((cents,i)=>cents+i.qty*Math.round(Number(P(i.id).preco)*100),0)/100'
 if(!original.includes(oldTotal))throw Error('Cart total source missing: '+name)
 const html=(original.slice(0,start)+checkout+original.slice(end)).replace(oldTotal,centsTotal)
 for(const script of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))new Function(script[1])
 await writeFile(new URL('./'+name,target),html)
}
console.log('Black Burguer: media preserved, website orders checkout prepared.')
