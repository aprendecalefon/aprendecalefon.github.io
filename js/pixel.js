// Pixel de Meta: registra visitas y compras para optimizar los anuncios
(function(){
  var PIXEL_ID = "2907159546309806";   // número del pixel (Administrador de eventos de Meta)
  window.trk = function(){};
  if(!/^\d+$/.test(PIXEL_ID)) return;    // sin ID no se carga nada
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', PIXEL_ID); fbq('track', 'PageView');
  window.trk = function(ev, params, eventID){ try{ fbq('track', ev, params||{}, eventID?{eventID:eventID}:undefined); }catch(e){} };
})();
