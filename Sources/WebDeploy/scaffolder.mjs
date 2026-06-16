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
console.log('[1/5] Copying core files from _scaffold/...')
cpSync(scaffoldDir, outputDir, {
  recursive: true,
  filter: (src) => !src.includes('_scaffold' + (process.platform === 'win32' ? '\\' : '/') + 'types'),
})

// ── Step 2: Replace {{SLUG}} placeholders ────────────────────────────────────
console.log('[2/5] Replacing {{SLUG}} placeholders...')
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

// ── Step 3: Copy common type files (HeroSlide pages, ContactList) ────────────
console.log('[3/5] Copying common type files...')
const commonTypesDir = join(root, '_scaffold', 'types', '_common')
if (existsSync(commonTypesDir)) {
  cpSync(commonTypesDir, outputDir, { recursive: true })
  console.log('    ✓ HeroSlideList.tsx, HeroSlideForm.tsx, ContactList.tsx')
}

// ── Step 4: Copy type-specific scaffold files ─────────────────────────────────
console.log('[4/5] Copying type-specific scaffold files...')

const TYPE_GROUP_MAP = {
  restaurant: 'restaurant',
  cafe: 'cafe',
  'spa-service': 'spa',
  spa: 'spa',
  portfolio: 'portfolio',
  company: 'company',
  blog: 'blog',
}
const typeGroup = TYPE_GROUP_MAP[type]
const typeDir = join(root, '_scaffold', 'types', typeGroup)
if (existsSync(typeDir)) {
  cpSync(typeDir, outputDir, { recursive: true })
  console.log(`    ✓ Type-specific files for "${typeGroup}"`)
} else {
  console.log(`    ℹ No pre-built scaffold for type "${typeGroup}" — AI will generate all entity files`)
}

// ── Step 5: Create AI placeholder files ──────────────────────────────────────
console.log('[5/5] Creating placeholder files for AI to fill...')

// Files AI must generate (common to all types)
// Note: HeroSlideList, HeroSlideForm, ContactList are now scaffolded — removed from AI list
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
  'website/index.html',
  'website/src/App.tsx',
  'website/src/styles/template.css',
  'website/src/components/Header.tsx',
  'website/src/components/Footer.tsx',
  'website/src/components/HeroSlider.tsx',
  'website/src/components/Contact.tsx',
  'README.md',
]

// Entity files per type — only files NOT already scaffolded from _scaffold/types/
const TYPE_ENTITIES = {
  cafe: {
    // All controllers scaffolded from _scaffold/types/cafe/
    controllers: [],
    // All admin pages scaffolded from _scaffold/types/cafe/
    admin: [],
    website: [
      'website/src/components/Menu.tsx',
      'website/src/components/Gallery.tsx',
      'website/src/components/Testimonials.tsx',
      'website/src/components/About.tsx',
    ],
  },
  restaurant: {
    // All controllers scaffolded from _scaffold/types/restaurant/
    controllers: [],
    // All admin pages scaffolded from _scaffold/types/restaurant/
    admin: [],
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

// ── Summary ──────────────────────────────────────────────────────────────────
console.log('\n[Done!]\n')
console.log('─'.repeat(60))
console.log(`✅  Scaffold created: Sources/WebDeploy/${slug}/`)
console.log(`    Core files copied  : ${PLACEHOLDER_FILES.length + 20}+ files (ready to use)`)
console.log(`    AI placeholder files: ${allAiFiles.length} files (need AI to fill)`)
console.log('─'.repeat(60))
console.log('\n📋  Files AI (web-deploy-builder) must fill:')
allAiFiles.forEach(f => console.log(`    • ${f}`))
console.log('\n🤖  Run web-deploy-builder agent with:')
console.log(`    "Tao website cho ${slug} (type: ${type}). Scaffold da duoc tao tai Sources/WebDeploy/${slug}/. Chi can fill cac TODO files."`)
console.log('')
