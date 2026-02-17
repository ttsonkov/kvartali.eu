# PowerShell script to generate PNG icons from SVG
# Requires: ImageMagick (install with: winget install ImageMagick.ImageMagick)

$sizes = @(72, 96, 128, 144, 192, 512)

Write-Host "Generating PNG icons from icon.svg..." -ForegroundColor Cyan

foreach ($size in $sizes) {
    $output = "icon-$size.png"
    Write-Host "  Creating $output ($size x $size)"
    magick convert -background none -resize "${size}x${size}" icon.svg $output
}

# Generate og-image.png (1200x630)
Write-Host "  Creating og-image.png (1200x630)"
magick convert -background none -resize "1200x630" og-image.svg og-image.png

# Generate screenshots (placeholder - you should replace with real screenshots)
Write-Host "  Creating screenshot1.png (540x720)"
magick convert -background "#667eea" -resize "540x720" -gravity center og-image.svg screenshot1.png

Write-Host "  Creating screenshot2.png (1024x768)"  
magick convert -background "#667eea" -resize "1024x768" -gravity center og-image.svg screenshot2.png

Write-Host "`nDone! Icons generated:" -ForegroundColor Green
Get-ChildItem -Path . -Filter "icon-*.png" | ForEach-Object { Write-Host "  $_" }
Get-ChildItem -Path . -Filter "og-image.png" | ForEach-Object { Write-Host "  $_" }
Get-ChildItem -Path . -Filter "screenshot*.png" | ForEach-Object { Write-Host "  $_" }

Write-Host "`nNote: Replace screenshot1.png and screenshot2.png with actual app screenshots." -ForegroundColor Yellow
