export interface FreeBook {
  id: string;
  title: string;
  author: string;
  url: string;
  genre: string;
  year: number;
  color1: string;
  color2: string;
}

export const FREE_BOOKS: FreeBook[] = [
  {
    id: 'pg-pride',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    url: 'https://www.gutenberg.org/cache/epub/1342/pg1342.txt',
    genre: 'Romance',
    year: 1813,
    color1: '#C06C84',
    color2: '#6C5B7B',
  },
  {
    id: 'pg-alice',
    title: "Alice's Adventures in Wonderland",
    author: 'Lewis Carroll',
    url: 'https://www.gutenberg.org/cache/epub/11/pg11.txt',
    genre: 'Fantasy',
    year: 1865,
    color1: '#56AB91',
    color2: '#2B6777',
  },
  {
    id: 'pg-sherlock',
    title: 'The Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    url: 'https://www.gutenberg.org/cache/epub/1661/pg1661.txt',
    genre: 'Mystery',
    year: 1892,
    color1: '#3D5A80',
    color2: '#1B263B',
  },
  {
    id: 'pg-frankenstein',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    url: 'https://www.gutenberg.org/cache/epub/84/pg84.txt',
    genre: 'Gothic',
    year: 1818,
    color1: '#5C5470',
    color2: '#2D2B42',
  },
  {
    id: 'pg-art-of-war',
    title: 'The Art of War',
    author: 'Sun Tzu',
    url: 'https://www.gutenberg.org/cache/epub/132/pg132.txt',
    genre: 'Philosophy',
    year: -500,
    color1: '#B23A48',
    color2: '#6B1D2A',
  },
  {
    id: 'pg-great-gatsby',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    url: 'https://www.gutenberg.org/cache/epub/64317/pg64317.txt',
    genre: 'Classic',
    year: 1925,
    color1: '#D4A843',
    color2: '#8B6914',
  },
  {
    id: 'pg-dracula',
    title: 'Dracula',
    author: 'Bram Stoker',
    url: 'https://www.gutenberg.org/cache/epub/345/pg345.txt',
    genre: 'Horror',
    year: 1897,
    color1: '#8B0000',
    color2: '#2D0000',
  },
  {
    id: 'pg-moby-dick',
    title: 'Moby Dick',
    author: 'Herman Melville',
    url: 'https://www.gutenberg.org/cache/epub/2701/pg2701.txt',
    genre: 'Adventure',
    year: 1851,
    color1: '#457B9D',
    color2: '#1D3557',
  },
  {
    id: 'pg-romeo',
    title: 'Romeo and Juliet',
    author: 'William Shakespeare',
    url: 'https://www.gutenberg.org/cache/epub/1513/pg1513.txt',
    genre: 'Drama',
    year: 1597,
    color1: '#E07A5F',
    color2: '#81171B',
  },
  {
    id: 'pg-time-machine',
    title: 'The Time Machine',
    author: 'H.G. Wells',
    url: 'https://www.gutenberg.org/cache/epub/35/pg35.txt',
    genre: 'Sci-Fi',
    year: 1895,
    color1: '#6D72C3',
    color2: '#2D3191',
  },
];

export const READING_QUOTES = [
  '"A reader lives a thousand lives before he dies." — George R.R. Martin',
  '"Reading is dreaming with open eyes." — Anissa Trisdianty',
  '"Books are a uniquely portable magic." — Stephen King',
  '"One more chapter before bed..." — Every reader ever',
  '"Today a reader, tomorrow a leader." — Margaret Fuller',
  '"Reading gives us someplace to go when we have to stay where we are." — Mason Cooley',
  '"So many books, so little time." — Frank Zappa',
  '"A book is a gift you can open again and again." — Garrison Keillor',
];
