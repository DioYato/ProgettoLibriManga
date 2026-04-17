import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./shared/navbar/navbar";
import { Footer } from './shared/footer/footer';
import { ChatWidget } from './chat-widget/chat-widget';





@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, ChatWidget],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
