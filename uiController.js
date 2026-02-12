// UI Controller (Single Responsibility - UI Updates)
const UIController = {
    // Update city display
    updateCityDisplay(city) {

        updateHeaderCity(city);
    },
    
    // Update neighborhood selectors
    updateNeighborhoodDisplay(neighborhood) {
        if (neighborhood) {
            Utils.setElementValue('neighborhood', neighborhood);
            Utils.setElementValue('filterNeighborhood', neighborhood);
        }
    },
    
    // Clear form inputs
    clearForm() {
        const form = Utils.getElement('ratingForm');
        if (form) form.reset();
        Utils.setElementValue('opinion', '');
        AppState.clearRatings();
        document.querySelectorAll('.stars span').forEach(star => 
            star.classList.remove('active')
        );
    },
    
    // Update location type UI
    updateLocationTypeUI(type) {
        const isChildcare = type === 'childcare';
        const isSchools = type === 'schools';
        const isDoctors = type === 'doctors';
        const isServices = type === 'services';
        const isShops = type === 'shops';
        
        // Toggle buttons
        const btnNeighborhoods = Utils.getElement('btnNeighborhoods');
        const btnChildcare = Utils.getElement('btnChildcare');
        const btnSchools = Utils.getElement('btnSchools');
        const btnDoctors = Utils.getElement('btnDoctors');
        const btnServices = Utils.getElement('btnServices');
        const btnShops = Utils.getElement('btnShops');
        if (btnNeighborhoods) btnNeighborhoods.classList.toggle('active', !isChildcare && !isSchools && !isDoctors && !isServices && !isShops);
        if (btnChildcare) btnChildcare.classList.toggle('active', isChildcare);
        if (btnSchools) btnSchools.classList.toggle('active', isSchools);
        if (btnDoctors) btnDoctors.classList.toggle('active', isDoctors);
        if (btnServices) btnServices.classList.toggle('active', isServices);
        if (btnShops) btnShops.classList.toggle('active', isShops);
        
        // Show/hide form groups
        const neighborhoodGroup = Utils.getElement('neighborhood')?.closest('.form-group');
        const neighborhoodSelect = Utils.getElement('neighborhood');
        const doctorNameGroup = Utils.getElement('doctorNameGroup');
        const doctorNameField = Utils.getElement('doctorName');
        const specialtyGroup = Utils.getElement('specialtyGroup');
        const specialtyField = Utils.getElement('specialty');
        const shopCategoryGroup = Utils.getElement('shopCategoryGroup');
        const shopCategoryField = Utils.getElement('shopCategory');
        const shopNameGroup = Utils.getElement('shopNameGroup');
        const shopNameField = Utils.getElement('shopName');
        
        // Service fields
        const serviceCategoryGroup = Utils.getElement('serviceCategoryGroup');
        const serviceCategoryField = Utils.getElement('serviceCategory');
        const serviceNameGroup = Utils.getElement('serviceNameGroup');
        const serviceNameField = Utils.getElement('serviceName');
        const serviceCityGroup = Utils.getElement('serviceCityGroup');
        const serviceCityField = Utils.getElement('serviceCity');
        const serviceNeighborhoodGroup = Utils.getElement('serviceNeighborhoodGroup');
        const serviceNeighborhoodField = Utils.getElement('serviceNeighborhood');
        
        if (neighborhoodGroup) neighborhoodGroup.style.display = (isDoctors || isShops || isServices) ? 'none' : 'block';
        if (neighborhoodSelect) neighborhoodSelect.required = !(isDoctors || isShops || isServices);
        
        if (doctorNameGroup) doctorNameGroup.style.display = isDoctors ? 'block' : 'none';
        if (doctorNameField) doctorNameField.required = isDoctors;
        
        // Specialty for doctors
        if (specialtyGroup) specialtyGroup.style.display = isDoctors ? 'block' : 'none';
        if (specialtyField) specialtyField.required = isDoctors;
        
        // Shop fields - only for shops mode
        if (shopCategoryGroup) shopCategoryGroup.style.display = isShops ? 'block' : 'none';
        if (shopCategoryField) shopCategoryField.required = isShops;
        if (shopNameGroup) shopNameGroup.style.display = isShops ? 'none' : 'none'; // Initially hidden until category is selected
        if (shopNameField) shopNameField.required = isShops;
        
        // Service fields - only for services mode
        if (serviceCategoryGroup) serviceCategoryGroup.style.display = isServices ? 'block' : 'none';
        if (serviceCategoryField) serviceCategoryField.required = isServices;
        if (serviceNameGroup) serviceNameGroup.style.display = isServices ? 'block' : 'none';
        if (serviceNameField) serviceNameField.required = isServices;
        // Hide city selector - use current city automatically
        if (serviceCityGroup) serviceCityGroup.style.display = 'none';
        if (serviceCityField) serviceCityField.required = false;
        if (serviceNeighborhoodGroup) serviceNeighborhoodGroup.style.display = isServices ? 'block' : 'none';
        if (serviceNeighborhoodField) serviceNeighborhoodField.required = isServices;
        
        // Auto-populate service city and neighborhoods from current city
        if (isServices) {
            const currentCity = AppState.getCity();
            if (serviceCityField) {
                serviceCityField.innerHTML = `<option value="${currentCity}" selected>${currentCity}</option>`;
            }
            if (serviceNeighborhoodField) {
                const neighborhoods = cityNeighborhoods[currentCity] || [];
                serviceNeighborhoodField.innerHTML = '<option value="">Изберете квартал...</option>' +
                    neighborhoods.map(n => `<option value="${n}">${n}</option>`).join('');
            }
        }
        
        // Update search placeholder based on location type
        const searchInput = Utils.getElement('searchInput');
        if (searchInput) {
            const searchPlaceholders = {
                'neighborhood': 'Търси по квартал...',
                'childcare': 'Търси по детска градина...',
                'schools': 'Търси по училище...',
                'doctors': 'Търси по лекар...',
                'services': 'Търси по услуга...',
                'shops': 'Търси по магазин...'
            };
            searchInput.placeholder = searchPlaceholders[type] || 'Търси...';
        }
        
        // Update doctor name field label and placeholder based on type
        const doctorNameLabel = doctorNameGroup?.querySelector('label[for="doctorName"]');
        if (doctorNameLabel) {
            doctorNameLabel.textContent = 'Име на лекар:';
        }
        const doctorName = Utils.getElement('doctorName');
        if (doctorName) {
            doctorName.placeholder = 'Въведете име на лекар...';
        }
        
        // Update labels and placeholders
        const labels = {
            neighborhoodLabel: isChildcare ? 'Детска градина/ясла:' : (isSchools ? 'Училище:' : 'Квартал:'),
            neighborhoodPlaceholder: isChildcare ? 'Изберете детска градина...' : (isSchools ? 'Изберете училище...' : 'Изберете квартал...'),
            filterNeighborhoodPlaceholder: isDoctors ? 'Всички специалности' : (isServices ? 'Всички категории' : (isShops ? 'Всички магазини' : (isChildcare ? 'Всички детски градини' : (isSchools ? 'Всички училища' : 'Всички квартали')))),
            headerSubtitle: isDoctors
                ? `Оцени лекарите на град ${AppState.getCity()} и дай мнение за тях.`
                : (isServices
                    ? `Оцени услугите и изпълнителите и дай мнение за тях.`
                    : (isShops
                        ? `Оцени магазините на град ${AppState.getCity()} и дай мнение за тях.`
                        : (isChildcare 
                            ? `Оцени детските градини и ясли на град ${AppState.getCity()} и дай мнение за тях.`
                            : (isSchools
                                ? `Оцени училищата на град ${AppState.getCity()} и дай мнение за тях.`
                                : 'Оценете кварталите на всички областни градове по 10 критерия'))))
        };
        
        Object.entries(labels).forEach(([id, text]) => {
            const element = Utils.getElement(id);
            if (element) element.textContent = text;
        });
        
        // Update opinion placeholder
        const opinion = Utils.getElement('opinion');
        if (opinion) {
            opinion.placeholder = isDoctors
                ? 'Напишете вашето мнение за лекаря...'
                : (isServices
                    ? 'Напишете вашето мнение за услугата/изпълнителя...'
                    : (isShops
                        ? 'Напишете вашето мнение за магазина...'
                        : (isChildcare 
                            ? 'Напишете вашето мнение за детската градина...'
                            : (isSchools
                                ? 'Напишете вашето мнение за училището...'
                                : 'Напишете вашето мнение за квартала...'))));
        }
        
        // Toggle criteria sections
        const neighborhoodCriteria = Utils.getElement('neighborhoodCriteria');
        const childcareCriteria = Utils.getElement('childcareCriteria');
        const schoolsCriteria = Utils.getElement('schoolsCriteria');
        const shopsCriteria = Utils.getElement('shopsCriteria');
        const servicesCriteria = Utils.getElement('servicesCriteria');
        
        if (neighborhoodCriteria) {
            neighborhoodCriteria.style.display = (!isChildcare && !isSchools && !isDoctors && !isServices && !isShops) ? 'grid' : 'none';
        }
        if (childcareCriteria) {
            childcareCriteria.style.display = (isChildcare || isDoctors) ? 'grid' : 'none';
        }
        if (schoolsCriteria) {
            schoolsCriteria.style.display = isSchools ? 'grid' : 'none';
        }
        if (shopsCriteria) {
            shopsCriteria.style.display = isShops ? 'grid' : 'none';
        }
        if (servicesCriteria) {
            servicesCriteria.style.display = isServices ? 'grid' : 'none';
        }
        
        // Hide neighborhood filter for shops and services (they have their own location)
        const filterNeighborhoodContainer = Utils.getElement('filterNeighborhoodContainer');
        if (filterNeighborhoodContainer) {
            filterNeighborhoodContainer.style.display = (isShops || isServices) ? 'none' : 'block';
        }
        
        // Populate specialty dropdown if doctors mode
        if (isDoctors) {
            const specialtySelect = Utils.getElement('specialty');
            if (specialtySelect && typeof medicalSpecialties !== 'undefined') {
                specialtySelect.innerHTML = '<option value="">Изберете специалност...</option>';
                medicalSpecialties.forEach(specialty => {
                    const option = document.createElement('option');
                    option.value = specialty;
                    option.textContent = specialty;
                    specialtySelect.appendChild(option);
                });
            }
            
            // Populate filter dropdown with specialties for doctors
            const filterNeighborhood = Utils.getElement('filterNeighborhood');
            if (filterNeighborhood && typeof medicalSpecialties !== 'undefined') {
                filterNeighborhood.innerHTML = '<option value="" id="filterNeighborhoodPlaceholder">Всички специалности</option>';
                medicalSpecialties.forEach(specialty => {
                    const option = document.createElement('option');
                    option.value = specialty;
                    option.textContent = specialty;
                    filterNeighborhood.appendChild(option);
                });
            }
        }
        
        // Populate filter dropdown with service categories if services mode
        if (isServices) {
            const filterNeighborhood = Utils.getElement('filterNeighborhood');
            if (filterNeighborhood && typeof serviceCategories !== 'undefined') {
                filterNeighborhood.innerHTML = '<option value="" id="filterNeighborhoodPlaceholder">Всички категории</option>';
                Object.entries(serviceCategories).forEach(([key, cat]) => {
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = `${cat.emoji} ${cat.name}`;
                    filterNeighborhood.appendChild(option);
                });
            }
            // Show filter for services (by category)
            if (filterNeighborhoodContainer) {
                filterNeighborhoodContainer.style.display = 'block';
            }
        }
    },
    
    // Initialize star ratings
    initStarRatings() {
        document.querySelectorAll('.stars').forEach(starsContainer => {
            const criterion = starsContainer.dataset.criterion;
            AppState.setRating(criterion, 0);
            
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('span');
                star.className = 'star';
                star.textContent = '★';
                star.dataset.value = i;
                
                star.addEventListener('click', () => {
                    AppState.setRating(criterion, i);
                    updateStars(starsContainer, i);
                });
                
                starsContainer.appendChild(star);
            }
        });
    }
};

// Expose globally
window.UIController = UIController;
