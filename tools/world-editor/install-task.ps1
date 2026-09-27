# Registers the read-only Project Curse watcher for the signed-in Windows user.
# It never requests administrator rights, stores a password, or replaces another task.
$ErrorActionPreference = 'Stop'

$taskName = 'ProjectCurse-WorldEditor-ReadOnly-v1'
$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\..')).Path
$entryPoint = Join-Path $projectRoot 'tools\world-editor\cli.mjs'
$nodeCommand = Get-Command node.exe -ErrorAction Stop
$nodePath = $nodeCommand.Source
$userName = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name

if ($userName -match '\\CodexSandbox') {
  throw '샌드박스 계정에는 작업을 등록하지 않습니다. 실제 Windows 사용자 세션에서 실행하세요.'
}
if (-not (Test-Path -LiteralPath $entryPoint -PathType Leaf)) {
  throw "감시 작업 진입점을 찾지 못했습니다: $entryPoint"
}

$arguments = '"' + $entryPoint + '" watch'
$existing = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existing) {
  $matchesAction = @($existing.Actions).Count -eq 1 -and
    $existing.Actions[0].Execute -eq $nodePath -and
    $existing.Actions[0].Arguments -eq $arguments -and
    $existing.Actions[0].WorkingDirectory -eq $projectRoot
  # Task Scheduler may save the local account as FORYOUCOM rather than HOST\FORYOUCOM.
  $existingSid = (New-Object System.Security.Principal.NTAccount($existing.Principal.UserId)).Translate([System.Security.Principal.SecurityIdentifier]).Value
  $matchesUser = $existingSid -eq [System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value
  if (-not ($matchesAction -and $matchesUser)) {
    throw "같은 이름의 다른 작업이 이미 있습니다. 덮어쓰지 않습니다: $taskName"
  }
  if ($existing.State -eq 'Disabled') {
    throw "기존 작업이 사용 안 함 상태입니다. 임의로 켜지 않습니다: $taskName"
  }
  Write-Output "기존 작업을 유지합니다: $taskName"
} else {
  $action = New-ScheduledTaskAction -Execute $nodePath -Argument $arguments -WorkingDirectory $projectRoot
  $atLogon = New-ScheduledTaskTrigger -AtLogOn -User $userName
  $daily = New-ScheduledTaskTrigger -Daily -At '09:00'
  $principal = New-ScheduledTaskPrincipal -UserId $userName -LogonType Interactive -RunLevel Limited
  $settings = New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Seconds 0) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 5)
  Register-ScheduledTask -TaskName $taskName -Description 'Project Curse local source audit and approved-source discovery; no AI, canon edits, publishing, or external uploads.' -Action $action -Trigger @($atLogon, $daily) -Principal $principal -Settings $settings | Out-Null
  Write-Output "새 작업을 등록했습니다: $taskName (로그온 시 및 매일 09:00, 현재 사용자 세션)"
}

$current = Get-ScheduledTask -TaskName $taskName -ErrorAction Stop
if ($current.State -ne 'Running') {
  Start-ScheduledTask -TaskName $taskName -ErrorAction Stop
  Write-Output '감시 작업을 지금 시작했습니다.'
} else {
  Write-Output '감시 작업이 이미 실행 중입니다.'
}

$current = Get-ScheduledTask -TaskName $taskName -ErrorAction Stop
Write-Output ([pscustomobject]@{
  task = $current.TaskName
  state = [string]$current.State
  user = $current.Principal.UserId
  node = $current.Actions[0].Execute
  arguments = $current.Actions[0].Arguments
  workingDirectory = $current.Actions[0].WorkingDirectory
})
