<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value'
    ];

    /**
     * Get the forced weather alert status, automatically clearing it if it has expired (after 24 hours).
     *
     * @return string
     */
    public static function getForcedAlert()
    {
        $forcedAlert = self::where('key', 'forced_weather_alert')->value('value') ?? 'none';
        
        if ($forcedAlert !== 'none') {
            $expiresAt = self::where('key', 'forced_weather_alert_expires_at')->value('value');
            if ($expiresAt && now()->greaterThan(\Illuminate\Support\Carbon::parse($expiresAt))) {
                self::updateOrCreate(['key' => 'forced_weather_alert'], ['value' => 'none']);
                self::updateOrCreate(['key' => 'forced_weather_alert_expires_at'], ['value' => null]);
                $forcedAlert = 'none';
            }
        }
        
        return $forcedAlert;
    }
}
