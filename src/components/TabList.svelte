<script>
    import { getContext } from 'svelte';
	import { TABS } from './Tabs.svelte';

    const { addTab } = getContext(TABS);
</script>

<div class="tab-list">
	<slot></slot>
    <button on:click="{() => addTab()}">+</button>
</div>

<style>
	.tab-list {
		border-bottom: 1px solid teal;
	}
</style>
