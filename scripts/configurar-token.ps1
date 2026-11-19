<#
  Configura (uma unica vez) o token da API da Hostinger para o publicar.cmd do GX Smart.
  O token fica so neste computador, em .env.hostinger-api (fora do Git e do zip).
#>
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$arquivo = Join-Path $root '.env.hostinger-api'

Write-Host @"

Token da API da Hostinger
-------------------------
1. Abra  https://hpanel.hostinger.com/api  (logado na conta DONA do site)
2. Clique em  Gerar token de API , de um nome (ex.: deploy-gxsmart) e copie o token
3. Cole aqui embaixo (o texto fica oculto) e aperte Enter

"@ -ForegroundColor Cyan

$seguro = Read-Host 'Token' -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($seguro)
try { $valor = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr).Trim() }
finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
if (-not $valor) { throw 'Nenhum token informado.' }

[IO.File]::WriteAllText($arquivo, "HOSTINGER_API_TOKEN=$valor`r`n", (New-Object Text.UTF8Encoding($false)))
Remove-Variable valor

Write-Host "`nToken salvo em .env.hostinger-api. Testando o acesso ao site..." -ForegroundColor Cyan
& node.exe (Join-Path $PSScriptRoot 'hostinger-publicar.mjs') --check
if ($LASTEXITCODE -ne 0) {
  Remove-Item $arquivo -Force
  Write-Host "`nO token NAO foi aceito e foi descartado. Veja a mensagem acima." -ForegroundColor Red
  exit 1
}
Write-Host "`nTudo pronto! Agora e so dar dois cliques em publicar.cmd." -ForegroundColor Green
