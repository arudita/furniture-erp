import { InertiaLinkProps } from '@inertiajs/vue3';
import { Updater } from '@tanstack/vue-table';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Ref } from 'vue';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function urlIsActive(
    urlToCheck: NonNullable<InertiaLinkProps['href']>,
    currentUrl: string,
) {
    const menuUrl = toUrl(urlToCheck);

    if (menuUrl === currentUrl) {
        return true;
    }

    if (currentUrl.startsWith(menuUrl + '/')) {
        const strictMatchUrls = [
            '/category/create',
            '/category/archived',
            '/product/create',
            '/product/archived',
            '/project/create',
            '/project/archived',
            '/wood/create',
            '/wood/archived',
        ];

        if (menuUrl === '/category') {
            const isChildRouteWithStrictMatch = strictMatchUrls.includes(currentUrl);
            if (isChildRouteWithStrictMatch) {
                return false;
            }
        }

        if (menuUrl === '/product') {
            const isChildRouteWithStrictMatch = strictMatchUrls.includes(currentUrl);
            if (isChildRouteWithStrictMatch) {
                return false;
            }
        }

        if (menuUrl === '/project') {
            const isChildRouteWithStrictMatch = strictMatchUrls.includes(currentUrl);
            if (isChildRouteWithStrictMatch) {
                return false;
            }
        }

        if (menuUrl === '/wood') {
            const isChildRouteWithStrictMatch = strictMatchUrls.includes(currentUrl);
            if (isChildRouteWithStrictMatch) {
                return false;
            }
        }

        return true;
    }

    return false;

    // return toUrl(urlToCheck) === currentUrl;
}

export function toUrl(href: NonNullable<InertiaLinkProps['href']>) {
    return typeof href === 'string' ? href : href?.url;
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function'
    ? updaterOrValue(ref.value)
    : updaterOrValue
}
