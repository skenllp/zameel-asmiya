# Convert hero PNG → WebP / AVIF into assets/images/hero/
# Run from project root:
#   powershell -ExecutionPolicy Bypass -File .\ExtraInfo\Backup\convert-hero.ps1

$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) '..\..')
$srcCandidates = @(
  (Join-Path $root 'assets\images\hero\hero-alt.png'),
  (Join-Path $root 'assets\images\hero\hero.png')
)
$src = $srcCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
$out = Join-Path $root 'assets\images\hero'

if (-not $src) {
  Write-Host "MISSING hero source PNG in assets/images/hero/" -ForegroundColor Red
  exit 1
}

New-Item -ItemType Directory -Force -Path $out | Out-Null
$webp = Join-Path $out 'hero.webp'
$avif = Join-Path $out 'hero.avif'

Write-Host "Source: $src ($([math]::Round((Get-Item -LiteralPath $src).Length/1KB)) KB)"

if (Get-Command magick -ErrorAction SilentlyContinue) {
  magick "$src" -strip -resize "1600x>" -quality 78 "$webp"
  magick "$src" -strip -resize "1600x>" -quality 55 "$avif"
} elseif (Get-Command ffmpeg -ErrorAction SilentlyContinue) {
  ffmpeg -y -i "$src" -vf "scale='min(1600,iw)':-2" -c:v libwebp -quality 78 "$webp"
  ffmpeg -y -i "$src" -vf "scale='min(1600,iw)':-2" -c:v libaom-av1 -crf 35 -still-picture 1 "$avif"
} else {
  Write-Host "Install ImageMagick or ffmpeg to generate WebP/AVIF." -ForegroundColor Yellow
  exit 1
}

Get-ChildItem -LiteralPath $out -Filter 'hero.*' | ForEach-Object {
  Write-Host ("  {0,-14} {1} KB" -f $_.Name, [math]::Round($_.Length/1KB))
}
