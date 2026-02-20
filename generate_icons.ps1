
$srcPath = "src"
$lucidePath = "node_modules/lucide-react/dist/esm/icons"
$outputPath = "src/components/Icons.jsx"

# Regex to find imports
$importRegex = "import\s+\{([^}]+)\}\s+from\s+'lucide-react'"

# Find all used icons
$usedIcons = @()
Get-ChildItem -Path $srcPath -Recurse -Filter *.jsx | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match $importRegex) {
        $matches = [regex]::Matches($content, $importRegex)
        foreach ($match in $matches) {
            $imports = $match.Groups[1].Value
            $imports -split ',' | ForEach-Object {
                $iconName = $_.Trim()
                if ($iconName -match " as ") {
                    $iconName = ($iconName -split " as ")[0].Trim()
                }
                if ($iconName -ne "") {
                    $usedIcons += $iconName
                }
            }
        }
    }
}

$uniqueIcons = $usedIcons | Select-Object -Unique | Sort-Object

Write-Host "Found $($uniqueIcons.Count) unique icons."

# Start building Icons.jsx
$header = @"
import React, { forwardRef, createElement } from 'react';

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "`$1-`$2").toLowerCase();

const createLucideIcon = (iconName, iconNode) => {
  const Component = forwardRef(
    ({ color = "currentColor", size = 24, strokeWidth = 2, absoluteStrokeWidth, children, ...rest }, ref) => createElement(
      "svg",
      {
        ref,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: `lucide lucide-${toKebabCase(iconName)}`,
        fill: "none",
        strokeLinecap: "round", 
        strokeLinejoin: "round",
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => createElement(tag, { ...attrs, key: attrs.key })),
        ...(Array.isArray(children) ? children : [children]) || []
      ]
    )
  );
  Component.displayName = `${iconName}`;
  return Component;
};

"@

$body = ""

foreach ($icon in $uniqueIcons) {
    # Convert PascalCase to kebab-case
    $kebab = $icon -creplace '([a-z])([A-Z])', '$1-$2'
    $kebab = $kebab.ToLower()
    
    # Special cases handling if regex replace fails for complex names
    # e.g. "CheckCircle2" -> "check-circle-2"
    
    $mjsFile = Join-Path $lucidePath "$kebab.mjs"
    
    if (-not (Test-Path $mjsFile)) {
        # Try numbering handling? e.g. "Clock1" -> "clock-1"
        $kebab = $icon -creplace '([a-z])([0-9])', '$1-$2'
        $kebab = $kebab -creplace '([a-z])([A-Z])', '$1-$2'
        $kebab = $kebab.ToLower()
        $mjsFile = Join-Path $lucidePath "$kebab.mjs"
    }

    if (Test-Path $mjsFile) {
        $content = Get-Content $mjsFile -Raw
        # Extract the array content
        # Pattern: createLucideIcon("Name", [ ... ])
        # We need to extract the [ ... ] part.
        
        if ($content -match 'createLucideIcon\("[^"]+",\s*(\[[\s\S]*?\])\);') {
            $iconData = $matches[1]
            $body += "export const $icon = createLucideIcon(`"$icon`", $iconData);`n"
        }
        else {
            Write-Host "Could not parse content for $icon in $mjsFile"
        }
    }
    else {
        Write-Host "File not found for icon: $icon (tried $kebab.mjs)"
    }
}

$finalContent = $header + $body
Set-Content -Path $outputPath -Value $finalContent -Encoding UTF8
Write-Host "Generated $outputPath"
