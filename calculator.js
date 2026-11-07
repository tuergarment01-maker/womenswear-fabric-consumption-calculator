(function (global) {
  'use strict';
  const bases = { crop: .75, blouse: 1.35, mini: 1.30, midi: 1.85, maxi: 2.30, blazer: 1.75, trousers: 1.65, skirt: 1.40 };
  const editableBases = ['skirt', 'blazer'];
  const liningStyles = ['mini', 'midi', 'maxi', 'blouse', 'skirt', 'blazer'];
  const silhouettes = { slim: 1, aline: 1.22, full: 1.60 };
  const widthFactors = { 114: 1.32, 140: 1, 150: .95 };
  const patternLosses = { solid: 0, directional: .10, plaid: .15 };
  const buffers = { linen: .07, blend: .06, viscose: .06, cotton: .035, denim: .06, stretchDenim: .09 };
  const knitBases = { tank: 190, pullover: 340, oversized: 480, dress: 520 };
  const gaugeFactors = { 3: 1.38, 5: 1.38, 7: 1, 9: 1, 12: .75, 14: .75, 16: .75 };
  const stitchFactors = { jersey: 1, milano: 1.18, cable: 1.28 };
  const yarnLoss = .07;
  function calculate(v) {
    const knit = v.style === 'knit';
    if (knit ? v.fabric !== 'yarn' : !Object.hasOwn(bases, v.style) || !Object.hasOwn(buffers, v.fabric)) throw Error('Choose a compatible style and material.');
    if (!Number.isInteger(v.colours) || v.colours < 1 || v.colours > 20 || v.quantities.length !== v.colours) throw Error('Enter 1–20 colours.');
    const minimum = v.colours === 1 ? 200 : 150;
    if (v.quantities.some(q => !Number.isInteger(q) || q < minimum || q > 1000000)) throw Error('Each colour needs at least ' + minimum + ' whole pieces (maximum 1,000,000).');
    if (!Number.isInteger(v.sizes) || v.sizes < 1 || v.sizes > 4) throw Error('Choose up to four sizes.');
    if (!Number.isFinite(v.price) || v.price < 0 || v.price > 1000000) throw Error('Enter a valid non-negative material price.');
    if (knit ? !Object.hasOwn(gaugeFactors, v.gauge) : !Object.hasOwn(widthFactors, v.width)) throw Error('Choose a listed width or gauge.');
    const grading = v.distribution === undefined || v.distribution === 'regular' ? 1 : v.distribution === 'extended' ? 1.11 : NaN;
    if (!Number.isFinite(grading)) throw Error('Choose a valid size distribution.');
    const shellBase = editableBases.includes(v.style) ? (v.customBase ?? bases[v.style]) : bases[v.style];
    if (!knit && (!Number.isFinite(shellBase) || shellBase <= 0 || shellBase > 20)) throw Error('Enter shell consumption at 142 cm usable width (greater than 0, up to 20 m).');
    const supportsLining = liningStyles.includes(v.style);
    if (v.lining && !supportsLining) throw Error('Lining is available for dresses, blouses, skirts and blazers.');
    if (v.lining && (!['full','half'].includes(v.liningMode) || ![114,140,150].includes(v.liningWidth))) throw Error('Choose lining coverage and usable width.');
    const interfacingPer = v.interfacingPer === undefined ? 0 : v.interfacingPer;
    if (!Number.isFinite(interfacingPer) || interfacingPer < 0 || interfacingPer > 20) throw Error('Enter interfacing metres per piece between 0 and 20.');
    let baseline, net, per, factors;
    if (knit) {
      const knitStyle = v.knitStyle ?? 'pullover', stitch = v.stitch ?? 'jersey';
      if (!Object.hasOwn(knitBases, knitStyle) || !Object.hasOwn(stitchFactors, stitch)) throw Error('Choose a listed knitwear style and stitch structure.');
      baseline = knitBases[knitStyle];
      factors = { gauge: gaugeFactors[v.gauge], stitch: stitchFactors[stitch], yarnLoss };
      net = baseline * factors.gauge * factors.stitch * grading;
      per = net * (1 + yarnLoss);
    } else {
      const silhouette = v.silhouette ?? 'slim', pattern = v.pattern ?? 'solid';
      if (!Object.hasOwn(silhouettes, silhouette) || !Object.hasOwn(patternLosses, pattern)) throw Error('Choose a listed silhouette and pattern allowance.');
      baseline = shellBase;
      factors = { silhouette: silhouettes[silhouette], width: widthFactors[v.width], pattern: patternLosses[pattern], cutting: buffers[v.fabric] };
      net = baseline * factors.silhouette * factors.width * grading;
      per = net * (1 + factors.pattern + factors.cutting);
    }
    const quantity = v.quantities.reduce((a,b) => a+b,0);
    const liningPer = v.lining ? shellBase * 145 / v.liningWidth * grading * (v.liningMode==='full'?1:.5) * 1.04 : 0;
    return { knit, minimum, baseline, net, per, factors, quantity, total: per*quantity, yards: knit ? null : per/0.9144, totalYards: knit ? null : per*quantity/0.9144, cost: per*quantity*v.price/(knit?1000:1), grading, liningPer, liningTotal:liningPer*quantity, interfacingTotal:interfacingPer*quantity, combinedTotal:knit?null:(per+liningPer+interfacingPer)*quantity };
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {calculate};
  if (!global.document) return;
  document.querySelectorAll('.tuer-calc').forEach(root => {
    const $ = s => root.querySelector(s), form = $('form'), rows = $('[data-colours]'), output = $('[data-output]'), error = $('[data-error]'), cta = $('[data-quote]');
    const num = n => n.toLocaleString('en-US', {minimumFractionDigits:2,maximumFractionDigits:2});
    const percentage = rate => (rate * 100).toLocaleString('en-US', {maximumFractionDigits:1}) + '%';
    const multiplier = n => n.toFixed(2) + '×';
    const selected = name => form.elements[name].selectedOptions[0].textContent;
    const piece = (value, knit) => num(value) + (knit ? ' g' : ' m');
    function breakdown(r) {
      const f = r.factors;
      const items = r.knit
        ? ['Gauge ' + multiplier(f.gauge), 'stitch ' + multiplier(f.stitch), 'yarn loss +' + percentage(f.yarnLoss)]
        : ['Silhouette ' + multiplier(f.silhouette), 'width ' + multiplier(f.width), 'pattern +' + percentage(f.pattern), 'shrinkage / cutting +' + percentage(f.cutting)];
      return [...items, 'grading ' + multiplier(r.grading)].join(' · ');
    }
    let previous = 'mini', latest = null;
    function syncRows() {
      const count = Number(form.elements.colours.value);
      if (!Number.isInteger(count) || count<1 || count>20) return;
      const old = Array.from(rows.querySelectorAll('input')).map(e=>e.value), min = count===1?200:150;
      rows.replaceChildren();
      for(let i=0;i<count;i++) { const label=document.createElement('label'), input=document.createElement('input'); label.textContent='Colour '+(i+1)+' quantity'; input.type='number'; input.min=min; input.max=1000000; input.step=1; input.required=true; input.value=old[i]??min; input.name='qty'+i; label.append(input); rows.append(label); }
    }
    function update() {
      const knit = form.elements.style.value==='knit', material=form.elements.fabric;
      if (form.elements.style.value!==previous) {
        if (knit || previous === 'knit') material.value=knit?'yarn':'linen';
        previous=form.elements.style.value;
        if (editableBases.includes(previous)) form.elements.customBase.value=bases[previous];
      }
      Array.from(material.options).forEach(o=>o.disabled=knit ? o.value!=='yarn' : o.value==='yarn');
      $('[data-woven-options]').hidden=knit;
      $('[data-knit-options]').hidden=!knit;
      $('[data-price-label]').textContent=knit?'Yarn price (USD / kg, optional)':'Fabric price (USD / metre, optional)';
      const liningAllowed=liningStyles.includes(form.elements.style.value);
      $('[data-custom-base]').hidden=!editableBases.includes(form.elements.style.value);
      $('[data-lining-controls]').hidden=!liningAllowed;
      if(!liningAllowed)form.elements.lining.checked=false;
      $('[data-lining-options]').hidden=!form.elements.lining.checked;
      const liningMaterial=form.elements.style.value==='blazer'?'Poly/Viscose twill':'100% Cotton Voile';
      $('[data-lining-material]').textContent=liningMaterial+' (planning default; confirm suitability).';
      try {
        const v={style:form.elements.style.value,fabric:material.value,width:+form.elements.width.value,gauge:+form.elements.gauge.value,colours:+form.elements.colours.value,sizes:+form.elements.sizes.value,quantities:Array.from(rows.querySelectorAll('input')).map(e=>e.value===''?NaN:+e.value),price:form.elements.price.value===''?0:+form.elements.price.value};
        Object.assign(v,{distribution:form.elements.distribution.value,customBase:form.elements.customBase.value === '' ? undefined : +form.elements.customBase.value,lining:form.elements.lining.checked,liningMode:form.elements.liningMode.value,liningWidth:+form.elements.liningWidth.value,interfacingPer:+form.elements.interfacing.value});
        for (const name of ['silhouette','pattern','knitStyle','stitch']) v[name]=form.elements[name].value;
        const r=calculate(v); error.textContent=''; output.hidden=false; cta.hidden=false;
        latest={v,r,liningMaterial}; $('[data-print]').disabled=false;
        $('[data-baseline]').textContent=piece(r.baseline,knit);
        $('[data-net]').textContent=piece(r.net,knit);
        $('[data-breakdown]').textContent=breakdown(r);
        $('[data-per]').textContent=knit?num(r.per)+' g':num(r.per)+' m / '+num(r.yards)+' yd';
        $('[data-total]').textContent=knit?num(r.total/1000)+' kg':num(r.total)+' m / '+num(r.totalYards)+' yd';
        $('[data-order]').textContent=r.quantity+' pieces · '+v.colours+' colour(s) · '+v.sizes+' size(s) · '+r.grading.toFixed(2)+'x grading';
        $('[data-lining-result]').textContent=num(r.liningPer)+' m / piece · '+num(r.liningTotal)+' m bulk';
        $('[data-interfacing-result]').textContent=num(v.interfacingPer)+' m / piece · '+num(r.interfacingTotal)+' m bulk';
        $('[data-combined]').textContent=knit?'Yarn and interfacing use different units; order separately.':num(r.combinedTotal)+' m combined procurement (different materials/widths; order separately).';
        $('[data-cost]').textContent=form.elements.price.value===''?'Add your shell / yarn price to estimate cost.':'USD '+num(r.cost)+' shell / yarn only (USD '+num(r.cost/r.quantity)+' / piece); lining and interfacing excluded.';
        const url=new URL(root.dataset.contact||'https://tuergarment.com/contact-us/');
        const summary=[selected(knit?'knitStyle':'style'),material.selectedOptions[0].textContent,selected(knit?'gauge':'width'),breakdown(r),v.quantities.join(' + ')+' pcs by colour',v.sizes+' sizes',knit?num(r.per)+'g/pc':num(r.per)+'m/pc',knit?num(r.total/1000)+'kg total':num(r.total)+'m total',form.elements.price.value===''?'Material price not supplied':'USD '+v.price+(knit?'/kg':'/m')+'; material cost USD '+num(r.cost)].join('; ');
        url.search=new URLSearchParams({source:'fabric-calculator',style:v.style,fabric:v.fabric,width_cm:knit?'':v.width,gauge:knit?v.gauge:'',quantities:v.quantities.join(','),sizes:v.sizes,distribution:v.distribution,lining:v.lining?v.liningMode:'none',lining_material:v.lining?liningMaterial:'none',lining_width:v.lining?v.liningWidth:'',lining_bulk_m:r.liningTotal,interfacing_bulk_m:r.interfacingTotal,material_price_usd:form.elements.price.value,calculation:summary}).toString(); cta.href=url.href;
      } catch(e) { latest=null; $('[data-print]').disabled=true; error.textContent=e.message; output.hidden=true; cta.hidden=true; cta.removeAttribute('href'); }
    }
    form.addEventListener('submit',e=>e.preventDefault());
    form.addEventListener('input', e=>{if(e.target.name==='colours')syncRows();update();});
    syncRows(); update();
    $('[data-print]').addEventListener('click',()=>{
      update(); if(!latest)return;
      const {v,r,liningMaterial}=latest;
      document.querySelectorAll('body > .tc-print-sheet').forEach(e=>e.remove());
      const sheet=document.createElement('section');sheet.className='tc-print-sheet';
      const heading=document.createElement('h1');heading.textContent='Guangzhou Tuer Garment Co., Ltd. – Collection Sourcing Summary';sheet.append(heading);
      const table=document.createElement('table');
      const entries=[['Prepared',new Date().toISOString().slice(0,10)],['Garment style',selected(r.knit?'knitStyle':'style')],['Shell material',materialText()],['Shell width / gauge',selected(r.knit?'gauge':'width')],['Construction',r.knit?selected('stitch'):selected('silhouette')+' · '+selected('pattern')],['Base net consumption',piece(r.baseline,r.knit)],['Adjusted net before losses',piece(r.net,r.knit)],['Allowances breakdown',breakdown(r)],['Size range distribution',selected('distribution')],['Size breakdown',v.sizes+' sizes included; quantities by size to be confirmed'],['Colour breakdown',v.quantities.map((q,i)=>'Colour '+(i+1)+': '+q+' pcs').join('; ')],['Order quantity',r.quantity+' pieces'],['Gross per piece / bulk',r.knit?num(r.per)+' g / '+num(r.total/1000)+' kg':num(r.per)+' m / '+num(r.total)+' m ('+num(r.totalYards)+' yd bulk)'],['Lining',v.lining?liningMaterial+'; '+v.liningMode+'; '+v.liningWidth+' cm; 4% buffer; '+num(r.liningPer)+' m/pc / '+num(r.liningTotal)+' m bulk':'Not included'],['Interfacing',num(v.interfacingPer)+' m/pc / '+num(r.interfacingTotal)+' m bulk (user input; width/specification to confirm)'],['Bulk total',r.knit?'Yarn '+num(r.total/1000)+' kg; interfacing '+num(r.interfacingTotal)+' m':num(r.combinedTotal)+' m combined; shell/lining/interfacing ordered separately'],['Sampling turnaround','5–10 working days'],['MOQ','150 pcs/colour (2+ colours) or 200 pcs (1 colour), per style; up to four sizes'],['Sample fee','3x estimated finished unit price for new clients, 100% refunded upon bulk order'],['Bulk schedule','First bulk 30–45; repeats 15–30 working days after approvals and material readiness']];
      for(const [key,value] of entries){const tr=document.createElement('tr'),th=document.createElement('th'),td=document.createElement('td');th.textContent=key;td.textContent=value;tr.append(th,td);table.append(tr);}sheet.append(table);
      const note=document.createElement('p');note.textContent='Planning brief, not a CAD marker, purchase order or factory quote. Full lining uses 100% and half lining 50% of width-adjusted base shell, plus its own 4% allowance. Actual panels, fabric suitability, grading and shrinkage require sample approval. Lining/interfacing prices are excluded from shell material cost.';sheet.append(note);
      const contact=document.createElement('p'),email=document.createElement('a'),website=document.createElement('a');email.href='mailto:sales@tuergarment.com';email.textContent='sales@tuergarment.com';website.href='https://tuergarment.com/';website.textContent='https://tuergarment.com/';contact.append(email,document.createTextNode(' | '),website);sheet.append(contact);
      document.body.append(sheet);document.body.classList.add('tc-printing');window.print();
    });
    function materialText(){return form.elements.fabric.selectedOptions[0].textContent;}
    window.addEventListener('afterprint',()=>document.body.classList.remove('tc-printing'));
    const embed=$('[data-embed]'); embed.value='<iframe src="https://tuergarment.com/fabric-consumption-moq-calculator/?tuer_embed=1" title="TUER Womenswear Fabric Consumption & MOQ Calculator" width="100%" height="1600" style="border:0;" loading="lazy" allow="clipboard-write"></iframe>\n<p style="font-size:12px;">Calculator provided by <a href="https://tuergarment.com/" target="_blank" rel="dofollow">Guangzhou Tuer Garment Co., Ltd. – Custom Womenswear Manufacturer (150-200 MOQ)</a></p>';
    $('[data-copy]').addEventListener('click',async()=>{try {await navigator.clipboard.writeText(embed.value);$('[data-copy-status]').textContent='Embed code copied.';}catch{embed.focus();embed.select();$('[data-copy-status]').textContent='Select and copy the code with Ctrl+C or your device copy menu.';}});
  });
})(typeof window !== 'undefined' ? window : globalThis);
