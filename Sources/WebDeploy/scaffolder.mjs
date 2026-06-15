/**
 * WebDeploy Scaffolder
 * Usage: node scaffolder.mjs <slug> <type>
 * Types: cafe | restaurant | spa | portfolio | company | blog | spa-service
 *
 * Copies ~55% core files from _scaffold/ and creates placeholder structure
 * for AI (web-deploy-builder) to fill the remaining 45%.
 */
import { cpSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = dirname(fileURLToPath(import.meta.url))
const [,, slug, type] = process.argv

const VALID_TYPES = ['cafe', 'restaurant', 'spa', 'spa-service', 'portfolio', 'company', 'blog']

if (!slug || !type) {
  console.error('❌  Usage: node scaffolder.mjs <slug> <type>')
  console.error(`    Types: ${VALID_TYPES.join(' | ')}`)
  process.exit(1)
}

if (!VALID_TYPES.includes(type)) {
  console.error(`❌  Invalid type "${type}". Must be one of: ${VALID_TYPES.join(', ')}`)
  process.exit(1)
}

const scaffoldDir = join(root, '_scaffold')
const outputDir   = join(root, slug)

if (!existsSync(scaffoldDir)) {
  console.error('❌  _scaffold/ directory not found.')
  process.exit(1)
}

if (existsSync(outputDir)) {
  console.error(`❌  Directory already exists: ${outputDir}`)
  process.exit(1)
}

console.log(`\n🚀  WebDeploy Scaffolder`)
console.log(`    Slug : ${slug}`)
console.log(`    Type : ${type}`)
console.log(`    Output: ${outputDir}\n`)

// ── Step 1: Copy scaffold files ──────────────────────────────────────────────
console.log('[1/4] Copying core files from _scaffold/...')
cpSync(scaffoldDir, outputDir, { recursive: true })

// ── Step 2: Replace {{SLUG}} placeholders ────────────────────────────────────
console.log('[2/4] Replacing {{SLUG}} placeholders...')
const PLACEHOLDER_FILES = [
  'api/src/Auth.php',
  'admin/package.json',
  'admin/index.html',
  'admin/src/pages/login/LoginPage.tsx',
  'website/package.json',
  'build.mjs',
  'build.bat',
  'build.sh',
]
for (const rel of PLACEHOLDER_FILES) {
  const fp = join(outputDir, rel)
  if (existsSync(fp)) {
    const original = readFileSync(fp, 'utf8')
    const replaced  = original.replaceAll('{{SLUG}}', slug)
    writeFileSync(fp, replaced)
    console.log(`    ✓ ${rel}`)
  }
}

// ── Step 3: Create AI placeholder files ──────────────────────────────────────
console.log('[3/4] Creating placeholder files for AI to fill...')

// Files AI must generate (common to all types)
const AI_COMMON = [
  'api/schema.sql',
  'api/src/Database.php',
  'api/src/bootstrap.php',
  'api/src/controllers/PublicController.php',
  'api/src/controllers/StatsController.php',
  'admin/src/App.tsx',
  'admin/src/components/layout/Sidebar.tsx',
  'admin/src/pages/dashboard/Dashboard.tsx',
  'admin/src/pages/settings/Settings.tsx',
  'admin/src/pages/contacts/ContactList.tsx',
  'admin/src/pages/slides/HeroSlideList.tsx',
  'admin/src/pages/slides/HeroSlideForm.tsx',
  'website/index.html',
  'website/src/App.tsx',
  'website/src/styles/template.css',
  'website/src/components/Header.tsx',
  'website/src/components/Footer.tsx',
  'website/src/components/HeroSlider.tsx',
  'website/src/components/Contact.tsx',
  'README.md',
]

// Entity files per type
const TYPE_ENTITIES = {
  cafe: {
    controllers: ['MenuCategoryController', 'MenuItemController', 'GalleryController', 'TestimonialController'],
    admin: [
      'admin/src/pages/menu/MenuCategoryList.tsx',
      'admin/src/pages/menu/MenuItemList.tsx',
      'admin/src/pages/menu/MenuItemForm.tsx',
      'admin/src/pages/gallery/GalleryPage.tsx',
      'admin/src/pages/testimonials/TestimonialList.tsx',
      'admin/src/pages/testimonials/TestimonialForm.tsx',
    ],
    website: [
      'website/src/components/Menu.tsx',
      'website/src/components/Gallery.tsx',
      'website/src/components/Testimonials.tsx',
      'website/src/components/About.tsx',
    ],
  },
  restaurant: {
    controllers: ['MenuCategoryController', 'MenuItemController', 'ReservationController', 'GalleryController', 'TestimonialController'],
    admin: [
      'admin/src/pages/menu/MenuCategoryList.tsx',
      'admin/src/pages/menu/MenuItemList.tsx',
      'admin/src/pages/menu/MenuItemForm.tsx',
      'admin/src/pages/reservations/ReservationList.tsx',
      'admin/src/pages/gallery/GalleryPage.tsx',
      'admin/src/pages/testimonials/TestimonialList.tsx',
      'admin/src/pages/testimonials/TestimonialForm.tsx',
    ],
    website: [
      'website/src/components/Menu.tsx',
      'website/src/components/Reservation.tsx',
      'website/src/components/Gallery.tsx',
      'website/src/components/Testimonials.tsx',
      'website/src/components/About.tsx',
    ],
  },
  spa: {
    controllers: ['ServiceCategoryController', 'ServiceController', 'BookingController', 'TestimonialController', 'TeamController'],
    admin: [
      'admin/src/pages/services/ServiceCategoryList.tsx',
      'admin/src/pages/services/ServiceList.tsx',
      'admin/src/pages/services/ServiceForm.tsx',
      'admin/src/pages/bookings/BookingList.tsx',
      'admin/src/pages/testimonials/TestimonialList.tsx',
      'admin/src/pages/testimonials/TestimonialForm.tsx',
      'admin/src/pages/team/TeamList.tsx',
      'admin/src/pages/team/TeamForm.tsx',
    ],
    website: [
      'website/src/components/Services.tsx',
      'website/src/components/Booking.tsx',
      'website/src/components/Testimonials.tsx',
      'website/src/components/Team.tsx',
      'website/src/components/About.tsx',
    ],
  },
  'spa-service': {
    controllers: ['ServiceCategoryController', 'ServiceController', 'BookingController', 'TestimonialController', 'TeamController'],
    admin: [
      'admin/src/pages/services/ServiceCategoryList.tsx',
      'admin/src/pages/services/ServiceList.tsx',
      'admin/src/pages/services/ServiceForm.tsx',
      'admin/src/pages/bookings/BookingList.tsx',
      'admin/src/pages/testimonials/TestimonialList.tsx',
      'admin/src/pages/testimonials/TestimonialForm.tsx',
      'admin/src/pages/team/TeamList.tsx',
      'admin/src/pages/team/TeamForm.tsx',
    ],
    website: [
      'website/src/components/Services.tsx',
      'website/src/components/Booking.tsx',
      'website/src/components/Testimonials.tsx',
      'website/src/components/Team.tsx',
      'website/src/components/About.tsx',
    ],
  },
  portfolio: {
    controllers: ['ProjectController', 'SkillGroupController', 'SkillController', 'TestimonialController'],
    admin: [
      'admin/src/pages/projects/ProjectList.tsx',
      'admin/src/pages/projects/ProjectForm.tsx',
      'admin/src/pages/skills/SkillGroupList.tsx',
      'admin/src/pages/skills/SkillList.tsx',
      'admin/src/pages/testimonials/TestimonialList.tsx',
      'admin/src/pages/testimonials/TestimonialForm.tsx',
    ],
    website: [
      'website/src/components/About.tsx',
      'website/src/components/Projects.tsx',
      'website/src/components/Skills.tsx',
      'website/src/components/Testimonials.tsx',
    ],
  },
  company: {
    controllers: ['ServiceController', 'TeamController', 'ProjectController', 'TestimonialController'],
    admin: [
      'admin/src/pages/services/ServiceList.tsx',
      'admin/src/pages/services/ServiceForm.tsx',
      'admin/src/pages/team/TeamList.tsx',
      'admin/src/pages/team/TeamForm.tsx',
      'admin/src/pages/projects/ProjectList.tsx',
      'admin/src/pages/projects/ProjectForm.tsx',
      'admin/src/pages/testimonials/TestimonialList.tsx',
      'admin/src/pages/testimonials/TestimonialForm.tsx',
    ],
    website: [
      'website/src/components/About.tsx',
      'website/src/components/Services.tsx',
      'website/src/components/Team.tsx',
      'website/src/components/Projects.tsx',
      'website/src/components/Testimonials.tsx',
    ],
  },
  blog: {
    controllers: ['PostController', 'CategoryController'],
    admin: [
      'admin/src/pages/posts/PostList.tsx',
      'admin/src/pages/posts/PostForm.tsx',
      'admin/src/pages/categories/CategoryList.tsx',
    ],
    website: [
      'website/src/components/PostList.tsx',
      'website/src/components/PostDetail.tsx',
      'website/src/components/About.tsx',
    ],
  },
}

const entityConfig = TYPE_ENTITIES[type]

// Collect all AI files for this type
const allAiFiles = [
  ...AI_COMMON,
  ...entityConfig.controllers.map(c => `api/src/controllers/${c}.php`),
  ...entityConfig.admin,
  ...entityConfig.website,
]

for (const rel of allAiFiles) {
  const fp = join(outputDir, rel)
  const dir = join(fp, '..')
  mkdirSync(dir, { recursive: true })
  if (!existsSync(fp)) {
    writeFileSync(fp, `// TODO: AI-generated — ${rel}\n`)
    console.log(`    📝 ${rel}`)
  }
}

// ── Step 4: Summary ──────────────────────────────────────────────────────────
console.log('\n[4/4] Done!\n')
console.log('─'.repeat(60))
console.log(`✅  Scaffold created: Sources/WebDeploy/${slug}/`)
console.log(`    Core files copied  : ${PLACEHOLDER_FILES.length + 20}+ files (ready to use)`)
console.log(`    AI placeholder files: ${allAiFiles.length} files (need AI to fill)`)
console.log('─'.repeat(60))
console.log('\n📋  Files AI (web-deploy-builder) must fill:')
allAiFiles.forEach(f => console.log(`    • ${f}`))
console.log('\n🤖  Run web-deploy-builder agent with:')
console.log(`    "Tạo website cho ${slug} (type: ${type}). Scaffold đã được tạo tại Sources/WebDeploy/${slug}/. Chỉ cần fill các TODO files."`)
console.log('')
