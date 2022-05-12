<script lang="ts">
    import { Tabs, TabList, TabPanel, Tab } from './components/tabs';
    import Graph from './components/Graph.svelte';
    import { HyperlinkHighlighter } from './hyperlink-highlighter';
    import '../node_modules/@clientio/rappid/rappid.css';

    import {tabStore} from './store';

    let tabs;

    tabStore.subscribe((val) => {
        tabs = val;
        console.log(val)
    });

</script>

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

<style>
</style>
