<?php

namespace App\Support;

/**
 * Just enough user-agent parsing for the order admin: device type, OS and
 * browser as a person would name them. Not exhaustive — unknowns fall back to
 * "Other".
 */
class UserAgent
{
    public function __construct(private readonly ?string $ua) {}

    public static function parse(?string $ua): self
    {
        return new self($ua);
    }

    public function device(): string
    {
        $ua = (string) $this->ua;

        if ($ua === '') {
            return 'Unknown';
        }

        if (preg_match('/iPad|Tablet|Android(?!.*Mobile)/i', $ua)) {
            return 'Tablet';
        }

        return preg_match('/Mobi|iPhone|iPod|Android|Windows Phone/i', $ua) ? 'Mobile' : 'Desktop';
    }

    public function os(): string
    {
        $ua = (string) $this->ua;

        return match (true) {
            $ua === '' => 'Unknown',
            (bool) preg_match('/Android ([\d.]+)/', $ua, $m) => 'Android '.$m[1],
            (bool) preg_match('/(?:iPhone|iPad|iPod).*? OS ([\d_]+)/', $ua, $m) => 'iOS '.str_replace('_', '.', $m[1]),
            (bool) preg_match('/Windows NT 10/', $ua) => 'Windows 10/11',
            (bool) preg_match('/Windows/', $ua) => 'Windows',
            (bool) preg_match('/Mac OS X ([\d_]+)/', $ua, $m) => 'macOS '.str_replace('_', '.', $m[1]),
            (bool) preg_match('/CrOS/', $ua) => 'ChromeOS',
            (bool) preg_match('/Linux/', $ua) => 'Linux',
            default => 'Other',
        };
    }

    public function browser(): string
    {
        $ua = (string) $this->ua;

        // Order matters: in-app browsers and Chromium forks also claim to be
        // Chrome/Safari, so they're checked first.
        return match (true) {
            $ua === '' => 'Unknown',
            (bool) preg_match('/FBAN|FBAV|FB_IAB/', $ua) => 'Facebook in-app',
            (bool) preg_match('/Instagram/', $ua) => 'Instagram in-app',
            (bool) preg_match('/Messenger|MessengerForiOS/', $ua) => 'Messenger in-app',
            (bool) preg_match('/SamsungBrowser\/([\d]+)/', $ua, $m) => 'Samsung Internet '.$m[1],
            (bool) preg_match('/EdgA?\/([\d]+)/', $ua, $m) => 'Edge '.$m[1],
            (bool) preg_match('/OPR\/([\d]+)|Opera/', $ua, $m) => 'Opera'.(isset($m[1]) ? ' '.$m[1] : ''),
            (bool) preg_match('/UCBrowser\/([\d]+)/', $ua, $m) => 'UC Browser '.$m[1],
            (bool) preg_match('/(?:Firefox|FxiOS)\/([\d]+)/', $ua, $m) => 'Firefox '.$m[1],
            (bool) preg_match('/(?:Chrome|CriOS)\/([\d]+)/', $ua, $m) => 'Chrome '.$m[1],
            (bool) preg_match('/Version\/([\d]+).*Safari/', $ua, $m) => 'Safari '.$m[1],
            default => 'Other',
        };
    }
}
