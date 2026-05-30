param(
  [Parameter(Mandatory = $true)]
  [string]$InputPath,

  [Parameter(Mandatory = $true)]
  [string]$OutputPath,

  [int]$Padding = 18,
  [int]$Tolerance = 80,
  [int]$SoftTolerance = 132,
  [int]$KeyR = 0,
  [int]$KeyG = 255,
  [int]$KeyB = 0
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

function Get-ResolvedParent([string]$Path) {
  $parent = Split-Path -Parent $Path
  if ([string]::IsNullOrWhiteSpace($parent)) {
    return (Get-Location).Path
  }
  return $parent
}

function Get-ColorDistance([System.Drawing.Color]$Color, [int]$R, [int]$G, [int]$B) {
  $dr = [int]$Color.R - $R
  $dg = [int]$Color.G - $G
  $db = [int]$Color.B - $B
  return [Math]::Sqrt(($dr * $dr) + ($dg * $dg) + ($db * $db))
}

$resolvedInput = (Resolve-Path -LiteralPath $InputPath).Path
$resolvedOutputParent = Get-ResolvedParent $OutputPath
if (!(Test-Path -LiteralPath $resolvedOutputParent)) {
  New-Item -ItemType Directory -Path $resolvedOutputParent | Out-Null
}

$source = [System.Drawing.Bitmap]::new($resolvedInput)
$transparent = $null
$cropped = $null

try {
  $transparent = [System.Drawing.Bitmap]::new($source.Width, $source.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

  $minX = $source.Width
  $minY = $source.Height
  $maxX = -1
  $maxY = -1

  for ($y = 0; $y -lt $source.Height; $y++) {
    for ($x = 0; $x -lt $source.Width; $x++) {
      $c = $source.GetPixel($x, $y)
      $dist = Get-ColorDistance $c $KeyR $KeyG $KeyB

      if ($dist -le $Tolerance) {
        $alpha = 0
      } elseif ($dist -le $SoftTolerance) {
        $alpha = [int][Math]::Round(255 * (($dist - $Tolerance) / [Math]::Max(1, $SoftTolerance - $Tolerance)))
      } else {
        $alpha = 255
      }

      if ($alpha -gt 0) {
        $r = $c.R
        $g = $c.G
        $b = $c.B

        if ($KeyG -gt $KeyR -and $KeyG -gt $KeyB -and $c.G -gt $c.R -and $c.G -gt $c.B) {
          $g = [int][Math]::Min(255, [Math]::Min([int]$g, [int](($r + $b) / 2) + 28))
        } elseif ($KeyR -gt $KeyG -and $KeyB -gt $KeyG -and $c.R -gt $c.G -and $c.B -gt $c.G) {
          $r = [int][Math]::Min(255, [Math]::Min([int]$r, [int](($g + $b) / 2) + 28))
          $b = [int][Math]::Min(255, [Math]::Min([int]$b, [int](($r + $g) / 2) + 28))
        }

        $transparent.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $r, $g, $b))

        if ($alpha -gt 16) {
          if ($x -lt $minX) { $minX = $x }
          if ($y -lt $minY) { $minY = $y }
          if ($x -gt $maxX) { $maxX = $x }
          if ($y -gt $maxY) { $maxY = $y }
        }
      } else {
        $transparent.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
      }
    }
  }

  if ($maxX -lt 0 -or $maxY -lt 0) {
    throw "No foreground pixels found after chroma removal."
  }

  $cropX = [Math]::Max(0, $minX - $Padding)
  $cropY = [Math]::Max(0, $minY - $Padding)
  $cropRight = [Math]::Min($source.Width - 1, $maxX + $Padding)
  $cropBottom = [Math]::Min($source.Height - 1, $maxY + $Padding)
  $cropW = $cropRight - $cropX + 1
  $cropH = $cropBottom - $cropY + 1

  $cropped = [System.Drawing.Bitmap]::new($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($cropped)
  try {
    $graphics.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
    $srcRect = [System.Drawing.Rectangle]::new($cropX, $cropY, $cropW, $cropH)
    $dstRect = [System.Drawing.Rectangle]::new(0, 0, $cropW, $cropH)
    $graphics.DrawImage($transparent, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  } finally {
    $graphics.Dispose()
  }

  $cropped.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)

  $corner = $cropped.GetPixel(0, 0)
  Write-Output ("saved={0}" -f (Resolve-Path -LiteralPath $OutputPath).Path)
  Write-Output ("size={0}x{1}" -f $cropped.Width, $cropped.Height)
  Write-Output ("cornerAlpha={0}" -f $corner.A)
} finally {
  if ($cropped) { $cropped.Dispose() }
  if ($transparent) { $transparent.Dispose() }
  $source.Dispose()
}
