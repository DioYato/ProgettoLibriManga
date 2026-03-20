import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor() {}

  // Questo metodo lo riempiremo quando il backend sarà pronto
  getAll() {
    console.log('BookService: pronto per collegarsi al backend');
  }
}
