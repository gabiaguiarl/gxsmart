# GX Smart — publica o site (dist/) no subdominio novo.gxsmart.com.br via FTPS (Hostinger).
# Uso: dois cliques em publicar.cmd   |   so gerar o pacote, sem enviar: publicar.cmd -SemEnviar
# Seguranca: a senha FTP e pedida a cada execucao, nao aparece na tela e nunca e gravada.
#            Host e usuario ficam em publicar.config (local, ignorado pelo Git).
param([switch]$SemEnviar)
$ErrorActionPreference = 'Stop'

$root    = Split-Path -Parent $MyInvocation.MyCommand.Path
$dist    = Join-Path $root 'dist'
$cfgPath = Join-Path $root 'publicar.config'
$stage   = Join-Path $env:TEMP 'gxsmart-publicar'
$site    = 'https://novo.gxsmart.com.br'

function Titulo($t) { Write-Host ''; Write-Host "== $t" -ForegroundColor Magenta }
function Falha($t)  { Write-Host ''; Write-Host "ERRO: $t" -ForegroundColor Red; exit 1 }

# ---------------------------------------------------------------- 1. Pacote
Titulo 'Montando o pacote a partir de dist/'
if (-not (Test-Path (Join-Path $dist 'index.html'))) { Falha "dist/index.html nao encontrado em $dist" }

# Fica de fora: backups (.before-*), imagens de referencia/origem e capturas antigas do portfolio
# (o portfolio agora usa assets/clients/*.webp).
$foraNome = @('studio.png','presenter-source.png','samsara.png','fenix.png','mdg.png','area.png','loja-fenix.png','vdm.png')
$arquivos = Get-ChildItem -Path $dist -Recurse -File -Force | Where-Object {
  $_.Name -notlike '*.before-*' -and $_.Name -notlike '*-reference.png' -and
  -not ($foraNome -contains $_.Name -and $_.DirectoryName -notlike '*\clients')
}
if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Path $stage | Out-Null
foreach ($f in $arquivos) {
  $rel = $f.FullName.Substring($dist.Length + 1)
  $dst = Join-Path $stage $rel
  New-Item -ItemType Directory -Force -Path (Split-Path $dst) | Out-Null
  Copy-Item $f.FullName $dst
}
$total = ($arquivos | Measure-Object Length -Sum)
Write-Host ("{0} arquivos, {1:N0} KB  ->  {2}" -f $total.Count, ($total.Sum / 1KB), $stage)
if (-not (Test-Path (Join-Path $stage '.htaccess'))) { Write-Host 'Aviso: dist/.htaccess nao encontrado (HTTPS/cache nao serao configurados).' -ForegroundColor Yellow }

if ($SemEnviar) { Write-Host ''; Write-Host 'Modo -SemEnviar: pacote gerado, nada foi enviado.' -ForegroundColor Green; exit 0 }

# ---------------------------------------------------------------- 2. Configuracao (sem senha)
$cfg = @{}
if (Test-Path $cfgPath) {
  Get-Content $cfgPath | Where-Object { $_ -match '^\s*([A-Z_]+)\s*=\s*(.*)$' } | ForEach-Object { $cfg[$matches[1]] = $matches[2].Trim() }
}
if (-not $cfg.FTP_HOST -or -not $cfg.FTP_USER) {
  Titulo 'Primeira configuracao (hPanel > Arquivos > Contas FTP)'
  if (-not $cfg.FTP_HOST) { $cfg.FTP_HOST = (Read-Host 'Host FTP (ex.: ftp.gxsmart.com.br ou o IP mostrado no hPanel)').Trim() }
  if (-not $cfg.FTP_USER) { $cfg.FTP_USER = (Read-Host 'Usuario FTP (ex.: u123456789)').Trim() }
  @("# Configuracao local de publicacao - NAO coloque a senha aqui.",
    "FTP_HOST=$($cfg.FTP_HOST)", "FTP_USER=$($cfg.FTP_USER)",
    "# Pasta remota opcional. Vazio = detectar (public_html/novo).", "REMOTE_DIR=$($cfg.REMOTE_DIR)") |
    Set-Content -Path $cfgPath -Encoding UTF8
  Write-Host "Salvo em publicar.config (sem senha)."
}
$ftpHost = $cfg.FTP_HOST -replace '^(ftps?://)', '' -replace '/+$', ''

