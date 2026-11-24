// Edit everything about the invitation here.
export const wedding = {
  groom: 'Hafeez', bride: 'Farhana',
  date: '2026-12-26', time24: '', timeLabel: '6 PM', // time24 e.g. '16:30'
  offset: '+05:30', timezone: 'Asia/Kolkata',
  butterflyStyle: 'real', // 'real' = picture butterflies (butterflyImage below) | 'classic' = golden-wing butterflies (original)
  butterflyImage: 'images/butterfly.webp', // swap in any butterfly picture with a transparent background, body centred
  bismillah: true, // set false to hide the Arabic opening line
  // Photo that slides out of the envelope (put the file in /public/images). Set childPhoto: null to show the text letter instead.
  childPhoto: {src: 'images/childhood.jpg', alt: 'Hafeez and Farhana as children', caption: 'Where our story began'},
  verse: {
    ar: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ',
    en: 'And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.',
    ref: 'Surah Ar-Rum — 30:21'
  }, // set verse: null to hide
  dua: { ar: 'بَارَكَ اللَّهُ لَكُمْ وَبَارَكَ عَلَيْكُمْ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ', en: 'May Allah bless you and join you together in goodness.' },
  event: { kind: 'Ceremony', title: 'The Wedding', blurb: 'With the blessings of Allah and together with our families, we joyfully invite you to witness our union and share in our happiness.' },
  // Fill these to show a "Families" section (leave parents empty to hide it):
  families: { groom: {label: 'Family of Groom', parents: ''}, bride: {label: 'Family of Bride', parents: ''} },
  // e.g. parents: 'Son of Mr. ___ & Mrs. ___'
  venue: 'North View Auditorium',
  address: ['Payembra Road, Kuruvattoor', 'Kozhikode, Kerala'],
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=North+View+Auditorium%2C+Payembra+Road%2C+Kuruvattoor%2C+Kozhikode',
  musicUrl: 'muisc/bgmusic.mp3',   // file lives in public/muisc/ (no leading slash, so it also works on GitHub Pages)
  gallery: {
    albums: [
      { label: 'Our moments', albumUrl: '', empty: 'Our photos will appear here soon.' },
      { label: 'Wedding day', albumUrl: 'https://drive.google.com/drive/folders/1Kp4e6wUYIEH4mcRnLBZeSDHOz7RBJymh', empty: 'Photos from the celebration will be shared here after the big day.' }
    ]
  },
  // Shown in "Our moments" until you add a Drive folder:
  photos: [
    ['images/IMG_20261109_163316.png.jpeg', 'A moment together', true],
    ['images/IMG_20261109_163338.png.jpeg', 'Save the date', true],
    ['images/IMG_20261109_163357.png.jpeg', 'Together is a beautiful place to be', true],
    ['images/IMG_20261109_163413.png.jpeg', 'A bouquet of love'],
    ['images/IMG_20261109_163451.png.jpeg', 'Our wedding date'],
    ['images/IMG_20261109_163620.png.jpeg', 'Our next chapter'],
    ['images/IMG_20261109_163643.png.jpeg', 'Side by side']
  ],
  weddingPhotos: [
    ['images/IMG_20261109_163316.png.jpeg', 'A moment together'],
    ['images/IMG_20261109_163338.png.jpeg', 'Save the date'],
    ['images/IMG_20261109_163357.png.jpeg', 'Together is a beautiful place to be'],
    ['images/IMG_20261109_163413.png.jpeg', 'A bouquet of love'],
    ['images/IMG_20261109_163451.png.jpeg', 'Our wedding date'],
    ['images/IMG_20261109_163620.png.jpeg', 'Our next chapter'],
    ['images/IMG_20261109_163643.png.jpeg', 'Side by side']
  ]
}