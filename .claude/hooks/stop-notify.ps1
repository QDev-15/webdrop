Add-Type -AssemblyName PresentationFramework, PresentationCore, WindowsBase

function Play-Tone {
    param([double]$Hz, [int]$Ms, [double]$Vol = 0.88)
    try {
        $sr  = 44100
        $n   = [int]($sr * $Ms / 1000)
        $ms  = New-Object System.IO.MemoryStream
        $bw  = New-Object System.IO.BinaryWriter -ArgumentList $ms
        # WAV header
        $bw.Write([byte[]][char[]]'RIFF'); $bw.Write([int](36 + $n * 2))
        $bw.Write([byte[]][char[]]'WAVE')
        $bw.Write([byte[]][char[]]'fmt '); $bw.Write([int]16)
        $bw.Write([int16]1); $bw.Write([int16]1)
        $bw.Write([int]$sr); $bw.Write([int]($sr * 2))
        $bw.Write([int16]2); $bw.Write([int16]16)
        $bw.Write([byte[]][char[]]'data'); $bw.Write([int]($n * 2))
        $dur = $Ms / 1000.0
        for ($i = 0; $i -lt $n; $i++) {
            $t   = $i / $sr
            $env = if ($t -lt 0.01) { $t / 0.01 }
                   elseif ($t -gt ($dur - 0.06)) { [Math]::Max(0.0, ($dur - $t) / 0.06) }
                   else { 1.0 }
            $v   = [int](32767 * $Vol * $env * [Math]::Sin(2 * [Math]::PI * $Hz * $t))
            $bw.Write([int16][Math]::Max(-32768, [Math]::Min(32767, $v)))
        }
        $bw.Flush()
        $ms.Position = 0
        $sp = New-Object System.Media.SoundPlayer -ArgumentList $ms
        $sp.PlaySync()
        $sp.Dispose()
        $ms.Dispose()
    } catch {
        try { [console]::Beep([int]$Hz, $Ms) } catch {}
    }
}

# Ting ting: E6 -> C6
Play-Tone 1318 220 1.0
Start-Sleep -Milliseconds 140
Play-Tone 1047 300 1.0

# WPF popup tu tat sau 3 giay
$xaml = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        WindowStyle="None" AllowsTransparency="True" Background="Transparent"
        Topmost="True" ShowInTaskbar="False" SizeToContent="WidthAndHeight"
        WindowStartupLocation="CenterScreen">
    <Border Background="#E8202020" CornerRadius="14" Padding="38,18,38,18"
            BorderBrush="#444444" BorderThickness="1">
        <Border.Effect>
            <DropShadowEffect BlurRadius="22" ShadowDepth="4" Color="Black" Opacity="0.55"/>
        </Border.Effect>
        <StackPanel Orientation="Horizontal" VerticalAlignment="Center">
            <TextBlock x:Name="icon" Text="&#x2713; " Foreground="#4FC95A"
                       FontSize="21" FontWeight="Bold" FontFamily="Segoe UI"
                       VerticalAlignment="Center"/>
            <TextBlock x:Name="msg" Foreground="White"
                       FontSize="18" FontWeight="SemiBold" FontFamily="Segoe UI"
                       VerticalAlignment="Center"/>
        </StackPanel>
    </Border>
</Window>
'@

$reader = [System.Xml.XmlReader]::Create((New-Object System.IO.StringReader $xaml))
$window = [System.Windows.Markup.XamlReader]::Load($reader)
$window.FindName("msg").Text = "Webdrop Claude " + [char]0x0111 + [char]0x00E3 + " ho" + [char]0x00E0 + "n th" + [char]0x00E0 + "nh t" + [char]0x00E1 + "c v" + [char]0x1EE5

$timer = New-Object System.Windows.Threading.DispatcherTimer
$timer.Interval = [TimeSpan]::FromSeconds(3)
$timer.add_Tick({ $window.Close(); $timer.Stop() })
$window.add_Loaded({ $timer.Start() })
$window.ShowDialog() | Out-Null
