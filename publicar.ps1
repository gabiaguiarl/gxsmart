<#
  GX Smart - publica o site (dist/) em https://novo.gxsmart.com.br pela API oficial da Hostinger
  (mesmo metodo do projeto MDG: token da API, sem FTP, IP ou pasta).
    1. monta o pacote a partir de dist/ (sem backups, referencias e capturas antigas);
    2. gera o .zip;
    3. envia e publica com scripts/hostinger-publicar.mjs (substitui o conteudo atual do subdominio).

  Uso:  dois cliques em publicar.cmd          publica (pede confirmacao)
        publicar.cmd -SemEnviar               so gera o pacote/zip
  Token: configurar-token.cmd (uma vez). Fica em .env.hostinger-api, fora do Git e do zip.
#>
param([switch]$SemEnviar)
$ErrorActionPreference = 'Stop'

$root    = Split-Path -Parent $MyInvocation.MyCommand.Path
$dist    = Join-Path $root 'dist'
$stage   = Join-Path $env:TEMP 'gxsmart-publicar'
$domain  = 'novo.gxsmart.com.br'
$token   = Join-Path $root '.env.hostinger-api'
$mdgTok  = Join-Path $env:USERPROFILE 'Desktop\site-mdg\.env.hostinger-api'

function Titulo($t) { Write-Host ''; Write-Host "== $t" -ForegroundColor Magenta }
function Falha($t)  { Write-Host ''; Write-Host "ERRO: $t" -ForegroundColor Red; exit 1 }

# ---------------------------------------------------------------- 1. Pacote
Titulo 'Montando o pacote a partir de dist/'
if (-not (Test-Path (Join-Path $dist 'index.html'))) { Falha "dist/index.html nao encontrado em $dist" }
# Fora: backups (.before-*), imagens de referencia/origem e capturas antigas do portfolio (agora assets/clients/*.webp).
$foraNome = @('studio.png','presenter-source.png','samsara.png','fenix.png','mdg.png','area.png','loja-fenix.png','vdm.png')
$arquivos = Get-ChildItem -Path $dist -Recurse -File -Force | Where-Object {
  $_.Name -notlike '*.before-*' -and $_.Name -notlike '*-reference.png' -and
  -not ($foraNome -contains $_.Name -and $_.DirectoryName -notlike '*\clients')
}
if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Path $stage | Out-Null
foreach ($f in $arquivos) {
  $dst = Join-Path $stage $f.FullName.Substring($dist.Length + 1)
  New-Item -ItemType Directory -Force -Path (Split-Path $dst) | Out-Null
  Copy-Item $f.FullName $dst
}
$total = ($arquivos | Measure-Object Length -Sum)
Write-Host ("{0} arquivos, {1:N0} KB" -f $total.Count, ($total.Sum / 1KB))

# ---------------------------------------------------------------- 2. Zip (barras normais, index.html na raiz)
$zip = Join-Path $env:TEMP ("gxsmart-novo_" + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.zip')
Push-Location $stage
try {
  $itens = @(Get-ChildItem -Force | ForEach-Object { $_.Name })
  & (Join-Path $env:SystemRoot 'System32\tar.exe') -a -c -f $zip @itens
  if ($LASTEXITCODE -ne 0) { Falha 'Nao foi possivel gerar o zip.' }
} finally { Pop-Location }
Write-Host ("Zip: {0} ({1:N0} KB)" -f $zip, ((Get-Item $zip).Length / 1KB))
if ($SemEnviar) { Write-Host ''; Write-Host 'Modo -SemEnviar: pacote gerado, nada foi publicado.' -ForegroundColor Green; exit 0 }

# ---------------------------------------------------------------- 3. Token da API
if (-not (Test-Path $token)) {
  if (Test-Path $mdgTok) {
    Titulo 'Token da Hostinger'
    Write-Host 'Este projeto ainda nao tem token. O projeto MDG ja tem um token da mesma conta Hostinger.'
    $r = Read-Host 'Usar o mesmo token do MDG neste projeto? [S/N]'
    if ($r -match '^[sS]') { Copy-Item $mdgTok $token; Write-Host 'Token copiado para .env.hostinger-api (fora do Git).' }
  }
  if (-not (Test-Path $token)) { Falha 'Token da Hostinger nao configurado. Rode configurar-token.cmd e depois publicar.cmd de novo.' }
}
if (-not (Get-Command node.exe -ErrorAction SilentlyContinue)) { Falha 'Node.js nao encontrado (necessario para o envio).' }
$deploy = Join-Path $root 'scripts\hostinger-publicar.mjs'

& node.exe $deploy --check
if ($LASTEXITCODE -ne 0) { Falha 'O token nao acessa o site. Veja a mensagem acima.' }

# ---------------------------------------------------------------- 4. Confirmacao e publicacao
Write-Host ''
$ok = Read-Host "Publicar em https://$domain? Isso substitui o conteudo atual do subdominio. [S/N]"
if ($ok -notmatch '^[sS]') { Write-Host 'Cancelado. Nada foi publicado.'; exit 0 }
& node.exe $deploy $zip
if ($LASTEXITCODE -ne 0) { Falha 'A publicacao falhou. O site continua como estava.' }
Remove-Item $zip -Force -ErrorAction SilentlyContinue
