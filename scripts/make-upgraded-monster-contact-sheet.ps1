param(
  [string]$OutputPath = "output\playwright\upgraded-monsters-contact-sheet.png"
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$outputFull = Join-Path $root $OutputPath
$outputDir = Split-Path -Parent $outputFull
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

$rows = @(
  @("bolt", "zaplet", "thundermew", "voltiger"),
  @("star", "stardust", "cosmeling", "galaxion"),
  @("psychic", "psykit", "mindra", "cerebron"),
  @("crystal", "shimlit", "prismite", "crystalith"),
  @("dragon", "drakeling", "scalefang", "wyrmking"),
  @("nature", "larvix", "chrysaming", "motheron"),
  @("lava", "magmite", "inferite", "volcanix"),
  @("ancient", "fossilt", "archaeon", "titanwrex"),
  @("cosmic", "voidpup", "nebulark", "cosmodrake"),
  @("dream", "drowzee", "slumbear", "dreamon"),
  @("dino", "dinkit", "roarex", "terrex"),
  @("angel", "halowing", "wingard", "seraphon"),
  @("music", "lyrito", "melodew", "symphox"),
  @("dark", "shadaowolf", "nightfang", "voidhowl"),
  @("mech", "boltchick", "gearbot", "titanmech"),
  @("cloud", "pufflet", "nimbus", "stormcloud"),
  @("lava2", "magpup", "moltenk9", "volcanovex"),
  @("crystal2", "gemkit", "prismark", "diamondra"),
  @("grovehart", "budhoof", "thornhart", "eldercrown"),
  @("flutterbug", "nibblet", "glomoth", "prismarip"),
  @("cactusaur", "prickletot", "saguaromp", "oasisaur"),
  @("frogspell", "ribblet", "bogglyph", "chantoad"),
  @("ramcloud", "woolwisp", "galegrove", "tempestag"),
  @("crystowl", "glimhoot", "oracrix", "luminoracle")
)

$cellW = 220
$cellH = 210
$labelH = 26
$lineW = 90
$sheetW = $lineW + $cellW * 3
$sheetH = $rows.Count * ($cellH + $labelH)

$sheet = [System.Drawing.Bitmap]::new($sheetW, $sheetH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($sheet)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.Clear([System.Drawing.Color]::FromArgb(255, 246, 241, 229))

$font = [System.Drawing.Font]::new("Arial", 11, [System.Drawing.FontStyle]::Bold)
$smallFont = [System.Drawing.Font]::new("Arial", 9, [System.Drawing.FontStyle]::Regular)
$brush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 38, 45, 56))
$gridPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(80, 120, 120, 120), 1)

try {
  for ($r = 0; $r -lt $rows.Count; $r++) {
    $line = $rows[$r][0]
    $y = $r * ($cellH + $labelH)
    $g.DrawString($line, $font, $brush, 8, $y + 82)
    for ($c = 1; $c -le 3; $c++) {
      $id = $rows[$r][$c]
      $x = $lineW + ($c - 1) * $cellW
      $g.DrawRectangle($gridPen, $x, $y, $cellW - 1, $cellH + $labelH - 1)
      $path = Join-Path $root "public\monsters\$line\$id.png"
      $img = [System.Drawing.Bitmap]::new($path)
      try {
        $scale = [Math]::Min(($cellW - 24) / $img.Width, ($cellH - 24) / $img.Height)
        $w = [int]($img.Width * $scale)
        $h = [int]($img.Height * $scale)
        $dx = $x + [int](($cellW - $w) / 2)
        $dy = $y + [int](($cellH - $h) / 2)
        $g.DrawImage($img, $dx, $dy, $w, $h)
      } finally {
        $img.Dispose()
      }
      $g.DrawString($id, $smallFont, $brush, $x + 8, $y + $cellH + 4)
    }
  }
  $sheet.Save($outputFull, [System.Drawing.Imaging.ImageFormat]::Png)
  Write-Output $outputFull
} finally {
  $gridPen.Dispose()
  $brush.Dispose()
  $smallFont.Dispose()
  $font.Dispose()
  $g.Dispose()
  $sheet.Dispose()
}
