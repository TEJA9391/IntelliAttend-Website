const fs = require('fs');
const path = 'src/app/login/[role]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const startIdx = content.indexOf('type RoutePoint = {');
const endIdx = content.indexOf('const SignInCard =');
const block = content.substring(startIdx, endIdx);

content = content.replace(block, '');
content = content.replace('import Image from "next/image";', 'import Image from "next/image";\nimport { DotMap } from "@/components/ui/DotMap";');

fs.writeFileSync(path, content);

const dotMapComponent = `"use client";\n\nimport React, { useRef, useEffect, useState } from "react";\n\nexport ` + block.replace('const DotMap = ', 'const DotMap = ');

fs.writeFileSync('src/components/ui/DotMap.tsx', dotMapComponent);
console.log('Extraction complete');
