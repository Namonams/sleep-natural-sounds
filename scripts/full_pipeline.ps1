param(
    [string]$VideoFile  = "",
    [string]$AudioFile  = "",
    [string]$OutputName = "",
    [int]$Hours         = 10
)
$ErrorActionPreference = "Continue"
$Root = Split-Path $PSScriptRoot -Parent
function Write-Step($msg) { Write-Host "  $msg" -ForegroundColor Cyan }
function Write-OK($msg)   { Write-Host "  OK  $msg" -ForegroundColor Green }
function Write-Err($msg)  { Write-Host "  ERR $msg" -ForegroundColor Red; exit 1 }
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    $ff = Get-ChildItem (Join-Path $Root "tools") -Recurse -Filter "ffmpeg.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($ff) { $env:PATH = "$($ff.DirectoryName);$env:PATH" }
    else { Write-Host "FFmpeg introuvable." -ForegroundColor Red; exit 1 }
}
Write-Host "================================================" -ForegroundColor DarkCyan
Write-Host "   SLEEP CHANNEL -- PIPELINE ${Hours}H" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor DarkCyan
if (-not $VideoFile) {
    Write-Host "[1/3] Video source (ex: assets\audio\videonoise.mp4):" -ForegroundColor Yellow
    $VideoFile = (Read-Host "  >").Trim()
}
if (-not [System.IO.Path]::IsPathRooted($VideoFile)) { $VideoFile = Join-Path $Root $VideoFile }
if (-not (Test-Path $VideoFile)) { Write-Err "Video introuvable: $VideoFile" }
Write-OK "Video: $VideoFile"
if (-not $AudioFile) {
    Write-Host "[2/3] Audio source (ex: assets\audio\son.mp3):" -ForegroundColor Yellow
    $AudioFile = (Read-Host "  >").Trim()
}
if (-not [System.IO.Path]::IsPathRooted($AudioFile)) { $AudioFile = Join-Path $Root $AudioFile }
if (-not (Test-Path $AudioFile)) { Write-Err "Audio introuvable: $AudioFile" }
Write-OK "Audio: $AudioFile"
if (-not $OutputName) {
    Write-Host "[3/3] Nom slug (ex: baby-sleep-pink-noise):" -ForegroundColor Yellow
    $OutputName = (Read-Host "  >").Trim() -replace '[^a-zA-Z0-9\-_]', '-'
}
Write-OK "Nom: $OutputName"
$OutDir      = Join-Path $Root "output"
if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }
$TmpDir      = "C:\tmp_sleep"
New-Item -ItemType Directory -Force -Path $TmpDir | Out-Null
$TargetSec   = $Hours * 3600
$LoopedAudio = "$TmpDir\aloop.mp3"
$FinalOutput = Join-Path $OutDir "${OutputName}_${Hours}h_FINAL.mp4"
$ListFile    = "$TmpDir\list.txt"
$TmpVideo    = "$TmpDir\vid.mp4"
$TmpAudio    = "$TmpDir\aud.mp3"
$StartTime   = Get-Date
# ── PREFLIGHT — analyse source avant tout ──────────────────────────────────
Write-Host "PREFLIGHT -- analyse sources..." -ForegroundColor Yellow
$probeV  = ffprobe -v quiet -print_format json -show_streams -show_format "$VideoFile" 2>&1 | Out-String | ConvertFrom-Json
$vstreamP = $probeV.streams | Where-Object { $_.codec_type -eq "video" } | Select-Object -First 1
$SrcBitrate = 0; $SrcFPS = 0; $SrcDurPre = 0
if ($vstreamP) {
    if ($vstreamP.bit_rate) { $SrcBitrate = [math]::Round([int64]$vstreamP.bit_rate / 1000) }
    elseif ($probeV.format.bit_rate) { $SrcBitrate = [math]::Round([int64]$probeV.format.bit_rate / 1000) }
    if ($vstreamP.r_frame_rate -match '(\d+)/(\d+)') { $SrcFPS = [math]::Round([int]$Matches[1]/[int]$Matches[2],1) }
    if ($vstreamP.duration) { $SrcDurPre = [math]::Round([double]$vstreamP.duration) }
}
# Décision encode vs copy
$NeedsEncode = ($SrcBitrate -gt 1500) -or ($SrcFPS -gt 30)
$TargetBitrate = if ($NeedsEncode) { 800 } else { $SrcBitrate }
$EstimatedGB = [math]::Round(($TargetBitrate * 1000 + 192000) * $TargetSec / 8 / 1GB, 1)
$DiskFree = [math]::Round((Get-PSDrive C).Free / 1GB, 1)
Write-Host "  Source video : ${SrcBitrate} kbps / ${SrcFPS} fps" -ForegroundColor Cyan
Write-Host "  Encode       : $(if($NeedsEncode){'OUI — CRF28/24fps (source trop lourde)'}else{'NON — copy (source OK)'})" -ForegroundColor Cyan
Write-Host "  Output estimé: ~${EstimatedGB} GB" -ForegroundColor Cyan
Write-Host "  Disk libre   : ${DiskFree} GB" -ForegroundColor Cyan
if ($DiskFree -lt ($EstimatedGB + 5)) { Write-Err "Disk insuffisant: ${DiskFree} GB libre, besoin ~$($EstimatedGB+5) GB" }
Write-OK "Preflight OK — on continue"
# ────────────────────────────────────────────────────────────────────────────

