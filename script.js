// ===== SMOOTH ANIMATIONS ON SCROLL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Observe all article cards
    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach(card => observer.observe(card));

    // ===== CATEGORY FILTERING =====
    const categoryLinks = document.querySelectorAll('.category-nav a, .footer-section a[data-category]');
    const articles = document.querySelectorAll('.article-card');

    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');

            // Update active state
            document.querySelectorAll('.category-nav a').forEach(l => l.classList.remove('active'));
            if (link.classList.contains('category-nav')) {
                link.classList.add('active');
            }

            // Filter articles with smooth animation
            articles.forEach((article, index) => {
                const articleCategory = article.getAttribute('data-category');
                
                if (category === 'all' || articleCategory === category) {
                    setTimeout(() => {
                        article.style.display = 'block';
                        setTimeout(() => {
                            article.style.opacity = '1';
                            article.style.transform = 'translateY(0)';
                        }, 50);
                    }, index * 100);
                } else {
                    article.style.opacity = '0';
                    article.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        article.style.display = 'none';
                    }, 300);
                }
            });

            // Scroll to articles grid smoothly
            document.querySelector('.articles-grid').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // ===== SEARCH FUNCTIONALITY =====
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        articles.forEach((article, index) => {
            const title = article.querySelector('.article-title').textContent.toLowerCase();
            const excerpt = article.querySelector('.article-excerpt').textContent.toLowerCase();
            const category = article.querySelector('.category-badge').textContent.toLowerCase();

            if (title.includes(searchTerm) || excerpt.includes(searchTerm) || category.includes(searchTerm)) {
                setTimeout(() => {
                    article.style.display = 'block';
                    setTimeout(() => {
                        article.style.opacity = '1';
                        article.style.transform = 'translateY(0)';
                    }, 50);
                }, visibleCount * 100);
                visibleCount++;
            } else {
                article.style.opacity = '0';
                article.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    article.style.display = 'none';
                }, 300);
            }
        });

        // Show message if no results
        if (visibleCount === 0 && searchTerm !== '') {
            showNoResultsMessage();
        } else {
            removeNoResultsMessage();
        }
    };

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Clear search
    searchInput.addEventListener('input', (e) => {
        if (e.target.value === '') {
            articles.forEach((article, index) => {
                setTimeout(() => {
                    article.style.display = 'block';
                    setTimeout(() => {
                        article.style.opacity = '1';
                        article.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
            });
            removeNoResultsMessage();
        }
    });

    // ===== NO RESULTS MESSAGE =====
    function showNoResultsMessage() {
        removeNoResultsMessage();
        const grid = document.querySelector('.articles-grid');
        const message = document.createElement('div');
        message.className = 'no-results';
        message.innerHTML = `
            <i class="fas fa-search" style="font-size: 3rem; color: #95A5A6; margin-bottom: 20px;"></i>
            <h3 style="font-family: 'Playfair Display', serif; color: #2C3E50; margin-bottom: 10px;">No Results Found</h3>
            <p style="color: #7F8C8D;">Try adjusting your search terms or browse all articles.</p>
        `;
        message.style.cssText = `
            grid-column: 1 / -1;
            text-align: center;
            padding: 60px 20px;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s ease;
        `;
        grid.appendChild(message);
        setTimeout(() => {
            message.style.opacity = '1';
            message.style.transform = 'translateY(0)';
        }, 50);
    }

    function removeNoResultsMessage() {
        const message = document.querySelector('.no-results');
        if (message) {
            message.remove();
        }
    }


    // ===== SMOOTH SCROLL FOR ALL INTERNAL LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== HEADER SCROLL EFFECT =====
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        }
        
        lastScroll = currentScroll;
    });

    // ===== LOADING ANIMATION =====
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });

    // ===== BACK TO TOP BUTTON =====
    // Create button if it doesn't exist
    if (!document.querySelector('.back-to-top')) {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTop);

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        // Scroll to top on click
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

