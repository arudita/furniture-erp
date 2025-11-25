<template>
    <Head title="Create New Wood" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <form @submit.prevent="submit" autocomplete="off">
            <div class="flex flex-col p-6">
                <section class="max-w-xl space-y-6">
                    <HeadingSmall title="Create New Wood" description="Ensure your account is using a long, random password to stay secure" />
                    <div class="space-y-6">
                        <div class="grid gap-2">
                            <Label for="name">Name</Label>
                            <Input id="name" name="name" v-model="form_wood.name" type="text" class="mt-1 block w-full" :class="errors?.name ? 'border-red-500': ''" placeholder="Name" required />
                            <InputError :message="errors?.name" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="description">Description</Label>
                            <Textarea id="description" name="description" v-model="form_wood.description" type="text" rows="5" class="mt-1 block w-full" :class="errors?.description ? 'border-red-500': ''" placeholder="Description" />
                            <InputError :message="errors?.description" />
                        </div>
                        <div class="flex items-center gap-4">
                            <Button :disabled="form_wood.processing" data-test="update-password-button" class="cursor-pointer">
                                <span v-if="form_wood.processing">Saving...</span>
                                <span v-else>Save</span>
                            </Button>
                            <Transition enter-active-class="transition ease-in-out" enter-from-class="opacity-0" leave-active-class="transition ease-in-out" leave-to-class="opacity-0">
                                <p v-show="form_wood.recentlySuccessful" class="text-sm text-neutral-600">
                                    Saved.
                                </p>
                            </Transition>
                        </div>
                    </div>
                </section>
            </div>
        </form>
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import HeadingSmall from '@/components/HeadingSmall.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Head, useForm } from '@inertiajs/vue3';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { BreadcrumbItem } from '@/types';
import type { WoodForm } from '@/types/wood';

defineProps({ errors: Object })

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Wood',
        href: '/wood',
    },
    {
        title: 'Create New',
        href: '#',
    },
];

const form_wood = useForm<WoodForm>({
    name: '',
    description: '',
});

const submit = () => {
    form_wood.post('/wood', { preserveScroll: true, onSuccess: () => form_wood.reset() })
}
</script>
