import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ─── SKILL CATEGORIES & SKILLS ────────────────────────

const SKILL_CATEGORIES = [
  {
    name: 'Programming', icon: '💻', color: '#3b82f6',
    skills: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'React.js', 'Node.js', 'SQL', 'HTML/CSS']
  },
  {
    name: 'Design', icon: '🎨', color: '#ec4899',
    skills: ['UI/UX Design', 'Graphic Design', 'Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Motion Graphics', 'Brand Design', '3D Modeling']
  },
  {
    name: 'Languages', icon: '🌍', color: '#10b981',
    skills: ['English', 'Spanish', 'French', 'German', 'Mandarin Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Portuguese']
  },
  {
    name: 'Music', icon: '🎵', color: '#8b5cf6',
    skills: ['Guitar', 'Piano', 'Drums', 'Violin', 'Singing/Vocals', 'Music Production', 'Music Theory', 'DJ/Mixing']
  },
  {
    name: 'Writing', icon: '✍️', color: '#f59e0b',
    skills: ['Creative Writing', 'Academic Writing', 'Copywriting', 'Content Writing', 'Technical Writing', 'Screenwriting', 'Poetry', 'Journalism']
  },
  {
    name: 'Mathematics', icon: '📐', color: '#ef4444',
    skills: ['Calculus', 'Linear Algebra', 'Statistics', 'Probability', 'Discrete Mathematics', 'Differential Equations', 'Number Theory']
  },
  {
    name: 'Science', icon: '🔬', color: '#06b6d4',
    skills: ['Physics', 'Chemistry', 'Biology', 'Biochemistry', 'Environmental Science', 'Neuroscience', 'Astronomy']
  },
  {
    name: 'Business', icon: '📊', color: '#84cc16',
    skills: ['Accounting', 'Marketing', 'Entrepreneurship', 'Finance', 'Project Management', 'Public Speaking', 'Negotiation']
  },
  {
    name: 'Data & AI', icon: '🤖', color: '#6366f1',
    skills: ['Machine Learning', 'Data Science', 'Data Analysis', 'Deep Learning', 'NLP', 'Computer Vision', 'Data Visualization']
  },
  {
    name: 'Photography & Video', icon: '📸', color: '#f97316',
    skills: ['Photography', 'Video Editing', 'Cinematography', 'Photo Editing', 'Drone Photography', 'Animation']
  },
  {
    name: 'Health & Fitness', icon: '💪', color: '#14b8a6',
    skills: ['Yoga', 'Personal Training', 'Nutrition', 'Meditation', 'First Aid', 'Sports Coaching']
  },
  {
    name: 'Life Skills', icon: '🧠', color: '#a855f7',
    skills: ['Time Management', 'Study Techniques', 'Interview Prep', 'Resume Writing', 'Leadership', 'Cooking', 'Personal Finance']
  }
];

// ─── TEST USERS ───────────────────────────────────────

