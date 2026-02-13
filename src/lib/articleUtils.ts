export const cleanArticleContent = (htmlContent: string): string => {
    let content = htmlContent;

    // Replace Wikipedia links with local links
    content = content.replace(/<a.*?href="https:\/\/.*?\.wikipedia\.org\/wiki\/(.*?)".*?>(.*?)<\/a>/g, (match, p1, p2) => {
        if (p1.includes("File:")) {
            return match;
        }
        return `<a href="https://en.wikipedia.org/wiki/${p1}" target="_blank" rel="noopener noreferrer">:${p2}</a>`;
    });

    // Parse HTML to manipulate DOM
    const doc = new DOMParser().parseFromString(content, 'text/html');

    // Selectors to remove
    const selectorsToRemove = [
        'table.sidebar',
        '.metadata',
        '.side-box',
        '.side-box-flex',
        '[role="navigation"]',
        '#External_links'
    ];

    selectorsToRemove.forEach(selector => {
        const elements = doc.querySelectorAll(selector);
        elements.forEach(el => el.remove());
    });

    // Also remove using regex for some specific patterns from original code if beneficial, 
    // but DOMParser is usually safer and sufficient. 
    // Sticking to DOMParser result for consistency.

    return doc.body.innerHTML;
};

export const decodeArticleTitle = (title: string): string => {
    return decodeURI(title).replace(/_/g, ' ');
};
