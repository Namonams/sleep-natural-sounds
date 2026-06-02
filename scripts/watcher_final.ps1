$out    = "C:\Users\Utilisateur_2\Peace's video natural\sleep-channel\output\baby-sleep-pink-noise_11h_WEB.mp4"
$log    = "C:\Users\Utilisateur_2\Peace's video natural\sleep-channel\scripts\encode.log"
$script = "C:\Users\Utilisateur_2\Peace's video natural\sleep-channel\scripts"
$prog   = "C:\Users\Utilisateur_2\Peace's video natural\sleep-channel\dashboard\progress.json"

"[WATCHER] Démarré $(Get-Date -Format 'HH:mm:ss')" | Tee-Object $script\watcher_final.log

while ($true) {
    Start-Sleep -Seconds 60

    $alive = (Get-Process ffmpeg -ErrorAction SilentlyContinue) -ne $null
    $size  = if (Test-Path $out) { [math]::Round((Get-Item $out).Length / 1GB, 2) } else { 0 }
    $lastLine = Get-Content $log -Tail 1 -ErrorAction SilentlyContinue

    $pos = "??:??:??"; $eta = 999; $pct = 0
    if ($lastLine -match 'time=(\d+):(\d+):(\d+)') {
        $pos = "$($Matches[1]):$($Matches[2]):$($Matches[3])"
        $done_s = [int]$Matches[1]*3600 + [int]$Matches[2]*60 + [int]$Matches[3]
        $pct = [math]::Min([math]::Round($done_s/39600*100, 0), 99)
        if ($lastLine -match 'speed=([\d.]+)x') {
            $spd = [double]$Matches[1]
            if ($spd -gt 0) { $eta = [math]::Round((39600 - $done_s) / $spd / 60) }
        }
    }

    $msg = "[ENCODE] $pos / 11:00:00 — $pct% — $size GB — ETA ~${eta}min — $(Get-Date -Format 'HH:mm')"
    $msg | Add-Content $script\watcher_final.log
    Set-Content $prog "{`"encode`":{`"active`":true,`"label`":`"Re-encode Pink Noise 11h — CRF28`",`"pct`":$pct,`"doneGB`":$size,`"targetGB`":6.5,`"etaMin`":$eta}}" -Encoding UTF8

    if (-not $alive) {
        "[ENCODE TERMINÉ] $size GB — $(Get-Date -Format 'HH:mm:ss')" | Add-Content $script\watcher_final.log
        break
    }
}

# Validation
$finalSize = [math]::Round((Get-Item $out).Length / 1GB, 2)
if ($finalSize -lt 3.0) {
    "[ERREUR] Fichier trop petit: $finalSize GB" | Add-Content $script\watcher_final.log
    Set-Content $prog "{`"encode`":{`"active`":false,`"label`":`"ERREUR — encode incomplet $finalSize GB`",`"pct`":0,`"doneGB`":$finalSize,`"targetGB`":6.5,`"etaMin`":0}}" -Encoding UTF8
    exit 1
}

"[VALIDATION OK] $finalSize GB" | Add-Content $script\watcher_final.log
Set-Content $prog "{`"encode`":{`"active`":false,`"label`":`"Encode terminé ✅ $finalSize GB — Upload en cours`",`"pct`":100,`"doneGB`":$finalSize,`"targetGB`":$finalSize,`"etaMin`":0}}" -Encoding UTF8

# Upload
"[UPLOAD] Lancement $(Get-Date -Format 'HH:mm:ss')" | Add-Content $script\watcher_final.log
Set-Location $script
node upload_youtube.js 2>&1 | Add-Content $script\watcher_final.log
"[DONE] $(Get-Date -Format 'HH:mm:ss')" | Add-Content $script\watcher_final.log
