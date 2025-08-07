// Script to extract content from all pages and create unified SPA
const fs = require('fs');
const path = require('path');

// List of all page files to process
const pageFiles = [
    'pages/research-questions.html',
    'pages/intersecting-fields.html', 
    'pages/historical-lineage.html',
    'pages/community-practice.html',
    'pages/situated-technology.html',
    'pages/methods.html',
    'pages/challenge.html'
];

function extractPageContent(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract styles between <style> and </style>
    const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
    const styles = styleMatch ? styleMatch[1] : '';
    
    // Extract body content between <body> and </body>, excluding navigation and scripts
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/);
    let bodyContent = bodyMatch ? bodyMatch[1] : '';
    
    // Remove navigation section
    bodyContent = bodyContent.replace(/<nav[\s\S]*?<\/nav>/g, '');
    
    // Remove script tags
    bodyContent = bodyContent.replace(/<script[\s\S]*?<\/script>/g, '');
    
    // Fix image paths (remove ../ since we'll be in root)
    bodyContent = bodyContent.replace(/\.\.\/images\//g, 'images/');
    
    return {
        styles,
        content: bodyContent.trim()
    };
}

// Extract content from all pages
const extractedPages = {};
pageFiles.forEach(filePath => {
    const pageName = path.basename(filePath, '.html');
    extractedPages[pageName] = extractPageContent(filePath);
    console.log(`Extracted content from ${filePath}`);
});

// Write extracted content to JSON for inspection
fs.writeFileSync('extracted-content.json', JSON.stringify(extractedPages, null, 2));
console.log('Extraction complete! Check extracted-content.json');