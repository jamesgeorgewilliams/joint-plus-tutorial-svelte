<script lang="ts">
    import { Tabs, TabList, TabPanel, Tab } from './components/tabs';
    import Graph from './components/Graph.svelte';
    import { tabStore } from './store';
    import '../node_modules/@clientio/rappid/rappid.css';

    let tabs;

    tabStore.subscribe((store) => {
        tabs = store;
    });

</script>

<div class="app">
    <Tabs>
        <TabList>
            {#each tabs as tab }
                <Tab>
                    {tab.title}
                </Tab>
            {/each}
        </TabList>
        {#each tabs as tab, i }
            <TabPanel>
                <Graph index={i}></Graph>
                {tab.title}
            </TabPanel>
        {/each}
    </Tabs>
</div>

<style>
</style>
