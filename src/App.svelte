<script lang="ts">
    import { onMount } from 'svelte';
    import { dia, ui, shapes, util } from '@clientio/rappid';
    import { Tabs, TabList, TabPanel, Tab } from './components/tabs';
    import { TabsData } from './tabs-data'
    import { HyperlinkHighlighter } from './hyperlink-highlighter';
    import '../node_modules/@clientio/rappid/rappid.css';


    let tabIndex = 0;

    // Create the default tab state
    const createTabState = (title: string, json?: any) => {
        const graph = new dia.Graph({ id: util.uuid() }, { cellNamespace: shapes });
        let focusPoint;
        if (json) {
            graph.fromJSON(json);
            focusPoint = graph.getBBox()?.center().toJSON();
        }
        return {
            title,
            graph,
            focusPoint
        }
    }

    let tabs = TabsData.map(({ title, json }) => createTabState(title, json));

    // Add a new tab with a new graph
    const addTab = () => {
        tabs = [...tabs, createTabState(`Tab ${tabs.length + 1}`)]
        tabIndex = tabs.length
    }

    // Remove a tab at the specified index
    const removeTab = (index) => {
        tabs = tabs.filter((_, i) => i !== index);
        tabIndex = Math.max(Math.min(index, tabs.length - 2), 0);
    }
</script>

<Tabs>
	<TabList>
		{#each tabs as tab, i }
            <Tab>
                {tab.title}
                <button
                    on:click={() => removeTab(i)}
                >x</button>
            </Tab>
        {/each}
        <button
            on:click={addTab}
        >+</button>
	</TabList>

	{#each tabs as tab, i }
        <TabPanel>
            <h2>{tab.title}</h2>
            {i}
        </TabPanel>
    {/each}
</Tabs>

<style>
</style>
