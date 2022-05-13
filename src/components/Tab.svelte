<script>
	import { getContext, onMount } from 'svelte';
    import { ui } from '@clientio/rappid';
	import { TABS } from './Tabs.svelte';

	const tab = {};
	const { registerTab, selectTab, removeTab, selectedTab } = getContext(TABS);

	registerTab(tab);

    export let title;

    onMount(async () => {
        const app = document.querySelector('.app');

        new ui.Tooltip({
            theme: 'material',
            rootTarget: app,
            container: app,
            target: '[data-tooltip]',
            direction: ui.Tooltip.TooltipArrowPosition.Auto,
            position: ui.Tooltip.TooltipPosition.Top,
            padding: 10,
            animation: true
        });
	});
</script>

<style>
	.btn {
		background: none;
		border: none;
		border-bottom: 2px solid white;
		border-radius: 0;
		margin: 0;
		/* color: #ccc; */
        padding: 6px 12px;
        cursor: pointer;
	}
	
	.selected {
		border-bottom: 2px solid teal;
		color: #333;
	}
</style>

<button class="btn" class:selected="{$selectedTab === tab}" on:click="{() => selectTab(tab)}">
	<slot></slot>
    <button class="btn-remove" on:click="{() => removeTab(tab)}" data-tooltip={`Remove ${title} tab`} data-tooltip-position="top">x</button>
</button>
