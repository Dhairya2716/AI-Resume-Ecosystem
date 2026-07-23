const fs = require('fs');

async function checkLiveVercel() {
    try {
        const htmlRes = await fetch("https://ai-resume-ecosystem-builder.vercel.app/");
        const htmlText = await htmlRes.text();
        
        // Find JS bundle links
        const scriptRegex = /<script[^>]+src="([^">]+)"/g;
        let match;
        const jsFiles = [];
        while ((match = scriptRegex.exec(htmlText)) !== null) {
            jsFiles.push(match[1]);
        }
        
        console.log("Found JS files:", jsFiles);
        
        for (const file of jsFiles) {
            const jsUrl = file.startsWith('http') ? file : `https://ai-resume-ecosystem-builder.vercel.app${file}`;
            const jsRes = await fetch(jsUrl);
            const jsText = await jsRes.text();
            
            if (jsText.includes("localhost:5000")) {
                console.log(`\n❌ Found localhost:5000 in ${file}! Vercel did NOT inject the VITE_API_URL properly.`);
            }
            if (jsText.includes("resume-ai-backend-wgof.onrender.com")) {
                console.log(`\n✅ Found Render URL in ${file}! The API URL is correctly baked in.`);
            }
        }
    } catch(e) {
        console.error(e);
    }
}
checkLiveVercel();