const TEST_USERS = [
  {
    email: 'alice@university.edu',
    password: 'Password123!',
    name: 'Alice Chen',
    university: 'MIT',
    bio: 'Computer Science senior passionate about teaching Python and Machine Learning. Love helping beginners get started with programming!',
    location: 'Cambridge, MA',
    availability: { weekdays: ['Mon', 'Wed', 'Fri'], timeSlots: ['10:00-12:00', '14:00-16:00'] },
    trustScore: 92,
    totalPoints: 1250,
    emailVerified: true,
  },
  {
    email: 'bob@university.edu',
    password: 'Password123!',
    name: 'Bob Martinez',
    university: 'Stanford',
    bio: 'Design student and guitar enthusiast. Can teach Figma, UI/UX Design, and acoustic guitar. Always looking to learn new languages!',
    location: 'Palo Alto, CA',
    availability: { weekdays: ['Tue', 'Thu', 'Sat'], timeSlots: ['09:00-11:00', '16:00-18:00'] },
    trustScore: 85,
    totalPoints: 890,
    emailVerified: true,
  },
  {
    email: 'carol@university.edu',
    password: 'Password123!',
    name: 'Carol Johnson',
    university: 'Harvard',
    bio: 'Mathematics and Physics double major. I break down complex concepts into simple, intuitive explanations. Currently learning photography!',
    location: 'Cambridge, MA',
    availability: { weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], timeSlots: ['13:00-15:00'] },
    trustScore: 78,
    totalPoints: 650,
    emailVerified: true,
  },
  {
    email: 'david@university.edu',
    password: 'Password123!',
    name: 'David Kim',
    university: 'UCLA',
    bio: 'Bilingual Korean-English speaker studying Business. Can teach Korean, Public Speaking, and Finance. Want to learn coding!',
    location: 'Los Angeles, CA',
    availability: { weekdays: ['Wed', 'Fri', 'Sun'], timeSlots: ['11:00-13:00', '17:00-19:00'] },
    trustScore: 70,
    totalPoints: 420,
    emailVerified: true,
  },
  {
    email: 'emma@university.edu',
    password: 'Password123!',
    name: 'Emma Wilson',
    university: 'NYU',
    bio: 'Creative Writing MFA student and yoga instructor. I teach storytelling, academic writing, and meditation. Looking to learn Data Visualization!',
    location: 'New York, NY',
    availability: { weekdays: ['Mon', 'Wed', 'Sat'], timeSlots: ['08:00-10:00', '15:00-17:00'] },
    trustScore: 88,
    totalPoints: 1100,
    emailVerified: true,
  }
];

// ─── USER SKILLS (teach & learn assignments) ──────────

const USER_SKILL_ASSIGNMENTS = [
  // Alice teaches programming, learns music
  { userEmail: 'alice@university.edu', skillName: 'Python', type: 'TEACH', level: 'EXPERT', desc: 'I teach Python from basics to advanced — data structures, algorithms, and real projects.' },
  { userEmail: 'alice@university.edu', skillName: 'Machine Learning', type: 'TEACH', level: 'INTERMEDIATE', desc: 'Intro to ML with scikit-learn and PyTorch. Project-based learning approach.' },
  { userEmail: 'alice@university.edu', skillName: 'JavaScript', type: 'TEACH', level: 'EXPERT', desc: 'Full-stack JS including React, Node.js, and modern ES6+ features.' },
  { userEmail: 'alice@university.edu', skillName: 'Piano', type: 'LEARN', level: 'BEGINNER', desc: 'Always wanted to learn piano! Starting from scratch.' },

  // Bob teaches design & music, learns languages
  { userEmail: 'bob@university.edu', skillName: 'Figma', type: 'TEACH', level: 'EXPERT', desc: 'Complete Figma workflow: wireframes to high-fidelity prototypes and design systems.' },
  { userEmail: 'bob@university.edu', skillName: 'UI/UX Design', type: 'TEACH', level: 'EXPERT', desc: 'User research, wireframing, prototyping, and usability testing.' },
  { userEmail: 'bob@university.edu', skillName: 'Guitar', type: 'TEACH', level: 'INTERMEDIATE', desc: 'Acoustic guitar for beginners — chords, strumming patterns, and popular songs.' },
  { userEmail: 'bob@university.edu', skillName: 'Japanese', type: 'LEARN', level: 'BEGINNER', desc: 'Want to learn conversational Japanese for travel and anime!' },
  { userEmail: 'bob@university.edu', skillName: 'Python', type: 'LEARN', level: 'BEGINNER', desc: 'Looking to pick up Python for design automation scripts.' },

  // Carol teaches math & science, learns photography
  { userEmail: 'carol@university.edu', skillName: 'Calculus', type: 'TEACH', level: 'EXPERT', desc: 'Calc 1-3 tutoring. I make derivatives and integrals click!' },
  { userEmail: 'carol@university.edu', skillName: 'Physics', type: 'TEACH', level: 'EXPERT', desc: 'Classical mechanics, E&M, and intro quantum. Lots of visual explanations.' },
  { userEmail: 'carol@university.edu', skillName: 'Statistics', type: 'TEACH', level: 'INTERMEDIATE', desc: 'Descriptive and inferential statistics for social sciences and STEM.' },
  { userEmail: 'carol@university.edu', skillName: 'Photography', type: 'LEARN', level: 'BEGINNER', desc: 'Just got my first DSLR! Want to learn composition and lighting basics.' },

  // David teaches languages & business, learns coding
  { userEmail: 'david@university.edu', skillName: 'Korean', type: 'TEACH', level: 'EXPERT', desc: 'Native speaker teaching conversational Korean, hangul, and cultural context.' },
  { userEmail: 'david@university.edu', skillName: 'Public Speaking', type: 'TEACH', level: 'INTERMEDIATE', desc: 'Overcome stage fright, structure talks, and deliver with confidence.' },
  { userEmail: 'david@university.edu', skillName: 'Finance', type: 'TEACH', level: 'INTERMEDIATE', desc: 'Personal finance, investing basics, and intro to corporate finance.' },
  { userEmail: 'david@university.edu', skillName: 'Python', type: 'LEARN', level: 'BEGINNER', desc: 'Want to learn Python for data analysis in my business courses.' },
  { userEmail: 'david@university.edu', skillName: 'React.js', type: 'LEARN', level: 'BEGINNER', desc: 'Interested in building web apps for my startup idea.' },

  // Emma teaches writing & wellness, learns data
  { userEmail: 'emma@university.edu', skillName: 'Creative Writing', type: 'TEACH', level: 'EXPERT', desc: 'Fiction, poetry, and narrative nonfiction. Workshop-style feedback sessions.' },
  { userEmail: 'emma@university.edu', skillName: 'Academic Writing', type: 'TEACH', level: 'EXPERT', desc: 'Thesis writing, research papers, and citation styles (APA, MLA, Chicago).' },
  { userEmail: 'emma@university.edu', skillName: 'Yoga', type: 'TEACH', level: 'INTERMEDIATE', desc: 'Hatha and Vinyasa yoga for stress relief and flexibility. All levels welcome.' },
  { userEmail: 'emma@university.edu', skillName: 'Data Visualization', type: 'LEARN', level: 'BEGINNER', desc: 'Want to visualize data for my creative writing research projects.' },
];

