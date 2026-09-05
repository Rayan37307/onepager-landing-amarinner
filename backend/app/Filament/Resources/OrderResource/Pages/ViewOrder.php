<?php

namespace App\Filament\Resources\OrderResource\Pages;

use App\Enums\OrderStatus;
use App\Filament\Resources\OrderResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewOrder extends ViewRecord
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        $statusActions = collect(OrderStatus::cases())
            ->map(fn (OrderStatus $status) => Actions\Action::make('status_'.$status->value)
                ->label('Mark as '.$status->label())
                ->color($status->color())
                ->requiresConfirmation()
                ->visible(fn () => in_array($status, $this->record->status->nextStatuses(), true))
                ->action(function () use ($status) {
                    $this->record->transitionTo($status);
                    $this->refreshFormData(['status']);
                }))
            ->all();

        return [
            ...$statusActions,
            Actions\EditAction::make(),
        ];
    }
}
