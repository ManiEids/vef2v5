// skilgreiningar fyrir API gögn

export interface Category {
    id: string | number;
    name: string;
    title: string; // Titill flokks
    slug?: string;
    description?: string;
    // Hægt að bæta við fleiri eiginleikum ef þarf
  }
  