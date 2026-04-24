import { Component, signal } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-mini-chatbot',
  templateUrl: './mini-chatbot.html',
  styleUrls: ['./mini-chatbot.css']
})
export class MiniChatbotComponent {

  isOpen = signal(false);
  messages = signal<{ from: 'user' | 'bot', text: string }[]>([]);
  userMessage = signal('');

  constructor(private chatService: ChatService) {}

  toggleChat() {
    this.isOpen.update(v => !v);
  }

  sendMessage() {
    const msg = this.userMessage().trim();
    if (!msg) return;

    this.messages.update(m => [...m, { from: 'user', text: msg }]);

    this.chatService.sendMessage(msg).subscribe(res => {
      this.messages.update(m => [...m, { from: 'bot', text: res.reply }]);
    });

    this.userMessage.set('');
  }
}