// ─── BADGES ───────────────────────────────────────────

const BADGES = [
  // Teacher badges
  { name: 'Python Master', description: 'Completed 50 Python teaching sessions', icon: '🐍', category: 'teacher', criteria: { type: 'session_count', skill: 'Python', count: 50 } },
  { name: 'Mentor Medal', description: 'Completed 100 total teaching sessions', icon: '🏅', category: 'teacher', criteria: { type: 'total_sessions', count: 100 } },
  { name: 'Super Responder', description: 'Maintained 100% reply rate', icon: '⚡', category: 'teacher', criteria: { type: 'reply_rate', rate: 100 } },
  { name: '5-Star Excellence', description: 'Maintained 4.8+ average rating', icon: '⭐', category: 'teacher', criteria: { type: 'avg_rating', min: 4.8 } },
  { name: 'Trusted Educator', description: 'No disputes and 90+ trust score', icon: '🛡️', category: 'teacher', criteria: { type: 'trust_score', min: 90 } },

  // Student badges
  { name: 'Quick Learner', description: 'Completed 10 learning sessions', icon: '🚀', category: 'student', criteria: { type: 'learn_sessions', count: 10 } },
  { name: 'Knowledge Seeker', description: 'Completed 50 learning sessions', icon: '📖', category: 'student', criteria: { type: 'learn_sessions', count: 50 } },
  { name: 'Skill Juggler', description: 'Learned 5 different skills', icon: '🤹', category: 'student', criteria: { type: 'unique_skills', count: 5 } },
  { name: 'Consistent Performer', description: 'Maintained 90% session attendance', icon: '🎯', category: 'student', criteria: { type: 'attendance_rate', min: 90 } },
  { name: 'Master of One', description: 'Excelled in a single skill', icon: '🏆', category: 'student', criteria: { type: 'mastery', count: 1 } },

  // Community badges
  { name: 'Team Player', description: 'Taught and learned equally', icon: '🤝', category: 'community', criteria: { type: 'balance_ratio', min: 0.8, max: 1.2 } },
  { name: 'Community Builder', description: 'Referred 5+ new users', icon: '🌟', category: 'community', criteria: { type: 'referrals', count: 5 } },
  { name: 'Skill Multiplier', description: 'Taught a skill you previously learned', icon: '🔄', category: 'community', criteria: { type: 'teach_learned', count: 1 } },
  { name: 'Ambassador', description: 'Referred 50+ new users', icon: '👑', category: 'community', criteria: { type: 'referrals', count: 50 } },
];

