/*
|--------------------------------------------------------------------------
| MEDIA CONTENT  (graphics, videos, certificates, CV)
|--------------------------------------------------------------------------
| Edit this file by hand, or use admin.html to add / edit / delete entries
| and export a fresh copy of this file. Every "file" path is relative to the
| site root and must exist on disk:
|   /assets/images/        graphics (png, jpg, jpeg, webp)
|   /assets/videos/        videos (mp4) + optional poster image
|   /assets/certificates/  certificates (pdf, png, jpg, jpeg)
|   /assets/documents/     CV and other PDFs
*/
window.PORTFOLIO_MEDIA = {

  graphicCategories: ['Posters', 'Logos', 'Branding', 'Social Media Designs', 'Other Projects'],

  graphics: [
    { id: 'g1', title: 'Urban Threads: Back to School', category: 'Social Media Designs', year: '',
      file: 'assets/images/branding.webp',
      description: 'Back-to-school collection ad for the Urban Threads clothing brand, built around a neon yellow and purple palette and bold hand-lettered type.' },
    { id: 'g2', title: 'Never Forget Your Dreams', category: 'Posters', year: '',
      file: 'assets/images/typography-poster.png',
      description: 'Typographic poster mixing a heavy display face with flowing script lettering in black and red.' },
    { id: 'g3', title: 'Hide the Code: Brand Board', category: 'Branding', year: '',
      file: 'assets/images/hide-the-code-brand-board.jpg',
      pdf: 'assets/documents/hide-the-code-brand-board.pdf',
      description: 'Brand board for “Hide the Code, secure by design”: logo, five-step grey and black palette, Oswald and Roboto Mono typography, and a mood board.' },
    { id: 'g4', title: 'Hide the Code: Badge (circular)', category: 'Logos', year: '',
      file: 'assets/images/badge-1.webp',
      description: 'Circular badge version of the Hide the Code mark with the tagline “secure by design”.' },
    { id: 'g5', title: 'Hide the Code: Badge (rounded square)', category: 'Logos', year: '',
      file: 'assets/images/badge-2.webp',
      description: 'Rounded-square badge version of the Hide the Code mark.' },
    { id: 'g6', title: 'Hide the Code: Horizontal Logo', category: 'Logos', year: '',
      file: 'assets/images/horizontal.webp',
      description: 'Horizontal lockup with the database and code-bracket icon beside the wordmark.' },
    { id: 'g7', title: 'Hide the Code: Primary Logo', category: 'Logos', year: '',
      file: 'assets/images/logo-3.webp',
      description: 'Primary logo with the wordmark set above the database icon.' },
    { id: 'g8', title: 'Hide the Code: Vertical Logo', category: 'Logos', year: '',
      file: 'assets/images/vertical.webp',
      description: 'Stacked logo with the wordmark below the icon.' },
    { id: 'g9', title: 'Hide the Code: Icon', category: 'Logos', year: '',
      file: 'assets/images/icon.webp',
      description: 'Icon-only mark: a database cylinder with a code symbol inside curly braces.' },
    { id: 'g10', title: 'IT Society Shirt: White (front)', category: 'Other Projects', year: '',
      file: 'assets/images/its-shirt-white-front.jpg',
      pdf: 'assets/documents/ITS-shirt-mockups.pdf',
      description: 'White shirt mockup with a diagonal circuit-board pattern and the Information Technology Society crest.' },
    { id: 'g11', title: 'IT Society Shirt: White (back)', category: 'Other Projects', year: '',
      file: 'assets/images/its-shirt-white-back.jpg',
      pdf: 'assets/documents/ITS-shirt-mockups.pdf',
      description: 'Back of the white shirt: falling binary code, school and society crests, and a flame graphic with the society name.' },
    { id: 'g12', title: 'IT Society Shirt: Black (front)', category: 'Other Projects', year: '',
      file: 'assets/images/its-shirt-black-front.jpg',
      pdf: 'assets/documents/ITS-shirt-mockups.pdf',
      description: 'Black shirt mockup with a light circuit-trace pattern and the society crest.' },
    { id: 'g13', title: 'IT Society Shirt: Black (back)', category: 'Other Projects', year: '',
      file: 'assets/images/its-shirt-black-back.jpg',
      pdf: 'assets/documents/ITS-shirt-mockups.pdf',
      description: 'Back of the black shirt with binary rain, both crests, and the flame and society-name graphic.' },
    { id: 'g14', title: 'Who Am I Online? Digital Self Map', category: 'Other Projects', year: '2026',
      file: 'assets/images/digital-self-map.webp',
      description: 'Collage-style infographic for a Digital Self Studio task: a persona map of a fictional student covering online personas, digital traces, and attention.' }
  ],

  videos: [
    { id: 'v1', title: 'Black 3D: IT Society Shirt Preview', year: '',
      file: 'assets/videos/black-3d.mp4',
      webm: 'assets/videos/black-3d.webm',   // optional fallback for browsers without H.264
      poster: 'assets/videos/black-3d-poster.jpg',
      description: 'Short 3D turntable (about 8 seconds) of the black IT Society shirt design, showing the circuit pattern, crests, and binary-and-flame back print.' }
  ],

  certificates: [
    { id: 'c1', title: 'Building Financial Awareness, Skills, and Responsible Decision-Making (ITalks: Beyond the Screen Webinar)',
      issuer: 'Department of Computing and Informatics, City College of Calamba', date: '13 October 2026',
      file: 'assets/certificates/italks-financial-awareness.png' },
    { id: 'c2', title: 'The No-Code Creative: Figma for Talents and Local Businesses Workshop',
      issuer: 'DICT CALABARZON Regional Office', date: '14 March 2026',
      file: 'assets/certificates/dict-figma-no-code-workshop.png' },
    { id: 'c3', title: 'SkillQuest: Generative AI Literacy',
      issuer: 'Simplilearn SkillUP', date: '27 August 2026',
      file: 'assets/certificates/simplilearn-genai-literacy.png' },
    { id: 'c4', title: 'Information Session: PNPKI for SUCs, LUCs, & GOCCs',
      issuer: 'DICT CALABARZON Regional Office', date: '15 April 2026',
      file: 'assets/certificates/dict-pnpki-info-session.png' }
  ],

  // No CV file was uploaded yet. Put the PDF at assets/documents/cv.pdf (or change the path here).
  cv: {
    file: 'assets/documents/cv.pdf',
    downloadName: 'Jhon-Salvador-Delos-Reyes-CV.pdf',
    updated: ''
  }
};
