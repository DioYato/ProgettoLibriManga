import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  template: '',
})
export class ChatWidget implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) return; // <-- evita l'errore in SSR

    (window as any).$crisp = [];
    (window as any).CRISP_WEBSITE_ID = "b2ea6934-3f88-4e07-b784-3bfefbcf2859";

    const d = document;
    const s = d.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = true;
    d.getElementsByTagName("head")[0].appendChild(s);
  }
}
