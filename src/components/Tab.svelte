<script>
	import { getContext } from 'svelte';
	import { TABS } from './Tabs.svelte';

	const tab = {};
	const { registerTab, selectTab, removeTab, selectedTab } = getContext(TABS);

	registerTab(tab);
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
    <button class="btn-remove" on:click="{() => removeTab(tab)}">x</button>
</button>
