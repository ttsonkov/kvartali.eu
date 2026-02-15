// SEO Enhancements - Dynamic titles, meta tags, structured data

const SEOEnhancements = {
    init() {
        this.updatePageMeta();
        this.updateCanonicalURL();
        this.updateStructuredData();
        this.updateBreadcrumbs();
        this.updateHeroSection();
        this.initBackToTop();
        this.addFAQSchema();
        this.addLocalBusinessSchema();
        this.addPerformanceHints();
        this.trackWebVitals();
    },
    
    // Update hero section based on location type and city
    updateHeroSection() {
        const city = AppState.getCity();
        const locationType = AppState.getLocationType();
        
        const heroTitle = document.getElementById('seoHeroTitle');
        const heroDesc = document.getElementById('seoHeroDescription');
        const heroFeatures = document.getElementById('seoFeatures');
        
        if (!heroTitle || !heroDesc) return;
        
        // Define content for each location type
        const heroContent = {
            'neighborhood': {
                title: `🏆 Открийте най-добрите квартали в ${city}`,
                description: `KvartaliEU е <strong>първата българска платформа за общностни оценки</strong>, където реални жители споделят опита си за квартали в ${city}. Оценете и сравнете квартали по 10 критерия - локация, чистота, сигурност, транспорт и други.`,
                features: [
                    { icon: '📊', text: '10 критерия за оценка' },
                    { icon: '🏙️', text: '28 областни града' },
                    { icon: '👥', text: 'Реални мнения' },
                    { icon: '🔒', text: 'Анонимно и безплатно' }
                ]
            },
            'childcare': {
                title: `👶 Открийте най-добрата детска градина в ${city}`,
                description: `Търсите <strong>качествена детска градина</strong> за вашето дете в ${city}? Вижте рейтинги и отзиви от други родители. Помогнете на общността, като споделите своя опит с детските градини, които познавате.`,
                features: [
                    { icon: '⭐', text: 'Рейтинги от родители' },
                    { icon: '💬', text: 'Реални отзиви' },
                    { icon: '🔍', text: 'Лесно търсене' },
                    { icon: '📍', text: `Детски градини в ${city}` }
                ]
            },
            'schools': {
                title: `🎓 Открийте най-доброто училище в ${city}`,
                description: `Изберете <strong>правилното училище</strong> за вашето дете в ${city} с помощта на оценки от реални родители и ученици. Сравнете училища по качество на образованието, условия и персонал.`,
                features: [
                    { icon: '📚', text: 'Оценки на образованието' },
                    { icon: '👨‍🏫', text: 'Мнения за учители' },
                    { icon: '🏫', text: 'Условия и материална база' },
                    { icon: '📍', text: `Училища в ${city}` }
                ]
            },
            'doctors': {
                title: `⚕️ Намерете най-добрия лекар в ${city}`,
                description: `Търсите <strong>надежден лекар или специалист</strong> в ${city}? Вижте рейтинги и препоръки от реални пациенти. Покриваме всички медицински специалности - от общопрактикуващи лекари до тесни специалисти.`,
                features: [
                    { icon: '🩺', text: 'Всички специалности' },
                    { icon: '⭐', text: 'Оценки от пациенти' },
                    { icon: '💬', text: 'Реални отзиви' },
                    { icon: '📍', text: `Лекари в ${city}` }
                ]
            },
            'services': {
                title: `🔧 Намерете надежден майстор в ${city}`,
                description: `Търсите <strong>качествен специалист</strong> в ${city}? Вижте рейтинги на: <strong>⚡ Електричари</strong>, <strong>🔧 ВИК майстори</strong>, <strong>🎨 Бояджии и шпакловчици</strong>, <strong>🔨 Строителни майстори</strong>, <strong>⚖️ Адвокати</strong>, <strong>📚 Преподаватели</strong>, <strong>👶 Детегледачки</strong>, <strong>💇 Фризьори и козметици</strong>, <strong>🧹 Почистване</strong>. Всички оценки са от реални клиенти!`,
                features: [
                    { icon: '⚡', text: 'Електричари' },
                    { icon: '🔧', text: 'ВИК майстори' },
                    { icon: '🎨', text: 'Бояджии' },
                    { icon: '🔨', text: 'Строителни майстори' },
                    { icon: '⚖️', text: 'Адвокати' },
                    { icon: '💇', text: 'Красота и здраве' }
                ]
            },
            'shops': {
                title: `🛒 Оценки на магазини и търговски вериги в България`,
                description: `Сравнете <strong>супермаркети, аптеки, фитнес центрове и други магазини</strong> в цяла България. Вижте кои вериги предлагат най-добро съотношение цена-качество според реални клиенти.`,
                features: [
                    { icon: '🛒', text: 'Супермаркети' },
                    { icon: '💊', text: 'Аптеки' },
                    { icon: '💪', text: 'Фитнес центрове' },
                    { icon: '🏪', text: 'Магазини за дома' }
                ]
            }
        };
        
        const content = heroContent[locationType] || heroContent['neighborhood'];
        
        // Update title and description
        heroTitle.innerHTML = content.title;
        heroDesc.innerHTML = content.description;
        
        // Update features
        if (heroFeatures) {
            heroFeatures.innerHTML = content.features.map(f => `
                <div class="seo-feature">
                    <span class="seo-icon">${f.icon}</span>
                    <span>${f.text}</span>
                </div>
            `).join('');
        }
    },
    
    // Update title and meta tags based on current state
    updatePageMeta() {
        const city = AppState.getCity();
        const locationType = AppState.getLocationType();
        
        const typeNames = {
            'neighborhood': 'Квартали',
            'childcare': 'Детски градини',
            'schools': 'Училища',
            'doctors': 'Лекари',
            'services': 'Услуги',
            'shops': 'Магазини'
        };
        
        const typeDescriptions = {
            'neighborhood': 'квартали с рейтинги по 10 критерия',
            'childcare': 'детски градини с отзиви и рейтинги',
            'schools': 'училища с отзиви и рейтинги',
            'doctors': 'лекари и специалисти с оценки',
            'services': 'услуги и изпълнители с отзиви и рейтинги',
            'shops': 'магазини и търговски вериги с рейтинги'
        };
        
        const typeName = typeNames[locationType] || 'Квартали';
        const typeDesc = typeDescriptions[locationType] || 'квартали с рейтинги по 10 критерия';
        
        // Update title with better keyword targeting
        let title;
        if (city === 'София') {
            title = `${typeName} в София — KvartaliEU | Рейтинги и Отзиви 2026`;
        } else {
            title = `${typeName} в ${city} — KvartaliEU | Оценки от Реални Потребители`;
        }
        document.title = title;
        
        // Update meta description with action-oriented text
        const description = `Открийте най-добрите ${typeDesc} в ${city}. ✓ Рейтинги от реални жители ✓ Сравнение ✓ Подробни отзиви. Гласувайте и споделете мнението си!`;
        this.updateMetaTag('description', description);
        
        // Update OG tags for better social sharing
        this.updateMetaTag('og:title', title, 'property');
        this.updateMetaTag('og:description', description, 'property');
        this.updateMetaTag('og:url', window.location.href, 'property');
        this.updateMetaTag('og:type', 'website', 'property');
        
        // Update Twitter tags
        this.updateMetaTag('twitter:title', title);
        this.updateMetaTag('twitter:description', description);
        this.updateMetaTag('twitter:card', 'summary_large_image');
        
        // Add hreflang for Bulgarian content
        this.updateLinkTag('alternate', window.location.href, 'hreflang', 'bg');
        this.updateLinkTag('alternate', window.location.href, 'hreflang', 'x-default');
        
        // Update keywords dynamically
        const keywords = this.generateKeywords(city, locationType);
        this.updateMetaTag('keywords', keywords);
        
        // Add article meta for reviews
        this.updateMetaTag('article:section', typeName, 'property');
        this.updateMetaTag('article:tag', city, 'property');
    },
    
    // Generate dynamic keywords based on context
    generateKeywords(city, locationType) {
        const baseKeywords = ['рейтинг', 'отзиви', 'мнения', 'оценки', 'България'];
        const typeKeywords = {
            'neighborhood': ['квартали', 'жилищни райони', 'живот', 'инфраструктура', 'безопасност'],
            'childcare': ['детски градини', 'ясли', 'предучилищно', 'деца', 'родители'],
            'schools': ['училища', 'образование', 'ученици', 'учители', 'класове'],
            'doctors': ['лекари', 'здраве', 'медицина', 'специалисти', 'клиники'],
            'services': ['услуги', 'майстори', 'електричари', 'ВИК', 'ремонти', 'адвокати'],
            'shops': ['магазини', 'супермаркети', 'търговия', 'цени', 'качество']
        };
        
        const cityKeywords = [city, `${city} квартали`, `най-добри ${city}`];
        const specific = typeKeywords[locationType] || typeKeywords['neighborhood'];
        
        return [...baseKeywords, ...specific, ...cityKeywords].join(', ');
    },
    
    // Update or create link tags
    updateLinkTag(rel, href, attr = null, attrValue = null) {
        let selector = `link[rel="${rel}"]`;
        if (attr) {
            selector += `[${attr}="${attrValue}"]`;
        }
        
        let link = document.querySelector(selector);
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', rel);
            if (attr) {
                link.setAttribute(attr, attrValue);
            }
            document.head.appendChild(link);
        }
        link.setAttribute('href', href);
    },
    
    updateMetaTag(name, content, attribute = 'name') {
        let meta = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attribute, name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    },
    
    // Update canonical URL based on current page
    // Maps major cities to their static HTML pages to avoid duplicate content issues
    updateCanonicalURL() {
        const city = AppState.getCity();
        const locationType = AppState.getLocationType();
        
        const baseURL = 'https://kvartali.eu';
        
        // Map major cities to their static pages (for neighborhood type only)
        const cityToStaticPage = {
            'София': '/sofia.html',
            'Пловдив': '/plovdiv.html',
            'Варна': '/varna.html',
            'Бургас': '/burgas.html'
        };
        
        let canonicalURL;
        
        // If viewing neighborhoods for a major city, use the static page as canonical
        if (locationType === 'neighborhood' && cityToStaticPage[city]) {
            canonicalURL = `${baseURL}${cityToStaticPage[city]}`;
        } else {
            // For other combinations, build URL with parameters
            // Parameter order: city first, then type (matches sitemap)
            const params = new URLSearchParams();
            
            // Add city if not Sofia (default)
            if (city && city !== 'София') {
                params.set('city', city);
            }
            
            // Add type if not neighborhood (default)
            if (locationType && locationType !== 'neighborhood') {
                params.set('type', locationType);
            }
            
            const queryString = params.toString() ? `/?${params.toString()}` : '/';
            canonicalURL = `${baseURL}${queryString}`;
        }
        
        let link = document.querySelector('link[rel="canonical"]');
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
        }
        link.setAttribute('href', canonicalURL);
    },
    
    // Update breadcrumbs based on location type
    updateBreadcrumbs() {
        const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
        if (!breadcrumbCurrent) return;
        
        const locationType = AppState.getLocationType();
        const city = AppState.getCity();
        
        const typeNames = {
            'neighborhood': 'Квартали',
            'childcare': 'Детски градини',
            'schools': 'Училища',
            'doctors': 'Лекари',
            'services': 'Услуги',
            'shops': 'Магазини'
        };
        
        const typeName = typeNames[locationType] || 'Квартали';
        breadcrumbCurrent.textContent = `${typeName} в ${city}`;
    },
    
    // Initialize back to top button
    initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });
        
        // Smooth scroll to top
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Track in analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'back_to_top', {
                    event_category: 'engagement'
                });
            }
        });
    },
    
    // Update structured data based on location type
    updateStructuredData() {
        const city = AppState.getCity();
        const locationType = AppState.getLocationType();
        
        // Remove existing dynamic structured data
        const existing = document.querySelector('script[type="application/ld+json"]#dynamic-schema');
        if (existing) {
            existing.remove();
        }
        
        let schema;
        
        if (locationType === 'neighborhood') {
            schema = {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": `Квартали в ${city} - Рейтинги и Оценки`,
                "description": `Класация на квартали в ${city}, България. Рейтинги по 10 критерия от реални жители.`,
                "url": window.location.href,
                "numberOfItems": "50+",
                "itemListOrder": "https://schema.org/ItemListOrderDescending"
            };
        } else if (locationType === 'childcare') {
            schema = {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": `Детски градини в ${city}`,
                "description": `Списък и оценки на детски градини в ${city}. Отзиви от родители.`,
                "url": window.location.href,
                "itemListElement": []
            };
        } else if (locationType === 'schools') {
            schema = {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": `Училища в ${city}`,
                "description": `Списък и оценки на училища в ${city}. Отзиви от родители и ученици.`,
                "url": window.location.href,
                "itemListElement": []
            };
        } else if (locationType === 'doctors') {
            schema = {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": `Лекари и Специалисти в ${city}`,
                "description": `Оценки на лекари и медицински специалисти в ${city}. Рейтинги от пациенти.`,
                "url": window.location.href,
                "itemListElement": []
            };
        } else if (locationType === 'services') {
            schema = {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": `Услуги и Изпълнители в България`,
                "description": `Оценки на услуги и изпълнители - електричари, ВИК, майстори, адвокати и други. Рейтинги от клиенти.`,
                "url": window.location.href,
                "itemListElement": []
            };
        } else if (locationType === 'shops') {
            schema = {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": `Магазини и Търговски Вериги в ${city}`,
                "description": `Оценки на магазини, супермаркети и търговски вериги в ${city}.`,
                "url": window.location.href,
                "itemListElement": []
            };
        }
        
        // Add schema to page
        if (schema) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.id = 'dynamic-schema';
            script.textContent = JSON.stringify(schema, null, 2);
            document.head.appendChild(script);
        }
        
        // Update breadcrumb schema
        this.updateBreadcrumbSchema();
    },
    
    // Update breadcrumb structured data
    updateBreadcrumbSchema() {
        const city = AppState.getCity();
        const locationType = AppState.getLocationType();
        
        const existing = document.querySelector('script[type="application/ld+json"]#breadcrumb-schema');
        if (existing) {
            existing.remove();
        }
        
        const typeNames = {
            'neighborhood': 'Квартали',
            'childcare': 'Детски градини',
            'schools': 'Училища',
            'doctors': 'Лекари',
            'services': 'Услуги',
            'shops': 'Магазини'
        };
        
        const typeName = typeNames[locationType] || 'Квартали';
        
        const schema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Начало",
                    "item": "https://kvartali.eu"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": typeName,
                    "item": `https://kvartali.eu/#${locationType}`
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": city,
                    "item": `https://kvartali.eu/?city=${encodeURIComponent(city)}&type=${locationType}`
                }
            ]
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'breadcrumb-schema';
        script.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(script);
    },
    
    // Add FAQ structured data for rich snippets
    addFAQSchema() {
        const locationType = AppState.getLocationType();
        const city = AppState.getCity();
        
        const faqByType = {
            'neighborhood': [
                {
                    question: `Кои са най-добрите квартали в ${city}?`,
                    answer: `Най-добрите квартали в ${city} са класирани на база 10 критерия: чистота, безопасност, инфраструктура, зелени площи, транспорт и други. Вижте актуалния рейтинг на KvartaliEU.`
                },
                {
                    question: 'Как се изчислява рейтингът на кварталите?',
                    answer: 'Рейтингът се изчислява като средна стойност от оценките на реални жители по 10 критерия: чистота, безопасност, инфраструктура, зелени площи, транспорт, шум, паркиране, съседи, цени и общо впечатление.'
                },
                {
                    question: 'Мога ли да добавя оценка за моя квартал?',
                    answer: 'Да! Изберете вашия град и квартал, оценете по всички критерии от 1 до 5 звезди и споделете мнението си. Вашата оценка ще помогне на други потребители.'
                },
                {
                    question: `Кой квартал в ${city} е най-безопасен?`,
                    answer: `Вижте рейтинга по критерий "Безопасност" на KvartaliEU за ${city}. Оценките са от реални жители и се актуализират постоянно.`
                },
                {
                    question: `Къде да живея в ${city} с деца?`,
                    answer: `За семейства с деца препоръчваме да разгледате кварталите с високи оценки по критериите "Училища и ДГ", "Безопасност" и "Зелени площи" в ${city}.`
                },
                {
                    question: 'Колко често се актуализират рейтингите?',
                    answer: 'Рейтингите се актуализират в реално време при всяка нова оценка от потребител. Средните стойности се преизчисляват автоматично.'
                }
            ],
            'childcare': [
                {
                    question: `Как да избера детска градина в ${city}?`,
                    answer: `На KvartaliEU можете да видите рейтинги и отзиви за детски градини в ${city} от други родители. Оценките включват критерии като персонал, хигиена, храна и програма.`
                },
                {
                    question: 'Как се оценяват детските градини?',
                    answer: 'Детските градини се оценяват по 5 критерия: персонал, хигиена, храна, програма и общо впечатление. Рейтингът е базиран на отзиви от реални родители.'
                },
                {
                    question: `Коя е най-добрата детска градина в ${city}?`,
                    answer: `Вижте актуалната класация на детски градини в ${city} на KvartaliEU, базирана на оценки от реални родители.`
                },
                {
                    question: 'Как да подам сигнал за проблем в детска градина?',
                    answer: 'Можете да споделите вашия опит чрез оценка на съответната детска градина. Вашият отзив ще помогне на други родители да вземат информирано решение.'
                }
            ],
            'schools': [
                {
                    question: `Кои са най-добрите училища в ${city}?`,
                    answer: `Вижте класацията на училища в ${city} с рейтинги от родители и ученици. Оценките включват преподаватели, материална база, безопасност и програма.`
                },
                {
                    question: 'По какви критерии се оценяват училищата?',
                    answer: 'Училищата се оценяват по: качество на образованието, преподаватели, материална база, извънкласни дейности и общо впечатление.'
                },
                {
                    question: `Кое училище в ${city} има най-добри учители?`,
                    answer: `Проверете рейтингите по критерий "Преподаватели" за училища в ${city} на KvartaliEU.`
                }
            ],
            'doctors': [
                {
                    question: `Как да намеря добър лекар в ${city}?`,
                    answer: `На KvartaliEU можете да видите оценки на лекари в ${city} от реални пациенти. Рейтингите включват професионализъм, отношение, чакане и резултати.`
                },
                {
                    question: 'Какви специалности лекари мога да оценя?',
                    answer: 'Можете да оценявате всички медицински специалности: общопрактикуващи лекари, педиатри, стоматолози, кардиолози, гинеколози и много други.'
                },
                {
                    question: `Кой е най-добрият зъболекар в ${city}?`,
                    answer: `Вижте рейтингите на стоматолози в ${city} на KvartaliEU, базирани на отзиви от реални пациенти.`
                },
                {
                    question: 'Как да оценя лекар анонимно?',
                    answer: 'Всички оценки в KvartaliEU са анонимни. Просто изберете лекаря и дайте вашата оценка - никакви лични данни не се показват.'
                }
            ],
            'services': [
                {
                    question: 'Как да намеря надежден майстор?',
                    answer: 'В секция Услуги можете да видите оценки на електричари, ВИК майстори, бояджии и други специалисти. Рейтингите са от реални клиенти.'
                },
                {
                    question: 'Какви услуги мога да оценя?',
                    answer: 'Можете да оценявате: електричари, ВИК майстори, бояджии, шпакловчици, строители, адвокати, преподаватели, детегледачки, фризьори, козметици и много други.'
                },
                {
                    question: 'Как да избегна некачествени майстори?',
                    answer: 'Проверете рейтингите и отзивите на KvartaliEU преди да наемете майстор. Обърнете внимание на критериите "Качество" и "Коректност".'
                },
                {
                    question: 'Мога ли да препоръчам майстор?',
                    answer: 'Да! Ако сте доволни от работата на даден специалист, можете да го оцените положително и да споделите вашия опит, за да помогнете на други.'
                }
            ],
            'shops': [
                {
                    question: `Кои са най-добрите магазини в ${city}?`,
                    answer: `Вижте рейтинги на магазини и супермаркети в ${city}. Оценките включват цени, качество, обслужване и асортимент.`
                },
                {
                    question: 'Какви магазини мога да оценя?',
                    answer: 'Можете да оценявате супермаркети, аптеки, фитнес центрове, магазини за дома, книжарници и всякакви търговски обекти.'
                },
                {
                    question: 'Кой супермаркет има най-добри цени?',
                    answer: 'Проверете рейтингите по критерий "Цени" за супермаркети на KvartaliEU, за да видите кой предлага най-добро съотношение цена-качество.'
                }
            ]
        };
        
        const faqs = faqByType[locationType] || faqByType['neighborhood'];
        
        const schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        };
        
        // Remove existing FAQ schema
        const existing = document.querySelector('script[type="application/ld+json"]#faq-schema');
        if (existing) existing.remove();
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'faq-schema';
        script.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(script);
    },
    
    // Add LocalBusiness schema for better local SEO
    addLocalBusinessSchema() {
        const schema = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "KvartaliEU",
            "alternateName": "Квартали ЕУ",
            "url": "https://kvartali.eu",
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://kvartali.eu/?search={search_term_string}"
                },
                "query-input": "required name=search_term_string"
            },
            "sameAs": [
                "https://facebook.com/kvartali.eu",
                "https://twitter.com/kvartali_eu"
            ]
        };
        
        const existing = document.querySelector('script[type="application/ld+json"]#website-schema');
        if (existing) existing.remove();
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'website-schema';
        script.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(script);
    },
    
    // Add performance hints for faster loading
    addPerformanceHints() {
        // Preload critical resources
        const preloads = [
            { href: 'style.css', as: 'style' },
            { href: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js', as: 'script' }
        ];
        
        preloads.forEach(({ href, as }) => {
            if (!document.querySelector(`link[rel="preload"][href="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = href;
                link.as = as;
                document.head.appendChild(link);
            }
        });
        
        // Add dns-prefetch for external resources
        const dnsPrefetch = [
            'https://www.googletagmanager.com',
            'https://pagead2.googlesyndication.com',
            'https://firestore.googleapis.com'
        ];
        
        dnsPrefetch.forEach(href => {
            if (!document.querySelector(`link[rel="dns-prefetch"][href="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'dns-prefetch';
                link.href = href;
                document.head.appendChild(link);
            }
        });
        
        // Add preconnect for critical third-party origins
        const preconnect = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];
        
        preconnect.forEach(href => {
            if (!document.querySelector(`link[rel="preconnect"][href="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = href;
                link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
            }
        });
        
        // Lazy load images below the fold
        this.setupLazyLoading();
        
        // Add fetchpriority hint for critical images
        const heroImages = document.querySelectorAll('.seo-hero-section img, .hero img');
        heroImages.forEach(img => {
            img.setAttribute('fetchpriority', 'high');
            img.setAttribute('decoding', 'async');
        });
    },
    
    // Setup lazy loading for images
    setupLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading supported
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.src = img.dataset.src;
                img.loading = 'lazy';
            });
        } else {
            // Fallback for older browsers using IntersectionObserver
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '50px 0px' });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    },
    
    // Track Core Web Vitals for SEO
    trackWebVitals() {
        if (typeof gtag === 'undefined') return;
        
        // Track Largest Contentful Paint (LCP)
        try {
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                gtag('event', 'web_vitals', {
                    event_category: 'Web Vitals',
                    event_label: 'LCP',
                    value: Math.round(lastEntry.startTime),
                    non_interaction: true
                });
            }).observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) { /* Browser doesn't support */ }
        
        // Track First Input Delay (FID)
        try {
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    gtag('event', 'web_vitals', {
                        event_category: 'Web Vitals',
                        event_label: 'FID',
                        value: Math.round(entry.processingStart - entry.startTime),
                        non_interaction: true
                    });
                });
            }).observe({ type: 'first-input', buffered: true });
        } catch (e) { /* Browser doesn't support */ }
        
        // Track Cumulative Layout Shift (CLS)
        try {
            let clsValue = 0;
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
            }).observe({ type: 'layout-shift', buffered: true });
            
            // Report CLS on page hide
            window.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') {
                    gtag('event', 'web_vitals', {
                        event_category: 'Web Vitals',
                        event_label: 'CLS',
                        value: Math.round(clsValue * 1000),
                        non_interaction: true
                    });
                }
            });
        } catch (e) { /* Browser doesn't support */ }
        
        // Track Interaction to Next Paint (INP) - New Core Web Vital
        try {
            let inpValue = 0;
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    // Track the longest interaction
                    if (entry.duration > inpValue) {
                        inpValue = entry.duration;
                    }
                }
            }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
            
            // Report INP on page hide
            window.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden' && inpValue > 0) {
                    gtag('event', 'web_vitals', {
                        event_category: 'Web Vitals',
                        event_label: 'INP',
                        value: Math.round(inpValue),
                        non_interaction: true
                    });
                }
            });
        } catch (e) { /* Browser doesn't support */ }
        
        // Track Time to First Byte (TTFB)
        try {
            const navigationEntry = performance.getEntriesByType('navigation')[0];
            if (navigationEntry) {
                gtag('event', 'web_vitals', {
                    event_category: 'Web Vitals',
                    event_label: 'TTFB',
                    value: Math.round(navigationEntry.responseStart),
                    non_interaction: true
                });
            }
        } catch (e) { /* Browser doesn't support */ }
    },
    
    // Add Review schema for individual items
    addReviewSchema(item, locationType) {
        if (!item || !item.totalAvg) return;
        
        const typeSchemaTypes = {
            'neighborhood': 'Place',
            'childcare': 'EducationalOrganization',
            'schools': 'School',
            'doctors': 'Physician',
            'services': 'LocalBusiness',
            'shops': 'Store'
        };
        
        const schemaType = typeSchemaTypes[locationType] || 'Place';
        
        const schema = {
            "@context": "https://schema.org",
            "@type": schemaType,
            "name": item.name,
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": item.totalAvg.toFixed(1),
                "bestRating": "5",
                "worstRating": "1",
                "ratingCount": item.neighborhoodRatings?.length || 1,
                "reviewCount": item.neighborhoodRatings?.filter(r => r.comment)?.length || 0
            }
        };
        
        // Add address for local businesses
        if (item.city) {
            schema.address = {
                "@type": "PostalAddress",
                "addressLocality": item.city,
                "addressCountry": "BG"
            };
        }
        
        return schema;
    },
    
    // Generate ItemList schema with individual reviews
    addItemListWithReviews(items, locationType) {
        if (!items || items.length === 0) return;
        
        const city = AppState.getCity();
        const typeNames = {
            'neighborhood': 'Квартали',
            'childcare': 'Детски градини',
            'schools': 'Училища',
            'doctors': 'Лекари',
            'services': 'Услуги',
            'shops': 'Магазини'
        };
        
        const schema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": `${typeNames[locationType] || 'Квартали'} в ${city}`,
            "description": `Класация на ${typeNames[locationType]?.toLowerCase() || 'квартали'} в ${city} с рейтинги от реални потребители`,
            "url": window.location.href,
            "numberOfItems": items.length,
            "itemListElement": items.slice(0, 10).map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": this.addReviewSchema(item, locationType)
            }))
        };
        
        const existing = document.querySelector('script[type="application/ld+json"]#itemlist-reviews-schema');
        if (existing) existing.remove();
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'itemlist-reviews-schema';
        script.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(script);
    },
    
    // Generate AggregateRating schema for items with ratings
    addAggregateRatingSchema(items) {
        if (!items || items.length === 0) return;
        
        const locationType = AppState.getLocationType();
        const city = AppState.getCity();
        
        // Calculate aggregate stats
        const totalRatings = items.reduce((sum, item) => sum + (item.neighborhoodRatings?.length || 1), 0);
        const avgRating = items.reduce((sum, item) => sum + (item.totalAvg || 0), 0) / items.length;
        
        const typeNames = {
            'neighborhood': 'Квартал',
            'childcare': 'Детска градина',
            'schools': 'Училище',
            'doctors': 'Лекар',
            'services': 'Услуга',
            'shops': 'Магазин'
        };
        
        const schema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": `${typeNames[locationType] || 'Квартал'} рейтинги в ${city}`,
            "description": `Рейтинги и отзиви за ${typeNames[locationType]?.toLowerCase() || 'квартали'} в ${city}`,
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": avgRating.toFixed(1),
                "bestRating": "5",
                "worstRating": "1",
                "ratingCount": totalRatings
            }
        };
        
        const existing = document.querySelector('script[type="application/ld+json"]#aggregate-rating-schema');
        if (existing) existing.remove();
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'aggregate-rating-schema';
        script.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(script);
    },
    
    // Call this when location type or city changes
    refresh() {
        this.updatePageMeta();
        this.updateCanonicalURL();
        this.updateStructuredData();
        this.updateBreadcrumbs();
        this.updateHeroSection();
        this.addFAQSchema();
    }
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        SEOEnhancements.init();
    });
} else {
    SEOEnhancements.init();
}

// Expose globally
window.SEOEnhancements = SEOEnhancements;
