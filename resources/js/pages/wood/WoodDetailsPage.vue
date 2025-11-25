<template>
    <Head :title="props.data_wood.name " />
    <AppLayout :breadcrumbs="breadcrumbs">
        <form @submit.prevent="submit" v-on:finish="editMode = false" autocomplete="off">
            <div class="flex flex-col p-6">
                <section class="max-w-xl space-y-6">
                    <HeadingSmall :title="'Wood: ' + props.data_wood.name " description="Ensure your account is using a long, random password to stay secure" />
                    <div class="space-y-6">
                        <div class="grid gap-2">
                            <Label for="name">Name</Label>
                            <Input v-if="editMode" v-model="form_wood.name" id="name" name="name" type="text" class="mt-1 block w-full" :class="errors?.name ? 'border-red-500': ''" placeholder="Wood Name" />
                            <p v-else class="mt-1 block w-full leading-7 text-sm/relaxed">
                                {{ data_wood.name }}
                            </p>
                            <InputError :message="errors?.name" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="description">Description</Label>
                            <Textarea v-if="editMode" v-model="form_wood.description" id="description" name="description" type="text" rows="5" class="mt-1 block w-full" :class="errors?.description ? 'border-red-500': ''" placeholder="Description" />
                            <p v-else class="mt-1 block w-full leading-7 text-sm/relaxed">
                                {{ data_wood.description }}
                            </p>
                            <InputError :message="errors?.description" />
                        </div>
                        <div class="flex items-center gap-4">
                            <Button v-if="editMode" :disabled="form_wood.processing" class="cursor-pointer">
                                <span v-if="form_wood.processing">Saving...</span>
                                <span v-else>Save</span>
                            </Button>
                            <Button v-else @click="editMode = true" class="cursor-pointer">Edit</Button>
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
import { Head, useForm } from '@inertiajs/vue3';
import HeadingSmall from '@/components/HeadingSmall.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ref } from 'vue';
import { type BreadcrumbItem } from '@/types';
import { type Wood, WoodForm } from '@/types/wood';

const editMode = ref(false);

const props = defineProps<{
    data_wood: Wood;
    errors: Wood;
}>();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Wood',
        href: '/wood',
    },
    {
        title: props.data_wood.name,
        href: '#',
    }
];

const form_wood = useForm<WoodForm>({
    id: props.data_wood.id,
    public_id: props.data_wood.public_id,
    name: props.data_wood.name,
    description: props.data_wood.description,
})

const submit = () => {
    form_wood.put(`/wood/${props.data_wood.public_id}`, {
        preserveScroll: true,
        onSuccess: () => {
            editMode.value = false;
        }
    })
}
</script>
