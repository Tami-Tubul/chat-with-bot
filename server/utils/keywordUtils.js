const keywords = [
    // Angular Core
    'angular', 'ng', 'rxjs', 'ngrx', 'component', 'directive', 'service', 'pipe',
    'modules', 'observables', 'routing', 'forms', 'template-driven forms', 'reactive forms',
    'change detection', 'dependency injection', 'lazy loading', 'zone.js', 'ng-template',
    'ng-content', 'viewchild', 'contentchild', 'standalone', 'aot', 'jit',
    'ivy', 'cli', 'angular universal', 'ssr', 'schematics',

    // Frontend Core
    'frontend', 'web', 'typescript', 'ts', 'javascript', 'js', 'es6', 'esnext',
    'html', 'css', 'scss', 'sass', 'less', 'stylus',
    'dom', 'shadow dom', 'web', 'canvas', 'svg', 'responsive design',
    'flexbox', 'grid', 'animation', 'transition', 'media query', 'accessibility', 'a11y',

    // Build Tools
    'webpack', 'vite', 'esbuild', 'rollup', 'parcel', 'babel', 'tsconfig',
    'eslint', 'prettier',

    // State Management / Reactivity
    'store', 'actions', 'reducers', 'effects', 'selectors', 'facade',
    'immutable', 'subject', 'behavior subject', 'replay subject', 'async pipe',

    // Server / API
    'api', 'rest', 'graphql', 'http', 'https', 'json', 'xml', 'ajax',
    'fetch', 'axios', 'socket', 'websocket', 'signalr', 'cors', 'backend',
    'node', 'express', 'nest', 'fastify', 'koa', 'hapi',
    'database', 'sql', 'nosql', 'mongodb', 'postgres', 'mysql', 'sqlite',
    'redis', 'prisma', 'typeorm', 'mongoose', 'auth', 'jwt', 'oauth',

    // Testing
    'jest', 'jasmine', 'karma', 'mocha', 'chai', 'cypress', 'playwright', 'puppeteer',
    'unit test', 'integration test', 'e2e test', 'testbed',

    // DevOps / Tools
    'git', 'ci', 'cd', 'docker', 'kubernetes',
    'deploy', 'serverless', 'cloud', 'aws', 'gcp', 'azure',

    // Other Frameworks
    'react', 'vue', 'svelte', 'solid', 'ember', 'backbone',
    'next.js', 'nuxt', 'remix', 'astro',

    // General CS / Patterns
    'oop', 'functional programming', 'design patterns', 'mvc', 'mvvm',
    'clean architecture', 'microservices', 'monolith',

    // Hebrew equivalents
    'אנגולר', 'ריאקט', 'קומפוננטה', 'קומפוננטות', 'דיירקטיב',
    'סרויס', 'שירות', 'פייפ', 'מודול', 'ענן',
    'ראוטר', 'ראוטינג', 'טמפלט', 'פורם', 'פורמס', 'טמפלט פורמס', 'ריאקטיב פורמס',
    'צפיה', 'צפיות', 'דטקטשן', 'סטייט', 'בדיקה', 'בדיקות', 'יחידה', 'אנד טו אנד',
    'מטריאל', 'בוטסטראפ', 'טיילווינד', 'צ׳אקרה', 'קוברנטיס', 'דוקר', 'גיט'
];


// Returns true if text contains any web dev keyword
function isWebDevQuestion(text) {
    const lower = text.toLowerCase();
    return keywords.some(k => lower.includes(k));
}

module.exports = { isWebDevQuestion };
