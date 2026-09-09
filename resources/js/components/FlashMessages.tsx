import { useEffect } from 'react';
import { toast } from 'sonner';
import { usePage } from '@inertiajs/react';

type FlashProps = {
    success?: string;
    error?: string;
};

export default function FlashMessages() {
    const { flash } = usePage<{ flash?: FlashProps }>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return null;
}