Write-Host "DEMARRAGE -- $Hours heures ($TargetSec sec)" -ForegroundColor White
Write-Step "[0/3] Copie sources..."
Copy-Item $VideoFile $TmpVideo -Force
Copy-Item $AudioFile $TmpAudio -Force
Write-OK "OK"
Write-Step "[1/3] Analyse duree video..."
$probe   = ffprobe -v quiet -print_format json -show_streams "$TmpVideo" 2>&1
$json    = $probe | Out-String | ConvertFrom-Json
$vstream = $json.streams | Where-Object { $_.codec_type -eq "video" } | Select-Object -First 1
$SrcDur  = 0
if ($vstream -and $vstream.duration) { $SrcDur = [math]::Round([double]$vstream.duration) }
if ($SrcDur -le 0) {
    $fmtjson = (ffprobe -v quiet -print_format json -show_format "$TmpVideo" 2>&1 | Out-String | ConvertFrom-Json)
    if ($fmtjson.format -and $fmtjson.format.duration) { $SrcDur = [math]::Round([double]$fmtjson.format.duration) }
}
if ($SrcDur -le 0) { $SrcDur = [int](Read-Host "  Duree source en secondes") }
Write-OK "Duree: ${SrcDur}s"
Write-Step "[2/3] Loudnorm source (5min) puis boucle 11h..."
$volLines = & ffmpeg -i "$TmpAudio" -af "volumedetect" -f null - 2>&1
$meanLine = $volLines | Where-Object { $_ -match "mean_volume" } | Select-Object -First 1
if ($meanLine) { Write-Host "  $meanLine" -ForegroundColor Cyan }
# Etape 2a: loudnorm sur source courte uniquement (~10 sec)
$NormSource = "$TmpDir\norm_src.mp3"
Write-Host "  Normalisation source courte..." -ForegroundColor Gray
$loudErr = ffmpeg -i "$TmpAudio" `
    -af "loudnorm=I=-14:TP=-1.5:LRA=11" `
    -c:a libmp3lame -b:a 192k "$NormSource" -y 2>&1
if (-not (Test-Path $NormSource) -or (Get-Item $NormSource).Length -lt 1000) {
    Write-Host "  FFmpeg stderr: $($loudErr | Select-Object -Last 5 | Out-String)" -ForegroundColor Red
    Write-Err "Echec loudnorm source"
}
Write-OK "Source normalisee: $NormSource"
# Etape 2b: boucle sans re-encodage (copy) = rapide
Write-Host "  Boucle 11h en cours (copy)..." -ForegroundColor Gray
$loopErr = ffmpeg -stream_loop -1 -i "$NormSource" -t $TargetSec `
    -c:a copy "$LoopedAudio" -y 2>&1
if (-not (Test-Path $LoopedAudio) -or (Get-Item $LoopedAudio).Length -lt 1000) {
    Write-Host "  FFmpeg stderr: $($loopErr | Select-Object -Last 5 | Out-String)" -ForegroundColor Red
    Write-Err "Echec boucle audio"
}
Write-OK "Audio normalise -14 LUFS: $LoopedAudio"
Write-Step "[3/3] Concat video + mux audio -> output final..."
if ($NeedsEncode) { Write-Host "  Video: encode CRF28/24fps (source $SrcBitrate kbps/$SrcFPS fps)" -ForegroundColor Gray }
else              { Write-Host "  Video: copy stream (source OK)" -ForegroundColor Gray }
$Repeats   = [math]::Ceiling($TargetSec / $SrcDur) + 2
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$listLines = @()
for ($i = 0; $i -lt $Repeats; $i++) { $listLines += "file 'C:/tmp_sleep/vid.mp4'" }
[System.IO.File]::WriteAllText($ListFile, ($listLines -join "`n"), $utf8NoBom)
Write-Host "  Repetitions video: $Repeats -- fusion directe sans intermediaire..." -ForegroundColor Gray
if ($NeedsEncode) {
    ffmpeg -f concat -safe 0 -i "$ListFile" `
           -i "$LoopedAudio" `
           -map 0:v:0 -map 1:a:0 `
           -c:v libx264 -crf 28 -preset fast -r 24 `
           -c:a copy `
           -t $TargetSec `
           "$FinalOutput" -y 2>&1 | Out-Null
} else {
    ffmpeg -f concat -safe 0 -i "$ListFile" `
           -i "$LoopedAudio" `
           -map 0:v:0 -map 1:a:0 `
           -c:v copy -c:a copy `
           -t $TargetSec `
           "$FinalOutput" -y 2>&1 | Out-Null
}
if (-not (Test-Path $FinalOutput)) { Write-Err "Echec fusion finale" }
$FileSizeGB = [math]::Round((Get-Item $FinalOutput).Length / 1GB, 2)
$Elapsed    = [math]::Round(((Get-Date) - $StartTime).TotalMinutes, 1)
Write-Host "================================================" -ForegroundColor DarkGreen
Write-Host "   PIPELINE TERMINE !" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor DarkGreen
Write-Host "  Fichier : $FinalOutput" -ForegroundColor White
Write-Host "  Taille  : $FileSizeGB GB" -ForegroundColor White
Write-Host "  Duree   : $Elapsed min" -ForegroundColor White
Write-Host "  -> YouTube Studio upload" -ForegroundColor Yellow