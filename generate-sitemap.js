// Generate sitemap.xml for all cities and location types
const cities = [
    "София", "Пловдив", "Варна", "Бургас", "Благоевград", "Велико Търново",
    "Видин", "Враца", "Габрово", "Добрич", "Кърджали", "Кюстендил",
    "Ловеч", "Монтана", "Пазарджик", "Перник", "Плевен", "Разград",
    "Русе", "Силистра", "Сливен", "Смолян", "Стара Загора", "Търговище",
    "Хасково", "Шумен", "Ямбол"
];

// Major cities that have dedicated static HTML pages for neighborhoods
// These should NOT have ?city=X URLs in sitemap to avoid canonical issues
const citiesWithStaticPages = {
    'София': 'sofia.html',
    'Пловдив': 'plovdiv.html',
    'Варна': 'varna.html',
    'Бургас': 'burgas.html'
};

const locationTypes = [
    { path: '', name: 'Квартали', priority: '1.0' },
    { path: 'type=childcare', name: 'Детски градини', priority: '0.9' },
    { path: 'type=schools', name: 'Училища', priority: '0.9' },
    { path: 'type=doctors', name: 'Лекари', priority: '0.9' },
    { path: 'type=services', name: 'Услуги', priority: '0.9' },
    { path: 'type=shops', name: 'Магазини', priority: '0.8' }
];

function generateSitemap() {
    const baseURL = 'https://kvartali.eu';
    const today = new Date().toISOString().split('T')[0];
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
    xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
    xml += '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';
    
    // Add homepage
    xml += '  <!-- Main Pages -->\n';
    xml += '  <url>\n';
    xml += `    <loc>${baseURL}/</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>daily</changefreq>\n';
    xml += '    <priority>1.0</priority>\n';
    xml += '  </url>\n';
    
    // Add static pages
    xml += '  <url>\n';
    xml += `    <loc>${baseURL}/about.html</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
    xml += '  <url>\n';
    xml += `    <loc>${baseURL}/privacy.html</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.5</priority>\n';
    xml += '  </url>\n';
    xml += '  <url>\n';
    xml += `    <loc>${baseURL}/terms.html</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.5</priority>\n';
    xml += '  </url>\n';
    xml += '  <url>\n';
    xml += `    <loc>${baseURL}/blog.html</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
    
    // Add static city landing pages (canonical for neighborhoods in major cities)
    xml += '  <!-- Static City Landing Pages - Canonical for neighborhoods in major cities -->\n';
    Object.entries(citiesWithStaticPages).forEach(([city, page]) => {
        xml += '  <url>\n';
        xml += `    <loc>${baseURL}/${page}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.95</priority>\n';
        xml += '  </url>\n';
    });
    
    // Add category pages (type only, default Sofia)
    xml += '  <!-- Category Pages (Default Sofia) -->\n';
    locationTypes.forEach(type => {
        if (type.path === '') return; // Skip neighborhoods (homepage)
        xml += '  <url>\n';
        xml += `    <loc>${baseURL}/?${type.path}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += `    <priority>${type.priority}</priority>\n`;
        xml += '  </url>\n';
    });
    
    // Add city + type combinations
    // Skip neighborhood type for major cities (use static HTML pages instead)
    xml += '  <!-- City + Type Combinations -->\n';
    cities.forEach(city => {
        const hasStaticPage = citiesWithStaticPages[city];
        
        locationTypes.forEach(type => {
            // Skip if this is Sofia (already covered by category pages above)
            if (city === 'София') return;
            
            // Skip neighborhood type for cities with static pages
            if (type.path === '' && hasStaticPage) return;
            
            let url;
            if (type.path === '') {
                // Neighborhood type for non-major cities
                url = `${baseURL}/?city=${encodeURIComponent(city)}`;
            } else {
                // Other types for all non-Sofia cities
                url = `${baseURL}/?city=${encodeURIComponent(city)}&amp;${type.path}`;
            }
            
            xml += '  <url>\n';
            xml += `    <loc>${url}</loc>\n`;
            xml += `    <lastmod>${today}</lastmod>\n`;
            xml += '    <changefreq>weekly</changefreq>\n';
            xml += `    <priority>${type.priority}</priority>\n`;
            xml += '  </url>\n';
        });
    });
    
    xml += '</urlset>';
    
    return xml;
}

// Generate and log sitemap
const sitemap = generateSitemap();
console.log('Sitemap generated:');
console.log(sitemap);

// For Node.js environment, save to file
if (typeof require !== 'undefined' && require.main === module) {
    const fs = require('fs');
    fs.writeFileSync('sitemap.xml', sitemap, 'utf8');
    console.log('Sitemap saved to sitemap.xml');
}