// ─── MAIN SEED FUNCTION ──────────────────────────────

async function main() {
  console.log('🌱 Seeding database...\n');

  // 1. Seed skill categories and skills
  console.log('📚 Seeding skill categories and skills...');
  for (const cat of SKILL_CATEGORIES) {
    const category = await prisma.skillCategory.upsert({
      where: { name: cat.name },
      update: { icon: cat.icon, color: cat.color, skillCount: cat.skills.length },
      create: { name: cat.name, icon: cat.icon, color: cat.color, skillCount: cat.skills.length },
    });

    for (const skillName of cat.skills) {
      await prisma.skill.upsert({
        where: { name_categoryId: { name: skillName, categoryId: category.id } },
        update: {},
        create: { name: skillName, categoryId: category.id, description: '', tags: JSON.stringify([cat.name.toLowerCase()]) },
      });
    }
  }
  const totalSkills = await prisma.skill.count();
  console.log(`   ✅ ${SKILL_CATEGORIES.length} categories, ${totalSkills} skills\n`);

  // 2. Seed test users
  console.log('👤 Seeding test users...');
  const hashedPassword = await bcrypt.hash('Password123!', 12);
  const createdUsers = {};

  for (const user of TEST_USERS) {
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        passwordHash: hashedPassword,
        name: user.name,
        university: user.university,
        bio: user.bio,
        location: user.location,
        availability: user.availability ? JSON.stringify(user.availability) : null,
        trustScore: user.trustScore,
        totalPoints: user.totalPoints,
        emailVerified: user.emailVerified,
      },
    });
    createdUsers[user.email] = created;
    console.log(`   ✅ ${user.name} (${user.email})`);
  }

  // 3. Assign skills to users
  console.log('\n🎯 Assigning skills to users...');
  for (const assignment of USER_SKILL_ASSIGNMENTS) {
    const user = createdUsers[assignment.userEmail];
    const skill = await prisma.skill.findFirst({ where: { name: assignment.skillName } });

    if (user && skill) {
      await prisma.userSkill.upsert({
        where: {
          userId_skillId_type: {
            userId: user.id,
            skillId: skill.id,
            type: assignment.type,
          },
        },
        update: {},
        create: {
          userId: user.id,
          skillId: skill.id,
          type: assignment.type,
          proficiencyLevel: assignment.level,
          description: assignment.desc,
          preferredDuration: 60,
        },
      });

      // Update listing count
      await prisma.skill.update({
        where: { id: skill.id },
        data: { listingCount: { increment: 1 } },
      });
    }
  }
  console.log(`   ✅ ${USER_SKILL_ASSIGNMENTS.length} skill assignments\n`);

  // 4. Mark some skills as trending
  console.log('📈 Setting trending skills...');
  const trendingSkills = ['Python', 'Figma', 'Machine Learning', 'Creative Writing', 'Korean', 'Guitar', 'React.js', 'Statistics'];
  for (const name of trendingSkills) {
    await prisma.skill.updateMany({ where: { name }, data: { isTrending: true } });
  }
  console.log(`   ✅ ${trendingSkills.length} trending skills\n`);

  // 5. Seed badges
  console.log('🏅 Seeding badges...');
  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: {
        ...badge,
        criteria: badge.criteria ? JSON.stringify(badge.criteria) : null,
      },
    });
  }
  console.log(`   ✅ ${BADGES.length} badges\n`);

  console.log('🎉 Seeding complete!\n');
  console.log('Test credentials: any test email with password "Password123!"');
  console.log('Emails: alice@university.edu, bob@university.edu, carol@university.edu, david@university.edu, emma@university.edu');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
