// Shared skill categories and skills used by both frontend and backend
// Each category has a name, icon emoji, hex color, and list of skills

export const SKILL_CATEGORIES = [
  {
    name: 'Programming',
    icon: '💻',
    color: '#3b82f6',
    skills: [
      'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#',
      'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin',
      'React.js', 'Node.js', 'SQL', 'HTML/CSS'
    ]
  },
  {
    name: 'Design',
    icon: '🎨',
    color: '#ec4899',
    skills: [
      'UI/UX Design', 'Graphic Design', 'Figma', 'Adobe Photoshop',
      'Adobe Illustrator', 'Motion Graphics', 'Brand Design', '3D Modeling'
    ]
  },
  {
    name: 'Languages',
    icon: '🌍',
    color: '#10b981',
    skills: [
      'English', 'Spanish', 'French', 'German', 'Mandarin Chinese',
      'Japanese', 'Korean', 'Arabic', 'Hindi', 'Portuguese'
    ]
  },
  {
    name: 'Music',
    icon: '🎵',
    color: '#8b5cf6',
    skills: [
      'Guitar', 'Piano', 'Drums', 'Violin', 'Singing/Vocals',
      'Music Production', 'Music Theory', 'DJ/Mixing'
    ]
  },
  {
    name: 'Writing',
    icon: '✍️',
    color: '#f59e0b',
    skills: [
      'Creative Writing', 'Academic Writing', 'Copywriting',
      'Content Writing', 'Technical Writing', 'Screenwriting',
      'Poetry', 'Journalism'
    ]
  },
  {
    name: 'Mathematics',
    icon: '📐',
    color: '#ef4444',
    skills: [
      'Calculus', 'Linear Algebra', 'Statistics', 'Probability',
      'Discrete Mathematics', 'Differential Equations', 'Number Theory'
    ]
  },
  {
    name: 'Science',
    icon: '🔬',
    color: '#06b6d4',
    skills: [
      'Physics', 'Chemistry', 'Biology', 'Biochemistry',
      'Environmental Science', 'Neuroscience', 'Astronomy'
    ]
  },
  {
    name: 'Business',
    icon: '📊',
    color: '#84cc16',
    skills: [
      'Accounting', 'Marketing', 'Entrepreneurship', 'Finance',
      'Project Management', 'Public Speaking', 'Negotiation'
    ]
  },
  {
    name: 'Data & AI',
    icon: '🤖',
    color: '#6366f1',
    skills: [
      'Machine Learning', 'Data Science', 'Data Analysis',
      'Deep Learning', 'NLP', 'Computer Vision', 'Data Visualization'
    ]
  },
  {
    name: 'Photography & Video',
    icon: '📸',
    color: '#f97316',
    skills: [
      'Photography', 'Video Editing', 'Cinematography',
      'Photo Editing', 'Drone Photography', 'Animation'
    ]
  },
  {
    name: 'Health & Fitness',
    icon: '💪',
    color: '#14b8a6',
    skills: [
      'Yoga', 'Personal Training', 'Nutrition',
      'Meditation', 'First Aid', 'Sports Coaching'
    ]
  },
  {
    name: 'Life Skills',
    icon: '🧠',
    color: '#a855f7',
    skills: [
      'Time Management', 'Study Techniques', 'Interview Prep',
      'Resume Writing', 'Leadership', 'Cooking', 'Personal Finance'
    ]
  }
];

// Flattened skill list with category references
export const ALL_SKILLS = SKILL_CATEGORIES.flatMap(category =>
  category.skills.map(skill => ({
    name: skill,
    category: category.name,
    icon: category.icon,
    color: category.color
  }))
);

export const PROFICIENCY_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];
export const SESSION_DURATIONS = [30, 60, 120]; // minutes
export const SESSION_STATUSES = ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED'];

export default SKILL_CATEGORIES;
