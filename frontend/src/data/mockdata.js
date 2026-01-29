export const MOCK_EVENTS = {
  featured: [
    { 
      _id: 'f1', 
      title: 'The Weeknd: After Hours til Dawn', 
      description: 'Experience the global phenomenon in Sri Lanka.',
      category: 'concert', 
      basePrice: 15000, 
      rating: 4.9, 
      bannerImage: 'https://www.milanopera-tickets.com/imagini-w/1920/63480aab09a2990294a5aac2ea44806382d94.jpg', 
      posterImage: 'https://i.pinimg.com/736x/4e/78/33/4e783321523e1124619d854ce55a7304.jpg',
      venue: { name: 'Sugathadasa Stadium', city: 'Colombo' },
      metadata: { artists: ['The Weeknd', 'Kaytranada'] }
    },
    { 
      _id: 'f2', 
      title: 'Spider-Man: Across the Spider-Verse', 
      description: 'Miles Morales catapults across the Multiverse.',
      category: 'movie', 
      basePrice: 1200, 
      rating: 9.0, 
      // OPTIMIZED: Changed 'original' (4K) to 'w1280' (HD)
      bannerImage: 'https://image.tmdb.org/t/p/w1280/8mnXR9rey5uQ08rZAvzojKWbDQS.jpg', 
      posterImage: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
      venue: { name: 'PVR Cinemas', city: 'Colombo' },
      metadata: { cast: ['Shameik Moore', 'Hailee Steinfeld'], director: 'Kemp Powers' }
    },
    {
      _id: 'f3',
      title: 'LPL Finals 2026', 
      description: 'The ultimate cricket showdown.',
      category: 'sports', 
      basePrice: 2500, 
      rating: 4.5, 
      bannerImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1280', // Optimized width
      posterImage: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=600',
      venue: { name: 'R. Premadasa Stadium', city: 'Colombo' },
      metadata: { teams: { home: 'Colombo Strikers', away: 'Dambulla Aura' }, league: 'LPL' }
    }
  ],
  movies: [
    { 
      _id: 'm1', 
      title: 'Dune: Part Two', 
      category: 'movie', 
      basePrice: 1500, 
      rating: 8.8,
      posterImage: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', 
      venue: { name: 'Scope Cinemas', city: 'Colombo' },
      metadata: { cast: ['Timothée Chalamet', 'Zendaya'], director: 'Denis Villeneuve' }
    },
    { 
      _id: 'm2', 
      title: 'Oppenheimer', 
      category: 'movie', 
      basePrice: 1500, 
      rating: 8.9,
      posterImage: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', 
      venue: { name: 'Liberty by Scope', city: 'Colombo' },
      metadata: { cast: ['Cillian Murphy', 'Robert Downey Jr.'], director: 'Christopher Nolan' }
    },
    { 
      _id: 'm3', 
      title: 'Godzilla x Kong: The New Empire', 
      category: 'movie', 
      basePrice: 1400, 
      rating: 7.2,
      posterImage: 'https://image.tmdb.org/t/p/w500/tMefBSflR6PGQLv7WvFPpKLZkyk.jpg', 
      venue: { name: 'Savoy 3D', city: 'Colombo' },
      metadata: { cast: ['Rebecca Hall'], director: 'Adam Wingard' }
    },
    { 
      _id: 'm4', 
      title: 'Kung Fu Panda 4', 
      category: 'movie', 
      basePrice: 900, 
      rating: 7.6,
      posterImage: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg', 
      venue: { name: 'Majestic City', city: 'Colombo' },
      metadata: { cast: ['Jack Black', 'Awkwafina'], director: 'Mike Mitchell' }
    },
    { 
      _id: 'm5', 
      title: 'Deadpool & Wolverine', 
      category: 'movie', 
      basePrice: 1600, 
      rating: 8.5,
      posterImage: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', 
      venue: { name: 'PVR Cinemas', city: 'Colombo' },
      metadata: { cast: ['Ryan Reynolds', 'Hugh Jackman'], director: 'Shawn Levy' }
    },
    // NEW MOVIES (Optimized w500)
    { 
      _id: 'm6', 
      title: 'Inside Out 2', 
      category: 'movie', 
      basePrice: 1100, 
      rating: 8.4,
      posterImage: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg', 
      venue: { name: 'Liberty by Scope', city: 'Colombo' },
      metadata: { cast: ['Amy Poehler', 'Maya Hawke'], director: 'Kelsey Mann' }
    },
    { 
      _id: 'm7', 
      title: 'Furiosa: A Mad Max Saga', 
      category: 'movie', 
      basePrice: 1400, 
      rating: 8.0,
      posterImage: 'https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg', 
      venue: { name: 'Scope Cinemas', city: 'Colombo' },
      metadata: { cast: ['Anya Taylor-Joy', 'Chris Hemsworth'], director: 'George Miller' }
    },
    { 
      _id: 'm8', 
      title: 'Kingdom of the Planet of the Apes', 
      category: 'movie', 
      basePrice: 1300, 
      rating: 7.5,
      posterImage: 'https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg', 
      venue: { name: 'Savoy 3D', city: 'Colombo' },
      metadata: { cast: ['Owen Teague', 'Freya Allan'], director: 'Wes Ball' }
    },
    { 
      _id: 'm9', 
      title: 'The Fall Guy', 
      category: 'movie', 
      basePrice: 1250, 
      rating: 7.8,
      posterImage: 'https://image.tmdb.org/t/p/w500/tSz1qsmSJon0rqnHBxMw6drWnj.jpg', 
      venue: { name: 'Majestic City', city: 'Colombo' },
      metadata: { cast: ['Ryan Gosling', 'Emily Blunt'], director: 'David Leitch' }
    },
    { 
      _id: 'm10', 
      title: 'Civil War', 
      category: 'movie', 
      basePrice: 1200, 
      rating: 7.4,
      posterImage: 'https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg', 
      venue: { name: 'PVR Cinemas', city: 'Colombo' },
      metadata: { cast: ['Kirsten Dunst', 'Wagner Moura'], director: 'Alex Garland' }
    },
    { 
      _id: 'm11', 
      title: 'Challengers', 
      category: 'movie', 
      basePrice: 1100, 
      rating: 7.6,
      posterImage: 'https://image.tmdb.org/t/p/w500/H6vke7zGiuLsz4v4RPeReb9rsv.jpg', 
      venue: { name: 'CCC', city: 'Colombo' },
      metadata: { cast: ['Zendaya', 'Mike Faist'], director: 'Luca Guadagnino' }
    },
    { 
      _id: 'm12', 
      title: 'Bad Boys: Ride or Die', 
      category: 'movie', 
      basePrice: 1350, 
      rating: 7.0,
      posterImage: 'https://image.tmdb.org/t/p/w500/nP6RliHjxsz4irTKsxe8FRhKZYl.jpg', 
      venue: { name: 'Scope Cinemas', city: 'Colombo' },
      metadata: { cast: ['Will Smith', 'Martin Lawrence'], director: 'Adil & Bilall' }
    },
    { 
      _id: 'm13', 
      title: 'A Quiet Place: Day One', 
      category: 'movie', 
      basePrice: 1400, 
      rating: 7.1,
      posterImage: 'https://image.tmdb.org/t/p/w500/yrpPYKijwdMHyTGnWhFts099qf8.jpg', 
      venue: { name: 'Savoy Premier', city: 'Colombo' },
      metadata: { cast: ['Lupita Nyong\'o', 'Joseph Quinn'], director: 'Michael Sarnoski' }
    }
  ],
  theatre: [
    { 
      _id: 't1', 
      title: 'Hamilton', 
      category: 'theatre', 
      basePrice: 5000, 
      rating: 9.5,
      posterImage: 'https://m.media-amazon.com/images/M/MV5BNjViNWRjYWEtZTI0NC00N2E3LTk0NGQtMjY4MzM3OGQlZjBjXkEyXkFqcGdeQXVyMjUwMTM3MTU@._V1_.jpg', 
      venue: { name: 'Lionel Wendt', city: 'Colombo' },
      metadata: { cast: ['Lin-Manuel Miranda'] }
    },
    { 
      _id: 't2', 
      title: 'The Lion King', 
      category: 'theatre', 
      basePrice: 4500, 
      rating: 9.2,
      posterImage: 'https://m.media-amazon.com/images/M/MV5BMjIwMjE1Nzc4NV5BMl5BanBnXkFtZTgwNDg4OTA1NzM@._V1_.jpg', 
      venue: { name: 'Nelum Pokuna', city: 'Colombo' },
      metadata: { cast: ['Ensemble'] }
    },
    { 
      _id: 't3', 
      title: 'Phantom of the Opera', 
      category: 'theatre', 
      basePrice: 6000, 
      rating: 9.0,
      posterImage: 'https://m.media-amazon.com/images/M/MV5BODg3Mjg0MDY4M15BMl5BanBnXkFtZTcwNjY5MDQ2NA@@._V1_.jpg', 
      venue: { name: 'Lionel Wendt', city: 'Colombo' },
      metadata: { cast: ['Ramin Karimloo'] }
    },
    { 
      _id: 't4', 
      title: 'Wicked', 
      category: 'theatre', 
      basePrice: 5500, 
      rating: 8.9,
      posterImage: 'https://m.media-amazon.com/images/M/MV5BMTY3OTI5NDczN15BMl5BanBnXkFtZTcwMDA0NDg4Nw@@._V1_.jpg', 
      venue: { name: 'Bishop\'s College', city: 'Colombo' },
      metadata: { cast: ['Idina Menzel'] }
    },
    { 
      _id: 't5', 
      title: 'Les Misérables', 
      category: 'theatre', 
      basePrice: 5000, 
      rating: 9.3,
      posterImage: 'https://m.media-amazon.com/images/M/MV5BMTQ4NDI3NDg4M15BMl5BanBnXkFtZTgwMjY5OTI1MDE@._V1_.jpg', 
      venue: { name: 'Elphinstone', city: 'Colombo' },
      metadata: { cast: ['Hugh Jackman'] }
    }
  ],
  concerts: [
    { 
      _id: 'c1', 
      title: 'Coldplay: Music of the Spheres', 
      category: 'concert', 
      basePrice: 25000, 
      rating: 9.8,
      posterImage: 'https://iheart-blog.s3.amazonaws.com/media/image/2025-12/colplay%20meta%20banner.jpg', 
      bannerImage: 'https://iheart-blog.s3.amazonaws.com/media/image/2025-12/colplay%20meta%20banner.jpg',
      venue: { name: 'Galle Face Green', city: 'Colombo' },
      metadata: { artists: ['Coldplay'] }
    },
    { 
      _id: 'c2', 
      title: 'Taylor Swift: The Eras Tour', 
      category: 'concert', 
      basePrice: 30000, 
      rating: 9.9,
      posterImage: 'https://upload.wikimedia.org/wikipedia/en/4/4d/The_Eras_Tour_poster.png', 
      bannerImage: 'https://i.ytimg.com/vi/KudedLV0tP0/maxresdefault.jpg',
      venue: { name: 'Sugathadasa Stadium', city: 'Colombo' },
      metadata: { artists: ['Taylor Swift'] }
    },
    { 
      _id: 'c3', 
      title: 'Ed Sheeran: Mathematics', 
      category: 'concert', 
      basePrice: 20000, 
      rating: 9.5,
      posterImage: 'https://www.theupcoming.co.uk/wp-content/uploads/2023/11/ed-sheeran-Mathematics-Tour.jpg', 
      venue: { name: 'Havelock Sports Club', city: 'Colombo' },
      metadata: { artists: ['Ed Sheeran'] }
    },
    { 
      _id: 'c4', 
      title: 'Tomorrowland Local', 
      category: 'concert', 
      basePrice: 15000, 
      rating: 8.5,
      posterImage: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&auto=format&fit=crop', 
      venue: { name: 'Port City', city: 'Colombo' },
      metadata: { artists: ['Various Artists'] }
    }
  ],
  sports: [
    { 
      _id: 's1', 
      title: 'LPL 2026 Finals', 
      category: 'sports', 
      basePrice: 1500, 
      rating: 8.0,
      posterImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&auto=format&fit=crop', 
      venue: { name: 'R. Premadasa', city: 'Colombo' },
      metadata: { teams: { home: 'Colombo', away: 'Dambulla' } }
    },
    { 
      _id: 's2', 
      title: 'SL vs IND ODI Series', 
      category: 'sports', 
      basePrice: 2000, 
      rating: 9.2,
      posterImage: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?w=500&auto=format&fit=crop', 
      venue: { name: 'Galle Stadium', city: 'Galle' },
      metadata: { teams: { home: 'Sri Lanka', away: 'India' } }
    },
    { 
      _id: 's3', 
      title: 'Inter-School Rugby', 
      category: 'sports', 
      basePrice: 1000, 
      rating: 8.5,
      posterImage: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=500&auto=format&fit=crop', 
      venue: { name: 'Race Course', city: 'Colombo' },
      metadata: { teams: { home: 'Royal', away: 'Trinity' } }
    }
  ]
};