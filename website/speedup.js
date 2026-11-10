const fs = require('fs');
const path = require('path');

function replaceInFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInFiles(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            // Tailwind CSS classes
            content = content.replace(/duration-700/g, 'duration-300');
            content = content.replace(/duration-500/g, 'duration-200');
            content = content.replace(/duration-400/g, 'duration-150');
            content = content.replace(/duration-300/g, 'duration-150');
            
            // Framer motion durations
            content = content.replace(/duration:\s*0\.8/g, 'duration: 0.3');
            content = content.replace(/duration:\s*0\.7/g, 'duration: 0.3');
            content = content.replace(/duration:\s*0\.6/g, 'duration: 0.25');
            content = content.replace(/duration:\s*0\.5/g, 'duration: 0.2');
            content = content.replace(/duration:\s*0\.4/g, 'duration: 0.15');
            content = content.replace(/duration:\s*0\.3/g, 'duration: 0.15');

            // Reduce delays as well so they appear faster
            content = content.replace(/delay:\s*0\.4/g, 'delay: 0.15');
            content = content.replace(/delay:\s*0\.3/g, 'delay: 0.1');
            content = content.replace(/delay:\s*0\.2/g, 'delay: 0.1');
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

replaceInFiles('./src');
console.log('Done speeding up animations!');
