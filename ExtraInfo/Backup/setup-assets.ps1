# ------------------------------------------------------------
#  Optional helper — copies/normalises production assets.
#  Run from the project root:
#      powershell -ExecutionPolicy Bypass -File .\ExtraInfo\Backup\setup-assets.ps1
# ------------------------------------------------------------

$root  = Resolve-Path (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) '..\..')
Set-Location -LiteralPath $root

$coverOut = Join-Path $root 'assets\images\cover'
$heroOut  = Join-Path $root 'assets\images\hero'
$vidOut   = Join-Path $root 'assets\video'
$galOut   = Join-Path $root 'assets\images\gallery'
$decOut   = Join-Path $root 'assets\images\decorations'

New-Item -ItemType Directory -Force -Path $coverOut, $heroOut, $vidOut, $galOut, $decOut | Out-Null

Write-Host "Project root: $root" -ForegroundColor Cyan
Write-Host "Expected production files:" -ForegroundColor Cyan
Write-Host "  assets/images/cover/cover.png"
Write-Host "  assets/images/hero/hero.png  (and/or hero-alt.png)"
Write-Host "  assets/video/invitation-reveal.mp4"
Write-Host ""
Write-Host "Cover : $(Test-Path (Join-Path $coverOut 'cover.png'))"
Write-Host "Hero  : $(Test-Path (Join-Path $heroOut 'hero.png')) / alt $(Test-Path (Join-Path $heroOut 'hero-alt.png'))"
Write-Host "Video : $(Test-Path (Join-Path $vidOut 'invitation-reveal.mp4'))"
