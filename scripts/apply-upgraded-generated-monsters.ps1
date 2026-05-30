param(
  [string]$GeneratedDir = "$env:USERPROFILE\.codex\generated_images\019e546b-2791-73d3-b4b6-c340225f6ada",
  [datetime]$Since = [datetime]"2026-05-23 20:00:45",
  [string]$CosmodrakeOverride = ""
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$outRoot = Join-Path $root "public\monsters"

Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;

public static class FastChromaKey
{
    public static void Process(string inputPath, string outputPath, int padding, int tolerance, int softTolerance, int keyR, int keyG, int keyB)
    {
        using (var loaded = new Bitmap(inputPath))
        using (var source = new Bitmap(loaded.Width, loaded.Height, PixelFormat.Format32bppArgb))
        {
            using (var g = Graphics.FromImage(source))
            {
                g.Clear(Color.Transparent);
                g.DrawImage(loaded, 0, 0, loaded.Width, loaded.Height);
            }

            int width = source.Width;
            int height = source.Height;
            var rect = new Rectangle(0, 0, width, height);
            var data = source.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            int stride = data.Stride;
            int byteCount = Math.Abs(stride) * height;
            byte[] src = new byte[byteCount];
            Marshal.Copy(data.Scan0, src, 0, byteCount);
            source.UnlockBits(data);

            byte[] dst = new byte[byteCount];
            int minX = width;
            int minY = height;
            int maxX = -1;
            int maxY = -1;

            for (int y = 0; y < height; y++)
            {
                int row = y * stride;
                for (int x = 0; x < width; x++)
                {
                    int idx = row + x * 4;
                    int b = src[idx + 0];
                    int g = src[idx + 1];
                    int r = src[idx + 2];
                    int a = src[idx + 3];

                    double dr = r - keyR;
                    double dg = g - keyG;
                    double db = b - keyB;
                    double dist = Math.Sqrt(dr * dr + dg * dg + db * db);

                    int alpha;
                    if (dist <= tolerance)
                    {
                        alpha = 0;
                    }
                    else if (dist <= softTolerance)
                    {
                        alpha = (int)Math.Round(255.0 * ((dist - tolerance) / Math.Max(1, softTolerance - tolerance)));
                    }
                    else
                    {
                        alpha = 255;
                    }

                    alpha = Math.Min(alpha, a);

                    if (alpha > 0)
                    {
                        int outR = r;
                        int outG = g;
                        int outB = b;

                        if (keyG > keyR && keyG > keyB && g > r && g > b)
                        {
                            outG = Math.Min(outG, ((outR + outB) / 2) + 28);
                        }
                        else if (keyR > keyG && keyB > keyG && r > g && b > g)
                        {
                            outR = Math.Min(outR, ((outG + outB) / 2) + 28);
                            outB = Math.Min(outB, ((outR + outG) / 2) + 28);
                        }

                        dst[idx + 0] = (byte)outB;
                        dst[idx + 1] = (byte)outG;
                        dst[idx + 2] = (byte)outR;
                        dst[idx + 3] = (byte)alpha;

                        if (alpha > 16)
                        {
                            if (x < minX) minX = x;
                            if (y < minY) minY = y;
                            if (x > maxX) maxX = x;
                            if (y > maxY) maxY = y;
                        }
                    }
                }
            }

            if (maxX < 0 || maxY < 0)
            {
                throw new Exception("No foreground pixels found after chroma removal: " + inputPath);
            }

            using (var transparent = new Bitmap(width, height, PixelFormat.Format32bppArgb))
            {
                var outData = transparent.LockBits(rect, ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
                Marshal.Copy(dst, 0, outData.Scan0, byteCount);
                transparent.UnlockBits(outData);

                int cropX = Math.Max(0, minX - padding);
                int cropY = Math.Max(0, minY - padding);
                int cropRight = Math.Min(width - 1, maxX + padding);
                int cropBottom = Math.Min(height - 1, maxY + padding);
                int cropW = cropRight - cropX + 1;
                int cropH = cropBottom - cropY + 1;

                Directory.CreateDirectory(Path.GetDirectoryName(outputPath));
                using (var cropped = new Bitmap(cropW, cropH, PixelFormat.Format32bppArgb))
                using (var cropGraphics = Graphics.FromImage(cropped))
                {
                    cropGraphics.Clear(Color.Transparent);
                    cropGraphics.DrawImage(
                        transparent,
                        new Rectangle(0, 0, cropW, cropH),
                        new Rectangle(cropX, cropY, cropW, cropH),
                        GraphicsUnit.Pixel
                    );
                    cropped.Save(outputPath, ImageFormat.Png);
                }
            }
        }
    }
}
"@

$stages = @(
  @{ line = "bolt"; id = "zaplet"; key = "green" },
  @{ line = "bolt"; id = "thundermew"; key = "green" },
  @{ line = "bolt"; id = "voltiger"; key = "green" },
  @{ line = "star"; id = "stardust"; key = "green" },
  @{ line = "star"; id = "cosmeling"; key = "green" },
  @{ line = "star"; id = "galaxion"; key = "green" },
  @{ line = "psychic"; id = "psykit"; key = "green" },
  @{ line = "psychic"; id = "mindra"; key = "green" },
  @{ line = "psychic"; id = "cerebron"; key = "green" },
  @{ line = "crystal"; id = "shimlit"; key = "green" },
  @{ line = "crystal"; id = "prismite"; key = "green" },
  @{ line = "crystal"; id = "crystalith"; key = "green" },
  @{ line = "dragon"; id = "drakeling"; key = "green" },
  @{ line = "dragon"; id = "scalefang"; key = "green" },
  @{ line = "dragon"; id = "wyrmking"; key = "green" },
  @{ line = "nature"; id = "larvix"; key = "green" },
  @{ line = "nature"; id = "chrysaming"; key = "green" },
  @{ line = "nature"; id = "motheron"; key = "green" },
  @{ line = "lava"; id = "magmite"; key = "green" },
  @{ line = "lava"; id = "inferite"; key = "green" },
  @{ line = "lava"; id = "volcanix"; key = "green" },
  @{ line = "ancient"; id = "fossilt"; key = "green" },
  @{ line = "ancient"; id = "archaeon"; key = "green" },
  @{ line = "ancient"; id = "titanwrex"; key = "green" },
  @{ line = "cosmic"; id = "voidpup"; key = "green" },
  @{ line = "cosmic"; id = "nebulark"; key = "green" },
  @{ line = "cosmic"; id = "cosmodrake"; key = "green" },
  @{ line = "dream"; id = "drowzee"; key = "green" },
  @{ line = "dream"; id = "slumbear"; key = "green" },
  @{ line = "dream"; id = "dreamon"; key = "green" },
  @{ line = "dino"; id = "dinkit"; key = "magenta" },
  @{ line = "dino"; id = "roarex"; key = "magenta" },
  @{ line = "dino"; id = "terrex"; key = "magenta" },
  @{ line = "angel"; id = "halowing"; key = "green" },
  @{ line = "angel"; id = "wingard"; key = "green" },
  @{ line = "angel"; id = "seraphon"; key = "green" },
  @{ line = "music"; id = "lyrito"; key = "green" },
  @{ line = "music"; id = "melodew"; key = "green" },
  @{ line = "music"; id = "symphox"; key = "green" },
  @{ line = "dark"; id = "shadaowolf"; key = "green" },
  @{ line = "dark"; id = "nightfang"; key = "green" },
  @{ line = "dark"; id = "voidhowl"; key = "green" },
  @{ line = "mech"; id = "boltchick"; key = "green" },
  @{ line = "mech"; id = "gearbot"; key = "green" },
  @{ line = "mech"; id = "titanmech"; key = "green" },
  @{ line = "cloud"; id = "pufflet"; key = "green" },
  @{ line = "cloud"; id = "nimbus"; key = "green" },
  @{ line = "cloud"; id = "stormcloud"; key = "green" },
  @{ line = "lava2"; id = "magpup"; key = "green" },
  @{ line = "lava2"; id = "moltenk9"; key = "green" },
  @{ line = "lava2"; id = "volcanovex"; key = "green" },
  @{ line = "crystal2"; id = "gemkit"; key = "green" },
  @{ line = "crystal2"; id = "prismark"; key = "green" },
  @{ line = "crystal2"; id = "diamondra"; key = "green" }
)

$files = Get-ChildItem -LiteralPath $GeneratedDir -File -Filter *.png |
  Where-Object { $_.LastWriteTime -ge $Since } |
  Sort-Object LastWriteTime

if (!$CosmodrakeOverride -and $files.Count -ne $stages.Count) {
  throw "Expected $($stages.Count) generated files, found $($files.Count)."
}

if ($CosmodrakeOverride -and $files.Count -lt $stages.Count) {
  throw "Expected at least $($stages.Count) generated files, found $($files.Count)."
}

$overrideFile = if ($CosmodrakeOverride) { Get-Item -LiteralPath $CosmodrakeOverride } else { $null }

for ($i = 0; $i -lt $stages.Count; $i++) {
  $stage = $stages[$i]
  $file = if ($overrideFile -and $stage.id -eq "cosmodrake") { $overrideFile } else { $files[$i] }
  $lineDir = Join-Path $outRoot $stage.line
  $sourceDir = Join-Path $lineDir "_source"
  New-Item -ItemType Directory -Path $sourceDir -Force | Out-Null

  $sourcePath = Join-Path $sourceDir "$($stage.id)-chroma.png"
  $finalPath = Join-Path $lineDir "$($stage.id).png"
  Copy-Item -LiteralPath $file.FullName -Destination $sourcePath -Force

  if ($stage.key -eq "magenta") {
    [FastChromaKey]::Process($sourcePath, $finalPath, 28, 80, 132, 255, 0, 255)
  } else {
    [FastChromaKey]::Process($sourcePath, $finalPath, 28, 80, 132, 0, 255, 0)
  }

  Write-Output ("{0}/{1} <= {2}" -f $stage.line, $stage.id, $file.Name)
}
