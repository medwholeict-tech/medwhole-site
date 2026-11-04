# Generate Favicons from Logo using ImageMagick
# This script creates all necessary favicon sizes and formats

$logo = "public\logo-200x200 (1).png"
$outputDir = "public"

Write-Host "Generating favicons from $logo..." -ForegroundColor Green

# Create favicon.ico (multi-resolution)
Write-Host "Creating favicon.ico..." -ForegroundColor Cyan
magick $logo -define icon:auto-resize=256,128,96,64,48,32,16 "$outputDir\favicon.ico"

# Create standard favicon.png
Write-Host "Creating favicon.png (32x32)..." -ForegroundColor Cyan
magick $logo -resize 32x32 "$outputDir\favicon.png"

# Create Apple Touch Icons
Write-Host "Creating Apple Touch Icons..." -ForegroundColor Cyan
magick $logo -resize 180x180 "$outputDir\apple-touch-icon.png"
magick $logo -resize 152x152 "$outputDir\apple-touch-icon-152x152.png"
magick $logo -resize 167x167 "$outputDir\apple-touch-icon-167x167.png"
magick $logo -resize 120x120 "$outputDir\apple-touch-icon-120x120.png"

# Create Android Chrome Icons
Write-Host "Creating Android Chrome Icons..." -ForegroundColor Cyan
magick $logo -resize 192x192 "$outputDir\android-chrome-192x192.png"
magick $logo -resize 512x512 "$outputDir\android-chrome-512x512.png"

# Create Microsoft Tile Icons
Write-Host "Creating Microsoft Tile Icons..." -ForegroundColor Cyan
magick $logo -resize 150x150 "$outputDir\mstile-150x150.png"
magick $logo -resize 310x310 "$outputDir\mstile-310x310.png"

# Create Open Graph / Social Media Image (1200x630 recommended)
Write-Host "Creating Open Graph image..." -ForegroundColor Cyan
magick $logo -resize 1200x630 -background white -gravity center -extent 1200x630 "$outputDir\og-image.png"

# Create Twitter Card image (1200x600 recommended)
Write-Host "Creating Twitter Card image..." -ForegroundColor Cyan
magick $logo -resize 1200x600 -background white -gravity center -extent 1200x600 "$outputDir\twitter-card.png"

# Create logo variations
Write-Host "Creating logo variations..." -ForegroundColor Cyan
magick $logo -resize 200x200 "$outputDir\logo.png"
magick $logo -resize 400x400 "$outputDir\logo@2x.png"
magick $logo -resize 100x100 "$outputDir\logo-sm.png"

Write-Host "`nFavicons generated successfully!" -ForegroundColor Green
Write-Host "Generated files in ${outputDir}:" -ForegroundColor Yellow
Write-Host "  - favicon.ico (multi-resolution)"
Write-Host "  - favicon.png"
Write-Host "  - apple-touch-icon*.png (iOS)"
Write-Host "  - android-chrome-*.png (Android)"
Write-Host "  - mstile-*.png (Microsoft)"
Write-Host "  - og-image.png (Open Graph)"
Write-Host "  - twitter-card.png (Twitter)"
Write-Host "  - logo*.png (various sizes)"
