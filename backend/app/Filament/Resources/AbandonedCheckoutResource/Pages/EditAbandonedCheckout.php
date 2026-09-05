<?php

namespace App\Filament\Resources\AbandonedCheckoutResource\Pages;

use App\Filament\Resources\AbandonedCheckoutResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditAbandonedCheckout extends EditRecord
{
    protected static string $resource = AbandonedCheckoutResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
}
