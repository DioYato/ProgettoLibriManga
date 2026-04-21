import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./shared/layout/navbar/navbar";
import { Footer } from './shared/layout/footer/footer';
import { MiniChatbotComponent } from './mini-chatbot/mini-chatbot';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, MiniChatbotComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