# ---------------------------------------------------------------- 3. Senha (somente em memoria)
Titulo "Conectando a $ftpHost como $($cfg.FTP_USER)"
$sec   = Read-Host 'Senha FTP (nao aparece na tela)' -AsSecureString
$bstr  = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
$plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
# Arquivo de config temporario do curl (evita a senha na linha de comando); apagado no final.
$curlCfg = Join-Path $env:TEMP ("gx-" + [guid]::NewGuid().ToString('N') + '.cfg')
$esc = ("$($cfg.FTP_USER):$plain") -replace '\\', '\\\\' -replace '"', '\"'
[IO.File]::WriteAllText($curlCfg, "user = `"$esc`"`n", (New-Object Text.UTF8Encoding $false))
$plain = $null; $esc = $null
$curl = Join-Path $env:SystemRoot 'System32\curl.exe'

function Explica($code) {
  switch ($code) {
    67 { 'Login recusado: confira usuario e senha em hPanel > Arquivos > Contas FTP.' }
    6  { 'Host nao encontrado: confira FTP_HOST em publicar.config.' }
    7  { 'Nao foi possivel conectar ao host (porta 21). Confira FTP_HOST ou a rede.' }
    28 { 'Tempo esgotado na conexao.' }
    64 { 'O servidor nao aceitou FTP seguro (TLS). O envio foi interrompido para nao mandar a senha sem criptografia.' }
    9  { 'Pasta remota sem permissao ou inexistente: ajuste REMOTE_DIR em publicar.config.' }
    default { "curl retornou o codigo $code." }
  }
}

$codigo = 0
try {
  # ------------------------------------------------------------ 4. Pasta remota
  $remote = $cfg.REMOTE_DIR
  if (-not $remote) {
    $lista = & $curl -sS --ssl-reqd --connect-timeout 15 -K $curlCfg --list-only "ftp://$ftpHost/" 2>&1
    if ($LASTEXITCODE -ne 0) { throw (Explica $LASTEXITCODE) }
    $remote = if ($lista -match '^public_html\s*$') { '/public_html/novo' } else { '/novo' }
  }
  $remote = '/' + $remote.Trim('/')
  Write-Host "Conexao OK. Destino: $remote"

  $ok = Read-Host ("Enviar {0} arquivos para {1} ({2})? [S/N]" -f $total.Count, $remote, $site)
  if ($ok -notmatch '^[sS]') { Write-Host 'Cancelado. Nada foi enviado.'; return }

  # ------------------------------------------------------------ 5. Envio
  Titulo 'Enviando'
  $lista = Get-ChildItem -Path $stage -Recurse -File -Force
  $i = 0
  foreach ($f in $lista) {
    $i++
    $rel = $f.FullName.Substring($stage.Length + 1) -replace '\\', '/'
    Write-Host ("[{0,2}/{1}] {2}" -f $i, $lista.Count, $rel)
    & $curl -sS --ssl-reqd --connect-timeout 15 -K $curlCfg --ftp-create-dirs --retry 2 -T $f.FullName "ftp://$ftpHost$remote/$rel"
    if ($LASTEXITCODE -ne 0) { throw ("Falhou em $rel. " + (Explica $LASTEXITCODE)) }
  }
  Write-Host ''
  Write-Host "Publicado: $site  (se aparecer versao antiga, Ctrl+F5)" -ForegroundColor Green
}
catch {
  Write-Host ''; Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red; $codigo = 1
}
finally {
  # A senha so existiu neste arquivo temporario: removido sempre, com ou sem erro.
  if (Test-Path $curlCfg) { Remove-Item $curlCfg -Force }
}
exit $codigo
