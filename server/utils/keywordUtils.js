const keywords = [
    // Angular & Frontend
    'angular', 'rxjs', 'ngrx', 'components', 'directives', 'services', 'pipes', 'modules',
    'frontend', 'web', 'typescript', 'ts', 'html', 'css', 'scss', 'sass', 'javascript', 'js',
    'api', 'observables', 'routing', 'state', 'forms', 'lazy loading', 'dependency injection',
    'change detection', 'template', 'ng-content', 'ng-template', 'zone.js', 'webpack',

    // Reactivity / State Management
    'store', 'actions', 'reducers', 'effects', 'selectors', 'immutable', 'behavior subject', 'subject',

    // Server & Data
    'rest', 'graphql', 'http', 'json', 'ajax', 'fetch', 'axios', 'socket', 'backend', 'database',

    // Hebrew equivalents
    'אנגולר', 'ריאקטיב', 'קומפוננטות', 'סרויסים', 'פייפס', 'מודולים', 'פרונטאנד', 'ווב',
    'טייפסקריפט', 'html', 'css', 'סאס', 'ג׳אווהסקריפט', 'api', 'צפיות', 'ראוטינג',
    'סטייט', 'פורמס', 'תלויות', 'דטקטשן', 'תבניות', 'שרת', 'מסד נתונים'
];

// Returns true if text contains any web dev keyword
function isWebDevQuestion(text) {
    const lower = text.toLowerCase();
    return keywords.some(k => lower.includes(k));
}

module.exports = { isWebDevQuestion };
