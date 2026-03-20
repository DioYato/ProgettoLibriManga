import { Injectable, computed, signal } from '@angular/core';

export type ProductFormat = {
  label: string;
  price: number;
};

export type Product = {
  /**
   * Identificatore stabile usato dal routing (`/products/:id`).
   *
   * Quando il backend sarà disponibile, questo deve corrispondere a un identificatore univoco
   * restituito dall’API (es. slug o UUID).
   */
  id: string;
  name: string;
  author: string;
  price: number;
  availableNow: boolean;
  img: string;
  description: string;
  details?: string[];
  formats?: ProductFormat[];
};

@Injectable({ providedIn: 'root' })
export class ProductsService {
  /**
   * Catalogo mock in memoria.
   *
   * Migrazione backend:
   * - Sostituisci questo `signal` con una chiamata async (es. HttpClient GET `/api/products`)
   * - Popola uno stato (signal/store) quando la richiesta termina
   * - Mantieni `id` stabile perché viene usato dalla rotta del dettaglio prodotto
   */
  private readonly items = signal<Product[]>([
    {
      id: 'il-signore-degli-anelli',
      name: 'Il Signore degli Anelli',
      author: 'J.R.R. Tolkien',
      price: 24.9,
      availableNow: true,
      img: 'IlSignoreDegliAnelli.jpg',
      description:
        'Un grande classico fantasy: un viaggio epico nella Terra di Mezzo tra amicizia, coraggio e destino.',
      details: ['Categoria: Libro', 'Lingua: Italiano', 'Editore: Mock Editore', 'EAN: 0000000000000'],
      formats: [
        { label: 'Brossura', price: 24.9 },
        { label: 'Copertina rigida', price: 29.9 },
      ],
    },
    {
      id: '1984',
      name: '1984',
      author: 'George Orwell',
      price: 14.5,
      availableNow: true,
      img: 'GeorgeOrwell.jpg',
      description:
        'Un romanzo distopico senza tempo sul controllo, la sorveglianza e la libertà individuale.',
      details: ['Categoria: Libro', 'Lingua: Italiano', 'Editore: Mock Editore', 'EAN: 0000000000001'],
      formats: [
        { label: 'Brossura', price: 14.5 },
        { label: 'eBook', price: 7.99 },
      ],
    },
    {
      id: 'il-nome-della-rosa',
      name: 'Il Nome della Rosa',
      author: 'Umberto Eco',
      price: 18.0,
      availableNow: true,
      img: 'https://picsum.photos/600/800?book3',
      description:
        'Un giallo storico in un’abbazia medievale, tra misteri, libri proibiti e deduzione.',
      details: ['Categoria: Libro', 'Lingua: Italiano', 'Editore: Mock Editore', 'EAN: 0000000000002'],
      formats: [{ label: 'Brossura', price: 18.0 }],
    },
    {
      id: 'dune',
      name: 'Dune',
      author: 'Frank Herbert',
      price: 22.99,
      availableNow: true,
      img: 'https://picsum.photos/600/800?book4',
      description:
        'Politica, religione e sopravvivenza su Arrakis: il pianeta deserto che decide il destino dell’Impero.',
      details: ['Categoria: Libro', 'Lingua: Italiano', 'Editore: Mock Editore', 'EAN: 0000000000003'],
      formats: [{ label: 'Brossura', price: 22.99 }],
    },
    {
      id: 'harry-potter-1',
      name: 'Harry Potter e la Pietra Filosofale',
      author: 'J.K. Rowling',
      price: 12.99,
      availableNow: true,
      img: 'https://picsum.photos/600/800?book5',
      description:
        'Il primo capitolo della saga: Hogwarts, magia, amicizia e la scoperta di un mondo straordinario.',
      details: ['Categoria: Libro', 'Lingua: Italiano', 'Editore: Mock Editore', 'EAN: 0000000000004'],
      formats: [{ label: 'Brossura', price: 12.99 }],
    },
    {
      id: 'sapiens',
      name: 'Sapiens',
      author: 'Yuval Noah Harari',
      price: 19.9,
      availableNow: true,
      img: 'https://picsum.photos/600/800?book6',
      description:
        'Un viaggio nella storia dell’umanità: dalle origini a oggi, tra rivoluzioni cognitive e culturali.',
      details: ['Categoria: Saggio', 'Lingua: Italiano', 'Editore: Mock Editore', 'EAN: 0000000000005'],
      formats: [{ label: 'Brossura', price: 19.9 }],
    },
    {
      id: 'il-codice-da-vinci',
      name: 'Il Codice Da Vinci',
      author: 'Dan Brown',
      price: 16.5,
      availableNow: true,
      img: 'https://picsum.photos/600/800?book7',
      description:
        'Un thriller tra simboli, arte e segreti: una caccia che attraversa l’Europa.',
      details: ['Categoria: Thriller', 'Lingua: Italiano', 'Editore: Mock Editore', 'EAN: 0000000000006'],
      formats: [{ label: 'Brossura', price: 16.5 }],
    },
    {
      id: 'la-strada',
      name: 'La Strada',
      author: 'Cormac McCarthy',
      price: 13.4,
      availableNow: true,
      img: 'https://picsum.photos/600/800?book8',
      description: 'Un padre e un figlio in un mondo post-apocalittico: amore, paura e speranza.',
      details: ['Categoria: Romanzo', 'Lingua: Italiano', 'Editore: Mock Editore', 'EAN: 0000000000007'],
      formats: [{ label: 'Brossura', price: 13.4 }],
    },
    {
      id: 'one-piece-1',
      name: 'One Piece Vol. 1',
      author: 'Eiichiro Oda',
      price: 5.2,
      availableNow: true,
      img: 'OnePiece.jpg',
      description: 'L’inizio dell’avventura di Rufy: pirati, sogni e la ricerca del leggendario tesoro.',
      details: ['Categoria: Manga', 'Lingua: Italiano', 'Editore: Mock Editore', 'EAN: 0000000000008'],
      formats: [{ label: 'Tankōbon', price: 5.2 }],
    },
    {
      id: 'berserk-1',
      name: 'Berserk Vol. 1',
      author: 'Kentaro Miura',
      price: 6.9,
      availableNow: true,
      img: 'https://picsum.photos/600/800?manga2',
      description: 'Dark fantasy potente e drammatica: la storia di Gatsu tra guerra, vendetta e destino.',
      details: ['Categoria: Manga', 'Lingua: Italiano', 'Editore: Mock Editore', 'EAN: 0000000000009'],
      formats: [{ label: 'Tankōbon', price: 6.9 }],
    },
    {
      id: 'tokyo-ghoul-1',
      name: 'Tokyo Ghoul Vol. 1',
      author: 'Sui Ishida',
      price: 5.9,
      availableNow: true,
      img: 'https://picsum.photos/600/800?manga3',
      description:
        'Ken Kaneki scopre un mondo oscuro: ghoul, identità e sopravvivenza in una Tokyo inquietante.',
      details: ['Categoria: Manga', 'Lingua: Italiano', 'Editore: Mock Editore', 'EAN: 0000000000010'],
      formats: [{ label: 'Tankōbon', price: 5.9 }],
    },
    {
      id: 'death-note-1',
      name: 'Death Note Vol. 1',
      author: 'Tsugumi Ohba',
      price: 5.9,
      availableNow: true,
      img: 'https://picsum.photos/600/800?manga4',
      description:
        'Un quaderno che uccide: Light, Ryuk e una sfida mentale che mette in gioco giustizia e potere.',
      details: ['Categoria: Manga', 'Lingua: Italiano', 'Editore: Mock Editore', 'EAN: 0000000000011'],
      formats: [{ label: 'Tankōbon', price: 5.9 }],
    },
  ]);

  /**
   * Vista in sola lettura per i componenti.
   * Tenerla come `computed` permette di cambiare in futuro l’implementazione (async / stateful)
   * senza dover modificare i componenti.
   */
  readonly all = computed(() => this.items());

  /**
   * Lookup usato dalla pagina dettaglio prodotto.
   *
   * Migrazione backend:
   * - Opzione A (semplice): fetch per id (GET `/api/products/:id`) e cache dei risultati
   * - Opzione B (catalogo): fetch del catalogo una volta e lookup locale come ora
   */
  getById(id: string | null | undefined) {
    const safeId = (id ?? '').trim().toLowerCase();
    return this.items().find((p) => p.id === safeId);
  }
  /**
   * Migrazione backend:
   * Quando il backend sarà disponibile, questo metodo farà una GET
   * e aggiornerà lo stato `items`.
   */
  loadFromBackend(products: Product[]) {
    this.items.set(products);
  }
}

