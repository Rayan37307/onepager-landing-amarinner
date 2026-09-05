<?php

namespace App\Filament\Resources\AbandonedCheckoutResource\Pages;

use App\Filament\Resources\AbandonedCheckoutResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewAbandonedCheckout extends ViewRecord
{
    protected static string $resource = AbandonedCheckoutResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
