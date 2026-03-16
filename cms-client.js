document.addEventListener('DOMContentLoaded', () => {
    const cmsElements = document.querySelectorAll('[data-cms]');
    
    fetch('/content.json')
        .then(response => response.json())
        .then(data => {
            cmsElements.forEach(el => {
                const path = el.getAttribute('data-cms').split('.');
                let val = data;
                for (const key of path) {
                    if (val[key] === undefined) {
                        val = null;
                        break;
                    }
                    val = val[key];
                }
                
                if (val !== null) {
                    if (el.tagName === 'A' && el.getAttribute('data-cms-attr') === 'href') {
                        el.href = (el.href.startsWith('mailto:') ? 'mailto:' : (el.href.startsWith('tel:') ? 'tel:' : '')) + val;
                    } else if (el.getAttribute('data-cms-attr') === 'src') {
                      el.src = val;
                    } else {
                        el.innerText = val;
                    }
                }
            });
        })
        .catch(err => console.error('Error loading CMS content:', err));
});
