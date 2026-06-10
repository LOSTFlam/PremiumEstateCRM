import{b as p,j as t,N as n}from"./index-_mroBopA.js";import{a as e}from"./vendor-charts-8I5hyNb7.js";import{b as d}from"./catalogService-Bz1ttVKV.js";import"./vendor-pdf-COc-5hyG.js";import"./vendor-excel-CYTHuRCp.js";import"./catalogData-D0LRT1D4.js";function j(){const{slug:s}=p(),[o,u]=e.useState(null),[l,i]=e.useState(!0),[f,a]=e.useState(!1);return e.useEffect(()=>{(async()=>{i(!0);try{const r=await d(s);r?u(r._id):a(!0)}catch{a(!0)}finally{i(!1)}})()},[s]),l?t.jsxs("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",background:"#111827"},children:[t.jsx("div",{style:{width:"48px",height:"48px",border:"4px solid rgba(212, 175, 55, 0.3)",borderTop:"4px solid #D4AF37",borderRadius:"50%",animation:"spin 1s linear infinite"}}),t.jsx("style",{children:`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `})]}):f||!o?t.jsx(n,{to:"/offers",replace:!0}):t.jsx(n,{to:`/offers/${o}`,replace:!0})}export{j as default};
