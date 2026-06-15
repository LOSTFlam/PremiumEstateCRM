import{b as f,j as t,N as a}from"./index-DAMl824K.js";import{a as e}from"./vendor-charts-8I5hyNb7.js";import{a as d}from"./catalogService-CTlKEOlu.js";import"./vendor-pdf-BBIIHmd7.js";import"./vendor-excel-CYTHuRCp.js";import"./catalogData-BQRRUz3C.js";function j(){const{slug:r}=f(),[n,u]=e.useState(null),[l,o]=e.useState(!0),[p,i]=e.useState(!1);return e.useEffect(()=>{(async()=>{o(!0);try{const s=await d(r);s?u(s._id):i(!0)}catch{i(!0)}finally{o(!1)}})()},[r]),l?t.jsxs("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",background:"#111827"},children:[t.jsx("div",{style:{width:"48px",height:"48px",border:"4px solid rgba(212, 175, 55, 0.3)",borderTop:"4px solid #D4AF37",borderRadius:"50%",animation:"spin 1s linear infinite"}}),t.jsx("style",{children:`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `})]}):p||!n?t.jsx(a,{to:"/offers",replace:!0}):t.jsx(a,{to:`/property/${r}`,replace:!0})}export{j as default};
