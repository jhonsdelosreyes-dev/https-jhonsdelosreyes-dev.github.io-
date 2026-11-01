/*
|--------------------------------------------------------------------------
| PORTFOLIO CONTENT  (edit THIS file to update the whole website)
|--------------------------------------------------------------------------
| Same idea as config/portfolio.php in the Laravel version: everything
| shown on the site comes from here. No need to touch any .html file.
|
| Search for "EDIT" to find the values you must replace with your real info.
| Links that are null/empty are NOT displayed.
*/

window.PORTFOLIO = {

  // EDIT: your final public URL, e.g. 'https://jhopn.example.com/' (used for canonical,
  // Open Graph and JSON-LD). Leave '' to use whatever address the page is opened from.
  siteUrl: '',

  // Contact form delivery. A static site has no database, so messages are sent to a form service.
  //  - Formspree:  endpoint: 'https://formspree.io/f/XXXXXXXX'
  //  - Web3Forms:  endpoint: 'https://api.web3forms.com/submit', extraFields: { access_key: 'YOUR_KEY' }
  // If endpoint is '' the form opens the visitor's email app (mailto:) instead.
  contact: {
    endpoint: '',
    extraFields: {}
  },

  // Optional: a URL that receives a tiny JSON POST each time the CV is downloaded/viewed
  // (action, device, referrer, time). Leave '' to turn tracking off.
  cvTrackEndpoint: '',

  profile: {
    name: 'Jhon Salvador Delos Reyes',
    nickname: 'Salv',
    title: 'IT Student, Back-end Developer & Graphic Designer',
    tagline: 'I build practical web systems with Laravel, and design graphics and edit videos.',
    intro: 'Information Technology student at City College of Calamba who builds database-driven web applications with Laravel and MySQL, and creates graphic designs and edited videos with Photoshop and film editing.',
    location: 'Calamba, Laguna, Philippines',
    email: 'jhonsdelosreyes@gmail.com',                // EDIT
    phone: '+63 936 302 6431',                      // EDIT (or set to null to hide)
    photo: 'img/programmer.gif',                      // EDIT: put your photo at img/profile.webp
    experience_years: '2+',                         // EDIT
    specializations: ['Web Development', 'Graphic Design', 'Film Editing'],
    occupation: 'Student, City College of Calamba',
    bio: [
      'I am an Information Technology student at City College of Calamba. I enjoy turning real business problems into working web applications, from the database design to the screens people actually use.',
      'My main project work uses Laravel, including my thesis project, PastryLiberty, a web-based ordering and POS platform for a local food mart, where I worked as a back-end developer. I also build responsive front-ends with HTML, CSS, and JavaScript.',
      'Outside of code, I do graphic design in Photoshop (logos, posters, branding, and social media designs) and edit videos. You can see this work in my Graphic Design Portfolio project.',
      'My goal is to grow into a full-stack web developer who delivers reliable, well-documented systems, with a creative eye for design.'
    ],
    socials: {
      // Leave a value as null to hide that link.
      github: 'https://github.com/jhonsdelosreyes',            // EDIT
      linkedin: 'https://www.linkedin.com/in/jhonsdelosreyes', // EDIT
      facebook: null
    }
  },

  // Skill levels are honest self-ratings (1-5), not percentages.
  // 1 Beginner, 2 Basic, 3 Working, 4 Proficient, 5 Advanced
  skills: {
    'Web Development': [
      { name: 'HTML & CSS', level: 4, icon: '🎨' },
      { name: 'JavaScript', level: 3, icon: '⚡' },
      { name: 'PHP',        level: 3, icon: '🐘' },
      { name: 'Laravel',    level: 3, icon: '🔺' }
    ],
    'Data & Tools': [
      { name: 'MySQL',        level: 3, icon: '🗄️' },
      { name: 'Git / GitHub', level: 3, icon: '🔀' }
    ],
    'Creative': [
      { name: 'Adobe Photoshop', level: 4, icon: '🖌️' },
      { name: 'Graphic Design',  level: 4, icon: '🎨' },
      { name: 'Film / Video Editing', level: 3, icon: '🎬' }
    ],
    'Networking & Systems': [
      { name: 'Computer Networking',      level: 3, icon: '🌐' },
      { name: 'Network Configuration',    level: 2, icon: '🔧' },
      { name: 'Hardware Troubleshooting', level: 3, icon: '🖥️' }
    ],
    'Professional': [
      { name: 'Problem Solving',         level: 4, icon: '🧩' },
      { name: 'Technical Documentation', level: 3, icon: '📝' },
      { name: 'Team Collaboration',      level: 4, icon: '🤝' },
      { name: 'Research',                level: 3, icon: '🔎' }
    ]
  },

  experience: [
    // EDIT: add real positions (internship, OJT, part-time, freelance, thesis role...)
    {
      position: 'Back-end Developer (Thesis Project)',
      org: 'City College of Calamba',
      location: 'Calamba, Laguna',
      dates: '2026',
      responsibilities: [
        'Designed the database and built the ordering and POS modules in Laravel.',
        'Coordinated with group members and the adviser through chapter revisions.'
      ],
      accomplishments: [
        'Prepared the system and documentation for the final defense.'
      ]
    },
    {
      position: 'Film / Video Editor',
      org: 'Personal & freelance projects',
      location: 'Calamba, Laguna',
      dates: '',
      responsibilities: [
        'Edit video projects, including 3D and motion pieces.'
      ],
      accomplishments: [
        'Videos are published in the Graphic Design Portfolio project on this site.'
      ]
    },
    {
      position: 'Graphic Designer (Photoshop)',
      org: 'Personal & freelance projects',
      location: 'Calamba, Laguna',
      dates: '',
      responsibilities: [
        'Design logos, posters, branding, and social media graphics in Adobe Photoshop.'
      ],
      accomplishments: [
        'Created a brand identity (Hide the Code), a back-to-school ad, a typographic poster, and shirt designs for the IT Society.'
      ]
    },
    {
      position: 'Freelance Web Developer',
      org: 'Self-employed',
      location: 'Remote',
      dates: '2025 – Present',
      responsibilities: [
        'Build responsive pages and small web tools from client briefs.'
      ],
      accomplishments: [
        'Built a graphic design portfolio site with animations and a Laravel contact endpoint.'
      ]
    }
  ],

  education: {
    schools: [
      { school: 'City College of Calamba', level: 'College', detail: 'Bachelor’s Degree in Information Technology', status: 'Currently enrolled', logo: 'assets/images/schools/city-college-of-calamba.jpg' },
      { school: 'PHINMA Rizal College of Laguna', level: 'Senior High School', detail: '', status: 'Completed', logo: 'assets/images/schools/phinma-rizal-college-of-laguna.jpg' },
      { school: 'Calamba City School for the Arts', level: 'Junior High School', detail: '', status: 'Completed', logo: 'assets/images/schools/calamba-city-school-for-the-arts.jpg' },
      { school: 'Lecheria Elementary School', level: 'Elementary', detail: 'Calamba City', status: 'Completed', logo: 'assets/images/schools/lecheria-elementary-school.webp' }
    ],
    certifications: []   // certificates now come from js/content.js and show on the Education page
  },

  categories: [
    'Web Development', 'Mobile Application', 'Information System', 'Networking',
    'Research', 'Database', 'Graphic Design', 'Automation'
  ],

  /*
  | PROJECT DATA MODEL
  | id, slug (used in project.html?slug=...), name, category, type, description,
  | year, technologies[], image, url, github, docs, role, status,
  | problem, solution, features[], screenshots[]
  | Set url/github/docs to null if the link does not exist.
  */
  projects: [
    {
      id: 1,
      slug: 'pastryliberty',
      name: 'PastryLiberty',
      category: 'Information System',
      type: 'Thesis project',
      description: 'A web-based ordering and point-of-sale system for Liberty Food Mart.',
      year: 2026,
      technologies: ['Laravel', 'PHP', 'MySQL', 'Blade', 'CSS'],
      image: 'img/projects/pastryliberty.webp',
      url: null,
      github: null,   // EDIT if the repo is public
      docs: null,
      role: 'Back-end developer (group thesis)',
      status: 'Completed',
      problem: 'Orders and sales at a local food mart were handled manually, which made order tracking and daily sales reports slow and error-prone.',
      solution: 'A web application that lets customers place orders online and gives staff a point-of-sale screen, with all records stored in one database.',
      features: ['Online ordering', 'Point-of-sale screen for staff', 'Product and category management', 'Sales records'],
      screenshots: []
    },
    {
      id: 3,
      slug: 'graphic-design-portfolio',
      name: 'Graphic Design Portfolio',
      category: 'Graphic Design',
      type: 'Client / personal website',
      description: 'A responsive, animated portfolio site with a Laravel-backed contact form endpoint.',
      year: 2025,
      technologies: ['HTML', 'CSS', 'JavaScript', 'Laravel'],
      image: 'assets/images/branding.webp',
      url: null,
      github: null,
      docs: null,
      role: 'Front-end developer',
      status: 'Completed',
      problem: 'A designer needed a site that shows their work well on any screen.',
      solution: 'A responsive HTML/CSS/JS site with subtle animations and a contact form that posts to a Laravel endpoint.',
      features: ['Responsive layout', 'Scroll animations', 'Contact form endpoint'],
      screenshots: []
    },
    {
      id: 4,
      slug: 'student-management-system',
      name: 'Student Management System',
      category: 'Information System',
      type: 'Academic project',
      description: 'A system for managing student records.',   // EDIT with real details
      year: 2026,
      technologies: ['PHP', 'MySQL'],                           // EDIT
      image: 'img/projects/student-management.webp',
      url: null,
      github: null,
      docs: null,
      role: 'Developer',
      status: 'In progress',
      problem: 'EDIT: describe the problem this system solves.',
      solution: 'EDIT: describe how your system solves it.',
      features: ['EDIT: list real features'],
      screenshots: []
    }
  ]
};
