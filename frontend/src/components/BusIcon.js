import L from "leaflet";

const BUS_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="36" height="36">
  <path fill="rgb(255, 212, 59)" d="M192 64C139 64 96 107 96 160L96 448C96 477.8 116.4 502.9 144 510L144 544C144 561.7 158.3 576 176 576L192 576C209.7 576 224 561.7 224 544L224 512L416 512L416 544C416 561.7 430.3 576 448 576L464 576C481.7 576 496 561.7 496 544L496 510C523.6 502.9 544 477.8 544 448L544 160C544 107 501 64 448 64L192 64zM160 240C160 222.3 174.3 208 192 208L296 208L296 320L192 320C174.3 320 160 305.7 160 288L160 240zM344 320L344 208L448 208C465.7 208 480 222.3 480 240L480 288C480 305.7 465.7 320 448 320L344 320zM192 384C209.7 384 224 398.3 224 416C224 433.7 209.7 448 192 448C174.3 448 160 433.7 160 416C160 398.3 174.3 384 192 384zM448 384C465.7 384 480 398.3 480 416C480 433.7 465.7 448 448 448C430.3 448 416 433.7 416 416C416 398.3 430.3 384 448 384zM248 136C248 122.7 258.7 112 272 112L368 112C381.3 112 392 122.7 392 136C392 149.3 381.3 160 368 160L272 160C258.7 160 248 149.3 248 136z"/>
</svg>`;

export const busIcon = new L.DivIcon({
  html: `<div style="filter:drop-shadow(0 2px 6px rgba(0,0,0,0.3))">${BUS_SVG}</div>`,
  className: "bus-marker",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const STOP_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="18" height="18">
  <rect x="3" y="3" width="14" height="14" rx="2" fill="#F97316" stroke="#EA580C" stroke-width="1" transform="rotate(45 10 10)"/>
</svg>`;

export const stopIcon = new L.DivIcon({
  html: STOP_SVG,
  className: "stop-marker",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export const userIcon = new L.DivIcon({
  html: `<div style="width:16px;height:16px;background:#3B82F6;border:3px solid white;border-radius:50%;box-shadow:0 0 10px rgba(59,130,246,0.5);"></div>`,
  className: "user-marker",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});
